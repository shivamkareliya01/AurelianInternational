import json, re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# count categories and products
# Let's see all occurrences of export const categories: Category[] = [...]
# Or how categories are exported
lines = text.split('\n')
for i, line in enumerate(lines[:50]):
    print(f"{i+1}: {line}")

# find all objects with "slug" and "products"
categories = re.findall(r'slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', text)
print(f"\nTotal categories: {len(categories)}")
for c in categories:
    print(" ", c)

# Let's count all products
products = re.findall(r'{\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"origin":', text)
print(f"\nTotal products matching origin: {len(products)}")
