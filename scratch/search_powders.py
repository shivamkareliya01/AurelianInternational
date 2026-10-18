import urllib.request
import urllib.parse
import json

searches = {
    'green-chilli-powder': ['green chili powder', 'green chilli powder', 'jalapeno powder'],
    'pumpkin-powder': ['pumpkin powder', 'squash powder', 'pumpkin flour'],
    'mango-powder-amchur': ['amchoor', 'amchur', 'dry mango powder', 'mango powder'],
    'banana-powder': ['banana powder', 'banana flour', 'plantain flour'],
    'lemon-powder': ['lemon powder', 'citrus powder', 'dried lemon powder'],
    'amla-powder': ['amla powder', 'amalaki powder', 'gooseberry powder', 'phyllanthus emblica powder'],
    'aloe-vera-powder': ['aloe vera powder', 'aloe powder'],
    'hibiscus-powder': ['hibiscus powder', 'hibiscus flower powder', 'roselle powder']
}

for slug, queries in searches.items():
    print(f'=== {slug} ===')
    for q in queries:
        url = f'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&srnamespace=6&format=json'
        req = urllib.request.Request(url, headers={'User-Agent': 'AurelianBot/1.0 (contact@aurelianinternational.com)'})
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                res = json.loads(r.read().decode('utf-8'))
                titles = [x['title'] for x in res.get('query', {}).get('search', [])[:5]]
                if titles:
                    print(f'  Query "{q}": {titles}')
        except Exception as e:
            print(f'  Query "{q}" error: {e}')
