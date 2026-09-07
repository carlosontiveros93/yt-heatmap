# Handoff — expanding yt-heatmap to LA and Philly (Step 1 done)

Paste this into a fresh Claude Code session opened in `~/Projects/yt-heatmap`.

---

I'm Carlos. I'm newer to coding and git; explain the "why" as you go, plain language
first, and ask before anything destructive or out of scope. Stop after each step for
me to confirm before starting the next.

## What this project is

`~/Projects/yt-heatmap` is a Leaflet map of where street photographers say to shoot
and where they actually shoot, built from Paulie B's YouTube channel. Read README.md
first — it has the data model and every rule we settled on. Then skim index.html,
cities/cities.js, cities/nyc/{config,data,boundaries}.js and tools/README.md. Live
site: https://carlosontiveros93.github.io/yt-heatmap/ (GitHub Pages from `main`;
`gh` is logged in; workflow is `git add . && git commit -m "..." && git push`).

Current state: NYC only — 78 spots, 173 mentions, 47 sources, 20 pins. Five visual
kinds: neighborhood/park areas, corridors (lines), landmark dots, pins (exact spots,
always visible, on top). Data was built by the pipeline in `tools/` (pull transcripts
→ gazetteer scan → full reads by parallel reader agents → proposal doc → my approval
→ write → browser verify → commit). Reader results and proposals are in `research/`.

## Step 1 — DONE (commit f14d7d9, pushed)

The site is multi-city with no visible change to the NYC map:
- `cities/cities.js` — registry of cities the sidebar switcher offers (id + name).
  It is separate from the per-city files because the switcher must know every city
  before any city's data loads.
- `cities/<id>/config.js` — `CITY = { id, name, title, pageTitle, center, zoom, intro }`
  (intro is HTML for the sidebar paragraph).
- `cities/<id>/data.js` (SPOTS / SOURCES / MENTIONS) and `cities/<id>/boundaries.js`
  (BOUNDARIES keyed by spot id) — same format as before, just moved.
- `index.html` reads `?city=` (unknown/missing → nyc), injects the three city scripts
  in order, then runs the map code inside `init()`. Switching city reloads the page
  with a new `?city=`.
- `tools/build_boundaries.py` writes to `cities/nyc/boundaries.js`; for another city
  it will need its own input GeoJSON paths and output path (parameterize it rather
  than copy it).
- Verified by rendering before/after headlessly (Playwright, tiles blocked) and
  pixel-diffing the map pane at zooms 11–15: 0 differing pixels. Reuse that idea
  when a change is supposed to be invisible.

Adding a city = one folder under `cities/` with those three files + one line in
`cities/cities.js`. Nothing else in index.html should need to change; if it does,
tell me why first.

## Step 2 — Los Angeles (start here)

Sources: Paulie B's LA Walkie Talkie episodes — Stephen Vanasco (cpdytzJ24xo),
Daniel Gutierrez (7dgmZX3QPQI), Jeremy Paige (E97-PxWYPAI), Adali Schell
(lXjlicEMJt0). Two U.S.-tour episodes have no city in title or description and might
be LA: Nazir Wayman (kQKkKCdwZA8), C.P. Plunkett (1uOiTskNYWs) — pull their
transcripts first and tell me whether they're LA before reading them for spots.

Order of work, stopping for me between each:
1. Pull descriptions + transcripts for all six (reuse `tools/pull_transcripts.py`;
   edit the video list; write to `research/la/`). Report which are LA.
2. Get the shapes: LA Times "Mapping L.A." neighborhood boundaries (GeoJSON) plus LA
   city/county parks. Put the downloads in `research/la/` and add them to .gitignore
   like the NYC ones. Build an LA gazetteer for the scan from those names plus a hand
   list of streets and landmarks photographers actually say (Broadway downtown,
   Hollywood Blvd, Venice boardwalk, Santee Alley, Grand Central Market, Chinatown,
   Little Tokyo, Koreatown, Echo Park, MacArthur Park, Santa Monica Pier…).
3. Full reads of each LA transcript against the rules below → a proposal document in
   `research/proposals/` listing every proposed spot, kind, shape source, mentions
   with quotes and timestamps, and confidence. Expect corridors to matter more than
   in NYC. Show me the proposal and wait.
4. Only after my approval: write `cities/la/config.js`, `data.js`, `boundaries.js`,
   add LA to `cities/cities.js`, verify in the browser (`python3 -m http.server 8749`,
   open `?city=la`, and confirm `?city=nyc` is unchanged), then commit and push.

## Step 3 — Philadelphia (after Step 2)

Paulie has one Philly episode (Olu Okiemute, eloT_IvSaOI) — enough to seed a few
spots, not a map. Before pulling anything, run a search pass for other sources (other
YouTube channels' Philly street-photography walk-and-talks, "best spots" videos, local
photographer interviews) and bring me a candidate list to approve one by one; I've
agreed other channels are fine as long as I approve each. Shapes: OpenDataPhilly
neighborhoods and parks. I live near Philly, so I can verify places by eye.

## Rules that carry over (all in README.md)
- Shot-there counts, regular haunt counts, biography and borough-level don't.
- Small and accurate beats large and lumped; overlapping small shapes are fine;
  hand-drawn cores replace oversized official areas.
- A one-person list of many neighborhoods waits for a second mention.
- One person is not counted twice for the same spot across episodes.
- Pins are exact spots where someone demonstrably shot — said it, or seen on camera
  (I watch to verify). "We're starting at X" is not enough. Shop portraits are not pins.
- High/medium confidence only; when in doubt, leave it out and tell me why.

Start with Step 2, item 1.
