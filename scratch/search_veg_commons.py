import urllib.request
import urllib.parse
import json
import re

search_terms = [
    "vegetables stall",
    "organic vegetables market",
    "vegetables harvest",
    "vegetables flat lay",
    "vegetables table",
    "fresh vegetables display"
]

candidates = []

for term in search_terms:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(term)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for page in data.get('query', {}).get('pages', {}).values():
                info = page.get('imageinfo', [{}])[0]
                w = info.get('width', 0)
                h = info.get('height', 0)
                file_url = info.get('url', '')
                title = page.get('title', '')
                if w >= 2500 and h >= 1800:
                    ext = info.get('extmetadata', {})
                    desc = ext.get('ImageDescription', {}).get('value', '')
                    clean_desc = re.sub(r'<[^<]+?>', '', desc)[:120]
                    # Filter out diagrams, drawings, non-photos
                    if not any(bad in title.lower() or bad in clean_desc.lower() for bad in ['drawing', 'diagram', 'icon', 'logo', 'map', 'painting']):
                        candidates.append({
                            'title': title,
                            'w': w,
                            'h': h,
                            'url': file_url,
                            'desc': clean_desc
                        })
    except Exception as e:
        print(f"Error on {term}: {e}")

print(f"Total candidates found: {len(candidates)}")
seen = set()
for c in candidates:
    if c['title'] not in seen:
        seen.add(c['title'])
        print(f"[{c['title']}] ({c['w']}x{c['h']}): {c['desc']}")
        print(f"   URL: {c['url']}")

with open('scratch/veg_search_results.json', 'w') as f:
    json.dump(candidates, f, indent=2)
