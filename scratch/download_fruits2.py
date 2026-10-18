import urllib.request
import urllib.parse
import json
import os
from PIL import Image

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

titles = [
    "File:DSCF0829_Assorted_fresh_tropical_fruits_neatly_prepped_and_displayed_on_plates_at_a_bustling_market_stall_-_passion_fruit_papaya_mango_and_more_ready_to_enjoy.jpg",
    "File:DZ6_0579_Busy_night_market_stall_overflowing_with_fresh_fruits_neatly_arranged_and_priced_while_shoppers_browse_under_bright_hanging_lights.jpg",
    "File:Fruit_Stall_in_Barcelona_Market.jpg",
    "File:Fruit_market,_La_Boqueria,_Barcelona.jpg",
    "File:Mercat_de_la_Boqueria_fruit_stall.jpg",
    "File:Frutas_en_La_Boqueria.jpg",
    "File:La_Boqueria_fruit_stall.jpg",
    "File:Fruits_in_La_Boqueria.jpg",
    "File:Fruits_in_Barcelona_market.jpg"
]

os.makedirs('scratch/fruit_candidates2', exist_ok=True)

for t in titles:
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
                    fname = t.replace('File:', '').replace(' ', '_')[:35]
                    dest = f"scratch/fruit_candidates2/{fname}.jpg"
                    print(f"Downloading {t} ({w}x{h})...")
                    img_req = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(img_req) as r, open(dest, 'wb') as f:
                        f.write(r.read())
                    im = Image.open(dest)
                    thumb = im.copy()
                    thumb.thumbnail((800, 600))
                    thumb.save(f"scratch/fruit_candidates2/{fname}_thumb.jpg", quality=85)
                    print(f"  Saved {fname}_thumb.jpg")
    except Exception as e:
        print(f"Error {t}: {e}")
