import subprocess, json

raw = subprocess.check_output(['git', 'show', 'd9c11c8:src/data/products.ts'], text=True, encoding='utf-8')
start = raw.find('export const categories: Category[] = ') + len('export const categories: Category[] = ')
end = raw.rfind('];') + 1
cats = json.loads(raw[start:end])
print('Categories in d9c11c8:')
tot = 0
for c in cats:
    print(f"  {c['slug']}: {len(c['products'])} items")
    tot += len(c['products'])
print('Total:', tot)
