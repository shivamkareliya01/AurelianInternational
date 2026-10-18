import os
all_files = os.listdir('public/products')
tile_files = [f for f in all_files if 'tile' in f or 'paver' in f or 'slab' in f]
print("Tile-related files in public/products:", sorted(tile_files))
