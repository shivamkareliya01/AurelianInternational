import urllib.request
import urllib.parse
import json
import time

products_to_search = [
    ("1121-basmati-rice", "basmati rice grains raw"),
    ("1509-basmati-rice", "white rice grains bowl raw"),
    ("sella-basmati-rice", "golden sella basmati rice parboiled"),
    ("non-basmati-white-rice-ir64", "white long grain rice raw"),
    ("sona-masoori-rice", "sona masoori raw rice grains"),
    ("milling-wheat", "wheat grains ears golden"),
    ("yellow-maize", "yellow maize corn kernels"),
    ("bajra-pearl-millet", "pearl millet bajra grains"),
    ("soybean", "soybeans raw grains"),
    ("toor-dal", "toor dal yellow pigeon peas split"),
    ("moong-dal", "moong dal split yellow lentils"),
    ("masoor-dal", "masoor dal red lentils split"),
    ("urad-dal", "urad dal black gram split"),
    ("white-onion", "fresh white onion bulbs"),
    ("garlic", "garlic bulbs cloves raw"),
    ("ginger", "fresh ginger root rhizome"),
    ("green-chilli", "fresh green chillies spicy"),
    ("cauliflower", "fresh white cauliflower head"),
    ("cavendish-banana", "fresh cavendish bananas yellow"),
    ("alphonso-mango", "alphonso mangoes ripe fresh"),
    ("kesar-mango", "kesar mangoes ripe golden"),
    ("thompson-seedless-grapes", "green seedless grapes bunch"),
    ("nagpur-orange", "fresh oranges mandarin whole and cut"),
    ("papaya", "fresh ripe papaya cut fruit"),
    ("turmeric", "turmeric rhizome finger powder"),
    ("guntur-red-chilli", "dried red chillies indian"),
    ("black-pepper", "black peppercorns whole spice"),
    ("cumin-seeds", "cumin seeds jeera whole"),
    ("coriander-seeds", "coriander seeds whole dhaniya"),
    ("green-cardamom", "green cardamom pods spice"),
    ("cloves", "whole cloves spice laung"),
    ("fenugreek-seeds", "fenugreek seeds methi"),
    ("fennel-seeds", "fennel seeds saunf spice"),
    ("garam-masala", "indian whole spices garam masala"),
    ("statuario-marble", "statuario white marble slab texture"),
    ("indian-green-marble", "green marble slab polished"),
    ("tan-brown-granite", "tan brown granite slab polished"),
    ("kashmir-white-granite", "white granite slab texture"),
    ("rainbow-sandstone", "sandstone slab texture rock"),
    ("kota-limestone", "limestone slab stone texture"),
    ("himachal-slate", "slate stone slab texture dark"),
    ("quartzite", "quartzite stone slab polished"),
    ("vitrified-tiles", "vitrified floor tiles polished"),
    ("porcelain-tiles", "porcelain tile ceramic texture"),
    ("ceramic-wall-tiles", "ceramic wall tiles glazed"),
    ("cobblestones", "granite cobblestones paving stones"),
    ("cashew-nuts-w320", "cashew nuts whole raw white"),
    ("cashew-nuts-w240", "cashew nuts raw in bowl"),
    ("pistachios", "pistachio nuts in shell roasted"),
    ("dates", "dried dates fruit sweet"),
    ("figs", "dried figs anjeer fruit"),
    ("apricots", "dried apricots orange fruit"),
    ("makhana-fox-nut", "makhana fox nuts popped lotus seeds")
]

headers = {'User-Agent': 'AurelianExportAuditor/1.0 (info@aurelianinternational.com)'}

def search_product(slug, q):
    url = f"https://api.openverse.org/v1/images/?q={urllib.parse.quote(q)}&page_size=3"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            results = data.get('results', [])
            return results
    except Exception as e:
        return []

print(f"Searching for {len(products_to_search)} products...")
found_count = 0
for slug, q in products_to_search:
    res = search_product(slug, q)
    if res:
        found_count += 1
        print(f"[{slug}] FOUND {len(res)}: '{res[0].get('title')}' -> {res[0].get('url')}")
    else:
        print(f"[{slug}] NONE FOUND for '{q}'")
    time.sleep(0.3)

print(f"\nCompleted search: {found_count}/{len(products_to_search)} products found candidates.")
