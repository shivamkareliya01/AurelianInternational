import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/fruits_search_4.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

for i, it in enumerate(items):
    t = it.get('title', '')
    w = it.get('w', 0)
    h = it.get('h', 0)
    q = it.get('query', '')
    print(f"{i:2d} [{q:25}]: {t} ({w}x{h})")
