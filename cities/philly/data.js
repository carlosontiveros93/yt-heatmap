// Data model: same as cities/nyc/data.js (SPOTS, SOURCES, MENTIONS). All Philly
// mentions are from Walkie Talkie episodes, so every mention is type
// "walkie-talkie" with a basis of "shot-here" or "haunt". Timestamps are seconds
// into the video. Proposal and reasoning: research/proposals/philly_proposed.md.

const SPOTS = [
  // parks
  { id: "rittenhouse-square", name: "Rittenhouse Square",                              lat: 39.9495, lng: -75.1719, kind: "park", area: "Center City" },

  // landmarks
  { id: "msb-plaza",          name: "Municipal Services Building plaza (“Muni”)",      lat: 39.9540, lng: -75.1642, kind: "landmark", area: "Center City" },
  { id: "dilworth-park",      name: "Dilworth Park (City Hall)",                       lat: 39.9528, lng: -75.1648, kind: "landmark", area: "Center City" },
  { id: "city-hall-station",  name: "City Hall Station (Broad Street Line)",           lat: 39.95254, lng: -75.16385, kind: "landmark", area: "Center City" },
  // whole line, like nyc-subway: area is null (citywide); the dot sits on Broad St at City Hall
  { id: "broad-street-line",  name: "SEPTA Broad Street Line",                         lat: 39.95195, lng: -75.16375, kind: "landmark", area: null },

  // corridors
  { id: "chestnut-st",        name: "Chestnut St (Broad to 18th)",                     lat: 39.95128, lng: -75.16718, kind: "corridor", area: "Center City" },
  { id: "walnut-st",          name: "Walnut St (Broad to 18th)",                       lat: 39.94977, lng: -75.16750, kind: "corridor", area: "Center City" },

  // pins: exact spots named on camera, high confidence only. A pin sits alongside
  // the person's mention on the containing area; it adds precision, not a move.
  { id: "broad-and-walnut",   name: "Broad & Walnut",                                  lat: 39.94935, lng: -75.16426, kind: "pin", area: "Center City" },
  { id: "18th-and-walnut",    name: "18th & Walnut (NE corner of Rittenhouse Square)", lat: 39.95016, lng: -75.17068, kind: "pin", area: "Center City" },
];

const SOURCES = [
  // Walkie Talkie episodes: a day shooting with one photographer, usually on their home turf
  { id: "wt-olu-okiemute", title: "The Photography of Olu Okiemute -- Walkie Talkie around the US ep 5 / Philadelphia", channel: "Paulie B", url: "https://www.youtube.com/watch?v=eloT_IvSaOI" },
  { id: "wt-nazir-wayman", title: "The photography of Nazir Wayman -- Canon P & the Nikon F5 -- Walkie Talkie around the US ep 4", channel: "Paulie B", url: "https://www.youtube.com/watch?v=kQKkKCdwZA8" },
];

