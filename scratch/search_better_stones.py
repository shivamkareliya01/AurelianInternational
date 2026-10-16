import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'AurelianStoneCurator/3.0 (curator@aurelianinternational.com)'}

def search_commons(query, limit=5):
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

items = {
    "statuario-marble": ["Statuario marble slab", "Carrara marble slab", "White marble texture slab"],
    "indian-green-marble": ["Verde Guatemala marble", "Green marble slab", "Green marble floor"],
    "kashmir-white-granite": ["White granite slab", "Granite slab polished", "White granite countertop"],
    "rainbow-sandstone": ["Sandstone paving slab", "Sandstone paving", "Sandstone tiles"],
    "kota-limestone": ["Limestone paving", "Limestone flagstones", "Limestone slab flooring"],
    "himachal-slate": ["Slate tiles floor", "Slate flagstones", "Slate roof tile slab", "Slate texture"],
    "quartzite": ["Quartzite slab", "Quartzite tiles", "Quartzite stone texture"],
    "vitrified-tiles": ["Porcelain floor tiles", "Glazed ceramic tile floor", "Polished porcelain tile"],
    "porcelain-tiles": ["Porcelain tile floor", "Modern porcelain tiles", "Large format porcelain tiles"],
    "ceramic-wall-tiles": ["Ceramic wall tiles bathroom", "Subway tile wall", "Ceramic wall tiles interior"],
    "cobblestones": ["Granite cobblestones pavement", "Cobblestone street paving", "Granite setts cobblestone"],
}

for slug, q_list in items.items():
    print(f"=== {slug} ===")
    found = False
    for q in q_list:
        res = search_commons(q, 4)
        if res:
            for r in res[:2]:
                safe = r['title'].encode('ascii', errors='replace').decode('ascii')
                print(f"  [{q}] {safe} ({r['w']}x{r['h']})")
                print(f"    {r['url']}")
            found = True
            break
    if not found:
        print("  NONE FOUND")
