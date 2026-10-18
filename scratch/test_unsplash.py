import urllib.request
import json

# Let's test Unsplash public search endpoint (used on web)
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

test_url = "https://unsplash.com/napi/search/photos?query=turmeric+powder+bowl&per_page=5"
try:
    req = urllib.request.Request(test_url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read().decode('utf-8'))
        results = data.get('results', [])
        print(f"Unsplash results for 'turmeric powder bowl': {len(results)}")
        for it in results:
            raw_url = it['urls']['raw']
            desc = it.get('description') or it.get('alt_description')
            print("  URL:", raw_url[:60], "Desc:", desc)
except Exception as e:
    print("Unsplash error:", e)
