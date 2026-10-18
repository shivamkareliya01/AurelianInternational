import urllib.request
import urllib.parse
import json
import os
from PIL import Image

os.makedirs('scratch/ingredients_raw', exist_ok=True)

# Curated search queries for high-resolution studio photographs of each ingredient
QUERIES = {
    'white-onion-powder': ['White onion on white', 'Allium cepa white onion bulb', 'White onions'],
    'pink-red-onion-powder': ['Red onion bulb sliced', 'Red onions whole', 'Allium cepa red onion'],
    'garlic-powder': ['Garlic bulbs and cloves', 'Fresh garlic bulb', 'Garlic cloves isolated'],
    'ginger-powder-saunth': ['Fresh ginger root', 'Zingiber officinale rhizome', 'Ginger rhizome fresh'],
    'moringa-leaf-powder': ['Moringa oleifera leaves fresh', 'Kalamunggay leaves', 'Moringa leaves branch'],
    'moringa-seed-powder': ['Moringa oleifera seeds', 'Moringa seeds pod', 'Moringa seed'],
    'spinach-powder': ['Fresh spinach leaves', 'Spinacia oleracea leaves', 'Spinach bunch fresh'],
    'curry-leaf-powder': ['Murraya koenigii leaves', 'Fresh curry leaves sprig', 'Curry leaf fresh'],
    'mint-leaf-powder': ['Fresh mint sprig leaves', 'Mentha leaves fresh', 'Peppermint leaves sprig'],
    'coriander-leaf-powder': ['Fresh coriander leaves cilantro', 'Coriandrum sativum leaves', 'Cilantro fresh'],
    'kasuri-methi-powder': ['Fenugreek leaves fresh', 'Trigonella foenum-graecum leaves', 'Methi leaves fresh'],
    'tomato-powder': ['Ripe red tomatoes whole cut', 'Fresh tomatoes on vine', 'Red tomatoes cut'],
    'beetroot-powder': ['Fresh beetroots Beta vulgaris', 'Beetroot sliced fresh', 'Beetroot with greens'],
    'carrot-powder': ['Fresh carrots bunch with tops', 'Daucus carota carrots fresh', 'Carrots with green tops'],
    'green-chilli-powder': ['Fresh green chillies', 'Green chili peppers fresh', 'Green chillies isolated'],
    'pumpkin-powder': ['Cut pumpkin wedge', 'Fresh pumpkin slice', 'Pumpkin wedge with seeds'],
    'mango-powder-amchur': ['Raw green mangoes', 'Unripe mango fruit', 'Green mango fresh'],
    'banana-powder': ['Fresh yellow bananas bunch', 'Bananas whole and sliced', 'Ripe bananas isolated'],
    'lemon-powder': ['Fresh whole and sliced lemons', 'Lemons on white background', 'Yellow lemons cut half'],
    'amla-powder': ['Phyllanthus emblica whole and cross section', 'Phyllanthus emblica fresh fruit', 'Amla fruit gooseberry'],
    'aloe-vera-powder': ['Aloe vera leaf cut gel', 'Fresh aloe vera leaf sliced', 'Aloe barbadensis leaf gel'],
    'hibiscus-powder': ['Hibiscus sabdariffa dried calyces', 'Roselle calyx fresh dried', 'Hibiscus sabdariffa flower roselle']
}

def search_wikimedia(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianExport/1.0 (info@aurelianinternational.com)'})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            images = []
            for page_id, info in pages.items():
                img_info = info.get('imageinfo', [{}])[0]
                img_url = img_info.get('url')
                width = img_info.get('width', 0)
                height = img_info.get('height', 0)
                mime = img_info.get('mime', '')
                if img_url and width >= 1000 and 'image' in mime and not mime.endswith('svg'):
                    images.append({'url': img_url, 'width': width, 'height': height, 'title': info.get('title')})
            return images
    except Exception as e:
        print(f"Error searching '{query}': {e}")
        return []

print("Searching candidate photos...")
for slug, q_list in QUERIES.items():
    found = False
    for q in q_list:
        imgs = search_wikimedia(q)
        if imgs:
            print(f"[FOUND] {slug} -> {imgs[0]['title']} ({imgs[0]['width']}x{imgs[0]['height']})")
            # Save candidate
            out_file = f"scratch/ingredients_raw/{slug}.jpg"
            try:
                req = urllib.request.Request(imgs[0]['url'], headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=30) as resp:
                    with open(out_file, 'wb') as f:
                        f.write(resp.read())
                found = True
                break
            except Exception as e:
                print(f"Failed download {imgs[0]['url']}: {e}")
    if not found:
        print(f"[MISSING] {slug}")
