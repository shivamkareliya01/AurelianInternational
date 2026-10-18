import urllib.request
import urllib.parse
import json
import time

queries = [
    "assortment of vegetables",
    "various fresh vegetables",
    "colorful fresh vegetables market",
    "vegetable harvest basket"
]

results = []

for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianExportDev/1.0 (contact: admin@aurelianinternational.com)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for p in pages.values():
                info = p.get('imageinfo', [{}])[0]
                w = info.get('width', 0)
                h = info.get('height', 0)
                file_url = info.get('url', '')
                title = p.get('title', '')
                if w >= 1920 and h >= 1200 and file_url.lower().endswith(('.jpg', '.jpeg', '.png')):
                    desc = info.get('extmetadata', {}).get('ImageDescription', {}).get('value', '')
                    import re
                    desc = re.sub('<[^<]+?>', '', desc)[:100]
                    results.append({'title': title, 'w': w, 'h': h, 'url': file_url, 'desc': desc})
    except Exception as e:
        print(f"Error searching {q}: {e}")
    time.sleep(1.2)

# Also check specific known top quality files on commons
known_candidates = [
    "File:Vegetables_in_basket.jpg",
    "File:A_woven_basket_filled_with_an_assortment_of_colorful_vegetables.jpg",
    "File:Fresh_Vegetables_2.jpg",
    "File:Surtido_de_vegetales.jpg",
    "File:Assorted_vegetables_on_display.jpg",
    "File:Fresh_vegetables_stall_at_the_market.jpg",
    "File:Vegetables_display.jpg",
    "File:Vegetables_at_a_market.jpg",
    "File:Fresh_vegetables_for_sale.jpg",
    "File:Indian_vegetables_at_market.jpg",
    "File:Indian_vegetable_market.jpg"
]

for t in known_candidates:
    api = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
    req = urllib.request.Request(api, headers={'User-Agent': 'AurelianExportDev/1.0 (contact: admin@aurelianinternational.com)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for p in data.get('query', {}).get('pages', {}).values():
                info = p.get('imageinfo', [{}])[0]
                w = info.get('width', 0)
                h = info.get('height', 0)
                file_url = info.get('url', '')
                if w >= 1600 and file_url.lower().endswith(('.jpg', '.jpeg', '.png')):
                    desc = info.get('extmetadata', {}).get('ImageDescription', {}).get('value', '')
                    import re
                    desc = re.sub('<[^<]+?>', '', desc)[:100]
                    results.append({'title': t, 'w': w, 'h': h, 'url': file_url, 'desc': desc})
    except Exception as e:
        pass
    time.sleep(0.8)

# Print unique results
seen = set()
unique_results = []
for r in results:
    if r['title'] not in seen:
        seen.add(r['title'])
        unique_results.append(r)

print(f"Found {len(unique_results)} candidates:")
for r in unique_results:
    print(f"[{r['title']}] ({r['w']}x{r['h']}): {r['desc']}")
    print(f"  URL: {r['url']}")

with open('scratch/veg_candidates.json', 'w') as f:
    json.dump(unique_results, f, indent=2)
