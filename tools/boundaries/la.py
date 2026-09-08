"""Los Angeles boundary definitions for build_boundaries.py.

Official shapes come from the LA Times "Mapping L.A." neighborhoods file (see
tools/gazetteers/la.py for the download URL). Corridors and the Financial District
core are hand-placed; see research/proposals/la_proposed.md for the reasoning.
"""
import json

OUT = 'cities/la/boundaries.js'
S = 'research/la/'


def lookups():
    hoods = json.load(open(S + 'latimes_neighborhoods.geojson'))
    return {
        'latimes': ({f['properties']['external_id']: f for f in hoods['features']}, 'LA Times Mapping L.A. neighborhoods v6', 'name'),
    }


# spotId -> (dataset, [feature ids])
WANT = {
    'koreatown':      ('latimes', ['koreatown']),
    'east-hollywood': ('latimes', ['east-hollywood']),
}

# Hand-drawn areas. Financial District has no LA Times polygon (it sits inside
# "Downtown"); this is the tower core Figueroa to Grand, 4th to 7th.
HAND = {
    # Corners from OSM intersections (Figueroa & 4th, Grand & 7th, Figueroa & 7th);
    # Grand & 4th is a bridge in OSM, so it is offset from Grand & 7th.
    'financial-district': [[-118.25585, 34.05366], [-118.25257, 34.05158], [-118.25662, 34.04731],
                           [-118.25990, 34.04939], [-118.25585, 34.05366]],
}

# Corridors: hand-placed waypoints along the street, snapped to OSM intersections.
CORRIDORS = {
    # Hollywood Blvd, the Walk of Fame stretch: Highland to Vine
    'hollywood-blvd':  [[-118.33872, 34.10155], [-118.32670, 34.10163]],
    # Wilshire Blvd through Koreatown: Vermont to Western (the Wiltern)
    'wilshire-ktown':  [[-118.29167, 34.06180], [-118.30037, 34.06175], [-118.30911, 34.06171]],
    # Broadway, Historic Core: 3rd St to 9th St
    'broadway-dtla':   [[-118.24803, 34.05097], [-118.25204, 34.04665], [-118.25608, 34.04233]],
}


def extra():
    return {}


HEADER = ("// Polygon boundaries for spots, keyed by spot id. Neighborhood areas come\n"
          "// from the LA Times \"Mapping L.A.\" neighborhood boundaries via\n"
          "// tools/build_boundaries.py la; coordinates rounded to 5 decimals (~1 m).\n"
          "// The Financial District core is hand-drawn (no official polygon).\n"
          "// Corridors (streets) are LineStrings with hand-placed waypoints. See each\n"
          "// entry's `source`. Spots without an entry here render as dots.\n")
