import urllib.request
import urllib.parse
import json
from PIL import Image

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

targets = [
    ("Collection_of_fruits", "File:Collection of fruits (Unsplash).jpg"),
    ("Fresh_fruit_smoothie_prep", "File:Fresh fruit smoothie preparation with assorted fruits on a table.jpg"),
    ("Sliced_citrus_fruits", "File:Sliced orange citrus fruits-943632.jpg")
]

for key, title in targets:
    api = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
    req = urllib.request.Request(api, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for p in data['query']['pages'].values():
                info = p.get('imageinfo', [{}])[0]
                url = info.get('url', '')
                w, h = info.get('width', 0), info.get('height', 0)
                print(f"Target {key}: {w}x{h} -> {url}")
                if url:
                    dest = f"scratch/fruit_candidates/{key}.jpg"
                    req_img = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(req_img) as r, open(dest, 'wb') as f:
                        f.write(r.read())
                    im = Image.open(dest)
                    thumb = im.copy()
                    thumb.thumbnail((800, 600))
                    thumb.save(f"scratch/fruit_candidates/{key}_thumb.jpg", quality=85)
                    print(f"Saved {key}_thumb.jpg")
    except Exception as e:
        print(f"Error {key}: {e}")
