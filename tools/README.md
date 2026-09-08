# tools

The pipeline that built the data, run from the repo root. Python 3 stdlib only.

1. `pull_channel.py` — full video list for a YouTube channel (InnerTube browse with
   continuations). Writes `research/paulieb_videos.json`. Edit the channel URL for
   another channel.
2. `pull_transcripts.py` — descriptions + auto-caption transcripts for the episodes
   matching the title filters at the top. Writes `research/walkie_talkie_raw.json`.
3. `scan_locations.py [city]` — first-pass gazetteer scan of every transcript (official
   neighborhood + park names plus a hand list). Default city is `nyc`: writes
   `research/walkie_talkie_scan.json` and a review table. `la` reads `research/la/raw.json`
   and writes `research/la/scan.json` + `review.md`. Each city's gazetteer is
   `gazetteers/<city>.py` (a `build()` returning names + noise words, plus the input/output
   paths and the download URLs for its GeoJSON, which are large and not committed).
   LA uses the LA Times "Mapping L.A." neighborhoods and the LA County DPR countywide
   parks layer (covers every agency's parks, city and county).
4. Full reads: each strong-signal transcript is read start to finish (parallel reader
   agents, one per episode) against the rules in the main README, returning JSON per
   episode into `research/reader-results/`. Human review of a proposal document
   (`research/proposals/`) happens before anything is written to `data.js`.
5. `build_boundaries.py [city]` — builds `cities/<city>/boundaries.js` from the official GeoJSON
   plus hand-drawn shapes. Per-city definitions (which official features to use, hand-drawn
   polygons, corridor waypoints, extras like the OSM Domino Park trace) are in
   `boundaries/<city>.py`. Rerun after editing shapes. LA corridor and pin coordinates were
   snapped to OSM intersections (Overpass API) rather than eyeballed.

For a new city: a `cities/<id>/` folder (config.js, data.js, boundaries.js) plus an
entry in `cities/cities.js`; a `research/<city>/` folder, the city's official neighborhood and
park GeoJSON, a gazetteer for the scan, and the same read → propose → review loop.
