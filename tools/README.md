# tools

The pipeline that built the data, run from the repo root. Python 3 stdlib only.

1. `pull_channel.py` — full video list for a YouTube channel (InnerTube browse with
   continuations). Writes `research/paulieb_videos.json`. Edit the channel URL for
   another channel.
2. `pull_transcripts.py` — descriptions + auto-caption transcripts for the episodes
   matching the title filters at the top. Writes `research/walkie_talkie_raw.json`.
3. `scan_locations.py` — first-pass gazetteer scan of every transcript (official
   neighborhood + park names plus a hand list). Writes `research/walkie_talkie_scan.json`
   and a review table. Needs the two NYC Open Data GeoJSON files in `research/`
   (URLs are in `build_boundaries.py`); they are large and not committed.
4. Full reads: each strong-signal transcript is read start to finish (parallel reader
   agents, one per episode) against the rules in the main README, returning JSON per
   episode into `research/reader-results/`. Human review of a proposal document
   (`research/proposals/`) happens before anything is written to `data.js`.
5. `build_boundaries.py` — builds `boundaries.js` from the GeoJSON files, OSM (Domino
   Park) and the hand-drawn shapes listed inside it. Rerun after editing shapes.

For a new city: a `research/<city>/` folder, the city's official neighborhood and
park GeoJSON, a gazetteer for the scan, and the same read → propose → review loop.
