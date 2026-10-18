import urllib.request
import os
from PIL import Image

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

candidates = {
    'basket_assortment': 'https://upload.wikimedia.org/wikipedia/commons/6/63/A_woven_basket_filled_with_an_assortment_of_colorful_vegetables.jpg',
    'surtido_vegetales': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Surtido_de_vegetales.jpg',
    'fresh_veg_2': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Fresh_Vegetables_2.jpg'
}

os.makedirs('scratch/veg_candidates', exist_ok=True)

for name, url in candidates.items():
    dest = f'scratch/veg_candidates/{name}.jpg'
    if not os.path.exists(dest):
        print(f"Downloading {name}...")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as f:
            f.write(resp.read())
        print(f"Downloaded {dest}: {os.path.getsize(dest)} bytes")
    
    im = Image.open(dest)
    print(f"{name}: size={im.size}, mode={im.mode}")
