import urllib.request
import urllib.parse
import json
import sys

headers = {'User-Agent': 'AurelianTextureExplorer/1.0 (info@aurelianinternational.com)'}

def list_cat_files(category_name, limit=20):
    cat_title = f"Category:{category_name}" if not category_name.startswith("Category:") else category_name
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle={urllib.parse.quote(cat_title)}&cmtype=file&cmlimit={limit}&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=12) as r:
            data = json.loads(r.read().decode('utf-8'))
            members = data.get('query', {}).get('categorymembers', [])
            return [m['title'] for m in members]
    except Exception as e:
        print(f"Error {category_name}: {e}")
        return []

if __name__ == '__main__':
    cat = sys.argv[1] if len(sys.argv) > 1 else "Marble textures"
    files = list_cat_files(cat, 30)
    print(f"Files in {cat}: {len(files)}")
    for f in files:
        print(f"  {f}")
