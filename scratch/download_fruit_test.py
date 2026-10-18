import urllib.request
import urllib.parse
import json
import os
from PIL import Image

additional_titles = [
    "File:A vibrant assortment of fresh fruits.jpg",
    "File:Colorful assortment of fresh fruits arranged in a bowl with natural light highlighting their vibrant colors.jpg",
    "File:Colorful assortment of fresh fruits arranged on a cutting board in a bright kitchen setting.jpg",
    "File:Fresh fruits arranged on a wooden surface showcasing vibrant colors and textures.jpg",
    "File:Good_Food_Display_-_NCI_Visuals_Online.jpg",
    "File:Fruit_stall_in_Barcelona_market.jpg",
    "File:Fruit_and_vegetable_market_in_Funchal_05.jpg",
    "File:Fruit_market,_La_Boqueria,_Barcelona.jpg",
    "File:Mercat_de_la_Boqueria_fruit_stall.jpg",
    "File:Display_of_fruits_and_vegetables.jpg",
    "File:Frutas_en_La_Boqueria.jpg"
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
os.makedirs('scratch/fruit_candidates', exist_ok=True)

for t in additional_titles:
    api = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
    req = urllib.request.Request(api, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for p in data.get('query', {}).get('pages', {}).values():
                info = p.get('imageinfo', [{}])[0]
                w = info.get('width', 0)
                h = info.get('height', 0)
                url = info.get('url', '')
                if w >= 2000 and url:
                    clean_name = t.replace('File:', '').replace(' ', '_').replace(',', '')[:40]
                    dest = f"scratch/fruit_candidates/{clean_name}.jpg"
                    print(f"Found {t} ({w}x{h}) -> downloading to {dest}...")
                    
                    req_img = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(req_img) as img_resp, open(dest, 'wb') as f:
                        f.write(img_resp.read())
                    
                    im = Image.open(dest)
                    thumb = im.copy()
                    thumb.thumbnail((800, 600))
                    thumb.save(f"scratch/fruit_candidates/{clean_name}_thumb.jpg", quality=85)
                    print(f"  Saved thumbnail: {clean_name}_thumb.jpg")
    except Exception as e:
        print(f"Error {t}: {e}")
