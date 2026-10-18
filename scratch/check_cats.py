import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's see category definitions
cat_matches = re.finditer(r'{\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"headline":\s*"([^"]+)"', text)
print("Categories in src/data/products.ts:")
for m in cat_matches:
    slug, name, headline = m.groups()
    print(f"  slug: {slug:25} | name: {name:25} | headline: {headline}")
