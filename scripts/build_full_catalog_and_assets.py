import os
import json
import urllib.request
from PIL import Image, ImageDraw, ImageFont

os.makedirs('public/products', exist_ok=True)
brain_dir = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a'

# Generated images from artifact dir
generated_map = {
    'groundnut-peanut-kernels': os.path.join(brain_dir, 'groundnut_peanuts_1792050177629.jpg'),
    'sesame-seeds': os.path.join(brain_dir, 'sesame_seeds_1792050354701.jpg'),
    'kabuli-chickpeas': os.path.join(brain_dir, 'kabuli_chickpeas_1792050373382.jpg'),
    'brinjal-eggplant': os.path.join(brain_dir, 'brinjal_eggplant_1792050398294.jpg'),
    'green-peas': os.path.join(brain_dir, 'green_peas_1792050417187.jpg'),
    'drumstick-moringa': os.path.join(brain_dir, 'drumstick_moringa_1792050442168.jpg'),
    'mustard-seeds': os.path.join(brain_dir, 'mustard_seeds_1792050465118.jpg'),
    'star-anise': os.path.join(brain_dir, 'star_anise_1792050490959.jpg'),
    'bay-leaf': os.path.join(brain_dir, 'bay_leaf_1792050514786.jpg'),
    'makrana-white-marble': os.path.join(brain_dir, 'makrana_white_marble_1792050540859.jpg'),
    'black-galaxy-granite': os.path.join(brain_dir, 'black_galaxy_granite_1792050584897.jpg'),
    'pebbles-river-gravel': os.path.join(brain_dir, 'river_gravel_1792050611573.jpg'),
    'bhagwa-pomegranate': os.path.join(brain_dir, 'pomegranate_1792050632991.jpg')
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

# Local existing assets that are 100% accurate
local_accurate = {
    'turmeric': 'public/images/turmeric.jpg',
    'cumin-seeds': 'public/images/cumin.jpg'
}

def crop_and_save_4x3(img, out_path_base):
    w, h = img.size
    target_ratio = 4.0 / 3.0
    current_ratio = w / float(h)
    
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        offset = (w - new_w) // 2
        crop_box = (offset, 0, offset + new_w, h)
    else:
        new_h = int(w / target_ratio)
        offset = (h - new_h) // 2
        crop_box = (0, offset, w, offset + new_h)
        
    cropped = img.crop(crop_box).resize((1200, 900), Image.Resampling.LANCZOS)
    cropped.save(f'{out_path_base}.webp', 'WEBP', quality=82)
    
    # Detail gallery 2 (closer zoom on center-left)
    w_c, h_c = cropped.size
    z1 = cropped.crop((int(w_c * 0.12), int(h_c * 0.12), int(w_c * 0.88), int(h_c * 0.88))).resize((1200, 900), Image.Resampling.LANCZOS)
    z1.save(f'{out_path_base}-2.webp', 'WEBP', quality=82)
    
    # Detail gallery 3 (angle crop with soft tone)
    z2 = cropped.crop((int(w_c * 0.2), int(h_c * 0.08), int(w_c * 0.95), int(h_c * 0.82))).resize((1200, 900), Image.Resampling.LANCZOS)
    z2.save(f'{out_path_base}-3.webp', 'WEBP', quality=82)

def generate_luxury_fallback(slug, name, category_name, origin, grade, out_path_base, variant=1):
    img = Image.new('RGB', (1200, 900), (7, 26, 51))
    draw = ImageDraw.Draw(img)
    
    # Gradient navy
    for y in range(900):
        factor = y / 900.0
        r = int(7 * (1 - factor) + 4 * factor)
        g = int(26 * (1 - factor) + 14 * factor)
        b = int(51 * (1 - factor) + 31 * factor)
        draw.line([(0, y), (1200, y)], fill=(r, g, b))
        
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
    font_title = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 50 if len(name) < 22 else 42)
    font_spec = ImageFont.truetype('C:/Windows/Fonts/georgia.ttf', 22)
    font_badge = ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf', 15)

    # Brand Header
    draw.text((600, 150), 'AURELIAN INTERNATIONAL · EXPORT GRADE', fill=(201, 151, 63), font=font_brand, anchor='mm')
    
    # Category Tag Pill
    pill_w = 320
    draw.rounded_rectangle([600 - pill_w//2, 215, 600 + pill_w//2, 265], radius=12, fill=(14, 42, 79), outline=(201, 151, 63), width=1)
    draw.text((600, 240), category_name.upper(), fill=(242, 200, 110), font=font_cat, anchor='mm')

    # Main Product Name
    title_text = name.upper()
    if variant == 2:
        title_text += " (SPEC SHEET)"
    elif variant == 3:
        title_text += " (EXPORT LOT)"
        
    draw.text((600, 410), title_text, fill=(250, 248, 243), font=font_title, anchor='mm')
    
    # Gold decorative separator
    draw.line([(420, 480), (780, 480)], fill=(201, 151, 63), width=2)
    draw.polygon([(600, 476), (606, 480), (600, 484), (594, 480)], fill=(242, 200, 110))

    # Origin & Grade
    draw.text((600, 530), f"ORIGIN: {origin.upper()}", fill=(217, 221, 227), font=font_spec, anchor='mm')
    draw.text((600, 580), f"GRADE / SPEC: {grade.upper()}", fill=(201, 151, 63), font=font_spec, anchor='mm')

    # Bottom Seal Badge
    draw.rounded_rectangle([330, 680, 870, 735], radius=8, fill=(7, 26, 51), outline=(201, 151, 63), width=1)
    draw.text((600, 707), "GUARANTEED EXPORT QUALITY · PHYTOSANITARY CERTIFIED", fill=(242, 200, 110), font=font_badge, anchor='mm')

    img.save(f'{out_path_base}{"" if variant == 1 else f"-{variant}"}.webp', 'WEBP', quality=85)

# The Approved 78 Catalog
catalog_data = [
    {
        "slug": "agriculture",
        "name": "Agriculture",
        "headline": "Grains, Pulses & Oilseeds",
        "blurb": "Grains, pulses and oilseeds from India's most fertile belts, machine-cleaned, optical-sorted and packaged to stringent international trade standards.",
        "image": "/products/1121-basmati-rice.webp",
        "products": [
            {
                "slug": "1121-basmati-rice",
                "name": "1121 Basmati Rice",
                "origin": "Punjab & Haryana",
                "grade": "1121 Steam / Raw / Sella (8.35mm+ Average Grain Length)",
                "packaging": "5–40 kg Jute / Non-Woven PP bags",
                "moq": "1 × 20ft FCL (25 MT)",
                "shelfLife": "24 months",
                "certifications": ["APEDA", "ISO 22000", "FSSAI", "BRCGS"],
                "description": "Extra-long grain aromatic basmati rice prized for elongation ratio exceeding 2.5x upon cooking, pristine pearl-white kernels, and sweet natural fragrance.",
                "alt": "Aged 1121 Indian Basmati Rice extra-long slender grains"
            },
            {
                "slug": "1509-basmati-rice",
                "name": "1509 Basmati Rice",
                "origin": "Punjab & Western Uttar Pradesh",
                "grade": "1509 Golden / White Sella (8.40mm+ Grain Length)",
                "packaging": "10–50 kg BOPP / PP Bags",
                "moq": "1 × 20ft FCL (25 MT)",
                "shelfLife": "24 months",
                "certifications": ["APEDA", "FSSAI", "ISO 22000"],
                "description": "High-yielding premium long grain basmati with remarkable elongation, smooth finish, and fast cooking time, favored across Middle Eastern and European food service.",
                "alt": "High quality 1509 Basmati Rice milled grains"
            },
            {
                "slug": "sella-basmati-rice",
                "name": "Sella Basmati Rice",
                "origin": "Punjab & Haryana",
                "grade": "Golden & Creamy Parboiled Basmati Rice",
                "packaging": "25–50 kg Jute & Polypropylene Sacks",
                "moq": "1 × 20ft FCL (25 MT)",
                "shelfLife": "24 months",
                "certifications": ["APEDA", "FSSAI", "HACCP"],
                "description": "Hydrothermally processed parboiled basmati with hard kernels that resist breakage, lock in essential nutrients, and cook into separate non-sticky grains.",
                "alt": "Golden Sella parboiled basmati rice grains"
            },
            {
                "slug": "non-basmati-white-rice-ir64",
                "name": "Non-Basmati White Rice (IR64)",
                "origin": "Andhra Pradesh & West Bengal",
                "grade": "IR64 Raw & Parboiled (5% / 25% Broken)",
                "packaging": "25–50 kg PP bags / Big Bags",
                "moq": "1 × 20ft FCL (26 MT)",
                "shelfLife": "18 months",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Long grain Indian non-basmati rice celebrated for consistent culinary texture, high caloric value, and rigorous sorting for broken percentage control.",
                "alt": "IR64 Non-Basmati polished white rice in bowl"
            },
            {
                "slug": "sona-masoori-rice",
                "name": "Sona Masoori Rice",
                "origin": "Andhra Pradesh & Karnataka",
                "grade": "Medium Grain Raw Aromatic (Aged 12+ Months)",
                "packaging": "10–25 kg Poly Woven Bags",
                "moq": "1 × 20ft FCL (25 MT)",
                "shelfLife": "24 months",
                "certifications": ["APEDA", "FSSAI", "ISO 9001"],
                "description": "Lightweight, low-starch aromatic medium-grain rice cultivated in the fertile Tungabhadra basin, easy to digest and ideal for daily dietary consumption.",
                "alt": "Sona Masoori lightweight raw white rice"
            },
            {
                "slug": "milling-wheat",
                "name": "Milling Wheat",
                "origin": "Madhya Pradesh & Punjab",
                "grade": "Hard Golden Wheat (Protein 12–14%, Moisture < 12%)",
                "packaging": "50 kg PP bags / Bulk containerized liner",
                "moq": "1 × 20ft FCL (25 MT)",
                "shelfLife": "12 months",
                "certifications": ["APEDA", "FSSAI", "Phytosanitary"],
                "description": "Golden hard milling wheat with superior gluten strength, high hectoliter weight, and minimal dockage, engineered for premier bakery and semolina production.",
                "alt": "Golden milling wheat grain kernels closeup"
            },
            {
                "slug": "yellow-maize",
                "name": "Yellow Maize",
                "origin": "Bihar, Karnataka & Maharashtra",
                "grade": "Food & Feed Grade (Aflatoxin < 20 ppb, Moisture < 14%)",
                "packaging": "50 kg PP bags / Bulk in 20ft containers",
                "moq": "1 × 20ft FCL (24 MT)",
                "shelfLife": "12 months",
                "certifications": ["APEDA", "Non-GMO", "FSSAI"],
                "description": "Sun-dried bright yellow corn kernels free from live weevils or mold, providing exceptional energy density for poultry feed formulation and industrial starch processing.",
                "alt": "Bright yellow maize corn kernels"
            },
            {
                "slug": "bajra-pearl-millet",
                "name": "Bajra (Pearl Millet)",
                "origin": "Rajasthan & Gujarat",
                "grade": "Machine Cleaned Bold Grey Grains (Purity 99%)",
                "packaging": "25–50 kg PP Woven Bags",
                "moq": "1 × 20ft FCL (22 MT)",
                "shelfLife": "12 months",
                "certifications": ["APEDA", "FSSAI", "Organic Available"],
                "description": "Nutrient-rich ancient cereal with high dietary iron, magnesium, and resistant starch, sourced from drought-resistant western Indian agrarian belts.",
                "alt": "Machine-cleaned bold Pearl Millet Bajra grains"
            },
            {
                "slug": "soybean",
                "name": "Soybean",
                "origin": "Madhya Pradesh & Maharashtra",
                "grade": "Non-GMO Yellow Food Grade (Protein 38%+, Oil 18%)",
                "packaging": "50 kg PP bags / Jumbo Bags",
                "moq": "1 × 20ft FCL (24 MT)",
                "shelfLife": "12 months",
                "certifications": ["FSSAI", "Non-GMO Certified"],
                "description": "Selected clean yellow soybeans with verified non-GMO provenance, low splits, and uniform size for soymilk, tofu, and high-protein nutrition products.",
                "alt": "Non-GMO golden yellow soybeans in wooden bowl"
            },
            {
                "slug": "groundnut-peanut-kernels",
                "name": "Groundnut (Peanut Kernels)",
                "origin": "Saurashtra, Gujarat",
                "grade": "Bold (40/50, 50/60) & Java (60/70, 70/80)",
                "packaging": "25–50 kg Jute bags / Vacuum packed cartons",
                "moq": "1 × 20ft FCL (19 MT)",
                "shelfLife": "12 months",
                "certifications": ["APEDA", "IOPEPC", "FSSAI", "SGS Tested"],
                "description": "Hulled peanut kernels carefully sorted for uniform size, rich nutty sweetness, high oil content, and stringent European aflatoxin limits (< 4 ppb).",
                "alt": "Raw shelled groundnut peanut kernels with reddish skin in dark bowl"
            },
            {
                "slug": "sesame-seeds",
                "name": "Sesame Seeds",
                "origin": "Gujarat & Rajasthan",
                "grade": "Natural White 99/1 & Auto Hulled 99.95% Purity",
                "packaging": "25–50 kg Multiwall Paper / PP Bags",
                "moq": "1 × 20ft FCL (19 MT)",
                "shelfLife": "12 months",
                "certifications": ["APEDA", "FSSAI", "Kosher", "Halal"],
                "description": "Premium sortex-cleaned white sesame seeds boasting rich aroma, minimum 48% oil content, and flawless uniform white color for tahini, bakery and confectionery.",
                "alt": "Pearly white natural sesame seeds in ceramic bowl"
            },
            {
                "slug": "kabuli-chickpeas",
                "name": "Kabuli Chickpeas",
                "origin": "Madhya Pradesh & Maharashtra",
                "grade": "Bold 42-44, 44-46 & 75-80 Count / Ounce",
                "packaging": "25–50 kg PP Bags / Poly Bags",
                "moq": "1 × 20ft FCL (24 MT)",
                "shelfLife": "24 months",
                "certifications": ["APEDA", "FSSAI", "Phytosanitary"],
                "description": "Large-caliber cream-colored garbanzo beans machine cleaned and gravity separated for canning, salad packaging, and authentic hummus manufacturing.",
                "alt": "Whole dried Kabuli chickpeas garbanzo beans in wooden bowl"
            },
            {
                "slug": "toor-dal",
                "name": "Toor Dal (Pigeon Pea)",
                "origin": "Maharashtra & Karnataka",
                "grade": "Fatka Unpolished / Machine Cleaned Split",
                "packaging": "25–50 kg Brand Printed PP Bags",
                "moq": "1 × 20ft FCL (24 MT)",
                "shelfLife": "18 months",
                "certifications": ["FSSAI", "APEDA", "AGMARK"],
                "description": "Dehusked split yellow pigeon peas processed without chemical polish or artificial colors, delivering high protein and creamy texture to culinary applications.",
                "alt": "Yellow split Toor Dal pigeon peas in traditional bowl"
            },
            {
                "slug": "moong-dal",
                "name": "Moong Dal (Green Gram)",
                "origin": "Rajasthan & Gujarat",
                "grade": "Yellow Split & Bold Green Whole Moong",
                "packaging": "25–50 kg PP Bags",
                "moq": "1 × 20ft FCL (24 MT)",
                "shelfLife": "18 months",
                "certifications": ["FSSAI", "APEDA", "ISO 22000"],
                "description": "Easily digestible premium green gram and bright yellow split lentils, laser sorted for uniform kernel size, zero stones, and maximum nutritional retention.",
                "alt": "Golden yellow split Moong Dal lentils"
            },
            {
                "slug": "masoor-dal",
                "name": "Masoor Dal (Red Lentil)",
                "origin": "Madhya Pradesh & Uttar Pradesh",
                "grade": "Bold Football & Polished Split Red Masoor",
                "packaging": "25–50 kg Polypropylene Sacks",
                "moq": "1 × 20ft FCL (25 MT)",
                "shelfLife": "24 months",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Vibrant salmon-orange split red lentils, fast-cooking and packed with dietary iron, fiber, and plant-based protein for soups, curries and food purées.",
                "alt": "Vibrant salmon-orange split Masoor Dal red lentils"
            },
            {
                "slug": "urad-dal",
                "name": "Urad Dal (Black Gram)",
                "origin": "Andhra Pradesh & Maharashtra",
                "grade": "Whole Black Matpe & Split White Skinned Urad",
                "packaging": "25–50 kg Poly Bags",
                "moq": "1 × 20ft FCL (24 MT)",
                "shelfLife": "18 months",
                "certifications": ["APEDA", "FSSAI", "AGMARK"],
                "description": "Dense, protein-rich black gram pulses sorted for exceptional fermentation properties, binding quality, and creamy emulsion in batter formulations.",
                "alt": "Polished black gram and split white Urad Dal"
            }
        ]
    },
    {
        "slug": "fresh-vegetables",
        "name": "Fresh Vegetables",
        "headline": "Farm-Fresh Export Vegetables",
        "blurb": "Field-fresh vegetables from Maharashtra and Gujarat, harvest-cooled, grading-line sorted and shipped in temperature-controlled reefer containers.",
        "image": "/products/nashik-red-onion.webp",
        "products": [
            {
                "slug": "nashik-red-onion",
                "name": "Nashik Red Onion",
                "origin": "Nashik, Maharashtra",
                "grade": "45mm+, 55mm+ Export Graded Bulbs",
                "packaging": "5, 10, 25 kg Red Mesh / Leno Bags",
                "moq": "1 × 40ft Reefer FCL (29 MT)",
                "shelfLife": "60–90 days (1–2°C, 65% RH)",
                "certifications": ["APEDA", "GlobalGAP", "Phytosanitary"],
                "description": "World-renowned Maharashtra red onions with tight shiny skins, sharp pungent flavor, high solid content, and supreme transit dormancy.",
                "alt": "Fresh harvested Nashik Red Onions with dry papery skin"
            },
            {
                "slug": "white-onion",
                "name": "White Onion",
                "origin": "Bhavnagar & Mahuva, Gujarat",
                "grade": "Table & Dehydration Grade 50mm+",
                "packaging": "10, 25 kg Leno Mesh Bags",
                "moq": "1 × 40ft Reefer FCL (28 MT)",
                "shelfLife": "45–60 days",
                "certifications": ["APEDA", "GlobalGAP"],
                "description": "High-total-soluble-solids white onions cultivated across Saurashtra, offering mild sweetness, crisp flesh, and optimal suitability for dehydration flakes.",
                "alt": "Clean whole white onion bulbs"
            },
            {
                "slug": "potato",
                "name": "Potato",
                "origin": "Agra, Uttar Pradesh & Gujarat",
                "grade": "Lady Rosetta / Kufri Jyoti / Chipsona (45mm–65mm)",
                "packaging": "25–50 kg Jute & Mesh Bags",
                "moq": "1 × 40ft Reefer FCL (29 MT)",
                "shelfLife": "90–120 days (7–10°C)",
                "certifications": ["APEDA", "Phytosanitary"],
                "description": "Firm table and processing potatoes with smooth skin, shallow eyes, low reducing sugars, and zero internal defects, ideal for fresh cooking and crisp processing.",
                "alt": "Clean raw whole potatoes on rustic background"
            },
            {
                "slug": "tomato",
                "name": "Tomato",
                "origin": "Maharashtra & Karnataka",
                "grade": "Firm Red Semi-Ripe (55–65mm Diameter)",
                "packaging": "5–10 kg Ventilated Corrugated Cartons",
                "moq": "1 × 40ft Reefer FCL (22 MT)",
                "shelfLife": "21–28 days (10–12°C)",
                "certifications": ["GlobalGAP", "APEDA"],
                "description": "Greenhouse and open-field vine-ripened tomatoes picked at turning stage to guarantee thick pericarp walls, firm texture, and balanced brix upon destination arrival.",
                "alt": "Fresh vine-ripened red tomatoes"
            },
            {
                "slug": "garlic",
                "name": "Garlic",
                "origin": "Mandsaur, Madhya Pradesh & Gujarat",
                "grade": "Pure White Bold 35mm+, 45mm+ Cloves",
                "packaging": "10–20 kg Mesh Bags / Small Mesh Sleeves",
                "moq": "1 × 40ft Reefer FCL (26 MT)",
                "shelfLife": "6 months (0–1°C, 65% RH)",
                "certifications": ["APEDA", "Phytosanitary"],
                "description": "Aromatic white garlic bulbs with tight protective skins, intense pungency, and robust allicin levels, sorted carefully to eliminate loose cloves and sun-scald.",
                "alt": "Whole white garlic bulbs on stone slab"
            },
            {
                "slug": "ginger",
                "name": "Ginger",
                "origin": "Wayanad, Kerala & Assam",
                "grade": "Fresh Washed Cochin Grade (150g+ Rhizome)",
                "packaging": "13.6 kg / 30 lb Ventilated Plastic Crates & Cartons",
                "moq": "1 × 40ft Reefer FCL (24 MT)",
                "shelfLife": "45–60 days (12–14°C)",
                "certifications": ["APEDA", "GlobalGAP", "Phytosanitary"],
                "description": "Plump, washed Indian fresh ginger rhizomes free from soil, showing fibrous golden interior, spicy kick, and smooth outer skin for international supermarkets.",
                "alt": "Freshly washed ginger rhizomes on wooden board"
            },
            {
                "slug": "green-chilli",
                "name": "Green Chilli",
                "origin": "Guntur, Andhra Pradesh & Kolhapur",
                "grade": "G4 / Bullet / Jwala (6–9cm Length)",
                "packaging": "4–5 kg Ventilated CFB Cartons with Air Holes",
                "moq": "Air Freight & Reefer FCL",
                "shelfLife": "14–21 days (8–10°C)",
                "certifications": ["APEDA", "GlobalGAP"],
                "description": "Crisp, pungent fresh green chillies harvested at peak chlorophyll saturation with tight stems, vibrant green color, and high heat profile (SHU 25,000–50,000).",
                "alt": "Fresh vibrant green chillies with calyx stems"
            },
            {
                "slug": "okra-lady-finger",
                "name": "Okra (Lady Finger)",
                "origin": "Gujarat & Maharashtra",
                "grade": "Tender Green 7–10cm Length (Blemish Free)",
                "packaging": "4–5 kg Telescopic Cartons",
                "moq": "Air Freight / Reefer FCL",
                "shelfLife": "10–14 days (10–12°C)",
                "certifications": ["GlobalGAP", "APEDA"],
                "description": "Tender, ridge-defined green okra pods harvested at dawn, pre-cooled immediately, and air-freighted to prevent pod fiberization and tip discoloration.",
                "alt": "Fresh tender green okra pods lady fingers"
            },
            {
                "slug": "brinjal-eggplant",
                "name": "Brinjal (Eggplant)",
                "origin": "Maharashtra & Gujarat",
                "grade": "Glossy Dark Purple Oval / Round (150–250g)",
                "packaging": "5–10 kg Corrugated Boxes with dividers",
                "moq": "Air Freight / Reefer FCL",
                "shelfLife": "14–18 days (10–12°C)",
                "certifications": ["APEDA", "GlobalGAP"],
                "description": "Glossy, deep-purple Indian aubergines with firm white flesh, minimal seed development, and fresh green calyx, selected for culinary roasting and curries.",
                "alt": "Glossy deep purple Indian brinjals eggplants with fresh green calyx"
            },
            {
                "slug": "cauliflower",
                "name": "Cauliflower",
                "origin": "Punjab & Haryana",
                "grade": "Snow White Compact Curds (600–900g, Jacket Pack)",
                "packaging": "10–12 kg Telescopic Master Cartons",
                "moq": "1 × 40ft Reefer FCL (18 MT)",
                "shelfLife": "21–28 days (0–2°C)",
                "certifications": ["GlobalGAP", "APEDA"],
                "description": "Densely packed snow-white cauliflower heads protected by trimmed outer wrapper leaves, free from riciness, yellowing, or mechanical bruising.",
                "alt": "Fresh snow white cauliflower curd with green leaves"
            },
            {
                "slug": "cabbage",
                "name": "Cabbage",
                "origin": "Maharashtra & West Bengal",
                "grade": "Dense Round Green Heads (800g–1.5kg)",
                "packaging": "15–20 kg Mesh Bags / Master Cartons",
                "moq": "1 × 40ft Reefer FCL (25 MT)",
                "shelfLife": "45–60 days (0–2°C)",
                "certifications": ["APEDA", "Phytosanitary"],
                "description": "Compact, heavy green cabbage heads with crisp overlapping leaves, carefully harvested and trimmed to deliver exceptional refrigerated transit longevity.",
                "alt": "Fresh compact green cabbage head"
            },
            {
                "slug": "carrot",
                "name": "Carrot",
                "origin": "Rajasthan & Punjab",
                "grade": "Red Delhi & Nantes Orange (15–20cm, Topped & Washed)",
                "packaging": "10, 20 kg Poly Bags inside Cartons",
                "moq": "1 × 40ft Reefer FCL (26 MT)",
                "shelfLife": "60–90 days (0–1°C)",
                "certifications": ["APEDA", "GlobalGAP"],
                "description": "Hydro-cooled and polished sweet red and orange carrots with crisp core, high beta-carotene, and uniform conical shape, free from root branching.",
                "alt": "Washed fresh crisp red and orange carrots"
            },
            {
                "slug": "green-peas",
                "name": "Green Peas",
                "origin": "Punjab & Madhya Pradesh",
                "grade": "Fresh Pods & IQF Blast Frozen Grade A",
                "packaging": "5–10 kg Polylined Cartons / 1 kg IQF Pouches",
                "moq": "1 × 40ft Reefer FCL (22 MT)",
                "shelfLife": "14 days fresh / 24 months IQF (-18°C)",
                "certifications": ["BRCGS", "FSSAI", "APEDA"],
                "description": "Plump, tender green peas with sweet natural sugars, available freshly harvested in pods or individually quick-frozen within 4 hours of farm picking.",
                "alt": "Fresh tender green peas and pods in rustic bowl"
            },
            {
                "slug": "drumstick-moringa",
                "name": "Drumstick (Moringa)",
                "origin": "Tamil Nadu & Andhra Pradesh",
                "grade": "Tender Slender Pods 45–60cm Length",
                "packaging": "5, 10 kg Ventilated Cartons with protective straw",
                "moq": "Air Freight & Reefer FCL",
                "shelfLife": "12–16 days (8–10°C)",
                "certifications": ["APEDA", "GlobalGAP", "Phytosanitary"],
                "description": "Fresh Moringa oleifera pods handpicked at slender maturity to ensure succulent inner pulp, delicate seeds, and rich antioxidant properties.",
                "alt": "Fresh green drumsticks moringa pods tied with twine"
            }
        ]
    },
    {
        "slug": "fresh-fruits",
        "name": "Fresh Fruits",
        "headline": "Orchard Fresh Indian Fruits",
        "blurb": "GI-tagged and orchard-fresh Indian fruits, pre-cooled at packhouses, hot-water treated, and dispatched via maritime reefers and direct air cargo.",
        "image": "/products/cavendish-banana.webp",
        "products": [
            {
                "slug": "cavendish-banana",
                "name": "Cavendish Banana",
                "origin": "Jalgaon, Maharashtra & Andhra Pradesh",
                "grade": "G9 Grand Naine Export Grade (Hands 4–7, Caliber 39–46)",
                "packaging": "13.5 kg / 18.2 kg Telescopic Bottom Vent Cartons",
                "moq": "1 × 40ft Reefer FCL (1540 Cartons)",
                "shelfLife": "30–35 days green life (13.5°C)",
                "certifications": ["GlobalGAP", "APEDA", "Phytosanitary"],
                "description": "Vibrant green Grand Naine Cavendish bananas packed in vacuum polyliners, ethylene-scavenged, and refrigerated for uniform artificial ripening overseas.",
                "alt": "Export grade green Cavendish banana hands and cluster"
            },
            {
                "slug": "alphonso-mango",
                "name": "Alphonso Mango",
                "origin": "Ratnagiri & Devgad, Maharashtra",
                "grade": "GI Tagged Hand-Harvested 200–300g per piece",
                "packaging": "3.5 kg Open Top Corrugated Cartons (12 Count)",
                "moq": "Air Freight Consignments (500 kg+)",
                "shelfLife": "14–21 days post-harvest",
                "certifications": ["GI Tagged", "APEDA", "USDA / EU VHT Approved"],
                "description": "The undisputed King of Mangoes, world-renowned for buttery non-fibrous golden pulp, royal saffron hue, and captivating tropical fragrance.",
                "alt": "Golden ripe Alphonso mangoes from Ratnagiri"
            },
            {
                "slug": "kesar-mango",
                "name": "Kesar Mango",
                "origin": "Gir, Gujarat",
                "grade": "GI Tagged Queen Mango (220–280g per fruit)",
                "packaging": "3.5 kg / 5 kg Export Master Boxes",
                "moq": "Air Freight & Sea Reefer FCL",
                "shelfLife": "16–22 days",
                "certifications": ["GI Tagged", "APEDA", "Phytosanitary"],
                "description": "Famous Queen of Mangoes from the foothills of Gir forest, featuring intense saffron pulp color, high natural brix (20°+), and luscious sweetness.",
                "alt": "Ripe sweet Gir Kesar mangoes on wooden tray"
            },
            {
                "slug": "bhagwa-pomegranate",
                "name": "Bhagwa Pomegranate",
                "origin": "Solapur, Maharashtra",
                "grade": "Ruby Red Glossy Skin 250–400g (Grade A Export)",
                "packaging": "3.5 kg / 4 kg Flat Cartons with net foam sleeves",
                "moq": "1 × 40ft Reefer FCL (20 MT)",
                "shelfLife": "60–75 days (5°C, 90% RH)",
                "certifications": ["GlobalGAP", "APEDA", "Phytosanitary"],
                "description": "Flagship Indian Bhagwa pomegranates with deep crimson glossy skin, soft edible seeds, and succulent dark-red arils with balanced acidity.",
                "alt": "Whole ripe ruby-red Bhagwa pomegranate and juicy cut arils"
            },
            {
                "slug": "thompson-seedless-grapes",
                "name": "Thompson Seedless Grapes",
                "origin": "Nashik, Maharashtra",
                "grade": "Brix 16°+, Berry Diameter 16mm–18mm",
                "packaging": "5 kg Cartons (10 × 500g Punnets / Pouch Bags)",
                "moq": "1 × 40ft Reefer FCL (2400 Cartons)",
                "shelfLife": "45–60 days (-0.5 to 0°C with SO2 pads)",
                "certifications": ["GlobalGAP", "GrapeNet Traceable", "APEDA"],
                "description": "Crisp green Thompson seedless grapes cultivated in Maharashtra's grape capital, sulfur-pad protected, and pesticide-residue certified to EU MRL levels.",
                "alt": "Crisp green Thompson seedless grape bunch"
            },
            {
                "slug": "nagpur-orange",
                "name": "Nagpur Orange",
                "origin": "Nagpur & Amravati, Maharashtra",
                "grade": "Mandarin Sweet Oranges 65–75mm Diameter",
                "packaging": "10, 15 kg Telescopic Cartons",
                "moq": "1 × 40ft Reefer FCL (24 MT)",
                "shelfLife": "30–45 days (5–7°C)",
                "certifications": ["GI Tagged", "APEDA"],
                "description": "GI-tagged loose-jacket mandarin oranges packed with sweet-tangy juice, vibrant pebbled peel, and high natural ascorbic acid content.",
                "alt": "Fresh Nagpur mandarin oranges with green leaf"
            },
            {
                "slug": "lemon",
                "name": "Lemon",
                "origin": "Nellore, Andhra Pradesh & Gujarat",
                "grade": "Kagzi Juicy Seedless Thin Skin (35–45mm)",
                "packaging": "6, 10 kg Corrugated Boxes",
                "moq": "Air Freight & Reefer FCL",
                "shelfLife": "30–40 days (8–10°C)",
                "certifications": ["APEDA", "Phytosanitary"],
                "description": "Thin-skinned, highly aromatic Indian Kagzi lemons bursting with acidic juice (45%+ recovery) and essential peel oils for culinary and beverage blending.",
                "alt": "Fresh juicy thin-skinned yellow Kagzi lemons"
            },
            {
                "slug": "papaya",
                "name": "Papaya",
                "origin": "Karnataka & Maharashtra",
                "grade": "Red Lady Taiwan Sweet 786 (1.0–1.8 kg)",
                "packaging": "6–8 kg Cartons with foam protection",
                "moq": "Air Freight & Reefer FCL",
                "shelfLife": "18–24 days (10–12°C)",
                "certifications": ["APEDA", "GlobalGAP"],
                "description": "Firm-fleshed oblong Red Lady papayas with deep reddish-orange pulp, sweet musky aroma, thick skin for transit protection, and high papain enzymes.",
                "alt": "Ripe sweet Red Lady papaya sliced showing red pulp"
            },
            {
                "slug": "pineapple",
                "name": "Pineapple",
                "origin": "Vazhakulam, Kerala & Assam",
                "grade": "GI Tagged Queen & MD2 Sweet Golden (1.2–1.8kg)",
                "packaging": "12 kg Horizontal / Vertical Cartons (6–8 Count)",
                "moq": "1 × 40ft Reefer FCL (18 MT)",
                "shelfLife": "21–28 days (8–10°C)",
                "certifications": ["GI Tagged", "APEDA", "Phytosanitary"],
                "description": "GI-certified Vazhakulam Queen pineapples possessing pleasant golden pulp, fragrant aroma, crisp core, and rich sugar-acid balance.",
                "alt": "Golden ripe sweet pineapple with crown"
            }
        ]
    },
    {
        "slug": "spices",
        "name": "Spices",
        "headline": "Whole & Ground Spices",
        "blurb": "Whole and ground Indian spices from Kerala, Rajasthan, and Andhra Pradesh, laboratory-certified by the Spices Board of India for purity and essential oils.",
        "image": "/products/turmeric.webp",
        "products": [
            {
                "slug": "turmeric",
                "name": "Turmeric (Finger & Powder)",
                "origin": "Erode, Tamil Nadu & Nizamabad",
                "grade": "Double Polished Fingers / Powder (Curcumin 3.0%–5.5%)",
                "packaging": "25, 50 kg Jute Bags / Multilayer Paper Sacks",
                "moq": "1 × 20ft FCL (18 MT)",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI", "ISO 22000", "Halal"],
                "description": "Deep golden-yellow double-polished turmeric fingers and micro-pulverized powder with high bioactive curcumin content, low moisture, and zero lead chromate.",
                "alt": "Polished whole turmeric fingers and ground turmeric powder"
            },
            {
                "slug": "guntur-red-chilli",
                "name": "Guntur Red Chilli",
                "origin": "Guntur, Andhra Pradesh",
                "grade": "S4 Sannam / Teja Stemless (SHU 35,000–75,000)",
                "packaging": "10, 25 kg Jute / PP Bags",
                "moq": "1 × 40ft HC FCL (14 MT)",
                "shelfLife": "18 months",
                "certifications": ["Spices Board", "FSSAI", "ASTA Clean"],
                "description": "Intense fiery dried red chillies from India's chilli heartland, sun-dried to optimal moisture with deep crimson color values (ASTA 60–100) and pungent kick.",
                "alt": "Sun-dried fiery red chillies in basket"
            },
            {
                "slug": "black-pepper",
                "name": "Black Pepper",
                "origin": "Idukki & Wayanad, Kerala",
                "grade": "Malabar Garbled TGSEB (550–570 g/l density)",
                "packaging": "25–50 kg Polypropylene / Jute Bags",
                "moq": "1 × 20ft FCL (15 MT)",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "Rainforest Alliance", "FSSAI"],
                "description": "Celebrated Black Gold of Malabar, high-density Tellicherry garbled black peppercorns delivering bold piperine kick (5–7%) and complex woody aromatics.",
                "alt": "Whole dried black peppercorns on rustic stone"
            },
            {
                "slug": "cumin-seeds",
                "name": "Cumin Seeds",
                "origin": "Unjha, Gujarat & Rajasthan",
                "grade": "Singapore Quality (99%) & Europe Quality (99.5% Sortex)",
                "packaging": "25–50 kg Multi-ply Paper / PP Bags",
                "moq": "1 × 20ft FCL (18 MT)",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI", "BRCGS"],
                "description": "Aromatic brown cumin seeds from Unjha's mega-mandis, mechanically cleaned and optical-sorted to eliminate weed seeds and ensure minimum 2.5% volatile oil.",
                "alt": "Aromatic brown cumin seeds in brass bowl"
            },
            {
                "slug": "coriander-seeds",
                "name": "Coriander Seeds",
                "origin": "Ramganj Mandi, Rajasthan & MP",
                "grade": "Eagle / Scooter / Badami Whole Seeds",
                "packaging": "20–25 kg Poly Bags",
                "moq": "1 × 20ft FCL (10 MT)",
                "shelfLife": "18 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Golden-green spherical coriander seeds with fresh citrus-floral bouquet and high linalool content, sorted for split-free whole kernel integrity.",
                "alt": "Whole dried golden coriander seeds in dish"
            },
            {
                "slug": "green-cardamom",
                "name": "Green Cardamom",
                "origin": "Idukki Hills, Kerala",
                "grade": "Alleppey Green Extra Bold (AGEB 8mm+ Diameter)",
                "packaging": "5 kg × 2 Vacuum Cartons inside Master Case",
                "moq": "500 kg LCL / Air Freight",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "GI Tagged", "ISO 22000"],
                "description": "Queen of Spices grown in the misty Cardamom Hills of Kerala, featuring large plump pods with intact black seeds and intense sweet cineole aroma.",
                "alt": "Plump extra-bold green cardamom pods in ceramic dish"
            },
            {
                "slug": "cloves",
                "name": "Cloves",
                "origin": "Kanyakumari, Tamil Nadu & Kerala",
                "grade": "Zanzibar / Lal Pari Handpicked Bold Headed",
                "packaging": "10, 25 kg Cartons / Jute Bags",
                "moq": "1 × 20ft FCL (11 MT)",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Hand-picked whole dried flower buds with intact crown heads, dark reddish-brown body, and supreme eugenol essential oil concentration (18%+).",
                "alt": "Handpicked whole dried cloves with intact crowns"
            },
            {
                "slug": "cinnamon",
                "name": "Cinnamon",
                "origin": "Kerala & Andaman",
                "grade": "Ceylon Alba & C5 Fine Quills",
                "packaging": "10–25 kg Master Cartons",
                "moq": "1 × 20ft FCL (8 MT)",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Paper-thin, multilayered rolled quills of true Ceylon cinnamon with delicate sweet taste, low coumarin content, and warm woody fragrance.",
                "alt": "Rolled quills of true dried cinnamon sticks"
            },
            {
                "slug": "fenugreek-seeds",
                "name": "Fenugreek Seeds",
                "origin": "Rajasthan & Madhya Pradesh",
                "grade": "Machine Cleaned Bold Golden Seeds (99.5% Purity)",
                "packaging": "25–50 kg Polypropylene Bags",
                "moq": "1 × 20ft FCL (20 MT)",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Rhomboid golden-yellow fenugreek seeds with distinct bittersweet aroma and rich galactomannan soluble fiber, widely exported for curry blends and extracts.",
                "alt": "Clean golden fenugreek seeds in dish"
            },
            {
                "slug": "fennel-seeds",
                "name": "Fennel Seeds",
                "origin": "Gujarat & Rajasthan",
                "grade": "Abu Road Green / Lucknowi Sweet Fennel",
                "packaging": "25–50 kg PP Bags",
                "moq": "1 × 20ft FCL (14 MT)",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Sweet, fragrant green-tinged fennel seeds with pronounced anethole sweetness, cleaned machine-wise to remove straw and foreign matter.",
                "alt": "Fragrant green fennel seeds in bowl"
            },
            {
                "slug": "mustard-seeds",
                "name": "Mustard Seeds",
                "origin": "Rajasthan & Haryana",
                "grade": "Bold Black & Small Yellow Seeds (99.5% Sortex)",
                "packaging": "25–50 kg Poly Sacks",
                "moq": "1 × 20ft FCL (22 MT)",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Clean, spherical dark brown and black mustard seeds delivering sharp pungent sinigrin bite when tempered in oils, highly demanded by condiment makers.",
                "alt": "Whole black Indian mustard seeds filling bronze dish"
            },
            {
                "slug": "star-anise",
                "name": "Star Anise",
                "origin": "Arunachal Pradesh & South India",
                "grade": "Autumn Crop Whole 8-Point Stars (Broken < 5%)",
                "packaging": "10 kg Master Corrugated Cartons",
                "moq": "1 × 20ft FCL (7 MT)",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "Phytosanitary"],
                "description": "Aromatic 8-pointed star-shaped pericarp pods encasing glossy seed kernels, delivering intense liquorice and anethole sweetness to seasonings.",
                "alt": "Whole dried 8-pointed star anise pods in wooden bowl"
            },
            {
                "slug": "bay-leaf",
                "name": "Bay Leaf (Tejpatta)",
                "origin": "Uttarakhand & Meghalaya",
                "grade": "Wild Harvested Sun Dried Whole Greenish Leaves",
                "packaging": "10–15 kg Bales / Cartons",
                "moq": "1 × 20ft FCL (6 MT)",
                "shelfLife": "18 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Authentic Indian bay leaves (Cinnamomum tamala) with prominent three-ribbed veins, possessing warm clove-cinnamon nuances distinct from laurel bay.",
                "alt": "Whole dried Indian bay leaves tejpatta with three distinct veins"
            },
            {
                "slug": "garam-masala",
                "name": "Garam Masala",
                "origin": "Mumbai & Gujarat",
                "grade": "Signature 12-Spice Roasted Aromatic Blend",
                "packaging": "1, 5, 25 kg Nitrogen Flushed Foil Pouches",
                "moq": "500 kg LCL / 20ft FCL",
                "shelfLife": "18 months",
                "certifications": ["FSSAI", "Spices Board", "BRCGS"],
                "description": "Proprietary slow-roasted blend of cardamom, cinnamon, cloves, mace, cumin, and black pepper, micro-ground into a velvety, warming spice mix.",
                "alt": "Freshly ground royal Garam Masala spice blend in bowl"
            }
        ]
    },
    {
        "slug": "natural-stones-tiles",
        "name": "Natural Stones & Tiles",
        "headline": "Quarried Stones, Slabs & Tiles",
        "blurb": "Architectural marbles, granites, sandstones and vitrified tiles from Rajasthan and Morbi, gangsaw cut, calibrated, and packed in fumigated ISPM-15 wooden crates.",
        "image": "/products/makrana-white-marble.webp",
        "products": [
            {
                "slug": "makrana-white-marble",
                "name": "Makrana White Marble",
                "origin": "Makrana, Rajasthan",
                "grade": "Pure Calcite Marble Slabs & Tiles (98% CaCO3)",
                "packaging": "Fumigated Euro-spec Wooden A-frames & Crates",
                "moq": "1 × 20ft Heavy FCL (400 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["ISO 9001", "ASTM C503", "ISPM-15"],
                "description": "The historic pure white calcite stone used to build the Taj Mahal. Virtually impervious to water absorption, high mirror polish, and enduring luster.",
                "alt": "Polished Makrana white marble slab surface with delicate grey veining"
            },
            {
                "slug": "statuario-marble",
                "name": "Statuario Marble",
                "origin": "Rajasthan & Processed Hubs",
                "grade": "First Choice Gangsaw Slabs (18mm, 20mm thickness)",
                "packaging": "Heavy Wooden Crates with plastic separators",
                "moq": "1 × 20ft Heavy FCL (380 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["CE Certified", "ISO 9001"],
                "description": "Ultra-luxury white marble with dramatic contrasting grey veining patterns, book-matched for seamless interior feature walls and flooring.",
                "alt": "Statuario white marble slab with bold dramatic grey veins"
            },
            {
                "slug": "indian-green-marble",
                "name": "Indian Green Marble",
                "origin": "Udaipur & Dungarpur, Rajasthan",
                "grade": "Forest Green & Emerald Polished Slabs",
                "packaging": "Seaworthy Treated Wooden Bundles",
                "moq": "1 × 20ft Heavy FCL (420 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["ASTM C503", "ISPM-15"],
                "description": "Vibrant serpentine green marble featuring rich emerald tones and fine dark mineral webbing, offering superior compressive strength for countertops and paving.",
                "alt": "Deep emerald green marble slab texture with natural webbing"
            },
            {
                "slug": "black-galaxy-granite",
                "name": "Black Galaxy Granite",
                "origin": "Chimakurthy, Ongole, Andhra Pradesh",
                "grade": "Pitch Black with Golden Bronzite Crystals (Gangsaw Slabs)",
                "packaging": "Fumigated Wooden A-Frames",
                "moq": "1 × 20ft Heavy FCL (380 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["ASTM C615", "CE Mark", "ISPM-15"],
                "description": "Deep obsidian-black igneous granite embedded with naturally glistening golden and copper flecks, prized globally for upscale kitchens and facades.",
                "alt": "Polished Black Galaxy granite slab with golden crystalline flecks"
            },
            {
                "slug": "tan-brown-granite",
                "name": "Tan Brown Granite",
                "origin": "Karimnagar, Telangana",
                "grade": "Dark Brown with Reddish-Black Crystals (18mm/20mm/30mm)",
                "packaging": "Heavy Wooden Bundles with edge guards",
                "moq": "1 × 20ft Heavy FCL (400 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["ASTM C615", "CE Mark"],
                "description": "Hard-wearing magmatic granite with rich chocolate-brown matrix and crimson-black floral crystals, highly resistant to weathering and acid stains.",
                "alt": "Tan Brown granite slab surface with dark crystal blooms"
            },
            {
                "slug": "kashmir-white-granite",
                "name": "Kashmir White Granite",
                "origin": "Madurai, Tamil Nadu",
                "grade": "Snow White with Burgundy Garnet Flecks",
                "packaging": "ISPM-15 Wooden Crates",
                "moq": "1 × 20ft Heavy FCL (400 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["ASTM C615", "ISO 9001"],
                "description": "Elegant white granite with subtle mint undertones and tiny burgundy garnets, delivering a soft contemporary architectural ambiance.",
                "alt": "Kashmir White granite surface with garnet mineral flecks"
            },
            {
                "slug": "rainbow-sandstone",
                "name": "Rainbow Sandstone",
                "origin": "Khatu, Nagaur, Rajasthan",
                "grade": "Fine-Grained Sawn Slabs & Calibrated Paving Tiles",
                "packaging": "Wooden Pallets with plastic corner caps",
                "moq": "1 × 20ft FCL (450 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["ASTM C616", "ISPM-15"],
                "description": "Naturally layered sedimentary stone showing vibrant swirls of violet, brown, yellow and red, widely used for exterior pool decks and patio paving.",
                "alt": "Natural layered Rainbow sandstone texture with wave veining"
            },
            {
                "slug": "kota-limestone",
                "name": "Kota Limestone",
                "origin": "Kota & Ramganjmandi, Rajasthan",
                "grade": "Kota Blue & Kota Brown (Honed / Polished / Rough)",
                "packaging": "Wooden Palletized Crates",
                "moq": "1 × 20ft Heavy FCL (500 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["ASTM C568", "ISO 9001"],
                "description": "Fine-grained dolomite limestone in cool bluish-grey and warm brown hues, naturally non-slip, extremely tough, and ideal for heavy pedestrian traffic.",
                "alt": "Honed Kota blue and brown limestone paving slabs"
            },
            {
                "slug": "himachal-slate",
                "name": "Himachal Slate",
                "origin": "Kangra Valley, Himachal Pradesh",
                "grade": "Silver Grey, Black & Multi-Color Natural Cleft",
                "packaging": "Export Wooden Crates",
                "moq": "1 × 20ft FCL (500 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["ASTM C406", "ISPM-15"],
                "description": "Metamorphic foliated stone splitting into fine, textured slabs with natural cleft finish, ideal for rustic roofing, garden stepping stones, and wall cladding.",
                "alt": "Natural cleft Himachal slate stone texture"
            },
            {
                "slug": "quartzite",
                "name": "Quartzite",
                "origin": "Deoli, Rajasthan",
                "grade": "Golden, Copper & Silver Cleft Flagstones",
                "packaging": "Heavy Wooden Pallets",
                "moq": "1 × 20ft FCL (450 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["ASTM C616", "ISO 9001"],
                "description": "Ultra-hard metamorphic quartz sandstone with crystalline shimmer, completely frost-proof and acid-resistant for interior and exterior flooring.",
                "alt": "Golden cleft quartzite architectural stone surface"
            },
            {
                "slug": "vitrified-tiles",
                "name": "Vitrified Tiles",
                "origin": "Morbi, Gujarat",
                "grade": "Double Charge & Glazed Porcelain (600×600, 600×1200mm)",
                "packaging": "Export corrugated cartons with corner caps",
                "moq": "1 × 20ft FCL (1400 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["ISO 13006 Group BIa", "CE Mark"],
                "description": "Dense vitrified porcelain tiles pressed under 7200 tonnes, nano-polished for scratch resistance, water absorption under 0.05%, and heavy footfall durability.",
                "alt": "High-gloss polished vitrified porcelain floor tile sample"
            },
            {
                "slug": "porcelain-tiles",
                "name": "Porcelain Tiles",
                "origin": "Morbi, Gujarat",
                "grade": "Large Format Sintered Slabs (800×1600mm, 1200×2400mm)",
                "packaging": "Euro-spec wooden A-frames & heavy pallets",
                "moq": "1 × 20ft FCL (1000 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["CE Certified", "Green Building LEED"],
                "description": "Large sintered porcelain slabs reproducing fine Calacatta and Statuario veins, ideal for joint-free kitchen countertops, bathroom vanities, and facades.",
                "alt": "Large format sintered porcelain slab tile texture"
            },
            {
                "slug": "ceramic-wall-tiles",
                "name": "Ceramic Wall Tiles",
                "origin": "Morbi, Gujarat",
                "grade": "Glossy & Matte Digital Glazed (300×600mm, 300×450mm)",
                "packaging": "Corrugated Cartons on shrink-wrapped pallets",
                "moq": "1 × 20ft FCL (1800 sq.m)",
                "shelfLife": "Permanent",
                "certifications": ["ISO 13006 / EN 14411", "CE"],
                "description": "High-definition inkjet printed ceramic wall tiles with stain-resistant protective glaze, lightweight clay body, and modern geometric motifs.",
                "alt": "Glazed ceramic wall tile sample with marble veining"
            },
            {
                "slug": "cobblestones",
                "name": "Cobblestones",
                "origin": "Rajasthan & Karnataka",
                "grade": "Hand-Cut Granite Cobbles (10×10×10cm, 10×10×5cm)",
                "packaging": "Loose Heavy Crates / 1 MT Big Bags",
                "moq": "1 × 20ft FCL (27 MT)",
                "shelfLife": "Permanent",
                "certifications": ["CE Certified", "ASTM C615"],
                "description": "Six-sided natural cleft granite pavers creating timeless European-style driveways, plazas, and pedestrian walkways with extreme wheel-load endurance.",
                "alt": "Hand-cut natural cleft granite cobblestone pavers"
            },
            {
                "slug": "pebbles-river-gravel",
                "name": "Pebbles & River Gravel",
                "origin": "Narmada River & Haridwar",
                "grade": "Tumble-Polished River Pebbles (10–25mm, 25–50mm)",
                "packaging": "25 kg Poly bags inside 1 MT Jumbo Bags",
                "moq": "1 × 20ft FCL (27 MT)",
                "shelfLife": "Permanent",
                "certifications": ["ISO 9001"],
                "description": "Naturally water-rounded silica pebbles in black, white, and ochre, tumble-polished for aquarium hardscaping, terrazzo flooring, and Japanese zen gardens.",
                "alt": "Tumble-polished smooth river pebbles and decorative gravel"
            }
        ]
    },
    {
        "slug": "dry-fruits-nuts",
        "name": "Dry Fruits & Nuts",
        "headline": "Premium Dry Fruits & Nuts",
        "blurb": "Gourmet graded Indian dry fruits, cashews from the Konkan coast, and Kashmiri walnuts, nitrogen-flushed and vacuum-packed for optimum freshness.",
        "image": "/products/cashew-nuts-w320.webp",
        "products": [
            {
                "slug": "cashew-nuts-w320",
                "name": "Cashew Nuts (W320)",
                "origin": "Goa, Mangalore & Kollam",
                "grade": "Whole White 320 Count per Pound (Standard Export Quality)",
                "packaging": "10 kg / 25 lb Vacuum Tins & Nitrogen Flushed Flex Pouches",
                "moq": "1 × 20ft FCL (16 MT)",
                "shelfLife": "12–18 months",
                "certifications": ["CEPC", "FSSAI", "ISO 22000", "HACCP"],
                "description": "The world's standard export cashew grade. Pristine ivory-white whole kernels offering a buttery crunch, rich nutty sweetness, and uniform size calibration.",
                "alt": "Premium whole white W320 cashew nuts in wooden bowl"
            },
            {
                "slug": "cashew-nuts-w240",
                "name": "Cashew Nuts (W240)",
                "origin": "Kollam, Kerala & Mangalore",
                "grade": "Jumbo Whole White 240 Count per Pound (King Cashews)",
                "packaging": "10 kg Vacuum Tins / Nitrogen Multiwall Bags",
                "moq": "1 × 20ft FCL (16 MT)",
                "shelfLife": "12–18 months",
                "certifications": ["CEPC", "FSSAI", "BRCGS"],
                "description": "Extra-large jumbo cashew nuts graded W240, celebrated as the King of Cashews for their impressive kernel size, rich mouthfeel, and luxury gifting appeal.",
                "alt": "Jumbo W240 whole cashew nuts kernels"
            },
            {
                "slug": "almonds",
                "name": "Almonds",
                "origin": "Kashmir & Indian Graded Ports",
                "grade": "Mamra Giri & Nonpareil Graded (27/30, 30/32)",
                "packaging": "10, 25 kg Vacuum Cartons with oxygen absorbers",
                "moq": "1 × 20ft FCL (18 MT)",
                "shelfLife": "12 months",
                "certifications": ["FSSAI", "ISO 22000"],
                "description": "High-oil Kashmiri Mamra and selected whole almonds, rich in vitamin E, crunchy texture, and sweet nutty essence for gourmet confectionery and snacking.",
                "alt": "Shelled raw whole almonds in rustic bowl"
            },
            {
                "slug": "walnuts",
                "name": "Walnuts",
                "origin": "Anantnag & Shopian, Kashmir",
                "grade": "Extra Light Snow White Halves (Kashmiri Akhrot)",
                "packaging": "5, 10 kg Vacuum Packed Nitrogen Cartons",
                "moq": "1 × 20ft FCL (12 MT)",
                "shelfLife": "12 months (Refrigerated 4°C)",
                "certifications": ["APEDA", "FSSAI", "Organic"],
                "description": "Kashmiri organic walnut halves distinguished by bright amber-gold to snow-white color, delicate buttery taste, and high alpha-linolenic omega-3 fatty acids.",
                "alt": "Whole and halved Kashmiri walnut kernels in wooden bowl"
            },
            {
                "slug": "pistachios",
                "name": "Pistachios",
                "origin": "Gujarat Graded Ports",
                "grade": "Roasted Salted & Raw Green Kernels (20/22, 22/24)",
                "packaging": "10, 20 kg Vacuum Foil Cartons",
                "moq": "1 × 20ft FCL (15 MT)",
                "shelfLife": "12 months",
                "certifications": ["FSSAI", "ISO 22000"],
                "description": "Naturally open in-shell and vibrant emerald green pistachio kernels, gently roasted and salted to highlight their distinct nutty sweetness.",
                "alt": "Roasted in-shell pistachio nuts in ceramic bowl"
            },
            {
                "slug": "raisins",
                "name": "Raisins",
                "origin": "Sangli & Nashik, Maharashtra",
                "grade": "Golden Long (Kishmish) & Green Malayar Raisins",
                "packaging": "10, 15 kg Export Telescopic Cartons",
                "moq": "1 × 20ft FCL (18 MT)",
                "shelfLife": "12 months",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Sun-dried golden long raisins sourced from Sangli's premium vineyards, naturally sweet, free from sugar crystals, and graded for uniform size and color.",
                "alt": "Golden long sweet raisins Kishmish in dish"
            },
            {
                "slug": "dates",
                "name": "Dates",
                "origin": "Kutch, Gujarat",
                "grade": "Kutch Barhi & Semi-Dry Medjool Grade",
                "packaging": "5, 10 kg Master Cartons",
                "moq": "1 × 20ft FCL (16 MT)",
                "shelfLife": "12 months",
                "certifications": ["FSSAI", "APEDA"],
                "description": "Rich caramel-flavored dried dates grown in the arid oasis of Kutch, packed with natural dietary fiber, potassium, and wholesome sweetness.",
                "alt": "Naturally sweet dried dates in ceramic dish"
            },
            {
                "slug": "figs",
                "name": "Figs",
                "origin": "Purandar, Pune, Maharashtra",
                "grade": "GI Tagged Sun-Dried Ring Anjeer (40–50mm)",
                "packaging": "5, 10 kg Garland Rings inside Cartons",
                "moq": "1 × 20ft FCL (12 MT)",
                "shelfLife": "12 months",
                "certifications": ["GI Tagged", "FSSAI"],
                "description": "GI-tagged Purandar dried figs strung into traditional garlands, featuring tender chewy skin, crunchy honeyed seeds, and high calcium concentration.",
                "alt": "Sun-dried ring figs anjeer arranged on dark slate"
            },
            {
                "slug": "apricots",
                "name": "Apricots",
                "origin": "Ladakh & Kashmir",
                "grade": "GI Tagged Raktsey Karpo & Halman Dried Apricots",
                "packaging": "5, 10 kg Vacuum Cartons",
                "moq": "1 × 20ft FCL (12 MT)",
                "shelfLife": "12 months",
                "certifications": ["GI Tagged", "APEDA"],
                "description": "Rare trans-Himalayan white-seeded Raktsey Karpo apricots from Ladakh, renowned for unmatched natural honey sweetness and golden sun-dried color.",
                "alt": "Sun-dried golden apricots in rustic bowl"
            },
            {
                "slug": "makhana-fox-nut",
                "name": "Makhana (Fox Nut)",
                "origin": "Mithila, Darbhanga, Bihar",
                "grade": "GI Tagged Super Bold 5-Suta / 6-Suta (18mm–24mm)",
                "packaging": "10, 15 kg Multiwall Poly Bags inside Master Boxes",
                "moq": "1 × 40ft HC FCL (6 MT Volumetric)",
                "shelfLife": "12 months",
                "certifications": ["GI Tagged", "FSSAI", "Organic"],
                "description": "GI-certified popped lotus seeds from the wetlands of Mithila, presenting crunchy snow-white puffed kernels packed with protein, calcium, and low glycemic index.",
                "alt": "Popped super-bold white Makhana fox nuts lotus seeds"
            }
        ]
    }
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

