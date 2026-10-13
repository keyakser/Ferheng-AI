"""Videonun konusuna uygun, her seferinde özgün (telifsiz) fon müziği üretir.

Kullanım (önerilen — config.json'dan süre, sahne zamanları ve konu okunur):
  python music.py --config WORK/config.json --out WORK/music.wav
  python music.py --config WORK/config.json --out WORK/music.wav --style urban   # stili elle seç
  python music.py --list-styles

Eski kullanım da çalışır:
  python music.py --out music.wav --duration 60 --mode hicaz --bpm 104

Nasıl bağlama uyar:
  * Stil: config.music.style > --style > konu kelimelerinden otomatik seçim (STYLE_KEYWORDS).
  * Özgünlük: tohum (seed) başlık + öğe adlarından türetilir → her videoda farklı melodi, ton ve doku.
  * Senkron: tempo, her sahne tam sayıda ölçü sürecek şekilde ayarlanır; sahne geçişlerinde vurgu
    (zil/darbuka geçişi/darbe), girişte yükselen ses, finalde ek katman ve yavaş kapanış.
Gereken paketler: numpy
"""
import argparse, hashlib, json, math, re, wave
import numpy as np

SR = 44100

# ---------------- stiller ----------------
STYLES = {
    'anadolu':   dict(desc='Saz/bağlama + dem + darbuka/def (Hicaz, Uşşak, Rast…) — yöresel yemek, çarşı, tarihi çarşı, Doğu/Güneydoğu şehirleri',
                      bpm=104, modes=['hicaz', 'ussak', 'rast', 'huseyni'], harmony='drone', lead='saz', bass='saz', drums='darbuka', pad='drone', texture=None),
    'urban':     dict(desc='Elektronik / synth-pop: kick, hat, synth bas, arpej — gökdelenler, teknoloji, gece hayatı, AVM, modern şehir',
                      bpm=118, modes=['minor', 'dorian'], harmony='chords', prog=[[0, 5, 2, 6], [0, 3, 5, 4], [0, 6, 5, 6]], lead='arp', bass='synth', drums='house', pad='saw', texture=None),
    'lofi':      dict(desc='Lo-fi hip-hop: elektrik piyano, yumuşak boom-bap, plak cızırtısı — kafeler, kahveciler, kitapçılar, kütüphaneler',
                      bpm=82, modes=['major', 'dorian'], harmony='chords7', prog=[[1, 4, 0, 5], [0, 5, 1, 4], [3, 2, 1, 0]], lead='epiano', bass='sine', drums='boombap', pad='epiano', texture='vinyl', swing=0.14),
    'sinematik': dict(desc='Orkestral/epik: yaylılar, timpani, bakır nefesliler — müzeler, kaleler, antik kentler, anıtlar, tarihi yapılar',
                      bpm=88, modes=['minor', 'harmonic'], harmony='chords', prog=[[0, 5, 3, 4], [0, 3, 5, 4], [0, 6, 5, 4]], lead='strings', bass='strings', drums='epic', pad='strings', texture=None),
    'tropikal':  dict(desc='Marimba, shaker, offbeat ritim — plajlar, koylar, yaz mekânları, dondurmacılar, tatil',
                      bpm=106, modes=['major', 'mixolydian'], harmony='chords', prog=[[0, 4, 5, 3], [0, 3, 4, 3], [5, 3, 0, 4]], lead='marimba', bass='pluckbass', drums='tropical', pad=None, texture=None),
    'akustik':   dict(desc='Akustik gitar arpeji, hafif perküsyon — parklar, doğa, yürüyüş parkurları, göller, kamp alanları',
                      bpm=96, modes=['major', 'mixolydian'], harmony='chords', prog=[[0, 5, 3, 4], [0, 4, 5, 3], [3, 0, 4, 5]], lead='guitar', bass='pluckbass', drums='soft', pad='soft', texture=None),
    'caz':       dict(desc='Swing caz: walking bas, ride, piyano — şık restoranlar, barlar, otel lobileri, gece mekânları',
                      bpm=128, modes=['major'], harmony='chords7', prog=[[1, 4, 0, 5], [0, 5, 1, 4]], lead='epiano', bass='walking', drums='jazz', pad='epiano', texture=None, swing=0.33),
}
STYLE_KEYWORDS = [  # sırayla denenir; ilk eşleşen kazanır
    ('anadolu',   r'ci[ğg]er|kebap|kebab|lahmacun|baklava|künefe|çiğ ?köfte|kahvaltı|çorba|döner|pide|esnaf|çarşı|bedesten|han\b|kervansaray|türkü|meyhane|ocakbaşı|diyarbak|mardin|urfa|antep|van\b|hakkari|batman|siirt'),
    ('lofi',      r'kafe|cafe|kahve|coffee|kitap|kütüphane|library|çalışma|fırın|pastane|tatlı|çay bahçe'),
    ('tropikal',  r'plaj|koy\b|sahil|beach|yaz\b|tatil|dondurma|bodrum|kaş|fethiye|antalya|surf'),
    ('akustik',   r'park|doğa|yürüyüş|parkur|şelale|göl\b|kamp|orman|yayla|bisiklet|bahçe|piknik'),
    ('sinematik', r'müze|kale|antik|tarih|anıt|saray|cami|kilise|manastır|türbe|savaş|ören|harabe|köprü'),
    ('caz',       r'restoran|fine dining|bar\b|caz|jazz|şarap|kokteyl|otel|lounge|steak'),
    ('urban',     r'gökdelen|bina|kule|tower|plaza|teknoloji|avm|gece|kulüp|club|stadyum|metro|havaliman|startup|modern'),
]

