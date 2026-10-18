import os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

brain = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a'

# Load high-res templates
base_moringa = Image.open(os.path.join(brain, 'moringa_leaf_pow_1792225778074.jpg'))
base_onion = Image.open(os.path.join(brain, 'test_gen_1792225477244.jpg'))
base_pink = Image.open(os.path.join(brain, 'pink_onion_pow_1792225581761.jpg'))
base_ginger = Image.open(os.path.join(brain, 'ginger_powder_1792225725169.jpg'))
base_granules = Image.open(os.path.join(brain, 'garlic_granules_1792225701931.jpg'))
base_flakes = Image.open(os.path.join(brain, 'white_onion_flk_1792225604241.jpg'))

# Load produce references
ref_tomato = Image.open('public/products/tomato.webp')
ref_carrot = Image.open('public/products/carrot.webp')
ref_chilli = Image.open('public/products/green-chilli.webp')
ref_potato = Image.open('public/products/potato.webp')
ref_mango = Image.open('public/products/kesar-mango.webp')
ref_banana = Image.open('public/products/cavendish-banana.webp')
ref_lemon = Image.open('public/products/lemon.webp')

# Helper to recolor powder region inside the wooden bowl
def create_powder_scene(base_img, target_rgb, raw_produce_img=None, produce_pos=(120, 260), produce_scale=0.55):
    # base_img is 1600x1200 or similar
    im = base_img.copy()
    w, h = im.size
    
    # Target 4:3
    target_w = int(h * 4 / 3)
    if target_w <= w:
        x1 = (w - target_w) // 2
        im = im.crop((x1, 0, x1 + target_w, h))
    else:
        target_h = int(w * 3 / 4)
        y1 = (h - target_h) // 2
        im = im.crop((0, y1, w, y1 + target_h))
    im = im.resize((1600, 1200), Image.Resampling.LANCZOS)
    
    # In 1600x1200, the bowl interior powder is typically within x: [550, 1150], y: [420, 850]
    # We create an elliptical mask with feathered gradient
    mask = Image.new("L", (1600, 1200), 0)
    import math
    from PIL import ImageDraw
    draw = ImageDraw.Draw(mask)
    draw.ellipse([540, 430, 1160, 840], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=28))
    
    # Color tint the powder
    arr = np.array(im).astype(np.float32)
    mask_arr = np.array(mask).astype(np.float32) / 255.0
    mask_arr = np.expand_dims(mask_arr, axis=2)
    
    # Luminance of original
    lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    lum_norm = lum / 255.0
    
    tr, tg, tb = target_rgb
    tinted = np.zeros_like(arr)
    tinted[:, :, 0] = lum_norm * tr
    tinted[:, :, 1] = lum_norm * tg
    tinted[:, :, 2] = lum_norm * tb
    
    # Blend with original texture for natural highlights and spoon preservation
    blended_powder = arr * 0.35 + tinted * 0.65
    result_arr = arr * (1.0 - mask_arr * 0.85) + blended_powder * (mask_arr * 0.85)
    result_arr = np.clip(result_arr, 0, 255).astype(np.uint8)
    res_img = Image.fromarray(result_arr)
    
    # If a raw produce reference is provided, place it in the upper-left / left slate area
    if raw_produce_img:
        prod = raw_produce_img.copy()
        pw = int(1600 * produce_scale)
        ph = int(pw * prod.size[1] / prod.size[0])
        prod = prod.resize((pw, ph), Image.Resampling.LANCZOS)
        
        # Soft feather on edges to blend naturally with dark slate
        prod_mask = Image.new("L", prod.size, 255)
        p_draw = ImageDraw.Draw(prod_mask)
        # soften perimeter
        border = 18
        p_draw.rectangle([0, 0, pw, border], fill=0)
        p_draw.rectangle([0, 0, border, ph], fill=0)
        p_draw.rectangle([pw - border, 0, pw, ph], fill=0)
        p_draw.rectangle([0, ph - border, pw, ph], fill=0)
        prod_mask = prod_mask.filter(ImageFilter.GaussianBlur(radius=15))
        
        # Paste with slight shadow
        px, py = produce_pos
        res_img.paste(prod, (px, py), prod_mask)
        
    return res_img

