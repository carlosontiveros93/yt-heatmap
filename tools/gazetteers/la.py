"""Los Angeles gazetteer for scan_locations.py.

Inputs (both gitignored, in research/la/):
  latimes_neighborhoods.geojson  LA Times "Mapping L.A." neighborhoods v6, whole county.
      download: https://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive/1.0/boundary-set/la-county-neighborhoods-v6.geojson
  parks.geojson  LA County DPR "Countywide Parks and Open Space (Public - Hosted)", layer 0,
      every agency's parks in the county (City of LA Rec & Parks, county, state, Santa Monica...).
      download (two pages of 2000, resultOffset=0 and 2000, merged into one FeatureCollection):
      https://services.arcgis.com/RmCCgQtiZLDCtblq/arcgis/rest/services/Countywide_Parks_and_Open_Space__(Public_-_Hosted2)/FeatureServer/0/query?where=1=1&outFields=*&f=geojson&resultRecordCount=2000
"""
import json

RAW = 'research/la/raw.json'
SCAN = 'research/la/scan.json'
REVIEW = 'research/la/review.md'
REVIEW_TITLE = 'Walkie Talkie LA — first-pass location scan'

# LA Times regions that are street-photo ground. Skips the high desert, the mountains,
# and the far San Gabriel / Santa Clarita valleys.
REGIONS = {'central-la', 'south-la', 'eastside', 'northeast-la', 'westside', 'san-fernando-valley',
           'verdugos', 'harbor', 'south-bay', 'beach-cities', 'southeast'}
# Cities whose parks are worth scanning for (the county file has 3,000 parks, most of them irrelevant)
PARK_CITIES = {'Los Angeles', 'Santa Monica', 'Long Beach', 'Pasadena', 'West Hollywood', 'Beverly Hills',
               'Culver City', 'Inglewood', 'Glendale', 'Burbank', 'Compton', 'Huntington Park', 'Venice'}


