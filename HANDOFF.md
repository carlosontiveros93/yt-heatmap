# Handoff — expanding yt-heatmap to LA and Philly

Paste this into a fresh Claude Code session opened in `~/projects/yt-heatmap`.

---

I'm Carlos. I'm newer to coding and git; explain the "why" as you go, plain language
first, and ask before anything destructive or out of scope. Stop after each step for
me to confirm before starting the next.

## What this project is

`~/projects/yt-heatmap` is a Leaflet map of where NYC street photographers say to
shoot and where they actually shoot, built from Paulie B's YouTube channel. Read
README.md first — it has the data model and every rule we settled on. Then skim
data.js, boundaries.js, index.html, tools/README.md. Live site:
https://carlosontiveros93.github.io/yt-heatmap/ (GitHub Pages from `main`; `gh` is
logged in; workflow is `git add . && git commit -m "..." && git push`).

Current state: 78 spots, 173 mentions, 47 sources, 20 pins. Five visual kinds:
neighborhood/park areas, corridors (lines), landmark dots, pins (exact spots, always
visible, on top). Data was built by the pipeline in `tools/` (pull transcripts →
gazetteer scan → full reads by parallel reader agents → proposal doc → my approval →
write → browser verify → commit). Reader results and proposals are in `research/`.

## The plan, in order

**Step 1 — make the site multi-city, no visible change for NYC.** Move NYC's
`data.js` and `boundaries.js` into `cities/nyc/` with a small config (name, start
center/zoom, intro text). `index.html` reads `?city=` from the URL (default nyc) and
gets a city switcher in the sidebar. NYC must come out pixel-identical; commit a clean
"before" first. Do not add any city data in this step.

**Step 2 — Los Angeles.** Sources: Paulie B's LA Walkie Talkie episodes — Stephen
Vanasco (cpdytzJ24xo), Daniel Gutierrez (7dgmZX3QPQI), Jeremy Paige (E97-PxWYPAI),
Adali Schell (lXjlicEMJt0). Two U.S.-tour episodes have no city in title or
description and might be LA: Nazir Wayman (kQKkKCdwZA8), C.P. Plunkett (1uOiTskNYWs)
— check their transcripts first. Reuse `tools/pull_transcripts.py` (edit the video
list) and the same read → propose → review loop. Shapes: the LA Times "Mapping L.A."
neighborhood boundaries (GeoJSON) plus LA parks; expect corridors to matter more than
in NYC (Broadway downtown, Hollywood Blvd, the Venice boardwalk). Show me the
proposal before writing anything.

**Step 3 — Philadelphia.** Paulie has one Philly episode (Olu Okiemute, eloT_IvSaOI)
— enough to seed a few spots, not a map. Before pulling anything, run a search pass
for other sources (other YouTube channels' Philly street-photography walk-and-talks,
"best spots" videos, local photographer interviews) and bring me a candidate list to
approve one by one; I've agreed other channels are fine as long as I approve each.
Shapes: OpenDataPhilly neighborhoods and parks. I live near Philly, so I can verify
places by eye.

## Rules that carry over (all in README.md)
- Shot-there counts, regular haunt counts, biography and borough-level don't.
- Small and accurate beats large and lumped; overlapping small shapes are fine;
  hand-drawn cores replace oversized official areas.
- A one-person list of many neighborhoods waits for a second mention.
- One person is not counted twice for the same spot across episodes.
- Pins are exact spots where someone demonstrably shot — said it, or seen on camera
  (I watch to verify). "We're starting at X" is not enough. Shop portraits are not pins.
- High/medium confidence only; when in doubt, leave it out and tell me why.

Start with Step 1.
