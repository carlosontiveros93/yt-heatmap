"""Pull the full video list for a YouTube channel via the page data + browse continuations."""
import json, re, sys, time, urllib.request

UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'}
S = 'research/'

html = urllib.request.urlopen(urllib.request.Request('https://www.youtube.com/@PaulieB/videos', headers=UA)).read().decode('utf-8', 'ignore')
data = json.loads(re.search(r'var ytInitialData = (\{.*?\});</script>', html, re.S).group(1))
cfg = json.loads(re.search(r'ytcfg\.set\((\{.*?\})\);', html, re.S).group(1))
api_key = cfg['INNERTUBE_API_KEY']
client_version = cfg['INNERTUBE_CONTEXT']['client']['clientVersion']

videos = {}
def walk(o, out, tokens):
    if isinstance(o, dict):
        # classic videoRenderer shape
        if 'videoId' in o and 'title' in o and isinstance(o['title'], dict):
            t = o['title'].get('runs', [{}])[0].get('text') or o['title'].get('simpleText')
            if t:
                pub = (o.get('publishedTimeText') or {}).get('simpleText', '')
                length = ((o.get('lengthText') or {}).get('simpleText', ''))
                out[o['videoId']] = {'title': t, 'published': pub, 'length': length}
        # newer lockupViewModel shape
        if o.get('contentType') == 'LOCKUP_CONTENT_TYPE_VIDEO' and 'contentId' in o:
            meta = o.get('metadata', {}).get('lockupMetadataViewModel', {})
            t = meta.get('title', {}).get('content')
            rows = meta.get('metadata', {}).get('contentMetadataViewModel', {}).get('metadataRows', [])
            parts = [p.get('text', {}).get('content', '') for r in rows for p in r.get('metadataParts', [])]
            if t:
                out[o['contentId']] = {'title': t, 'published': next((p for p in parts if 'ago' in p), ''), 'length': ''}
        if 'continuationCommand' in o:
            tokens.append(o['continuationCommand']['token'])
        for v in o.values(): walk(v, out, tokens)
    elif isinstance(o, list):
        for v in o: walk(v, out, tokens)

tokens = []
walk(data, videos, tokens)

def browse(token):
    body = json.dumps({'context': cfg['INNERTUBE_CONTEXT'], 'continuation': token}).encode()
    req = urllib.request.Request('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false', data=body,
                                 headers={**UA, 'Content-Type': 'application/json', 'X-Youtube-Client-Name': '1',
                                          'X-Youtube-Client-Version': client_version})
    return json.load(urllib.request.urlopen(req))

# The page carries several continuation tokens (other tabs/sorts); the videos
# grid is whichever one actually yields videos.
page = 1
while tokens:
    candidates, tokens = tokens, []
    progressed = False
    for token in candidates:
        found, more = {}, []
        walk(browse(token), found, more)
        if found:
            new = {k: v for k, v in found.items() if k not in videos}
            videos.update(found)
            tokens = more
            progressed = bool(new)
            page += 1
            print(f'page {page}: {len(videos)} videos', file=sys.stderr)
            break
        time.sleep(0.3)
    if not progressed: break
    time.sleep(0.5)

json.dump(videos, open(S + 'paulieb_videos.json', 'w'), indent=1)
print(len(videos), 'videos saved')
