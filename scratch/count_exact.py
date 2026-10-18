import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's count categories and products
cats = re.findall(r'"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"headline":', content)
print('Categories found:', len(cats))
for slug, name in cats:
    print('Category:', slug, name)

prod_matches = re.findall(r'"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"origin":', content)
print('Total products found:', len(prod_matches))
