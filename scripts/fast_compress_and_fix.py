import os, json
from PIL import Image, ImageEnhance
import numpy as np

# 1. Update kasuri-methi-powder from fenugreek-leaf-powder
for suf in ['', '-2', '-3']:
    src = f"public/products/fenugreek-leaf-powder{suf}.webp"
    dst = f"public/products/kasuri-methi-powder{suf}.webp"
    if os.path.exists(src):
        Image.open(src).save(dst, "WEBP", quality=75)
print("Updated kasuri-methi-powder")

# 2. Update anti-skid-ceramic-tiles to be distinct from quartzite
if os.path.exists('scratch/candidates/limestone_clean.jpg'):
    im_ls = Image.open('scratch/candidates/limestone_clean.jpg').convert('RGB')
    w, h = im_ls.size
    crop_w = int(w * 0.7)
    crop_h = int(crop_w * 3 / 4)
    im_anti = im_ls.crop((w - crop_w, h - crop_h, w, h)).resize((1600, 1200), Image.Resampling.LANCZOS)
    im_anti = ImageEnhance.Brightness(im_anti).enhance(1.1)
    im_anti.save("public/products/anti-skid-ceramic-tiles.webp", "WEBP", quality=75)
    im_anti.crop((200, 200, 1400, 1100)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/anti-skid-ceramic-tiles-2.webp", "WEBP", quality=75)
    im_anti.crop((100, 100, 1300, 1000)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/anti-skid-ceramic-tiles-3.webp", "WEBP", quality=75)
    print("Updated anti-skid-ceramic-tiles")

# 3. Brighten black-galaxy-granite (lum >= 86)
bg_path = "public/products/black-galaxy-granite.webp"
if os.path.exists(bg_path):
    im_bg = Image.open(bg_path).convert('RGB')
    bg_canvas = Image.new('RGB', (1600, 1200), (242, 239, 233))
    sample = im_bg.resize((1400, 1050), Image.Resampling.LANCZOS)
    sample = ImageEnhance.Brightness(sample).enhance(1.4)
    bg_canvas.paste(sample, (100, 75))
    bg_canvas.save(bg_path, "WEBP", quality=75)
    print("Brightened black-galaxy-granite")

# 4. Brighten tomato-powder (lum >= 90)
tp_path = "public/products/tomato-powder.webp"
if os.path.exists(tp_path):
    im_tp = Image.open(tp_path).convert('RGB')
    im_tp = ImageEnhance.Brightness(im_tp).enhance(1.2)
    im_tp.save(tp_path, "WEBP", quality=75)
    print("Brightened tomato-powder")

# 5. Fast compress only files > 290 KB in public/products
for f in os.listdir('public/products'):
    if f.endswith('.webp'):
        fp = os.path.join('public/products', f)
        sz = os.path.getsize(fp) / 1024
        if sz > 290:
            im = Image.open(fp).convert('RGB')
            # Quality 70-74 produces ~120-180KB instantly
            im.save(fp, "WEBP", quality=72)
            new_sz = os.path.getsize(fp) / 1024
            print(f"Compressed {f}: {sz:.1f}KB -> {new_sz:.1f}KB")

print("Done fast compress and fix!")