const MENTIONS = [
  // Rittenhouse Square
  { spotId: "rittenhouse-square", sourceId: "wt-olu-okiemute", speaker: "Olu Okiemute", type: "walkie-talkie", basis: "shot-here", timestamp: 688, quote: "“We're going to go in Rittenhouse…” A couple of minutes shooting inside the park, including the squirrel-feeding scene." },
  { spotId: "rittenhouse-square", sourceId: "wt-olu-okiemute", speaker: "Olu Okiemute", type: "walkie-talkie", basis: "haunt", timestamp: 693, quote: "“Rittenhouse pictures again, that's all you did today, all you could get was Rittenhouse pics.” His fallback when the streets are dead, and the turnaround of his usual loop." },
  { spotId: "rittenhouse-square", sourceId: "wt-nazir-wayman", speaker: "Nazir Wayman", type: "walkie-talkie", basis: "shot-here", timestamp: 1157, quote: "“Beautiful dogs, that was an insane time to take a picture of a dog.” In “the tiny little park down the street”, reached by walking west on Walnut from Broad." },
  { spotId: "rittenhouse-square", sourceId: "wt-nazir-wayman", speaker: "Nazir Wayman", type: "walkie-talkie", basis: "haunt", timestamp: 910, quote: "“I get off the train, go to La Colombe, I walk right to that corner, make my way straight up to the park.” Every day after work, around 3:30." },

  // Municipal Services Building plaza
  { spotId: "msb-plaza", sourceId: "wt-nazir-wayman", speaker: "Nazir Wayman", type: "walkie-talkie", basis: "shot-here", timestamp: 2010, quote: "“This is the Municipal Services Building, we call it Muni, it's an iconic skate spot.” Later: “hey, this is the pit”, and “I really hope the flag covered his face.”" },
  { spotId: "msb-plaza", sourceId: "wt-nazir-wayman", speaker: "Nazir Wayman", type: "walkie-talkie", basis: "haunt", timestamp: 2324, quote: "“I still come every day… come downtown, go to La Colombe, come here, and then I'll do my route.” His home ground since he started skating; he is making a book about it." },

  // City Hall
  { spotId: "dilworth-park", sourceId: "wt-olu-okiemute", speaker: "Olu Okiemute", type: "walkie-talkie", basis: "shot-here", timestamp: 841, quote: "“Let's go back to City Hall, hope some hooligans are at Dilworth being bad, and if we got nothing we'll go underground.” Several frames follow, including a worker's portrait." },
  { spotId: "city-hall-station", sourceId: "wt-olu-okiemute", speaker: "Olu Okiemute", type: "walkie-talkie", basis: "haunt", timestamp: 849, quote: "“I like City Hall Station, as far as subway stations go in Philadelphia it has my favorite unique characteristics, it still has some of its original grit.” Shoots underground in winter “like every day.”" },
  { spotId: "city-hall-station", sourceId: "wt-olu-okiemute", speaker: "Olu Okiemute", type: "walkie-talkie", basis: "shot-here", timestamp: 1371, quote: "“You want to try to go downstairs? Yeah let's do it, just in case something's down there.” On the platform as a Broad Street Line train passes." },
  { spotId: "broad-street-line", sourceId: "wt-olu-okiemute", speaker: "Olu Okiemute", type: "walkie-talkie", basis: "haunt", timestamp: 864, quote: "“You know me, I'm a big Broad Street Line fan anyway, I've walked the whole thing, taking trains up and down the whole thing.”" },

  // corridors
  { spotId: "chestnut-st", sourceId: "wt-olu-okiemute", speaker: "Olu Okiemute", type: "walkie-talkie", basis: "shot-here", timestamp: 543, quote: "“Finally got my wind shot today, that was a good one, okay thanks Chestnut Street.” Right after a Hasselblad portrait of a seated smoker." },
  { spotId: "walnut-st", sourceId: "wt-olu-okiemute", speaker: "Olu Okiemute", type: "walkie-talkie", basis: "shot-here", timestamp: 665, quote: "“We'll keep walking down Walnut… as I stood here looking, everyone that was here has passed us by, popular camping spot.”" },
  { spotId: "walnut-st", sourceId: "wt-nazir-wayman", speaker: "Nazir Wayman", type: "walkie-talkie", basis: "haunt", timestamp: 910, quote: "“I walk right to that corner, make my way straight up to the park.” Walnut from Broad to Rittenhouse is the fixed leg of his daily route." },

  // pins
  { spotId: "broad-and-walnut", sourceId: "wt-nazir-wayman", speaker: "Nazir Wayman", type: "walkie-talkie", basis: "haunt", timestamp: 710, quote: "“I photograph on this corner so much I'm not even thinking of anybody else doing it.” The Ray Metzker corner; best light around 1 or 2, when “the sun comes down Broad Street and just blasts right here.”" },
  { spotId: "broad-and-walnut", sourceId: "wt-nazir-wayman", speaker: "Nazir Wayman", type: "walkie-talkie", basis: "shot-here", timestamp: 659, quote: "“This is my favorite corner in the entire city right here… this is Broad and Walnut.” Said just after a frame: “damn, that guy ran at the perfect time.”" },
  { spotId: "18th-and-walnut", sourceId: "wt-olu-okiemute", speaker: "Olu Okiemute", type: "walkie-talkie", basis: "shot-here", timestamp: 679, quote: "Paulie: “what street is this?” Olu: “we're at 18th and Walnut, right by this little park.” The corner he had just been posted up on." },
];
