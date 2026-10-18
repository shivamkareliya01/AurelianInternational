import os, re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

slugs = ['nashik-red-onion', 'white-onion', 'potato', 'tomato', 'garlic', 'ginger', 'green-chilli', 'okra-lady-finger', 'brinjal-eggplant', 'cauliflower', 'cabbage', 'carrot', 'green-peas', 'drumstick-moringa']

print("Checking vegetable product files in public/products/:")
for s in slugs:
    for suffix in ['', '-2', '-3']:
        filename = f"{s}{suffix}.webp"
        path = os.path.join('public', 'products', filename)
        exists = os.path.exists(path)
        sz = os.path.getsize(path) if exists else 0
        print(f"  {filename:30}: exists={exists} ({sz} bytes)")
