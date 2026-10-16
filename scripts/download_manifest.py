import json
import urllib.request
import os

headers = {'User-Agent': 'AurelianBatchCurator/1.0 (curator@aurelianinternational.com)'}

with open('scratch/found_manifest.json', 'r') as f:
    manifest = json.load(f)

os.makedirs('scratch/candidates/batch2', exist_ok=True)

for slug, item in manifest.items():
    url = item['url']
    out_path = f"scratch/candidates/batch2/{slug}.jpg"
    print(f"Downloading [{slug}] ({item['w']}x{item['h']}) -> {out_path}")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        with open(out_path, 'wb') as f:
            f.write(data)
        print(f"  OK {len(data)/1024:.1f} KB")
    except Exception as e:
        print(f"  FAILED: {e}")
