"""NYC boundary definitions for build_boundaries.py (moved verbatim from the old single-city script)."""
import json

OUT = 'cities/nyc/boundaries.js'
S = 'research/'


def lookups():
    """dataset -> (features by id, source label, property holding the display name)."""
    # download: https://data.cityofnewyork.us/api/geospatial/9nt8-h7nd?method=export&format=GeoJSON
    nta = json.load(open(S + 'nta2020.geojson'))
    # download: https://data.cityofnewyork.us/api/geospatial/enfh-gkve?method=export&format=GeoJSON
    parks = json.load(open(S + 'parks.geojson'))
    return {
        'nta':  ({f['properties']['nta2020']: f for f in nta['features']}, 'NYC Open Data NTA 2020', 'ntaname'),
        'park': ({f['properties']['gispropnum']: f for f in parks['features'] if f['geometry']}, 'NYC Open Data Parks Properties', 'signname'),
    }


# spotId -> (dataset, [feature ids]); several ids = dissolve into one shape
WANT = {
    'bed-stuy':              ('nta', ['BK0301', 'BK0302']),
    'flatbush':              ('nta', ['BK1401']),
    'jackson-heights':       ('nta', ['QN0301']),
    'harlem':                ('nta', ['MN1001', 'MN1002']),
    'washington-heights':    ('nta', ['MN1201', 'MN1202']),
    'sunset-park':           ('nta', ['BK0702', 'BK0703']),
    'williamsburg':          ('nta', ['BK0102']),
    'south-williamsburg':    ('nta', ['BK0103']),
    'jamaica':               ('nta', ['QN1201']),
    'prospect-park':         ('park', ['B073']),
    'kissena-park':          ('park', ['Q024']),
    'columbus-park':         ('park', ['M015']),
    'brighton-beach':        ('nta', ['BK1303']),
    'bryant-park':           ('park', ['M008']),
    'east-river-park':       ('park', ['M144']),
    'maria-hernandez-park':  ('park', ['B016']),
    'borough-park':          ('nta', ['BK1202']),
    'ozone-park':            ('nta', ['QN1002']),
    'corona':                ('nta', ['QN0402']),
    'tompkins-square-park':  ('park', ['M088']),
    'high-line':             ('park', ['M360']),
    'washington-square-park':('park', ['M098']),
    'central-park':          ('park', ['M010']),
}


# Hand-drawn areas, where either no official polygon exists (Alphabet City,
# Blissville) or the official one is far bigger than what the speaker meant
# (Crown Heights = blocks around Kingston & Eastern Pkwy; Coney Island = the
# boardwalk/amusement strip; Flushing = downtown around Main St; Financial
# District without Battery Park City). Edges follow the streets locals use.
HAND = {
    'alphabet-city': [[-73.98357, 40.72215], [-73.98058, 40.73048], [-73.97380, 40.72980],
                      [-73.97520, 40.71900], [-73.98357, 40.72215]],
    'blissville':    [[-73.93750, 40.74000], [-73.92850, 40.73950], [-73.93000, 40.73400],
                      [-73.94000, 40.73400], [-73.93750, 40.74000]],
    'crown-heights': [[-73.94550, 40.67120], [-73.93900, 40.67120], [-73.93900, 40.66300],
                      [-73.94550, 40.66300], [-73.94550, 40.67120]],
    'coney-island':  [[-73.98800, 40.57750], [-73.96600, 40.57900], [-73.96600, 40.57350],
                      [-73.98800, 40.57200], [-73.98800, 40.57750]],
    'flushing':      [[-73.83400, 40.76250], [-73.82600, 40.76250], [-73.82600, 40.75600],
                      [-73.83400, 40.75600], [-73.83400, 40.76250]],
    'financial-district': [[-74.01350, 40.71350], [-74.00500, 40.71150], [-74.00000, 40.70800],
                           [-74.00800, 40.70000], [-74.01650, 40.70200], [-74.01550, 40.70800],
                           [-74.01350, 40.71350]],
    # Manhattan cores, tightened from the census areas to what photographers mean:
    # Midtown = the 5th/6th/7th Ave spine, 34th St to Central Park South
    'midtown':       [[-73.99000, 40.75080], [-73.98230, 40.74760], [-73.97350, 40.75960],
                      [-73.98120, 40.76280], [-73.99000, 40.75080]],
    # Times Square = the bowtie, 42nd to 47th between 7th Ave and Broadway
    'times-square':  [[-73.98800, 40.75480], [-73.98580, 40.75560], [-73.98320, 40.75940],
                      [-73.98550, 40.76020], [-73.98800, 40.75480]],
    # Soho = Houston to Canal, 6th Ave to Lafayette
    'soho':          [[-74.00300, 40.72800], [-73.99550, 40.72530], [-74.00000, 40.71870],
                      [-74.00570, 40.72280], [-74.00300, 40.72800]],
    # Tribeca = Canal to Chambers, Broadway to West St
    'tribeca':       [[-74.00980, 40.72450], [-74.00100, 40.71930], [-74.00650, 40.71450],
                      [-74.01250, 40.71700], [-74.00980, 40.72450]],
    # Chinatown = Canal to Worth/Chatham Sq, Centre St to Forsyth
    'chinatown':     [[-74.00020, 40.71850], [-73.99400, 40.71570], [-73.99300, 40.71380],
                      [-73.99750, 40.71280], [-74.00150, 40.71480], [-74.00020, 40.71850]],
    # Lower East Side = Houston to Grand, Bowery to Essex
    'lower-east-side': [[-73.99250, 40.72490], [-73.98600, 40.72220], [-73.98900, 40.71720],
                        [-73.99380, 40.71830], [-73.99250, 40.72490]],
    # Howard Beach = the residential core along Cross Bay Blvd (the NTA is mostly Jamaica Bay marsh)
    'howard-beach':  [[-73.84700, 40.66500], [-73.82500, 40.66500], [-73.82500, 40.64900],
                      [-73.84700, 40.64900], [-73.84700, 40.66500]],
    # Orchard Beach = the beach crescent and lot inside Pelham Bay Park (no separate Parks feature)
    'orchard-beach': [[-73.79800, 40.87200], [-73.78600, 40.87200], [-73.78600, 40.86200],
                      [-73.79900, 40.86300], [-73.79800, 40.87200]],
    # Bushwick core = Bushwick Ave to Wyckoff Ave, Flushing Ave to Halsey St (Knickerbocker / Myrtle-Wyckoff)
    'bushwick-core': [[-73.92900, 40.70600], [-73.91100, 40.70100], [-73.91600, 40.69200],
                      [-73.93300, 40.69700], [-73.92900, 40.70600]],
    # East Village = Houston to 14th, Bowery/3rd Ave to Ave A (overlaps Tompkins and Alphabet City by design)
    'east-village':  [[-73.99280, 40.72500], [-73.98380, 40.72220], [-73.98060, 40.73050],
                      [-73.98750, 40.73330], [-73.99280, 40.72500]],
}

