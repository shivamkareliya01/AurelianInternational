import os, json, re
from PIL import Image
import numpy as np

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Parse the products array JSON
arr_text = text.split('export const categories: Category[] =', 1)[1]
arr_text = arr_text.split(';\n\nexport const allProducts', 1)[0].strip()
categories = json.loads(arr_text)

print(f"Loaded {len(categories)} categories")

all_prods = []
for c in categories:
    for p in c['products']:
        p['category_slug'] = c['slug']
        all_prods.append(p)

print(f"Total products: {len(all_prods)}")

missing = []
small = []
large = []
dark = []
images_map = {}

for p in all_prods:
    img_rel = p['image'].lstrip('/')
    img_path = os.path.join('public', img_rel)
    
    if not os.path.exists(img_path):
        missing.append((p['slug'], img_path))
        continue
    
    file_size_kb = os.path.getsize(img_path) / 1024
    if file_size_kb > 300:
        large.append((p['slug'], img_path, file_size_kb))
        
    try:
        with Image.open(img_path) as im:
            w, h = im.size
            if w < 1200:
                small.append((p['slug'], img_path, w, h))
            
            # calculate mean luminance
            # luminance L = 0.299 R + 0.587 G + 0.114 B
            rgb = im.convert('RGB')
            arr = np.array(rgb)
            lum = np.mean(0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2])
            if lum < 85:
                dark.append((p['slug'], img_path, lum))
                
            images_map[p['slug']] = {
                'path': img_path,
                'size': (w, h),
                'kb': file_size_kb,
                'lum': lum,
                'alt': p.get('alt', '')
            }
    except Exception as e:
        print(f"Error opening {img_path}: {e}")

print(f"\nMissing images ({len(missing)}):")
for m in missing[:10]:
    print(" ", m)

print(f"\nSmall (<1200px) images ({len(small)}):")
for s in small[:10]:
    print(" ", s)

print(f"\nLarge (>300KB) images ({len(large)}):")
for l in large[:10]:
    print(" ", l)

print(f"\nDark (<85 lum) images ({len(dark)}):")
for d in dark[:10]:
    print(" ", d)
