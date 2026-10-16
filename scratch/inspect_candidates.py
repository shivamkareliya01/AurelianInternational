import os
from PIL import Image

def check_dir(dir_path):
    print(f"=== Checking {dir_path} ===")
    for f in sorted(os.listdir(dir_path)):
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            p = os.path.join(dir_path, f)
            try:
                with Image.open(p) as img:
                    print(f"  {f:32} : {img.size[0]:4}x{img.size[1]:4} ({img.format}) {os.path.getsize(p)/1024:.1f} KB")
            except Exception as e:
                print(f"  {f:32} : ERROR {e}")

check_dir("scratch/candidates")
check_dir("scratch/candidates/batch2")
