import re

with open('scratch/build_products_ts.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace line 870 & 871
code = code.replace(
    '"name": "Dehydrated Powders & Flakes",\n        "headline": "Dehydrated Powders & Flakes",',
    '"name": "Dehydrated Powders",\n        "headline": "Air-Dried & Spray-Dried Powders",'
)

# In fresh-vegetables: check white onion description
code = code.replace(
    'optimal suitability for dehydration flakes.',
    'optimal suitability for dehydration processing and fine powders.'
)

# Now let's adjust dehydrated_prods filtering in build_products_ts.py
# The 6 deleted slugs:
# 'dehydrated-white-onion-flakes', 'dehydrated-red-onion-flakes', 'dehydrated-garlic-flakes',
# 'garlic-granules', 'dehydrated-ginger-flakes', 'potato-flakes'

# In build_products_ts.py, we have `dehydrated_prods = [...]`
# Let's add code right after `dehydrated_prods = [...]` to filter and sort:
target_code = """# Filter out flakes and granules, keeping only the 22 pure powders in exact brief order:
TARGET_22_ORDER = [
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

dehydrated_map = {p['slug']: p for p in dehydrated_prods}
dehydrated_prods = []
for slug in TARGET_22_ORDER:
    p = dehydrated_map[slug]
    # Sanitize any flake or granule wording
    for key in ['name', 'grade', 'description', 'alt']:
        if key in p:
            val = p[key]
            val = val.replace('Flakes (3–5mm)', 'Superfine Powder (Mesh 80–100)')
            val = val.replace('Dried Slices & Flakes (3–5mm)', 'Superfine Powder (Mesh 80–100)')
            val = val.replace('Dried Slices & Flakes', 'Superfine Powder (Mesh 80–100)')
            val = val.replace('flakes', 'fine powders')
            val = val.replace('flake', 'powder')
            val = val.replace('granules', 'fine powder')
            val = val.replace('granule', 'powder')
            val = val.replace('kibbled', 'fine-milled')
            val = val.replace('minced', 'sieved')
            val = val.replace('chopped', 'pulverized')
            p[key] = val
    dehydrated_prods.append(p)
"""

# Let's insert this before `# 8. Natural Stones` or right before `total_catalog = [`
insert_marker = "total_catalog = ["
idx = code.find(insert_marker)
if idx != -1:
    code = code[:idx] + target_code + "\n" + code[idx:]
    print("Successfully inserted filter & reordering logic!")
else:
    print("ERROR: insert_marker not found!")

with open('scratch/build_products_ts.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated scratch/build_products_ts.py.")
