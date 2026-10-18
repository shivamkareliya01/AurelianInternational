import urllib.request, json, urllib.parse

def search_wikimedia(query, limit=5):
    encoded_query = urllib.parse.quote(query)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch={encoded_query}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|extmetadata"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianExportCatalogBot/1.0 (contact@aurelian.trade)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, page in pages.items():
                title = page.get('title', '')
                info = page.get('imageinfo', [{}])[0]
                img_url = info.get('url', '')
                w = info.get('width', 0)
                h = info.get('height', 0)
                # Filter out videos, audio, pdf, or tiny icons
                if img_url.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')) and w >= 800:
                    results.append({'title': title, 'url': img_url, 'width': w, 'height': h})
            return results
    except Exception as e:
        print(f"Error for query '{query}': {e}")
        return []

test_queries = [
    "Thompson seedless grapes",
    "Nagpur orange fruit",
    "fresh lemon fruit white background",
    "fresh papaya whole cut",
    "fresh pineapple fruit",
    "marble tile floor porcelain",
    "garlic powder bowl",
    "onion flakes",
    "moringa oleifera leaves powder",
    "spinach leaves powder",
    "beetroot powder",
    "amla fruit indian gooseberry"
]

for q in test_queries:
    res = search_wikimedia(q, limit=3)
    print(f"Query: '{q}' -> {len(res)} results")
    if res:
        print(f"  Best: {res[0]['title']} ({res[0]['width']}x{res[0]['height']})")
        print(f"  URL: {res[0]['url']}")
