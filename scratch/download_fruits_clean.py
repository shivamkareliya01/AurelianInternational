import urllib.request
import time
from PIL import Image

url = "https://upload.wikimedia.org/wikipedia/commons/5/5c/Collection_of_fruits_%28Unsplash%29.jpg"
dest = "scratch/fruit_candidates/Collection_of_fruits.jpg"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for attempt in range(3):
    try:
        print(f"Attempt {attempt+1} downloading {url}...")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as r, open(dest, 'wb') as f:
            while True:
                chunk = r.read(1024 * 64)
                if not chunk:
                    break
                f.write(chunk)
        print("Download successful!")
        im = Image.open(dest)
        print("Image size:", im.size, im.mode)
        thumb = im.copy()
        thumb.thumbnail((800, 600))
        thumb.save("scratch/fruit_candidates/Collection_of_fruits_thumb.jpg", quality=85)
        print("Thumbnail saved successfully!")
        break
    except Exception as e:
        print(f"Error on attempt {attempt+1}: {e}")
        time.sleep(2)
