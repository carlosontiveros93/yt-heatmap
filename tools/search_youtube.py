"""Search YouTube for candidate source videos (any channel) and save the hits.

    python3 tools/search_youtube.py research/philly/search.json "philadelphia street photography" "philly street photography pov" ...

Uses the same InnerTube endpoint the channel puller uses, one request per query
(plus one continuation page each), and keeps every video result with its channel,
length, view count, age and description snippet. Nothing is downloaded; the
transcripts are pulled only after the candidate list is approved.
"""
import json, re, sys, time, urllib.request

UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'}
CONTEXT = {'client': {'clientName': 'WEB', 'clientVersion': '2.20240701.01.00', 'hl': 'en', 'gl': 'US'}}

OUT, queries = sys.argv[1], sys.argv[2:]


def text(o):
    if not isinstance(o, dict):
        return ''
    return o.get('simpleText') or ''.join(r.get('text', '') for r in o.get('runs', []))


def search(query, continuation=None):
    body = {'context': CONTEXT}
    if continuation:
        body['continuation'] = continuation
    else:
        body['query'] = query
    req = urllib.request.Request('https://www.youtube.com/youtubei/v1/search?prettyPrint=false',
                                 data=json.dumps(body).encode(),
                                 headers={**UA, 'Content-Type': 'application/json'})
    return json.load(urllib.request.urlopen(req, timeout=30))


def walk(o, out, tokens):
    if isinstance(o, dict):
        if 'videoRenderer' in o:
            v = o['videoRenderer']
            out[v['videoId']] = {
                'title': text(v.get('title')),
                'channel': text(v.get('ownerText')) or text(v.get('longBylineText')),
                'length': text(v.get('lengthText')),
                'views': text(v.get('viewCountText')),
                'published': text(v.get('publishedTimeText')),
                'snippet': ' '.join(text(s) for s in (v.get('detailedMetadataSnippets') or [{}])[0].get('snippetText', {}).get('runs', [])) if v.get('detailedMetadataSnippets') else '',
            }
        if 'continuationCommand' in o and o.get('continuationCommand', {}).get('request') == 'CONTINUATION_REQUEST_TYPE_SEARCH':
            tokens.append(o['continuationCommand']['token'])
        for val in o.values():
            walk(val, out, tokens)
    elif isinstance(o, list):
        for val in o:
            walk(val, out, tokens)


results = {}
for q in queries:
    found, tokens = {}, []
    try:
        walk(search(q), found, tokens)
        if tokens:
            time.sleep(0.5)
            walk(search(q, tokens[0]), found, tokens)
    except Exception as e:
        print(f'ERROR {q!r}: {e}', file=sys.stderr)
    for vid, meta in found.items():
        entry = results.setdefault(vid, {**meta, 'queries': []})
        entry['queries'].append(q)
    print(f'{len(found):3d} results  {q}', file=sys.stderr)
    time.sleep(0.7)

json.dump(results, open(OUT, 'w'), indent=1)
print(len(results), 'distinct videos saved to', OUT)
