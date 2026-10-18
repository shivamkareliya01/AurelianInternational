import json, re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const categories: Category\[\] = (\[[\s\S]*?\n\]);', text)
cats = json.loads(m.group(1))
powders_cat = next(c for c in cats if c['slug'] == 'dehydrated-powders')
data_slugs = [p['slug'] for p in powders_cat['products']]

with open('generate_powder_images.py', 'r', encoding='utf-8') as f:
    gen_text = f.read()

matches = re.findall(r'\("([a-z0-9\-]+)"', gen_text)
script_slugs = list(dict.fromkeys(matches))

print(f"Data slugs: {len(data_slugs)}, Script slugs: {len(script_slugs)}")
diff1 = set(data_slugs) - set(script_slugs)
diff2 = set(script_slugs) - set(data_slugs)
print('In data but not in script:', diff1)
print('In script but not in data:', diff2)

for ds in data_slugs:
    if ds not in script_slugs:
        # find closest match in script_slugs
        close = [s for s in script_slugs if s in ds or ds in s or s.split('-')[0] in ds]
        print(f"Data: {ds} -> Possible script: {close}")
