// Data model:
//   SPOTS    — one entry per physical place. `kind` is landmark | park |
//              neighborhood | corridor (a street or waterfront stretch).
//              Spots with a polygon in boundaries.js (keyed by id) render as filled
//              areas; the rest render as dots.
//   SOURCES  — one entry per video the mentions came from.
//   MENTIONS — one entry per time a speaker names a spot. `type` is
//              "visitor" (recommended for first-time visitors), "favorite"
//              (the speaker's own current favorite), or "walkie-talkie" (from
//              a Walkie Talkie episode; `basis` says whether they shot there in
//              the episode or named it as a regular haunt). `timestamp` is
//              seconds into the source video. Mention counts are derived.

const SPOTS = [
  // neighborhoods
  { id: "midtown",              name: "Midtown",                                   lat: 40.7549, lng: -73.9840, kind: "neighborhood" },
  { id: "alphabet-city",        name: "Alphabet City (East Village)",              lat: 40.7248, lng: -73.9793, kind: "neighborhood" },
  { id: "bushwick",             name: "Bushwick — under the Broadway el",          lat: 40.6934, lng: -73.9272, kind: "corridor" },
  { id: "blissville",           name: "Blissville (Queens)",                       lat: 40.7365, lng: -73.9345, kind: "neighborhood" },
  { id: "coney-island",         name: "Coney Island",                              lat: 40.5749, lng: -73.9786, kind: "neighborhood" },
  { id: "crown-heights",        name: "Crown Heights (Kingston Ave & Eastern Pkwy)", lat: 40.6690, lng: -73.9422, kind: "neighborhood" },
  { id: "bed-stuy",             name: "Bed-Stuy",                                  lat: 40.6872, lng: -73.9418, kind: "neighborhood" },
  { id: "flatbush",             name: "Flatbush",                                  lat: 40.6415, lng: -73.9594, kind: "neighborhood" },
  { id: "lower-east-side",      name: "Lower East Side",                           lat: 40.7205, lng: -73.9890, kind: "neighborhood" },
  { id: "financial-district",   name: "Financial District",                        lat: 40.7075, lng: -74.0113, kind: "neighborhood" },
  { id: "chinatown",            name: "Chinatown",                                 lat: 40.7158, lng: -73.9970, kind: "neighborhood" },
  { id: "tribeca",              name: "Tribeca",                                   lat: 40.7163, lng: -74.0086, kind: "neighborhood" },
  { id: "soho",                 name: "Soho",                                      lat: 40.7233, lng: -74.0030, kind: "neighborhood" },
  { id: "flushing",             name: "Flushing",                                  lat: 40.7596, lng: -73.8301, kind: "neighborhood" },
  { id: "jackson-heights",      name: "Jackson Heights",                           lat: 40.7557, lng: -73.8831, kind: "neighborhood" },
  { id: "corona",               name: "Corona",                                    lat: 40.7450, lng: -73.8643, kind: "neighborhood" },

  // parks
  { id: "tompkins-square-park",   name: "East Village / Tompkins Square Park", lat: 40.7265, lng: -73.9818, kind: "park" },
  { id: "domino-park",            name: "Domino Park (Williamsburg)",          lat: 40.7146, lng: -73.9672, kind: "park" },
  { id: "high-line",              name: "The High Line",                       lat: 40.7480, lng: -74.0048, kind: "park" },
  { id: "washington-square-park", name: "Washington Square Park",              lat: 40.7308, lng: -73.9973, kind: "park" },
  { id: "central-park",           name: "Central Park",                        lat: 40.7712, lng: -73.9742, kind: "park" },

  // landmarks
  { id: "times-square",                   name: "Times Square",                                lat: 40.7580, lng: -73.9855, kind: "landmark" },
  { id: "fifth-ave-42nd-to-central-park", name: "Fifth Avenue (42nd St to Central Park)",      lat: 40.7575, lng: -73.9780, kind: "corridor" },
  { id: "fifth-ave-47th-to-57th",         name: "Fifth Ave, 47th to 57th St",                  lat: 40.7601, lng: -73.9750, kind: "corridor" },
  { id: "diamond-district-47th",          name: "47th St btwn 5th & 6th (Diamond District)",   lat: 40.7573, lng: -73.9794, kind: "landmark" },
  { id: "14th-st-1st-ave",                name: "14th St & 1st Ave / Ave A corners",           lat: 40.7317, lng: -73.9829, kind: "corridor" },
  { id: "bethesda-fountain",              name: "Central Park — Bethesda Fountain",            lat: 40.7740, lng: -73.9709, kind: "landmark" },
  { id: "central-park-rock",              name: "Central Park — the rock (near Heckscher)",    lat: 40.7690, lng: -73.9780, kind: "landmark" },
  { id: "sheep-meadow",                   name: "Central Park — Sheep Meadow",                 lat: 40.7719, lng: -73.9754, kind: "landmark" },
  { id: "sailboat-pond",                  name: "Central Park — sailboat pond",                lat: 40.7743, lng: -73.9668, kind: "landmark" },
  { id: "east-river-waterfront",          name: "East River waterfront",                       lat: 40.7290, lng: -73.9720, kind: "corridor" },
  { id: "west-side-highway",              name: "West Side Highway / Hudson waterfront",       lat: 40.7460, lng: -74.0086, kind: "corridor" },
  { id: "nyc-subway",                     name: "NYC Subway",                                  lat: 40.7132, lng: -73.9576, kind: "landmark" },

  // added from the Walkie Talkie series
  { id: "harlem",                name: "Harlem",                                    lat: 40.8116, lng: -73.9465, kind: "neighborhood" },
  { id: "washington-heights",    name: "Washington Heights",                        lat: 40.8417, lng: -73.9394, kind: "neighborhood" },
  { id: "sunset-park",           name: "Sunset Park (Brooklyn)",                    lat: 40.6455, lng: -74.0125, kind: "neighborhood" },
  { id: "williamsburg",          name: "Williamsburg",                              lat: 40.7140, lng: -73.9560, kind: "neighborhood" },
  { id: "south-williamsburg",    name: "South Williamsburg",                        lat: 40.7050, lng: -73.9580, kind: "neighborhood" },
  { id: "jamaica",               name: "Jamaica (Queens)",                          lat: 40.7020, lng: -73.7970, kind: "neighborhood" },
  { id: "prospect-park",         name: "Prospect Park",                             lat: 40.6602, lng: -73.9690, kind: "park" },
  { id: "kissena-park",          name: "Kissena Park (Flushing)",                   lat: 40.7460, lng: -73.8090, kind: "park" },
  { id: "columbus-park",         name: "Columbus Park (Chinatown)",                 lat: 40.7148, lng: -73.9997, kind: "park" },
  { id: "herald-square",         name: "Herald Square (34th St)",                   lat: 40.7484, lng: -73.9878, kind: "landmark" },
  { id: "church-ave-flatbush",   name: "Church Ave & Flatbush Ave",                 lat: 40.6505, lng: -73.9587, kind: "landmark" },
  { id: "grand-concourse",       name: "Grand Concourse (Bronx)",                   lat: 40.8700, lng: -73.8885, kind: "corridor" },
  { id: "roosevelt-ave-7-train", name: "Roosevelt Ave under the 7 train",           lat: 40.7500, lng: -73.8640, kind: "corridor" },
  { id: "eastern-parkway",       name: "Eastern Parkway (West Indian Day Carnival)", lat: 40.6700, lng: -73.9500, kind: "corridor" },
];

