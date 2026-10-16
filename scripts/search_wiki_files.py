import urllib.request
import urllib.parse
import json
import sys

headers = {'User-Agent': 'AurelianStoneCurator/1.0 (admin@aurelianinternational.com)'}

def search_files(term, n=5):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(term)}&gsrnamespace=6&gsrlimit={n}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=12) as r:
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
                if url and ('image/jpeg' in mime or 'image/png' in mime) and w >= 800 and h >= 600:
                    results.append({'title': title, 'url': url, 'w': w, 'h': h})
            return results
    except Exception as e:
        return []

if __name__ == '__main__':
    term = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Kashmir White Granite"
    res = search_files(term)
    print(f"Results for '{term}': {len(res)}")
    for r in res:
        safe_title = r['title'].encode('ascii', errors='replace').decode('ascii')
        print(f"  {safe_title} ({r['w']}x{r['h']}) -> {r['url']}")
