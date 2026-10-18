import urllib.request
import urllib.parse
import json

def search_wikimedia(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&srlimit={limit}"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianCatalogBot/1.0 (contact@aurelianinternational.com)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = []
            for item in data.get('query', {}).get('search', []):
                title = item['title']
                results.append(title)
            return results
    except Exception as e:
        print("Error:", e)
        return []

def get_image_url(file_title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={urllib.parse.quote(file_title)}&prop=imageinfo&iiprop=url|size|mime"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianCatalogBot/1.0 (contact@aurelianinternational.com)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                infos = pdata.get('imageinfo', [])
                if infos:
                    return infos[0].get('url'), infos[0].get('width'), infos[0].get('height')
    except Exception as e:
        print("Error:", e)
    return None, 0, 0

print("--- Spices Search ---")
spice_files = search_wikimedia("filetype:bitmap Indian spices bowls", 12)
for f in spice_files:
    u, w, h = get_image_url(f)
    print(f, "->", w, "x", h, u)

print("\n--- Dehydrated Powders / Ground Spices / Herbal Powders Search ---")
powder_files = search_wikimedia("filetype:bitmap spice powder bowls spoon", 12)
for f in powder_files:
    u, w, h = get_image_url(f)
    print(f, "->", w, "x", h, u)

