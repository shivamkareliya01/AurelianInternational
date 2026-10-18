import json, re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect products under dehydrated-powders
match = re.search(r'\{\s*"slug":\s*"dehydrated-powders",.*?"products":\s*(\[.*?\])\s*\}\s*\];', content, re.DOTALL)
if match:
    products_raw = match.group(1)
    prods = json.loads(products_raw)
    print(f"Total dehydrated products before: {len(prods)}")
    flakes = []
    powders = []
    for p in prods:
        if 'flake' in p['slug'].lower() or 'flake' in p['name'].lower():
            flakes.append((p['slug'], p['name']))
        else:
            powders.append((p['slug'], p['name']))
    print(f"Flakes ({len(flakes)}):")
    for f in flakes:
        print("  -", f)
    print(f"Powders ({len(powders)}):")
    for p in powders:
        print("  -", p)
else:
    print("Could not find dehydrated-powders products block")
