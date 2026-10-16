import os
import json
import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'export const categories:\s*Category\[\]\s*=\s*(\[.*?\]);\s*export const allProducts', content, re.DOTALL)
cats = json.loads(m.group(1))

missing_main = []
missing_g2 = []
missing_g3 = []

for c in cats:
    for p in c['products']:
        slug = p['slug']
        if not os.path.exists(f"public/products/{slug}.webp"):
            missing_main.append(slug)
        if not os.path.exists(f"public/products/{slug}-2.webp"):
            missing_g2.append(slug)
        if not os.path.exists(f"public/products/{slug}-3.webp"):
            missing_g3.append(slug)

print(f"Total products: {sum(len(c['products']) for c in cats)}")
print(f"Missing main: {len(missing_main)}")
print(f"Missing gallery-2: {len(missing_g2)}")
print(f"Missing gallery-3: {len(missing_g3)}")
