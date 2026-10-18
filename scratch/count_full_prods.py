import re

with open('scripts/build_full_catalog_and_assets.py', 'r', encoding='utf-8') as f:
    txt = f.read()

# Let's count products per category
cats = re.split(r'\{\s*"slug":\s*"([^"]+)",\s*"name":', txt)
total = 0
for i in range(1, len(cats), 2):
    slug = cats[i]
    block = cats[i+1]
    prods = re.findall(r'"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"origin":', block)
    print(f'{slug}: {len(prods)} products')
    total += len(prods)
print("Total:", total)