const SOURCES = [
  {
    id: "paulie-b-where-to-shoot",
    title: "I asked photographers in NYC: Where should visitors go for street photography?",
    channel: "Paulie B",
    url: "https://www.youtube.com/watch?v=X0CbbpuR9vs",
  },
  // Walkie Talkie episodes: a day shooting with one photographer, usually on their home turf
  { id: "wt-sonia-tsang", title: "Shooting w/ a Nikon F3 - A Day w/ Sonia Tsang - Walkie Talkie Ep. 37 - Mid-Autumn Fest in Chinatown", channel: "Paulie B", url: "https://www.youtube.com/watch?v=kjsLr5mlaUs" },
  { id: "wt-yusef-emuna", title: "Documenting and Being part of Culture -- Walkie Talkie w Yusef Emuna", channel: "Paulie B", url: "https://www.youtube.com/watch?v=ueYQMIpwBE4" },
  { id: "wt-diana-cuautle", title: "A day with NYC photographer Diana Cuautle (Walkie Talkie)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=fq_bMFuGGPY" },
  { id: "wt-alvin-ali-lopez", title: "Native New Yorker takes Photos at Coney for the First Time // Walkie Talkie with Alvin Ali Lopez", channel: "Paulie B", url: "https://www.youtube.com/watch?v=irV3Q3zCr5A" },
  { id: "wt-kazu-nakajima", title: "A day with NYC Photographer Kazu Nakajima \u2014 Walkie Talkie episode 79", channel: "Paulie B", url: "https://www.youtube.com/watch?v=ptoCQKa9GTY" },
  { id: "wt-ribsy", title: "a day taking photos w/ NYC photographer Ribsy -- Walkie Talkie Ep. 32", channel: "Paulie B", url: "https://www.youtube.com/watch?v=t6037zOMru0" },
  { id: "wt-poupay-jutharat", title: "a day with pro photographer Poupay Jutharat -- Walkie Talkie episode 23", channel: "Paulie B", url: "https://www.youtube.com/watch?v=UAdI27UPYvg" },
  { id: "wt-gee-moon-tom", title: "a day w/ Chinese-American Photographer Gee Moon Tom  in Sunset Park Brooklyn -- Walkie Talkie ep. 20", channel: "Paulie B", url: "https://www.youtube.com/watch?v=UJEklRKFRxA" },
  { id: "wt-sara-messinger", title: "Photography is the Exchanging of Hearts -- Walkie Talkie w/ Sara Messinger (ep. 44)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=QicVV26Bz80" },
  { id: "wt-matt-weber", title: "Street Photo Legend Matt Weber -- Walkie Talkie Ep. 26", channel: "Paulie B", url: "https://www.youtube.com/watch?v=eRgR_CfVin4" },
  { id: "wt-chris-perez", title: "Finding your voice in Photography -- Walkie Talkie with Chris Perez (Ep 38)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=j245H9oPzrA" },
  { id: "wt-ryan-riley", title: "a day with NYC photographer Ryan Riley", channel: "Paulie B", url: "https://www.youtube.com/watch?v=pn0iEdhAaAM" },
  { id: "wt-rich-fazo", title: "A Day with Brooklyn Photographer Rich Fazo", channel: "Paulie B", url: "https://www.youtube.com/watch?v=gC3fd56YMWU" },
  { id: "wt-martha-cooper", title: "A Legend Returns. Martha Cooper Revisits NYC\u2019s Alphabet City (Walkie Talkie episode 48)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=6z739MqlvHU" },
  { id: "wt-willie-velazquez", title: "Street Photography in Queens, NY | Walkie Talkie with Willie Velazquez", channel: "Paulie B", url: "https://www.youtube.com/watch?v=tPj3nl9EAc8" },
  { id: "wt-alex-brown", title: "Taking and Talking Street Photos in Soho & Williamsburg // Walkie Talkie with Alex Brown", channel: "Paulie B", url: "https://www.youtube.com/watch?v=eaw820DKBN0" },
];