MODES = {  # sent (cent) cinsinden 1 oktav dizisi
    'hicaz':    [0, 112, 386, 498, 702, 814, 996],
    'ussak':    [0, 150, 294, 498, 702, 792, 996],
    'rast':     [0, 204, 355, 498, 702, 906, 1055],
    'huseyni':  [0, 150, 294, 498, 702, 906, 996],
    'nihavend': [0, 204, 294, 498, 702, 792, 1088],
    'major':    [0, 200, 400, 500, 700, 900, 1100],
    'minor':    [0, 200, 300, 500, 700, 800, 1000],
    'dorian':   [0, 200, 300, 500, 700, 900, 1000],
    'mixolydian': [0, 200, 400, 500, 700, 900, 1000],
    'harmonic': [0, 200, 300, 500, 700, 800, 1100],
}


def pick_style(cfg):
    if cfg.get('music', {}).get('style'):
        return cfg['music']['style'], 'config'
    text = ' '.join([cfg.get('title1', ''), ' '.join(cfg.get('title2', [])), ' '.join(cfg.get('kicker', [])),
                     ' '.join(cfg.get('subtitle', [])), ' '.join(cfg.get('map_title', [])), cfg.get('city', ''),
                     ' '.join((i.get('name', '') + ' ' + i.get('sub', '')) for i in cfg.get('items', []))]).lower()
    for style, rx in STYLE_KEYWORDS:
        if re.search(rx, text):
            return style, f'anahtar kelime: /{rx[:40]}…/'
    return 'akustik', 'varsayılan'


