import subprocess, re

out = subprocess.check_output(['git', 'show', 'HEAD:src/data/products.ts'], text=True, encoding='utf-8')

cats = re.findall(r'slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*headline:', out)
print("Categories in git HEAD:", len(cats), cats)

# Find all categories and their products
cat_sections = re.findall(r'slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",.*?products:\s*\[(.*?)\]\s*\},?\s*\{?', out, re.DOTALL)
print("Cat sections:", len(cat_sections))
for cslug, cname, ptext in cat_sections:
    ps = re.findall(r'slug:\s*"([^"]+)"', ptext)
    print(f"  {cslug} ({cname}): {len(ps)} products -> {ps[:4]}...")
