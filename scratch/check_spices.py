import os

classic_spices = [
    'coriander-seeds', 'green-cardamom', 'cloves', 'fennel-seeds', 
    'mustard-seeds', 'star-anise', 'bay-leaf', 'garam-masala'
]
for s in classic_spices:
    exists = [os.path.exists(f"public/products/{s}{suf}.webp") for suf in ['', '-2', '-3']]
    print(f"Spice {s}: {exists}")
