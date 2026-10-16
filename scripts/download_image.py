import urllib.request
import sys
import os

headers = {'User-Agent': 'AurelianExportCurator/2.0 (curator@aurelianinternational.com)'}

def download(url, out_path):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    with open(out_path, 'wb') as f:
        f.write(data)
    print(f"Downloaded {len(data)/1024:.1f} KB -> {out_path}")

if __name__ == '__main__':
    url = sys.argv[1]
    out = sys.argv[2]
    download(url, out)
