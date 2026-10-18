import urllib.request, json, urllib.parse

def search_wm_top(query, limit=12):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json&srlimit={limit}"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianExportCatalogBot/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            d = json.loads(r.read().decode('utf-8'))
            results = d.get('query', {}).get('search', [])
            titles = [it['title'] for it in results if it['title'].lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
            if not titles:
                return []
            t_str = '|'.join(urllib.parse.quote(t) for t in titles)
            info_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={t_str}&prop=imageinfo&iiprop=url|size&format=json"
            req2 = urllib.request.Request(info_url, headers={'User-Agent': 'AurelianExportCatalogBot/1.0'})
            with urllib.request.urlopen(req2, timeout=10) as r2:
                d2 = json.loads(r2.read().decode('utf-8'))
                pages = d2.get('query', {}).get('pages', {})
                items = []
                for pid, p in pages.items():
                    info = p.get('imageinfo', [{}])[0]
                    w = info.get('width', 0)
                    h = info.get('height', 0)
                    u = info.get('url', '')
                    t = p.get('title', '')
                    if w >= 1600 and h >= 1200:
                        items.append({'title': t, 'w': w, 'h': h, 'url': u})
                return items
    except Exception as e:
        print(f"Error {query}: {e}")
        return []

targets = {
    "mint-leaf-powder": ["Mentha piperita leaves", "fresh mint leaves", "mint herb"],
    "tomato-powder": ["ripe red tomatoes white background", "Solanum lycopersicum tomatoes", "fresh ripe tomatoes"],
    "beetroot-powder": ["Beta vulgaris beetroot", "fresh beetroot whole", "sliced beetroot"],
    "carrot-powder": ["fresh carrots with tops", "Daucus carota sativus carrots", "carrots on white background"],
    "green-chilli-powder": ["fresh green chillies", "green chili peppers", "Capsicum annuum green"],
    "pumpkin-powder": ["pumpkin Cucurbita pepo", "pumpkin slice", "fresh pumpkin on white"],
    "amla-powder": ["Phyllanthus emblica fruits", "Indian gooseberry", "amla fruit tree"],
    "aloe-vera-powder": ["Aloe vera leaf cut", "Aloe vera plant succulent", "Aloe vera gel leaf"],
    "hibiscus-powder": ["Hibiscus sabdariffa dried calyces", "Hibiscus sabdariffa flower", "Karkadeh dried hibiscus"],
    "subway-ceramic-tiles": ["subway tile white", "ceramic subway tiles backsplash", "white wall tiles"],
    "polished-porcelain-tiles": ["polished porcelain floor tile", "marble floor tiles polished", "glossy floor tiles"],
    "glazed-vitrified-tiles": ["calacatta marble floor tile", "vitrified tile floor polished", "marble tile surface"],
    "large-format-porcelain-slabs": ["marble slab porcelain", "large format porcelain slab", "calacatta slab"],
    "outdoor-parking-tiles": ["concrete paver tiles", "outdoor stone pavers", "paving stone floor"],
    "anti-skid-ceramic-tiles": ["matte floor tiles bathroom", "slip resistant ceramic tile", "matte porcelain tile floor"]
}

for slug, q_list in targets.items():
    print(f"\n=== {slug} ===")
    found = False
    for q in q_list:
        res = search_wm_top(q, limit=6)
        if res:
            for item in res[:2]:
                print(f"  [{item['w']}x{item['h']}] {item['title']}")
                print(f"    {item['url']}")
            found = True
            break
    if not found:
        print("  NONE FOUND")
