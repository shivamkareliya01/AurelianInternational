import os, re
from PIL import Image, ImageStat

with open('src/data/powderColors.ts', encoding='utf-8') as f:
    text = f.read()

slugs = re.findall(r'"([a-z0-9\-]+)":\s*\{', text)
print(f"Total slugs in powderColors.ts: {len(slugs)}")

missing = []
total = 0
too_dark = []
too_large = []

for s in slugs:
    for suffix in ['', '-ingredient', '-2', '-3']:
        total += 1
        fpath = f'public/products/{s}{suffix}.webp'
        if not os.path.exists(fpath):
            missing.append(fpath)
        else:
            sz_kb = os.path.getsize(fpath) / 1024
            if sz_kb > 300:
                too_large.append((fpath, sz_kb))
            im = Image.open(fpath).convert('L')
            lum = ImageStat.Stat(im).mean[0]
            if lum < 98: # Check if brightness is below ~100
                too_dark.append((fpath, lum))

print(f"Total checked: {total}")
print(f"Missing: {len(missing)}")
if missing:
    print("Missing files:", missing)

print(f"Files > 300 KB: {len(too_large)}")
if too_large:
    print("Too large:", too_large)

print(f"Files with low lum: {len(too_dark)}")
if too_dark:
    print("Low lum files:", too_dark)
