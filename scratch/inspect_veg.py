import os
from PIL import Image

im = Image.open('public/products/category-fresh-vegetables.webp')
print('Size:', im.size)

# Let's save a small thumbnail or inspect colors/stats
colors = im.getextrema()
print('Extrema:', colors)
