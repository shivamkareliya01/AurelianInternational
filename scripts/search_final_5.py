import urllib.request
import urllib.parse
import json
import time

headers = {'User-Agent': 'AurelianCatalog/1.0 (contact@aurelianinternational.com)'}

queries = {
    'green-chilli-powder': 'green chili peppers isolated white',
    'banana-powder': 'bananas white background',
    'lemon-powder': 'lemon whole and sliced',
    'amla-powder': 'Phyllanthus emblica fruit',
    'aloe-vera-powder': 'Aloe vera sliced leaf'
}

for slug, query in queries.items():
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = data.get('query', {}).get('search', [])
            print(f"=== {slug} ({query}) ===")
            for r in results[:3]:
                print(f"  {r['title']}")
    except Exception as e:
        print(f"Error {slug}: {e}")
    time.sleep(1)
