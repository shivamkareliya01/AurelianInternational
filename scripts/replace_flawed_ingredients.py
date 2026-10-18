import urllib.request
import io
from PIL import Image, ImageStat, ImageEnhance

HEADERS = {'User-Agent': 'AurelianCatalog/1.0 (contact@aurelianinternational.com)'}

REPLACEMENTS = {
    'white-onion-powder-ingredient.webp': 'https://upload.wikimedia.org/wikipedia/commons/a/af/White_onions.jpg',
    'curry-leaf-powder-ingredient.webp': 'https://upload.wikimedia.org/wikipedia/commons/3/34/Murraya_koenigii_leaves_-_curry_leaves.jpg',
    'kasuri-methi-powder-ingredient.webp': 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Kasoori_Methi.jpg'
}

def process_image(raw_bytes, out_path, target=(1600, 1200), max_kb=200):
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

for fn, url in REPLACEMENTS.items():
    print(f"Downloading {fn} from {url}...")
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    dst = f"public/products/{fn}"
    kb, lum = process_image(data, dst)
    print(f"[OK] {dst}: {kb} KB, luminance: {lum:.1f}")

print("Replacement of White Onion, Curry Leaf, and Kasuri Methi complete.")
