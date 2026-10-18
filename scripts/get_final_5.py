import urllib.request
import urllib.parse
import json
import os
import io
import time
from PIL import Image, ImageStat, ImageEnhance

HEADERS = {'User-Agent': 'AurelianCatalog/1.0 (contact@aurelianinternational.com)'}

TARGET_FILES = {
    'green-chilli-powder': 'File:Green chilli.jpg',
    'banana-powder': 'File:Bananas (white background).jpg',
    'lemon-powder': 'File:Lemon - whole and split.jpg',
    'amla-powder': 'File:Gooseberry ( Phyllanthus emblica).jpg',
    'aloe-vera-powder': 'File:Aloe vera leaf showing the gel (1).JPG'
}

def get_wikimedia_url(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=HEADERS)
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

    stat = ImageStat.Stat(img.convert("L"))
    lum = stat.mean[0]
    if lum < 105:
        boost = 115.0 / max(lum, 10.0)
        img = ImageEnhance.Brightness(img).enhance(boost)
        img = ImageEnhance.Contrast(img).enhance(1.05)
        lum = ImageStat.Stat(img.convert("L")).mean[0]

    for q in (82, 78, 74, 70, 65, 58):
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=q, method=6)
        if len(buf.getvalue()) <= max_kb * 1024:
            break
    with open(out_path, "wb") as f:
        f.write(buf.getvalue())
    return len(buf.getvalue()) // 1024, lum

for slug, title in TARGET_FILES.items():
    print(f"Fetching {slug} ({title})...")
    url = get_wikimedia_url(title)
    if not url:
        print(f"FAILED to find URL for {title}")
        continue
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    
    out_file = f"public/products/{slug}-ingredient.webp"
    kb, lum = process_to_webp(data, out_file)
    print(f"[OK] {out_file} -> {kb} KB, luminance: {lum:.1f}")
    time.sleep(1.5)

# Also boost white-onion-powder-ingredient.webp if luminance < 105
wo_path = "public/products/white-onion-powder-ingredient.webp"
if os.path.exists(wo_path):
    with open(wo_path, "rb") as f:
        wo_bytes = f.read()
    kb, lum = process_to_webp(wo_bytes, wo_path)
    print(f"[OK] {wo_path} boosted -> {kb} KB, luminance: {lum:.1f}")

print("\nAll target ingredient images built.")
