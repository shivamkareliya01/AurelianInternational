import json, re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const categories: Category\[\] = (\[[\s\S]*?\n\]);', text)
if not m:
    print('Failed to find categories JSON')
    exit(1)

cats = json.loads(m.group(1))
print('Categories found:', len(cats))

deleted = {'brinjal-eggplant', 'okra-lady-finger', 'cabbage', 'green-peas', 'cauliflower'}

for c in cats:
    orig_len = len(c['products'])
    if c['slug'] == 'fresh-vegetables':
        c['products'] = [p for p in c['products'] if p['slug'] not in deleted]
        print(f"fresh-vegetables: {orig_len} -> {len(c['products'])}")
    else:
        print(f"{c['slug']}: {len(c['products'])}")

total = sum(len(c['products']) for c in cats)
print('New total product count:', total)

new_json = json.dumps(cats, indent=2, ensure_ascii=False)
new_text = text[:m.start(1)] + new_json + text[m.end(1):]

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('SUCCESS: updated src/data/products.ts')
