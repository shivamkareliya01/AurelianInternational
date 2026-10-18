import urllib.request, json, urllib.parse

titles = ['File:Lemon - whole and split.jpg', 'File:Red Onion on White.JPG', 'File:Ginger powder 2.jpg', 'File:Moringa seeds.jpg']
url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + '|'.join(urllib.parse.quote(t) for t in titles) + '&prop=imageinfo&iiprop=url|size|extmetadata&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'AurelianCatalogBot/1.0'})
with urllib.request.urlopen(req) as r:
    data = json.loads(r.read().decode('utf-8'))
    for pid, p in data.get('query', {}).get('pages', {}).items():
        title = p.get('title')
        info = p.get('imageinfo', [{}])[0]
        w = info.get('width')
        h = info.get('height')
        u = info.get('url')
        print(f"{title}: {w}x{h} -> {u}")
