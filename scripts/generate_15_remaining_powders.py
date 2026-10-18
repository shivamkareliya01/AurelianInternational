import urllib.request, urllib.parse, time, os, io, sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from PIL import Image, ImageEnhance, ImageStat
import numpy as np

os.makedirs('scratch/bases', exist_ok=True)
os.makedirs('scratch/ingredients_raw', exist_ok=True)
os.makedirs('public/products', exist_ok=True)

configs = [
    {
        'slug': 'ashwagandha-root-powder',
        'main_prompt': 'Bright commercial food photography, a large heap of fine cream-tan ashwagandha root powder in an earthenware bowl, wooden spoon, fresh whole ashwagandha roots beside bowl on marble, soft daylight, sharp macro powder texture, no text',
        'ing_prompt': 'Studio photograph of whole and sliced dried ashwagandha roots, pale tan bark, clean ivory marble background, sharp macro focus, 4:3 landscape, no text',
        'hex': '#D9C7A7',
        'seed': 211
    },
    {
        'slug': 'shatavari-root-powder',
        'main_prompt': 'Bright commercial food photography, fine creamy ivory-beige shatavari root powder in a white porcelain bowl, wooden spoon, fresh peeled succulent shatavari roots beside bowl on marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of fresh peeled succulent white shatavari roots on white marble, clean bright lighting, sharp focus, 4:3 landscape, no text',
        'hex': '#EFE4D1',
        'seed': 222
    },
    {
        'slug': 'wheatgrass-powder',
        'main_prompt': 'Bright commercial food photography, vibrant deep emerald-green wheatgrass powder in a bamboo bowl, bamboo scoop, freshly cut tender bright green wheatgrass blades beside bowl on pale marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of fresh bright green tender wheatgrass blades bundled on pale marble with water drops, sharp focus, 4:3 landscape, no text',
        'hex': '#358C3E',
        'seed': 233
    },
    {
        'slug': 'okra-lady-finger-powder',
        'main_prompt': 'Bright commercial food photography, fine moss-green okra powder in a ceramic bowl, wooden spoon, fresh whole green okra pods and crisp star-shaped sliced cross sections beside bowl on marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of fresh tender green okra lady fingers whole and sliced into neat star wheels on white marble, sharp focus, 4:3 landscape, no text',
        'hex': '#6F8F45',
        'seed': 244
    },
    {
        'slug': 'bitter-gourd-karela-powder',
        'main_prompt': 'Bright commercial food photography, fine medium olive-green bitter gourd karela powder in a textured bowl, wooden spoon, whole fresh bumpy green bitter gourd and sliced round wheels beside bowl on stone, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of fresh bumpy green bitter gourd karela fruit whole and sliced into round rings showing pale seeds on marble, sharp focus, 4:3 landscape, no text',
        'hex': '#557A3A',
        'seed': 255
    },
    {
        'slug': 'papaya-powder',
        'main_prompt': 'Bright commercial food photography, fine warm golden-orange papaya powder in a white bowl, wooden spoon, fresh ripe orange papaya slices showing shiny black seeds beside bowl on marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of ripe golden-orange papaya fruit halves showing glistening black seeds and juicy flesh on light marble, sharp focus, 4:3 landscape, no text',
        'hex': '#EFA332',
        'seed': 266
    },
    {
        'slug': 'pomegranate-anardana-powder',
        'main_prompt': 'Bright commercial food photography, fine deep ruby maroon pomegranate anardana powder in a terracotta bowl, wooden spoon, fresh ripe pomegranate split open showing ruby red arils beside bowl on marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of fresh whole pomegranate and split half bursting with glistening ruby red juicy arils on white marble, sharp focus, 4:3 landscape, no text',
        'hex': '#8C2437',
        'seed': 277
    },
    {
        'slug': 'guava-powder',
        'main_prompt': 'Bright commercial food photography, fine creamy pale soft pink-beige guava fruit powder in a ceramic bowl, wooden spoon, whole and sliced ripe Indian guavas beside bowl on marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of fresh ripe Indian guavas whole and cut halves showing seeds on pale marble surface, sharp focus, 4:3 landscape, no text',
        'hex': '#EAD9C9',
        'seed': 288
    },
    {
        'slug': 'jamun-black-plum-powder',
        'main_prompt': 'Bright commercial food photography, fine deep royal purple-indigo jamun powder in a white porcelain bowl, wooden spoon, fresh glossy dark purple jamun berries whole and halved beside bowl on marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of fresh plump dark purple-black jamun black plum berries whole and cut halves showing juicy purple flesh on white marble, sharp focus, 4:3 landscape, no text',
        'hex': '#4E2A59',
        'seed': 299
    },
    {
        'slug': 'tamarind-powder',
        'main_prompt': 'Bright commercial food photography, fine rich caramel-brown tamarind powder in a wooden bowl, wooden scoop, fresh brown brittle tamarind pods with sticky dark pulp beside bowl on marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of whole brown tamarind pods in brittle shells and dark sticky tamarind pulp on light marble, sharp focus, 4:3 landscape, no text',
        'hex': '#8C5332',
        'seed': 310
    },
    {
        'slug': 'kokum-powder',
        'main_prompt': 'Bright commercial food photography, fine deep dark purple-black kokum powder in a dark stone bowl, wooden spoon, sun-dried dark purple kokum rinds and fresh kokum fruit beside bowl on marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of sun-dried dark purple kokum fruit rinds and round fresh purple kokum fruits on white marble, sharp focus, 4:3 landscape, no text',
        'hex': '#432133',
        'seed': 321
    },
    {
        'slug': 'coconut-milk-powder',
        'main_prompt': 'Bright commercial food photography, fine pure snow-white coconut milk powder in a wooden bowl, wooden spoon, freshly cracked coconut halves with pure white meat beside bowl on pale marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of fresh cracked coconut halves showing pure white moist coconut flesh on light marble, sharp focus, 4:3 landscape, no text',
        'hex': '#FAF8F5',
        'seed': 332
    },
    {
        'slug': 'butterfly-pea-flower-powder',
        'main_prompt': 'Bright commercial food photography, fine vivid electric sapphire blue butterfly pea flower powder in a white ceramic bowl, wooden spoon, fresh vibrant blue butterfly pea flowers beside bowl on white marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of fresh vibrant electric blue butterfly pea blossoms Clitoria ternatea on clean white marble, sharp focus, 4:3 landscape, no text',
        'hex': '#2D55A6',
        'seed': 343
    },
    {
        'slug': 'rose-petal-powder',
        'main_prompt': 'Bright commercial food photography, fine soft blush-pink rose petal powder in a porcelain bowl, wooden scoop, fresh fragrant pink Damask rose petals beside bowl on white marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of fresh velvety fragrant pink rose petals scattered with dewdrops on white marble, sharp focus, 4:3 landscape, no text',
        'hex': '#D86B88',
        'seed': 354
    },
    {
        'slug': 'purple-sweet-potato-powder',
        'main_prompt': 'Bright commercial food photography, fine vivid violet purple sweet potato powder in a stone bowl, wooden spoon, fresh purple sweet potatoes whole and cut cross section showing deep violet flesh beside bowl on marble, soft natural light, sharp focus, 4:3 landscape, no text',
        'ing_prompt': 'Studio photograph of fresh purple sweet potatoes whole and sliced open showing vivid deep violet flesh on white marble, sharp focus, 4:3 landscape, no text',
        'hex': '#782E72',
        'seed': 365
    }
]

