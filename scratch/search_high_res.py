import urllib.request, urllib.parse, json

def search_wiki(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianExportAuditor/1.0 (contact@aurelian.com)'})
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=10).read())
        pages = data.get('query', {}).get('pages', {})
        results = []
        for pid, p in pages.items():
            info = p.get('imageinfo', [{}])[0]
            mime = info.get('mime', '')
            if 'image' in mime and info.get('width', 0) >= 1200:
                results.append((info.get('width'), info.get('height'), info.get('url')))
        return results
    except Exception as e:
        print('Error:', e)
        return []

print("=== WHITE ONIONS ===")
for r in search_wiki("white onion bulb cut"):
    print(r)

print("=== FENNEL SEEDS ===")
for r in search_wiki("fennel seeds dried spice"):
    print(r)
