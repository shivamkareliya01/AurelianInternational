import os
import re
from PIL import Image

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

slugs = re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", content)
print(f"Total products in catalog: {len(slugs)}")

suspicious = []
missing = []

for slug in slugs:
    p = f"public/products/{slug}.webp"
    if not os.path.exists(p):
        missing.append(slug)
        continue
    size = os.path.getsize(p)
    # Check if file size is small (~25-36KB) which typical placeholder navy cards are
    if size < 40 * 1024:
        suspicious.append((slug, size))

print(f"Missing images: {len(missing)}")
print(f"Suspicious (<40KB) placeholder cards: {len(suspicious)}")
for s, sz in suspicious:
    print(f"  {s:35}: {sz/1024:.1f} KB")
