import json, re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

slugs_to_remove = {
    'thompson-seedless-grapes',
    'nagpur-orange',
    'lemon',
    'papaya',
    'pineapple'
}

# Find fresh-fruits
ff_marker = '"slug": "fresh-fruits"'
ff_idx = content.find(ff_marker)
spices_marker = '"slug": "spices"'
spices_idx = content.find(spices_marker)

# In fresh-fruits category, find products array
prod_start = content.find('"products": [', ff_idx) + len('"products": [')
# Find the end of products array for fresh-fruits (the closing `]` before `"slug": "spices"`)
prod_end = content.rfind('    ]', ff_idx, spices_idx)

print("prod_start:", prod_start, "prod_end:", prod_end)

products_str = '[' + content[prod_start:prod_end].strip() + ']'
products = json.loads(products_str)
print("Fresh fruits count before:", len(products))
filtered_fruits = [p for p in products if p['slug'] not in slugs_to_remove]
print("Fresh fruits count after:", len(filtered_fruits))
for p in filtered_fruits:
    print("  Keep fruit:", p['slug'], "-->", p['name'])

formatted_fruits = json.dumps(filtered_fruits, indent=6, ensure_ascii=False)
# Strip outer [ and ]
formatted_inner = formatted_fruits[formatted_fruits.find('['):]

new_content = content[:content.find('"products": [', ff_idx) + len('"products": ')] + formatted_inner + content[prod_end + len('    ]'):]

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully updated fresh-fruits in src/data/products.ts!")
