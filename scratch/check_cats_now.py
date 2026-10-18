import json

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    orig = f.read()

start = orig.find('export const categories: Category[] = ') + len('export const categories: Category[] = ')
end = orig.rfind('];') + 1
cats = json.loads(orig[start:end])
print(f"Total categories: {len(cats)}")
tot_prods = 0
for c in cats:
    print(f"  {c['slug']}: {len(c['products'])} products")
    tot_prods += len(c['products'])
print(f"Total products: {tot_prods}")
