# scratch/update_3_images.py
from PIL import Image
import os

brain_dir = r"C:\Users\ASUS\.gemini\antigravity-ide\brain\d751d3db-d99a-49fc-87cd-8ea91f4b6d96"
public_dir = r"c:\Users\ASUS\Desktop\3d animated website\Aurelian inport exptort\pixel-perfect-replica\public\products"

mapping = {
    os.path.join(brain_dir, "beetroot_fresh_luxury_1792405415102.jpg"): [
        os.path.join(public_dir, "beetroot-powder-ingredient.webp"),
    ],
    os.path.join(brain_dir, "spinach_fresh_luxury_1792405439515.jpg"): [
        os.path.join(public_dir, "spinach-powder-ingredient.webp"),
    ],
    os.path.join(brain_dir, "tomato_fresh_luxury_1792405465241.jpg"): [
        os.path.join(public_dir, "tomato-powder-ingredient.webp"),
        os.path.join(public_dir, "tomato.webp"),
        os.path.join(public_dir, "tomato-800.webp"),
    ],
}

for src_path, dest_paths in mapping.items():
    if not os.path.exists(src_path):
        print(f"Source not found: {src_path}")
        continue
    img = Image.open(src_path)
    # Ensure RGB
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    
    # Resize to standard high-quality 800x600 (4:3)
    img_800 = img.resize((800, 600), Image.Resampling.LANCZOS)
    
    for dest in dest_paths:
        img_800.save(dest, "WEBP", quality=92, method=6)
        print(f"Saved: {dest} ({os.path.getsize(dest)} bytes)")

print("All 3 images processed successfully!")
