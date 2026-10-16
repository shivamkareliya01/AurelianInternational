import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'AurelianStoneCurator/2.0 (curator@aurelianinternational.com)'}

def search_commons_raw(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, p in pages.items():
                title = p.get('title', '')
                info = p.get('imageinfo', [{}])[0]
                url = info.get('url')
                w = info.get('width', 0)
                h = info.get('height', 0)
                mime = info.get('mime', '')
                if url and ('image/jpeg' in mime or 'image/png' in mime) and w >= 800:
                    results.append({'title': title, 'url': url, 'w': w, 'h': h})
            return results
    except Exception as e:
        return []

stone_queries = [
    ("White Marble / Statuario", '"James St. John" "Carrara" OR "Statuario" marble'),
    ("Green Marble", '"James St. John" "Verde" OR "Green" marble'),
    ("Kashmir White / White Granite", '"James St. John" "White Granite"'),
    ("Sandstone", '"James St. John" "Sandstone" (commercial OR polished OR slab)'),
    ("Slate", '"James St. John" "Slate" (slab OR commercial OR texture)'),
    ("Limestone", '"James St. John" "Limestone" (commercial OR polished OR slab)'),
    ("Quartzite", '"James St. John" "Quartzite" (slab OR commercial OR polished)'),
]

for label, q in stone_queries:
    print(f"=== {label} ===")
    res = search_commons_raw(q, 6)
    for r in res[:4]:
        safe = r['title'].encode('ascii', errors='replace').decode('ascii')
        print(f"  {safe} ({r['w']}x{r['h']})")
