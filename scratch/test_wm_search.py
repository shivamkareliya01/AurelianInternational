import urllib.request, json, urllib.parse

# Test different search formats on Wikimedia Commons
queries = ["grapes", "citrus lemon", "papaya fruit", "pineapple fruit", "garlic powder", "turmeric powder", "red onion"]
for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&srnamespace=6&format=json&srlimit=3"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianCatalogBot/1.0 (contact@aurelian.trade)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            d = json.loads(r.read().decode('utf-8'))
            results = d.get('query', {}).get('search', [])
            print(f"Query '{q}' found {len(results)} files:")
            for item in results:
                print("  ", item.get('title'))
    except Exception as e:
        print(f"Error {q}:", e)
