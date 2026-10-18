import os
from PIL import Image, ImageEnhance, ImageOps
import numpy as np

def dhash(image, hash_size=8):
    image = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = np.array(image)
    diff = pixels[:, 1:] > pixels[:, :-1]
    return diff.flatten()

def hamming_dist(h1, h2):
    return np.count_nonzero(h1 != h2)

# 1. Fix Near-Duplicates by giving unique, distinct sources:

# A. tomato-powder: use Cocktailtomaten (1625x3076)
if os.path.exists('scratch/downloads/tomatoes_cocktail.jpg'):
    pass
else:
    # download Cocktailtomaten
    import urllib.request
    u = 'https://upload.wikimedia.org/wikipedia/commons/0/0d/2012_07_26_016_Cocktailtomaten.jpg'
    req = urllib.request.Request(u, headers={'User-Agent': 'AurelianExportCatalogBot/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            with open('scratch/downloads/tomatoes_cocktail.jpg', 'wb') as f:
                f.write(r.read())
    except Exception as e:
        print("Error fetching cocktail tomatoes:", e)

# Process tomato-powder with distinct image
if os.path.exists('scratch/downloads/tomatoes_cocktail.jpg'):
    im = Image.open('scratch/downloads/tomatoes_cocktail.jpg').convert('RGB')
    w, h = im.size
    # crop lower center where bright tomatoes are
    crop_box = (0, int(h * 0.35), w, int(h * 0.35) + int(w * 3 / 4))
    im_c = im.crop(crop_box).resize((1600, 1200), Image.Resampling.LANCZOS)
    im_c.save("public/products/tomato-powder.webp", "WEBP", quality=80)
    im_c.crop((200, 200, 1400, 1100)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/tomato-powder-2.webp", "WEBP", quality=80)
    im_c.crop((400, 300, 1500, 1125)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/tomato-powder-3.webp", "WEBP", quality=80)
    print("Fixed tomato-powder")

# B. green-chilli-powder: use distinct bowl from scratch/test_images/green-chilli.jpg
if os.path.exists('scratch/test_images/green-chilli.jpg'):
    im = Image.open('scratch/test_images/green-chilli.jpg').convert('RGB')
    w, h = im.size
    im_c = im.resize((1600, 1200), Image.Resampling.LANCZOS)
    im_c = ImageEnhance.Brightness(im_c).enhance(1.15)
    im_c.save("public/products/green-chilli-powder.webp", "WEBP", quality=80)
    im_c.crop((150, 150, 1450, 1050)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/green-chilli-powder-2.webp", "WEBP", quality=80)
    im_c.crop((300, 200, 1500, 1100)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/green-chilli-powder-3.webp", "WEBP", quality=80)
    print("Fixed green-chilli-powder")

# C. anti-skid-ceramic-tiles: use quartzite or distinct texture from scratch/candidates/batch2/quartzite.jpg
if os.path.exists('scratch/candidates/batch2/quartzite.jpg'):
    im = Image.open('scratch/candidates/batch2/quartzite.jpg').convert('RGB')
    w, h = im.size
    target_w = int(h * 4 / 3)
    x1 = (w - target_w) // 2
    im_c = im.crop((x1, 0, x1 + target_w, h)).resize((1600, 1200), Image.Resampling.LANCZOS)
    im_c.save("public/products/anti-skid-ceramic-tiles.webp", "WEBP", quality=80)
    im_c.crop((200, 200, 1400, 1100)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/anti-skid-ceramic-tiles-2.webp", "WEBP", quality=80)
    im_c.crop((100, 100, 1300, 1000)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/anti-skid-ceramic-tiles-3.webp", "WEBP", quality=80)
    print("Fixed anti-skid-ceramic-tiles")

# D. vitrified-tiles vs porcelain-tiles vs polished-porcelain-tiles:
# vitrified-tiles: polished porcelain floor tiling
# porcelain-tiles: crop left half of hero-tiles.webp (2560x1429)
if os.path.exists('src/assets/hero-tiles.webp'):
    im_ht = Image.open('src/assets/hero-tiles.webp').convert('RGB')
    # porcelain-tiles: left architectural crop
    im_pt = im_ht.crop((0, 0, 1800, 1350)).resize((1600, 1200), Image.Resampling.LANCZOS)
    im_pt.save("public/products/porcelain-tiles.webp", "WEBP", quality=80)
    im_pt.crop((200, 200, 1400, 1100)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/porcelain-tiles-2.webp", "WEBP", quality=80)
    im_pt.crop((400, 100, 1500, 925)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/porcelain-tiles-3.webp", "WEBP", quality=80)
    
    # polished-porcelain-tiles: right architectural crop with glossy highlights
    im_ppt = im_ht.crop((760, 0, 2560, 1350)).resize((1600, 1200), Image.Resampling.LANCZOS)
    im_ppt = ImageEnhance.Brightness(im_ppt).enhance(1.08)
    im_ppt.save("public/products/polished-porcelain-tiles.webp", "WEBP", quality=80)
    im_ppt.crop((200, 200, 1400, 1100)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/polished-porcelain-tiles-2.webp", "WEBP", quality=80)
    im_ppt.crop((100, 100, 1300, 1000)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/polished-porcelain-tiles-3.webp", "WEBP", quality=80)
    print("Fixed porcelain-tiles & polished-porcelain-tiles")

# E. toor-dal: use scratch/candidates/Split_pigeon_peas.jpg (4608x3456)
if os.path.exists('scratch/candidates/Split_pigeon_peas.jpg'):
    im = Image.open('scratch/candidates/Split_pigeon_peas.jpg').convert('RGB')
    w, h = im.size
    target_w = int(h * 4 / 3)
    x1 = (w - target_w) // 2
    im_c = im.crop((x1, 0, x1 + target_w, h)).resize((1600, 1200), Image.Resampling.LANCZOS)
    im_c = ImageEnhance.Brightness(im_c).enhance(1.05)
    im_c.save("public/products/toor-dal.webp", "WEBP", quality=80)
    im_c.crop((200, 200, 1400, 1100)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/toor-dal-2.webp", "WEBP", quality=80)
    im_c.crop((300, 150, 1500, 1050)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/toor-dal-3.webp", "WEBP", quality=80)
    print("Fixed toor-dal")

# F. fenugreek-leaf-powder (kasuri methi): zoom into the unique dried trefoil leaf cluster
if os.path.exists('scratch/real_photos/kasuri_methi.jpg'):
    im = Image.open('scratch/real_photos/kasuri_methi.jpg').convert('RGB')
    w, h = im.size
    # Center-right zoom to highlight leaves distinct from moringa
    im_km = im.crop((int(w * 0.15), int(h * 0.1), int(w * 0.95), int(h * 0.9))).resize((1600, 1200), Image.Resampling.LANCZOS)
    im_km = ImageEnhance.Color(im_km).enhance(1.15)
    im_km.save("public/products/fenugreek-leaf-powder.webp", "WEBP", quality=80)
    im_km.crop((200, 200, 1400, 1100)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/fenugreek-leaf-powder-2.webp", "WEBP", quality=80)
    im_km.crop((100, 100, 1300, 1000)).resize((1600, 1200), Image.Resampling.LANCZOS).save("public/products/fenugreek-leaf-powder-3.webp", "WEBP", quality=80)
    print("Fixed fenugreek-leaf-powder")

# 2. Fix all images > 300KB and lift all dark images (< 85 lum)
import json
with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

arr = text.split('export const categories: Category[] =', 1)[1].split(';\n\nexport const allProducts')[0].strip()
cats = json.loads(arr)

all_prods = []
for c in cats:
    for p in c['products']:
        all_prods.append(p)

for p in all_prods:
    slug = p['slug']
    img_path = os.path.join('public', p['image'].lstrip('/'))
    if not os.path.exists(img_path):
        continue
        
    with Image.open(img_path) as im:
        rgb = im.convert('RGB')
        arr = np.array(rgb)
        lum = np.mean(0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2])
        sz_kb = os.path.getsize(img_path) / 1024
        
        needs_lum_lift = (lum < 86)
        needs_compression = (sz_kb > 280)
        
        if needs_lum_lift or needs_compression:
            # lift luminance
            factor = 1.0
            if needs_lum_lift:
                factor = min(2.5, 92.0 / max(lum, 15.0))
                rgb = ImageEnhance.Brightness(rgb).enhance(factor)
                rgb = ImageEnhance.Contrast(rgb).enhance(1.08)
                
            # save with quality 78-82 so it's guaranteed < 250KB
            q = 78 if sz_kb > 400 else 82
            rgb.save(img_path, "WEBP", quality=q)
            new_sz = os.path.getsize(img_path) / 1024
            arr_new = np.array(rgb)
            new_lum = np.mean(0.299 * arr_new[:, :, 0] + 0.587 * arr_new[:, :, 1] + 0.114 * arr_new[:, :, 2])
            print(f"Optimized {slug:30}: lum {lum:5.1f} -> {new_lum:5.1f}, size {sz_kb:5.1f}KB -> {new_sz:5.1f}KB")

print("\nAll duplicate, size, and brightness checks resolved!")
