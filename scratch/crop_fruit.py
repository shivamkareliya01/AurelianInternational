from PIL import Image

src = 'scratch/fruit_candidates/Collection_of_fruits.jpg'
im = Image.open(src)
w, h = im.size
print("Source dimensions:", w, h)

# 4:3 crop centered
target_w = int(h * 4 / 3)
x1 = (w - target_w) // 2
y1 = 0
x2 = x1 + target_w
y2 = h

print(f"Crop box: ({x1}, {y1}, {x2}, {y2}) -> size ({x2-x1}, {y2-y1})")
cropped = im.crop((x1, y1, x2, y2))
resized = cropped.resize((1600, 1200), Image.Resampling.LANCZOS)
dest = 'scratch/fruit_candidates/category-fresh-fruits-new.webp'
resized.save(dest, 'WEBP', quality=92)
print("Saved 1600x1200 WebP:", dest)

# make thumbnail for viewing
thumb = resized.copy()
thumb.thumbnail((800, 600))
thumb.save('scratch/fruit_candidates/fruits_new_thumb.jpg', quality=85)
