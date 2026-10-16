import urllib.request
import urllib.parse
import json

pages = [
    ('basmati', 'Basmati'),
    ('wheat', 'Wheat'),
    ('maize', 'Maize'),
    ('pearl_millet', 'Pearl_millet'),
    ('soybean', 'Soybean'),
    ('pigeon_pea', 'Pigeon_pea'),
    ('mung_bean', 'Mung_bean'),
    ('lentil', 'Lentil'),
    ('garlic', 'Garlic'),
    ('ginger', 'Ginger'),
    ('cauliflower', 'Cauliflower'),
    ('banana', 'Banana'),
    ('mango', 'Mango'),
    ('grape', 'Grape'),
    ('orange', 'Orange_(fruit)'),
    ('papaya', 'Papaya'),
    ('black_pepper', 'Black_pepper'),
    ('cardamom', 'Cardamom'),
    ('clove', 'Clove'),
    ('fenugreek', 'Fenugreek'),
    ('fennel', 'Fennel'),
    ('cashew', 'Cashew'),
    ('pistachio', 'Pistachio'),
    ('dates', 'Date_palm'),
    ('fig', 'Common_fig'),
    ('apricot', 'Apricot')
]

headers = {'User-Agent': 'AurelianCatalogBot/1.0 (info@aurelianinternational.com)'}

for key, title in pages[:8]:
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=1600"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages_dict = data.get('query', {}).get('pages', {})
            for pid, pdata in pages_dict.items():
                thumb = pdata.get('thumbnail', {})
                print(f"[{key}] -> {thumb.get('source')} ({thumb.get('width')}x{thumb.get('height')})")
    except Exception as e:
        print(f"[{key}] Error: {e}")