const SRC = "paulie-b-where-to-shoot";

const MENTIONS = [
  { spotId: "nyc-subway",  sourceId: SRC, speaker: "Jeffrey", type: "visitor",  timestamp: 24,  quote: "“The city underneath the city” — likes lines that go above ground (J, M, F to Coney)." },
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

  { spotId: "midtown",              sourceId: SRC, speaker: "Tall photographer", type: "visitor",  timestamp: 359, quote: "“Anywhere from 34th to the park, 9th over to Lexington.” Coming from Denver/Albuquerque: “what you get in a week elsewhere you get in a day here.”" },
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

  // Walkie Talkie mentions. basis: "shot-here" = shot there in the episode, "haunt" = named as a regular spot.

  { spotId: "chinatown", sourceId: "wt-sonia-tsang", speaker: "Sonia Tsang", type: "walkie-talkie", basis: "shot-here", timestamp: 39, quote: "“This is Mid-Autumn Festival, guys — we're in Chinatown.” Shot the lion-dance parade." },
  { spotId: "columbus-park", sourceId: "wt-sonia-tsang", speaker: "Sonia Tsang", type: "walkie-talkie", basis: "haunt", timestamp: 433, quote: "Did a whole photo project on Columbus Park." },
  { spotId: "coney-island", sourceId: "wt-sonia-tsang", speaker: "Sonia Tsang", type: "walkie-talkie", basis: "haunt", timestamp: 908, quote: "Her favorite photo of the year was on the boardwalk during the Mermaid Parade; Coney and Chinatown are the communities she documents." },

  { spotId: "grand-concourse", sourceId: "wt-yusef-emuna", speaker: "Yusef Emuna", type: "walkie-talkie", basis: "shot-here", timestamp: 30, quote: "“I brought Paulie out today to 205th off of Grand Concourse.” Walks it down to Bedford Park and Fordham Rd — “I would come out to Grand Concourse a lot.”" },

  { spotId: "kissena-park", sourceId: "wt-diana-cuautle", speaker: "Diana Cuautle", type: "walkie-talkie", basis: "shot-here", timestamp: 240, quote: "“We are in Kissena Park in Flushing, Queens.”" },

  { spotId: "coney-island", sourceId: "wt-alvin-ali-lopez", speaker: "Alvin Ali Lopez", type: "walkie-talkie", basis: "shot-here", timestamp: 4, quote: "“We're in Coney Island — my first time shooting here.”" },
  { spotId: "flushing", sourceId: "wt-alvin-ali-lopez", speaker: "Alvin Ali Lopez", type: "walkie-talkie", basis: "shot-here", timestamp: 44, quote: "“This is Flushing… it's like a hot spot here in Queens.”" },
  { spotId: "jamaica", sourceId: "wt-alvin-ali-lopez", speaker: "Alvin Ali Lopez", type: "walkie-talkie", basis: "haunt", timestamp: 102, quote: "“It's really slow in Jamaica — you have to be really patient.”" },
  { spotId: "midtown", sourceId: "wt-alvin-ali-lopez", speaker: "Alvin Ali Lopez", type: "walkie-talkie", basis: "shot-here", timestamp: 495, quote: "“This is like the playground. I love shooting here — this is where I started shooting street.”" },
  { spotId: "fifth-ave-42nd-to-central-park", sourceId: "wt-alvin-ali-lopez", speaker: "Alvin Ali Lopez", type: "walkie-talkie", basis: "shot-here", timestamp: 553, quote: "“Come on, this is New York City — why not shoot here?”" },
  { spotId: "herald-square", sourceId: "wt-alvin-ali-lopez", speaker: "Alvin Ali Lopez", type: "walkie-talkie", basis: "shot-here", timestamp: 839, quote: "“Now we're at 34th, Herald Square. The theme is hot spots.”" },

  { spotId: "central-park", sourceId: "wt-kazu-nakajima", speaker: "Kazu Nakajima", type: "walkie-talkie", basis: "shot-here", timestamp: 31, quote: "“We're in Central Park… I'm focusing on this Central Park stuff. It's been like two years.”" },
  { spotId: "midtown", sourceId: "wt-kazu-nakajima", speaker: "Kazu Nakajima", type: "walkie-talkie", basis: "haunt", timestamp: 919, quote: "“I still try to shoot Midtown.”" },

  { spotId: "washington-heights", sourceId: "wt-ribsy", speaker: "Ribsy", type: "walkie-talkie", basis: "shot-here", timestamp: 21, quote: "“We in Washington Heights right now, my hometown… I would have wasted part of my life if I never photographed in Washington Heights.”" },

  { spotId: "chinatown", sourceId: "wt-poupay-jutharat", speaker: "Poupay Jutharat", type: "walkie-talkie", basis: "shot-here", timestamp: 67, quote: "“Today we're in Chinatown. I like to come here to eat, and sometimes I bring my camera.”" },
  { spotId: "columbus-park", sourceId: "wt-poupay-jutharat", speaker: "Poupay Jutharat", type: "walkie-talkie", basis: "shot-here", timestamp: 226, quote: "Shooting in Columbus Park — the heart of Chinatown's park life." },
  { spotId: "washington-square-park", sourceId: "wt-poupay-jutharat", speaker: "Poupay Jutharat", type: "walkie-talkie", basis: "haunt", timestamp: 751, quote: "“I really like it at daytime” (wouldn't shoot there alone at night)." },

  { spotId: "sunset-park", sourceId: "wt-gee-moon-tom", speaker: "Gee Moon Tom", type: "walkie-talkie", basis: "shot-here", timestamp: 415, quote: "“When I'm on 8th Avenue I like to shoot with my 35.” Working on a book focused on Sunset Park." },
  { spotId: "chinatown", sourceId: "wt-gee-moon-tom", speaker: "Gee Moon Tom", type: "walkie-talkie", basis: "haunt", timestamp: 431, quote: "“If I'm in Chinatown Manhattan I'll throw my 28 on.”" },

  { spotId: "washington-square-park", sourceId: "wt-sara-messinger", speaker: "Sara Messinger", type: "walkie-talkie", basis: "shot-here", timestamp: 30, quote: "“One of my favorite places in New York City… I come here whenever I can.”" },
  { spotId: "tompkins-square-park", sourceId: "wt-sara-messinger", speaker: "Sara Messinger", type: "walkie-talkie", basis: "haunt", timestamp: 82, quote: "“I'm really always just walking between Washington Square Park and Tompkins Square Park.”" },
  { spotId: "midtown", sourceId: "wt-sara-messinger", speaker: "Sara Messinger", type: "walkie-talkie", basis: "haunt", timestamp: 245, quote: "“All the guys were going to Midtown, so I'm going to go with them.”" },
  { spotId: "south-williamsburg", sourceId: "wt-sara-messinger", speaker: "Sara Messinger", type: "walkie-talkie", basis: "haunt", timestamp: 403, quote: "“I started photographing the South Williamsburg community, the Hasidic community there.”" },

  { spotId: "washington-square-park", sourceId: "wt-matt-weber", speaker: "Matt Weber", type: "walkie-talkie", basis: "shot-here", timestamp: 245, quote: "“We're in Washington Square Park and there's 40 or 50 photographers.”" },
  { spotId: "nyc-subway", sourceId: "wt-matt-weber", speaker: "Matt Weber", type: "walkie-talkie", basis: "haunt", timestamp: 110, quote: "“I've been shooting on the subway for twenty-something years.”" },
  { spotId: "harlem", sourceId: "wt-matt-weber", speaker: "Matt Weber", type: "walkie-talkie", basis: "haunt", timestamp: 365, quote: "“I went up to Harlem a lot… I'm glad I photographed Harlem in the '80s.”" },
  { spotId: "coney-island", sourceId: "wt-matt-weber", speaker: "Matt Weber", type: "walkie-talkie", basis: "haunt", timestamp: 160, quote: "“When you go to Coney Island in, say, '03, before the smartphones…”" },

  { spotId: "harlem", sourceId: "wt-chris-perez", speaker: "Chris Perez", type: "walkie-talkie", basis: "shot-here", timestamp: 45, quote: "“We're in Harlem right now, on the corner of 110th and Central Park.” Keeps returning to document a Harlem baseball league." },

  { spotId: "bed-stuy", sourceId: "wt-ryan-riley", speaker: "Ryan Riley", type: "walkie-talkie", basis: "shot-here", timestamp: 393, quote: "“Fulton Street and Nostrand — this is like the heart of Bed-Stuy.”" },
  { spotId: "crown-heights", sourceId: "wt-ryan-riley", speaker: "Ryan Riley", type: "walkie-talkie", basis: "shot-here", timestamp: 1055, quote: "“I think this is where I take some of my best photos, I'm not going to lie.”" },
  { spotId: "flatbush", sourceId: "wt-ryan-riley", speaker: "Ryan Riley", type: "walkie-talkie", basis: "shot-here", timestamp: 1161, quote: "“Right over here is Little Haiti… you got to have tough skin to shoot out here.”" },
  { spotId: "church-ave-flatbush", sourceId: "wt-ryan-riley", speaker: "Ryan Riley", type: "walkie-talkie", basis: "haunt", timestamp: 1358, quote: "“Church Avenue, which is like one of my favorite corners. So much action, so much life.”" },
  { spotId: "eastern-parkway", sourceId: "wt-ryan-riley", speaker: "Ryan Riley", type: "walkie-talkie", basis: "haunt", timestamp: 1758, quote: "Shoots the West Indian Day Carnival every year — “now I make it a mission to go shoot it.”" },

  { spotId: "crown-heights", sourceId: "wt-rich-fazo", speaker: "Rich Fazo", type: "walkie-talkie", basis: "shot-here", timestamp: 29, quote: "“We're in Brooklyn, Crown Heights. I've been living here for a while. I've been photographing here.”" },
  { spotId: "prospect-park", sourceId: "wt-rich-fazo", speaker: "Rich Fazo", type: "walkie-talkie", basis: "haunt", timestamp: 973, quote: "“I live not too far from Prospect Park. I go to Prospect Park and walk around with camera.”" },
  { spotId: "midtown", sourceId: "wt-rich-fazo", speaker: "Rich Fazo", type: "walkie-talkie", basis: "shot-here", timestamp: 1748, quote: "“Midtown I shoot late, too — past 9, 10.”" },

  { spotId: "alphabet-city", sourceId: "wt-martha-cooper", speaker: "Martha Cooper", type: "walkie-talkie", basis: "shot-here", timestamp: 25, quote: "“Right now we're in Alphabet City.” Revisiting the blocks she photographed in the late '70s." },
  { spotId: "nyc-subway", sourceId: "wt-martha-cooper", speaker: "Martha Cooper", type: "walkie-talkie", basis: "haunt", timestamp: 1421, quote: "Her book Subway Art documented the graffiti-covered trains of the early '80s." },

  { spotId: "corona", sourceId: "wt-willie-velazquez", speaker: "Willie Velazquez", type: "walkie-talkie", basis: "shot-here", timestamp: 18, quote: "“Right now we're in Roosevelt, Corona Plaza, where I grew up.”" },
  { spotId: "flushing", sourceId: "wt-willie-velazquez", speaker: "Willie Velazquez", type: "walkie-talkie", basis: "shot-here", timestamp: 528, quote: "“Flushing is basically Chinatown in Queens.”" },
  { spotId: "roosevelt-ave-7-train", sourceId: "wt-willie-velazquez", speaker: "Willie Velazquez", type: "walkie-talkie", basis: "haunt", timestamp: 763, quote: "“My neighborhood is wherever the 7 train is — Jackson Heights, Flushing, Corona, Woodside, Sunnyside. That's all one big neighborhood to me.”" },

  { spotId: "soho", sourceId: "wt-alex-brown", speaker: "Alex Brown", type: "walkie-talkie", basis: "shot-here", timestamp: 23, quote: "“Beautiful Soho, we're right now on Broadway.” The Prince/Spring corner is “where I spend most of my time in Soho.”" },
  { spotId: "midtown", sourceId: "wt-alex-brown", speaker: "Alex Brown", type: "walkie-talkie", basis: "haunt", timestamp: 83, quote: "“Midtown during the week is usually good.”" },
  { spotId: "williamsburg", sourceId: "wt-alex-brown", speaker: "Alex Brown", type: "walkie-talkie", basis: "shot-here", timestamp: 749, quote: "“I definitely want to get to Williamsburg today… let's just go.”" },
];
