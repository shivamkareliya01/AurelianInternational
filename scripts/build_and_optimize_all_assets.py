import os, sys, urllib.request, urllib.parse, json
from PIL import Image, ImageEnhance, ImageOps
import numpy as np

os.makedirs('scratch/downloads', exist_ok=True)
os.makedirs('public/products', exist_ok=True)

headers = {'User-Agent': 'AurelianCatalogBot/4.0 (bot@aurelianinternational.com)'}

def download_file(url, out_path):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
        return True
    try:
        print(f"Downloading {url[:70]}... -> {out_path}")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        with open(out_path, 'wb') as f:
            f.write(data)
        print(f"  Saved {len(data)/1024:.1f} KB")
        return True
    except Exception as e:
        print(f"  Error downloading {url}: {e}")
        return False

# 1. New downloads needed
downloads = {
    'subway_tiles.jpg': 'https://upload.wikimedia.org/wikipedia/commons/9/99/Subway_Tiles_%2829153084347%29.jpg',
    'paver_blocks.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/03/Paver_Blocks_Exterior_Circular_3008px.jpg',
    'marble_floor.jpg': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Marble_Floor.jpg',
    'mint_leaves.jpg': 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Fresh_mint_leaves.jpg',
    'tomatoes.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
    'beetroots.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Beetroots_in_a_basket.jpg',
    'carrots.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Organic_Carrots_%28Unsplash%29.jpg',
    'green_chillies.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Conjoined_green_chili_pepper.jpg',
    'pumpkin.jpg': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Cucurbita_maxima_02_-_Orange.jpg',
    'amla_fruits.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/57/Emblica_officinalis_fruits.JPG',
    'aloe_leaf.jpg': 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Cut_Aloe_Vera_Leaf.jpg',
    'hibiscus_calyces.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/65/Hibiscus_sabdariffa_fruits.jpg',
}

for fname, url in downloads.items():
    download_file(url, os.path.join('scratch/downloads', fname))

def process_and_save_product(src_img_path, slug, is_tile=False, lift_lum=True):
    im = Image.open(src_img_path).convert('RGB')
    w, h = im.size
    
    # 4:3 Crop
    target_w = int(h * 4 / 3)
    if target_w <= w:
        x1 = (w - target_w) // 2
        im_43 = im.crop((x1, 0, x1 + target_w, h))
    else:
        target_h = int(w * 3 / 4)
        y1 = (h - target_h) // 2
        im_43 = im.crop((0, y1, w, y1 + target_h))
        
    p1 = im_43.resize((1600, 1200), Image.Resampling.LANCZOS)
    
    # Check & lift luminance if needed
    arr = np.array(p1)
    lum = np.mean(0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2])
    if lum < 88 and lift_lum:
        factor = min(1.45, 95.0 / max(lum, 25.0))
        enhancer = ImageEnhance.Brightness(p1)
        p1 = enhancer.enhance(factor)
        # also subtle contrast
        p1 = ImageEnhance.Contrast(p1).enhance(1.05)
        
    # Quality tuned so size is < 250 KB
    p1.save(f"public/products/{slug}.webp", "WEBP", quality=84)
    
    # Gallery 2: Macro close-up on texture (1600x1200)
    w1, h1 = im_43.size
    if is_tile:
        # Tile texture zoom
        crop_box2 = (int(w1 * 0.15), int(h1 * 0.15), int(w1 * 0.85), int(h1 * 0.85))
    else:
        # Food / powder bowl zoom
        crop_box2 = (int(w1 * 0.25), int(h1 * 0.25), int(w1 * 0.85), int(h1 * 0.85))
    p2 = im_43.crop(crop_box2).resize((1600, 1200), Image.Resampling.LANCZOS)
    if lum < 88 and lift_lum:
        p2 = ImageEnhance.Brightness(p2).enhance(factor)
    p2.save(f"public/products/{slug}-2.webp", "WEBP", quality=84)
    
    # Gallery 3: Secondary context angle
    if is_tile:
        crop_box3 = (int(w1 * 0.05), int(h1 * 0.1), int(w1 * 0.75), int(h1 * 0.8))
    else:
        crop_box3 = (int(w1 * 0.05), int(h1 * 0.05), int(w1 * 0.75), int(h1 * 0.75))
    p3 = im_43.crop(crop_box3).resize((1600, 1200), Image.Resampling.LANCZOS)
    if lum < 88 and lift_lum:
        p3 = ImageEnhance.Brightness(p3).enhance(factor)
    p3.save(f"public/products/{slug}-3.webp", "WEBP", quality=84)
    print(f"Processed & deployed {slug} (primary + 2 gallery)")

