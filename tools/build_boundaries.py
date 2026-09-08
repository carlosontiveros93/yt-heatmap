"""Build cities/<city>/boundaries.js from official GeoJSON plus hand-drawn shapes.

    python3 tools/build_boundaries.py        # nyc (default)
    python3 tools/build_boundaries.py la

Each city's definitions live in tools/boundaries/<city>.py: lookups() (official
datasets keyed by feature id), WANT (spot -> dataset + ids; several ids dissolve
into one shape), HAND (polygons), CORRIDORS (LineStrings), extra() (anything
else, e.g. an OSM trace), OUT and HEADER.
"""
import importlib, json, sys
from collections import defaultdict

city = sys.argv[1] if len(sys.argv) > 1 else 'nyc'
sys.path.insert(0, 'tools')
C = importlib.import_module('boundaries.' + city)
lookups = C.lookups()


def polygons(geom):
    """Return list of polygons, each a list of rings (outer first)."""
    if geom['type'] == 'Polygon':
        return [geom['coordinates']]
    return list(geom['coordinates'])

def rnd(pt):
    return (round(pt[0], 5), round(pt[1], 5))

def dissolve(rings):
    """Union of adjacent polygons that share exact border vertices.
    Drop edges present in more than one ring, chain the rest into rings."""
    edge_count = defaultdict(int)
    edges = []
    for ring in rings:
        pts = [rnd(p) for p in ring]
        if pts[0] != pts[-1]:
            pts.append(pts[0])
        for a, b in zip(pts, pts[1:]):
            if a == b:
                continue
            key = frozenset((a, b))
            edge_count[key] += 1
            edges.append((a, b))
    outer = [(a, b) for a, b in edges if edge_count[frozenset((a, b))] == 1]
    nxt = defaultdict(list)
    for a, b in outer:
        nxt[a].append(b)
    result = []
    used = set()
    for a, b in outer:
        if (a, b) in used:
            continue
        ring = [a]
        cur, prev = b, a
        used.add((a, b))
        while cur != a:
            ring.append(cur)
            cands = [n for n in nxt[cur] if (cur, n) not in used]
            if not cands:
                break
            step = cands[0]
            used.add((cur, step))
            prev, cur = cur, step
        ring.append(a)
        result.append(ring)
    return result

out = {}
report = []
for spot, (ds, ids) in C.WANT.items():
    by_id, source, name_key = lookups[ds]
    feats = [by_id[i] for i in ids]
    outer_rings = []
    for f in feats:
        for poly in polygons(f['geometry']):
            outer_rings.append(poly[0])  # outer ring only; official areas have no holes we care about
    if len(feats) > 1:
        rings = dissolve(outer_rings)
    else:
        rings = [[rnd(p) for p in r] for r in outer_rings]
    # keep only rings with real area (dissolve can leave slivers)
    def area(r):
        return abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(r, r[1:]))) / 2
    rings = [r for r in rings if area(r) > 1e-8]
    rings.sort(key=area, reverse=True)
    geom = {'type': 'MultiPolygon', 'coordinates': [[[list(p) for p in r]] for r in rings]} if len(rings) > 1 \
        else {'type': 'Polygon', 'coordinates': [[list(p) for p in rings[0]]]}
    names = [f['properties'].get(name_key) for f in feats]
    out[spot] = {'source': source, 'features': ids, 'names': names, 'geometry': geom}
    report.append((spot, ids, len(rings), sum(len(r) for r in rings)))

for spot, entry in C.extra().items():
    out[spot] = entry
    report.append((spot, entry['features'], 1, sum(len(r) for r in entry['geometry']['coordinates'])))

for spot, ring in C.HAND.items():
    out[spot] = {'source': 'hand-drawn approximation', 'features': [], 'names': [],
                 'geometry': {'type': 'Polygon', 'coordinates': [ring]}}
    report.append((spot, 'hand-drawn', 1, len(ring)))

for spot, pts in C.CORRIDORS.items():
    out[spot] = {'source': 'hand-placed waypoints along the street', 'features': [], 'names': [],
                 'geometry': {'type': 'LineString', 'coordinates': pts}}
    report.append((spot, 'corridor', 1, len(pts)))

js = C.HEADER + "const BOUNDARIES = " + json.dumps(out, separators=(',', ':')) + ";\n"
open(C.OUT, 'w').write(js)
for r in report:
    print(f"{r[0]:24s} {str(r[1]):22s} rings={r[2]} points={r[3]}")
print('bytes:', len(js))
