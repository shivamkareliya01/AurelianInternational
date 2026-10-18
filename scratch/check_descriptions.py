import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

arr = text.split('export const categories: Category[] =', 1)[1].split(';\n\nexport const allProducts')[0].strip()
cats = json.loads(arr)

long_descs = []
short_descs = []
for c in cats:
    for p in c['products']:
        d = p.get('description', '')
        if len(d) > 300:
            long_descs.append((p['slug'], len(d), d[:80] + '...'))
        elif len(d) < 30:
            short_descs.append((p['slug'], len(d), d))

print(f"Total products: {sum(len(c['products']) for c in cats)}")
print(f"Very long descriptions (>300 chars): {len(long_descs)}")
print(f"Very short descriptions (<30 chars): {len(short_descs)}")
if long_descs:
    print("Sample long:", long_descs[0])
