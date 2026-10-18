import os, json
from PIL import Image
import numpy as np

def dhash(image, hash_size=8):
    image = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = np.array(image)
    diff = pixels[:, 1:] > pixels[:, :-1]
    return diff.flatten()

def hamming_dist(h1, h2):
    return np.count_nonzero(h1 != h2)

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

arr = text.split('export const categories: Category[] =', 1)[1].split(';\n\nexport const allProducts')[0].strip()
categories = json.loads(arr)

all_prods = []
for c in categories:
    for p in c['products']:
        p['category_slug'] = c['slug']
        all_prods.append(p)

print(f"Total categories: {len(categories)}")
print(f"Total products: {len(all_prods)}")

missing = []
small = []
large = []
dark = []
hashes = {}
file_to_slugs = {}

for p in all_prods:
    img_rel = p['image'].lstrip('/')
    img_path = os.path.join('public', img_rel)
    
    file_to_slugs.setdefault(p['image'], []).append(p['slug'])
    
    if not os.path.exists(img_path):
        missing.append((p['category_slug'], p['slug'], img_path))
        continue
        
    sz_kb = os.path.getsize(img_path) / 1024
    if sz_kb > 300:
        large.append((p['slug'], sz_kb))
        
    try:
        with Image.open(img_path) as im:
            w, h = im.size
            if w < 1200:
                small.append((p['slug'], w, h))
            rgb = im.convert('RGB')
            arr_px = np.array(rgb)
            lum = np.mean(0.299 * arr_px[:, :, 0] + 0.587 * arr_px[:, :, 1] + 0.114 * arr_px[:, :, 2])
            if lum < 85:
                dark.append((p['slug'], lum))
            hashes[p['slug']] = dhash(im)
    except Exception as e:
        print(f"Error opening {img_path}: {e}")

shared_files = {k: v for k, v in file_to_slugs.items() if len(v) > 1}

near_dups = []
slug_list = list(hashes.keys())
for i in range(len(slug_list)):
    for j in range(i + 1, len(slug_list)):
        s1, s2 = slug_list[i], slug_list[j]
        d = hamming_dist(hashes[s1], hashes[s2])
        if d < 10:
            near_dups.append((s1, s2, d))

print(f"\n--- AUDIT SUMMARY ---")
print(f"1. Missing images: {len(missing)}")
for m in missing:
    print(f"   {m[0]:20} {m[1]:30} -> {m[2]}")

print(f"2. Shared image files across products: {len(shared_files)}")
for f, s_list in shared_files.items():
    print(f"   {f} used by: {s_list}")

print(f"3. Images < 1200px: {len(small)}")
for s in small:
    print(f"   {s[0]}: {s[1]}x{s[2]}")

print(f"4. Images > 300KB: {len(large)}")
for l in large:
    print(f"   {l[0]}: {l[1]:.1f} KB")

print(f"5. Dark images (lum < 85): {len(dark)}")
for d in dark:
    print(f"   {d[0]}: lum = {d[1]:.1f}")

print(f"6. Near-duplicate pairs (dHash < 10): {len(near_dups)}")
for nd in near_dups:
    print(f"   {nd[0]} <-> {nd[1]} (dist={nd[2]})")
