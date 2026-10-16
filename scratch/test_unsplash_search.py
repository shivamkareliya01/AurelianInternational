import urllib.request
import re

def test_q(q):
    url = f'https://unsplash.com/s/photos/{q}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8')
            matches = list(dict.fromkeys(re.findall(r'https://images\.unsplash\.com/photo-[a-zA-Z0-9\-]+', html)))
            print(f'=== {q}: found {len(matches)} ===')
            for m in matches[:3]:
                print(' ', m)
            return matches
    except Exception as e:
        print('Error:', e)
        return []

test_q('white-marble-texture')
test_q('green-marble-texture')
test_q('white-granite-texture')
test_q('sandstone-texture')
test_q('limestone-texture')
test_q('slate-tile-texture')
test_q('cobblestone')
test_q('subway-tile')
test_q('dry-figs')
test_q('dried-apricots')
