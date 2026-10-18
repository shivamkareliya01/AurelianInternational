import urllib.request
import urllib.parse
import json
import os
import io
import sys
from PIL import Image, ImageStat, ImageEnhance

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('public/products', exist_ok=True)
os.makedirs('scratch/ingredients_dl', exist_ok=True)

# Curated high-resolution studio photographs from Wikimedia Commons for each raw ingredient
INGREDIENTS_MAP = {
    'white-onion-powder': 'File:Allium cepa var.white-1-yercaud-salem-India.jpg',
    'pink-red-onion-powder': 'File:Red_Onions.jpg',
    'garlic-powder': 'File:Garlic_bulbs_and_clove.jpg',
    'ginger-powder-saunth': 'File:Ginger_root.jpg',
    'moringa-leaf-powder': 'File:Moringa_leaves.jpg',
    'moringa-seed-powder': 'File:Moringa_seeds.jpg',
    'spinach-powder': 'File:Spinach_leaves.jpg',
    'curry-leaf-powder': 'File:Curry_leaves.jpg',
    'mint-leaf-powder': 'File:Fresh_mint.jpg',
    'coriander-leaf-powder': 'File:Coriander_leaves.jpg',
    'kasuri-methi-powder': 'File:Methi_leaves.jpg',
    'tomato-powder': 'File:Tomato_je.jpg',
    'beetroot-powder': 'File:Beetroot(1).jpg',
    'carrot-powder': 'File:Carrots.jpg',
    'green-chilli-powder': 'File:Green_chili_peppers.jpg',
    'pumpkin-powder': 'File:Cucurbita maxima cut one half.jpg',
    'mango-powder-amchur': 'File:Raw_mango.jpg',
    'banana-powder': 'File:Bananas_white_background.jpg',
    'lemon-powder': 'File:Lemons.jpg',
    'amla-powder': 'File:Amla_fruit.jpg',
    'aloe-vera-powder': 'File:Aloe vera gel (20241107).jpg',
    'hibiscus-powder': 'File:Hibiscus_sabdariffa_dried.jpg'
}

def get_wikimedia_url(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AurelianCatalog/1.0 (contact@aurelianinternational.com)'})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        for pid, info in pages.items():
            if 'imageinfo' in info and len(info['imageinfo']) > 0:
                return info['imageinfo'][0]['url']
    return None

def process_to_webp(raw_bytes, out_path, target=(1600, 1200), max_kb=200):
    img = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    w, h = img.size
    want = target[0] / target[1]
    if w / h > want:
        nw = int(h * want)
        img = img.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
    else:
        nh = int(w / want)
        img = img.crop((0, (h - nh) // 2, w, (h + nh) // 2))
    img = img.resize(target, Image.Resampling.LANCZOS)

    # Adjust brightness to ensure mean brightness >= 105
    stat = ImageStat.Stat(img.convert("L"))
    brightness = stat.mean[0]
    if brightness < 105:
        boost = 115.0 / max(brightness, 10.0)
        img = ImageEnhance.Brightness(img).enhance(boost)
        # also subtle contrast boost
        img = ImageEnhance.Contrast(img).enhance(1.05)
        brightness = ImageStat.Stat(img.convert("L")).mean[0]

    for q in (82, 78, 74, 70, 65, 58):
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=q, method=6)
        if len(buf.getvalue()) <= max_kb * 1024:
            break
    with open(out_path, "wb") as f:
        f.write(buf.getvalue())
    return len(buf.getvalue()) // 1024, brightness

print(f"Building 22 ingredient images...")
for slug, title in INGREDIENTS_MAP.items():
    out_file = f"public/products/{slug}-ingredient.webp"
    dl_file = f"scratch/ingredients_dl/{slug}.raw"
    if not os.path.exists(dl_file):
        print(f"Resolving URL for {slug} ({title})...")
        img_url = get_wikimedia_url(title)
        if not img_url:
            print(f"FAILED to find URL for {title}")
            continue
        req = urllib.request.Request(img_url, headers={'User-Agent': 'AurelianCatalog/1.0'})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            with open(dl_file, 'wb') as f:
                f.write(data)
    else:
        with open(dl_file, 'rb') as f:
            data = f.read()

    kb, lum = process_to_webp(data, out_file)
    print(f"[OK] {out_file} -> {kb} KB, luminance: {lum:.1f}")

print("\nDone building 22 ingredient images.")
