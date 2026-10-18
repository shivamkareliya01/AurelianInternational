import json, re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract json part after `export const categories: Category[] = `
json_text = text.split('export const categories: Category[] =', 1)[1].strip()
# Remove trailing semicolon if any
if json_text.endswith(';'):
    json_text = json_text[:-1].strip()

categories = json.loads(json_text)
print(f"Total categories: {len(categories)}")
total_products = 0
for cat in categories:
    print(f"  Category: {cat['slug']} ({cat['name']}) -> {len(cat['products'])} products")
    total_products += len(cat['products'])
print(f"Total products: {total_products}")
