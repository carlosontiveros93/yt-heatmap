"""NYC gazetteer for scan_locations.py: official neighborhood + park names plus a hand list.

Moved verbatim out of scan_locations.py when the scan became multi-city.
"""
import json, re

RAW = 'research/walkie_talkie_raw.json'
SCAN = 'research/walkie_talkie_scan.json'
REVIEW = 'research/walkie_talkie_review.md'
REVIEW_TITLE = 'Walkie Talkie — first-pass location scan'


def build():
    S = 'research/'
    # download: https://data.cityofnewyork.us/api/geospatial/9nt8-h7nd?method=export&format=GeoJSON
    nta = json.load(open(S + 'nta2020.geojson'))
    # download: https://data.cityofnewyork.us/api/geospatial/enfh-gkve?method=export&format=GeoJSON
    parks = json.load(open(S + 'parks.geojson'))

    # --- gazetteer: canonical name -> list of regex alternatives ---
    gaz = {}
    def add(name, *alts):
        gaz.setdefault(name, set()).update(a.lower() for a in (alts or (name,)))

    for f in nta['features']:
        p = f['properties']
        if p['ntatype'] != '0':          # skip parks/cemeteries/airports pseudo-NTAs
            continue
        # "Bedford-Stuyvesant (West)" -> "Bedford-Stuyvesant"; "SoHo-Little Italy-Hudson Square" -> each part
        base = re.sub(r'\s*\(.*?\)', '', p['ntaname'])
        for part in base.split('-'):
            part = part.strip()
            if len(part) > 3 and part.lower() not in {'east', 'west', 'north', 'south', 'central'}:
                add(part)
    for f in parks['features']:
        p = f['properties']
        try: acres = float(p['acres'] or 0)
        except: acres = 0
        if acres >= 8 and p['signname'] and p['typecategory'] in ('Flagship Park', 'Community Park', 'Neighborhood Park', 'Nature Area'):
            add(p['signname'])

    # well-known landmarks, streets, hubs and colloquial names
    extra = {
        'Times Square': ['times square'], 'Fifth Avenue': ['fifth ave', '5th ave', 'fifth avenue', '5th avenue'],
        'Grand Central': ['grand central'], 'Penn Station': ['penn station'], 'Herald Square': ['herald square'],
        'Union Square': ['union square'], 'Washington Square Park': ['washington square'], 'Bryant Park': ['bryant park'],
        'Central Park': ['central park'], 'Prospect Park': ['prospect park'], 'Brooklyn Bridge': ['brooklyn bridge'],
        'Williamsburg Bridge': ['williamsburg bridge'], 'Manhattan Bridge': ['manhattan bridge'], 'DUMBO': ['dumbo'],
        'Coney Island': ['coney island', 'coney'], 'Boardwalk': ['boardwalk'], 'Rockaway': ['rockaway'],
        'Chinatown': ['chinatown'], 'Canal Street': ['canal street', 'canal st'], 'Little Italy': ['little italy'],
        'SoHo': ['soho'], 'NoHo': ['noho'], 'Tribeca': ['tribeca'], 'Financial District': ['financial district', 'fidi'],
        'Wall Street': ['wall street', 'wall st'], 'Lower East Side': ['lower east side', 'the les', ' les '],
        'East Village': ['east village'], 'West Village': ['west village'], 'Greenwich Village': ['greenwich village', 'the village'],
        'Alphabet City': ['alphabet city'], 'Tompkins Square Park': ['tompkins'], 'Chelsea': ['chelsea'],
        'High Line': ['high line', 'highline'], 'Hudson Yards': ['hudson yards'], 'Midtown': ['midtown'],
        'Hell\'s Kitchen': ["hell's kitchen", 'hells kitchen'], 'Diamond District': ['diamond district', '47th'],
        'Upper West Side': ['upper west side', 'uws'], 'Upper East Side': ['upper east side', 'ues'],
        'Harlem': ['harlem'], '125th Street': ['125th'], 'Washington Heights': ['washington heights'],
        'The Bronx': ['the bronx', 'bronx'], 'Yankee Stadium': ['yankee stadium'], 'Fordham Road': ['fordham'],
        'Williamsburg': ['williamsburg'], 'Bushwick': ['bushwick'], 'Bed-Stuy': ['bed-stuy', 'bed stuy', 'bedstuy', 'bedford-stuyvesant', 'bedford stuyvesant'],
        'Crown Heights': ['crown heights'], 'Flatbush': ['flatbush'], 'Sunset Park': ['sunset park'], 'Bay Ridge': ['bay ridge'],
        'Brighton Beach': ['brighton beach', 'brighton'], 'Park Slope': ['park slope'], 'Greenpoint': ['greenpoint'],
        'Downtown Brooklyn': ['downtown brooklyn'], 'Fulton Street': ['fulton street', 'fulton st', 'fulton mall'],
        'Domino Park': ['domino'], 'Astoria': ['astoria'], 'Long Island City': ['long island city', 'lic'],
        'Jackson Heights': ['jackson heights'], 'Corona': ['corona'], 'Flushing': ['flushing'], 'Roosevelt Avenue': ['roosevelt ave'],
        'Jamaica': ['jamaica'], 'Ridgewood': ['ridgewood'], 'Staten Island': ['staten island'], 'Staten Island Ferry': ['ferry'],
        'Subway': ['subway', 'the train'], 'Broadway': ['broadway'], '14th Street': ['14th street', '14th st'],
        '34th Street': ['34th street', '34th st'], '42nd Street': ['42nd street', '42nd st'], 'Delancey Street': ['delancey'],
        'Orchard Street': ['orchard street', 'orchard st'], 'Essex Street': ['essex street', 'essex market'],
        'Bowery': ['bowery'], 'St. Marks Place': ['st marks', "st. mark's", 'saint marks'], 'Bleecker Street': ['bleecker'],
        'Battery Park': ['battery park', 'the battery'], 'Seaport': ['seaport'], 'Stuyvesant Town': ['stuy town', 'stuyvesant town'],
        'East River': ['east river'], 'Hudson River': ['hudson river', 'west side highway', 'hudson river park'],
        'Governors Island': ['governors island'], 'Red Hook': ['red hook'], 'Gowanus': ['gowanus'], 'Carroll Gardens': ['carroll gardens'],
        'Brooklyn Heights': ['brooklyn heights'], 'Fort Greene': ['fort greene'], 'Clinton Hill': ['clinton hill'],
        'East New York': ['east new york'], 'Brownsville': ['brownsville'], 'Canarsie': ['canarsie'],
        'Elmhurst': ['elmhurst'], 'Woodside': ['woodside'], 'Sunnyside': ['sunnyside'], 'Forest Hills': ['forest hills'],
        'Rockefeller Center': ['rockefeller'], 'Columbus Circle': ['columbus circle'], 'Lincoln Center': ['lincoln center'],
        'Madison Square Park': ['madison square'], 'Flatiron': ['flatiron'], 'Koreatown': ['koreatown', 'k-town'],
        'Meatpacking District': ['meatpacking'], 'Chelsea Market': ['chelsea market'], 'Pier 45': ['pier 45', 'christopher street pier'],
    }
    for k, v in extra.items():
        add(k, *v)

    # words too generic to count as a place mention
    noise = {'chelsea', 'corona', 'jamaica', 'the village', 'brighton', 'ferry', 'subway', 'the train', 'broadway', 'fulton street',
             'fulton st', 'essex street', 'orchard street', 'bowery', 'delancey', 'flushing', 'lic', 'les', 'uws', 'ues'}
    # (kept in the gazetteer but scored at half weight below)
    return gaz, noise
