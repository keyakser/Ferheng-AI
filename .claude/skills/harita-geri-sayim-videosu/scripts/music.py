"""Telifsiz, özgün fon müziği üretir: telli çalgı (Karplus-Strong) melodisi + dem + darbuka/def ritmi.

Kullanım:
  python music.py --out music.wav --duration 60 [--mode hicaz|rast|nihavend|ussak|major] [--bpm 104] [--seed 7]

Ses, yumuşak sıkıştırmayla ~-12 dB ortalama seviyeye getirilir (telefonda net duyulur).
Videoya koyduktan sonra `ffmpeg -i video.mp4 -vn -af volumedetect -f null -` ile kontrol edin.
Gereken paketler: numpy
"""
import argparse, wave
import numpy as np

MODES = {  # sent cinsinden dizi (tonik = 0), 2 oktav civarı
    'hicaz':    [0, 112, 386, 498, 702, 814, 996, 1200, 1312, 1586],
    'rast':     [0, 204, 355, 498, 702, 906, 1055, 1200, 1404, 1555],
    'nihavend': [0, 204, 294, 498, 702, 792, 1088, 1200, 1404, 1494],
    'ussak':    [0, 150, 294, 498, 702, 792, 996, 1200, 1350, 1494],
    'major':    [0, 204, 386, 498, 702, 884, 1088, 1200, 1404, 1586],
}
MOTIFS = [
    [(4, 1), (3, .5), (2, .5), (1, 1), (0, 1)],
    [(0, .5), (1, .5), (2, 1), (3, .5), (4, .5), (5, 1)],
    [(7, 1), (6, .5), (5, .5), (4, 1), (2, 1)],
    [(4, .5), (5, .5), (4, .5), (3, .5), (2, 1), (1, .5), (0, .5)],
    [(2, .5), (3, .5), (4, 1), (7, 1), (8, 1)],
    [(8, .5), (7, .5), (6, .5), (5, .5), (4, 2)],
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default='music.wav')
    ap.add_argument('--duration', type=float, default=60)
    ap.add_argument('--mode', default='hicaz', choices=MODES)
    ap.add_argument('--bpm', type=float, default=104)
    ap.add_argument('--tonic', type=float, default=293.66, help='Hz (varsayılan Re4)')
    ap.add_argument('--seed', type=int, default=7)
    a = ap.parse_args()

    SR, DUR = 44100, a.duration
    beat = 60 / a.bpm
    N = int(SR * DUR)
    out = np.zeros((N, 2))
    rng = np.random.default_rng(a.seed)

    def add(sig, t0, pan=0.0, gain=1.0):
        i = int(t0 * SR)
        if i >= N: return
        sig = sig[:N - i] * gain
        out[i:i + len(sig), 0] += sig * (1 - pan) / 2 * 2 ** .5
        out[i:i + len(sig), 1] += sig * (1 + pan) / 2 * 2 ** .5

    def pluck(freq, dur=0.6):
        n, p = int(SR * dur), max(2, int(SR / freq))
        buf, y = rng.uniform(-1, 1, p), np.empty(int(SR * dur))
        for k in range(n):
            y[k] = buf[k % p]
            buf[k % p] = 0.996 * 0.5 * (buf[k % p] + buf[(k + 1) % p])
        return y * np.exp(-np.linspace(0, 3, n))

    def drum(kind):
        n = int(SR * (0.35 if kind == 'dum' else 0.12)); t = np.arange(n) / SR
        if kind == 'dum':
            f = 70 + 90 * np.exp(-t * 30)
            return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
        return (0.6 * rng.uniform(-1, 1, n) + 0.5 * np.sin(2 * np.pi * 420 * t)) * np.exp(-t * 45) * 0.6

    T = a.tonic
    scale = [T * 2 ** (c / 1200) for c in MODES[a.mode]]
    t = np.arange(N) / SR
    env = np.clip(t / 3, 0, 1) * np.clip((DUR - t) / 3, 0, 1)
    drone = (np.sin(2 * np.pi * T / 2 * t) + .5 * np.sin(2 * np.pi * T * 3 / 4 * t) + .25 * np.sin(2 * np.pi * T * t)) \
        * (0.7 + 0.3 * np.sin(2 * np.pi * 0.15 * t)) * env * 0.09
    out[:, 0] += drone; out[:, 1] += drone

    pattern = [('dum', 0), ('tek', .75), ('dum', 1.5), ('tek', 2), ('tek', 3), ('tek', 3.5)]
    bars = int((DUR - 3) / (4 * beat))
    DUM, TEK = drum('dum'), drum('tek')
    for b in range(bars):
        for kind, off in pattern:
            add(DUM if kind == 'dum' else TEK, b * 4 * beat + off * beat, pan=0 if kind == 'dum' else .25, gain=.8 if kind == 'dum' else .5)
        if b % 4 == 3:
            for k in range(4): add(TEK, b * 4 * beat + 3 * beat + k * beat / 4, pan=-.2, gain=.25)
        if b: add(pluck(T / 2 if b % 2 else T * 3 / 8, 1.2), b * 4 * beat, pan=.3, gain=.45)

    order, tt, k = [0, 1, 2, 3, 0, 4, 5, 3], 0.25, 0
    while tt < DUR - 3:
        for deg, ln in MOTIFS[order[k % len(order)]]:
            if tt >= DUR - 3: break
            add(pluck(scale[deg], .9), tt, pan=-.25, gain=.85)
            add(pluck(scale[deg] * 2, .5), tt + .012, pan=.3, gain=.25)
            if ln >= 1: add(pluck(scale[deg], .4), tt + beat / 2, pan=-.3, gain=.22)
            tt += ln * beat
        k += 1

    out *= np.clip((DUR - t) / 2.5, 0, 1)[:, None]
    out /= np.percentile(np.abs(out), 99.5)
    out = np.tanh(out * 1.1) / np.tanh(1.1) * 0.93
    with wave.open(a.out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((out * 32767).astype(np.int16).tobytes())
    print('müzik yazıldı:', a.out, f'{DUR:.0f} sn, {a.mode}, {a.bpm} bpm')


if __name__ == '__main__':
    main()
