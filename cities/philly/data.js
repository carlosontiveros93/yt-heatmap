// Data model: same as cities/nyc/data.js (SPOTS, SOURCES, MENTIONS). Every mention
// is type "walkie-talkie" with a basis of "shot-here" or "haunt", including the rows
// from channels other than Paulie B (same kind of evidence: a photographer on camera
// shooting or naming a regular spot); the popup shows the source's channel for those.
// Timestamps are seconds into the video. Proposals and reasoning:
// research/proposals/philly_proposed.md (Paulie B's two episodes) and
// research/proposals/philly_other_sources_proposed.md (other channels, approved 2026-11-05).

const SPOTS = [
  // parks
  { id: "rittenhouse-square", name: "Rittenhouse Square",                              lat: 39.9495, lng: -75.1719, kind: "park", area: "Center City" },

  // neighborhoods
  { id: "chinatown",          name: "Chinatown",                                       lat: 39.9554, lng: -75.1561, kind: "neighborhood", area: "Center City" },

  // landmarks
  { id: "msb-plaza",          name: "Municipal Services Building plaza (“Muni”)",      lat: 39.9540, lng: -75.1642, kind: "landmark", area: "Center City" },
  { id: "dilworth-park",      name: "Dilworth Park (City Hall)",                       lat: 39.9528, lng: -75.1648, kind: "landmark", area: "Center City" },
  { id: "city-hall-station",  name: "City Hall Station (Broad Street Line)",           lat: 39.95254, lng: -75.16385, kind: "landmark", area: "Center City" },
  // whole line, like nyc-subway: area is null (citywide); the dot sits on Broad St at City Hall
  { id: "broad-street-line",  name: "SEPTA Broad Street Line",                         lat: 39.95195, lng: -75.16375, kind: "landmark", area: null },
  { id: "city-hall",          name: "City Hall (archways & courtyard)",                lat: 39.9524, lng: -75.1636, kind: "landmark", area: "Center City" },
  // the El: whole line, citywide; the dot sits at 15th St station
  { id: "market-frankford-line", name: "The El (Market-Frankford Line)",               lat: 39.95258, lng: -75.16522, kind: "landmark", area: null },
  // weekend market inside FDR Park; its footprint moves between seasons, so the dot is approximate
  { id: "southeast-asian-market", name: "Southeast Asian Market, FDR Park",            lat: 39.9035, lng: -75.1815, kind: "landmark", area: "South Philadelphia" },

  // corridors
  { id: "chestnut-st",        name: "Chestnut St (Broad to 18th)",                     lat: 39.95128, lng: -75.16718, kind: "corridor", area: "Center City" },
  { id: "walnut-st",          name: "Walnut St (Broad to 18th)",                       lat: 39.94977, lng: -75.16750, kind: "corridor", area: "Center City" },
  { id: "market-st-east",     name: "Market St East (City Hall to 10th)",              lat: 39.95190, lng: -75.15955, kind: "corridor", area: "Center City" },
  { id: "south-st",           name: "South St (Front to 10th)",                        lat: 39.94190, lng: -75.15135, kind: "corridor", area: "Center City" },
  // Dante Sisofo's "Philly in Flux" walks: a whole avenue end to end, shot once by one person
  { id: "lehigh-ave",         name: "Lehigh Ave (33rd St to Richmond St)",             lat: 39.99160, lng: -75.14900, kind: "corridor", area: "North Philadelphia" },
  { id: "woodland-ave",       name: "Woodland Ave (Cobbs Creek Pkwy to University City)", lat: 39.93300, lng: -75.22400, kind: "corridor", area: "Southwest Philadelphia" },
  { id: "germantown-ave",     name: "Germantown Ave (Chestnut Hill to 2nd St)",        lat: 40.03479, lng: -75.17343, kind: "corridor", area: "Northwest Philadelphia" },

  // pins: exact spots named on camera, high confidence only. A pin sits alongside
  // the person's mention on the containing area; it adds precision, not a move.
  { id: "broad-and-walnut",   name: "Broad & Walnut",                                  lat: 39.94935, lng: -75.16426, kind: "pin", area: "Center City" },
  { id: "18th-and-walnut",    name: "18th & Walnut (NE corner of Rittenhouse Square)", lat: 39.95016, lng: -75.17068, kind: "pin", area: "Center City" },
  { id: "15th-and-chestnut",  name: "15th & Chestnut",                                 lat: 39.95109, lng: -75.16561, kind: "pin", area: "Center City" },
  { id: "city-hall-west-archway", name: "City Hall west archway (facing Dilworth Park)", lat: 39.95253, lng: -75.16443, kind: "pin", area: "Center City" },
];