# ---------------- sentez yardımcıları ----------------
class Synth:
    def __init__(self, dur, seed):
        self.N = int(SR * dur); self.dur = dur
        self.out = np.zeros((self.N, 2)); self.rng = np.random.default_rng(seed); self.cache = {}

    def add(self, sig, t0, pan=0.0, gain=1.0):
        i = int(round(t0 * SR))
        if i >= self.N or i < 0 or sig is None: return
        s = sig[:self.N - i] * gain
        l, r = math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4)
        self.out[i:i + len(s), 0] += s * l * 1.414; self.out[i:i + len(s), 1] += s * r * 1.414

    def t(self, d): return np.arange(int(SR * d)) / SR

    @staticmethod
    def lowpass(x, cutoff):
        a = math.exp(-2 * math.pi * cutoff / SR)  # tek kutuplu, vektörel yaklaşım (üstel ağırlıklı ortalama)
        n = int(min(len(x), 6 / (1 - a + 1e-9)))
        k = (1 - a) * a ** np.arange(max(n, 1))
        return np.convolve(x, k)[:len(x)]

    def env(self, d, a=0.005, r=None, decay=None):
        t = self.t(d); e = np.clip(t / max(a, 1e-4), 0, 1)
        if decay: e *= np.exp(-t * decay)
        if r: e *= np.clip((d - t) / r, 0, 1)
        return e

    # --- çalgılar ---
    def pluck(self, f, d=0.8, bright=0.5, damp=0.996):
        key = ('pl', round(f, 2), d, bright, damp)
        if key not in self.cache:
            n, p = int(SR * d), max(2, int(SR / f))
            buf = self.rng.uniform(-1, 1, p)
            if bright < 1: buf = self.lowpass(buf, 800 + 6000 * bright) * 2
            y = np.empty(n)
            for k in range(n):
                y[k] = buf[k % p]; buf[k % p] = damp * 0.5 * (buf[k % p] + buf[(k + 1) % p])
            self.cache[key] = y * np.exp(-np.linspace(0, 3, n))
        return self.cache[key]

    def epiano(self, f, d=1.2):
        t = self.t(d); idx = 1.8 * np.exp(-t * 6)
        return (np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t)) + 0.15 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 9)) * self.env(d, 0.004, 0.08, 2.2)

    def marimba(self, f, d=0.6):
        t = self.t(d)
        return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 3.99 * f * t) * np.exp(-t * 18)) * self.env(d, 0.002, 0.05, 7)

    def saw(self, f, d, harmonics=8, detune=0.0):
        t = self.t(d); y = np.zeros_like(t)
        for dv in ([0] if not detune else [-detune, 0, detune]):
            ff = f * (1 + dv)
            for h in range(1, harmonics + 1):
                if ff * h > SR / 2.2: break
                y += np.sin(2 * np.pi * ff * h * t + h) / h
        return y / (3 if detune else 1)

    def strings(self, f, d):
        return self.lowpass(self.saw(f, d, 10, 0.004), 2200) * self.env(d, 0.35, 0.4) * 0.6

    def pad(self, f, d):
        return self.lowpass(self.saw(f, d, 6, 0.006), 1400) * self.env(d, 0.6, 0.6) * 0.5

    def synthbass(self, f, d):
        return self.lowpass(self.saw(f, d, 12), 600) * self.env(d, 0.003, 0.05, 3)

    def sinebass(self, f, d):
        t = self.t(d); return (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)) * self.env(d, 0.01, 0.05, 1.5)

    def brass(self, f, d):
        return self.lowpass(self.saw(f, d, 14, 0.003), 1800) * self.env(d, 0.12, 0.3) * 0.5

    # --- vurmalılar ---
    def noise(self, d): return self.rng.uniform(-1, 1, int(SR * d))

    def drum(self, kind):
        if kind in self.cache: return self.cache[kind]
        if kind == 'kick':
            t = self.t(0.35); f = 45 + 110 * np.exp(-t * 35); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8)
        elif kind == 'dum':
            t = self.t(0.35); f = 70 + 90 * np.exp(-t * 30); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
        elif kind == 'tek':
            t = self.t(0.12); y = (0.6 * self.noise(0.12) + 0.5 * np.sin(2 * np.pi * 420 * t)) * np.exp(-t * 45) * 0.6
        elif kind == 'snare':
            t = self.t(0.25); y = (0.7 * self.noise(0.25) * np.exp(-t * 18) + 0.5 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25)) * 0.7
        elif kind == 'clap':
            t = self.t(0.2); n = self.noise(0.2); e = np.exp(-t * 30) + 0.6 * np.exp(-np.maximum(t - 0.012, 0) * 30) * (t > 0.012)
            y = (n - self.lowpass(n, 900)) * e * 0.6
        elif kind == 'hat':
            t = self.t(0.06); n = self.noise(0.06); y = (n - self.lowpass(n, 6000)) * np.exp(-t * 70) * 0.5
        elif kind == 'ohat':
            t = self.t(0.3); n = self.noise(0.3); y = (n - self.lowpass(n, 6000)) * np.exp(-t * 12) * 0.4
        elif kind == 'shaker':
            t = self.t(0.09); n = self.noise(0.09); y = (n - self.lowpass(n, 4000)) * np.sin(np.pi * t / 0.09) * 0.35
        elif kind == 'rim':
            t = self.t(0.05); y = np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 90) * 0.5
        elif kind == 'ride':
            t = self.t(0.9); y = sum(np.sin(2 * np.pi * f * t) for f in (3150, 4230, 5370, 6620)) * np.exp(-t * 5) * 0.08 + (self.noise(0.9) - self.lowpass(self.noise(0.9), 7000)) * np.exp(-t * 8) * 0.12
        elif kind == 'brush':
            t = self.t(0.18); n = self.noise(0.18); y = self.lowpass(n, 3000) * np.exp(-t * 14) * 0.35
        elif kind == 'timpani':
            t = self.t(1.4); f = 65 + 20 * np.exp(-t * 8); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.6) + self.lowpass(self.noise(1.4), 200) * np.exp(-t * 10) * 0.5
        elif kind == 'tom':
            t = self.t(0.5); f = 95 + 50 * np.exp(-t * 20); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6)
        elif kind == 'crash':
            t = self.t(1.6); n = self.noise(1.6); y = (n - self.lowpass(n, 5000)) * np.exp(-t * 2.5) * 0.35
        elif kind == 'impact':
            t = self.t(1.2); f = 40 + 60 * np.exp(-t * 12); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3) + self.lowpass(self.noise(1.2), 400) * np.exp(-t * 6) * 0.6
        elif kind == 'roll':  # darbuka/def geçişi
            t = self.t(0.5); y = np.zeros_like(t)
            for k in range(8): j = int(k * 0.06 * SR); seg = self.drum('tek')[:len(t) - j] * (0.3 + 0.1 * k); y[j:j + len(seg)] += seg
        else:
            y = np.zeros(10)
        self.cache[kind] = y
        return y

    def riser(self, d):
        t = self.t(d); n = self.noise(d)
        y = (n - self.lowpass(n, 1500 + 6000 * 0)) * (t / d) ** 2 * 0.35
        return y + np.sin(2 * np.pi * np.cumsum(200 + 600 * (t / d) ** 2) / SR) * (t / d) ** 2 * 0.12

    def vinyl(self):
        n = self.N; crackle = (self.rng.random(n) > 0.9993) * self.rng.uniform(-1, 1, n)
        hiss = self.lowpass(self.rng.uniform(-1, 1, n), 3000) * 0.02
        return crackle * 0.25 + hiss


