import subprocess, json, os

raw = subprocess.check_output(['git', 'show', 'd9c11c8:src/data/products.ts'], text=True, encoding='utf-8')
start = raw.find('export const categories: Category[] = ') + len('export const categories: Category[] = ')
end = raw.rfind('];') + 1
cats = json.loads(raw[start:end])
nst = next(c for c in cats if c['slug'] == 'natural-stones-tiles')
print("Total products in natural-stones-tiles:", len(nst['products']))
for p in nst['products']:
    exists = [os.path.exists(f"public/products/{p['slug']}{suf}.webp") for suf in ['', '-2', '-3']]
    print(f"  {p['slug']}: {exists}")
