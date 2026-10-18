import os
from PIL import Image, ImageEnhance, ImageStat
import numpy as np

def save_webp(img, out_path, max_kb=240):
    import io
    for q in (84, 80, 75, 70, 65, 58):
        buf = io.BytesIO()
        img.save(buf, 'WEBP', quality=q, method=6)
        if len(buf.getvalue()) <= max_kb * 1024:
            break
    with open(out_path, 'wb') as f:
        f.write(buf.getvalue())
    return len(buf.getvalue()) // 1024

target = (1600, 1200)

# 1. Fix luminance of pomegranate-anardana-powder-2.webp
p_img = Image.open('public/products/pomegranate-anardana-powder-2.webp').convert('RGB')
lum_p = ImageStat.Stat(p_img.convert('L')).mean[0]
if lum_p < 105:
    p_img = ImageEnhance.Brightness(p_img).enhance(110.0 / lum_p)
    p_img = ImageEnhance.Contrast(p_img).enhance(1.05)
save_webp(p_img, 'public/products/pomegranate-anardana-powder-2.webp')
print(f"pomegranate -2 luminance now: {ImageStat.Stat(p_img.convert('L')).mean[0]:.1f}")

# 2. Fix luminance of jamun-black-plum-powder-2.webp
j_img = Image.open('public/products/jamun-black-plum-powder-2.webp').convert('RGB')
lum_j = ImageStat.Stat(j_img.convert('L')).mean[0]
if lum_j < 105:
    j_img = ImageEnhance.Brightness(j_img).enhance(110.0 / lum_j)
    j_img = ImageEnhance.Contrast(j_img).enhance(1.05)
save_webp(j_img, 'public/products/jamun-black-plum-powder-2.webp')
print(f"jamun -2 luminance now: {ImageStat.Stat(j_img.convert('L')).mean[0]:.1f}")

# 3. Fix near-duplicate between rose-petal-powder-2.webp and purple-sweet-potato-powder-2.webp
# Let's regenerate rose-petal-powder-2.webp with a macro crop of the fresh rose petals candidate!
rose_raw = Image.open('scratch/candidates/rose-petal-powder.jpg').convert('RGB')
w, h = rose_raw.size
# Crop tight center petals
crop_box = (int(w * 0.25), int(h * 0.25), int(w * 0.75), int(h * 0.75))
rose_macro = rose_raw.crop(crop_box).resize(target, Image.Resampling.LANCZOS)
rose_macro = ImageEnhance.Brightness(rose_macro).enhance(1.15)
rose_macro = ImageEnhance.Contrast(rose_macro).enhance(1.08)
save_webp(rose_macro, 'public/products/rose-petal-powder-2.webp')
print(f"rose -2 rebuilt from rose petals! lum: {ImageStat.Stat(rose_macro.convert('L')).mean[0]:.1f}")

# Check dhash between rose-2 and purple-sweet-potato-2
def dhash(image, hash_size=8):
    image = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = np.array(image)
    diff = pixels[:, 1:] > pixels[:, :-1]
    return diff.flatten()

psp_img = Image.open('public/products/purple-sweet-potato-powder-2.webp')
d = np.count_nonzero(dhash(rose_macro) != dhash(psp_img))
print(f"New dHash distance between rose-2 and purple-sweet-potato-2: {d} (must be >= 10)")
