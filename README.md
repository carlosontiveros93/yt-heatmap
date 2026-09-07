# yt-heatmap

An interactive heatmap of every NYC street photography spot recommended in
Paulie B's video ["I asked photographers in NYC: Where should visitors go for
street photography?"](https://www.youtube.com/watch?v=X0CbbpuR9vs).

- `index.html` — the map page (Leaflet + leaflet.heat from CDN, OpenStreetMap tiles)
- `data.js` — three tables: `SPOTS` (one per physical place: id, name, lat/lng,
  kind = landmark | park | neighborhood, boundary placeholder), `SOURCES` (one per
  video), and `MENTIONS` (one per recommendation: spotId, sourceId, speaker,
  visitor vs. favorite, quote, timestamp). Mention counts are derived, not stored.
- `transcript.txt` — the full auto-generated transcript the data was built from

Heat intensity and marker size = number of photographers who mentioned the spot
(Times Square leads with 5). Click any marker or sidebar entry for who said it
and a link that jumps to that moment in the video.

## Run it

```
python3 -m http.server 8749 --directory .
```

Then open http://localhost:8749. (It needs a local server rather than opening
the file directly because it loads `data.js` and map tiles.)
