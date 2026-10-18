import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import os, re
from PIL import Image
import numpy as np

with open('src/data/powderColors.ts', 'r', encoding='utf-8') as f:
    text = f.read()

slugs = re.findall(r'"([a-z0-9\-]+)":\s*\{', text)
print(f'Total powder slugs in powderColors.ts: {len(slugs)}')

missing = []
for s in slugs:
    for suf in ['', '-ingredient', '-2', '-3']:
        fpath = f'public/products/{s}{suf}.webp'
        if not os.path.exists(fpath):
            missing.append(fpath)

print(f'Missing image files: {len(missing)}')
if missing:
    print('Missing list:')
    for m in missing:
        print('  ', m)
