import os
import shutil
from PIL import Image

brain_dir = r"C:\Users\ASUS\.gemini\antigravity-ide\brain\a64ef508-192c-40b3-b71a-401b0ebbc774"
public_prod_dir = r"c:\Users\ASUS\Desktop\3d animated website\Aurelian inport exptort\pixel-perfect-replica\public\products"
public_img_prod_dir = r"c:\Users\ASUS\Desktop\3d animated website\Aurelian inport exptort\pixel-perfect-replica\public\images\products"
backup_dir = os.path.join(public_prod_dir, "backup-original")

os.makedirs(public_img_prod_dir, exist_ok=True)
os.makedirs(backup_dir, exist_ok=True)

veg_map = {
    "garlic": "garlic_studio_1792310587065.jpg",
    "carrot": "carrot_studio_1792310616264.jpg",
    "green-chilli": "green_chilli_studio_1792310657116.jpg",
    "nashik-red-onion": "red_onion_studio_1792310683931.jpg",
    "white-onion": "white_onion_studio_1792310703186.jpg",
    "potato": "potato_studio_1792310732026.jpg",
    "tomato": "tomato_studio_1792310753001.jpg",
    "ginger": "ginger_studio_1792310773756.jpg",
    "drumstick-moringa": "drumstick_studio_1792310794595.jpg"
}

print("Backing up and processing 9 fresh vegetable studio images...")

for slug, filename in veg_map.items():
    src_path = os.path.join(brain_dir, filename)
    if not os.path.exists(src_path):
        print(f"ERROR: {src_path} not found")
        continue

    # Backup existing
    existing_dest = os.path.join(public_prod_dir, f"{slug}.webp")
    if os.path.exists(existing_dest):
        backup_file = os.path.join(backup_dir, f"{slug}.webp")
        if not os.path.exists(backup_file):
            shutil.copy2(existing_dest, backup_file)
            print(f"Backed up {slug}.webp to {backup_file}")

    with Image.open(src_path) as img:
        img_rgb = img.convert("RGB")
        w, h = img_rgb.size
        # Crop or ensure 4:3
        target_ratio = 4.0 / 3.0
        current_ratio = w / h
        if abs(current_ratio - target_ratio) > 0.01:
            if current_ratio > target_ratio:
                new_w = int(h * target_ratio)
                left = (w - new_w) // 2
                img_rgb = img_rgb.crop((left, 0, left + new_w, h))
            else:
                new_h = int(w / target_ratio)
                top = (h - new_h) // 2
                img_rgb = img_rgb.crop((0, top, w, top + new_h))
        
        # Resize to 1600x1200 (standard high-res 4:3)
        img_1600 = img_rgb.resize((1600, 1200), Image.Resampling.LANCZOS)
        
        # Save 1600px version
        out_prod = os.path.join(public_prod_dir, f"{slug}.webp")
        out_img_prod = os.path.join(public_img_prod_dir, f"{slug}.webp")
        
        # Save with webp quality 84 (typically ~100-180KB, strictly < 300KB)
        img_1600.save(out_prod, "WEBP", quality=84, method=6)
        img_1600.save(out_img_prod, "WEBP", quality=84, method=6)
        
        # Save 800px version
        img_800 = img_rgb.resize((800, 600), Image.Resampling.LANCZOS)
        out_prod_800 = os.path.join(public_prod_dir, f"{slug}-800.webp")
        out_img_prod_800 = os.path.join(public_img_prod_dir, f"{slug}-800.webp")
        img_800.save(out_prod_800, "WEBP", quality=84, method=6)
        img_800.save(out_img_prod_800, "WEBP", quality=84, method=6)

        sz_kb = os.path.getsize(out_prod) / 1024
        print(f"Saved {slug}.webp (1600x1200, {sz_kb:.1f} KB) and 800px version")

print("Finished processing images.")
