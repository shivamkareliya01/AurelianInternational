import urllib.request
import urllib.parse
import json
import re

queries = [
    "fruits dark table",
    "fruits composition dark",
    "fruits still life dark",
    "fresh fruits assortment",
    "fruits flat lay",
    "tropical fruits display",
    "colorful fresh fruits market"
]

candidates = []

for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
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
                    if not any(bad in title.lower() or bad in clean_desc.lower() for bad in ['drawing', 'diagram', 'icon', 'logo', 'map', 'painting', 'sketch', 'illustration']):
                        candidates.append({
                            'title': title,
                            'w': w,
                            'h': h,
                            'url': file_url,
                            'desc': clean_desc
                        })
    except Exception as e:
        print(f"Error on {q}: {e}")

# Also check specific fruit titles
fruit_titles = [
    "File:Front-view-fresh-ripe-fruits-composition-dark-table.jpg",
    "File:Front_view_fresh_fruits.jpg",
    "File:Fruits_composition_on_dark_background.jpg",
    "File:Assortment_of_fruits.jpg",
    "File:Fruit_stall_in_Barcelona_market.jpg",
    "File:Fruit_stall_in_La_Boqueria.jpg",
    "File:Fruit_display_La_Boqueria.jpg",
    "File:Exotic_fruit_stall.jpg",
    "File:Tropical_fruit_display.jpg"
]

for t in fruit_titles:
    api = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
    req = urllib.request.Request(api, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for page in data.get('query', {}).get('pages', {}).values():
                info = page.get('imageinfo', [{}])[0]
                w = info.get('width', 0)
                h = info.get('height', 0)
                file_url = info.get('url', '')
                if w >= 2000:
                    candidates.append({
                        'title': t,
                        'w': w,
                        'h': h,
                        'url': file_url,
                        'desc': 'Direct title match'
                    })
    except Exception:
        pass

seen = set()
unique = []
for c in candidates:
    if c['title'] not in seen:
        seen.add(c['title'])
        unique.append(c)

print(f"Total unique fruit candidates found: {len(unique)}")
for c in unique[:30]:
    print(f"[{c['title']}] ({c['w']}x{c['h']}): {c['desc']}")
    print(f"   URL: {c['url']}")

with open('scratch/fruit_candidates.json', 'w') as f:
    json.dump(unique, f, indent=2)
