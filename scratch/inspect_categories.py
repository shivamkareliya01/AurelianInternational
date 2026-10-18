import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

cats = ['agriculture', 'fresh-vegetables', 'fresh-fruits', 'spices', 'natural-stones', 'ceramic-tiles', 'dehydrated-powders']
for cat in cats:
    pattern = rf'slug:\s*"{cat}",[\s\S]*?image:\s*"([^"]+)"'
    m = re.search(pattern, text)
    if m:
        print(f"{cat}: {m.group(1)}")
    else:
        print(f"{cat}: not found")
