import urllib.request
import urllib.parse
import json
import os
import sys

headers = {'User-Agent': 'AurelianExportCurator/2.0 (curator@aurelianinternational.com)'}

def fetch_files(file_titles, out_dir="scratch/candidates"):
    os.makedirs(out_dir, exist_ok=True)
    joined = "|".join(file_titles)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(joined)}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, p in pages.items():
                title = p.get('title', '')
                info = p.get('imageinfo', [{}])[0]
                img_url = info.get('url')
                if img_url:
                    clean_name = title.replace('File:', '').replace(' ', '_')
                    ext = os.path.splitext(clean_name)[1]
                    out_path = os.path.join(out_dir, clean_name)
                    print(f"Downloading {title} -> {out_path} ({info.get('width')}x{info.get('height')})")
                    img_req = urllib.request.Request(img_url, headers=headers)
                    img_data = urllib.request.urlopen(img_req, timeout=20).read()
                    with open(out_path, 'wb') as f:
                        f.write(img_data)
                    results.append((title, out_path, info.get('width'), info.get('height')))
            return results
    except Exception as e:
        print(f"Error: {e}")
        return []

if __name__ == '__main__':
    titles = [
        'File:Split pigeon peas.jpg',
        'File:Pigeon Pea (Toor Dal) (49683602388).jpg',
        'File:Moong Dal.jpg',
        'File:Masoor dal.JPG',
        'File:Black gram dal with fried onion tarka. (8396786717).jpg',
        'File:Urad dal in a bowl.jpg'
    ]
    fetch_files(titles)
