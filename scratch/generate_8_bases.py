import urllib.request
import urllib.parse
import time
import os
from PIL import Image

os.makedirs('scratch/bases', exist_ok=True)

configs = [
    {
        'slug': 'green-chilli-powder',
        'prompt': 'Bright high-key commercial food photography, a large heap of fine dark olive green chilli powder in a rustic wooden bowl in the foreground, wooden spoon, fresh green chili peppers beside bowl, soft daylight, 3/4 high angle, sharp macro powder texture, no text',
        'seed': 142
    },
    {
        'slug': 'pumpkin-powder',
        'prompt': 'Bright high-key commercial food photography, a large heap of fine golden orange pumpkin powder in a small wooden bowl in the foreground, wooden spoon, pumpkin slice beside bowl, soft daylight, 3/4 high angle, sharp macro powder texture, no text',
        'seed': 253
    },
    {
        'slug': 'mango-powder-amchur',
        'prompt': 'Bright high-key commercial food photography, a large heap of fine pale golden beige amchur dried mango powder in a wooden bowl in the foreground, wooden spoon, dried mango slices beside bowl, soft daylight, 3/4 high angle, sharp macro powder texture, no text',
        'seed': 364
    },
    {
        'slug': 'banana-powder',
        'prompt': 'Bright high-key commercial food photography, a large heap of fine creamy pale off-white banana fruit powder in a wooden bowl in the foreground, wooden spoon, fresh sliced bananas beside bowl, soft daylight, 3/4 high angle, sharp macro powder texture, no text',
        'seed': 475
    },
    {
        'slug': 'lemon-powder',
        'prompt': 'Bright high-key commercial food photography, a large heap of fine pale yellow lemon fruit powder in a wooden bowl in the foreground, wooden spoon, fresh cut lemons beside bowl, soft daylight, 3/4 high angle, sharp macro powder texture, no text',
        'seed': 586
    },
    {
        'slug': 'amla-powder',
        'prompt': 'Bright high-key commercial food photography, a large heap of fine light greenish brown herbal amla powder in a wooden bowl in the foreground, wooden spoon, fresh green amla berries beside bowl, soft daylight, 3/4 high angle, sharp macro powder texture, no text',
        'seed': 697
    },
    {
        'slug': 'aloe-vera-powder',
        'prompt': 'Bright high-key commercial food photography, a large heap of fine pale light green aloe vera powder in a wooden bowl in the foreground, wooden spoon, cut aloe vera leaf beside bowl, soft daylight, 3/4 high angle, sharp macro powder texture, no text',
        'seed': 718
    },
    {
        'slug': 'hibiscus-powder',
        'prompt': 'Bright high-key commercial food photography, a large heap of fine deep crimson red hibiscus petal powder in a wooden bowl in the foreground, wooden spoon, dried red hibiscus calyx beside bowl, soft daylight, 3/4 high angle, sharp macro powder texture, no text',
        'seed': 829
    }
]

for cfg in configs:
    slug = cfg['slug']
    target_file = f"scratch/bases/{slug}.jpg"
    if os.path.exists(target_file) and os.path.getsize(target_file) > 10000:
        print(f"Skipping {slug}, already exists.")
        continue
    
    encoded = urllib.parse.quote(cfg['prompt'])
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1200&height=900&nologo=true&seed={cfg['seed']}"
    
    for attempt in range(5):
        print(f"Fetching {slug} (attempt {attempt+1})...")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=40) as resp:
                data = resp.read()
                if len(data) > 10000:
                    with open(target_file, 'wb') as f:
                        f.write(data)
                    print(f"  Successfully saved {target_file} ({len(data)} bytes)")
                    break
        except Exception as e:
            print(f"  Attempt {attempt+1} error: {e}")
            time.sleep(15)
    
    # Respect rate limits
    time.sleep(12)

print("Base generation run complete.")
