import os
import shutil
from PIL import Image

brain_dir = r"C:\Users\ASUS\.gemini\antigravity-ide\brain\a64ef508-192c-40b3-b71a-401b0ebbc774"
public_prod_dir = r"c:\Users\ASUS\Desktop\3d animated website\Aurelian inport exptort\pixel-perfect-replica\public\products"
public_img_prod_dir = r"c:\Users\ASUS\Desktop\3d animated website\Aurelian inport exptort\pixel-perfect-replica\public\images\products"
backup_dir = os.path.join(public_prod_dir, "backup-original")

os.makedirs(public_img_prod_dir, exist_ok=True)
os.makedirs(backup_dir, exist_ok=True)

powders_map = {
    "white-onion-powder": {
        "hero": "white_onion_powder_hero_1792312122008.jpg",
        "ing": "white_onion_inset_1792312150395.jpg"
    },
    "pink-red-onion-powder": {
        "hero": "pink_onion_powder_hero_1792312181604.jpg",
        "ing": "pink_onion_inset_1792312208999.jpg"
    }
}

for slug, files in powders_map.items():
    # Process hero (4:3)
    hero_src = os.path.join(brain_dir, files["hero"])
    hero_dest = os.path.join(public_prod_dir, f"{slug}.webp")
    if os.path.exists(hero_dest):
        b_dest = os.path.join(backup_dir, f"{slug}.webp")
        if not os.path.exists(b_dest):
            shutil.copy2(hero_dest, b_dest)
            print(f"Backed up {slug}.webp")
    
    with Image.open(hero_src) as img:
        img_rgb = img.convert("RGB")
        w, h = img_rgb.size
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
        
        img_1600 = img_rgb.resize((1600, 1200), Image.Resampling.LANCZOS)
        img_1600.save(hero_dest, "WEBP", quality=84, method=6)
        img_1600.save(os.path.join(public_img_prod_dir, f"{slug}.webp"), "WEBP", quality=84, method=6)
        
        img_800 = img_rgb.resize((800, 600), Image.Resampling.LANCZOS)
        img_800.save(os.path.join(public_prod_dir, f"{slug}-800.webp"), "WEBP", quality=84, method=6)
        img_800.save(os.path.join(public_img_prod_dir, f"{slug}-800.webp"), "WEBP", quality=84, method=6)
        print(f"Saved {slug}.webp hero ({os.path.getsize(hero_dest)/1024:.1f} KB)")

    # Process ingredient inset (square 1:1, saved as 1600x1200 canvas or 1200x1200)
    ing_src = os.path.join(brain_dir, files["ing"])
    ing_dest = os.path.join(public_prod_dir, f"{slug}-ingredient.webp")
    if os.path.exists(ing_dest):
        b_dest = os.path.join(backup_dir, f"{slug}-ingredient.webp")
        if not os.path.exists(b_dest):
            shutil.copy2(ing_dest, b_dest)
            print(f"Backed up {slug}-ingredient.webp")

    with Image.open(ing_src) as img:
        img_rgb = img.convert("RGB")
        w, h = img_rgb.size
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        img_sq = img_rgb.crop((left, top, left + side, top + side))
        
        # Inset image can be 1200x1200 (satisfies width >= 1200px in validate-images.py)
        img_1200 = img_sq.resize((1200, 1200), Image.Resampling.LANCZOS)
        img_1200.save(ing_dest, "WEBP", quality=85, method=6)
        img_1200.save(os.path.join(public_img_prod_dir, f"{slug}-ingredient.webp"), "WEBP", quality=85, method=6)
        print(f"Saved {slug}-ingredient.webp ({os.path.getsize(ing_dest)/1024:.1f} KB)")

print("Powders converted successfully!")
