import json, re

# Read current products.ts
with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace line 375: "suitability for dehydration flakes." -> "suitability for dehydration processing and fine powders."
text = text.replace(
    '"High-total-soluble-solids white onions cultivated across Saurashtra, offering mild sweetness, crisp flesh, and optimal suitability for dehydration flakes."',
    '"High-total-soluble-solids white onions cultivated across Saurashtra, offering mild sweetness, crisp flesh, and optimal suitability for dehydration processing and fine powders."'
)

# Replace top comment if present
text = text.replace(
    '// 7 Categories, 103 Approved Export Products with Dedicated High-Resolution Local Assets',
    '// 7 Categories, 97 Approved Export Products with Dedicated High-Resolution Local Assets'
)

# Identify the 6 slugs to remove:
DELETED_SLUGS = {
    'dehydrated-white-onion-flakes',
    'dehydrated-red-onion-flakes',
    'dehydrated-garlic-flakes',
    'garlic-granules',
    'dehydrated-ginger-flakes',
    'potato-flakes',
}

# The 22 target powder slugs in user-specified order:
TARGET_22_SLUGS = [
    'white-onion-powder',
    'pink-red-onion-powder',
    'garlic-powder',
    'ginger-powder-saunth',
    'moringa-leaf-powder',
    'moringa-seed-powder',
    'spinach-powder',
    'curry-leaf-powder',
    'mint-leaf-powder',
    'coriander-leaf-powder',
    'kasuri-methi-powder',
    'tomato-powder',
    'beetroot-powder',
    'carrot-powder',
    'green-chilli-powder',
    'pumpkin-powder',
    'mango-powder-amchur',
    'banana-powder',
    'lemon-powder',
    'amla-powder',
    'aloe-vera-powder',
    'hibiscus-powder',
]

# Let's locate the dehydrated-powders products array in text:
# We know it starts at `slug: "dehydrated-powders"` and has `products: [`
dp_start = text.find('slug: "dehydrated-powders"')
if dp_start == -1:
    dp_start = text.find("slug: 'dehydrated-powders'")

prods_start = text.find('products: [', dp_start)
prods_start_bracket = prods_start + len('products: [')

# The closing of products array before the category closing `    ],`
# Let's find the closing `],` for this category. Note that categories ends with `];`
prods_end = text.find('\n    ],', prods_start_bracket)
if prods_end == -1:
    prods_end = text.find('    ],', prods_start_bracket)

raw_products_block = text[prods_start_bracket:prods_end]

# Split products in raw_products_block
# Each product is an object `{ ... }`
# Let's extract each product block cleanly
product_blocks = []
current = []
brace_count = 0
in_prod = False

for line in raw_products_block.splitlines(keepends=True):
    for ch in line:
        if ch == '{':
            brace_count += 1
            in_prod = True
        elif ch == '}':
            brace_count -= 1
    if in_prod:
        current.append(line)
        if brace_count == 0:
            product_blocks.append(''.join(current))
            current = []
            in_prod = False

print(f"Extracted {len(product_blocks)} product blocks from dehydrated-powders.")

prod_map = {}
for pb in product_blocks:
    slug_match = re.search(r'slug:\s*["\']([^"\']+)["\']', pb)
    if slug_match:
        slug = slug_match.group(1)
        prod_map[slug] = pb

print(f"Mapped {len(prod_map)} products by slug.")

# Verify all 22 target slugs exist
for s in TARGET_22_SLUGS:
    if s not in prod_map:
        print(f"ERROR: Target slug '{s}' missing from prod_map!")

# Filter and reorder
cleaned_blocks = []
for s in TARGET_22_SLUGS:
    pb = prod_map[s]
    
    # Ensure no mentions of flakes, kibbled, chopped, minced, granules, "Flakes (3-5 mm)" remain
    # Clean up grades if needed: e.g. ensure Mesh grade is clear
    # Check if there are any prohibited words
    for bad in ['flake', 'Flake', 'kibbled', 'Kibbled', 'granule', 'Granule', 'chopped', 'Chopped', 'minced', 'Minced']:
        if bad in pb:
            print(f"Found '{bad}' in {s}, replacing...")
            # If in grade:
            pb = pb.replace('Flakes (3–5mm)', 'Superfine Powder (Mesh 80–100)')
            pb = pb.replace('Flakes (3-5mm)', 'Superfine Powder (Mesh 80–100)')
            pb = pb.replace('Dried Slices & Flakes (3–5mm)', 'Superfine Ground Powder (Mesh 80–100)')
            pb = pb.replace('Dried Slices & Flakes', 'Superfine Ground Powder (Mesh 80–100)')
            pb = pb.replace('flaked and kibbled', 'fine-milled')
            pb = pb.replace('flakes and kibbled', 'fine-milled powder')
            pb = pb.replace('flakes', 'fine powders')
            pb = pb.replace('flake', 'powder')
            pb = pb.replace('granules', 'fine powder')
            pb = pb.replace('granule', 'powder')
            pb = pb.replace('kibbled', 'fine-milled')
            pb = pb.replace('minced', 'sieved')
            pb = pb.replace('chopped', 'pulverized')

    # Trim leading/trailing whitespace but keep proper indentation
    pb_clean = pb.strip()
    cleaned_blocks.append('      ' + pb_clean.replace('\n', '\n      '))

new_products_block = '\n' + ',\n'.join(cleaned_blocks) + '\n'

new_text = text[:prods_start_bracket] + new_products_block + text[prods_end:]

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(new_text)

print(f"Successfully updated src/data/products.ts with exactly {len(cleaned_blocks)} powder products!")
