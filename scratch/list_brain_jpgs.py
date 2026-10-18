import os

brain_dir = r"C:\Users\ASUS\.gemini\antigravity-ide\brain\75dbab15-dcd1-4171-b7dd-92f343211c1a"
jpgs = [f for f in os.listdir(brain_dir) if f.endswith('.jpg')]
print(f"Total .jpg files in brain dir: {len(jpgs)}")
for f in sorted(jpgs):
    print(" ", f)
