import json
import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'export const categories:\s*Category\[\]\s*=\s*(\[.*?\]);\s*export const allProducts', content, re.DOTALL)
if m:
    cats = json.loads(m.group(1))
    print(f"Total categories: {len(cats)}")
    total_prods = 0
    for c in cats:
        print(f"\nCategory: {c['slug']} - {c['name']} ({len(c['products'])} products)")
        total_prods += len(c['products'])
        for p in c['products']:
            print(f"  - [{p['slug']}] {p['name']} -> {p.get('image', '')}")
    print(f"\nTotal products across all categories: {total_prods}")
else:
    print("Could not parse categories JSON")
