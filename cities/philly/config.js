// Per-city settings. index.html reads these after picking the city from ?city=.
const CITY = {
  id: "philly",
  name: "Philadelphia",
  title: "Philly Street Photography Spots",
  pageTitle: "Philadelphia Street Photography Heatmap",
  center: [39.9560, -75.1660],
  zoom: 13,
  areaLabel: "Area",   // what the area filter is called here (spots carry an `area`)
  intro: `Where Philadelphia street photographers actually shoot. Started from two episodes of
    Paulie B's <em>Walkie Talkie</em> series (Olu Okiemute, Nazir Wayman), then widened with
    walk-and-talks and "where I shoot" videos from other channels (Sam Rivera, Dante Sisofo,
    Alex Wong, South Street Sam, Violentshock). Center City is dense; the long lines are single
    end-to-end avenue walks. Click a spot for who said it and a link to that moment in the video.`,
};
