import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find all objects with slug, name, image
pattern = r'\{\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",.*?image":\s*"([^"]+)"'
products = re.findall(pattern, text, re.DOTALL)
print(f"Total products found: {len(products)}")
for slug, name, img in products:
    print(f"{slug} | {name} | {img}")
