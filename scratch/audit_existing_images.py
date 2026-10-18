import os, re
from PIL import Image, ImageStat

with open('src/data/powderColors.ts', 'r', encoding='utf-8') as f:
    text = f.read()

slugs = list(re.findall(r'"([a-z0-9-]+)":\s*\{', text))

print(f"{'SLUG':<25} | {'MAIN':<12} | {'INGREDIENT':<12} | {'CLOSEUP(-2)':<12} | {'SIDE(-3)':<12}")
print("-" * 80)

for s in slugs:
    row = [s]
    for suf in ['', '-ingredient', '-2', '-3']:
        fn = f"public/products/{s}{suf}.webp"
        if os.path.exists(fn):
            sz = os.path.getsize(fn) / 1024
            im = Image.open(fn)
            lum = ImageStat.Stat(im.convert('L')).mean[0]
            row.append(f"{sz:.0f}K / L{lum:.0f}")
        else:
            row.append("MISSING")
    print(f"{row[0]:<25} | {row[1]:<12} | {row[2]:<12} | {row[3]:<12} | {row[4]:<12}")
