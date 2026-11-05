// Per-city settings. index.html reads these after picking the city from ?city=.
const CITY = {
  id: "philly",
  name: "Philadelphia",
  title: "Philly Street Photography Spots",
  pageTitle: "Philadelphia Street Photography Heatmap",
  center: [39.9510, -75.1660],
  zoom: 15,
  areaLabel: "Area",   // what the area filter is called here (spots carry an `area`)
  intro: `Where Philadelphia street photographers actually shoot, from two episodes of Paulie B's
    <em>Walkie Talkie</em> series (Olu Okiemute, Nazir Wayman). A small map so far: both are
    locals with strong daily haunts, and both episodes stay inside Center City.
    Click a spot for who said it and a link to that moment in the video.`,
};
