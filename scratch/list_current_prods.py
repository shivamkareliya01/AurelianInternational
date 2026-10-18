import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    txt = f.read()

cats = re.split(r'\{\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"headline":\s*"([^"]+)",\s*"blurb":\s*"([^"]+)",\s*"image":\s*"([^"]+)",\s*"products":\s*\[', txt)

print(f"Number of categories: {(len(cats)-1)//5}")
for i in range(1, len(cats), 5):
    c_slug = cats[i]
    c_name = cats[i+1]
    prods = re.findall(r'"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', cats[i+4])
    print(f"\nCategory: {c_slug} ({c_name}) - {len(prods)} products:")
    for ps, pn in prods:
        print(f"  - {ps} ({pn})")
