import urllib.request
import urllib.parse
import json

commodities = [
    ("1121-basmati-rice", "Basmati"),
    ("sesame-seeds", "Sesame"),
    ("groundnut-peanut-kernels", "Peanut"),
    ("kabuli-chickpeas", "Chickpea"),
    ("toor-dal", "Pigeon_pea"),
    ("moong-dal", "Mung_bean"),
    ("masoor-dal", "Lentil"),
    ("urad-dal", "Vigna_mungo"),
    ("soybean", "Soybean"),
    ("milling-wheat", "Wheat"),
    ("yellow-maize", "Maize"),
    ("bajra-pearl-millet", "Pearl_millet"),
    ("nashik-red-onion", "Red_onion"),
    ("potato", "Potato"),
    ("tomato", "Tomato"),
    ("garlic", "Garlic"),
    ("ginger", "Ginger"),
    ("green-chilli", "Chili_pepper"),
    ("okra-lady-finger", "Okra"),
    ("brinjal-eggplant", "Eggplant"),
    ("cauliflower", "Cauliflower"),
    ("cabbage", "Cabbage"),
    ("carrot", "Carrot"),
    ("green-peas", "Pea"),
    ("drumstick-moringa", "Moringa_oleifera"),
    ("cavendish-banana", "Cavendish_banana"),
    ("alphonso-mango", "Alphonso_(mango)"),
    ("kesar-mango", "Kesar_(mango)"),
    ("bhagwa-pomegranate", "Pomegranate"),
    ("nagpur-orange", "Mandarin_orange"),
    ("lemon", "Lemon"),
    ("papaya", "Papaya"),
    ("pineapple", "Pineapple"),
    ("turmeric", "Turmeric"),
    ("black-pepper", "Black_pepper"),
    ("cumin-seeds", "Cumin"),
    ("coriander-seeds", "Coriander"),
    ("green-cardamom", "Cardamom"),
    ("cloves", "Clove"),
    ("cinnamon", "Cinnamon"),
    ("fenugreek-seeds", "Fenugreek"),
    ("fennel-seeds", "Fennel"),
    ("mustard-seeds", "Mustard_seed"),
    ("star-anise", "Star_anise"),
    ("bay-leaf", "Bay_leaf"),
    ("garam-masala", "Garam_masala"),
    ("makrana-white-marble", "Makrana_marble"),
    ("cashew-nuts-w320", "Cashew"),
    ("almonds", "Almond"),
    ("walnuts", "Walnut"),
    ("pistachios", "Pistachio"),
    ("raisins", "Raisin"),
    ("dates", "Date_palm"),
    ("figs", "Common_fig"),
    ("apricots", "Apricot"),
    ("makhana-fox-nut", "Euryale_ferox")
]

headers = {'User-Agent': 'AurelianCatalogBot/1.0 (info@aurelian.com)'}

for slug, title in commodities:
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            data = json.loads(r.read().decode('utf-8'))
            orig = data.get('originalimage', {}).get('source')
            thumb = data.get('thumbnail', {}).get('source')
            desc = data.get('description', '')
            print(f"{slug}: [{desc}] -> {orig or thumb}")
    except Exception as e:
        print(f"{slug}: ERROR {e}")
