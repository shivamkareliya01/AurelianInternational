import urllib.request
import urllib.parse
import json
import sys

headers = {'User-Agent': 'AurelianExportCurator/2.0 (curator@aurelianinternational.com)'}

def search_commons(query, limit=5):
    encoded = urllib.parse.quote(query)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={encoded}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = json.loads(r.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, p in pages.items():
                title = p.get('title', '')
                info = p.get('imageinfo', [{}])[0]
                url = info.get('url')
                w = info.get('width', 0)
                h = info.get('height', 0)
                mime = info.get('mime', '')
                if url and ('image/jpeg' in mime or 'image/png' in mime or 'image/webp' in mime):
                    results.append({'title': title, 'url': url, 'width': w, 'height': h})
            return results
    except Exception as e:
        print(f"Error searching for {query}: {e}")
        return []

if __name__ == '__main__':
    q = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "white onion"
    print(f"Searching Wikimedia Commons for: {q}")
    res = search_commons(q)
    for r in res:
        print(f"- {r['title']} ({r['width']}x{r['height']}): {r['url']}")
