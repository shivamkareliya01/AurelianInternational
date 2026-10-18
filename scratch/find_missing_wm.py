import urllib.request, json, urllib.parse
from PIL import Image
import numpy as np

def search_wikimedia_clean(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json&srlimit={limit}"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianExportCatalogBot/1.0 (contact@aurelian.trade)'})
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
                out = []
                for pid, p in pages.items():
                    info = p.get('imageinfo', [{}])[0]
                    w = info.get('width', 0)
                    h = info.get('height', 0)
                    u = info.get('url', '')
                    title = p.get('title', '')
                    if w >= 1200 and h >= 900:
                        out.append({'title': title, 'width': w, 'height': h, 'url': u})
                return out
    except Exception as e:
        print(f"Error {query}:", e)
        return []

needed = {
    "mint-leaf-powder": ["fresh mint leaves wooden bowl", "Mentha piperita leaves", "fresh mint leaves white background"],
    "tomato-powder": ["tomato powder bowl", "ground dried tomatoes", "sun dried tomatoes bowl", "ripe tomatoes on white background"],
    "beetroot-powder": ["beetroot powder", "beet powder in bowl", "Beta vulgaris beetroot on white", "sliced fresh beetroot"],
    "carrot-powder": ["carrot powder bowl", "dehydrated carrots", "fresh carrots white background", "Daucus carota sativus"],
    "green-chilli-powder": ["green chilli powder", "ground green chillies", "fresh green chillies white background", "green chili peppers in bowl"],
    "pumpkin-powder": ["pumpkin powder", "pumpkin puree in bowl", "pumpkin wedge on white", "Cucurbita pepo pumpkin"],
    "amla-powder": ["amla powder in bowl", "Phyllanthus emblica fruits", "fresh Indian gooseberry amla", "amla fruit on white"],
    "aloe-vera-powder": ["aloe vera gel in bowl", "Aloe vera succulent leaf cut", "fresh aloe vera leaf sliced"],
    "hibiscus-powder": ["hibiscus tea calyces in bowl", "dried hibiscus sabdariffa flowers", "hibiscus powder bowl", "roselle calyces"],
    "subway-ceramic-tiles": ["white subway tile wall", "subway tile kitchen backsplash", "white ceramic subway tile"],
    "polished-porcelain-tiles": ["polished porcelain floor tile", "porcelain floor tiling glossy", "marble look porcelain tile"],
    "glazed-vitrified-tiles": ["glazed vitrified tile floor", "calacatta gold porcelain slab", "polished vitrified floor"],
    "large-format-porcelain-slabs": ["large format porcelain slab wall", "porcelain slab kitchen island", "bookmatched marble porcelain slab"],
    "outdoor-parking-tiles": ["heavy duty outdoor paving tile", "outdoor vitrified parking tile", "stone look outdoor pavers"],
    "anti-skid-ceramic-tiles": ["matte anti skid ceramic floor tile", "matte porcelain tile floor bathroom", "slip resistant floor tile"]
}

found_map = {}
for slug, q_list in needed.items():
    found = None
    for q in q_list:
        res = search_wikimedia_clean(q, limit=5)
        if res:
            # Pick first high res
            found = res[0]
            break
    if found:
        print(f"MATCH: {slug:30} -> {found['title']} ({found['width']}x{found['height']})")
        found_map[slug] = found
    else:
        print(f"NO MATCH: {slug:30}")

with open('scratch/wm_found_map.json', 'w', encoding='utf-8') as f:
    json.dump(found_map, f, indent=2)
