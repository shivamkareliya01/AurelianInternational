import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import os

# Let's inspect test_gen (white onion powder) as our base bowl on dark slate
base_path = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\test_gen_1792225477244.jpg'
base_img = Image.open(base_path)
print("Base image size:", base_img.size)

# We can also use fresh produce from public/products/ (like tomato.webp, carrot.webp, etc.)
tomato_ref = Image.open('public/products/tomato.webp')
print("Tomato ref size:", tomato_ref.size)
