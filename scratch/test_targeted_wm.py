import urllib.request, json, urllib.parse

def find_best_wm_image(queries, min_dim=800):
    for q in queries:
        url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&srnamespace=6&format=json&srlimit=10"
        req = urllib.request.Request(url, headers={'User-Agent': 'AurelianExportCatalogBot/1.0 (contact@aurelian.trade)'})
        try:
            with urllib.request.urlopen(req, timeout=8) as r:
                d = json.loads(r.read().decode('utf-8'))
                results = d.get('query', {}).get('search', [])
                titles = [it['title'] for it in results if it['title'].lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
                if not titles:
                    continue
                # query imageinfo
                t_str = '|'.join(urllib.parse.quote(t) for t in titles[:5])
                info_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={t_str}&prop=imageinfo&iiprop=url|size&format=json"
                req2 = urllib.request.Request(info_url, headers={'User-Agent': 'AurelianExportCatalogBot/1.0'})
                with urllib.request.urlopen(req2, timeout=8) as r2:
                    d2 = json.loads(r2.read().decode('utf-8'))
                    pages = d2.get('query', {}).get('pages', {})
                    for pid, p in pages.items():
                        info = p.get('imageinfo', [{}])[0]
                        w = info.get('width', 0)
                        h = info.get('height', 0)
                        u = info.get('url', '')
                        if w >= min_dim and h >= min_dim:
                            return p.get('title'), w, h, u
        except Exception as e:
            continue
    return None

test_items = {
    "thompson-seedless-grapes": ["Thompson seedless grapes", "green grapes white background", "green grapes"],
    "nagpur-orange": ["mandarin orange fruit", "Nagpur orange", "orange fruit whole and cut"],
    "lemon": ["lemon whole and split", "fresh lemon fruit white background", "citrus lemon"],
    "papaya": ["papaya whole and cut", "papaya fruit slice", "Carica papaya fruit"],
    "pineapple": ["pineapple fruit white background", "fresh pineapple fruit", "Ananas comosus fruit"],
    "vitrified-tiles": ["vitrified tile floor", "polished porcelain floor tile", "ceramic floor tile marble"],
    "porcelain-tiles": ["porcelain tile texture", "porcelain floor tiles", "white porcelain tile"],
    "ceramic-wall-tiles": ["ceramic wall tile", "glazed ceramic tile wall", "subway wall tile white"],
    "glazed-vitrified-tiles": ["glazed vitrified tile", "calacatta porcelain tile", "marble porcelain slab"],
    "large-format-porcelain-slabs": ["large format porcelain slab", "porcelain slab kitchen", "marble porcelain slab"],
    "white-onion-powder": ["white onion powder bowl", "onion powder", "dehydrated onion powder", "white onion whole"],
    "pink-red-onion-powder": ["red onion on white", "red onion powder", "allium cepa red onion"],
    "dehydrated-white-onion-flakes": ["onion flakes", "dried onion flakes", "dehydrated onion", "white onion cut"],
    "dehydrated-red-onion-flakes": ["red onion chopped", "sliced red onion", "red onion pieces"],
    "garlic-powder": ["garlic powder penzeys", "garlic powder bowl", "allium sativum garlic powder", "garlic cloves"],
    "dehydrated-garlic-flakes": ["garlic flakes", "fried garlic flakes", "sliced garlic cloves", "garlic dried"],
    "garlic-granules": ["minced garlic", "garlic granules", "garlic cloves bowl"],
    "ginger-powder-saunth": ["ginger powder", "ground ginger", "zingiber officinale powder", "ginger root"],
    "dehydrated-ginger-flakes": ["dried ginger root", "ginger slices", "dried ginger", "ginger rhizome cut"],
    "moringa-leaf-powder": ["moringa powder", "moringa oleifera powder", "moringa leaf", "moringa oleifera leaves"],
    "moringa-seed-powder": ["moringa seeds", "dried moringa seeds", "moringa oleifera seeds"],
    "spinach-powder": ["spinach powder", "spinacia oleracea leaves", "fresh spinach leaves bowl", "spinach leaves"],
    "curry-leaf-powder": ["curry leaves powder", "murraya koenigii leaves", "curry leaves fresh"],
    "mint-leaf-powder": ["mint powder", "mentha leaves", "fresh mint leaves bowl", "dried mint leaves"],
    "coriander-leaf-powder": ["coriander powder", "cilantro leaves", "coriandrum sativum powder", "coriander seeds powder"],
    "fenugreek-leaf-powder": ["kasuri methi", "fenugreek leaves", "trigonella foenum-graecum leaves", "fenugreek powder"],
    "tomato-powder": ["tomato powder", "dehydrated tomato", "sun dried tomato powder", "ripe red tomatoes"],
    "beetroot-powder": ["beetroot powder", "beet powder", "beta vulgaris beetroot", "beetroots fresh"],
    "carrot-powder": ["carrot powder", "dehydrated carrot", "daucus carota", "fresh carrots bunch"],
    "green-chilli-powder": ["green chilli powder", "green chili pepper fresh", "green chillies bowl"],
    "potato-flakes": ["instant mashed potatoes", "potato flakes", "dehydrated potato flakes", "russet potatoes"],
    "pumpkin-powder": ["pumpkin powder", "pumpkin puree", "cucurbita pumpkin wedge", "fresh pumpkin slice"],
    "mango-powder-amchur": ["amchur powder", "amchoor", "dried mango slices", "green mango amchur"],
    "banana-powder": ["banana flour", "banana powder", "dried banana", "fresh ripe bananas"],
    "lemon-powder": ["dried lemon", "lemon powder", "black lime loomi", "dried lime powder"],
    "amla-powder": ["amla powder", "phyllanthus emblica fruit", "indian gooseberry amla", "amla fruit"],
    "aloe-vera-powder": ["aloe vera gel leaf", "aloe vera plant leaf cut", "aloe vera powder"],
    "hibiscus-powder": ["hibiscus tea calyces", "hibiscus sabdariffa dried", "hibiscus powder", "roselle flower"]
}

for slug, q_list in test_items.items():
    res = find_best_wm_image(q_list)
    if res:
        print(f"FOUND {slug:32} -> {res[0]} ({res[1]}x{res[2]})")
    else:
        print(f"NOT FOUND {slug:32}")
