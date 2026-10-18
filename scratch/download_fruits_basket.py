import urllib.request
import os
from PIL import Image

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

url = 'https://upload.wikimedia.org/wikipedia/commons/1/19/Fresh_fruits_in_a_woven_basket_on_a_wooden_table.jpg'
dest = 'scratch/fruit_candidates/fruits_woven_basket.jpg'

print("Downloading fruits_woven_basket...")
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp, open(dest, 'wb') as f:
    f.write(resp.read())

im = Image.open(dest)
print("Downloaded:", im.size, im.mode)
thumb = im.copy()
thumb.thumbnail((800, 600))
thumb.save('scratch/fruit_candidates/fruits_woven_basket_thumb.jpg', quality=85)
print("Saved thumbnail")
