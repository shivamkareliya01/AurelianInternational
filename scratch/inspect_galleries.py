import os
from PIL import Image

# Let's inspect e.g. nashik-red-onion, garlic, ginger
for base in ['nashik-red-onion', 'garlic', 'ginger', 'tomato', 'potato']:
    for suff in ['', '-2', '-3']:
        fname = f"public/products/{base}{suff}.webp"
        if os.path.exists(fname):
            im = Image.open(fname)
            print(f"{fname:35}: {im.size} {im.format} {os.path.getsize(fname)} bytes")
