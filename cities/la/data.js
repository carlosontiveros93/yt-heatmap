// Data model: same as cities/nyc/data.js (SPOTS, SOURCES, MENTIONS). All LA
// mentions are from Walkie Talkie episodes, so every mention is type
// "walkie-talkie" with a basis of "shot-here" or "haunt". Timestamps are seconds
// into the video. Proposal and reasoning: research/proposals/la_proposed.md.

const SPOTS = [
  // neighborhoods
  { id: "koreatown",          name: "Koreatown",                              lat: 34.0617, lng: -118.3005, kind: "neighborhood" },
  { id: "east-hollywood",     name: "East Hollywood",                         lat: 34.0906, lng: -118.2950, kind: "neighborhood" },
  { id: "financial-district", name: "Financial District (Downtown)",          lat: 34.0505, lng: -118.2562, kind: "neighborhood" },

  // corridors
  { id: "hollywood-blvd",     name: "Hollywood Blvd (Highland to Vine)",      lat: 34.1017, lng: -118.3328, kind: "corridor" },
  { id: "wilshire-ktown",     name: "Wilshire Blvd, Koreatown (Vermont to Western)", lat: 34.0618, lng: -118.3003, kind: "corridor" },
  { id: "broadway-dtla",      name: "Broadway, Historic Core (3rd to 9th St)", lat: 34.0467, lng: -118.2520, kind: "corridor" },

  // pins: exact spots named on camera, high confidence only. A pin sits alongside
  // the person's mention on the containing area; it adds precision, not a move.
  { id: "hollywood-and-vine",  name: "Hollywood & Vine",                        lat: 34.1016, lng: -118.3267, kind: "pin" },
  { id: "wilshire-vermont",    name: "Wilshire Blvd & Vermont Ave",              lat: 34.0618, lng: -118.2917, kind: "pin" },
  { id: "wilton-santa-monica", name: "Wilton Pl & Santa Monica Blvd (old Sears)", lat: 34.0908, lng: -118.3136, kind: "pin" },
];

const SOURCES = [
  // Walkie Talkie episodes: a day shooting with one photographer, usually on their home turf
  { id: "wt-stephen-vanasco", title: "A Day with Stephen Vanasco in Los Angeles (Walkie Talkie episode 88)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=cpdytzJ24xo" },
  { id: "wt-daniel-gutierrez", title: "a day with LA Photographer Daniel Gutierrez -- (Walkie Talkie around the US)", channel: "Paulie B", url: "https://www.youtube.com/watch?v=7dgmZX3QPQI" },
  { id: "wt-jeremy-paige", title: "L.A.'s most popular street photographer? -- Walkie Talkie w/ Jeremy Paige", channel: "Paulie B", url: "https://www.youtube.com/watch?v=E97-PxWYPAI" },
  { id: "wt-adali-schell", title: "Photographing L.A. with Adali Schell -- Walkie Talkie around the US", channel: "Paulie B", url: "https://www.youtube.com/watch?v=lXjlicEMJt0" },
];

const MENTIONS = [
  // Hollywood Blvd
  { spotId: "hollywood-blvd", sourceId: "wt-jeremy-paige", speaker: "Jeremy Paige", type: "walkie-talkie", basis: "haunt", timestamp: 19, quote: "“I take photos on Hollywood Boulevard, basically that's about it.” The whole episode is walked and shot on the boulevard; “this is basically the only place I shoot.”" },
  { spotId: "hollywood-blvd", sourceId: "wt-stephen-vanasco", speaker: "Stephen Vanasco", type: "walkie-talkie", basis: "shot-here", timestamp: 163, quote: "Off the B Line at Hollywood/Highland: “we're going to walk down this way towards Vine.”" },

  // Koreatown
  { spotId: "koreatown", sourceId: "wt-daniel-gutierrez", speaker: "Daniel Gutierrez", type: "walkie-talkie", basis: "shot-here", timestamp: 152, quote: "“This is basically us walking into Koreatown.” Flash urban landscapes on its side streets for the rest of the episode." },
  { spotId: "koreatown", sourceId: "wt-stephen-vanasco", speaker: "Stephen Vanasco", type: "walkie-talkie", basis: "shot-here", timestamp: 967, quote: "“Got off the train at Wilshire/Vermont. Good walking space for Los Angeles, with bodies, people, activity.”" },
  { spotId: "wilshire-ktown", sourceId: "wt-stephen-vanasco", speaker: "Stephen Vanasco", type: "walkie-talkie", basis: "shot-here", timestamp: 1788, quote: "“A lot of Art Deco architecture on Wilshire… a bit of this older LA that's slowly disappearing.” Walked Vermont to the Wiltern and back." },

  // Downtown
  { spotId: "broadway-dtla", sourceId: "wt-stephen-vanasco", speaker: "Stephen Vanasco", type: "walkie-talkie", basis: "shot-here", timestamp: 2026, quote: "“Broadway right here is one of those streets… for downtown, this is it. I'll kind of lap around here.” “Got in my shot with this cart.”" },
  { spotId: "financial-district", sourceId: "wt-stephen-vanasco", speaker: "Stephen Vanasco", type: "walkie-talkie", basis: "shot-here", timestamp: 2232, quote: "“This is our financial district. A little bit tiny compared to New York.” A few blocks west of Broadway; the Heat shootout street." },

  // East Hollywood
  { spotId: "east-hollywood", sourceId: "wt-adali-schell", speaker: "Adali Schell", type: "walkie-talkie", basis: "haunt", timestamp: 1005, quote: "“Where I grew up, East Hollywood, Los Feliz-adjacent… some of my favorite spots to shoot.” Goes there “all the time.”" },

  // pins
  { spotId: "hollywood-and-vine", sourceId: "wt-stephen-vanasco", speaker: "Stephen Vanasco", type: "walkie-talkie", basis: "shot-here", timestamp: 754, quote: "“We're walking up on the intersection of Hollywood and Vine… a great photo Winogrand made on this corner.” “It's always fun to walk past it.”" },
  { spotId: "wilshire-vermont", sourceId: "wt-stephen-vanasco", speaker: "Stephen Vanasco", type: "walkie-talkie", basis: "shot-here", timestamp: 967, quote: "“Got off the train at Wilshire/Vermont. Good walking space… bodies, people, activity.” Walks and shoots from here." },
  { spotId: "wilton-santa-monica", sourceId: "wt-adali-schell", speaker: "Adali Schell", type: "walkie-talkie", basis: "shot-here", timestamp: 1533, quote: "“We are in the intersection of Wilton and Santa Monica… this spot means something to me.” Gets out and shoots the old Sears he has photographed “from a whole bunch of different years.”" },
];
