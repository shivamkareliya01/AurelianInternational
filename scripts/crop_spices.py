from PIL import Image
import os

img = Image.open('src/assets/spices.jpg')
w, h = img.size
print(f'Original size: {w}x{h}')

os.makedirs('public/images', exist_ok=True)
# 1. Turmeric: top-left / top-center (x: 250 to 1100, y: 0 to 850)
turmeric = img.crop((int(w * 0.12), int(h * 0.0), int(w * 0.58), int(h * 0.48)))
turmeric.save('public/images/turmeric.jpg', quality=95)
print('Saved public/images/turmeric.jpg')

# 2. Cumin: bottom-right (x: w*0.50 to w*0.80, y: h*0.52 to h*0.95)
cumin = img.crop((int(w * 0.52), int(h * 0.52), int(w * 0.80), int(h * 0.95)))
cumin.save('public/images/cumin.jpg', quality=95)
print('Saved public/images/cumin.jpg')