# ---------------- düzenleme ----------------
def timeline(cfg, duration):
    if not cfg:
        return dict(total=duration, intro=0.0, scene=None, n=0, final=0.0)
    n = len(cfg.get('items', []))
    intro, final = cfg.get('intro_seconds', 4), cfg.get('final_seconds', 12)
    scene = cfg.get('scene_seconds') or max(3.5, (cfg.get('target_seconds', 60) - intro - final) / max(n, 1))
    return dict(total=intro + scene * n + final, intro=intro, scene=scene, n=n, final=final)


def compose(style, tl, seed, mode=None, bpm=None, tonic=None):
    S = STYLES[style]; rng = np.random.default_rng(seed)
    mode = mode or S['modes'][rng.integers(len(S['modes']))]
    bpm = bpm or S['bpm'] * rng.uniform(0.96, 1.04)
    if tl['scene']:  # her sahne çift sayıda vuruş sürer → geçişler ritme oturur, tempo stile yakın kalır
        beats = max(2, 2 * round(tl['scene'] * bpm / 120)); bpm = beats * 60 / tl['scene']
    beat = 60 / bpm; total = tl['total']
    if tonic is None:
        base = 146.83 if style in ('anadolu',) else 130.81  # Re3 / Do3 civarı
        tonic = base * 2 ** (int(rng.integers(-2, 5)) / 12)
    cents = MODES[mode]
    def deg(d, octv=0):  # dizi derecesi → frekans
        o, k = divmod(d, 7); return tonic * 2 ** (octv + o + cents[k] / 1200)
    syn = Synth(total, seed)
    t0 = tl['intro']                 # ritmik bölüm başlangıcı
    fin = tl['intro'] + (tl['scene'] or 0) * tl['n'] if tl['n'] else total * 0.8
    bar = 4 * beat; nbars = int((total - t0 - 1.5) / bar)
    swing = S.get('swing', 0)
    sw = lambda i8: (beat / 2) * (i8 % 2) * swing  # 8'liklerde swing kaydırması
    prog = S.get('prog', [[0, 4, 5, 3]])[rng.integers(len(S.get('prog', [[0]])))]

    def chord(rootdeg, sev=False):
        ds = [rootdeg, rootdeg + 2, rootdeg + 4] + ([rootdeg + 6] if sev else [])
        return [deg(d) for d in ds]

    # ---- giriş: dem/pad + yükselen ses ----
    if t0 > 0:
        if S['harmony'] == 'drone':
            d = t0 + 0.5; t = syn.t(d)
            syn.add((np.sin(2 * np.pi * tonic / 2 * t) + .5 * np.sin(2 * np.pi * tonic * 3 / 4 * t)) * syn.env(d, 1.5, 0.3) * 0.18, 0)
        else:
            for f in chord(prog[0]):
                g = syn.strings if S['pad'] in ('strings',) else syn.pad
                syn.add(g(f, t0 + 0.4) * 0.35, 0, pan=float(rng.uniform(-.4, .4)))
        syn.add(syn.riser(min(1.6, t0)), t0 - min(1.6, t0), gain=0.8)
        if S['lead'] in ('saz', 'marimba', 'guitar', 'epiano'):  # birkaç serbest nota
            for k in range(3):
                f = deg(int(rng.integers(0, 5)), 1); tt = 0.6 + k * t0 / 3.5
                syn.add(syn.pluck(f, 1.2, .6) if S['lead'] in ('saz', 'guitar') else (syn.marimba(f) if S['lead'] == 'marimba' else syn.epiano(f)), tt, pan=-.2, gain=.35)

    # ---- dem (makam stilleri) ----
    if S['harmony'] == 'drone':
        t = np.arange(syn.N) / SR
        env = np.clip((t - t0 + 0.5) / 2, 0, 1) * np.clip((total - t) / 3, 0, 1)
        dr = (np.sin(2 * np.pi * tonic / 2 * t) + .5 * np.sin(2 * np.pi * tonic * 3 / 4 * t) + .25 * np.sin(2 * np.pi * tonic * t)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.15 * t)) * env * 0.09
        syn.out[:, 0] += dr; syn.out[:, 1] += dr

    # ---- ritmik bölüm ----
    motifs = []
    for _ in range(6):  # tohuma göre özgün motifler (adım adım yürüyüş)
        m, cur = [], int(rng.integers(0, 5))
        for _ in range(int(rng.integers(4, 7))):
            cur = int(np.clip(cur + rng.choice([-2, -1, -1, 1, 1, 2, 3, -3]), -1, 9)); m.append((cur, float(rng.choice([.5, .5, 1, 1, 1.5]))))
        motifs.append(m)
    order = [int(x) for x in rng.integers(0, 6, 8)]
    lead_t, mi = t0, 0
    for b in range(nbars):
        bt = t0 + b * bar; finale = bt >= fin; ch_root = prog[b % len(prog)]
        sev = S['harmony'] == 'chords7'
        # akorlar / pad
        if S['harmony'] != 'drone':
            fs = chord(ch_root, sev)
            if S['pad'] in ('saw', 'strings', 'soft'):
                g = syn.strings if S['pad'] == 'strings' else syn.pad
                for f in fs: syn.add(g(f, bar + 0.3), bt, pan=float(rng.uniform(-.5, .5)), gain=0.28 if S['pad'] != 'soft' else 0.18)
            if S['pad'] == 'epiano':
                hits = [0, 1.5, 2.5] if style == 'lofi' else [0.5, 1.5, 2, 3.5]
                for h in hits:
                    for f in fs: syn.add(syn.epiano(f * 2, 1.0), bt + h * beat + sw(int(h * 2)), pan=float(rng.uniform(-.3, .3)), gain=0.16)
        # bas
        root = deg(ch_root, -1) if S['harmony'] != 'drone' else tonic / 2
        if S['bass'] == 'synth':
            for k in range(8): syn.add(syn.synthbass(root * (2 if k % 4 == 3 else 1), beat / 2), bt + k * beat / 2, gain=0.42)
        elif S['bass'] == 'sine':
            for h in (0, 2.5): syn.add(syn.sinebass(root, beat * 1.4), bt + h * beat, gain=0.55)
        elif S['bass'] == 'walking':
            for k in range(4): syn.add(syn.sinebass(deg(ch_root + [0, 2, 4, 5][k] if k < 3 else ch_root + 1, -1), beat * .95), bt + k * beat, gain=0.5)
        elif S['bass'] == 'strings':
            syn.add(syn.strings(root, bar + .2), bt, gain=0.5)
        elif S['bass'] in ('pluckbass', 'saz'):
            for h in ((0, 2) if S['bass'] == 'pluckbass' else (0,)): syn.add(syn.pluck(root * (1.5 if h == 2 and S['bass'] == 'pluckbass' else 1), 1.0, .3), bt + h * beat, pan=.2, gain=0.5)
        # davullar
        dk = S['drums']
        if dk == 'darbuka':
            for kind, off in [('dum', 0), ('tek', .75), ('dum', 1.5), ('tek', 2), ('tek', 3), ('tek', 3.5)]:
                syn.add(syn.drum(kind), bt + off * beat, pan=0 if kind == 'dum' else .25, gain=.8 if kind == 'dum' else .5)
            if b % 4 == 3:
                for k in range(4): syn.add(syn.drum('tek'), bt + 3 * beat + k * beat / 4, pan=-.2, gain=.25)
        elif dk == 'house':
            for k in range(4): syn.add(syn.drum('kick'), bt + k * beat, gain=.9)
            for k in range(4): syn.add(syn.drum('ohat' if finale else 'hat'), bt + k * beat + beat / 2, pan=.3, gain=.5)
            for k in (1, 3): syn.add(syn.drum('clap'), bt + k * beat, gain=.6)
        elif dk == 'boombap':
            for off in (0, 2.5): syn.add(syn.drum('kick'), bt + off * beat, gain=.75)
            for off in (1, 3): syn.add(syn.drum('snare'), bt + off * beat, gain=.45)
            for k in range(8): syn.add(syn.drum('hat'), bt + k * beat / 2 + sw(k), pan=.3, gain=.28)
        elif dk == 'epic':
            syn.add(syn.drum('timpani'), bt, gain=.9)
            if b % 2 == 1:
                for k, off in enumerate((2, 2.5, 3, 3.5)): syn.add(syn.drum('tom'), bt + off * beat, gain=.35 + .1 * k)
        elif dk == 'tropical':
            for off in (0, 1.75, 2.5): syn.add(syn.drum('kick'), bt + off * beat, gain=.65)
            for k in range(8): syn.add(syn.drum('shaker'), bt + k * beat / 2, pan=.35, gain=.45 if k % 2 else .25)
            for off in (.5, 1.5, 2.5, 3.5): syn.add(syn.drum('rim'), bt + off * beat, pan=-.3, gain=.35)
        elif dk == 'soft':
            syn.add(syn.drum('kick'), bt, gain=.5); syn.add(syn.drum('kick'), bt + 2.5 * beat, gain=.35)
            for k in range(8): syn.add(syn.drum('shaker'), bt + k * beat / 2, pan=.3, gain=.3)
            for off in (1, 3): syn.add(syn.drum('clap'), bt + off * beat, gain=.22)
        elif dk == 'jazz':
            for k in range(4):
                syn.add(syn.drum('ride'), bt + k * beat, pan=.35, gain=.55)
                if k % 2: syn.add(syn.drum('ride'), bt + k * beat + beat * 0.66, pan=.35, gain=.35)
            for off in (1, 3): syn.add(syn.drum('brush'), bt + off * beat, pan=-.2, gain=.5)
        # arpej (urban) / gitar arpeji (akustik)
        if S['lead'] == 'arp':
            fs = chord(ch_root)
            for k in range(8): syn.add(syn.pluck(fs[k % 3] * 2, .35, .9), bt + k * beat / 2, pan=(-.4 if k % 2 else .4), gain=.22)
        if S['lead'] == 'guitar':
            fs = chord(ch_root)
            for k, idx in enumerate([0, 1, 2, 1, 0, 2, 1, 2]): syn.add(syn.pluck(fs[idx] * (1 if k < 4 else 2), 1.0, .55), bt + k * beat / 2, pan=-.25, gain=.3)
    # melodi (tüm ritmik bölüm boyunca, finalde oktav katmanı)
    lead_end = total - 2.5
    while lead_t < lead_end and S['lead'] != 'arp':
        for d, ln in motifs[order[mi % len(order)]]:
            if lead_t >= lead_end: break
            f = deg(d, 1 if S['lead'] in ('saz', 'marimba', 'epiano', 'guitar') else 0)
            fin_layer = lead_t >= fin
            if S['lead'] == 'saz':
                syn.add(syn.pluck(f, .9), lead_t, pan=-.25, gain=.85); syn.add(syn.pluck(f * 2, .5), lead_t + .012, pan=.3, gain=.25)
                if ln >= 1: syn.add(syn.pluck(f, .4), lead_t + beat / 2, pan=-.3, gain=.22)
            elif S['lead'] == 'marimba':
                syn.add(syn.marimba(f), lead_t, pan=-.2, gain=.55)
                if fin_layer: syn.add(syn.marimba(f * 2), lead_t, pan=.3, gain=.3)
            elif S['lead'] == 'epiano':
                if rng.random() < 0.75: syn.add(syn.epiano(f * 2, ln * beat + .3), lead_t + sw(int((lead_t - t0) / (beat / 2))), pan=-.15, gain=.32)
            elif S['lead'] == 'strings':
                syn.add(syn.strings(f * 2, ln * beat + .25), lead_t, pan=-.1, gain=.55)
                if fin_layer: syn.add(syn.brass(f, ln * beat + .2), lead_t, pan=.2, gain=.4)
            elif S['lead'] == 'guitar':
                if fin_layer or rng.random() < .35: syn.add(syn.pluck(f * 2, .8, .8), lead_t, pan=.3, gain=.35)
            if fin_layer and S['lead'] == 'saz': syn.add(syn.pluck(f / 2, .9, .4), lead_t, pan=.35, gain=.3)
            lead_t += ln * beat
        mi += 1
    if S['lead'] == 'arp':  # urban: üstte uzun synth melodi notaları
        tt = t0 + 2 * bar
        while tt < lead_end:
            m = motifs[order[mi % len(order)]]; mi += 1
            for d, ln in m[:4]:
                syn.add(syn.pad(deg(d, 1) * 2, ln * beat * 2), tt, pan=.1, gain=.22); tt += ln * beat * 2
                if tt >= lead_end: break

    # ---- sahne geçişi vurguları ----
    accent = {'anadolu': 'roll', 'urban': 'impact', 'sinematik': 'impact', 'lofi': 'crash', 'tropikal': 'crash', 'akustik': 'crash', 'caz': 'crash'}[style]
    marks = [tl['intro'] + k * tl['scene'] for k in range(tl['n'] + 1)] if tl['scene'] else []
    for k, m in enumerate(marks):
        g = 0.6 if k in (0, len(marks) - 1) else 0.32
        if accent == 'roll': syn.add(syn.drum('roll'), m - 0.45, gain=.55); syn.add(syn.drum('dum'), m, gain=.9)
        else: syn.add(syn.drum(accent), m, gain=g * (1.4 if accent == 'impact' else 1))
    if marks: syn.add(syn.riser(1.5), marks[-1] - 1.5, gain=.7)  # finale yükseliş

    # ---- doku, kapanış, seviye ----
    if S.get('texture') == 'vinyl':
        v = syn.vinyl(); syn.out[:, 0] += v; syn.out[:, 1] += v
    t = np.arange(syn.N) / SR
    syn.out *= np.clip((total - t) / 2.5, 0, 1)[:, None] * np.clip(t / 0.05, 0, 1)[:, None]
    body = syn.out[int(SR * min(tl['intro'] + 1, total / 3)):int(SR * (total - 3))]
    rms = np.sqrt(np.mean(body ** 2)) + 1e-9
    o = syn.out / rms * 10 ** (-12.5 / 20)          # stiller arasında eşit ses seviyesi (~-12,5 dB RMS)
    o = np.tanh(o * 1.6) / 1.6                      # yumuşak sınırlama; tepe asla 1'i aşmaz
    o *= 0.95 / (np.max(np.abs(o)) + 1e-9)            # tepeyi -0,4 dBFS'e getir
    return o, dict(style=style, mode=mode, bpm=round(bpm, 1), tonic=round(tonic, 1), seed=seed, total=round(total, 2))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--config'); ap.add_argument('--out', default='music.wav')
    ap.add_argument('--style', choices=STYLES); ap.add_argument('--mode', choices=MODES)
    ap.add_argument('--bpm', type=float); ap.add_argument('--tonic', type=float)
    ap.add_argument('--duration', type=float, default=60); ap.add_argument('--seed', type=int)
    ap.add_argument('--list-styles', action='store_true')
    a = ap.parse_args()
    if a.list_styles:
        for k, v in STYLES.items(): print(f'{k:10s} {v["desc"]}')
        return
    cfg = json.load(open(a.config)) if a.config else {}
    mcfg = cfg.get('music', {})
    if a.style: style, why = a.style, 'parametre'
    elif cfg: style, why = pick_style(cfg)
    else: style, why = ('anadolu' if (a.mode in ('hicaz', 'ussak', 'rast', 'huseyni', 'nihavend')) else 'akustik'), 'eski kullanım'
    key = json.dumps([cfg.get('title1'), cfg.get('title2'), [i.get('name') for i in cfg.get('items', [])]], ensure_ascii=False)
    seed = a.seed if a.seed is not None else mcfg.get('seed', int(hashlib.md5(key.encode()).hexdigest()[:8], 16))
    tl = timeline(cfg, a.duration)
    o, info = compose(style, tl, seed, mode=a.mode or mcfg.get('mode'), bpm=a.bpm or mcfg.get('bpm'), tonic=a.tonic or mcfg.get('tonic'))
    with wave.open(a.out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((o * 32767).astype(np.int16).tobytes())
    print(f"müzik: {a.out} | stil={info['style']} ({why}) | makam/dizi={info['mode']} | {info['bpm']} bpm | ton={info['tonic']} Hz | tohum={info['seed']} | {info['total']} sn")


if __name__ == '__main__':
    main()
