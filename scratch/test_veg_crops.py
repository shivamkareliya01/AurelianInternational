from PIL import Image

src_path = 'scratch/veg_candidates/dark_table_veg.jpg'
im = Image.open(src_path)
w, h = im.size
print("Original size:", w, h)

# We want 4:3 ratio. 
# Target height: h = 3840. Target width for 4:3 = 3840 * 4 / 3 = 5120.
# Let's test different x_offsets:
# Total width is 5760. 5760 - 5120 = 640 slack horizontally.
# If we center horizontally: x1 = 320, x2 = 5440.
# If we shift slightly to the right to catch all the zucchini/eggplants: x1 = 600, x2 = 5720.
# If we zoom in slightly: crop to 4400x3300 (4:3), focused right on the colorful center:

crops = {
    'crop_full_center': (320, 0, 5440, 3840),
    'crop_full_right': (600, 0, 5720, 3840),
    'crop_focused_cluster': (800, 300, 5600, 3900)  # slightly zoomed in on vegetables
}

for name, box in crops.items():
    # clamp box
    x1, y1, x2, y2 = box
    x2 = min(x2, w)
    y2 = min(y2, h)
    cropped = im.crop((x1, y1, x2, y2))
    # resize to 1600x1200
    resized = cropped.resize((1600, 1200), Image.Resampling.LANCZOS)
    resized.save(f'scratch/veg_candidates/{name}.webp', 'WEBP', quality=92)
    # also save a thumb for quick view
    thumb = resized.copy()
    thumb.thumbnail((800, 600))
    thumb.save(f'scratch/veg_candidates/{name}_thumb.jpg', quality=85)
    print(f"Generated {name}: {resized.size}")
