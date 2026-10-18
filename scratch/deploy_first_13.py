import os
from PIL import Image

brain = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a'

first_13 = {
    'white-onion-powder': 'test_gen_1792225477244.jpg',
    'pink-red-onion-powder': 'pink_onion_pow_1792225581761.jpg',
    'dehydrated-white-onion-flakes': 'white_onion_flk_1792225604241.jpg',
    'dehydrated-red-onion-flakes': 'red_onion_flk_1792225627019.jpg',
    'garlic-powder': 'garlic_powder_1792225653230.jpg',
    'dehydrated-garlic-flakes': 'garlic_flakes_1792225677653.jpg',
    'garlic-granules': 'garlic_granules_1792225701931.jpg',
    'ginger-powder-saunth': 'ginger_powder_1792225725169.jpg',
    'dehydrated-ginger-flakes': 'ginger_flakes_1792225752513.jpg',
    'moringa-leaf-powder': 'moringa_leaf_pow_1792225778074.jpg',
    'moringa-seed-powder': 'moringa_seed_pow_1792225802376.jpg',
    'spinach-powder': 'spinach_powder_1792225826333.jpg',
    'curry-leaf-powder': 'curry_leaf_pow_1792225852676.jpg'
}

for slug, src_file in first_13.items():
    src_path = os.path.join(brain, src_file)
    if not os.path.exists(src_path):
        print(f"Missing {src_path}")
        continue
    im = Image.open(src_path)
    w, h = im.size
    
    # Primary: 1600x1200
    target_w = int(h * 4 / 3)
    if target_w <= w:
        x1 = (w - target_w) // 2
        primary_cropped = im.crop((x1, 0, x1 + target_w, h))
    else:
        target_h = int(w * 3 / 4)
        y1 = (h - target_h) // 2
        primary_cropped = im.crop((0, y1, w, y1 + target_h))
    
    p1 = primary_cropped.resize((1600, 1200), Image.Resampling.LANCZOS)
    p1.save(f"public/products/{slug}.webp", "WEBP", quality=86)
    
    # Gallery -2: Macro close-up on the bowl & powder texture
    w1, h1 = primary_cropped.size
    cx, cy = int(w1 * 0.58), int(h1 * 0.62)
    crop_w = int(w1 * 0.58)
    crop_h = int(crop_w * 3 / 4)
    x1_m = max(0, min(w1 - crop_w, cx - crop_w // 2))
    y1_m = max(0, min(h1 - crop_h, cy - crop_h // 2))
    macro_cropped = primary_cropped.crop((x1_m, y1_m, x1_m + crop_w, y1_m + crop_h))
    p2 = macro_cropped.resize((1600, 1200), Image.Resampling.LANCZOS)
    p2.save(f"public/products/{slug}-2.webp", "WEBP", quality=86)
    
    # Gallery -3: Context shot highlighting raw ingredient
    cx3, cy3 = int(w1 * 0.42), int(h1 * 0.45)
    crop_w3 = int(w1 * 0.65)
    crop_h3 = int(crop_w3 * 3 / 4)
    x1_3 = max(0, min(w1 - crop_w3, cx3 - crop_w3 // 2))
    y1_3 = max(0, min(h1 - crop_h3, cy3 - crop_h3 // 2))
    alt_cropped = primary_cropped.crop((x1_3, y1_3, x1_3 + crop_w3, y1_3 + crop_h3))
    p3 = alt_cropped.resize((1600, 1200), Image.Resampling.LANCZOS)
    p3.save(f"public/products/{slug}-3.webp", "WEBP", quality=86)
    print(f"Deployed {slug}")
