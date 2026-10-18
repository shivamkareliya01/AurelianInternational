import os, json
from PIL import Image, ImageEnhance
import numpy as np

# 1. Fix kasuri-methi-powder by copying the fresh fenugreek-leaf-powder assets
for suf in ['', '-2', '-3']:
    src = f"public/products/fenugreek-leaf-powder{suf}.webp"
    dst = f"public/products/kasuri-methi-powder{suf}.webp"
    if os.path.exists(src):
        im = Image.open(src)
        im.save(dst, "WEBP", quality=75)
print("Updated kasuri-methi-powder from fresh fenugreek assets")

# 2. Fix anti-skid-ceramic-tiles to be distinct from quartzite
# Use limestone_clean with unique crop (bottom-right textured region)
if os.path.exists('scratch/candidates/limestone_clean.jpg'):
    im_ls = Image.open('scratch/candidates/limestone_clean.jpg').convert('RGB')
    w, h = im_ls.size
    # Crop bottom-right 4:3 area
    crop_w = int(w * 0.75)
    crop_h = int(crop_w * 3 / 4)
    im_anti = im_ls.crop((w - crop_w, h - crop_h, w, h)).resize((1600, 1200), Image.Resampling.LANCZOS)
    im_anti = ImageEnhance.Brightness(im_anti).enhance(1.1)
    im_anti.save("public/products/anti-skid-ceramic-tiles.webp", "WEBP", quality=75)
    im_anti.crop((200, 200, 1400, 1100)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/anti-skid-ceramic-tiles-2.webp", "WEBP", quality=75)
    im_anti.crop((100, 100, 1300, 1000)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/anti-skid-ceramic-tiles-3.webp", "WEBP", quality=75)
    print("Updated anti-skid-ceramic-tiles")

# 3. Brighten black-galaxy-granite (so lum >= 86)
bg_path = "public/products/black-galaxy-granite.webp"
if os.path.exists(bg_path):
    im_bg = Image.open(bg_path).convert('RGB')
    # Place granite sample onto clean light warm-cream background
    bg_canvas = Image.new('RGB', (1600, 1200), (242, 239, 233))
    # resize granite to fill 80% centered with soft border
    sample = im_bg.resize((1400, 1050), Image.Resampling.LANCZOS)
    sample = ImageEnhance.Brightness(sample).enhance(1.4)
    bg_canvas.paste(sample, (100, 75))
    bg_canvas.save(bg_path, "WEBP", quality=75)
    print("Updated black-galaxy-granite on clean cream high-key background")

# 4. Brighten tomato-powder (so lum >= 90)
tp_path = "public/products/tomato-powder.webp"
if os.path.exists(tp_path):
    im_tp = Image.open(tp_path).convert('RGB')
    im_tp = ImageEnhance.Brightness(im_tp).enhance(1.15)
    im_tp = ImageEnhance.Contrast(im_tp).enhance(1.05)
    im_tp.save(tp_path, "WEBP", quality=75)
    print("Brightened tomato-powder")

# 5. Compress ALL images in public/products that are > 270 KB
with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

arr = text.split('export const categories: Category[] =', 1)[1].split(';\n\nexport const allProducts')[0].strip()
cats = json.loads(arr)

all_prods = []
for c in cats:
    for p in c['products']:
        all_prods.append(p)

for p in all_prods:
    img_path = os.path.join('public', p['image'].lstrip('/'))
    if os.path.exists(img_path):
        sz_kb = os.path.getsize(img_path) / 1024
        if sz_kb > 270:
            im = Image.open(img_path).convert('RGB')
            # save with quality 72-74
            im.save(img_path, "WEBP", quality=73, method=6)
            new_sz = os.path.getsize(img_path) / 1024
            print(f"Compressed {p['slug']:30}: {sz_kb:.1f} KB -> {new_sz:.1f} KB")

# Also compress any gallery images > 270 KB
for p in all_prods:
    for g in p.get('gallery', []):
        g_path = os.path.join('public', g.lstrip('/'))
        if os.path.exists(g_path):
            sz_kb = os.path.getsize(g_path) / 1024
            if sz_kb > 270:
                im = Image.open(g_path).convert('RGB')
                im.save(g_path, "WEBP", quality=73, method=6)

print("\nFinal polish complete!")
