// Data model:
//   SPOTS    — one entry per physical place. `kind` is landmark | park | neighborhood
//              (later decides dot vs. filled area). `boundary` is reserved for a
//              polygon and is null until one is drawn.
//   SOURCES  — one entry per video the mentions came from.
//   MENTIONS — one entry per time a speaker recommends a spot. `type` is
//              "visitor" (recommended for first-time visitors) or "favorite"
//              (the speaker's own current favorite). `timestamp` is seconds into
//              the source video. Mention counts are derived, never stored.

const SPOTS = [
  // neighborhoods
  { id: "midtown",              name: "Midtown",                                   lat: 40.7549, lng: -73.9840, kind: "neighborhood", boundary: null },
  { id: "midtown-34th-to-park", name: "Midtown (34th St to the park, 9th to Lex)", lat: 40.7529, lng: -73.9827, kind: "neighborhood", boundary: null },
  { id: "alphabet-city",        name: "Alphabet City (East Village)",              lat: 40.7248, lng: -73.9793, kind: "neighborhood", boundary: null },
  { id: "bushwick",             name: "Bushwick — under the Broadway el",          lat: 40.6934, lng: -73.9272, kind: "neighborhood", boundary: null },
  { id: "blissville",           name: "Blissville (Queens)",                       lat: 40.7373, lng: -73.9319, kind: "neighborhood", boundary: null },
  { id: "coney-island",         name: "Coney Island",                              lat: 40.5749, lng: -73.9786, kind: "neighborhood", boundary: null },
  { id: "crown-heights",        name: "Crown Heights (Kingston Ave & Eastern Pkwy)", lat: 40.6690, lng: -73.9422, kind: "neighborhood", boundary: null },
  { id: "bed-stuy",             name: "Bed-Stuy",                                  lat: 40.6872, lng: -73.9418, kind: "neighborhood", boundary: null },
  { id: "flatbush",             name: "Flatbush",                                  lat: 40.6415, lng: -73.9594, kind: "neighborhood", boundary: null },
  { id: "lower-east-side",      name: "Lower East Side",                           lat: 40.7168, lng: -73.9861, kind: "neighborhood", boundary: null },
  { id: "financial-district",   name: "Financial District",                        lat: 40.7075, lng: -74.0113, kind: "neighborhood", boundary: null },
  { id: "chinatown",            name: "Chinatown",                                 lat: 40.7158, lng: -73.9970, kind: "neighborhood", boundary: null },
  { id: "tribeca",              name: "Tribeca",                                   lat: 40.7163, lng: -74.0086, kind: "neighborhood", boundary: null },
  { id: "soho",                 name: "Soho",                                      lat: 40.7233, lng: -74.0030, kind: "neighborhood", boundary: null },
  { id: "flushing",             name: "Flushing",                                  lat: 40.7596, lng: -73.8301, kind: "neighborhood", boundary: null },
  { id: "jackson-heights",      name: "Jackson Heights",                           lat: 40.7557, lng: -73.8831, kind: "neighborhood", boundary: null },
  { id: "corona",               name: "Corona",                                    lat: 40.7450, lng: -73.8643, kind: "neighborhood", boundary: null },

  // parks
  { id: "tompkins-square-park",   name: "East Village / Tompkins Square Park", lat: 40.7265, lng: -73.9818, kind: "park", boundary: null },
  { id: "domino-park",            name: "Domino Park (Williamsburg)",          lat: 40.7146, lng: -73.9672, kind: "park", boundary: null },
  { id: "high-line",              name: "The High Line",                       lat: 40.7480, lng: -74.0048, kind: "park", boundary: null },
  { id: "washington-square-park", name: "Washington Square Park",              lat: 40.7308, lng: -73.9973, kind: "park", boundary: null },
  { id: "central-park",           name: "Central Park",                        lat: 40.7712, lng: -73.9742, kind: "park", boundary: null },

  // landmarks
  { id: "times-square",                   name: "Times Square",                                lat: 40.7580, lng: -73.9855, kind: "landmark", boundary: null },
  { id: "fifth-ave-42nd-to-central-park", name: "Fifth Avenue (42nd St to Central Park)",      lat: 40.7575, lng: -73.9780, kind: "landmark", boundary: null },
  { id: "fifth-ave-47th-to-57th",         name: "Fifth Ave, 47th to 57th St",                  lat: 40.7601, lng: -73.9750, kind: "landmark", boundary: null },
  { id: "diamond-district-47th",          name: "47th St btwn 5th & 6th (Diamond District)",   lat: 40.7573, lng: -73.9794, kind: "landmark", boundary: null },
  { id: "14th-st-1st-ave",                name: "14th St & 1st Ave / Ave A corners",           lat: 40.7317, lng: -73.9829, kind: "landmark", boundary: null },
  { id: "bethesda-fountain",              name: "Central Park — Bethesda Fountain",            lat: 40.7659, lng: -73.9711, kind: "landmark", boundary: null },
  { id: "central-park-rock",              name: "Central Park — the rock (near Heckscher)",    lat: 40.7690, lng: -73.9780, kind: "landmark", boundary: null },
  { id: "sheep-meadow",                   name: "Central Park — Sheep Meadow",                 lat: 40.7719, lng: -73.9754, kind: "landmark", boundary: null },
  { id: "sailboat-pond",                  name: "Central Park — sailboat pond",                lat: 40.7743, lng: -73.9668, kind: "landmark", boundary: null },
  { id: "east-river-waterfront",          name: "East River waterfront",                       lat: 40.7290, lng: -73.9720, kind: "landmark", boundary: null },
  { id: "west-side-highway",              name: "West Side Highway / Hudson waterfront",       lat: 40.7460, lng: -74.0086, kind: "landmark", boundary: null },
  { id: "nyc-subway-elevated",            name: "NYC Subway (J/M/F elevated lines)",           lat: 40.7132, lng: -73.9576, kind: "landmark", boundary: null },
];

