import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# Let's check Category:Featured pictures of fruits or Category:Fruit displays or Category:Fruits in still life
categories = [
    "Category:Fruit displays",
    "Category:Fruits in still life",
    "Category:Assorted fruits",
    "Category:Tropical fruits"
]

results = []

for cat in categories:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle={urllib.parse.quote(cat)}&gcmtype=file&gcmlimit=25&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
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
                    results.append({
                        'category': cat,
                        'title': title,
                        'w': w,
                        'h': h,
                        'url': url_str
                    })
    except Exception as e:
        print(f"Error {cat}: {e}")

print(f"Found {len(results)} category members:")
for r in results:
    print(f"[{r['category']}] {r['title']} ({r['w']}x{r['h']})")
    print(f"  URL: {r['url']}")

with open('scratch/category_fruit_results.json', 'w') as f:
    json.dump(results, f, indent=2)
