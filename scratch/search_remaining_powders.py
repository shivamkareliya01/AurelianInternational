import urllib.request
import urllib.parse
import json
import re

queries = {
    'mint-leaf-powder': ['mint powder', 'dried mint leaves', 'mentha powder'],
    'coriander-leaf-powder': ['coriander powder', 'cilantro powder', 'dried coriander leaves'],
    'kasuri-methi-powder': ['kasuri methi', 'fenugreek powder', 'methi powder'],
    'tomato-powder': ['tomato powder', 'dried tomato powder', 'powdered tomato'],
    'beetroot-powder': ['beetroot powder', 'beet powder', 'beetroot in bowl'],
    'carrot-powder': ['carrot powder', 'powdered carrot', 'dried carrot'],
    'green-chilli-powder': ['green chilli powder', 'green chili powder', 'green pepper powder'],
    'potato-flakes': ['potato flakes', 'mashed potato flakes', 'dehydrated potato'],
    'pumpkin-powder': ['pumpkin powder', 'squash powder', 'dried pumpkin'],
    'mango-powder-amchur': ['amchur', 'amchoor', 'mango powder'],
    'banana-powder': ['banana powder', 'plantain powder', 'green banana powder'],
    'lemon-powder': ['lemon powder', 'dried lemon powder', 'citrus powder'],
    'amla-powder': ['amla powder', 'indian gooseberry powder', 'phyllanthus emblica powder'],
    'aloe-vera-powder': ['aloe vera powder', 'aloe powder', 'aloe vera extract'],
    'hibiscus-powder': ['hibiscus powder', 'hibiscus sabdariffa powder', 'dried hibiscus flower powder'],
    'category-dehydrated-powders': ['spices powder bowls', 'colorful spices in bowls', 'spice powders wooden bowls', 'herbal powders']
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
results = {}

for slug, terms in queries.items():
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
                    if w >= 1200 and h >= 900 and url_str:
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
        except Exception as e:
            pass

print("Search complete. Matches per slug:")
for slug, matches in results.items():
    print(f"  {slug:30}: {len(matches)} matches")

with open('scratch/remaining_powder_matches.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
