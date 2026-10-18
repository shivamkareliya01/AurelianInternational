import os
from PIL import Image, ImageStat, ImageEnhance

RAW_DIR = 'scratch/ingredients_raw'
OUT_DIR = 'public/products'

mapping = {
    'garlic-powder': 'garlic-powder.jpg',
    'kasuri-methi-powder': 'kasuri-methi-powder.jpg',
    'tomato-powder': 'tomato-powder.jpg',
    'beetroot-powder': 'beetroot-powder.jpg',
    'carrot-powder': 'carrot-powder.jpg',
    'pumpkin-powder': 'pumpkin-powder.jpg',
    'mango-powder-amchur': 'mango-powder-amchur.jpg',
    'hibiscus-powder': 'hibiscus-powder.jpg',
}

def process_image(src_path, dst_path, target=(1600, 1200), max_kb=200):
    with Image.open(src_path) as img:
        img = img.convert('RGB')
        w, h = img.size
        want = target[0] / target[1]
        if w / h > want:
            nw = int(h * want)
            img = img.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
        else:
            nh = int(w / want)
            img = img.crop((0, (h - nh) // 2, w, (h + nh) // 2))
        img = img.resize(target, Image.Resampling.LANCZOS)

        stat = ImageStat.Stat(img.convert('L'))
        lum = stat.mean[0]
        if lum < 105:
            boost = 115.0 / max(lum, 10.0)
            img = ImageEnhance.Brightness(img).enhance(boost)
            img = ImageEnhance.Contrast(img).enhance(1.05)
            lum = ImageStat.Stat(img.convert('L')).mean[0]

        import io
        for q in (82, 78, 74, 70, 65, 58):
            buf = io.BytesIO()
            img.save(buf, 'WEBP', quality=q, method=6)
            if len(buf.getvalue()) <= max_kb * 1024:
                break
        with open(dst_path, 'wb') as f:
            f.write(buf.getvalue())
        return len(buf.getvalue()) // 1024, lum

for slug, filename in mapping.items():
    src = os.path.join(RAW_DIR, filename)
    dst = os.path.join(OUT_DIR, f"{slug}-ingredient.webp")
    if os.path.exists(src):
        kb, lum = process_image(src, dst)
        print(f"Processed {slug}-ingredient.webp -> {kb} KB, luminance: {lum:.1f}")
    else:
        print(f"Missing source file: {src}")
