"""Harita paletinin okunabilirliğini kontrol eder: kara/deniz, yol/kara, yol/deniz ayrımı.

Kullanım:
  python check_palette.py WORK/config.json

Neden: koyu bir temada kara ve deniz aynı renk ailesinden seçilirse (ör. lacivert üstüne lacivert)
izleyici kıyı çizgisini göremez; telefonda, küçük ekranda harita "tek renk" görünür.
Ölçüt: CIELAB ΔE (algısal renk farkı). Kara↔deniz ≥ 25, yol↔kara ≥ 30, ana yol↔deniz ≥ 30 olmalı.
Eşik altındaysa çıkış kodu 1 olur; paleti düzeltip tekrar çalıştır.
"""
import json, sys

DEF = {'land': '#221a14', 'land2': '#2a2019', 'water': '#1e5a73', 'waterS': '#4aa3c4',
       'roadMajor': '#ff9a3d', 'roadMid': '#f1cf9e', 'roadMinor': '#a8927a', 'bld': '#3b2e24'}


def lab(hexc):
    h = hexc.lstrip('#'); r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = lin(r), lin(g), lin(b)
    x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883
    f = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    return 116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))


def de(a, b):
    return sum((p - q) ** 2 for p, q in zip(lab(a), lab(b))) ** 0.5


def main():
    cfg = json.load(open(sys.argv[1]))
    P = dict(DEF, **cfg.get('palette', {}))
    checks = [('kara ↔ deniz', P['land'], P['water'], 25), ('kara2 ↔ deniz', P['land2'], P['water'], 25),
              ('bina ↔ deniz', P['bld'], P['water'], 20), ('ana yol ↔ kara', P['roadMajor'], P['land'], 30),
              ('ana yol ↔ deniz', P['roadMajor'], P['water'], 30), ('ara yol ↔ kara', P['roadMid'], P['land'], 30),
              ('kıyı çizgisi ↔ kara', P['waterS'], P['land'], 30)]
    bad = 0
    for name, a, b, lim in checks:
        d = de(a, b); ok = d >= lim; bad += not ok
        print(f"{'✓' if ok else '✗'} {name:20s} ΔE={d:5.1f} (en az {lim})  {a} / {b}")
    print('Palet uygun.' if not bad else f'{bad} kontrol başarısız: renkleri farklı ton ailelerinden seç (ör. nötr gri kara + mavi deniz + sıcak renkli yollar).')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
