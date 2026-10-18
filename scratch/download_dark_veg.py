import urllib.request
from PIL import Image

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
url = 'https://upload.wikimedia.org/wikipedia/commons/9/93/Front-view-fresh-ripe-vegetables-composition-dark-table-color-ripe-fresh.jpg'
dest = 'scratch/veg_candidates/dark_table_veg.jpg'

print("Downloading dark_table_veg...")
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp, open(dest, 'wb') as f:
    f.write(resp.read())

im = Image.open(dest)
print("Downloaded:", im.size, im.mode)
thumb = im.copy()
thumb.thumbnail((800, 600))
thumb.save('scratch/veg_candidates/dark_table_veg_thumb.jpg', quality=85)
print("Saved thumbnail")
