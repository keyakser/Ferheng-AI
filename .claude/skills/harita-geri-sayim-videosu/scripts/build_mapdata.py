"""Overture parquet dosyalarını şablonun okuduğu kompakt mapdata.json'a çevirir.

Kullanım:
  python build_mapdata.py WORKDIR OUT_DIR/mapdata.json

Koordinatlar, bbox merkezine göre yerel metre cinsine (eşdikdörtgen izdüşüm) çevrilir.
Gereken paketler: pyarrow, shapely
"""
import json, math, os, sys
import pyarrow.parquet as pq
from shapely import wkb, box

RANK = {'motorway': 6, 'trunk': 6, 'primary': 5, 'secondary': 4, 'tertiary': 3, 'residential': 2,
        'living_street': 2, 'unclassified': 2, 'service': 1, 'pedestrian': 1}


def parts(g):
    t = g.geom_type
    if t == 'Polygon': return [g.exterior.coords]
    if t == 'MultiPolygon': return [p.exterior.coords for p in g.geoms]
    if t == 'LineString': return [g.coords]
    if t == 'MultiLineString': return [l.coords for l in g.geoms]
    if t == 'GeometryCollection': return [c for x in g.geoms for c in parts(x)]
    return []


def main():
    wd, out = sys.argv[1], sys.argv[2]
    seg = pq.read_table(os.path.join(wd, 'segment.parquet')).to_pylist()
    bb = json.load(open(os.path.join(wd, 'bbox.json')))['bbox'] if os.path.exists(os.path.join(wd, 'bbox.json')) else None
    if bb is None:
        xs, ys = [], []
        for r in seg[:5000]:
            for c in parts(wkb.loads(r['geometry'])):
                for p in c: xs.append(p[0]); ys.append(p[1])
        bb = [min(xs), min(ys), max(xs), max(ys)]
    lon0, lat0 = (bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2
    clipbox = box(bb[0] - 0.01, bb[1] - 0.01, bb[2] + 0.01, bb[3] + 0.01)
    def load(geom):  # kutudan taşan geometrileri kırp (Boğaz gibi dev su alanları)
        g = wkb.loads(geom)
        return g if clipbox.contains(g) else g.intersection(clipbox)
    kx, ky = math.cos(math.radians(lat0)) * 111320, 110950
    P = lambda lon, lat: (round((lon - lon0) * kx, 1), round((lat0 - lat) * ky, 1))
    flat = lambda cs: [v for p in cs for v in P(p[0], p[1])]
    data = {'origin': [lat0, lon0, kx, ky], 'roads': [], 'bld': [], 'water': []}
    for r in seg:
        if r.get('subtype') != 'road': continue
        nm = (r.get('names') or {}).get('primary') if r.get('names') else None
        c = RANK.get(r.get('class'), 0 if r.get('class') in ('footway', 'path', 'steps', 'cycleway', 'track') else 1)
        for cs in parts(load(r['geometry'])):
            data['roads'].append([c, nm, flat(cs)])
    wp = os.path.join(wd, 'water.parquet')
    if os.path.exists(wp):
        for r in pq.read_table(wp).to_pylist():
            if r.get('class') == 'swimming_pool': continue
            g = load(r['geometry'])
            for cs in parts(g):
                data['water'].append([1 if 'Polygon' in g.geom_type else 0, r.get('class'), flat(cs)])
    bp = os.path.join(wd, 'building.parquet')
    if os.path.exists(bp):
        for r in pq.read_table(bp).to_pylist():
            for cs in parts(load(r['geometry'])):
                data['bld'].append(flat(cs))
    json.dump(data, open(out, 'w'), separators=(',', ':'), ensure_ascii=False)
    print(f"yollar {len(data['roads'])}, binalar {len(data['bld'])}, su {len(data['water'])} -> {out} ({os.path.getsize(out)//1024} KB)")


if __name__ == '__main__':
    main()
