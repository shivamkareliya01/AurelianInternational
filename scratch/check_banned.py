with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

dp_idx = text.find('"slug": "dehydrated-powders"')
dp_block = text[dp_idx:]
banned = ['flake', 'granule', 'kibbled', 'minced']
for b in banned:
    cnt = dp_block.lower().count(b)
    print(f"{b}: {cnt}")
