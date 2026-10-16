import os
import json
import urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageFilter

os.makedirs('public/products', exist_ok=True)
brain_dir = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a'

# Map generated artifact images to product slugs
generated_map = {
    'groundnut-peanut-kernels': 'groundnut_peanuts_1792050177629.jpg',
    'sesame-seeds': 'sesame_seeds_1792050354701.jpg',
    'kabuli-chickpeas': 'kabuli_chickpeas_1792050373382.jpg',
    'brinjal-eggplant': 'brinjal_eggplant_1792050398294.jpg',
    'green-peas': 'green_peas_1792050417187.jpg',
    'drumstick-moringa': 'drumstick_moringa_1792050442168.jpg',
    'mustard-seeds': 'mustard_seeds_1792050465118.jpg',
    'star-anise': 'star_anise_1792050490959.jpg',
    'bay-leaf': 'bay_leaf_1792050514786.jpg',
    'makrana-white-marble': 'makrana_white_marble_1792050540859.jpg',
    'black-galaxy-granite': 'black_galaxy_granite_1792050584897.jpg',
    'pebbles-river-gravel': 'river_gravel_1792050611573.jpg',
    'bhagwa-pomegranate': 'pomegranate_1792050632991.jpg'
}

# Verified real image URLs for other products
verified_urls = {
    '1121-basmati-rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Khyma_and_Basmati_rice.jpg/1280px-Khyma_and_Basmati_rice.jpg',
    'milling-wheat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Wheat_close-up.jpg/1280px-Wheat_close-up.jpg',
    'yellow-maize': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Corn_cobs.jpg/1280px-Corn_cobs.jpg',
    'soybean': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Soybean.USDA.jpg/1280px-Soybean.USDA.jpg',
    'nashik-red-onion': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Onion_on_White.JPG/1280px-Onion_on_White.JPG',
    'potato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/1280px-Patates.jpg',
    'tomato': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/1280px-Tomato_je.jpg',
    'garlic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Garlic_Press_%26_Garlic.jpg/1280px-Garlic_Press_%26_Garlic.jpg',
    'ginger': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Ginger_Root.jpg/1280px-Ginger_Root.jpg',
    'green-chilli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Green_chilli.jpg/1280px-Green_chilli.jpg',
    'okra-lady-finger': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Hong_Kong_Okra_Aug_25_2012.JPG/1280px-Hong_Kong_Okra_Aug_25_2012.JPG',
    'cauliflower': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Chou-fleur_02.jpg/1280px-Chou-fleur_02.jpg',
    'cabbage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Cabbage_and_cross_section_on_white.jpg/1280px-Cabbage_and_cross_section_on_white.jpg',
    'carrot': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vegetable-Carrot-Bundle-wStalks.jpg/1280px-Vegetable-Carrot-Bundle-wStalks.jpg',
    'cavendish-banana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Cavendish_Banana_DS.jpg/1280px-Cavendish_Banana_DS.jpg',
    'lemon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/P1030323.JPG/1280px-P1030323.JPG',
    'pineapple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Pineapple_and_cross_section.jpg/1280px-Pineapple_and_cross_section.jpg',
    'black-pepper': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Black_peppercorns.jpg/1280px-Black_peppercorns.jpg',
    'coriander-seeds': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Coriandrum_sativum_seeds.jpg/1280px-Coriandrum_sativum_seeds.jpg',
    'green-cardamom': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/02017_0119_Kardamom%2C_Winter_in_den_Beskiden.jpg/1280px-02017_0119_Kardamom%2C_Winter_in_den_Beskiden.jpg',
    'cloves': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Cloves_dried.jpg/1280px-Cloves_dried.jpg',
    'cinnamon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Cinnamomum_verum_spices.jpg/1280px-Cinnamomum_verum_spices.jpg',
    'fennel-seeds': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Fennel_seed.jpg/1280px-Fennel_seed.jpg',
    'almonds': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg/1280px-Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg',
    'walnuts': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Walnuts_-_whole_and_open_with_halved_kernel.jpg/1280px-Walnuts_-_whole_and_open_with_halved_kernel.jpg',
    'raisins': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Raisins_01.jpg/1280px-Raisins_01.jpg',
    'dates': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Dried_dates.jpg/1280px-Dried_dates.jpg',
    'apricots': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dried_apricots.jpg/1280px-Dried_apricots.jpg',
    'cobblestones': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Paving_stones_Belgrade.jpg/1280px-Paving_stones_Belgrade.jpg'
}

