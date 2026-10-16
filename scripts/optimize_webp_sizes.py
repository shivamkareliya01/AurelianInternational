import os
from PIL import Image

products_dir = "public/products"
optimized = 0

for f in os.listdir(products_dir):
    if f.endswith('.webp'):
        p = os.path.join(products_dir, f)
        size_kb = os.path.getsize(p) / 1024
        if size_kb > 200:
            q = 75
            while size_kb > 200 and q >= 50:
                with Image.open(p) as img:
                    img.save(p, "WEBP", quality=q, method=6)
                size_kb = os.path.getsize(p) / 1024
                q -= 5
            print(f"Optimized {f} -> {size_kb:.1f} KB (quality: {q+5})")
            optimized += 1

print(f"Total optimized to <200KB: {optimized}")
