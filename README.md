# yt-heatmap

An interactive map of where NYC street photographers say to shoot — and where
they actually shoot. Two layers of evidence from Paulie B's YouTube channel:

- ["I asked photographers in NYC: Where should visitors go for street
  photography?"](https://www.youtube.com/watch?v=X0CbbpuR9vs) — ~10 photographers
  recommend spots for visitors and name their own favorites.
- 46 episodes of the *Walkie Talkie* series — a day shooting with one
  photographer, usually on their home turf. Each mention records whether they
  shot there in the episode (`basis: "shot-here"`) or named it as a regular
  spot (`basis: "haunt"`). Only episodes with clear location signal were used;
  borough-level statements and biography ("I grew up in the Bronx") were not
  counted.

Shapes follow one rule: **small and accurate beats large and lumped**. Where an
official boundary is far bigger than what a photographer meant, a hand-drawn core
replaces it, and overlapping spots (East Village, Tompkins Square Park, Alphabet
City) are kept separate rather than merged. A place gets its own shape once a
photographer names it specifically; one-person lists of many neighborhoods wait
for a second mention.

**Pins** are the precision layer: an exact corner, intersection or venue where a
photographer demonstrably shot — either said so ("three rolls in an hour just on
this one corner") or is seen shooting there in the episode (verified by watching,
not just the transcript). High confidence only; "we're starting at X" is not
enough on its own. A pin sits alongside that person's mention on the containing
area rather than replacing it. Shops a photographer visited for portraits are not
pins — those are relationships, not spots.

- `index.html` — the map page (Leaflet, leaflet.heat and Leaflet.markercluster from
  CDN, OpenStreetMap tiles). Picks a city from `?city=` in the URL (default `nyc`) and
  loads that city's three files from `cities/<id>/`; the sidebar has a city switcher.
  Landmark dots that would overlap collapse into a numbered cluster bubble from zoom 11
  up (pins, areas and corridors never cluster). Under 700px wide the sidebar becomes a
  bottom sheet over a full-screen map: drag the handle or the title between collapsed,
  half and full.
- `cities/cities.js` — the list of cities the switcher offers (id + display name).
- `cities/<id>/config.js` — that city's name, page title, start center/zoom and intro text.
- `cities/<id>/data.js` — three tables: `SPOTS` (one per physical place: id, name, lat/lng,
  kind = landmark | park | neighborhood | corridor | pin, area = borough or region for the
  sidebar's area filter, null for citywide), `SOURCES` (one per video), and
  `MENTIONS` (one per time a speaker names a spot: spotId, sourceId, speaker,
  type = visitor | favorite | walkie-talkie, basis for walkie-talkie rows, quote,
  timestamp). Mention counts are derived, not stored. Philadelphia also uses videos from
  other channels (each approved by hand); those rows keep type `walkie-talkie` and the
  popup names the source's channel instead of "Walkie Talkie".
- `cities/<id>/boundaries.js` — shapes keyed by spot id. Polygons render as filled areas and
  LineStrings as thick corridor lines (color = mention count); anything without a
  shape falls back to a dot. Sources: NYC Open Data NTA 2020 and Parks Properties
  where the official area matches what the speaker meant, OpenStreetMap (Domino
  Park), and hand-drawn approximations where it doesn't (each entry's `source`
  says which).
- `transcript.txt` — the full auto-generated transcript the data was built from

Area color, corridor width and marker size = number of photographers who mentioned
the spot (Midtown leads). Click any shape, marker or sidebar entry for who said it
and a link that jumps to that moment in the video.

## Filters and URL parameters

The sidebar filters by kind of spot (chips), kind of mention (chips) and area
(dropdown: boroughs in NYC, regions in LA). A spot stays when its kind is on, it has
at least one mention of a type that is on, and it is in the chosen area (a citywide
spot passes every area). Its color, size and ×N count only the mentions that are on;
the popup still lists every mention. The heat layer is rebuilt from what remains.

Filters live in the URL, so a filtered view can be shared:

| parameter | values | absent means |
|---|---|---|
| `city` | `nyc`, `la` (see `cities/cities.js`) | `nyc` |
| `kind` | comma list of `neighborhood`, `park`, `corridor`, `landmark`, `pin` | all |
| `type` | comma list of `visitor`, `favorite`, `walkie-talkie` | all |
| `area` | one area name as it appears in the dropdown, e.g. `Queens` | all |
| `debug` | `1` to log console notes (e.g. which spots have no boundary) | quiet |

Example: `?city=nyc&kind=pin,corridor&type=walkie-talkie&area=Brooklyn`. "reset" in
the sidebar clears everything but `city`.

## Run it

```
python3 -m http.server 8749 --directory .
```

Then open http://localhost:8749 (or http://localhost:8749/?city=nyc). (It needs a local server rather than opening
the file directly because it loads `data.js` and map tiles.)
