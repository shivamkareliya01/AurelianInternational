import os, io
from PIL import Image, ImageEnhance, ImageStat
import numpy as np

target = (1600, 1200)

def hex_to_rgb(hex_str):
    h = hex_str.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def save_webp(img, out_path, max_kb=240):
    for q in (84, 80, 75, 70, 65, 58):
        buf = io.BytesIO()
        img.save(buf, 'WEBP', quality=q, method=6)
        if len(buf.getvalue()) <= max_kb * 1024:
            break
    with open(out_path, 'wb') as f:
        f.write(buf.getvalue())
    return len(buf.getvalue()) // 1024

neem_rgb = hex_to_rgb("#2C5E3B") # Forest green
base_bowl = Image.open('scratch/bases/green-chilli-powder.jpg').convert('RGB')
w_b, h_b = base_bowl.size
want = target[0] / target[1]
if w_b / h_b > want:
    nw = int(h_b * want)
    base_bowl = base_bowl.crop(((w_b - nw) // 2, 0, (w_b + nw) // 2, h_b))
else:
    nh = int(w_b / want)
    base_bowl = base_bowl.crop((0, (h_b - nh) // 2, w_b, (h_b + nh) // 2))
base_bowl = base_bowl.resize(target, Image.Resampling.LANCZOS)

# Tint powder bowl rich green
arr_b = np.array(base_bowl, dtype=np.float32)
y_idx, x_idx = np.indices((1200, 1600))
dist_x = (x_idx - 1600 * 0.44) / (1600 * 0.28)
dist_y = (y_idx - 1200 * 0.52) / (1200 * 0.26)
rad = np.clip(1.0 - np.sqrt(dist_x**2 + dist_y**2), 0.0, 1.0)
mask = rad[:, :, np.newaxis]
tint = np.array(neem_rgb, dtype=np.float32)
arr_b_tinted = arr_b * (1.0 - 0.48 * mask) + tint * (0.48 * mask)
arr_b_tinted = np.clip(arr_b_tinted, 0, 255).astype(np.uint8)
powder_bowl = Image.fromarray(arr_b_tinted)

# Right side: fresh neem leaves
ing_im = Image.open('public/products/neem-leaf-powder-ingredient.webp').convert('RGB')
mask_arr = np.zeros((1200, 1600), dtype=np.uint8)
for x in range(700, 900):
    mask_arr[:, x] = int(255 * (x - 700) / 200.0)
mask_arr[:, 900:] = 255
mask_blend = Image.fromarray(mask_arr)

main_comp = Image.composite(ing_im, powder_bowl, mask_blend)
lum_main = ImageStat.Stat(main_comp.convert('L')).mean[0]
if lum_main < 105:
    main_comp = ImageEnhance.Brightness(main_comp).enhance(112.0 / max(lum_main, 10.0))

save_webp(main_comp, 'public/products/neem-leaf-powder.webp')

# Also check center color
center = np.array(main_comp)[int(1200*0.38):int(1200*0.65), int(1600*0.38):int(1600*0.65)]
avg_r = int(np.mean(center[:,:,0]))
avg_g = int(np.mean(center[:,:,1]))
avg_b = int(np.mean(center[:,:,2]))
print(f"New neem center color: #{avg_r:02X}{avg_g:02X}{avg_b:02X} (G={avg_g} > R={avg_r})")