const SOURCES = [
  {
    id: "paulie-b-where-to-shoot",
    title: "I asked photographers in NYC: Where should visitors go for street photography?",
    channel: "Paulie B",
    url: "https://www.youtube.com/watch?v=X0CbbpuR9vs",
  },
];

const SRC = "paulie-b-where-to-shoot";

const MENTIONS = [
  { spotId: "nyc-subway-elevated",  sourceId: SRC, speaker: "Jeffrey", type: "visitor",  timestamp: 24,  quote: "“The city underneath the city” — likes lines that go above ground (J, M, F to Coney)." },
  { spotId: "bushwick",             sourceId: SRC, speaker: "Jeffrey", type: "favorite", timestamp: 68,  quote: "His neighborhood; shooting underneath the elevated tracks on Broadway." },

  { spotId: "fifth-ave-42nd-to-central-park", sourceId: SRC, speaker: "Rob", type: "visitor",  timestamp: 93,  quote: "“Just go.” Any day, any time." },
  { spotId: "diamond-district-47th",          sourceId: SRC, speaker: "Rob", type: "favorite", timestamp: 109, quote: "“You never know who you're going to run into.”" },

  { spotId: "midtown",               sourceId: SRC, speaker: "John", type: "visitor",  timestamp: 155, quote: "Easiest place to start — density, mix of tourists and workers." },
  { spotId: "tompkins-square-park",  sourceId: SRC, speaker: "John", type: "visitor",  timestamp: 173, quote: "Where he spends 90% of his time." },
  { spotId: "east-river-waterfront", sourceId: SRC, speaker: "John", type: "visitor",  timestamp: 182, quote: "Good for portraits and scenery along the water." },
  { spotId: "west-side-highway",     sourceId: SRC, speaker: "John", type: "visitor",  timestamp: 213, quote: "“Anywhere along the water is nice. Both sides.”" },
  { spotId: "domino-park",           sourceId: SRC, speaker: "John", type: "visitor",  timestamp: 216, quote: "Scenery and skyline — more to play with than just people." },
  { spotId: "alphabet-city",         sourceId: SRC, speaker: "John", type: "favorite", timestamp: 246, quote: "Very neighbor-hoody; loves the community aspect." },
  { spotId: "14th-st-1st-ave",       sourceId: SRC, speaker: "John", type: "favorite", timestamp: 287, quote: "First L stop into Manhattan; good mix of people 3–7pm, great light down 14th St." },

  { spotId: "midtown-34th-to-park", sourceId: SRC, speaker: "Tall photographer", type: "visitor",  timestamp: 359, quote: "Coming from Denver/Albuquerque: “what you get in a week elsewhere you get in a day here.”" },
  { spotId: "high-line",            sourceId: SRC, speaker: "Tall photographer", type: "favorite", timestamp: 386, quote: "“My favorite park. Hard to make images there, but rewarding.”" },

  { spotId: "times-square", sourceId: SRC, speaker: "Ian", type: "visitor",  timestamp: 444, quote: "“Just blow it open at Times Square, then trickle around.”" },
  { spotId: "blissville",   sourceId: SRC, speaker: "Ian", type: "favorite", timestamp: 492, quote: "Little triangle between Greenpoint and Sunnyside; a project is building there." },

  { spotId: "fifth-ave-47th-to-57th", sourceId: SRC, speaker: "Ilya", type: "visitor",  timestamp: 536, quote: "Corners of 5th & 47th and 5th & 57th are good." },
  { spotId: "times-square",           sourceId: SRC, speaker: "Ilya", type: "visitor",  timestamp: 552, quote: "Good place to get acclimated — lots of people, lots of cameras." },
  { spotId: "high-line",              sourceId: SRC, speaker: "Ilya", type: "visitor",  timestamp: 572, quote: "Nice and interesting, good density, cool scenery." },
  { spotId: "coney-island",           sourceId: SRC, speaker: "Ilya", type: "favorite", timestamp: 593, quote: "Open scenery on the boardwalk, color, diversity of people." },

  { spotId: "times-square", sourceId: SRC, speaker: "Vince", type: "visitor",  timestamp: 666, quote: "“Like shooting fish in a barrel.” Great for wide-angle." },
  { spotId: "coney-island", sourceId: SRC, speaker: "Vince", type: "visitor",  timestamp: 695, quote: "Peak of summer: rides, beach, boardwalk — a few locations in one." },
  { spotId: "times-square", sourceId: SRC, speaker: "Vince", type: "favorite", timestamp: 736, quote: "Shoots it almost daily on his commute — “habit or addiction.”" },

  { spotId: "crown-heights", sourceId: SRC, speaker: "Eli", type: "visitor",  timestamp: 796, quote: "Friday around noon before Shabbat; come with respect and genuine curiosity." },
  { spotId: "crown-heights", sourceId: SRC, speaker: "Eli", type: "favorite", timestamp: 880, quote: "“That's where I'm from... the work I feel most connected to.”" },

  { spotId: "washington-square-park", sourceId: SRC, speaker: "Kazu", type: "visitor",  timestamp: 916, quote: "Easy access to people who want to be photographed (but his least favorite)." },
  { spotId: "central-park",           sourceId: SRC, speaker: "Kazu", type: "favorite", timestamp: 931, quote: "“So many scenes out there — quiet scenes, sometimes busy.”" },

  { spotId: "bed-stuy",           sourceId: SRC, speaker: "Luca", type: "visitor",  timestamp: 1046, quote: "Bed-Stuy / Crown Heights area — more authentic to the New York experience than Times Square tourists." },
  { spotId: "flatbush",           sourceId: SRC, speaker: "Luca", type: "visitor",  timestamp: 1098, quote: "An untouched Brooklyn neighborhood, great for street." },
  { spotId: "lower-east-side",    sourceId: SRC, speaker: "Luca", type: "visitor",  timestamp: 1112, quote: "Loves shooting here." },
  { spotId: "financial-district", sourceId: SRC, speaker: "Luca", type: "visitor",  timestamp: 1116, quote: "Fun during the week — business types." },
  { spotId: "bed-stuy",           sourceId: SRC, speaker: "Luca", type: "favorite", timestamp: 1132, quote: "Authentic, chill, great architecture and greenery. Great for film." },

  { spotId: "washington-square-park", sourceId: SRC, speaker: "Angela", type: "visitor",  timestamp: 1192, quote: "“Easy pictures left and right.”" },
  { spotId: "times-square",           sourceId: SRC, speaker: "Angela", type: "visitor",  timestamp: 1200, quote: "Busy, though it can get overwhelming." },
  { spotId: "chinatown",              sourceId: SRC, speaker: "Angela", type: "visitor",  timestamp: 1205, quote: "Where she heads when Midtown is too much." },
  { spotId: "financial-district",     sourceId: SRC, speaker: "Angela", type: "visitor",  timestamp: 1208, quote: "Good." },
  { spotId: "tribeca",                sourceId: SRC, speaker: "Angela", type: "visitor",  timestamp: 1209, quote: "Good." },
  { spotId: "soho",                   sourceId: SRC, speaker: "Angela", type: "visitor",  timestamp: 1209, quote: "Good." },
  { spotId: "washington-square-park", sourceId: SRC, speaker: "Angela", type: "favorite", timestamp: 1217, quote: "Met amazing people here — the skateboarders." },
  { spotId: "central-park",           sourceId: SRC, speaker: "Angela", type: "favorite", timestamp: 1224, quote: "Also walks Lower Manhattan up to the park." },

  { spotId: "central-park-rock", sourceId: SRC, speaker: "Paulie B", type: "visitor", timestamp: 1258, quote: "Red leaves in fall, people playing all over the rock. Best Oct–Nov, Apr–May." },
  { spotId: "bethesda-fountain", sourceId: SRC, speaker: "Paulie B", type: "visitor", timestamp: 1290, quote: "Popping on weekends and evenings." },
  { spotId: "sheep-meadow",      sourceId: SRC, speaker: "Paulie B", type: "visitor", timestamp: 1298, quote: "People sprawled out on nice weekends; be interactive." },
  { spotId: "sailboat-pond",     sourceId: SRC, speaker: "Paulie B", type: "visitor", timestamp: 1313, quote: "Model sailboats; early-morning off-leash dogs jumping in the water." },
  { spotId: "flushing",          sourceId: SRC, speaker: "Paulie B", type: "visitor", timestamp: 1344, quote: "Mostly locals, extremely busy, amazing food. Take the 7 to the last stop." },
  { spotId: "jackson-heights",   sourceId: SRC, speaker: "Paulie B", type: "visitor", timestamp: 1376, quote: "Get off the 7 on the way back; mix with locals." },
  { spotId: "corona",            sourceId: SRC, speaker: "Paulie B", type: "visitor", timestamp: 1383, quote: "Same — if you're comfortable mixing with locals." },
];
