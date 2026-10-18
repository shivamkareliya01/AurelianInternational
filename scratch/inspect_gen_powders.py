import os
from PIL import Image
import numpy as np

brain_dir = r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a"

gen_files = [
    "test_gen_1792225477244.jpg", # white onion powder
    "pink_onion_pow_1792225581761.jpg",
    "white_onion_flk_1792225604241.jpg",
    "red_onion_flk_1792225627019.jpg",
    "garlic_powder_1792225653230.jpg",
    "garlic_flakes_1792225677653.jpg",
    "garlic_granules_1792225701931.jpg",
    "ginger_powder_1792225725169.jpg",
    "ginger_flakes_1792225752513.jpg",
    "moringa_leaf_pow_1792225778074.jpg",
    "moringa_seed_pow_1792225802376.jpg",
    "spinach_powder_1792225826333.jpg",
    "curry_leaf_pow_1792225852676.jpg"
]

for gf in gen_files:
    fp = os.path.join(brain_dir, gf)
    if os.path.exists(fp):
        with Image.open(fp) as im:
            rgb = im.convert('RGB')
            arr = np.array(rgb)
            lum = np.mean(0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2])
            print(f"{gf:38} {im.size}  lum={lum:5.1f}")
    else:
        print(f"{gf:38} MISSING")
