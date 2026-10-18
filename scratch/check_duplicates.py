import os, json
from PIL import Image
import numpy as np

def dhash(image, hash_size=8):
    image = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = np.array(image)
    diff = pixels[:, 1:] > pixels[:, :-1]
    return diff.flatten()

def hamming_distance(h1, h2):
    return np.count_nonzero(h1 != h2)

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

arr = text.split('export const categories: Category[] =', 1)[1].split(';\n\nexport const allProducts')[0].strip()
cats = json.loads(arr)
dehyd = next(c for c in cats if c['slug'] == 'dehydrated-powders')

hashes = {}
for p in dehyd['products']:
    rel = p['image'].lstrip('/')
    p_path = os.path.join('public', rel)
    if os.path.exists(p_path):
        with Image.open(p_path) as im:
            hashes[p['slug']] = dhash(im)

print("Checking pairwise dHash distance (threshold < 10 is near duplicate):")
near_dups = []
keys = list(hashes.keys())
for i in range(len(keys)):
    for j in range(i + 1, len(keys)):
        k1, k2 = keys[i], keys[j]
        dist = hamming_distance(hashes[k1], hashes[k2])
        if dist < 12:
            near_dups.append((k1, k2, dist))
            print(f"  NEAR DUPLICATE: {k1} <-> {k2} (distance = {dist})")

print(f"\nTotal near-duplicate pairs found: {len(near_dups)}")
