import re

with open('scripts/curate_perfect_catalog.py', 'r', encoding='utf-8') as f:
    text = f.read()

# find all (slug, image)
matches = re.findall(r'"slug":\s*"([^"]+)",.*?"name":\s*"([^"]+)",.*?"image":\s*"([^"]+)"', text, re.DOTALL)
print(f"Total entries in curate_perfect_catalog.py: {len(matches)}")
for slug, name, img in matches[:25]:
    print(f"  {slug:28} {name:28} -> {img[:60]}")
