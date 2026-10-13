"""places.json içinde isim/adres/telefon araması yapar; aday konumları listeler.

Kullanım:
  python find_places.py WORKDIR/places.json "ci[ğg]er|cıger"            # isimde regex
  python find_places.py WORKDIR/places.json --phone "0536 070 86"      # telefonla eşleştir (rakamlar karşılaştırılır)

Çıktı: isim | enlem,boylam | adres | telefon | kategori
Telefon eşleşmesi, web'deki bir listenin (ör. menuburada) aynı işletme olduğunu kanıtlamanın en güçlü yoludur.
"""
import json, re, sys


def digits(s):
    return re.sub(r'\D', '', s or '')[-10:]


def main():
    path = sys.argv[1]
    rows = json.load(open(path))
    if len(sys.argv) > 3 and sys.argv[2] == '--phone':
        want = re.sub(r'\D', '', sys.argv[3])
        hits = [r for r in rows if any(want in digits(p) or digits(p).startswith(want[-10:]) for p in r['phones'])]
    else:
        rx = re.compile(sys.argv[2], re.I)
        hits = [r for r in rows if rx.search(r['name'] or '') or rx.search(r['address'] or '')]
    for r in sorted(hits, key=lambda r: (r['lat'], r['lon'])):
        print(f"{r['name']} | {r['lat']:.5f},{r['lon']:.5f} | {r['address']} | {','.join(r['phones'])} | {r['category']}")
    print(f'-- {len(hits)} sonuç', file=sys.stderr)


if __name__ == '__main__':
    main()
