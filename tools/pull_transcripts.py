"""Download description + auto-caption transcript for Walkie Talkie episodes.

Default (no args): NYC-candidate episodes by title filter -> research/walkie_talkie_raw.json
Explicit list:     python3 tools/pull_transcripts.py --out research/la/raw.json ID1 ID2 ...
"""
import json, re, sys, time, html as htmlmod, urllib.request

S = 'research/'
videos = json.load(open(S + 'paulieb_videos.json'))

args = sys.argv[1:]
OUT = S + 'walkie_talkie_raw.json'
if '--out' in args:
    i = args.index('--out'); OUT = args[i + 1]; del args[i:i + 2]

if args:  # explicit video IDs
    episodes = {vid: videos.get(vid, {'title': '?', 'published': '?'}) for vid in args}
    print(len(episodes), 'episodes (explicit list)', file=sys.stderr)
else:
    WT = re.compile(r'walkie|a day (with|w/|taking)|day of street|street photography (in|at|on)', re.I)
    NOT_NYC = re.compile(r'Manila|Philippin|Rome|Naples|Italy|Los Angeles|L\.A\.|\bLA\b|Oakland|Austin|Dallas|Chicago|Atlanta|'
                         r'\bSF\b|San Francisco|Philadelphia|U\.S\. Tour|around the U\.?S|Toronto|DC Cherry|Denver', re.I)
    episodes = {k: v for k, v in videos.items() if WT.search(v['title']) and not NOT_NYC.search(v['title'])}
    print(len(episodes), 'NYC-candidate episodes', file=sys.stderr)

UA_ANDROID = 'com.google.android.youtube/20.10.38 (Linux; U; Android 11) gzip'

def player(vid):
    body = json.dumps({'context': {'client': {'clientName': 'ANDROID', 'clientVersion': '20.10.38', 'androidSdkVersion': 30}},
                       'videoId': vid}).encode()
    req = urllib.request.Request('https://www.youtube.com/youtubei/v1/player', data=body,
                                 headers={'Content-Type': 'application/json', 'User-Agent': UA_ANDROID})
    return json.load(urllib.request.urlopen(req, timeout=30))

def transcript(url):
    raw = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA_ANDROID}), timeout=30).read().decode('utf-8', 'ignore')
    out = []
    for m in re.finditer(r'<p t="(\d+)"[^>]*>(.*?)</p>', raw, re.S):
        txt = htmlmod.unescape(re.sub(r'<[^>]+>', '', m.group(2))).replace('\n', ' ').strip()
        if txt:
            out.append((int(m.group(1)) // 1000, txt))
    return out

results = {}
for i, (vid, meta) in enumerate(episodes.items(), 1):
    try:
        p = player(vid)
        details = p.get('videoDetails', {})
        tracks = p.get('captions', {}).get('playerCaptionsTracklistRenderer', {}).get('captionTracks', [])
        en = next((t for t in tracks if t.get('languageCode', '').startswith('en')), None)
        lines = transcript(en['baseUrl']) if en else []
        results[vid] = {'title': meta['title'], 'published': meta['published'],
                        'lengthSeconds': int(details.get('lengthSeconds', 0)),
                        'description': details.get('shortDescription', ''),
                        'transcript': lines}
        print(f'{i:2d}/{len(episodes)} {vid} lines={len(lines):4d} {meta["title"][:60]}', file=sys.stderr)
    except Exception as e:
        results[vid] = {'title': meta['title'], 'error': str(e), 'transcript': []}
        print(f'{i:2d}/{len(episodes)} {vid} ERROR {e}', file=sys.stderr)
    time.sleep(0.7)

json.dump(results, open(OUT, 'w'))
ok = sum(1 for r in results.values() if r['transcript'])
print(f'{ok}/{len(results)} episodes with transcripts saved')
