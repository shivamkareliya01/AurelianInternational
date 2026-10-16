import urllib.request
import os

test_candidates = {
    "ginger": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7",
    "green-chilli": "https://images.unsplash.com/photo-1597362925123-77861d3fbac7",
    "white-onion": "https://images.unsplash.com/photo-1587049352846-4a222e784d38",
    "cauliflower": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3",
    "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e",
    "mango": "https://images.unsplash.com/photo-1553279768-865429fa0078",
    "grapes": "https://images.unsplash.com/photo-1537640538966-79f369143f8f",
    "orange": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b",
    "papaya": "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe",
    "turmeric": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
    "red-chilli": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d",
    "black-pepper": "https://images.unsplash.com/photo-1509358271058-acd22cc93898",
    "cumin": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d",
    "coriander": "https://images.unsplash.com/photo-1596040033282-55079a419eb2",
    "cardamom": "https://images.unsplash.com/photo-1546833999-b9f581a1996d",
    "cloves": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
    "fenugreek": "https://images.unsplash.com/photo-1596797038530-2c107229654b",
    "fennel": "https://images.unsplash.com/photo-1540420773420-3366772f4999",
    "garam-masala": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d",
    "cashew-nuts": "https://images.unsplash.com/photo-1536591375315-1b836814d45d",
    "pistachios": "https://images.unsplash.com/photo-1550950158-d0d960dff51b",
    "dates": "https://images.unsplash.com/photo-1559181567-c3190ca9959b",
    "figs": "https://images.unsplash.com/photo-1510627498534-cf7e9002facc",
    "apricots": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb"
}

os.makedirs('scratch/test_images', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for name, base_url in test_candidates.items():
    url = f"{base_url}?auto=format&fit=crop&w=1600&h=1200&q=80"
    out = f"scratch/test_images/{name}.jpg"
    try:
        req = urllib.request.Request(url, headers=headers)
        data = urllib.request.urlopen(req, timeout=10).read()
        with open(out, 'wb') as f:
            f.write(data)
        print(f"Downloaded {name}: {len(data)/1024:.1f} KB")
    except Exception as e:
        print(f"Failed {name}: {e}")
