import re

content = open('src/data/products.ts', 'r', encoding='utf-8').read()

cat_match = re.search(r'"slug":\s*"dehydrated-powders".*?"products":\s*\[(.*?)\]\s*\}\s*\];', content, re.DOTALL)
if cat_match:
    powders_block = cat_match.group(1)
    powders = re.findall(r'\{\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', powders_block)
    print(f"Total powders in dehydrated-powders: {len(powders)}")
    for i, (slug, name) in enumerate(powders, 1):
        print(f"{i}. slug: '{slug}', name: '{name}'")
else:
    print("Could not find dehydrated-powders category block")
