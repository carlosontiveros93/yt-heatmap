"""First-pass location scan of Walkie Talkie transcripts against a city gazetteer.

    python3 tools/scan_locations.py        # nyc (default): research/walkie_talkie_raw.json -> _scan.json, _review.md
    python3 tools/scan_locations.py la     # research/la/raw.json -> research/la/scan.json, review.md

Each city's gazetteer (official neighborhood + park names plus a hand list of what
photographers actually say) lives in tools/gazetteers/<city>.py.
"""
import importlib, json, re, sys
from collections import Counter

city = sys.argv[1] if len(sys.argv) > 1 else 'nyc'
sys.path.insert(0, 'tools')
G = importlib.import_module('gazetteers.' + city)

raw = json.load(open(G.RAW))
gaz, noise = G.build()

patterns = {name: re.compile(r'(?<![a-z])(' + '|'.join(re.escape(a) for a in sorted(alts, key=len, reverse=True)) + r')(?![a-z])')
            for name, alts in gaz.items()}

rows = []
for vid, ep in raw.items():
    text = ' '.join(t for _, t in ep['transcript']).lower()
    desc = (ep.get('description') or '').lower()
    counts = Counter()
    desc_hits = set()
    for name, pat in patterns.items():
        n = len(pat.findall(text))
        d = len(pat.findall(desc))
        if n or d:
            weight = 0.5 if any(a in noise for a in gaz[name]) else 1.0
            counts[name] = n * weight + d * 3  # description mentions are strong signals
            if d: desc_hits.add(name)
    top = counts.most_common(8)
    rows.append({'videoId': vid, 'title': ep['title'], 'published': ep.get('published', ''),
                 'minutes': round(ep.get('lengthSeconds', 0) / 60), 'lines': len(ep['transcript']),
                 'top': top, 'desc_hits': sorted(desc_hits), 'description': ep.get('description', '')[:400]})

json.dump(rows, open(G.SCAN, 'w'), indent=1)

with open(G.REVIEW, 'w') as f:
    f.write(f'# {G.REVIEW_TITLE}\n\n')
    f.write('Score = transcript mentions (generic words half weight) + 3 × description mentions.\n\n')
    f.write('| # | Episode | Min | Top locations (score) | In description |\n|---|---|---|---|---|\n')
    for i, r in enumerate(rows, 1):
        top = ', '.join(f'{n} ({s:g})' for n, s in r['top'][:6]) or '—'
        f.write(f"| {i} | [{r['title'][:70]}](https://www.youtube.com/watch?v={r['videoId']}) | {r['minutes']} | {top} | {', '.join(r['desc_hits'])} |\n")
print(len(rows), 'episodes scanned; gazetteer size', len(gaz))
