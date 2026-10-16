import json
import re
import os
from PIL import Image
import numpy as np

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'export const categories:\s*Category\[\]\s*=\s*(\[.*?\]);\s*export const allProducts', content, re.DOTALL)
if not m:
    print("Could not parse categories")
    exit(1)

cats = json.loads(m.group(1))

fallbacks = []
photos = []

for c in cats:
    for p in c['products']:
        slug = p['slug']
        img_path = f"public/products/{slug}.webp"
        if not os.path.exists(img_path):
            print(f"MISSING: {img_path}")
            continue
        
        im = Image.open(img_path)
        arr = np.array(im.convert('RGB'))
        w, h = im.size
        # Fallback cards have predominantly navy colors: R < 30, G < 40, B < 70 on corners
        corners = [arr[10, 10], arr[10, w-10], arr[h-10, 10], arr[h-10, w-10]]
        avg_corner = np.mean(corners, axis=0)
        
        # Check if corner is deep navy (R < 35, G < 45, B < 80) and center is also dark
        center = arr[h//2, w//2]
        is_fallback = (avg_corner[0] < 35 and avg_corner[1] < 45 and avg_corner[2] < 80 and
                       center[0] < 45 and center[1] < 55 and center[2] < 90)
        
        size_kb = os.path.getsize(img_path) / 1024
        
        if is_fallback:
            fallbacks.append((c['slug'], slug, p['name'], f"{w}x{h}", f"{size_kb:.1f}KB"))
        else:
            photos.append((c['slug'], slug, p['name'], f"{w}x{h}", f"{size_kb:.1f}KB"))

print(f"=== AUDIT RESULTS ===")
print(f"Total Products: {len(fallbacks) + len(photos)}")
print(f"Real Photos: {len(photos)}")
print(f"Navy Fallback Cards: {len(fallbacks)}")

print("\n--- NAVY FALLBACK CARDS (NEED REAL PHOTOS) ---")
for cat, slug, name, dim, sz in fallbacks:
    print(f"[{cat}] {name} ({slug}) - {dim}, {sz}")

print("\n--- EXISTING REAL PHOTOS ---")
for cat, slug, name, dim, sz in photos:
    print(f"[{cat}] {name} ({slug}) - {dim}, {sz}")
