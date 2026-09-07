// Data model:
//   SPOTS    — one entry per physical place. `kind` is landmark | park |
//              neighborhood | corridor (a street or waterfront stretch) | pin (an
//              exact corner, intersection or venue a photographer named on camera).
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
  { id: "bushwick",             name: "Broadway el (Bushwick / Bed-Stuy border)",  lat: 40.6934, lng: -73.9272, kind: "corridor" },
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
  { id: "diamond-district-47th",          name: "47th St btwn 5th & 6th (Diamond District)",   lat: 40.7573, lng: -73.9794, kind: "pin" },
  { id: "14th-st-1st-ave",                name: "14th St & 1st Ave / Ave A corners",           lat: 40.7317, lng: -73.9829, kind: "corridor" },
  { id: "bethesda-fountain",              name: "Central Park — Bethesda Fountain",            lat: 40.7740, lng: -73.9709, kind: "pin" },
  { id: "central-park-rock",              name: "Central Park — the rock (near Heckscher)",    lat: 40.7690, lng: -73.9780, kind: "pin" },
  { id: "sheep-meadow",                   name: "Central Park — Sheep Meadow",                 lat: 40.7719, lng: -73.9754, kind: "pin" },
  { id: "sailboat-pond",                  name: "Central Park — sailboat pond",                lat: 40.7743, lng: -73.9668, kind: "pin" },
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
  { id: "church-ave-flatbush",   name: "Church Ave & Flatbush Ave",                 lat: 40.6505, lng: -73.9587, kind: "pin" },
  { id: "grand-concourse",       name: "Grand Concourse (Bronx)",                   lat: 40.8700, lng: -73.8885, kind: "corridor" },
  { id: "roosevelt-ave-7-train", name: "Roosevelt Ave under the 7 train",           lat: 40.7500, lng: -73.8640, kind: "corridor" },
  { id: "eastern-parkway",       name: "Eastern Parkway (West Indian Day Carnival)", lat: 40.6700, lng: -73.9500, kind: "corridor" },

  // added from Walkie Talkie batch 2
  { id: "east-village",          name: "East Village",                              lat: 40.7275, lng: -73.9860, kind: "neighborhood" },
  { id: "brighton-beach",        name: "Brighton Beach",                            lat: 40.5776, lng: -73.9613, kind: "neighborhood" },
  { id: "howard-beach",          name: "Howard Beach (Queens)",                     lat: 40.6571, lng: -73.8362, kind: "neighborhood" },
  { id: "bryant-park",           name: "Bryant Park / 42nd & 6th",                  lat: 40.7536, lng: -73.9832, kind: "park" },
  { id: "east-river-park",       name: "East River Park",                           lat: 40.7180, lng: -73.9745, kind: "park" },
  { id: "maria-hernandez-park",  name: "Maria Hernandez Park (Bushwick)",           lat: 40.7027, lng: -73.9236, kind: "park" },
  { id: "grand-central",         name: "Grand Central Terminal",                    lat: 40.7527, lng: -73.9772, kind: "landmark" },
  { id: "brooklyn-bridge",       name: "Brooklyn Bridge",                           lat: 40.7061, lng: -73.9969, kind: "landmark" },
  { id: "foley-square",          name: "Foley Square / Civic Center",               lat: 40.7145, lng: -74.0030, kind: "landmark" },
  { id: "williamsburg-bridge",   name: "Williamsburg Bridge",                       lat: 40.7132, lng: -73.9720, kind: "landmark" },
  { id: "madison-avenue",        name: "Madison Avenue (42nd to 72nd)",             lat: 40.7621, lng: -73.9720, kind: "corridor" },
  { id: "mulberry-street",       name: "Mulberry St / Little Italy (San Gennaro)",  lat: 40.7196, lng: -73.9963, kind: "corridor" },

  // added from Walkie Talkie batch 3
  { id: "bushwick-core",         name: "Bushwick (Knickerbocker / Myrtle-Wyckoff)", lat: 40.7000, lng: -73.9190, kind: "neighborhood" },
  { id: "borough-park",          name: "Borough Park",                              lat: 40.6330, lng: -73.9900, kind: "neighborhood" },
  { id: "ozone-park",            name: "Ozone Park",                                lat: 40.6795, lng: -73.8490, kind: "neighborhood" },
  { id: "orchard-beach",         name: "Orchard Beach (Bronx)",                     lat: 40.8670, lng: -73.7920, kind: "park" },
  { id: "united-nations",        name: "United Nations",                            lat: 40.7489, lng: -73.9680, kind: "landmark" },

  // pins: exact spots named on camera, high confidence only. A pin sits alongside
  // the person's mention on the containing area; it adds precision, not a move.
  { id: "jacks-wife-freda-corner", name: "Lafayette & Spring (Jack's Wife Freda corner)", lat: 40.7223, lng: -73.9974, kind: "pin" },
  { id: "broadway-prince",         name: "Broadway & Prince St (Soho)",               lat: 40.7243, lng: -73.9979, kind: "pin" },
  { id: "fulton-nostrand",         name: "Fulton St & Nostrand Ave (Bed-Stuy)",       lat: 40.6801, lng: -73.9499, kind: "pin" },
  { id: "54th-madison",            name: "54th St & Madison Ave",                     lat: 40.7607, lng: -73.9737, kind: "pin" },
  { id: "55th-fifth",              name: "55th St & Fifth Ave",                       lat: 40.7615, lng: -73.9753, kind: "pin" },
  { id: "110th-cpw",               name: "110th St & Central Park West (Harlem)",     lat: 40.8003, lng: -73.9584, kind: "pin" },
  { id: "205th-grand-concourse",   name: "205th St & Grand Concourse (Bronx)",        lat: 40.8770, lng: -73.8855, kind: "pin" },
  { id: "kingston-eastern-pkwy",   name: "Kingston Ave & Eastern Parkway",            lat: 40.6690, lng: -73.9422, kind: "pin" },
  { id: "corona-plaza",            name: "Corona Plaza (Roosevelt Ave & 103rd St)",   lat: 40.7496, lng: -73.8625, kind: "pin" },
  { id: "myrtle-wyckoff",          name: "Myrtle-Wyckoff (Bushwick)",                 lat: 40.6995, lng: -73.9118, kind: "pin" },
  { id: "la-plaza-cultural",       name: "La Plaza Cultural garden (9th St & Ave C)", lat: 40.7253, lng: -73.9787, kind: "pin" },
  { id: "wall-street-bull",        name: "Charging Bull (Bowling Green)",             lat: 40.7056, lng: -74.0134, kind: "pin" },
  { id: "st-patricks",             name: "St. Patrick's Cathedral (5th & 50th)",      lat: 40.7585, lng: -73.9760, kind: "pin" },
  { id: "42nd-6th",                name: "42nd St & 6th Ave",                         lat: 40.7546, lng: -73.9846, kind: "pin" },
  { id: "26-federal-plaza",        name: "26 Federal Plaza / Criminal Courthouse",    lat: 40.7148, lng: -74.0040, kind: "pin" },
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
  { id: "wt-troy-williams", title: "A Day with NYC Photographer Troy Williams (Walkie Talkie Episode 87)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=OSDCHi6h-7s" },
  { id: "wt-conrad-ziolkowski", title: "A Madman's Pursuit -- a day with NYC Photographer Conrad Ziolkowski", channel: "Paulie B", url: "https://www.youtube.com/watch?v=jRtZhll2Few" },
  { id: "wt-jas-leon", title: "a day with NYC photographer, Jas Leon -- Walkie Talkie NYC episode 45", channel: "Paulie B", url: "https://www.youtube.com/watch?v=3vNOgHvXz_g" },
  { id: "wt-boris-apple", title: "Boris Apple / Walkie Talkie Ep. 35 / Black & White Film Photography", channel: "Paulie B", url: "https://www.youtube.com/watch?v=_nF-8nlLgTo" },
  { id: "wt-new-york-nico", title: "a day with New York Nico (Walkie Talkie episode 47) -- Video street photography?", channel: "Paulie B", url: "https://www.youtube.com/watch?v=ckOa9C2zGoA" },
  { id: "wt-dustin-roderick", title: "from Large Format Photos to 35mm Street Photography -- Walkie Talkie with Dustin Roderick (ep 41)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=Zk1ZFkbmCuI" },
  { id: "wt-trevor-wisecup", title: "a day with nyc Photographer Trevor Wisecup (Walkie Talkie ep. 27)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=HjuP527Xt2Q" },
  { id: "wt-izael-rivera-flores", title: "a day with Puerto Rican Photographer Izael Rivera Flores -- Walkie Talkie episode 19", channel: "Paulie B", url: "https://www.youtube.com/watch?v=CbxDq5txzo8" },
  { id: "wt-melissa-oshaughnessy", title: "a day with NYC photographer Melissa O'Shaughnessy -- Walkie Talkie ep. 24", channel: "Paulie B", url: "https://www.youtube.com/watch?v=9yOLOI2Y2LU" },
  { id: "wt-jorge-garcia", title: "Starting NYCSPC -- Walkie Talkie with Jorge Garcia (ep. 30) -- Founder of NYCSPC & ContactPhoto", channel: "Paulie B", url: "https://www.youtube.com/watch?v=_B37JNYImks" },
  { id: "wt-john-wha", title: "Knowledge & Curiosity in Photography // Walkie Talkie with John Wha // NYC Street Photography Series", channel: "Paulie B", url: "https://www.youtube.com/watch?v=o-K4BwmVVNo" },
  { id: "wt-conor-cunningham", title: "Contax G2 street photos in NYC // Walkie Talkie with Conor James Cunningham", channel: "Paulie B", url: "https://www.youtube.com/watch?v=uctqo-JrRes" },
  { id: "wt-chris-voss", title: "NYC Street Photography at Night // Walkie Talkie with Chris Voss", channel: "Paulie B", url: "https://www.youtube.com/watch?v=cOTo3nMQtKg" },
  { id: "wt-joe-greer", title: "a day with photographer Joe Greer -- Walkie Talkie episode 10", channel: "Paulie B", url: "https://www.youtube.com/watch?v=8bvL2lZKgOA" },
  { id: "wt-andre-d-wagner", title: "a day with Andre D. Wagner -- NYC Street Photography -- Walkie Talkie ep. 16", channel: "Paulie B", url: "https://www.youtube.com/watch?v=i1szgcB9Ono" },
  { id: "wt-sabrina-santiago", title: "a day with photographer Sabrina Santiago (Walkie Talkie episode 46)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=6QfLCGvF0aw" },
  { id: "wt-daniel-arnold", title: "A day with photographer Daniel Arnold (Walkie Talkie episode 39)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=7LwnTdrX9Vg" },
  { id: "wt-tyler-woodford", title: "shoot what you love to shoot -- Walkie Talkie with Tyler Woodford (ep 42)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=WG2cKx-htP4" },
  { id: "wt-stephanie-keith", title: "A Day with NYC Photojournalist Stephanie Keith | Walkie Talkie", channel: "Paulie B", url: "https://www.youtube.com/watch?v=YQtUQ7KYv64" },
  { id: "wt-marty-hamburger", title: "a day with Brooklyn Photographer, Marty Hamburger (Walkie Talkie ep. 82)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=DJKWPzRTGLY" },
  { id: "wt-mark-portillo", title: "A Day with NYC Photographer Mark Portillo (Walkie Talkie)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=by60qvIrzPk" },
  { id: "wt-elijah-mogoli", title: "a day with Brooklyn photographer Elijah Mogoli -- NYC Street Photography -- Walkie Talkie ep. 17", channel: "Paulie B", url: "https://www.youtube.com/watch?v=jqQ4W82FkBM" },
  { id: "wt-cisco-vasquez", title: "Respect, Dignity, & Community through Photography \u2014 Walkie Talkie with Cisco Vasquez", channel: "Paulie B", url: "https://www.youtube.com/watch?v=PHns5btsuCA" },
  { id: "wt-cody-cutter", title: "a day with NYC Street Photographer Cody Cutter (Walkie Talkie episode 67)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=tsPCHEGm0Zk" },
  { id: "wt-james-berkeley", title: "Leica M4 Street Photography in NYC // Walkie Talkie with James Berkeley", channel: "Paulie B", url: "https://www.youtube.com/watch?v=8eacbi8U16Q" },
  { id: "wt-laura-fuchs", title: "a day with nyc photographer Laura Fuchs -- Walkie Talkie episode 43", channel: "Paulie B", url: "https://www.youtube.com/watch?v=3DulRNiQf0w" },
  { id: "wt-reuben-radding", title: "a day with NYC Street Photographer Reuben Radding (Walkie Talkie episode 13)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=2KMTzS1M1-M" },
  { id: "wt-jaclyn-licht", title: "A Day with Jaclyn Licht | Street, Documentary, & UN Photographer | Walkie Talkie ep. 85", channel: "Paulie B", url: "https://www.youtube.com/watch?v=4-0WmQncp5o" },
  { id: "wt-billy-dinh", title: "Billy Dinh on Photographing Daily life, Travel, and Why he Photographs -- Walkie Talkie Ep. 34", channel: "Paulie B", url: "https://www.youtube.com/watch?v=Gdb2ieZ0rss" },
  { id: "wt-tyler-woodford-2021", title: "It's Part of the Process -- Walkie Talkie with Tyler Woodford -- NYC Street Photography", channel: "Paulie B", url: "https://www.youtube.com/watch?v=BL_opcfONu8" },
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

  // Walkie Talkie batch 2

  { spotId: "tompkins-square-park", sourceId: "wt-troy-williams", speaker: "Troy Williams", type: "walkie-talkie", basis: "shot-here", timestamp: 42, quote: "“My favorite park in the city… this is the spot that I always come back to.”" },
  { spotId: "alphabet-city", sourceId: "wt-troy-williams", speaker: "Troy Williams", type: "walkie-talkie", basis: "shot-here", timestamp: 40, quote: "“This is in the East Village, Alphabet City.” Shoots the La Plaza Cultural garden on Ave C." },
  { spotId: "east-village", sourceId: "wt-troy-williams", speaker: "Troy Williams", type: "walkie-talkie", basis: "haunt", timestamp: 231, quote: "“Mostly I really was focusing on the East Village right away.”" },

  { spotId: "brighton-beach", sourceId: "wt-conrad-ziolkowski", speaker: "Conrad Ziolkowski", type: "walkie-talkie", basis: "shot-here", timestamp: 18, quote: "“We're here in Brighton Beach, where I'm from… we're out shooting” — the boardwalk, the jetty, the avenue." },
  { spotId: "midtown", sourceId: "wt-conrad-ziolkowski", speaker: "Conrad Ziolkowski", type: "walkie-talkie", basis: "haunt", timestamp: 1043, quote: "“I go there usually three to four days [a week]. I'm there more than I am anywhere else.”" },
  { spotId: "coney-island", sourceId: "wt-conrad-ziolkowski", speaker: "Conrad Ziolkowski", type: "walkie-talkie", basis: "haunt", timestamp: 1819, quote: "“Usually I'll hit Brighton Beach or walk through Coney.”" },
  { spotId: "sunset-park", sourceId: "wt-conrad-ziolkowski", speaker: "Conrad Ziolkowski", type: "walkie-talkie", basis: "haunt", timestamp: 1825, quote: "“I'll walk all the way down to Sunset Park sometimes.”" },
  { spotId: "howard-beach", sourceId: "wt-conrad-ziolkowski", speaker: "Conrad Ziolkowski", type: "walkie-talkie", basis: "haunt", timestamp: 324, quote: "Shoots the neighborhoods around Jamaica Bay — “going out to Howard Beach, Rockaway, Ozone Park. Mostly medium format out there.”" },

  { spotId: "madison-avenue", sourceId: "wt-jas-leon", speaker: "Jas Leon", type: "walkie-talkie", basis: "shot-here", timestamp: 34, quote: "Starts at Madison & 72nd and walks down Madison into the park." },
  { spotId: "central-park", sourceId: "wt-jas-leon", speaker: "Jas Leon", type: "walkie-talkie", basis: "shot-here", timestamp: 671, quote: "“I like to enter through Central Park because it gives you a zen moment.”" },
  { spotId: "midtown", sourceId: "wt-jas-leon", speaker: "Jas Leon", type: "walkie-talkie", basis: "shot-here", timestamp: 758, quote: "Her route: Madison Ave → Central Park → 6th Ave → Midtown, all the way down to 14th St." },

  { spotId: "central-park", sourceId: "wt-boris-apple", speaker: "Boris Apple", type: "walkie-talkie", basis: "shot-here", timestamp: 120, quote: "“As long as I've lived here, and before I lived here, I would make this a solid checkpoint.”" },
  { spotId: "east-river-park", sourceId: "wt-boris-apple", speaker: "Boris Apple", type: "walkie-talkie", basis: "shot-here", timestamp: 1382, quote: "“Trying to take a decent amount of photos of this park changing over the last two years.”" },

  { spotId: "mulberry-street", sourceId: "wt-new-york-nico", speaker: "New York Nico", type: "walkie-talkie", basis: "shot-here", timestamp: 164, quote: "“An Italian feast in the middle of Little Italy” — shoots San Gennaro by day and comes back at night." },
  { spotId: "washington-square-park", sourceId: "wt-new-york-nico", speaker: "New York Nico", type: "walkie-talkie", basis: "haunt", timestamp: 770, quote: "Filmed a wedding proposal here; Larry the Birdman of Washington Square is a regular subject." },
  { spotId: "coney-island", sourceId: "wt-new-york-nico", speaker: "New York Nico", type: "walkie-talkie", basis: "haunt", timestamp: 367, quote: "“Coney Island Polar Plunge is a big one.”" },

  { spotId: "prospect-park", sourceId: "wt-dustin-roderick", speaker: "Dustin Roderick", type: "walkie-talkie", basis: "shot-here", timestamp: 733, quote: "“On average three to four times a week doing this kind of loop.”" },
  { spotId: "midtown", sourceId: "wt-dustin-roderick", speaker: "Dustin Roderick", type: "walkie-talkie", basis: "haunt", timestamp: 2107, quote: "“I really enjoy going to Midtown for street stuff, 'cause there's a lot of people.”" },
  { spotId: "financial-district", sourceId: "wt-dustin-roderick", speaker: "Dustin Roderick", type: "walkie-talkie", basis: "shot-here", timestamp: 2122, quote: "Winter street shooting downtown — “I've never been over here really, to the Wall Street Bull.”" },

  { spotId: "madison-avenue", sourceId: "wt-trevor-wisecup", speaker: "Trevor Wisecup", type: "walkie-talkie", basis: "shot-here", timestamp: 103, quote: "“I started a new project. It's Madison Avenue… I'm documenting Lexington and Madison. I'm trying to make a book.”" },
  { spotId: "bryant-park", sourceId: "wt-trevor-wisecup", speaker: "Trevor Wisecup", type: "walkie-talkie", basis: "haunt", timestamp: 189, quote: "“One of my favorite photos I've ever taken was actually in Bryant Park.”" },

  { spotId: "maria-hernandez-park", sourceId: "wt-izael-rivera-flores", speaker: "Izael Rivera Flores", type: "walkie-talkie", basis: "shot-here", timestamp: 465, quote: "“We are in Bushwick, Myrtle-Wyckoff… Maria Hernandez Park, a very famous park here.” Part of his regular route." },
  { spotId: "coney-island", sourceId: "wt-izael-rivera-flores", speaker: "Izael Rivera Flores", type: "walkie-talkie", basis: "haunt", timestamp: 642, quote: "“I've been in Coney Island four years — for me it's my favorite place to shoot.”" },

  { spotId: "fifth-ave-42nd-to-central-park", sourceId: "wt-melissa-oshaughnessy", speaker: "Melissa O'Shaughnessy", type: "walkie-talkie", basis: "shot-here", timestamp: 2020, quote: "“What makes Fifth Avenue good is when the sidewalks get really crowded.”" },

  { spotId: "grand-central", sourceId: "wt-jorge-garcia", speaker: "Jorge Garcia", type: "walkie-talkie", basis: "shot-here", timestamp: 91, quote: "“This here is Grand Central.”" },
  { spotId: "midtown", sourceId: "wt-jorge-garcia", speaker: "Jorge Garcia", type: "walkie-talkie", basis: "shot-here", timestamp: 96, quote: "“We're just gonna wander around Midtown… do the Midtown thing.”" },

  { spotId: "central-park", sourceId: "wt-john-wha", speaker: "John Wha", type: "walkie-talkie", basis: "shot-here", timestamp: 275, quote: "“Just wanted to dip in and see what was going on.”" },
  { spotId: "fifth-ave-47th-to-57th", sourceId: "wt-john-wha", speaker: "John Wha", type: "walkie-talkie", basis: "shot-here", timestamp: 540, quote: "Shooting at St. Patrick's Cathedral, 5th & 50th." },
  { spotId: "times-square", sourceId: "wt-john-wha", speaker: "John Wha", type: "walkie-talkie", basis: "shot-here", timestamp: 1064, quote: "“I have no problems with it at all… I'll dip through here every now and again.”" },
  { spotId: "midtown", sourceId: "wt-john-wha", speaker: "John Wha", type: "walkie-talkie", basis: "haunt", timestamp: 2052, quote: "“I've been kind of obsessed with Midtown recently.”" },
  { spotId: "brooklyn-bridge", sourceId: "wt-john-wha", speaker: "John Wha", type: "walkie-talkie", basis: "shot-here", timestamp: 2040, quote: "“Brooklyn Bridge, here we come — round two.”" },
  { spotId: "washington-square-park", sourceId: "wt-john-wha", speaker: "John Wha", type: "walkie-talkie", basis: "haunt", timestamp: 1381, quote: "“In Washington Square I'll shoot the fountain every now and again.”" },

  { spotId: "bryant-park", sourceId: "wt-conor-cunningham", speaker: "Conor James Cunningham", type: "walkie-talkie", basis: "haunt", timestamp: 339, quote: "“I really like 42nd and 6th, that area, because it gets a lot of light.”" },
  { spotId: "coney-island", sourceId: "wt-conor-cunningham", speaker: "Conor James Cunningham", type: "walkie-talkie", basis: "haunt", timestamp: 361, quote: "“I also really like shooting Coney. I think Coney might be my favorite.”" },

  { spotId: "midtown", sourceId: "wt-chris-voss", speaker: "Chris Voss", type: "walkie-talkie", basis: "shot-here", timestamp: 188, quote: "Shooting Midtown at night." },
  { spotId: "times-square", sourceId: "wt-chris-voss", speaker: "Chris Voss", type: "walkie-talkie", basis: "haunt", timestamp: 503, quote: "“It's a good time of year for Times Square at night — I love it. Last weekend was good because it was Fleet Week.”" },

  { spotId: "soho", sourceId: "wt-joe-greer", speaker: "Joe Greer", type: "walkie-talkie", basis: "shot-here", timestamp: 53, quote: "“I probably put through six rolls here in Soho… I love this corner, it's so photogenic.”" },
  { spotId: "coney-island", sourceId: "wt-joe-greer", speaker: "Joe Greer", type: "walkie-talkie", basis: "haunt", timestamp: 576, quote: "“Coney right now is one of my favorite, if not my favorite, place to shoot.”" },

  { spotId: "bushwick", sourceId: "wt-andre-d-wagner", speaker: "Andre D. Wagner", type: "walkie-talkie", basis: "shot-here", timestamp: 105, quote: "“My old neighborhood, the Bushwick/Bed-Stuy border… I've been photographing this spot for years.” Started out shooting on Broadway under the el." },

  { spotId: "14th-st-1st-ave", sourceId: "wt-sabrina-santiago", speaker: "Sabrina Santiago", type: "walkie-talkie", basis: "shot-here", timestamp: 46, quote: "“We're on 14th and 1st — I chose here. A stop I usually get off at if I don't know where I want to go.”" },
  { spotId: "lower-east-side", sourceId: "wt-sabrina-santiago", speaker: "Sabrina Santiago", type: "walkie-talkie", basis: "haunt", timestamp: 85, quote: "“Delancey Street is one of my favorite streets.”" },
  { spotId: "williamsburg-bridge", sourceId: "wt-sabrina-santiago", speaker: "Sabrina Santiago", type: "walkie-talkie", basis: "haunt", timestamp: 91, quote: "“The mouth of the Williamsburg Bridge — I'm always crossing the Williamsburg Bridge.”" },
  { spotId: "mulberry-street", sourceId: "wt-sabrina-santiago", speaker: "Sabrina Santiago", type: "walkie-talkie", basis: "shot-here", timestamp: 1013, quote: "“About to hit the Feast of San Gennaro, a big Italian festival here in the city.”" },

  { spotId: "fifth-ave-42nd-to-central-park", sourceId: "wt-daniel-arnold", speaker: "Daniel Arnold", type: "walkie-talkie", basis: "shot-here", timestamp: 3112, quote: "“Isn't it such a pleasure to walk up Fifth Avenue? It feels like my old friend… the darkness of 55th and Fifth, oh, so cozy.”" },

  { spotId: "howard-beach", sourceId: "wt-tyler-woodford", speaker: "Tyler Woodford", type: "walkie-talkie", basis: "shot-here", timestamp: 376, quote: "“Right here in Howard Beach making some photographs… I've been coming out here for a year and a half, two years. Charles Park is my favorite walk.”" },

  { spotId: "foley-square", sourceId: "wt-stephanie-keith", speaker: "Stephanie Keith", type: "walkie-talkie", basis: "shot-here", timestamp: 41, quote: "“We're at Foley Square.” Her beat: the criminal courthouse perp-walk hallway, 26 Federal Plaza." },
  { spotId: "tompkins-square-park", sourceId: "wt-stephanie-keith", speaker: "Stephanie Keith", type: "walkie-talkie", basis: "haunt", timestamp: 1192, quote: "“If there's punk shows in Tompkins Square Park, I definitely want to photograph those.”" },
  { spotId: "coney-island", sourceId: "wt-stephanie-keith", speaker: "Stephanie Keith", type: "walkie-talkie", basis: "haunt", timestamp: 2123, quote: "“I love the Mermaid Parade.”" },

  // Walkie Talkie batch 3

  { spotId: "borough-park", sourceId: "wt-marty-hamburger", speaker: "Marty Hamburger", type: "walkie-talkie", basis: "shot-here", timestamp: 147, quote: "“Borough Park, down here on 47th… we're going to cut down this way.”" },
  { spotId: "coney-island", sourceId: "wt-marty-hamburger", speaker: "Marty Hamburger", type: "walkie-talkie", basis: "haunt", timestamp: 794, quote: "Photographs the Polar Plunge every year — “it's also convenient, so it doesn't take much for me to go out there.”" },

  { spotId: "borough-park", sourceId: "wt-conrad-ziolkowski", speaker: "Conrad Ziolkowski", type: "walkie-talkie", basis: "haunt", timestamp: 312, quote: "“Other parts of South Brooklyn — Bensonhurst, Borough Park, Gravesend.”" },

  { spotId: "midtown", sourceId: "wt-mark-portillo", speaker: "Mark Portillo", type: "walkie-talkie", basis: "shot-here", timestamp: 33, quote: "“Midtown, a little downtown, mix of both.”" },

  { spotId: "washington-square-park", sourceId: "wt-elijah-mogoli", speaker: "Elijah Mogoli", type: "walkie-talkie", basis: "shot-here", timestamp: 1127, quote: "At the arch: “this is the wedding spot, everybody comes here.”" },
  { spotId: "harlem", sourceId: "wt-elijah-mogoli", speaker: "Elijah Mogoli", type: "walkie-talkie", basis: "haunt", timestamp: 975, quote: "“I love going to Harlem, that's one place I'll go.”" },

  { spotId: "orchard-beach", sourceId: "wt-cisco-vasquez", speaker: "Cisco Vasquez", type: "walkie-talkie", basis: "haunt", timestamp: 1808, quote: "“I like going there because you don't really see many photographers… the parking-lot scene, the beach itself, the boardwalk.”" },

  { spotId: "midtown", sourceId: "wt-cody-cutter", speaker: "Cody Cutter", type: "walkie-talkie", basis: "shot-here", timestamp: 39, quote: "“We're in Midtown. Lovely old Midtown… going up Fifth, Sixth, some Madison. Hitting all the main arteries.”" },

  { spotId: "times-square", sourceId: "wt-james-berkeley", speaker: "James Berkeley", type: "walkie-talkie", basis: "shot-here", timestamp: 880, quote: "Shooting Times Square with Paulie." },

  { spotId: "midtown", sourceId: "wt-laura-fuchs", speaker: "Laura Fuchs", type: "walkie-talkie", basis: "shot-here", timestamp: 223, quote: "Shooting at 31st & 7th — “you got the Empire right behind you.”" },
  { spotId: "harlem", sourceId: "wt-laura-fuchs", speaker: "Laura Fuchs", type: "walkie-talkie", basis: "haunt", timestamp: 1103, quote: "“Love Harlem. Harlem never disappoints.”" },
  { spotId: "washington-square-park", sourceId: "wt-laura-fuchs", speaker: "Laura Fuchs", type: "walkie-talkie", basis: "haunt", timestamp: 1135, quote: "“I love Washington Square Park — it's too saturated with cameras.”" },
  { spotId: "soho", sourceId: "wt-laura-fuchs", speaker: "Laura Fuchs", type: "walkie-talkie", basis: "shot-here", timestamp: 2094, quote: "“Have the best day in Soho, you guys.”" },

  { spotId: "herald-square", sourceId: "wt-reuben-radding", speaker: "Reuben Radding", type: "walkie-talkie", basis: "shot-here", timestamp: 625, quote: "“A period of about three minutes just now in Herald Square where all of that went away.”" },

  { spotId: "lower-east-side", sourceId: "wt-jaclyn-licht", speaker: "Jaclyn Licht", type: "walkie-talkie", basis: "shot-here", timestamp: 31, quote: "“We're here in the Lower East Side, off the Delancey-Essex stop… I really enjoy coming into Manhattan, especially Lower East Side and Chinatown.”" },
  { spotId: "chinatown", sourceId: "wt-jaclyn-licht", speaker: "Jaclyn Licht", type: "walkie-talkie", basis: "haunt", timestamp: 1145, quote: "“Especially Lower East Side and Chinatown, Little Italy.”" },
  { spotId: "united-nations", sourceId: "wt-jaclyn-licht", speaker: "Jaclyn Licht", type: "walkie-talkie", basis: "haunt", timestamp: 245, quote: "“The UN also became kind of a playground for street photography.”" },

  { spotId: "united-nations", sourceId: "wt-boris-apple", speaker: "Boris Apple", type: "walkie-talkie", basis: "shot-here", timestamp: 466, quote: "Heading to the UN during the General Assembly — “let me just get this.”" },

  { spotId: "bushwick-core", sourceId: "wt-billy-dinh", speaker: "Billy Dinh", type: "walkie-talkie", basis: "shot-here", timestamp: 460, quote: "“I'm based here in Bushwick, which is where I've taken you guys… I've shot this area quite a bit, so I'm starting to know a lot of locals.”" },

  { spotId: "ozone-park", sourceId: "wt-tyler-woodford-2021", speaker: "Tyler Woodford", type: "walkie-talkie", basis: "haunt", timestamp: 256, quote: "“I was finding places that I never thought New York would even look like — like Ozone Park.”" },

  { spotId: "ozone-park", sourceId: "wt-conrad-ziolkowski", speaker: "Conrad Ziolkowski", type: "walkie-talkie", basis: "haunt", timestamp: 326, quote: "“Rockaway, Ozone Park. Mostly shooting medium format out there.”" },

  // pins (exact spots)
  { spotId: "jacks-wife-freda-corner", sourceId: "wt-joe-greer", speaker: "Joe Greer", type: "walkie-talkie", basis: "shot-here", timestamp: 59, quote: "“Maddie and I went to Jack's Wife Freda, just sitting out… I got through three rolls in an hour just on this one corner. The majority of my time has been spent here.”" },
  { spotId: "broadway-prince", sourceId: "wt-alex-brown", speaker: "Alex Brown", type: "walkie-talkie", basis: "haunt", timestamp: 127, quote: "“This is probably where I spend most of my time in Soho.”" },
  { spotId: "fulton-nostrand", sourceId: "wt-ryan-riley", speaker: "Ryan Riley", type: "walkie-talkie", basis: "shot-here", timestamp: 393, quote: "“Fulton Street and Nostrand. This is like the heart of Bed-Stuy.”" },
  { spotId: "54th-madison", sourceId: "wt-trevor-wisecup", speaker: "Trevor Wisecup", type: "walkie-talkie", basis: "shot-here", timestamp: 554, quote: "“This is 54th and Madison.” Part of his Madison Avenue book project." },
  { spotId: "55th-fifth", sourceId: "wt-daniel-arnold", speaker: "Daniel Arnold", type: "walkie-talkie", basis: "haunt", timestamp: 3186, quote: "“That 55th is a particular one. The darkness of 55th and Fifth — oh, so cozy.”" },
  { spotId: "110th-cpw", sourceId: "wt-chris-perez", speaker: "Chris Perez", type: "walkie-talkie", basis: "shot-here", timestamp: 47, quote: "“We're on the corner of 110th and Central Park.”" },
  { spotId: "205th-grand-concourse", sourceId: "wt-yusef-emuna", speaker: "Yusef Emuna", type: "walkie-talkie", basis: "shot-here", timestamp: 30, quote: "“I brought Paulie out today to 205th off of Grand Concourse.”" },
  { spotId: "kingston-eastern-pkwy", sourceId: SRC, speaker: "Eli", type: "visitor", timestamp: 796, quote: "“Kingston Avenue, right off of Eastern Parkway. Friday at like 12, while everyone's preparing for Shabbat.”" },
  { spotId: "corona-plaza", sourceId: "wt-willie-velazquez", speaker: "Willie Velazquez", type: "walkie-talkie", basis: "shot-here", timestamp: 18, quote: "“Right now we're in Roosevelt, Corona Plaza, where I grew up.”" },
  { spotId: "myrtle-wyckoff", sourceId: "wt-izael-rivera-flores", speaker: "Izael Rivera Flores", type: "walkie-talkie", basis: "shot-here", timestamp: 65, quote: "“We are here in Myrtle-Wyckoff, this is Myrtle Avenue… part of my route when I go to take pictures.”" },
  { spotId: "la-plaza-cultural", sourceId: "wt-troy-williams", speaker: "Troy Williams", type: "walkie-talkie", basis: "shot-here", timestamp: 411, quote: "Shooting in the community garden — “I think it's La Plaza Cultural, is what it's called.”" },
  { spotId: "wall-street-bull", sourceId: "wt-dustin-roderick", speaker: "Dustin Roderick", type: "walkie-talkie", basis: "shot-here", timestamp: 2122, quote: "“I've never been over here really, to the Wall Street Bull.”" },
  { spotId: "st-patricks", sourceId: "wt-john-wha", speaker: "John Wha", type: "walkie-talkie", basis: "shot-here", timestamp: 540, quote: "“Here we are at St. Patrick's Cathedral. Iconic.”" },
  { spotId: "42nd-6th", sourceId: "wt-conor-cunningham", speaker: "Conor James Cunningham", type: "walkie-talkie", basis: "haunt", timestamp: 339, quote: "“I really like 42nd and 6th, that area, because it gets a lot of light.”" },
  { spotId: "26-federal-plaza", sourceId: "wt-stephanie-keith", speaker: "Stephanie Keith", type: "walkie-talkie", basis: "haunt", timestamp: 536, quote: "“The criminal courthouse, where you can photograph the people walking up and down the hallway… photos I took at 26 Federal Plaza.”" },
];