def build():
    S = 'research/la/'
    hoods = json.load(open(S + 'latimes_neighborhoods.geojson'))
    parks = json.load(open(S + 'parks.geojson'))

    gaz = {}
    def add(name, *alts):
        gaz.setdefault(name, set()).update(a.lower() for a in (alts or (name,)))

    for f in hoods['features']:
        m = f['properties']['metadata']
        if m['type'] == 'unincorporated-area' or m['region'] not in REGIONS:
            continue
        add(m['name'])
    for f in parks['features']:
        p = f['properties']
        name = (p.get('PARK_NAME') or '').strip()
        if not name or p.get('CITY') not in PARK_CITIES or p.get('ACCESS_TYP') != 'Open Access':
            continue
        if (p.get('GIS_ACRES') or 0) < 8:
            continue
        # "Griffith Park (City of Los Angeles)" -> "Griffith Park"
        name = name.split(' (')[0]
        add(name)

    # what photographers actually say: streets, landmarks, colloquial names
    extra = {
        'Los Angeles': ['los angeles', 'l.a.', 'la'],
        'Downtown': ['downtown', 'dtla', 'downtown la', 'downtown los angeles'],
        'Broadway': ['broadway'], 'Spring Street': ['spring street', 'spring st'], 'Main Street': ['main street', 'main st'],
        'Historic Core': ['historic core'], 'Bradbury Building': ['bradbury'], 'Grand Central Market': ['grand central market', 'grand central'],
        'Pershing Square': ['pershing square', 'pershing'], 'Bunker Hill': ['bunker hill'], 'Union Station': ['union station'],
        'Olvera Street': ['olvera'], 'Chinatown': ['chinatown'], 'Little Tokyo': ['little tokyo'], 'Arts District': ['arts district'],
        'Skid Row': ['skid row'], 'Fashion District': ['fashion district', 'garment district'], 'Santee Alley': ['santee alley', 'santee'],
        'Jewelry District': ['jewelry district'], 'Flower District': ['flower district', 'flower market'],
        'Piñata District': ['pinata district', 'piñata district', 'pinata'], 'Toy District': ['toy district'],
        '6th Street Bridge': ['6th street bridge', 'sixth street bridge', '6th street viaduct', 'sixth street viaduct'],
        'LA River': ['la river', 'the river', 'los angeles river'], 'LA Live': ['la live', 'l.a. live', 'staples', 'crypto.com arena', 'crypto arena'],
        'Figueroa': ['figueroa', 'fig'], 'Olympic Blvd': ['olympic'], 'Pico Blvd': ['pico'], 'Wilshire Blvd': ['wilshire'],
        'Cesar Chavez Ave': ['cesar chavez'], 'Alvarado Street': ['alvarado'], 'Vermont Avenue': ['vermont'], 'Western Avenue': ['western'],
        'Sunset Blvd': ['sunset boulevard', 'sunset blvd', 'sunset'], 'Sunset Strip': ['sunset strip', 'the strip'],
        'Hollywood': ['hollywood'], 'Hollywood Blvd': ['hollywood boulevard', 'hollywood blvd', 'the boulevard'],
        'Walk of Fame': ['walk of fame', 'the stars'], 'Hollywood & Highland': ['hollywood and highland', 'hollywood & highland', 'highland'],
        'Chinese Theatre': ['chinese theater', 'chinese theatre', "grauman"], 'Hollywood Sign': ['hollywood sign'],
        'Runyon Canyon': ['runyon'], 'Griffith Observatory': ['observatory'],
        'Melrose': ['melrose'], 'Fairfax': ['fairfax'], 'The Grove': ['the grove', 'farmers market'],
        'Koreatown': ['koreatown', 'k-town', 'ktown', 'k town'], 'MacArthur Park': ['macarthur park', 'macarthur'],
        'Echo Park': ['echo park'], 'Silver Lake': ['silver lake', 'silverlake'], 'Los Feliz': ['los feliz'],
        'Dodger Stadium': ['dodger stadium', 'dodgers'], 'Elysian Park': ['elysian'],
        'Boyle Heights': ['boyle heights'], 'Mariachi Plaza': ['mariachi plaza', 'mariachi'], 'East LA': ['east la', 'east los angeles', 'east l.a.'],
        'Highland Park': ['highland park', 'york boulevard', 'york blvd'], 'Eagle Rock': ['eagle rock'],
        'Exposition Park': ['exposition park', 'expo park'], 'USC': ['usc'], 'UCLA': ['ucla'], 'Westwood': ['westwood'],
        'South LA': ['south la', 'south central', 'south los angeles'], 'Leimert Park': ['leimert'], 'Crenshaw': ['crenshaw'],
        'Slauson': ['slauson'], 'Florence': ['florence'], 'Watts Towers': ['watts towers', 'watts'],
        'Inglewood': ['inglewood'], 'Compton': ['compton'], 'Huntington Park': ['huntington park', 'pacific boulevard', 'pacific blvd'],
        'Venice Beach': ['venice beach', 'venice boardwalk', 'the boardwalk', 'venice'], 'Abbot Kinney': ['abbot kinney'],
        'Santa Monica': ['santa monica'], 'Santa Monica Pier': ['santa monica pier', 'the pier'],
        'Third Street Promenade': ['third street promenade', '3rd street promenade', 'the promenade'],
        'The Beach': ['the beach'], 'Malibu': ['malibu'], 'Long Beach': ['long beach'], 'San Pedro': ['san pedro'],
        'Beverly Hills': ['beverly hills'], 'Rodeo Drive': ['rodeo drive', 'rodeo'], 'West Hollywood': ['west hollywood', 'weho'],
        'Culver City': ['culver city'], 'Pasadena': ['pasadena'], 'Old Town Pasadena': ['old town', 'old pasadena', 'colorado boulevard', 'colorado blvd'],
        'Glendale': ['glendale'], 'Burbank': ['burbank'],
        'The Valley': ['the valley', 'san fernando valley'], 'North Hollywood': ['north hollywood', 'noho'], 'Van Nuys': ['van nuys'],
        'Metro': ['metro', 'the train', 'the subway', 'red line', 'expo line', 'gold line', 'blue line', 'a line', 'b line', 'e line'],
        'Freeway': ['the 101', 'the 110', 'the 10', 'the 405', 'the 5', 'freeway'],
    }
    for k, v in extra.items():
        add(k, *v)

    # generic or ambiguous words: kept, but scored at half weight
    noise = {'la', 'downtown', 'broadway', 'main street', 'main st', 'spring street', 'spring st', 'sunset', 'the strip',
             'western', 'vermont', 'pico', 'olympic', 'fig', 'highland', 'the boulevard', 'the stars', 'hollywood',
             'the river', 'the valley', 'the beach', 'the pier', 'the promenade', 'the boardwalk', 'venice', 'rodeo',
             'old town', 'florence', 'watts', 'mariachi', 'metro', 'the train', 'the subway', 'a line', 'b line', 'e line',
             'the 101', 'the 110', 'the 10', 'the 405', 'the 5', 'freeway', 'dodgers', 'santee', 'pinata', 'the grove',
             'farmers market', 'observatory', 'noho'}
    return gaz, noise
