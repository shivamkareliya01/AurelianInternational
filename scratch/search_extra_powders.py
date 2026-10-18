import urllib.request
import urllib.parse
import json
import re

extra_queries = {
    'lemon-powder': ['lemon dried', 'lemon zest powder', 'citrus powder', 'dried lemon slices'],
    'amla-powder': ['amla fruit', 'indian gooseberry', 'amla dried', 'gooseberry powder'],
    'aloe-vera-powder': ['aloe vera gel', 'aloe vera plant', 'aloe vera slice', 'aloe vera extract'],
    'hibiscus-powder': ['hibiscus tea dried', 'hibiscus flower dried', 'hibiscus sabdariffa', 'karkadeh'],
    'category-dehydrated-powders': ['spices powder', 'indian spices bowls', 'assorted spices', 'curry powder bowls']
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
results = {}

for slug, terms in extra_queries.items():
    results[slug] = []
    for term in terms:
        url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(term)}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
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
                    if w >= 1600 and h >= 1200 and url_str:
                        desc = info.get('extmetadata', {}).get('ImageDescription', {}).get('value', '')
                        clean_desc = re.sub(r'<[^<]+?>', '', desc)[:100]
                        results[slug].append({
                            'term': term,
                            'title': title,
                            'w': w,
                            'h': h,
                            'url': url_str,
                            'desc': clean_desc
                        })
        except Exception:
            pass

print("Extra search complete:")
for slug, matches in results.items():
    print(f"  {slug:30}: {len(matches)} matches")

with open('scratch/extra_powder_matches.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
