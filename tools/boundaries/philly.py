"""Philadelphia boundary definitions for build_boundaries.py.

Official shapes come from OpenDataPhilly: the Azavea "Philadelphia Neighborhoods"
file (keyed by MAPNAME) and PPR Properties (keyed by the short `label`); see
tools/gazetteers/philly.py for the download URLs. Dilworth Park is not a PPR
property (Center City District runs it), so it is traced from OpenStreetMap
(way 410095875, saved in research/philly/osm_centercity.json). The Municipal
Services Building plaza is hand-drawn as its city block. Corridor waypoints are
OSM intersections. Reasoning: research/proposals/philly_proposed.md.

Spot ids here must match cities/philly/data.js once that is written (after approval).
"""
import json

OUT = 'cities/philly/boundaries.js'
S = 'research/philly/'


def lookups():
    hoods = json.load(open(S + 'neighborhoods.geojson'))
    parks = json.load(open(S + 'parks.geojson'))
    return {
        'hoods': ({f['properties']['MAPNAME']: f for f in hoods['features']}, 'OpenDataPhilly Philadelphia Neighborhoods (Azavea)', 'MAPNAME'),
        'ppr':   ({f['properties']['label']: f for f in parks['features']}, 'OpenDataPhilly PPR Properties', 'official_name'),
    }


# spotId -> (dataset, [feature ids]); several ids dissolve into one shape
WANT = {
    'rittenhouse-square': ('ppr', ['Rittenhouse']),
}

# Hand-drawn areas: rings of [lng, lat], closed. Corners are OSM intersections.
HAND = {
    # Thomas Paine Plaza around the Municipal Services Building ("Muni", "the pit"):
    # the block bounded by Broad St, JFK Blvd, 15th St and Arch St.
    'msb-plaza': [[-75.16366, 39.95340], [-75.16506, 39.95362], [-75.16487, 39.95461], [-75.16316, 39.95441], [-75.16366, 39.95340]],
}

# Corridors: waypoints along the street ([lng, lat]), snapped to OSM intersections.
CORRIDORS = {
    # Chestnut St, Broad to 18th (City Hall west toward Rittenhouse)
    'chestnut-st':  [[-75.16393, 39.95087], [-75.16561, 39.95109], [-75.16718, 39.95128], [-75.16877, 39.95148], [-75.17035, 39.95167]],
    # Walnut St, Broad to 18th (Nazir's daily route from his corner to the park; Olu's camping spot near 18th)
    'walnut-st':    [[-75.16426, 39.94935], [-75.16595, 39.94957], [-75.16750, 39.94977], [-75.16911, 39.94997], [-75.17068, 39.95016]],
    # JFK Blvd, Broad to 16th (parade crowd beside the MSB plaza, City Hall's northwest corner)
    'jfk-blvd':     [[-75.16366, 39.95340], [-75.16506, 39.95362], [-75.16662, 39.95383]],
    # 10th St, Market to Locust (Center City East; block not spoken)
    '10th-st':      [[-75.15673, 39.95153], [-75.15706, 39.95002], [-75.15739, 39.94849], [-75.15764, 39.94736]],
}


def extra():
    """Dilworth Park traced from OpenStreetMap (west side of City Hall)."""
    osm = json.load(open(S + 'osm_centercity.json'))
    nodes = {e['id']: (e['lat'], e['lon']) for e in osm['elements'] if e['type'] == 'node'}
    way = next(e for e in osm['elements'] if e['type'] == 'way' and e['id'] == 410095875)
    ring = [[round(nodes[n][1], 5), round(nodes[n][0], 5)] for n in way['nodes'] if n in nodes]
    if ring[0] != ring[-1]:
        ring.append(ring[0])
    return {
        'dilworth-park': {'source': 'OpenStreetMap way 410095875 (Dilworth Park)', 'features': ['osm:way/410095875'],
                          'names': ['Dilworth Park'], 'geometry': {'type': 'Polygon', 'coordinates': [ring]}},
    }


HEADER = ("// Polygon boundaries for spots, keyed by spot id. Rittenhouse Square comes from\n"
          "// OpenDataPhilly's PPR Properties via tools/build_boundaries.py philly; Dilworth Park\n"
          "// is traced from OpenStreetMap; the Municipal Services Building plaza is hand-drawn\n"
          "// as its block. Coordinates rounded to 5 decimals (~1 m). Corridors (streets) are\n"
          "// LineStrings with waypoints snapped to OSM intersections. See each entry's\n"
          "// `source`. Spots without an entry here render as dots.\n")
