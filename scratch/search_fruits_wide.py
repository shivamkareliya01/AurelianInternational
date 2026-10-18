import urllib.request
import urllib.parse
import json
import re

queries = [
    "fruits in market stall",
    "tropical fruit display market",
    "exotic fruit display",
    "fresh fruit market display",
    "assorted fruits on table",
    "citrus fruits sliced"
]

results = []
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for p in data.get('query', {}).get('pages', {}).values():
                info = p.get('imageinfo', [{}])[0]
                w = info.get('width', 0)
                h = info.get('height', 0)
                url_str = info.get('url', '')
                title = p.get('title', '')
                if w >= 2500 and h >= 1800 and url_str:
                    desc = info.get('extmetadata', {}).get('ImageDescription', {}).get('value', '')
                    clean_desc = re.sub(r'<[^<]+?>', '', desc)[:120]
                    if not any(bad in title.lower() or bad in clean_desc.lower() for bad in ['painting', 'drawing', 'diagram', 'museum', 'portrait', 'person', 'woman', 'child', 'recipe', 'textbook']):
                        results.append({
                            'query': q,
                            'title': title,
                            'w': w,
                            'h': h,
                            'url': url_str,
                            'desc': clean_desc
                        })
    except Exception as e:
        print(f"Error {q}: {e}")

seen = set()
unique = []
for r in results:
    if r['title'] not in seen:
        seen.add(r['title'])
        unique.append(r)

print(f"Total candidates: {len(unique)}")
with open('scratch/fruits_search_4.json', 'w') as f:
    json.dump(unique, f, indent=2)

for i, r in enumerate(unique):
    print(f"{i:2d}: [{r['title']}] ({r['w']}x{r['h']}) - {r['desc'][:70]}")
