import urllib.request, json, urllib.parse

powders = [
    ("white-onion-powder", "white onion powder"),
    ("pink-red-onion-powder", "red onion powder"),
    ("dehydrated-white-onion-flakes", "white onion flakes"),
    ("dehydrated-red-onion-flakes", "red onion flakes"),
    ("garlic-powder", "garlic powder"),
    ("dehydrated-garlic-flakes", "garlic flakes"),
    ("garlic-granules", "garlic granules"),
    ("ginger-powder", "ginger powder"),
    ("dehydrated-ginger-flakes", "dried ginger root"),
    ("moringa-leaf-powder", "moringa leaf powder"),
    ("moringa-seed-powder", "moringa seeds"),
    ("spinach-powder", "spinach powder"),
    ("curry-leaf-powder", "curry leaves powder"),
    ("mint-leaf-powder", "mint leaves powder"),
    ("coriander-leaf-powder", "coriander powder"),
    ("fenugreek-leaf-powder", "fenugreek powder kasuri methi"),
    ("tomato-powder", "tomato powder"),
    ("beetroot-powder", "beetroot powder"),
    ("carrot-powder", "carrot powder"),
    ("green-chilli-powder", "green chilli powder"),
    ("potato-flakes", "potato flakes"),
    ("pumpkin-powder", "pumpkin powder"),
    ("mango-powder", "amchur powder"),
    ("banana-powder", "banana flour powder"),
    ("lemon-powder", "dried lemon powder"),
    ("amla-powder", "amla powder gooseberry"),
    ("aloe-vera-powder", "aloe vera powder"),
    ("hibiscus-powder", "hibiscus powder tea")
]

for slug, query in powders:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json&srlimit=2"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianCatalogBot/1.0 (contact@aurelian.trade)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            d = json.loads(r.read().decode('utf-8'))
            results = d.get('query', {}).get('search', [])
            titles = [item.get('title') for item in results]
            print(f"{slug}: found {len(results)} -> {titles}")
    except Exception as e:
        print(f"Error {slug}: {e}")
