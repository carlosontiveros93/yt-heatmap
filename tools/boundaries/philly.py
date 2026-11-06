"""Philadelphia boundary definitions for build_boundaries.py.

Official shapes come from OpenDataPhilly: the Azavea "Philadelphia Neighborhoods"
file (keyed by MAPNAME) and PPR Properties (keyed by the short `label`); see
tools/gazetteers/philly.py for the download URLs. Dilworth Park is not a PPR
property (Center City District runs it), so it is traced from OpenStreetMap
(way 410095875, saved in research/philly/osm_centercity.json). The Municipal
Services Building plaza is hand-drawn as its city block. Corridor waypoints are
OSM intersections. Reasoning: research/proposals/philly_proposed.md.

Spot ids here must match cities/philly/data.js.
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
    'chinatown':          ('hoods', ['Chinatown']),
}

# Hand-drawn areas: rings of [lng, lat], closed. Corners are OSM intersections.
HAND = {
    # Thomas Paine Plaza around the Municipal Services Building ("Muni", "the pit"):
    # the block bounded by Broad St, JFK Blvd, 15th St and Arch St.
    'msb-plaza': [[-75.16366, 39.95340], [-75.16506, 39.95362], [-75.16487, 39.95461], [-75.16316, 39.95441], [-75.16366, 39.95340]],
    # City Hall: approximate building footprint (archways on all four sides, courtyard inside),
    # hand-drawn around the tower so it does not swallow Dilworth Park to its west.
    'city-hall': [[-75.16426, 39.95318], [-75.16260, 39.95292], [-75.16294, 39.95162], [-75.16460, 39.95188], [-75.16426, 39.95318]],
}

# Corridors: waypoints along the street ([lng, lat]), snapped to OSM intersections.
CORRIDORS = {
    # Chestnut St, Broad to 18th (City Hall west toward Rittenhouse)
    'chestnut-st':  [[-75.16393, 39.95087], [-75.16561, 39.95109], [-75.16718, 39.95128], [-75.16877, 39.95148], [-75.17035, 39.95167]],
    # Walnut St, Broad to 18th (Nazir's daily route from his corner to the park; Olu's camping spot near 18th)
    'walnut-st':    [[-75.16426, 39.94935], [-75.16595, 39.94957], [-75.16750, 39.94977], [-75.16911, 39.94997], [-75.17068, 39.95016]],
    # Traced from OpenStreetMap ways (shortest path along the named street, simplified);
    # raw download in research/philly/osm_corridors.json.
    # Market St, east side of City Hall to 10th (extent chosen by Carlos; no cross streets spoken)
    'market-st-east': [[-75.16236, 39.95227], [-75.15673, 39.95153]],
    # South St, Front to 10th (extent chosen by Carlos; South Street Sam names no cross streets)
    'south-st': [[-75.14407, 39.94099], [-75.15864, 39.9428]],
    # Lehigh Ave, 33rd St east to Richmond St (Dante Sisofo's walk; start spoken, end = end of the avenue)
    'lehigh-ave': [[-75.18502, 39.99788], [-75.12605, 39.99027], [-75.12584, 39.99016], [-75.1225, 39.98708], [-75.12224, 39.98699], [-75.11305, 39.97664]],
    # Woodland Ave, Cobbs Creek Pkwy northeast to its end in University City (start and direction spoken)
    'woodland-ave': [[-75.2457, 39.91762], [-75.21259, 39.94087], [-75.21058, 39.94367], [-75.20528, 39.94843], [-75.20306, 39.94928], [-75.20144, 39.94978]],
    # Germantown Ave, Chestnut Hill West station to 2nd St (13.95 km traced; he logged 14.3 km)
    'germantown-ave': [[-75.20773, 40.0768], [-75.20348, 40.07424], [-75.19985, 40.06963], [-75.19859, 40.06853], [-75.19664, 40.06725], [-75.19599, 40.06544], [-75.19424, 40.06444], [-75.19118, 40.06033], [-75.18981, 40.05876], [-75.18837, 40.05743], [-75.18357, 40.04859], [-75.1812, 40.04366], [-75.17521, 40.03626], [-75.17343, 40.03479], [-75.16394, 40.02937], [-75.16144, 40.02777], [-75.16006, 40.02602], [-75.15983, 40.02454], [-75.15893, 40.02267], [-75.15609, 40.01969], [-75.15479, 40.01765], [-75.15243, 40.01321], [-75.15114, 40.01025], [-75.14876, 40.00252], [-75.14689, 39.99807], [-75.14679, 39.99734], [-75.14837, 39.99115], [-75.14422, 39.98524], [-75.14375, 39.98107], [-75.14394, 39.98018], [-75.14348, 39.98012], [-75.14058, 39.96929], [-75.13987, 39.96802]],
    # Not approved (2026-11-05), kept here in case the footage is checked later:
    # JFK Blvd, Broad to 16th (parade crowd beside the MSB plaza; street never spoken)
    # 'jfk-blvd':   [[-75.16366, 39.95340], [-75.16506, 39.95362], [-75.16662, 39.95383]],
    # 10th St, Market to Locust (Center City East; no frame in the transcript)
    # '10th-st':    [[-75.15673, 39.95153], [-75.15706, 39.95002], [-75.15739, 39.94849], [-75.15764, 39.94736]],
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


HEADER = ("// Polygon boundaries for spots, keyed by spot id. Rittenhouse Square and Chinatown come\n"
          "// from OpenDataPhilly (PPR Properties, Philadelphia Neighborhoods) via\n"
          "// tools/build_boundaries.py philly; Dilworth Park is traced from OpenStreetMap; the\n"
          "// Municipal Services Building plaza and City Hall are hand-drawn. Coordinates rounded to 5 decimals (~1 m). Corridors (streets) are\n"
          "// LineStrings with waypoints snapped to OSM intersections. See each entry's\n"
          "// `source`. Spots without an entry here render as dots.\n")
