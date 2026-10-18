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
        imgs = re.findall(r'https://images\.pexels\.com/photos/\d+/[^\s\"\'\?]+', html)
        print('Pexels images matched:', len(imgs))
        for img in list(dict.fromkeys(imgs))[:5]:
            print(' ', img)
except Exception as e:
    print('Pexels error:', e)
