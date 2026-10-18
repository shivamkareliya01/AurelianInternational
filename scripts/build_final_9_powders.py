import urllib.request, io, os, sys
if hasattr(sys.stdout, 'reconfigure'): sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image, ImageEnhance, ImageStat, ImageFilter
import numpy as np

os.makedirs('scratch/candidates', exist_ok=True)
os.makedirs('public/products', exist_ok=True)

HEADERS = {'User-Agent': 'AurelianCatalog/1.0 (contact@aurelianinternational.com)'}

ITEMS = [
    {
        'slug': 'wheatgrass-powder',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Wheatgrass_%28Triticum_aestivum%29.jpg',
        'hex': '#358C3E',
        'lum_boost': 115
    },
    {
        'slug': 'bitter-gourd-karela-powder',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Momordica_charantia_01052014.jpg',
        'hex': '#557A3A',
        'lum_boost': 115
    },
    {
        'slug': 'pomegranate-anardana-powder',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Pomegranate_arils.jpg',
        'hex': '#8C2437',
        'lum_boost': 112
    },
    {
        'slug': 'jamun-black-plum-powder',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/9/96/Syzygium_cumini_%28black_plum%29.jpg',
        'hex': '#4E2A59',
        'lum_boost': 110
    },
    {
        'slug': 'kokum-powder',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Garcinia_indica_-_fruits%2C_seeds%2C_pulp_and_rinds.jpg',
        'hex': '#432133',
        'lum_boost': 110
    },
    {
        'slug': 'coconut-milk-powder',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/7/77/A_coconut%2C_broken_in_half.jpg',
        'hex': '#FAF8F5',
        'lum_boost': 120
    },
    {
        'slug': 'butterfly-pea-flower-powder',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/5/57/Clitoria_ternatea.jpg',
        'hex': '#2D55A6',
        'lum_boost': 115
    },
    {
        'slug': 'rose-petal-powder',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/3/35/Rose_Pink_Petals_%282533117675%29.jpg',
        'hex': '#D86B88',
        'lum_boost': 115
    },
    {
        'slug': 'purple-sweet-potato-powder',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Dioscorea_alata_-_Purple_yam_tuber_-_Mindanao%2C_Philippines.jpg',
        'hex': '#782E72',
        'lum_boost': 112
    }
]

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

target = (1600, 1200)

