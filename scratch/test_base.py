import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

# Load pink_onion_pow (has pink powder in bowl on dark slate)
src = Image.open(r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\pink_onion_pow_179222581761.jpg' if os.path.exists(r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\pink_onion_pow_179222581761.jpg') else r'C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a\test_gen_1792225477244.jpg')
print("Loaded base:", src.size)