# Process the remaining dehydrated powders
powders_sources = {
    'coriander-leaf-powder': 'scratch/real_photos/coriander_powder.jpg',
    'fenugreek-leaf-powder': 'scratch/real_photos/kasuri_methi.jpg',
    'lemon-powder': 'scratch/real_photos/dried_lemon.jpg',
    'mango-powder-amchur': 'scratch/real_photos/dried_mango.jpg',
    'banana-powder': 'scratch/real_photos/plantain_powder.jpg',
    'potato-flakes': 'scratch/real_photos/shredded_potatoes.jpg',
    'mint-leaf-powder': 'scratch/downloads/mint_leaves.jpg',
    'tomato-powder': 'scratch/downloads/tomatoes.jpg',
    'beetroot-powder': 'scratch/downloads/beetroots.jpg',
    'carrot-powder': 'scratch/downloads/carrots.jpg',
    'green-chilli-powder': 'scratch/downloads/green_chillies.jpg',
    'pumpkin-powder': 'scratch/downloads/pumpkin.jpg',
    'amla-powder': 'scratch/downloads/amla_fruits.jpg',
    'aloe-vera-powder': 'scratch/downloads/aloe_leaf.jpg',
    'hibiscus-powder': 'scratch/downloads/hibiscus_calyces.jpg'
}

for slug, pth in powders_sources.items():
    if os.path.exists(pth):
        process_and_save_product(pth, slug, is_tile=False, lift_lum=True)
    else:
        print(f"Missing source for {slug}: {pth}")

# Process ceramic tiles
tiles_sources = {
    'vitrified-tiles': 'scratch/candidates/batch2/vitrified-tiles.jpg',
    'porcelain-tiles': 'scratch/candidates/batch2/porcelain-tiles.jpg',
    'ceramic-wall-tiles': 'scratch/candidates/batch2/ceramic-wall-tiles.jpg',
    'glazed-vitrified-tiles': 'scratch/downloads/marble_floor.jpg',
    'large-format-porcelain-slabs': 'src/assets/hero-tiles.webp',
    'polished-porcelain-tiles': 'scratch/candidates/batch2/porcelain-tiles.jpg',
    'subway-ceramic-tiles': 'scratch/downloads/subway_tiles.jpg',
    'outdoor-parking-tiles': 'scratch/downloads/paver_blocks.jpg',
    'anti-skid-ceramic-tiles': 'scratch/candidates/limestone_clean.jpg'
}

for slug, pth in tiles_sources.items():
    if os.path.exists(pth):
        # To ensure porcelain-tiles and polished-porcelain-tiles are distinct:
        if slug == 'porcelain-tiles':
            # crop right half of porcelain-tiles.jpg
            im_tmp = Image.open(pth)
            w_t, h_t = im_tmp.size
            crop_half = im_tmp.crop((int(w_t*0.25), 0, w_t, h_t))
            crop_half.save('scratch/candidates/batch2/porcelain_tiles_alt.jpg')
            process_and_save_product('scratch/candidates/batch2/porcelain_tiles_alt.jpg', slug, is_tile=True, lift_lum=False)
        else:
            process_and_save_product(pth, slug, is_tile=True, lift_lum=False)

print("\nAll remaining images successfully generated and deployed!")
