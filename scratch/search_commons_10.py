import urllib.request, urllib.parse, json

headers = {'User-Agent': 'AurelianExportCurator/2.0 (curator@aurelianinternational.com)'}

def search_commons_files(query, limit=5):
    url = f'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            res = []
            for pid, p in pages.items():
                title = p.get('title', '')
                info = p.get('imageinfo', [{}])[0]
                if info.get('url') and info.get('mime', '').startswith('image/'):
                    res.append({'title': title, 'url': info.get('url'), 'w': info.get('width'), 'h': info.get('height')})
            return res
    except Exception as e:
        print('Error:', e)
        return []

queries = {
    'wheatgrass': 'Wheatgrass fresh Triticum',
    'pomegranate': 'Punica granatum pomegranate open arils',
    'rose': 'Rosa damascena rose petals fresh',
    'coconut': 'Cracked coconut halves fresh white',
    'purple_sweet_potato': 'Purple sweet potato sliced raw tuber',
    'ashwagandha': 'Withania somnifera ashwagandha roots powder',
    'shatavari': 'Asparagus racemosus shatavari roots',
    'jamun': 'Syzygium cumini jamun fruit',
    'kokum': 'Garcinia indica kokum fruit rinds',
    'bitter_gourd': 'Momordica charantia bitter gourd sliced'
}

for k, q in queries.items():
    res = search_commons_files(q, 3)
    print(f'=== {k} ({q}) ===')
    for r in res:
        print(f"  {r['title']}: {r['w']}x{r['h']} -> {r['url']}")
