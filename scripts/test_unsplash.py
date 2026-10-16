import urllib.request
import re

url = 'https://unsplash.com/photos/a-close-up-of-a-bunch-of-ginger-roots'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8')
        matches = re.findall(r'https://images\.unsplash\.com/photo-[a-zA-Z0-9\-]+', html)
        print('Matches:', len(matches))
        if matches:
            print('Top match:', matches[0])
            test_img = matches[0] + '?auto=format&fit=crop&w=1600&h=1200&q=80'
            req_img = urllib.request.Request(test_img, headers={'User-Agent': 'Mozilla/5.0'})
            data = urllib.request.urlopen(req_img, timeout=10).read()
            print('Downloaded bytes:', len(data))
except Exception as e:
    print('Error:', e)
