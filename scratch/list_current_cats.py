import json, re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find each category slug and name and products
cat_matches = list(re.finditer(r'\{\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', content))
for cm in cat_matches:
    print(cm.group(1), '-->', cm.group(2))
