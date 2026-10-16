import urllib.request
import json

headers = {'User-Agent': 'AurelianStoneCurator/1.0 (curator@aurelianinternational.com)'}

titles = [
    "Carrara_marble",
    "Verde_antico",
    "Granite",
    "Sandstone",
    "Slate",
    "Limestone",
    "Quartzite",
    "Porcelain_tile",
    "Ceramic_tile",
    "Cobblestone",
    "Sett_(paving)",
    "Flagstone"
]

for t in titles:
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{t}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            img = data.get('originalimage', {}).get('source')
            w = data.get('originalimage', {}).get('width')
            h = data.get('originalimage', {}).get('height')
            print(f"[{t}]: {w}x{h} -> {img}")
    except Exception as e:
        print(f"[{t}] Error: {e}")
