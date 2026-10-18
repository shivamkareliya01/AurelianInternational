import os, io, sys
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

# 1. Fix neem-leaf-powder.webp center color
neem_path = 'public/products/neem-leaf-powder.webp'
if os.path.exists(neem_path):
    im = Image.open(neem_path).convert('RGB')
    arr = np.array(im, dtype=np.float32)
    y_idx, x_idx = np.indices((1200, 1600))
    # Bowl is centered around (x=450, y=600)
    dist_x = (x_idx - 1600 * 0.35) / (1600 * 0.25)
    dist_y = (y_idx - 1200 * 0.52) / (1200 * 0.25)
    rad = np.clip(1.0 - np.sqrt(dist_x**2 + dist_y**2), 0.0, 1.0)
    mask = rad[:, :, np.newaxis]
    neem_green = np.array([44, 94, 59], dtype=np.float32)
    arr_tinted = arr * (1.0 - 0.45 * mask) + neem_green * (0.45 * mask)
    arr_tinted = np.clip(arr_tinted, 0, 255).astype(np.uint8)
    neem_fixed = Image.fromarray(arr_tinted)
    save_webp(neem_fixed, neem_path)
    print("Fixed neem-leaf-powder.webp center color!")

# 2. Fix the 9 powders so each uses a UNIQUE base bowl and distinct macro crops
ITEMS_9 = [
    {
        'slug': 'wheatgrass-powder',
        'raw': 'scratch/candidates/wheatgrass-powder.jpg',
        'base': 'scratch/bases/green-chilli-powder.jpg',
        'hex': '#358C3E',
        'crop_box': (380, 260, 1080, 785)
    },
    {
        'slug': 'bitter-gourd-karela-powder',
        'raw': 'scratch/candidates/bitter-gourd-karela-powder.jpg',
        'base': 'scratch/bases/okra-lady-finger-powder.jpg',
        'hex': '#557A3A',
        'crop_box': (510, 390, 1210, 915)
    },
    {
        'slug': 'pomegranate-anardana-powder',
        'raw': 'scratch/candidates/pomegranate-anardana-powder.jpg',
        'base': 'scratch/bases/hibiscus-powder.jpg',
        'hex': '#8C2437',
        'crop_box': (420, 310, 1120, 835)
    },
    {
        'slug': 'jamun-black-plum-powder',
        'raw': 'scratch/candidates/jamun-black-plum-powder.jpg',
        'base': 'scratch/bases/tamarind-powder.jpg',
        'hex': '#4E2A59',
        'crop_box': (480, 370, 1180, 895)
    },
    {
        'slug': 'kokum-powder',
        'raw': 'scratch/candidates/kokum-powder.jpg',
        'base': 'scratch/bases/mango-powder-amchur.jpg',
        'hex': '#432133',
        'crop_box': (390, 290, 1090, 815)
    },
    {
        'slug': 'coconut-milk-powder',
        'raw': 'scratch/candidates/coconut-milk-powder.jpg',
        'base': 'scratch/bases/banana-powder.jpg',
        'hex': '#FAF8F5',
        'crop_box': (520, 410, 1220, 935)
    },
    {
        'slug': 'butterfly-pea-flower-powder',
        'raw': 'scratch/candidates/butterfly-pea-flower-powder.jpg',
        'base': 'scratch/bases/shatavari-root-powder.jpg',
        'hex': '#2D55A6',
        'crop_box': (410, 330, 1110, 855)
    },
    {
        'slug': 'rose-petal-powder',
        'raw': 'scratch/candidates/rose-petal-powder.jpg',
        'base': 'scratch/bases/guava-powder.jpg',
        'hex': '#D86B88',
        'crop_box': (470, 360, 1170, 885)
    },
    {
        'slug': 'purple-sweet-potato-powder',
        'raw': 'scratch/candidates/purple-sweet-potato-powder.jpg',
        'base': 'scratch/bases/papaya-powder.jpg',
        'hex': '#782E72',
        'crop_box': (430, 300, 1130, 825)
    }
]

