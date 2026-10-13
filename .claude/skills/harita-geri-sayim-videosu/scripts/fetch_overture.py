"""Overture Maps'ten bir sınır kutusu (bbox) için yer, yol, su ve bina verisini indirir.

Kullanım:
  python fetch_overture.py --bbox LON_MIN LAT_MIN LON_MAX LAT_MAX --out WORKDIR [--release 2026-09-23.0]

Çıktılar (WORKDIR içinde):
  places.json        -> isim, kategori, adres, telefon, koordinat (yer doğrulaması için)
  segment.parquet    -> yollar
  water.parquet      -> nehir/göl
  building.parquet   -> binalar

Not: Overture S3 kovası anonim okunur. Ortamda HTTPS_PROXY varsa pyarrow'a geçirilir.
Gereken paketler: pyarrow
"""
import argparse, json, os, re, time, urllib.request
import pyarrow.dataset as ds, pyarrow.fs as pfs, pyarrow.compute as pc, pyarrow.parquet as pq

BUCKET = 'overturemaps-us-west-2'


def latest_release():
    url = f'https://{BUCKET}.s3.us-west-2.amazonaws.com/?list-type=2&prefix=release/&delimiter=/'
    xml = urllib.request.urlopen(url, timeout=60).read().decode()
    rels = sorted(re.findall(r'<Prefix>release/([^<]+)/</Prefix>', xml))
    if not rels:
        raise SystemExit('Overture sürümü bulunamadı (S3 erişimi engelli olabilir).')
    return rels[-1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--bbox', nargs=4, type=float, required=True, metavar=('LON_MIN', 'LAT_MIN', 'LON_MAX', 'LAT_MAX'))
    ap.add_argument('--out', required=True)
    ap.add_argument('--release')
    ap.add_argument('--skip-buildings', action='store_true', help='Büyük şehirlerde bina verisi çok büyükse atla')
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    rel = a.release or latest_release()
    print('Overture sürümü:', rel)
    kw = dict(anonymous=True, region='us-west-2')
    if os.environ.get('HTTPS_PROXY'):
        kw['proxy_options'] = os.environ['HTTPS_PROXY']
    fs = pfs.S3FileSystem(**kw)
    x0, y0, x1, y1 = a.bbox
    f = ((pc.field('bbox', 'xmin') > x0) & (pc.field('bbox', 'xmax') < x1) &
         (pc.field('bbox', 'ymin') > y0) & (pc.field('bbox', 'ymax') < y1))

    def fetch(theme, typ, cols):
        t0 = time.time()
        d = ds.dataset(f'{BUCKET}/release/{rel}/theme={theme}/type={typ}/', filesystem=fs, format='parquet')
        names = set(d.schema.names)
        tb = d.to_table(filter=f, columns=[c for c in cols if c in names])
        print(f'{typ}: {tb.num_rows} kayıt ({time.time() - t0:.0f} sn)')
        return tb

    places = fetch('places', 'place', ['id', 'names', 'basic_category', 'categories', 'addresses', 'phones', 'bbox', 'confidence', 'operating_status'])
    rows = []
    for r in places.to_pylist():
        b = r['bbox']
        rows.append({
            'name': (r.get('names') or {}).get('primary'),
            'category': r.get('basic_category') or ((r.get('categories') or {}).get('primary')),
            'address': '; '.join(x.get('freeform') or '' for x in (r.get('addresses') or [])),
            'phones': r.get('phones') or [],
            'lat': round(b['ymin'], 6), 'lon': round(b['xmin'], 6),
            'confidence': r.get('confidence'), 'status': r.get('operating_status'),
        })
    json.dump(rows, open(os.path.join(a.out, 'places.json'), 'w'), ensure_ascii=False)
    pq.write_table(fetch('transportation', 'segment', ['id', 'geometry', 'class', 'subtype', 'names']), os.path.join(a.out, 'segment.parquet'))
    pq.write_table(fetch('base', 'water', ['id', 'geometry', 'class', 'subtype', 'names']), os.path.join(a.out, 'water.parquet'))
    if not a.skip_buildings:
        pq.write_table(fetch('buildings', 'building', ['id', 'geometry']), os.path.join(a.out, 'building.parquet'))


if __name__ == '__main__':
    main()
