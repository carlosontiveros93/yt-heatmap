# yt-heatmap

An interactive map of where NYC street photographers say to shoot — and where
they actually shoot. Two layers of evidence from Paulie B's YouTube channel:

- ["I asked photographers in NYC: Where should visitors go for street
  photography?"](https://www.youtube.com/watch?v=X0CbbpuR9vs) — ~10 photographers
  recommend spots for visitors and name their own favorites.
- 16 episodes of the *Walkie Talkie* series — a day shooting with one
  photographer, usually on their home turf. Each mention records whether they
  shot there in the episode (`basis: "shot-here"`) or named it as a regular
  spot (`basis: "haunt"`). Only episodes with clear location signal were used;
  borough-level statements and biography ("I grew up in the Bronx") were not
  counted.

- `index.html` — the map page (Leaflet + leaflet.heat from CDN, OpenStreetMap tiles)
- `data.js` — three tables: `SPOTS` (one per physical place: id, name, lat/lng,
  kind = landmark | park | neighborhood | corridor), `SOURCES` (one per video), and
  `MENTIONS` (one per time a speaker names a spot: spotId, sourceId, speaker,
  type = visitor | favorite | walkie-talkie, basis for walkie-talkie rows, quote,
  timestamp). Mention counts are derived, not stored.
- `boundaries.js` — shapes keyed by spot id. Polygons render as filled areas and
  LineStrings as thick corridor lines (color = mention count); anything without a
  shape falls back to a dot. Sources: NYC Open Data NTA 2020 and Parks Properties
  where the official area matches what the speaker meant, OpenStreetMap (Domino
  Park), and hand-drawn approximations where it doesn't (each entry's `source`
  says which).
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
