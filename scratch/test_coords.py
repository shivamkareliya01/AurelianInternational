import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import os

# Base studio shot with wooden bowl and spoon on dark slate
base_img_path = r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\test_gen_1792225477244.jpg'
base = cv2.imread(base_path := base_img_path)
h, w, c = base.shape

# Let's inspect coordinates of the bowl and powder in test_gen:
# In test_gen (1600x1200):
# Bowl is around center-right: x ~ 500 to 1250, y ~ 350 to 950
# Raw onion is on the left: x ~ 100 to 500, y ~ 150 to 900
print(f"Base size: {w}x{h}")
