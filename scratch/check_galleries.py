import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('slug: "dehydrated-powders"')
chunk = text[start:]

galleries = re.findall(r'slug:\s*"([^"]+)",[\s\S]*?gallery:\s*\[([\s\S]*?)\]', chunk)
print(f'Found {len(galleries)} products in dehydrated-powders')
for slug, gal in galleries:
    items = [x.strip() for x in gal.split(',') if x.strip()]
    print(f'{slug}: {len(items)} gallery items')
