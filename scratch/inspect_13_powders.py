from PIL import Image, ImageStat
import os

images = {
    'lemon-powder': 'scratch/bases/lemon-powder.jpg',
    'rose-petal-powder': 'scratch/candidates/rose-petal-powder.jpg',
    'guava-powder': 'scratch/bases/guava-powder.jpg',
    'papaya-powder': 'scratch/bases/papaya-powder.jpg',
    'banana-powder': 'scratch/bases/banana-powder.jpg',
    'amla-powder': 'scratch/bases/amla-powder.jpg',
    'aloe-vera-powder': 'scratch/bases/aloe-vera-powder.jpg',
    'wheatgrass-powder': 'scratch/candidates/wheatgrass-powder.jpg',
    'bitter-gourd-karela-powder': 'scratch/candidates/bitter-gourd-karela-powder.jpg',
    'pomegranate-anardana-powder': 'scratch/candidates/pomegranate-anardana-powder.jpg',
    'mango-powder-amchur': 'scratch/bases/mango-powder-amchur.jpg',
    'pumpkin-powder': 'scratch/bases/pumpkin-powder.jpg',
    'green-chilli-powder': 'scratch/bases/green-chilli-powder.jpg',
}

for k, p in images.items():
    if os.path.exists(p):
        im = Image.open(p)
        stat = ImageStat.Stat(im.convert('L'))
        print(f"{k}: exists, size={im.size}, lum={stat.mean[0]:.1f}, file={p}")
    else:
        print(f"{k}: MISSING ({p})")
