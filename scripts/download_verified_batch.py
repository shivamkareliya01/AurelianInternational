import urllib.request
import urllib.parse
import json
import os

headers = {'User-Agent': 'AurelianExportCurator/2.0 (curator@aurelianinternational.com)'}

def fetch_wiki_file_by_title(title, out_path):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    clean_title = title if title.startswith("File:") else f"File:{title}"
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(clean_title)}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                info = p.get('imageinfo', [{}])[0]
                img_url = info.get('url')
                if img_url:
                    print(f"Downloading {clean_title} ({info.get('width')}x{info.get('height')}) -> {out_path}")
                    img_req = urllib.request.Request(img_url, headers=headers)
                    with urllib.request.urlopen(img_req, timeout=25) as img_resp:
                        data = img_resp.read()
                    with open(out_path, 'wb') as f:
                        f.write(data)
                    print(f"  Saved {len(data)/1024:.1f} KB")
                    return True
        print(f"No URL found for {clean_title}")
        return False
    except Exception as e:
        print(f"Error fetching {clean_title}: {e}")
        return False

batch = [
    ("File:Basmati Rice India, raw.jpg", "scratch/candidates/1509-basmati.jpg"),
    ("File:Sona-masuri.jpg", "scratch/candidates/sona-masoori.jpg"),
    ("File:Cardamom pods - Green BNC.jpg", "scratch/candidates/cardamom-pods.jpg"),
    ("File:Curcuma longa roots.jpg", "scratch/candidates/turmeric-roots.jpg"),
    ("File:Black Pepper IMG 4866 - 02.jpg", "scratch/candidates/black-pepper.jpg"),
    ("File:Whole Coriander.jpg", "scratch/candidates/coriander.jpg"),
    ("File:Mango Kesar Indian variety IMG 20230603 114021 (2).jpg", "scratch/candidates/kesar-mango.jpg"),
    ("File:\"Bunch of Green Grapes in Salem\".jpg", "scratch/candidates/green-grapes.jpg"),
    ("File:Food grain pearl millet 1.jpg", "scratch/candidates/pearl-millet.jpg"),
    ("File:\"Tan Brown Granite\" (porphyritic granite, Archean; Andhra Pradesh State, southern India) (14618910269).jpg", "scratch/candidates/tan-brown-granite.jpg"),
]

for title, out_path in batch:
    fetch_wiki_file_by_title(title, out_path)
