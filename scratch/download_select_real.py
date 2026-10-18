import urllib.request
import urllib.parse
import json
import os
from PIL import Image

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

titles = [
    ("coriander_powder", "File:Coriander Powder.jpg"),
    ("kasuri_methi", "File:Dried leaves of Fenugreek-Kasuri Methi.jpg"),
    ("plantain_powder", "File:Plantain banana powder.jpg"),
    ("dried_lemon", "File:Dried lemon slices.jpg"),
    ("dried_mango", "File:Dried Mango Slices.JPG"),
    ("shredded_potatoes", "File:Dehydrated shredded potatoes.jpg")
]

os.makedirs('scratch/real_photos', exist_ok=True)

for key, title in titles:
    api = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
    req = urllib.request.Request(api, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for p in data['query']['pages'].values():
                info = p.get('imageinfo', [{}])[0]
                url = info.get('url', '')
                if url:
                    dest = f"scratch/real_photos/{key}.jpg"
                    print(f"Downloading {key} from {url[:60]}...")
                    img_req = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(img_req) as r, open(dest, 'wb') as f:
                        f.write(r.read())
                    im = Image.open(dest)
                    thumb = im.copy()
                    thumb.thumbnail((800, 600))
                    thumb.save(f"scratch/real_photos/{key}_thumb.jpg")
                    print(f"Saved {key}_thumb.jpg: {im.size}")
    except Exception as e:
        print(f"Error {key}: {e}")
