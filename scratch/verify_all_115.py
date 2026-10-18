import subprocess, json, os

raw = subprocess.check_output(['git', 'show', 'd9c11c8:src/data/products.ts'], text=True, encoding='utf-8')
start = raw.find('export const categories: Category[] = ') + len('export const categories: Category[] = ')
end = raw.rfind('];') + 1
cats = json.loads(raw[start:end])

agri = next(c for c in cats if c['slug'] == 'agriculture')
veg = next(c for c in cats if c['slug'] == 'fresh-vegetables')
fruits = next(c for c in cats if c['slug'] == 'fresh-fruits')
spices_orig = next(c for c in cats if c['slug'] == 'spices')
nst = next(c for c in cats if c['slug'] == 'natural-stones-tiles')

# 8 classic spices from build_products_ts.py
with open('scratch/build_products_ts.py', 'r', encoding='utf-8') as f:
    bps = f.read()
scope = {}
exec(bps, scope)
classic_spices = scope['classic_spices']
spices_14 = list(spices_orig['products']) + classic_spices

# 12 stones: all items in nst except the 3 tiles
tile_3_slugs = {'vitrified-tiles', 'porcelain-tiles', 'ceramic-wall-tiles'}
stones_12 = [p for p in nst['products'] if p['slug'] not in tile_3_slugs]

# 10 tiles: the 3 tiles + 7 extra tiles from build_products_ts.py
# (glazed-vitrified-tiles, large-format-porcelain-slabs, polished-porcelain-tiles, digital-wall-tiles, subway-ceramic-tiles, outdoor-parking-tiles, anti-skid-ceramic-tiles)
extra_7_tiles = [p for p in scope['ceramic_tiles_prods'] if p['slug'] not in tile_3_slugs]
tiles_10 = [p for p in nst['products'] if p['slug'] in tile_3_slugs] + extra_7_tiles

print("Counts:")
print("  Agriculture:", len(agri['products']))
print("  Fresh Veg:", len(veg['products']))
print("  Fresh Fruits:", len(fruits['products']))
print("  Spices:", len(spices_14))
print("  Natural Stones:", len(stones_12))
print("  Ceramic Tiles:", len(tiles_10))

# Check images for all 6 categories:
for cat_name, prods in [
    ('Agriculture', agri['products']),
    ('Fresh Veg', veg['products']),
    ('Fresh Fruits', fruits['products']),
    ('Spices', spices_14),
    ('Natural Stones', stones_12),
    ('Ceramic Tiles', tiles_10)
]:
    missing = []
    for p in prods:
        imgs = [p['image']] + p.get('gallery', [])
        for img in imgs:
            fpath = os.path.join('public', img.lstrip('/'))
            if not os.path.exists(fpath):
                missing.append((p['slug'], img))
    print(f"  {cat_name}: {len(missing)} missing files")
    if missing:
        print("    Missing:", missing)