# Specifications for the 15 products
specs = {
    'mint-leaf-powder': {
        'base': base_moringa,
        'rgb': (85, 155, 75),  # fresh mint green
        'produce': None  # base_moringa already has gorgeous fresh mint/leaves
    },
    'coriander-leaf-powder': {
        'base': base_moringa,
        'rgb': (105, 145, 70), # herbal coriander green
        'produce': None
    },
    'kasuri-methi-powder': {
        'base': base_moringa,
        'rgb': (115, 125, 60), # olive-khaki
        'produce': None
    },
    'tomato-powder': {
        'base': base_pink,
        'rgb': (218, 55, 30),  # vibrant tomato red-orange
        'produce': ref_tomato,
        'pos': (80, 160),
        'scale': 0.42
    },
    'beetroot-powder': {
        'base': base_pink,
        'rgb': (155, 25, 65),  # deep magenta ruby
        'produce': None
    },
    'carrot-powder': {
        'base': base_ginger,
        'rgb': (235, 95, 10),  # vibrant carrot orange
        'produce': ref_carrot,
        'pos': (60, 180),
        'scale': 0.45
    },
    'green-chilli-powder': {
        'base': base_moringa,
        'rgb': (125, 175, 80), # light piquant green
        'produce': ref_chilli,
        'pos': (100, 180),
        'scale': 0.44
    },
    'potato-flakes': {
        'base': base_flakes,
        'rgb': (245, 240, 225),# creamy white potato flakes
        'produce': ref_potato,
        'pos': (90, 180),
        'scale': 0.42
    },
    'pumpkin-powder': {
        'base': base_ginger,
        'rgb': (228, 150, 35), # rich golden squash yellow
        'produce': None
    },
    'mango-powder-amchur': {
        'base': base_ginger,
        'rgb': (212, 167, 106),# raw mango beige-tan
        'produce': ref_mango,
        'pos': (90, 170),
        'scale': 0.42
    },
    'banana-powder': {
        'base': base_onion,
        'rgb': (245, 230, 185),# creamy pale yellow
        'produce': ref_banana,
        'pos': (80, 160),
        'scale': 0.44
    },
    'lemon-powder': {
        'base': base_onion,
        'rgb': (242, 205, 75), # sunny yellow
        'produce': ref_lemon,
        'pos': (90, 170),
        'scale': 0.42
    },
    'amla-powder': {
        'base': base_ginger,
        'rgb': (180, 168, 118),# herbal greenish-tan
        'produce': None
    },
    'aloe-vera-powder': {
        'base': base_onion,
        'rgb': (250, 248, 240),# pristine off-white
        'produce': None
    },
    'hibiscus-powder': {
        'base': base_pink,
        'rgb': (136, 19, 55),  # deep burgundy red
        'produce': None
    }
}

for slug, sp in specs.items():
    res = create_powder_scene(
        sp['base'],
        sp['rgb'],
        sp.get('produce'),
        sp.get('pos', (120, 260)),
        sp.get('scale', 0.55)
    )
    
    # 1. Primary
    res.save(f"public/products/{slug}.webp", "WEBP", quality=88)
    
    # 2. Gallery -2: Macro on bowl & spoon
    w1, h1 = res.size
    cx, cy = int(w1 * 0.58), int(h1 * 0.62)
    crop_w = int(w1 * 0.58)
    crop_h = int(crop_w * 3 / 4)
    x1_m = max(0, min(w1 - crop_w, cx - crop_w // 2))
    y1_m = max(0, min(h1 - crop_h, cy - crop_h // 2))
    macro = res.crop((x1_m, y1_m, x1_m + crop_w, y1_m + crop_h)).resize((1600, 1200), Image.Resampling.LANCZOS)
    macro.save(f"public/products/{slug}-2.webp", "WEBP", quality=88)
    
    # 3. Gallery -3: Focus on ingredient & setting
    cx3, cy3 = int(w1 * 0.42), int(h1 * 0.45)
    crop_w3 = int(w1 * 0.65)
    crop_h3 = int(crop_w3 * 3 / 4)
    x1_3 = max(0, min(w1 - crop_w3, cx3 - crop_w3 // 2))
    y1_3 = max(0, min(h1 - crop_h3, cy3 - crop_h3 // 2))
    alt = res.crop((x1_3, y1_3, x1_3 + crop_w3, y1_3 + crop_h3)).resize((1600, 1200), Image.Resampling.LANCZOS)
    alt.save(f"public/products/{slug}-3.webp", "WEBP", quality=88)
    
    print(f"Generated {slug}: {os.path.getsize(f'public/products/{slug}.webp')//1024}KB")

# Now Category Image: category-dehydrated-powders.webp
# A rich flat-lay showing multiple bowls of colorful powders on dark slate
cat_base = Image.open('scratch/veg_candidates/crop_focused_cluster.webp')
# Let's create a dedicated category image with multiple bowls
cat_img = Image.open(os.path.join(brain, 'curry_leaf_pow_1792225852676.jpg'))
w, h = cat_img.size
target_w = int(h * 4 / 3)
cat_cropped = cat_img.crop(((w - target_w) // 2, 0, (w - target_w) // 2 + target_w, h)).resize((1600, 1200), Image.Resampling.LANCZOS)
cat_cropped.save("public/products/category-dehydrated-powders.webp", "WEBP", quality=90)
print("Generated category-dehydrated-powders.webp")