total_prods = 0
fallback_count = 0
photo_count = 0

print("Processing assets for all 78 products...")

for cat in catalog_data:
    cat_slug = cat['slug']
    cat_name = cat['name']
    for p in cat['products']:
        slug = p['slug']
        name = p['name']
        origin = p['origin']
        grade = p['grade']
        out_base = f'public/products/{slug}'
        total_prods += 1
        
        # 1. Check if generated photo exists
        if slug in generated_map and os.path.exists(generated_map[slug]):
            try:
                img = Image.open(generated_map[slug])
                crop_and_save_4x3(img, out_base)
                photo_count += 1
                print(f"[{photo_count}] Generated photo used: {slug}")
                continue
            except Exception as e:
                print(f"Error reading generated {slug}: {e}")
                
        # 2. Check if local accurate asset exists
        if slug in local_accurate and os.path.exists(local_accurate[slug]):
            try:
                img = Image.open(local_accurate[slug])
                crop_and_save_4x3(img, out_base)
                photo_count += 1
                print(f"[{photo_count}] Local accurate photo used: {slug}")
                continue
            except Exception as e:
                print(f"Error reading local {slug}: {e}")
                
        # 3. Check if verified url exists
        if slug in verified_urls:
            url = verified_urls[slug]
            try:
                req = urllib.request.Request(url, headers=headers)
                with urllib.request.urlopen(req, timeout=12) as resp:
                    img = Image.open(resp)
                    crop_and_save_4x3(img, out_base)
                    photo_count += 1
                    print(f"[{photo_count}] Downloaded verified photo: {slug}")
                    continue
            except Exception as e:
                print(f"Verified url failed for {slug} ({e}), generating luxury fallback...")

        # 4. Generate luxury fallback artwork
        generate_luxury_fallback(slug, name, cat_name, origin, grade, out_base, variant=1)
        generate_luxury_fallback(slug, name, cat_name, origin, grade, out_base, variant=2)
        generate_luxury_fallback(slug, name, cat_name, origin, grade, out_base, variant=3)
        fallback_count += 1
        print(f"[{fallback_count}] Luxury Fallback Artwork generated: {slug}")

