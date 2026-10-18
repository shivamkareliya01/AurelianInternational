import os, re
from PIL import Image, ImageStat

with open('src/data/powderColors.ts', 'r', encoding='utf-8') as f:
    text = f.read()

slugs = list(re.findall(r'"([a-z0-9-]+)":\s*\{', text))
print(f"Checking {len(slugs)} slugs...")
suffixes = ['', '-ingredient', '-2', '-3']
missing = []
low_bright = []
too_large = []

for s in slugs:
    for suf in suffixes:
        fn = f"public/products/{s}{suf}.webp"
        if not os.path.exists(fn):
            missing.append(fn)
        else:
            try:
                sz = os.path.getsize(fn) / 1024
                if sz > 300:
                    too_large.append((fn, sz))
                with Image.open(fn) as im:
                    lum = ImageStat.Stat(im.convert('L')).mean[0]
                    if lum < 100:
                        low_bright.append((fn, lum))
            except Exception as e:
                print(f"Error {fn}: {e}")

print(f"Total missing: {len(missing)}")
for m in missing:
    print(f"  Missing: {m}")

print(f"Total >300KB: {len(too_large)}")
for f, sz in too_large:
    print(f"  >300KB: {f} ({sz:.1f} KB)")

print(f"Total lum < 100: {len(low_bright)}")
for f, lum in low_bright:
    print(f"  Lum < 100: {f} ({lum:.1f})")