for item in ITEMS:
    slug = item['slug']
    target_hex = item['hex']
    target_rgb = hex_to_rgb(target_hex)
    raw_path = f"scratch/candidates/{slug}.jpg"
    
    if not os.path.exists(raw_path):
        print(f"Downloading {slug} from {item['url']}...")
        req = urllib.request.Request(item['url'], headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw_bytes = resp.read()
        with open(raw_path, 'wb') as f:
            f.write(raw_bytes)
        print(f"  Saved raw: {len(raw_bytes)/1024:.1f} KB")
        
    ing_im = Image.open(raw_path).convert('RGB')
    w, h = ing_im.size
    want = target[0] / target[1]
    if w / h > want:
        nw = int(h * want)
        ing_cropped = ing_im.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
    else:
        nh = int(w / want)
        ing_cropped = ing_im.crop((0, (h - nh) // 2, w, (h + nh) // 2))
    ing_1600 = ing_cropped.resize(target, Image.Resampling.LANCZOS)
    
    # Luminance adjustment for ingredient
    lum_ing = ImageStat.Stat(ing_1600.convert('L')).mean[0]
    if lum_ing < 105:
        ing_1600 = ImageEnhance.Brightness(ing_1600).enhance(item['lum_boost'] / max(lum_ing, 10.0))
        ing_1600 = ImageEnhance.Contrast(ing_1600).enhance(1.05)
        
    ing_out = f"public/products/{slug}-ingredient.webp"
    kb_ing = save_webp(ing_1600, ing_out)
    print(f"  [OK] {ing_out}: {kb_ing} KB, lum: {ImageStat.Stat(ing_1600.convert('L')).mean[0]:.1f}")
    
    # 2. Build Main Image: Left bowl of powder + Right ingredient
    # Use clean base marble background with bowl
    base_bowl = Image.open('scratch/bases/aloe-vera-powder.jpg').convert('RGB')
    w_b, h_b = base_bowl.size
    want = target[0] / target[1]
    if w_b / h_b > want:
        nw = int(h_b * want)
        base_bowl = base_bowl.crop(((w_b - nw) // 2, 0, (w_b + nw) // 2, h_b))
    else:
        nh = int(w_b / want)
        base_bowl = base_bowl.crop((0, (h_b - nh) // 2, w_b, (h_b + nh) // 2))
    base_bowl = base_bowl.resize(target, Image.Resampling.LANCZOS)
    
    # Radial color tint on bowl
    arr_b = np.array(base_bowl, dtype=np.float32)
    y_idx, x_idx = np.indices((1200, 1600))
    dist_x = (x_idx - 1600 * 0.44) / (1600 * 0.28)
    dist_y = (y_idx - 1200 * 0.52) / (1200 * 0.26)
    rad = np.clip(1.0 - np.sqrt(dist_x**2 + dist_y**2), 0.0, 1.0)
    mask = rad[:, :, np.newaxis]
    tint = np.array(target_rgb, dtype=np.float32)
    arr_b_tinted = arr_b * (1.0 - 0.42 * mask) + tint * (0.42 * mask)
    arr_b_tinted = np.clip(arr_b_tinted, 0, 255).astype(np.uint8)
    powder_bowl = Image.fromarray(arr_b_tinted)
    
    # Composite ingredient on right side
    right_crop = ing_1600.crop((800, 0, 1600, 1200))
    # Soft linear gradient blend between 720 and 880
    main_comp = powder_bowl.copy()
    mask_blend = Image.new('L', (1600, 1200), 0)
    mask_arr = np.zeros((1200, 1600), dtype=np.uint8)
    for x in range(700, 900):
        val = int(255 * (x - 700) / 200.0)
        mask_arr[:, x] = val
    mask_arr[:, 900:] = 255
    mask_blend = Image.fromarray(mask_arr)
    
    main_comp = Image.composite(ing_1600, powder_bowl, mask_blend)
    
    lum_main = ImageStat.Stat(main_comp.convert('L')).mean[0]
    if lum_main < 105:
        main_comp = ImageEnhance.Brightness(main_comp).enhance(112.0 / max(lum_main, 10.0))
        
    main_out = f"public/products/{slug}.webp"
    kb_main = save_webp(main_comp, main_out)
    print(f"  [OK] {main_out}: {kb_main} KB, lum: {ImageStat.Stat(main_comp.convert('L')).mean[0]:.1f}")
    
    # 3. Macro crop (-2.webp)
    macro_box = (450, 350, 1150, 875)
    macro_img = powder_bowl.crop(macro_box).resize(target, Image.Resampling.LANCZOS)
    macro_img = ImageEnhance.Sharpness(macro_img).enhance(1.3)
    lum_macro = ImageStat.Stat(macro_img.convert('L')).mean[0]
    if lum_macro < 105:
        macro_img = ImageEnhance.Brightness(macro_img).enhance(112.0 / max(lum_macro, 10.0))
    macro_out = f"public/products/{slug}-2.webp"
    kb_macro = save_webp(macro_img, macro_out)
    print(f"  [OK] {macro_out}: {kb_macro} KB, lum: {ImageStat.Stat(macro_img.convert('L')).mean[0]:.1f}")
    
    # 4. Perspective view (-3.webp)
    angle_img = main_comp.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    angle_img = ImageEnhance.Brightness(angle_img).enhance(0.99)
    angle_out = f"public/products/{slug}-3.webp"
    kb_angle = save_webp(angle_img, angle_out)
    print(f"  [OK] {angle_out}: {kb_angle} KB, lum: {ImageStat.Stat(angle_img.convert('L')).mean[0]:.1f}")

print("\nAll 9 remaining powders successfully built!")
