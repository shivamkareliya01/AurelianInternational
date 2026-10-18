import re

with open('scripts/curate_perfect_catalog.py', 'r', encoding='utf-8') as f:
    txt = f.read()

cats = re.findall(r'"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', txt)
print("Categories in curate_perfect_catalog.py:", len(cats))
for slug, name in cats:
    print(slug, name)
