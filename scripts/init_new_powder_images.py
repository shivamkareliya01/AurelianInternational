import os, shutil
from PIL import Image

OUT = "public/products"

def copy_or_format(src_name, dst_name, target=(1600, 1200)):
    src_path = os.path.join(OUT, src_name)
    dst_path = os.path.join(OUT, dst_name)
    if os.path.exists(src_path):
        with Image.open(src_path) as im:
            im = im.convert("RGB")
            w, h = im.size
            want = target[0] / target[1]
            if w / h > want:
                nw = int(h * want)
                im = im.crop(((w - nw) // 2, 0, (w + nw) // 2, h))
            else:
                nh = int(w / want)
                im = im.crop((0, (h - nh) // 2, w, (h + nh) // 2))
            im = im.resize(target, Image.Resampling.LANCZOS)
            im.save(dst_path, "WEBP", quality=80)
            print(f"Created {dst_name} from {src_name}")
    else:
        print(f"Source missing: {src_path}")

# Red Chilli Powder
copy_or_format("guntur-red-chilli-2.webp", "red-chilli-powder.webp")
copy_or_format("guntur-red-chilli.webp", "red-chilli-powder-ingredient.webp")
copy_or_format("guntur-red-chilli-2.webp", "red-chilli-powder-2.webp")
copy_or_format("guntur-red-chilli-3.webp", "red-chilli-powder-3.webp")

# Turmeric Powder
copy_or_format("turmeric-2.webp", "turmeric-powder.webp")
copy_or_format("turmeric.webp", "turmeric-powder-ingredient.webp")
copy_or_format("turmeric-2.webp", "turmeric-powder-2.webp")
copy_or_format("turmeric-3.webp", "turmeric-powder-3.webp")

# Drumstick (Moringa) Pod Powder
copy_or_format("moringa-seed-powder.webp", "drumstick-moringa-pod-powder.webp")
copy_or_format("drumstick-moringa.webp", "drumstick-moringa-pod-powder-ingredient.webp")
copy_or_format("moringa-seed-powder-2.webp", "drumstick-moringa-pod-powder-2.webp")
copy_or_format("moringa-seed-powder-3.webp", "drumstick-moringa-pod-powder-3.webp")

print("All 3 new powders image sets initialized.")