def crop_and_save_4x3(img, out_path_base):
    w, h = img.size
    target_ratio = 4.0 / 3.0
    current_ratio = w / float(h)
    
    if current_ratio > target_ratio:
        # Too wide, crop horizontally
        new_w = int(h * target_ratio)
        offset = (w - new_w) // 2
        crop_box = (offset, 0, offset + new_w, h)
    else:
        # Too tall, crop vertically
        new_h = int(w / target_ratio)
        offset = (h - new_h) // 2
        crop_box = (0, offset, w, offset + new_h)
        
    cropped = img.crop(crop_box).resize((1200, 900), Image.Resampling.LANCZOS)
    cropped.save(f'{out_path_base}.webp', 'WEBP', quality=82)
    
    # Detail gallery 2 (closer zoom on center-left)
    w_c, h_c = cropped.size
    z1 = cropped.crop((int(w_c * 0.15), int(h_c * 0.15), int(w_c * 0.85), int(h_c * 0.85))).resize((1200, 900), Image.Resampling.LANCZOS)
    z1.save(f'{out_path_base}-2.webp', 'WEBP', quality=82)
    
    # Detail gallery 3 (angle crop with soft tone)
    z2 = cropped.crop((int(w_c * 0.25), int(h_c * 0.1), int(w_c * 0.95), int(h_c * 0.8))).resize((1200, 900), Image.Resampling.LANCZOS)
    z2.save(f'{out_path_base}-3.webp', 'WEBP', quality=82)

def generate_luxury_fallback(slug, name, category_name, origin, grade, out_path_base, variant=1):
    # Canvas
    img = Image.new('RGB', (1200, 900), (7, 26, 51))
    draw = ImageDraw.Draw(img)
    
    # Gradient navy
    for y in range(900):
        factor = y / 900.0
        r = int(7 * (1 - factor) + 4 * factor)
        g = int(26 * (1 - factor) + 14 * factor)
        b = int(51 * (1 - factor) + 31 * factor)
        draw.line([(0, y), (1200, y)], fill=(r, g, b))
        
    # Subtle geometric grid pattern in gold
    for x in range(100, 1100, 80):
        draw.line([(x, 60), (x, 840)], fill=(201, 151, 63, 15), width=1)
    for y in range(100, 800, 80):
        draw.line([(60, y), (1140, y)], fill=(201, 151, 63, 15), width=1)

    # Inset gold borders
    inset = 45
    draw.rectangle([inset, inset, 1200 - inset, 900 - inset], outline=(201, 151, 63), width=2)
    draw.rectangle([inset + 10, inset + 10, 1200 - inset - 10, 900 - inset - 10], outline=(154, 107, 31), width=1)
    
    # Corner brackets
    c_len = 32
    for x, y, dx, dy in [(inset, inset, 1, 1), (1200-inset, inset, -1, 1), (inset, 900-inset, 1, -1), (1200-inset, 900-inset, -1, -1)]:
        draw.line([(x, y + dy*10), (x + dx*c_len, y + dy*10)], fill=(242, 200, 110), width=3)
        draw.line([(x + dx*10, y), (x + dx*10, y + dy*c_len)], fill=(242, 200, 110), width=3)

    # Fonts
    font_brand = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', 20)
    font_cat = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', 26)
    font_title = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 52 if len(name) < 22 else 44)
    font_spec = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', 22)
    font_badge = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 15)

    # Brand Header
    draw.text((600, 150), 'AURELIAN INTERNATIONAL · EXPORT GRADE', fill=(201, 151, 63), font=font_brand, anchor='mm')
    
    # Category Tag Pill
    pill_w = 280
    draw.rounded_rectangle([600 - pill_w//2, 215, 600 + pill_w//2, 260], radius=12, fill=(14, 42, 79), outline=(201, 151, 63), width=1)
    draw.text((600, 237), category_name.upper(), fill=(242, 200, 110), font=font_cat, anchor='mm')

    # Main Product Name
    title_text = name.upper()
    if variant == 2:
        title_text += " [MACRO SPEC]"
    elif variant == 3:
        title_text += " [BATCH SPEC]"
        
    draw.text((600, 410), title_text, fill=(250, 248, 243), font=font_title, anchor='mm')
    
    # Gold decorative separator
    draw.line([(450, 480), (750, 480)], fill=(201, 151, 63), width=2)
    draw.polygon([(600, 476), (605, 480), (600, 484), (595, 480)], fill=(242, 200, 110))

    # Origin & Grade
    draw.text((600, 530), f"ORIGIN: {origin.upper()}", fill=(217, 221, 227), font=font_spec, anchor='mm')
    draw.text((600, 580), f"GRADE / SPEC: {grade.upper()}", fill=(201, 151, 63), font=font_spec, anchor='mm')

    # Bottom Seal Badge
    draw.rounded_rectangle([350, 680, 850, 735], radius=8, fill=(7, 26, 51), outline=(201, 151, 63), width=1)
    draw.text((600, 707), "GUARANTEED EXPORT QUALITY · PHYTOSANITARY CERTIFIED", fill=(242, 200, 110), font=font_badge, anchor='mm')

    img.save(f'{out_path_base}{"" if variant == 1 else f"-{variant}"}.webp', 'WEBP', quality=85)

print("Starting image processing pipeline...")
