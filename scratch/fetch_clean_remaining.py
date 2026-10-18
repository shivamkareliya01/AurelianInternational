import urllib.request, json, urllib.parse, time, os

headers = {'User-Agent': 'AurelianExportCuratorBot/3.0 (curator@aureliantrade.com)'}

def search_wm_single(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json&srlimit=5"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=12) as r:
            d = json.loads(r.read().decode('utf-8'))
            results = d.get('query', {}).get('search', [])
            titles = [it['title'] for it in results if it['title'].lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
            if not titles:
                return None
            time.sleep(1.2)
            t_str = '|'.join(urllib.parse.quote(t) for t in titles[:3])
            info_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={t_str}&prop=imageinfo&iiprop=url|size&format=json"
            req2 = urllib.request.Request(info_url, headers=headers)
            with urllib.request.urlopen(req2, timeout=12) as r2:
                d2 = json.loads(r2.read().decode('utf-8'))
                pages = d2.get('query', {}).get('pages', {})
                for pid, p in pages.items():
                    info = p.get('imageinfo', [{}])[0]
                    w = info.get('width', 0)
                    h = info.get('height', 0)
                    u = info.get('url', '')
                    t = p.get('title', '')
                    if w >= 1200 and h >= 900:
                        return {'title': t, 'w': w, 'h': h, 'url': u}
    except Exception as e:
        print(f"Error {query}: {e}")
    return None

queries_to_fetch = {
    "subway-ceramic-tiles": "subway tile white kitchen",
    "polished-porcelain-tiles": "polished porcelain floor tile interior",
    "glazed-vitrified-tiles": "calacatta gold marble tile interior",
    "large-format-porcelain-slabs": "large format porcelain slab kitchen",
    "outdoor-parking-tiles": "stone paving tiles outdoor",
    "anti-skid-ceramic-tiles": "matte bathroom floor tiles",
    "mint-leaf-powder": "fresh mint leaves wooden bowl",
    "tomato-powder": "sun dried tomatoes bowl",
    "green-chilli-powder": "green chili peppers bowl",
    "hibiscus-powder": "dried hibiscus tea calyces"
}

results = {}
for slug, q in queries_to_fetch.items():
    print(f"Searching for {slug}: '{q}'...")
    res = search_wm_single(q)
    if res:
        print(f"  FOUND: {res['title']} ({res['w']}x{res['h']})")
        results[slug] = res
    else:
        print("  NOT FOUND")
    time.sleep(1.5)

with open('scratch/fetched_remaining_urls.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
