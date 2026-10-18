import urllib.request, re

url = 'https://www.pexels.com/search/garlic%20powder/'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        html = r.read().decode('utf-8')
        # Find img tags with alt and src
        matches = re.findall(r'<img[^>]+alt="([^"]*)"[^>]+(?:src|data-src|srcset)="([^"]*)"', html)
        print(f"Matched {len(matches)} img tags with alt")
        for alt, src in matches[:10]:
            # extract pexels cdn url
            m = re.search(r'(https://images\.pexels\.com/photos/\d+/[^\s,\"]+)', src)
            if m:
                print(f"ALT: {alt[:60]}")
                print(f"SRC: {m.group(1)}")
except Exception as e:
    print('Pexels error:', e)
