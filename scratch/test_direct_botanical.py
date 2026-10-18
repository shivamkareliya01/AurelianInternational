import urllib.request, json, urllib.parse

titles = [
    "File:Cut Aloe Vera Leaf.jpg",
    "File:Emblica officinalis fruits.JPG",
    "File:Beetroots in a basket.jpg",
    "File:Organic Carrots (Unsplash).jpg",
    "File:Cucurbita maxima 02 - Orange.jpg",
    "File:Tomato je.jpg",
    "File:Conjoined green chili pepper.jpg",
    "File:Fresh mint leaves.jpg",
    "File:Hibiscus tea.jpg"
]

url = "https://commons.wikimedia.org/w/api.php?action=query&titles=" + '|'.join(urllib.parse.quote(t) for t in titles) + "&prop=imageinfo&iiprop=url|size&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'AurelianExportCatalogBot/1.0 (contact@aurelian.trade)'})
with urllib.request.urlopen(req) as r:
    d = json.loads(r.read().decode('utf-8'))
    pages = d.get('query', {}).get('pages', {})
    for pid, p in pages.items():
        title = p.get('title')
        info = p.get('imageinfo', [{}])[0]
        print(f"{title}: {info.get('width')}x{info.get('height')} -> {info.get('url')}")