# Corridors: street or waterfront stretches, as LineStrings with hand-placed
# waypoints following the street. Rendered as thick lines.
CORRIDORS = {
    'fifth-ave-42nd-to-central-park': [[-73.98110, 40.75355], [-73.97330, 40.76420]],
    'fifth-ave-47th-to-57th':         [[-73.97870, 40.75700], [-73.97400, 40.76330]],
    '14th-st-1st-ave':                [[-73.98060, 40.73038], [-73.98330, 40.73150]],
    'bushwick':              [[-73.94050, 40.70000], [-73.93550, 40.69720], [-73.92850, 40.69350],
                              [-73.92100, 40.68950], [-73.91650, 40.68650], [-73.91050, 40.68250],
                              [-73.90460, 40.67850]],
    'west-side-highway':     [[-74.01350, 40.71700], [-74.01100, 40.72900], [-74.00900, 40.74200],
                              [-74.00400, 40.75200], [-73.99900, 40.76400], [-73.99600, 40.77000]],
    'east-river-waterfront': [[-73.97600, 40.71200], [-73.97300, 40.72000], [-73.97250, 40.72900],
                              [-73.97150, 40.73450], [-73.97050, 40.74200]],
    # Bronx: Grand Concourse from Fordham Rd north to 205th St / Mosholu Pkwy
    'grand-concourse':       [[-73.89050, 40.86230], [-73.88920, 40.86800], [-73.88780, 40.87310],
                              [-73.88550, 40.87750]],
    # Queens: Roosevelt Ave under the 7 train, Woodside to Flushing Main St
    'roosevelt-ave-7-train': [[-73.90290, 40.74540], [-73.89120, 40.74690], [-73.87680, 40.74840],
                              [-73.86950, 40.74920], [-73.86260, 40.74970], [-73.85520, 40.75170],
                              [-73.84550, 40.75460], [-73.83010, 40.75960]],
    # Brooklyn: Eastern Parkway, Grand Army Plaza to Utica Ave (West Indian Day Carnival route)
    'eastern-parkway':       [[-73.97000, 40.67390], [-73.95780, 40.67080], [-73.94220, 40.66900],
                              [-73.93100, 40.66850]],
    # Manhattan: Madison Ave, 42nd St to 72nd St
    'madison-avenue':        [[-73.97900, 40.75260], [-73.97200, 40.76210], [-73.96450, 40.77280]],
    # Manhattan: Mulberry St through Little Italy, Canal to Houston (San Gennaro route)
    'mulberry-street':       [[-73.99770, 40.71720], [-73.99630, 40.71960], [-73.99530, 40.72150],
                              [-73.99460, 40.72380]],
}


def extra():
    """Entries that come from neither an official dataset nor a hand list."""
    # Domino Park is privately run and not in Parks Properties; outline from OSM.
    osm = json.load(open(S + 'domino.json'))
    way = next(e for e in osm['elements'] if e['type'] == 'way')
    ring = [[round(p['lon'], 5), round(p['lat'], 5)] for p in way['geometry']]
    if ring[0] != ring[-1]:
        ring.append(ring[0])
    return {'domino-park': {'source': 'OpenStreetMap way 608663280', 'features': ['608663280'],
                            'names': [way['tags'].get('name')],
                            'geometry': {'type': 'Polygon', 'coordinates': [ring]}}}


HEADER = ("// Polygon boundaries for spots, keyed by spot id. Most come from NYC Open\n"
      "// Data (2020 Neighborhood Tabulation Areas, Parks Properties) via the\n"
      "// scratch script build_boundaries.py; coordinates rounded to 5 decimals\n"
      "// (~1 m). Neighborhoods split into halves by the NTAs (Bushwick, Bed-Stuy,\n"
      "// (~1 m); Bed-Stuy's two NTA halves are dissolved into one shape. Domino Park\n"
      "// is traced from OpenStreetMap. Several areas are hand-drawn, either because\n"
      "// no official polygon exists or the official one is far larger than the\n"
      "// spot the speaker meant. Corridors (streets, waterfronts) are LineStrings\n"
      "// with hand-placed waypoints. See each entry's `source`. Spots without an\n"
      "// entry here render as dots.\n")
