import os
from PIL import Image

brain_dir = r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a"
storage_dir = os.path.join(brain_dir, ".tempmediaStorage")

def inspect_folder(folder):
    if not os.path.exists(folder):
        return []
    items = []
    for f in os.listdir(folder):
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            fp = os.path.join(folder, f)
            sz = os.path.getsize(fp)
            try:
                with Image.open(fp) as im:
                    w, h = im.size
                    items.append((f, w, h, sz, fp))
            except Exception:
                pass
    return items

brain_imgs = inspect_folder(brain_dir)
storage_imgs = inspect_folder(storage_dir)

print(f"Images directly in brain dir: {len(brain_imgs)}")
for f, w, h, sz, fp in brain_imgs[:25]:
    print(f"  {f:40} {w}x{h}  {sz//1024}KB")

print(f"\nImages in tempmediaStorage: {len(storage_imgs)}")
# Count by dimensions
dim_counts = {}
for f, w, h, sz, fp in storage_imgs:
    dim_counts[(w, h)] = dim_counts.get((w, h), 0) + 1
print("Dimensions breakdown in tempmediaStorage:", dim_counts)
