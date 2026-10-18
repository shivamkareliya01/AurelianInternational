import urllib.request, json

titles = 'Basmati|Turmeric|Garlic|Onion|Moringa_oleifera|Spinach|Curry_tree|Coriander|Fenugreek|Beetroot|Carrot|Chili_pepper|Pumpkin|Amchoor|Amla|Aloe_vera|Hibiscus|Papaya|Pineapple|Lemon'
url = f'https://en.wikipedia.org/w/api.php?action=query&titles={titles}&prop=pageimages&pithumbsize=1600&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'AurelianCatalogBot/1.0 (contact@aurelian.trade)'})
with urllib.request.urlopen(req) as r:
    data = json.loads(r.read().decode('utf-8'))
    for pid, p in data.get('query', {}).get('pages', {}).items():
        title = p.get('title')
        thumb = p.get('thumbnail', {})
        w = thumb.get('width')
        h = thumb.get('height')
        src = thumb.get('source')
        print(f"{title}: {w}x{h} -> {src}")