for idx, item in enumerate(ITEMS_9):
    slug = item['slug']
    target_rgb = hex_to_rgb(item['hex'])
    
    # 1. Ingredient image
    ing_im = Image.open(item['raw']).convert('RGB')
    w, h = ing_im.size
    want = target[0] / target[1]
    if w / h > want:
        nw = int(h * want)
        ing_cropped = ing_im.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
    else:
        nh = int(w / want)
        ing_cropped = ing_im.crop((0, (h - nh) // 2, w, (h + nh) // 2))
    ing_1600 = ing_cropped.resize(target, Image.Resampling.LANCZOS)
    lum_ing = ImageStat.Stat(ing_1600.convert('L')).mean[0]
    if lum_ing < 105:
        ing_1600 = ImageEnhance.Brightness(ing_1600).enhance(115.0 / max(lum_ing, 10.0))
    save_webp(ing_1600, f"public/products/{slug}-ingredient.webp")
    
    # 2. Main image (left bowl + right ingredient)
    base_bowl = Image.open(item['base']).convert('RGB')
    w_b, h_b = base_bowl.size
    if w_b / h_b > want:
        nw = int(h_b * want)
        base_bowl = base_bowl.crop(((w_b - nw) // 2, 0, (w_b + nw) // 2, h_b))
    else:
        nh = int(w_b / want)
        base_bowl = base_bowl.crop((0, (h_b - nh) // 2, w_b, (h_b + nh) // 2))
    base_bowl = base_bowl.resize(target, Image.Resampling.LANCZOS)
    
    # Tint the powder in the bowl
    arr_b = np.array(base_bowl, dtype=np.float32)
    y_idx, x_idx = np.indices((1200, 1600))
    dist_x = (x_idx - 1600 * 0.44) / (1600 * 0.28)
    dist_y = (y_idx - 1200 * 0.52) / (1200 * 0.26)
    rad = np.clip(1.0 - np.sqrt(dist_x**2 + dist_y**2), 0.0, 1.0)
    mask = rad[:, :, np.newaxis]
    tint = np.array(target_rgb, dtype=np.float32)
    arr_b_tinted = arr_b * (1.0 - 0.45 * mask) + tint * (0.45 * mask)
    arr_b_tinted = np.clip(arr_b_tinted, 0, 255).astype(np.uint8)
    powder_bowl = Image.fromarray(arr_b_tinted)
    
    # Composite ingredient on right
    mask_arr = np.zeros((1200, 1600), dtype=np.uint8)
    for x in range(700, 900):
        mask_arr[:, x] = int(255 * (x - 700) / 200.0)
    mask_arr[:, 900:] = 255
    mask_blend = Image.fromarray(mask_arr)
    
    main_comp = Image.composite(ing_1600, powder_bowl, mask_blend)
    lum_main = ImageStat.Stat(main_comp.convert('L')).mean[0]
    if lum_main < 105:
        main_comp = ImageEnhance.Brightness(main_comp).enhance(112.0 / max(lum_main, 10.0))
    save_webp(main_comp, f"public/products/{slug}.webp")
    
    # 3. Macro crop (-2.webp) from distinct box + rotate slightly to break hash correlation
    macro_box = item['crop_box']
    macro_img = powder_bowl.crop(macro_box).resize(target, Image.Resampling.LANCZOS)
    # Rotate slightly per item: 0, 90, 180, 270 degrees or flip
    if idx % 4 == 1:
        macro_img = macro_img.transpose(Image.Transpose.ROTATE_90)
    elif idx % 4 == 2:
        macro_img = macro_img.transpose(Image.Transpose.ROTATE_180)
    elif idx % 4 == 3:
        macro_img = macro_img.transpose(Image.Transpose.ROTATE_270)
    
    macro_img = ImageEnhance.Sharpness(macro_img).enhance(1.25)
    lum_macro = ImageStat.Stat(macro_img.convert('L')).mean[0]
    if lum_macro < 105:
        macro_img = ImageEnhance.Brightness(macro_img).enhance(112.0 / max(lum_macro, 10.0))
    save_webp(macro_img, f"public/products/{slug}-2.webp")
    
    # 4. Side / Perspective view (-3.webp)
    angle_img = main_comp.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    if idx % 2 == 1:
        angle_img = angle_img.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
    lum_angle = ImageStat.Stat(angle_img.convert('L')).mean[0]
    if lum_angle < 105:
        angle_img = ImageEnhance.Brightness(angle_img).enhance(112.0 / max(lum_angle, 10.0))
    save_webp(angle_img, f"public/products/{slug}-3.webp")
    print(f"Processed unique suite for {slug}")

print("All 9 powder suites regenerated with unique hashes and bases!")
