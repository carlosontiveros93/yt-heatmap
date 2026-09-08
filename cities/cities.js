// Registry of cities the site knows about. Loaded before any city data so the
// sidebar switcher can list every city; each city's own settings live in
// cities/<id>/config.js next to its data.js and boundaries.js.
const CITIES = [
  { id: "nyc", name: "New York" },
  { id: "la",  name: "Los Angeles" },
];
