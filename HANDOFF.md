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

## Step 2 — Los Angeles — DONE (commit d339a9b, pushed)

Result: 9 spots, 11 mentions, 3 pins from four episodes (Vanasco, Gutierrez, Paige, Schell).
Nazir Wayman (kQKkKCdwZA8) turned out to be **Philadelphia** (use it in Step 3); C.P. Plunkett
(1uOiTskNYWs) is Chicago. Proposal and decisions: `research/proposals/la_proposed.md`.
Decided: Gutierrez's past-tense haunts dropped; Northeast LA walk skipped; five medium pins
(Hollywood/Vine station, the Wiltern, Heat street, Wilton & Beverly, Paige's corner) left out
until someone watches the clips (timestamps in the proposal, section B).
Tools are now per-city: `scan_locations.py <city>` + `gazetteers/<city>.py`,
`build_boundaries.py <city>` + `boundaries/<city>.py`; NYC output verified byte-identical.

Original plan, for reference:

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

## Step 3 — Philadelphia (start here)

Paulie has two Philly episodes: Olu Okiemute (eloT_IvSaOI) and Nazir Wayman (kQKkKCdwZA8,
already pulled to `research/la/raw.json`; move it to `research/philly/`) — enough to seed a
few spots, not a map. Before pulling anything, run a search pass for other sources (other
YouTube channels' Philly street-photography walk-and-talks, "best spots" videos, local
photographer interviews) and bring me a candidate list to approve one by one; I've
agreed other channels are fine as long as I approve each. Shapes: OpenDataPhilly
neighborhoods and parks. I live near Philly, so I can verify places by eye.

### Step 3 progress — 2026-09-21 (not yet approved)

- Paulie's two Philly episodes are pulled (`research/philly/raw.json`, timestamped transcripts in
  `research/philly/transcripts/`), fully read (two independent readers → merge → adversarial verify;
  results in `research/philly/reader-results/`), and proposed in
  `research/proposals/philly_proposed.md`: 7 spots / 13 mentions at my lean, 3 high pins, all Center City.
- Shapes are ready: OpenDataPhilly neighborhoods + PPR parks downloaded (gitignored), gazetteer in
  `tools/gazetteers/philly.py`, boundary definitions in `tools/boundaries/philly.py` (preview built to
  `research/philly/boundaries_preview.js`; `cities/philly/` untouched).
- Source search done: `research/philly/sources_candidates.md` lists ~60 candidate videos in tiers,
  from 23 YouTube searches (`tools/search_youtube.py`) plus full video lists of 14 channels
  (`research/philly/channels/`). Nothing beyond Paulie's two episodes has been pulled.
- Next: Carlos answers the decisions in section D of the proposal and approves sources; then pull the
  approved transcripts, read them the same way, extend the proposal, and only then write `cities/philly/`.
- Note: Nazir's episode was re-pulled fresh rather than moved out of `research/la/raw.json`, so the LA
  raw file still contains it (harmless; the LA scan ignores it).

### Step 3 — Philly LIVE with Paulie's two episodes (2026-11-05)

Carlos answered section D of the proposal and approved the list; `cities/philly/` is written and
Philadelphia is in `cities/cities.js`. **9 spots, 16 mentions, 2 pins, 5 shapes**, all Center City
(`areaLabel: "Area"`, every spot `area: "Center City"` except the Broad Street Line, which is `null`).
- Decided: Dilworth shot-here only (haunt dropped); Walnut St corridor kept (Olu shot-here + Nazir
  haunt); JFK Blvd and 10th St left out (commented out in `tools/boundaries/philly.py`); SEPTA Broad
  Street Line kept at medium as a landmark dot; City Hall shape = Dilworth Park trace.
- Pins written: Broad & Walnut, 18th & Walnut. City Hall Station is a landmark dot, not a pin.
- Pins NOT written, waiting for Carlos to watch the clips (he had no preference on which to check):
  the pit at the MSB plaza (Nazir 40:08–40:40), City Hall Station platform (Olu 24:16–25:30),
  Dilworth Park (Olu 14:42–22:42), Chestnut St portrait (Olu 8:05–9:10), second Metzker spot
  (Nazir 25:36–26:21), Olu's corner shot (30:47–31:21). Details in the proposal, section B.
- Done since (see next block): other-channel sources. Carlos chose "go live first, sources after": show him Tier A of
  `research/philly/sources_candidates.md` video by video, pull only what he approves, read the same
  way, extend the proposal, get approval, then add. Nothing non-Paulie has been pulled.
- Gotcha: after editing `cities/cities.js` the browser can serve a cached copy and fall back to NYC;
  hard reload.

