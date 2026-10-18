import os, re
from PIL import Image, ImageStat, ImageEnhance

with open('src/data/powderColors.ts', 'r', encoding='utf-8') as f:
    text = f.read()

slugs = list(re.findall(r'"([a-z0-9-]+)":\s*\{', text))
suffixes = ['', '-ingredient', '-2', '-3']

for s in slugs:
    for suf in suffixes:
        fn = f"public/products/{s}{suf}.webp"
        if os.path.exists(fn):
            with Image.open(fn) as im:
                im = im.convert('RGB')
                lum = ImageStat.Stat(im.convert('L')).mean[0]
                if lum < 105:
                    boost = 115.0 / max(lum, 10.0)
                    im = ImageEnhance.Brightness(im).enhance(boost)
                    im = ImageEnhance.Contrast(im).enhance(1.05)
                    # save back
                    import io
                    for q in (82, 78, 74, 70, 65, 58):
                        buf = io.BytesIO()
                        im.save(buf, "WEBP", quality=q, method=6)
                        if len(buf.getvalue()) <= 250 * 1024:
                            break
                    with open(fn, "wb") as out:
                        out.write(buf.getvalue())
                    new_lum = ImageStat.Stat(im.convert('L')).mean[0]
                    print(f"Boosted {fn}: {lum:.1f} -> {new_lum:.1f} ({len(buf.getvalue())//1024} KB)")

print("Brightness normalization complete.")
