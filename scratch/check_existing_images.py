import subprocess, json, os

raw = subprocess.check_output(['git', 'show', 'd9c11c8:src/data/products.ts'], text=True, encoding='utf-8')
start = raw.find('export const categories: Category[] = ') + len('export const categories: Category[] = ')
end = raw.rfind('];') + 1
cats = json.loads(raw[start:end])

for c in cats:
    print('Category:', c['slug'])
    missing = []
    for p in c['products']:
        for img in [p['image']] + p.get('gallery', []):
            fpath = os.path.join('public', img.lstrip('/'))
            if not os.path.exists(fpath):
                missing.append((p['slug'], img))
    print(f"  Total products: {len(c['products'])}. Missing image files: {len(missing)}")
    if missing:
        print("    Sample missing:", missing[:5])