### Step 3 — other channels added (2026-11-05)

Carlos approved all 20 Tier A videos one by one, then the proposal
(`research/proposals/philly_other_sources_proposed.md`, his answers = section D). Philly is now
**20 spots, 37 mentions, 4 pins, 14 sources** (2 Paulie + 12 from other channels).
- Added: pins 15th & Chestnut (Sam Rivera) and City Hall west archway (Dante Sisofo); City Hall
  (hand-drawn building footprint); Chinatown (OpenDataPhilly shape); Market St East (City Hall to
  10th) and South St (Front to 10th), both extents chosen by Carlos; Southeast Asian Market dot in
  FDR Park (approximate); the El as a citywide dot; Dante's three "Philly in Flux" avenue walks
  (Lehigh, Woodland, Germantown) as long lines. Extra mentions on Rittenhouse (now 4 people),
  Dilworth, Walnut and Chestnut.
- Areas now: Center City, South / North / Southwest / Northwest Philadelphia; config zoom 13.
- How it was read: one reader agent per photographer, then all 65 quotes machine-checked against
  the transcripts. No second reader or refuter this round.
- Corridor lines are traced from OpenStreetMap (`research/philly/osm_corridors.json`, Overpass;
  overpass-api.de worked this time, kumi timed out) and stored in `tools/boundaries/philly.py`.
- **index.html changed (Carlos OK'd):** popup rows whose source channel is not "Paulie B" read
  "shot here · <channel>" / "regular spot · <channel>". Other-channel mentions still use
  `type: "walkie-talkie"` so filters and counts work unchanged. NYC/LA sources are all Paulie B.
- Open: the blue filter chip still says "Walkie Talkie" in Philly (suggest a per-city label);
  the 20 other-channel transcripts and `raw_other.json` stay on Carlos's disk only (his decision,
  2026-11-05: third-party transcripts do not go in the public repo; they are in .gitignore); Tier B (16 videos) untouched;
  left-out items and footage leads (Lancaster Ave, Spencer's wall at 11:42, Friendship Gate,
  12th & Market) are in the proposal, section C.

## Polish pass — DONE (2026-11-01, commits 6b8277d, 785e156, fee82d4, d4a5480 + this one)

The UI changed; data did not (only the `area` field was added to every spot).
- **Clustering** — landmark dots that would overlap fold into a numbered bubble from
  zoom 11 up (Leaflet.markercluster 1.5.3, cluster radius 28px, no clustering at 15+).
  Pins, areas and corridors never cluster. A sidebar click on a clustered dot flies to
  it and opens its popup once the move settles.
- **Filters** — kind chips, mention-type chips and an area dropdown (`areaLabel` in
  config.js names it: Borough / Area). All in the URL (`kind=`, `type=`, `area=`), with
  "showing N of M spots" and a reset link. See README "Filters and URL parameters".
- **Data** — every SPOTS row has `area` (borough/region, `null` = citywide, e.g. NYC
  Subway). A new city's spots need it too, or the dropdown hides itself.
- **Phone layout** — under 700px the map fills the screen and the sidebar is a bottom
  sheet (collapsed 120px / half / full; drag the handle or title, tap to step; tapping a
  spot, a shape or the bare map drops it). All of it is CSS inside one
  `@media (max-width: 699px)` block plus ~40 lines of JS; desktop is untouched.
- **Small things** — theme-color and apple-mobile-web-app-capable meta tags, popup
  "watch" links carry `rel="noopener"`, the "no boundary for …" console note only
  prints with `?debug=1`.
- **How it was verified** — headless Chrome (Playwright) rendering before/after and
  pixel-diffing the map pane and the whole page at 1280 and 700 wide, zooms 10–15,
  both cities (0 differing pixels for every step); plus scripted phone checks at
  390/430/375/320 wide. Reuse the idea: any change meant to be invisible on desktop
  should come with that diff.
- Still open, not planned: choosing an area filters the map but does not move it.

## Rules that carry over (all in README.md)
- Shot-there counts, regular haunt counts, biography and borough-level don't.
- Small and accurate beats large and lumped; overlapping small shapes are fine;
  hand-drawn cores replace oversized official areas.
- A one-person list of many neighborhoods waits for a second mention.
- One person is not counted twice for the same spot across episodes.
- Pins are exact spots where someone demonstrably shot — said it, or seen on camera
  (I watch to verify). "We're starting at X" is not enough. Shop portraits are not pins.
- High/medium confidence only; when in doubt, leave it out and tell me why.

Start by asking Carlos what is next: the Philly filter-chip label, Tier B sources, or the unverified pins.
