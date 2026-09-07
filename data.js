// Spots mentioned in "I asked photographers in NYC: Where should visitors go
// for street photography?" by Paulie B — https://www.youtube.com/watch?v=X0CbbpuR9vs
// t = seconds into the video where the mention happens.
// kind: "visitor" = recommended for first-time visitors, "favorite" = the
// photographer's own current favorite spot.
const VIDEO_ID = "X0CbbpuR9vs";

const MENTIONS = [
  { spot: "NYC Subway (J/M/F elevated lines)", lat: 40.7132, lng: -73.9576, who: "Jeffrey", kind: "visitor", t: 24,   note: "“The city underneath the city” — likes lines that go above ground (J, M, F to Coney)." },
  { spot: "Bushwick — under the Broadway el", lat: 40.6934, lng: -73.9272, who: "Jeffrey", kind: "favorite", t: 68,  note: "His neighborhood; shooting underneath the elevated tracks on Broadway." },

  { spot: "Fifth Avenue (42nd St to Central Park)", lat: 40.7575, lng: -73.9780, who: "Rob", kind: "visitor", t: 93,  note: "“Just go.” Any day, any time." },
  { spot: "47th St btwn 5th & 6th (Diamond District)", lat: 40.7573, lng: -73.9794, who: "Rob", kind: "favorite", t: 109, note: "“You never know who you're going to run into.”" },

  { spot: "Midtown", lat: 40.7549, lng: -73.9840, who: "John", kind: "visitor", t: 155, note: "Easiest place to start — density, mix of tourists and workers." },
  { spot: "East Village / Tompkins Square Park", lat: 40.7265, lng: -73.9818, who: "John", kind: "visitor", t: 173, note: "Where he spends 90% of his time." },
  { spot: "East River waterfront", lat: 40.7290, lng: -73.9720, who: "John", kind: "visitor", t: 182, note: "Good for portraits and scenery along the water." },
  { spot: "West Side Highway / Hudson waterfront", lat: 40.7460, lng: -74.0086, who: "John", kind: "visitor", t: 213, note: "“Anywhere along the water is nice. Both sides.”" },
  { spot: "Domino Park (Williamsburg)", lat: 40.7146, lng: -73.9672, who: "John", kind: "visitor", t: 216, note: "Scenery and skyline — more to play with than just people." },
  { spot: "Alphabet City (East Village)", lat: 40.7248, lng: -73.9793, who: "John", kind: "favorite", t: 246, note: "Very neighbor-hoody; loves the community aspect." },
  { spot: "14th St & 1st Ave / Ave A corners", lat: 40.7317, lng: -73.9829, who: "John", kind: "favorite", t: 287, note: "First L stop into Manhattan; good mix of people 3–7pm, great light down 14th St." },

  { spot: "Midtown (34th St to the park, 9th to Lex)", lat: 40.7529, lng: -73.9827, who: "Tall photographer", kind: "visitor", t: 359, note: "Coming from Denver/Albuquerque: “what you get in a week elsewhere you get in a day here.”" },
  { spot: "The High Line", lat: 40.7480, lng: -74.0048, who: "Tall photographer", kind: "favorite", t: 386, note: "“My favorite park. Hard to make images there, but rewarding.”" },

  { spot: "Times Square", lat: 40.7580, lng: -73.9855, who: "Ian", kind: "visitor", t: 444, note: "“Just blow it open at Times Square, then trickle around.”" },
  { spot: "Blissville (Queens)", lat: 40.7373, lng: -73.9319, who: "Ian", kind: "favorite", t: 492, note: "Little triangle between Greenpoint and Sunnyside; a project is building there." },

  { spot: "Fifth Ave, 47th to 57th St", lat: 40.7601, lng: -73.9750, who: "Ilya", kind: "visitor", t: 536, note: "Corners of 5th & 47th and 5th & 57th are good." },
  { spot: "Times Square", lat: 40.7580, lng: -73.9855, who: "Ilya", kind: "visitor", t: 552, note: "Good place to get acclimated — lots of people, lots of cameras." },
  { spot: "The High Line", lat: 40.7480, lng: -74.0048, who: "Ilya", kind: "visitor", t: 572, note: "Nice and interesting, good density, cool scenery." },
  { spot: "Coney Island", lat: 40.5749, lng: -73.9786, who: "Ilya", kind: "favorite", t: 593, note: "Open scenery on the boardwalk, color, diversity of people." },

  { spot: "Times Square", lat: 40.7580, lng: -73.9855, who: "Vince", kind: "visitor", t: 666, note: "“Like shooting fish in a barrel.” Great for wide-angle." },
  { spot: "Coney Island", lat: 40.5749, lng: -73.9786, who: "Vince", kind: "visitor", t: 695, note: "Peak of summer: rides, beach, boardwalk — a few locations in one." },
  { spot: "Times Square", lat: 40.7580, lng: -73.9855, who: "Vince", kind: "favorite", t: 736, note: "Shoots it almost daily on his commute — “habit or addiction.”" },

  { spot: "Crown Heights (Kingston Ave & Eastern Pkwy)", lat: 40.6690, lng: -73.9422, who: "Eli", kind: "visitor", t: 796, note: "Friday around noon before Shabbat; come with respect and genuine curiosity." },
  { spot: "Crown Heights", lat: 40.6690, lng: -73.9422, who: "Eli", kind: "favorite", t: 880, note: "“That's where I'm from... the work I feel most connected to.”" },

  { spot: "Washington Square Park", lat: 40.7308, lng: -73.9973, who: "Kazu", kind: "visitor", t: 916, note: "Easy access to people who want to be photographed (but his least favorite)." },
  { spot: "Central Park", lat: 40.7712, lng: -73.9742, who: "Kazu", kind: "favorite", t: 931, note: "“So many scenes out there — quiet scenes, sometimes busy.”" },

  { spot: "Brooklyn (Bed-Stuy / Crown Heights area)", lat: 40.6845, lng: -73.9430, who: "Luca", kind: "visitor", t: 1046, note: "More authentic to the New York experience than Times Square tourists." },
  { spot: "Flatbush", lat: 40.6415, lng: -73.9594, who: "Luca", kind: "visitor", t: 1098, note: "An untouched Brooklyn neighborhood, great for street." },
  { spot: "Lower East Side", lat: 40.7168, lng: -73.9861, who: "Luca", kind: "visitor", t: 1112, note: "Loves shooting here." },
  { spot: "Financial District", lat: 40.7075, lng: -74.0113, who: "Luca", kind: "visitor", t: 1116, note: "Fun during the week — business types." },
  { spot: "Bed-Stuy", lat: 40.6872, lng: -73.9418, who: "Luca", kind: "favorite", t: 1132, note: "Authentic, chill, great architecture and greenery. Great for film." },

  { spot: "Washington Square Park", lat: 40.7308, lng: -73.9973, who: "Angela", kind: "visitor", t: 1192, note: "“Easy pictures left and right.”" },
  { spot: "Times Square", lat: 40.7580, lng: -73.9855, who: "Angela", kind: "visitor", t: 1200, note: "Busy, though it can get overwhelming." },
  { spot: "Chinatown", lat: 40.7158, lng: -73.9970, who: "Angela", kind: "visitor", t: 1205, note: "Where she heads when Midtown is too much." },
  { spot: "Financial District", lat: 40.7075, lng: -74.0113, who: "Angela", kind: "visitor", t: 1208, note: "Good." },
  { spot: "Tribeca", lat: 40.7163, lng: -74.0086, who: "Angela", kind: "visitor", t: 1209, note: "Good." },
  { spot: "Soho", lat: 40.7233, lng: -74.0030, who: "Angela", kind: "visitor", t: 1209, note: "Good." },
  { spot: "Washington Square Park", lat: 40.7308, lng: -73.9973, who: "Angela", kind: "favorite", t: 1217, note: "Met amazing people here — the skateboarders." },
  { spot: "Central Park", lat: 40.7712, lng: -73.9742, who: "Angela", kind: "favorite", t: 1224, note: "Also walks Lower Manhattan up to the park." },

  { spot: "Central Park — the rock (near Heckscher)", lat: 40.7690, lng: -73.9780, who: "Paulie B", kind: "visitor", t: 1258, note: "Red leaves in fall, people playing all over the rock. Best Oct–Nov, Apr–May." },
  { spot: "Central Park — Bethesda Fountain", lat: 40.7659, lng: -73.9711, who: "Paulie B", kind: "visitor", t: 1290, note: "Popping on weekends and evenings." },
  { spot: "Central Park — Sheep Meadow", lat: 40.7719, lng: -73.9754, who: "Paulie B", kind: "visitor", t: 1298, note: "People sprawled out on nice weekends; be interactive." },
  { spot: "Central Park — sailboat pond", lat: 40.7740, lng: -73.9526, who: "Paulie B", kind: "visitor", t: 1313, note: "Model sailboats; early-morning off-leash dogs jumping in the water." },
  { spot: "Flushing", lat: 40.7596, lng: -73.8301, who: "Paulie B", kind: "visitor", t: 1344, note: "Mostly locals, extremely busy, amazing food. Take the 7 to the last stop." },
  { spot: "Jackson Heights", lat: 40.7557, lng: -73.8831, who: "Paulie B", kind: "visitor", t: 1376, note: "Get off the 7 on the way back; mix with locals." },
  { spot: "Corona", lat: 40.7450, lng: -73.8643, who: "Paulie B", kind: "visitor", t: 1383, note: "Same — if you're comfortable mixing with locals." },
];
