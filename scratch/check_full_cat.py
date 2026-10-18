import re

with open('scripts/build_full_catalog_and_assets.py', 'r', encoding='utf-8') as f:
    txt = f.read()

cats = re.findall(r'"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', txt)
print('Found:', len(cats))
for s, n in cats:
    print(s, n)