const SOURCES = [
  // Walkie Talkie episodes: a day shooting with one photographer, usually on their home turf
  { id: "wt-olu-okiemute", title: "The Photography of Olu Okiemute -- Walkie Talkie around the US ep 5 / Philadelphia", channel: "Paulie B", url: "https://www.youtube.com/watch?v=eloT_IvSaOI" },
  { id: "wt-nazir-wayman", title: "The photography of Nazir Wayman -- Canon P & the Nikon F5 -- Walkie Talkie around the US ep 4", channel: "Paulie B", url: "https://www.youtube.com/watch?v=kQKkKCdwZA8" },

  // other channels, each approved by Carlos (research/philly/sources_candidates.md, Tier A)
  { id: "espinal-sam-rivera", title: "The Art & Hustle of Philly Street Photography. (Creative Talks with Sam Rivera)", channel: "Jay Espinal", url: "https://www.youtube.com/watch?v=vqujQJntrgc" },
  { id: "wong-ask-strangers", title: "How to ASK STRANGERS for PHOTOS -- Rittenhouse Square & Chinatown Vlog # 16", channel: "Alex Wong", url: "https://www.youtube.com/watch?v=imQQZ-fB9Pc" },
  { id: "wong-photo-walk", title: "Street Photo Walk with Lou, Joe, De'Von the Wolf, Mr. Tan, Mei in center city Philadelphia, 7-16-22", channel: "Alex Wong", url: "https://www.youtube.com/watch?v=Vt3zeVksWJY" },
  { id: "sisofo-best-location-2024", title: "The BEST location for Street Photography in Philadelphia (2024)", channel: "Dante Sisofo", url: "https://www.youtube.com/watch?v=t2x6VZR4eyc" },
  { id: "sisofo-best-location-2023", title: "The BEST location for Street Photography in Philadelphia (2023)", channel: "Dante Sisofo", url: "https://www.youtube.com/watch?v=aimOhkdFXco" },
  { id: "sisofo-why-philadelphia", title: "Why Philadelphia for Street Photography?", channel: "Dante Sisofo", url: "https://www.youtube.com/watch?v=ezQuW6q5I_c" },
  { id: "sisofo-southeast-asian-market", title: "Ricoh GR IV Monochrome Street Photography at Philadelphia’s Southeast Asian Market", channel: "Dante Sisofo", url: "https://www.youtube.com/watch?v=tgPeT2aZXA4" },
  { id: "sisofo-flux-lehigh", title: "Ricoh GR IV Monochrome Geotagging POV | Philly in Flux (Lehigh Ave)", channel: "Dante Sisofo", url: "https://www.youtube.com/watch?v=ktLSt9TIUkc" },
  { id: "sisofo-flux-woodland", title: "Ricoh GR IV Monochrome Geotagging POV | Philly in Flux #2 (Woodland Ave)", channel: "Dante Sisofo", url: "https://www.youtube.com/watch?v=uuSjvodevgA" },
  { id: "sisofo-flux-germantown", title: "Germantown Ave in Flux (06/02/2026)", channel: "Dante Sisofo", url: "https://www.youtube.com/watch?v=9jzs0Lt4qi4" },
  { id: "violentshock-night-spots", title: "7 Dope Philly Night Photography Spots", channel: "Violentshock", url: "https://www.youtube.com/watch?v=xvjIKjpT-II" },
  { id: "visitphilly-south-street-sam", title: "Philly LOVE Stories: @southstreetsam", channel: "Visit Philadelphia", url: "https://www.youtube.com/watch?v=Sitl10hzZxc" },
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

  // ---- other channels (approved 2026-11-05) ----
  // additions to the spots above
  { spotId: "rittenhouse-square", sourceId: "espinal-sam-rivera", speaker: "Sam Rivera", type: "walkie-talkie", basis: "shot-here", timestamp: 33, quote: "“We are here in Rittenhouse to start our day.” Later, on a frame made there: “the guy in the park with the newspaper… after I shoot it, I got to keep moving.”" },
  { spotId: "rittenhouse-square", sourceId: "wong-ask-strangers", speaker: "Alex Wong", type: "walkie-talkie", basis: "shot-here", timestamp: 108, quote: "“Can I have a picture please? I love this, this is so nice.” Portraits of strangers on a walk by the Rittenhouse Square Fine Art Show (place named in the video description, not on camera)." },
  { spotId: "dilworth-park", sourceId: "wong-photo-walk", speaker: "Alex Wong", type: "walkie-talkie", basis: "shot-here", timestamp: 733, quote: "“Very nice over there, I took a great picture a few days ago, everybody changing their skates.” On a group walk by the rink and fountain beside City Hall (Dilworth is not named on camera)." },
  { spotId: "walnut-st", sourceId: "espinal-sam-rivera", speaker: "Sam Rivera", type: "walkie-talkie", basis: "haunt", timestamp: 78, quote: "“Take Walnut, Chestnut, make our way down to Broad Street, City Hall.” His “typical route” east from Rittenhouse." },
  { spotId: "chestnut-st", sourceId: "espinal-sam-rivera", speaker: "Sam Rivera", type: "walkie-talkie", basis: "haunt", timestamp: 78, quote: "“Take Walnut, Chestnut, make our way down to Broad Street, City Hall.” His “typical route” east from Rittenhouse." },

  // City Hall
  { spotId: "city-hall", sourceId: "sisofo-best-location-2024", speaker: "Dante Sisofo", type: "walkie-talkie", basis: "haunt", timestamp: 2, quote: "“My favorite place to practice street photography in Philadelphia, and it's in the tunnels of City Hall… as people enter this patch of light here, it's phenomenal.”" },
  { spotId: "city-hall", sourceId: "sisofo-best-location-2024", speaker: "Dante Sisofo", type: "walkie-talkie", basis: "shot-here", timestamp: 47, quote: "“I just find it so nice when I can make these minimalist compositions of this boy carrying the newspaper.”" },
  { spotId: "city-hall", sourceId: "wong-photo-walk", speaker: "Alex Wong", type: "walkie-talkie", basis: "shot-here", timestamp: 1667, quote: "In the courtyard with his group: “if you're standing right here you're actually standing in the center of” City Hall. Then: “waiting for the spot to clear up, yeah, I'm gonna stand here.”" },

  // Chinatown
  { spotId: "chinatown", sourceId: "wong-photo-walk", speaker: "Alex Wong", type: "walkie-talkie", basis: "shot-here", timestamp: 2286, quote: "“You want to shoot some more in Chinatown or head back?” The group walk starts and ends there: “we're in Chinatown for a while.”" },
  { spotId: "chinatown", sourceId: "violentshock-night-spots", speaker: "Violentshock", type: "walkie-talkie", basis: "haunt", timestamp: 623, quote: "“Chinatown is actually a really really dope place to shoot… a bunch of nice shadows and silhouettes of people going in and out of the restaurants.” One of the places he “constantly” goes, at night." },

  // Market St East, South St
  { spotId: "market-st-east", sourceId: "sisofo-why-philadelphia", speaker: "Dante Sisofo", type: "walkie-talkie", basis: "haunt", timestamp: 8, quote: "“Walking here on Market Street, my favorite street to practice street photography in Philadelphia.” Near 12th: “a really great intersection, big crosswalks, lots of people.”" },
  { spotId: "market-st-east", sourceId: "espinal-sam-rivera", speaker: "Sam Rivera", type: "walkie-talkie", basis: "haunt", timestamp: 87, quote: "“We're going to keep heading east, head down Market Street.” The last leg of his typical route from City Hall." },
  { spotId: "south-st", sourceId: "visitphilly-south-street-sam", speaker: "South Street Sam", type: "walkie-talkie", basis: "haunt", timestamp: 18, quote: "“I take portraits every day on South Street.” A daily streak since September 2023; elsewhere he puts it at over 100,000 portraits on the street." },

  // transit and markets
  { spotId: "market-frankford-line", sourceId: "espinal-sam-rivera", speaker: "Sam Rivera", type: "walkie-talkie", basis: "haunt", timestamp: 1219, quote: "“I take a lot of photos on the El, cuz that's just such an integral part of my life.”" },
  { spotId: "southeast-asian-market", sourceId: "sisofo-southeast-asian-market", speaker: "Dante Sisofo", type: "walkie-talkie", basis: "shot-here", timestamp: 3, quote: "“Currently at the Southeast Asian Market here in FDR Park in Philadelphia, photographing.” “Every time I see hands, I photograph them.”" },

  // Philly in Flux walks
  { spotId: "lehigh-ave", sourceId: "sisofo-flux-lehigh", speaker: "Dante Sisofo", type: "walkie-talkie", basis: "shot-here", timestamp: 36, quote: "“I just hopped off the bus and arrived at 33rd and Lehigh Avenue where we're going to start our walk… I'm just going to start photographing.” Walked east to the end of the avenue." },
  { spotId: "woodland-ave", sourceId: "sisofo-flux-woodland", speaker: "Dante Sisofo", type: "walkie-talkie", basis: "shot-here", timestamp: 24, quote: "“I arrived here on Woodland Avenue and Cobbs Creek Parkway… time to walk down towards University City, and I just photograph what I find.”" },
  { spotId: "germantown-ave", sourceId: "sisofo-flux-germantown", speaker: "Dante Sisofo", type: "walkie-talkie", basis: "shot-here", timestamp: 0, quote: "“I just got back from walking the entirety of Germantown Avenue… all the way from the northern parts of Chestnut Hill down towards the river at Second Street.” 206 photographs." },

  // pins
  { spotId: "15th-and-chestnut", sourceId: "espinal-sam-rivera", speaker: "Sam Rivera", type: "walkie-talkie", basis: "haunt", timestamp: 1609, quote: "“15th and Chestnut is like the meeting spot… it's a great intersection with great light in the afternoon. You just show up there and there's going to be another street photographer there.”" },
  { spotId: "city-hall-west-archway", sourceId: "sisofo-best-location-2023", speaker: "Dante Sisofo", type: "walkie-talkie", basis: "haunt", timestamp: 43, quote: "“These tunnels are the perfect place to practice, but this one in particular in front of Dilworth Plaza is definitely the best.” “I kind of like to do one sort of walk through in my walk each day.”" },
  { spotId: "city-hall-west-archway", sourceId: "sisofo-best-location-2023", speaker: "Dante Sisofo", type: "walkie-talkie", basis: "shot-here", timestamp: 87, quote: "“Really touristy here, so it's actually really easy to get away with getting close to people and making pictures, as you can see… the light is always nice in the tunnel.”" },
];