print(f"\nAsset Generation Summary:")
print(f"Total Products: {total_prods}")
print(f"Real / Studio Photos: {photo_count}")
print(f"Luxury Fallback Artworks: {fallback_count}")

# Construct full categories array
full_categories = []
for cat in catalog_data:
    cat_copy = {
        "slug": cat["slug"],
        "name": cat["name"],
        "headline": cat["headline"],
        "blurb": cat["blurb"],
        "image": cat["image"],
        "products": []
    }
    for p in cat["products"]:
        slug = p["slug"]
        prod_obj = {
            "slug": slug,
            "name": p["name"],
            "origin": p["origin"],
            "grade": p["grade"],
            "packaging": p["packaging"],
            "moq": p["moq"],
            "shelfLife": p["shelfLife"],
            "certifications": p["certifications"],
            "description": p["description"],
            "image": f"/products/{slug}.webp",
            "gallery": [
                f"/products/{slug}.webp",
                f"/products/{slug}-2.webp",
                f"/products/{slug}-3.webp"
            ],
            "alt": p["alt"]
        }
        cat_copy["products"].append(prod_obj)
    full_categories.append(cat_copy)

ts_content = f"""// 6 Categories, 78 Approved Export Products with Dedicated High-Resolution Local Assets

export type Product = {{
  slug: string;
  name: string;
  origin: string;
  grade: string;
  packaging: string;
  moq: string;
  shelfLife: string;
  certifications: string[];
  description: string;
  image: string;
  gallery: string[];
  alt: string;
}};

export type Category = {{
  slug: string;
  name: string;
  headline: string;
  blurb: string;
  image: string;
  products: Product[];
}};

export const categories: Category[] = {json.dumps(full_categories, indent=2)};

export const allProducts: (Product & {{ category: Category }})[] = categories.flatMap((c) =>
  c.products.map((p) => ({{ ...p, category: c }}))
);

export function getCategory(slug: string): Category | undefined {{
  return categories.find((c) => c.slug === slug);
}}

export function getProduct(catSlug: string, prodSlug: string): Product | undefined {{
  const c = getCategory(catSlug);
  return c?.products.find((p) => p.slug === prodSlug);
}}
"""

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("\nSuccessfully updated src/data/products.ts with all 78 products!")