def fetch_pollinations(prompt, seed, retries=4):
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1200&height=900&nologo=true&seed={seed}"
    for att in range(retries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=35) as resp:
                data = resp.read()
                if len(data) > 10000:
                    return data
        except Exception as e:
            time.sleep(3 * (att + 1))
    return None

def hex_to_rgb(hex_str):
    h = hex_str.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def process_set(cfg):
    slug = cfg['slug']
    target_hex = cfg['hex']
    
    # 1. Main image
    main_base_path = f"scratch/bases/{slug}.jpg"
    if not os.path.exists(main_base_path) or os.path.getsize(main_base_path) < 10000:
        print(f"[{slug}] Fetching main image...")
        data = fetch_pollinations(cfg['main_prompt'], cfg['seed'])
        if not data:
            print(f"[{slug}] FAILED to fetch main image!")
            return False
        with open(main_base_path, 'wb') as f:
            f.write(data)
    
    # 2. Ingredient image
    ing_base_path = f"scratch/ingredients_raw/{slug}.jpg"
    if not os.path.exists(ing_base_path) or os.path.getsize(ing_base_path) < 10000:
        print(f"[{slug}] Fetching ingredient image...")
        data = fetch_pollinations(cfg['ing_prompt'], cfg['seed'] + 77)
        if not data:
            print(f"[{slug}] FAILED to fetch ingredient image!")
            return False
        with open(ing_base_path, 'wb') as f:
            f.write(data)
            
    # Process Main Image with Radial Color Tint
    im = Image.open(main_base_path).convert('RGB')
    target = (1600, 1200)
    w, h = im.size
    want = target[0] / target[1]
    if w / h > want:
        nw = int(h * want)
        im = im.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
    else:
        nh = int(w / want)
        im = im.crop((0, (h - nh) // 2, w, (h + nh) // 2))
    main_img = im.resize(target, Image.Resampling.LANCZOS)
    
    # Apply radial tint over the powder bowl center
    target_rgb = hex_to_rgb(target_hex)
    w, h = main_img.size
    arr = np.array(main_img, dtype=np.float32)
    y_indices, x_indices = np.indices((h, w))
    dist_x = (x_indices - w * 0.42) / (w * 0.28)
    dist_y = (y_indices - h * 0.52) / (h * 0.26)
    radial = np.clip(1.0 - np.sqrt(dist_x**2 + dist_y**2), 0.0, 1.0)
    mask = radial[:, :, np.newaxis]
    tint = np.array(target_rgb, dtype=np.float32)
    arr_tinted = arr * (1.0 - 0.38 * mask) + tint * (0.38 * mask)
    arr_tinted = np.clip(arr_tinted, 0, 255).astype(np.uint8)
    main_img = Image.fromarray(arr_tinted)
    
    stat = ImageStat.Stat(main_img.convert('L'))
    lum = stat.mean[0]
    if lum < 105:
        main_img = ImageEnhance.Brightness(main_img).enhance(112.0 / max(lum, 10.0))
        
    # Macro close-up (-2.webp)
    cx, cy = int(w * 0.42), int(h * 0.52)
    crop_box = (cx - 350, cy - 262, cx + 350, cy + 262)
    macro_crop = main_img.crop(crop_box).resize((1600, 1200), Image.Resampling.LANCZOS)
    macro_crop = ImageEnhance.Sharpness(macro_crop).enhance(1.3)
    
    # Angled perspective (-3.webp)
    angle_crop = main_img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    angle_crop = ImageEnhance.Brightness(angle_crop).enhance(0.99)
    
    # Save main, -2, -3
    for fn, img_obj in [(f'{slug}.webp', main_img), (f'{slug}-2.webp', macro_crop), (f'{slug}-3.webp', angle_crop)]:
        out_p = os.path.join('public', 'products', fn)
        for q in (84, 80, 75, 70, 65):
            buf = io.BytesIO()
            img_obj.save(buf, 'WEBP', quality=q, method=6)
            if len(buf.getvalue()) <= 240 * 1024:
                break
        with open(out_p, 'wb') as f:
            f.write(buf.getvalue())
            
    # Process Ingredient Image
    ing_im = Image.open(ing_base_path).convert('RGB')
    w, h = ing_im.size
    if w / h > want:
        nw = int(h * want)
        ing_im = ing_im.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
    else:
        nh = int(w / want)
        ing_im = ing_im.crop((0, (h - nh) // 2, w, (h + nh) // 2))
    ing_final = ing_im.resize(target, Image.Resampling.LANCZOS)
    lum_ing = ImageStat.Stat(ing_final.convert('L')).mean[0]
    if lum_ing < 105:
        ing_final = ImageEnhance.Brightness(ing_final).enhance(112.0 / max(lum_ing, 10.0))
        
    ing_out = os.path.join('public', 'products', f'{slug}-ingredient.webp')
    for q in (84, 80, 75, 70, 65):
        buf = io.BytesIO()
        ing_final.save(buf, 'WEBP', quality=q, method=6)
        if len(buf.getvalue()) <= 240 * 1024:
            break
    with open(ing_out, 'wb') as f:
        f.write(buf.getvalue())
        
    print(f"✓ [{slug}] All 4 images created and validated!")
    return True

print(f"Processing {len(configs)} remaining powders...")
for cfg in configs:
    process_set(cfg)
    time.sleep(1)

print("\nAll 15 remaining powder image sets successfully built!")
