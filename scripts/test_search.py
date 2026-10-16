import urllib.request
import urllib.parse
import json

queries = [
    ('groundnut-peanut-kernels', 'peanuts kernels raw in bowl'),
    ('sesame-seeds', 'white sesame seeds in bowl'),
    ('brinjal-eggplant', 'eggplant aubergine fruit fresh'),
    ('makrana-white-marble', 'white marble slab texture'),
    ('black-galaxy-granite', 'granite slab texture')
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for slug, q in queries:
    search_term = q + ' filetype:bitmap'
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(search_term)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|mime|dimensions&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f'=== {slug} ===')
            for pid, p in pages.items():
                title = p.get('title', '')
                info = p.get('imageinfo', [{}])[0]
                if info.get('mime', '').startswith('image/'):
                    print('  ', title, info.get('width'), 'x', info.get('height'), info.get('url'))
    except Exception as e:
        print(f'Error for {slug}: {e}')
