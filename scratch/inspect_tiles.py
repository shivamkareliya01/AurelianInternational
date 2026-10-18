import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

arr = text.split('export const categories: Category[] =', 1)[1].split(';\n\nexport const allProducts')[0].strip()
cats = json.loads(arr)
tiles = next((c for c in cats if c['slug'] == 'ceramic-tiles'), None)
if tiles:
    print(f"Tiles products ({len(tiles['products'])}):")
    for p in tiles['products']:
        print(f"  {p['slug']:30} {p['image']}")
