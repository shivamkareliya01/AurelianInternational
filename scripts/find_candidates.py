import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'AurelianCurator/2.0 (curator@aurelianinternational.com)'}

def search_query(q, limit=6):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=12) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, p in pages.items():
                title = p.get('title', '')
                info = p.get('imageinfo', [{}])[0]
                url = info.get('url')
                w = info.get('width', 0)
                h = info.get('height', 0)
                mime = info.get('mime', '')
                if url and ('image/jpeg' in mime or 'image/png' in mime) and w >= 800 and h >= 600:
                    results.append({'title': title, 'url': url, 'w': w, 'h': h})
            return results
    except Exception as e:
        print(f"Error {q}: {e}")
        return []

targets = [
    ("1509-basmati-rice", "basmati rice grain"),
    ("sella-basmati-rice", "parboiled rice"),
    ("non-basmati-white-rice-ir64", "white rice raw uncooked"),
    ("sona-masoori-rice", "sona masuri rice"),
    ("bajra-pearl-millet", "pearl millet grain"),
    ("soybean", "soybean seeds dried"),
    ("white-onion", "white onions bulbs"),
    ("ginger", "fresh ginger root rhizome"),
    ("green-chilli", "green chili peppers fresh"),
    ("kesar-mango", "kesar mango fruit"),
    ("thompson-seedless-grapes", "green grapes bunch"),
    ("turmeric", "turmeric powder roots"),
    ("guntur-red-chilli", "dry red chili peppers"),
    ("black-pepper", "black peppercorns dried"),
    ("cumin-seeds", "cumin seeds bowl"),
    ("coriander-seeds", "coriander seeds bowl"),
    ("green-cardamom", "green cardamom pods"),
    ("cloves", "dried cloves spice"),
    ("fenugreek-seeds", "fenugreek seeds bowl"),
    ("fennel-seeds", "fennel seeds bowl"),
    ("garam-masala", "garam masala powder spices"),
    ("statuario-marble", "statuario marble slab"),
    ("indian-green-marble", "green marble slab"),
    ("tan-brown-granite", "tan brown granite"),
    ("kashmir-white-granite", "kashmir white granite"),
    ("rainbow-sandstone", "rainbow sandstone slab"),
    ("kota-limestone", "kota stone paving"),
    ("himachal-slate", "slate stone slab texture"),
    ("quartzite", "quartzite stone slab"),
    ("vitrified-tiles", "vitrified floor tile"),
    ("porcelain-tiles", "porcelain tile polished"),
    ("ceramic-wall-tiles", "ceramic wall tiles texture"),
    ("cobblestones", "granite cobblestone texture"),
    ("cashew-nuts-w320", "cashew nuts bowl"),
    ("cashew-nuts-w240", "cashew nuts raw whole"),
    ("pistachios", "pistachios bowl shell"),
    ("dates", "dried dates bowl fruit"),
    ("figs", "dried figs anjeer"),
    ("apricots", "dried apricots fruit"),
    ("makhana-fox-nut", "phool makhana fox nut")
]

all_found = {}
for slug, query in targets:
    res = search_query(query, limit=4)
    print(f"=== {slug} ('{query}') -> {len(res)} matches ===")
    for r in res[:2]:
        print(f"  {r['title']} ({r['w']}x{r['h']})")
    all_found[slug] = res

with open('scratch/found_candidates.json', 'w') as f:
    json.dump(all_found, f, indent=2)
print("Saved to scratch/found_candidates.json")
