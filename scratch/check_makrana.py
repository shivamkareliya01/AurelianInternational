from PIL import Image
import numpy as np

im = Image.open('public/products/makrana-white-marble.webp')
arr = np.array(im.convert('RGB'))
print('Size:', im.size)
print('Mean RGB:', arr.mean(axis=(0,1)))
