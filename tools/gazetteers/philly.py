"""Philadelphia gazetteer for scan_locations.py.

Inputs (both gitignored, in research/philly/):
  neighborhoods.geojson  OpenDataPhilly "Philadelphia Neighborhoods" (Azavea), 159 areas.
      download: https://raw.githubusercontent.com/opendataphilly/open-geo-data/master/philadelphia-neighborhoods/philadelphia-neighborhoods.geojson
  parks.geojson  OpenDataPhilly "PPR Properties" (Philadelphia Parks & Recreation), 507 properties.
      download: https://opendata.arcgis.com/api/v3/datasets/d52445160ab14380a673e5849203eb64_0/downloads/data?format=geojson&spatialRefId=4326
"""
import json

RAW = 'research/philly/raw.json'
SCAN = 'research/philly/scan.json'
REVIEW = 'research/philly/review.md'
REVIEW_TITLE = 'Philadelphia — first-pass location scan'

# PPR property classes that are places people walk in (skips medians, drainage rights-of-way, depots)
PARK_CLASSES = {'PARK', 'WATERSHED_PARK', 'MANAGED_SITE', 'PATHWAY'}


def build():
    S = 'research/philly/'
    hoods = json.load(open(S + 'neighborhoods.geojson'))
    parks = json.load(open(S + 'parks.geojson'))

    gaz = {}
    def add(name, *alts):
        gaz.setdefault(name, set()).update(a.lower() for a in (alts or (name,)))

    for f in hoods['features']:
        name = f['properties']['MAPNAME']
        alts = [name]
        # "Fishtown - Lower Kensington" -> also "fishtown"; "Germantown - Westside" -> "germantown"
        if ' - ' in name:
            alts += [p.strip() for p in name.split(' - ')]
        add(name, *alts)
    for f in parks['features']:
        p = f['properties']
        if p.get('property_classification') not in PARK_CLASSES:
            continue
        if (p.get('acreage') or 0) < 5:
            continue
        name = (p.get('official_name') or p.get('label') or '').strip()
        if not name or name == 'None':
            continue
        # "Franklin Delano Roosevelt (FDR) Park" -> "fdr park"; drop parentheticals
        alts = [name]
        if '(' in name:
            inner = name[name.index('(') + 1:name.index(')')]
            alts.append(inner + ' park' if 'park' in name.lower() else inner)
            alts.append(name.split(' (')[0])
        add(name.split(' (')[0] if '(' in name else name, *alts)

    # what photographers actually say: streets, landmarks, colloquial names
    extra = {
        'Philadelphia': ['philadelphia', 'philly'],
        'Center City': ['center city', 'downtown'],
        'City Hall': ['city hall', 'dilworth', 'dilworth park'],
        'Love Park': ['love park', 'jfk plaza', 'love sign', 'love statue'],
        'Broad Street': ['broad street', 'broad st', 'north broad', 'south broad', 'the avenue of the arts', 'avenue of the arts'],
        'Market Street': ['market street', 'market st', 'east market', 'west market'],
        'Walnut Street': ['walnut street', 'walnut st', 'walnut'],
        'Chestnut Street': ['chestnut street', 'chestnut st', 'chestnut'],
        'South Street': ['south street', 'south st'],
        'Passyunk Avenue': ['passyunk', 'east passyunk', 'passyunk ave', 'passyunk avenue', 'pashunk', 'pasyunk'],
        'Italian Market': ['italian market', '9th street', 'ninth street', '9th st', 'the market'],
        'Reading Terminal Market': ['reading terminal', 'reading terminal market'],
        'Rittenhouse Square': ['rittenhouse', 'rittenhouse square', 'rittenhouse park'],
        'Washington Square': ['washington square'],
        'Franklin Square': ['franklin square'],
        'Logan Circle': ['logan circle', 'logan square', 'swann fountain'],
        'Benjamin Franklin Parkway': ['the parkway', 'ben franklin parkway', 'benjamin franklin parkway', 'parkway'],
        'Art Museum': ['art museum', 'museum of art', 'rocky steps', 'the rocky steps', 'rocky statue'],
        'Eakins Oval': ['eakins oval'],
        'Fairmount': ['fairmount', 'fairmount avenue', 'fairmount ave'],
        'Fairmount Park': ['fairmount park', 'kelly drive', 'boathouse row', 'lemon hill', 'belmont plateau'],
        'Schuylkill River Trail': ['schuylkill river trail', 'schuylkill banks', 'the schuylkill', 'schuylkill', 'skoo kill', 'skookill', 'school kill', 'river trail'],
        'Old City': ['old city', 'olde city'],
        'Independence Mall': ['independence mall', 'independence hall', 'liberty bell', 'independence park'],
        'Elfreth\'s Alley': ["elfreth's alley", 'elfreths alley', 'elfreth'],
        'Penn\'s Landing': ["penn's landing", 'penns landing', 'penn landing'],
        'Cherry Street Pier': ['cherry street pier', 'cherry street'],
        'Race Street Pier': ['race street pier', 'race street'],
        'Spruce Street Harbor Park': ['spruce street harbor', 'spruce harbor', 'harbor park'],
        'Delaware Avenue': ['delaware avenue', 'delaware ave', 'columbus boulevard', 'columbus blvd', 'the waterfront', 'delaware river'],
        'Ben Franklin Bridge': ['ben franklin bridge', 'benjamin franklin bridge', 'the bridge'],
        'Society Hill': ['society hill'],
        'Queen Village': ['queen village'],
        'Bella Vista': ['bella vista'],
        'Washington Avenue': ['washington avenue', 'washington ave'],
        'Snyder Avenue': ['snyder', 'snyder avenue', 'snyder ave'],
        'Oregon Avenue': ['oregon avenue', 'oregon ave'],
        'FDR Park': ['fdr park', 'fdr', 'the lakes'],
        'Stadiums': ['the linc', 'lincoln financial', 'citizens bank park', 'the stadiums', 'stadium district', 'sports complex', 'xfinity live'],
        'Navy Yard': ['navy yard'],
        'Point Breeze': ['point breeze'],
        'Grays Ferry': ['grays ferry', "gray's ferry"],
        'Southwest Philly': ['southwest philly', 'southwest philadelphia', 'southwest'],
        'South Philly': ['south philly', 'south philadelphia'],
        'West Philly': ['west philly', 'west philadelphia'],
        'North Philly': ['north philly', 'north philadelphia'],
        'Northeast Philly': ['northeast philly', 'northeast philadelphia', 'the northeast', 'great northeast'],
        'Northwest Philly': ['northwest philly', 'northwest philadelphia'],
        'University City': ['university city', 'ucity', 'u city', 'penn campus', 'upenn', 'drexel'],
        'Clark Park': ['clark park'],
        'Baltimore Avenue': ['baltimore avenue', 'baltimore ave'],
        'Lancaster Avenue': ['lancaster avenue', 'lancaster ave'],
        '52nd Street': ['52nd street', '52nd st', '52nd'],
        'Market-Frankford Line': ['the el', 'market frankford', 'market-frankford', 'the frankford line', 'under the el', 'el train', 'the l'],
        'Broad Street Line': ['broad street line', 'the subway', 'the orange line', 'the bsl'],
        'SEPTA': ['septa', 'the train', 'the trolley', 'trolley', 'regional rail', '30th street station', '30th street', 'suburban station', 'jefferson station'],
        'Kensington': ['kensington', 'kensington avenue', 'kensington ave', 'k&a', 'kensington and allegheny'],
        'Somerset': ['somerset'],
        'Allegheny Avenue': ['allegheny', 'allegheny avenue', 'allegheny ave'],
        'Lehigh Avenue': ['lehigh', 'lehigh avenue', 'lehigh ave'],
        'Fishtown': ['fishtown', 'frankford avenue', 'frankford ave'],
        'Girard Avenue': ['girard', 'girard avenue', 'girard ave'],
        'Northern Liberties': ['northern liberties', 'nolibs', 'no libs'],
        'Spring Garden': ['spring garden'],
        'Callowhill': ['callowhill', 'the rail park', 'rail park'],
        'Chinatown': ['chinatown', 'china town', 'friendship gate', 'the gate', 'arch street', 'race and'],
        'Temple': ['temple', 'temple university', 'cecil b', 'cecil b. moore', 'cecil b moore'],
        'Broad and Erie': ['broad and erie', 'erie avenue', 'erie ave', 'erie'],
        'Germantown Avenue': ['germantown avenue', 'germantown ave'],
        'Germantown': ['germantown'],
        'Mount Airy': ['mount airy', 'mt airy', 'mt. airy'],
        'Chestnut Hill': ['chestnut hill'],
        'Wissahickon': ['wissahickon', 'the wissahickon', 'forbidden drive', 'wissahickon valley'],
        'Manayunk': ['manayunk', 'main street manayunk', 'manayunk main street'],
        'East Falls': ['east falls'],
        'Roxborough': ['roxborough'],
        'Strawberry Mansion': ['strawberry mansion'],
        'Brewerytown': ['brewerytown'],
        'Frankford': ['frankford'],
        'Olney': ['olney'],
        'Hunting Park': ['hunting park'],
        'Nicetown': ['nicetown'],
        'Port Richmond': ['port richmond', 'richmond'],
        'Mayfair': ['mayfair'],
        'Roosevelt Boulevard': ['roosevelt boulevard', 'roosevelt blvd', 'the boulevard'],
        'Camden': ['camden'],
        'Wawa': ['wawa'],
        'Graffiti Pier': ['graffiti pier'],
        'The Gallery': ['the gallery', 'fashion district'],
        'Macy\'s / Wanamaker': ["wanamaker", "macy's", 'macys'],
        'Comcast Center': ['comcast'],
        'Mummers': ['mummers', 'mummers parade'],
        'Eagles': ['eagles', 'the birds'],
    }
    for k, v in extra.items():
        add(k, *v)

    # generic or ambiguous words: kept, but scored at half weight
    noise = {'philly', 'philadelphia', 'downtown', 'walnut', 'chestnut', 'the market', 'the parkway', 'parkway', 'the bridge',
             'the waterfront', 'southwest', 'the northeast', 'the el', 'the l', 'the subway', 'the train', 'trolley',
             'the trolley', 'girard', 'erie', 'temple', 'somerset', 'allegheny', 'lehigh', 'frankford', 'richmond',
             'the boulevard', 'the gate', 'race and', 'the lakes', 'fdr', 'eagles', 'the birds', 'comcast', 'camden',
             'wawa', 'fairmount', 'cherry street', 'race street', 'market street', 'market st', '52nd', 'penn campus',
             'the avenue of the arts', 'olde city', 'the stadiums'}
    return gaz, noise
