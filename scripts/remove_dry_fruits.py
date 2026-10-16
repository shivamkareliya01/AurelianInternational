import json
import re

file_path = "src/data/products.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Pattern to capture everything before categories json and everything after
m = re.search(r'(export const categories:\s*Category\[\]\s*=\s*)(\[.*?\])(;\s*export const allProducts.*)', content, re.DOTALL)
if not m:
    print("Could not match categories array")
    exit(1)

prefix = m.group(1)
cats_json = m.group(2)
suffix = m.group(3)

cats = json.loads(cats_json)
print(f"Original category count: {len(cats)}")
for c in cats:
    print(f"  - {c['slug']}: {len(c['products'])} products")

# Filter out dry-fruits-nuts
filtered_cats = [c for c in cats if c['slug'] != 'dry-fruits-nuts']
print(f"New category count: {len(filtered_cats)}")
total_prods = sum(len(c['products']) for c in filtered_cats)
print(f"Total products remaining: {total_prods}")

new_cats_json = json.dumps(filtered_cats, indent=2)

header_replaced = content[:m.start(1)].replace(
    "// 6 Categories, 78 Approved Export Products",
    f"// {len(filtered_cats)} Categories, {total_prods} Approved Export Products"
)

new_content = header_replaced + prefix + new_cats_json + suffix

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully updated {file_path}!")
