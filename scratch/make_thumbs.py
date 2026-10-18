from PIL import Image

for name in ['basket_assortment', 'surtido_vegetales', 'fresh_veg_2']:
    path = f'scratch/veg_candidates/{name}.jpg'
    im = Image.open(path)
    w, h = im.size
    print(f"{name}: {w}x{h}")
    # make a 800x600 preview
    thumb = im.copy()
    thumb.thumbnail((800, 600))
    thumb.save(f'scratch/veg_candidates/{name}_thumb.jpg', quality=85)
