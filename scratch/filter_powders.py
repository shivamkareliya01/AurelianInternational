import json, re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update name and headline
content = content.replace('"name": "Dehydrated Powders & Flakes",', '"name": "Dehydrated Powders",')
content = content.replace('"headline": "Dehydrated Powders & Flakes",', '"headline": "Dehydrated Powders",')

# Identify products to remove
slugs_to_remove = {
    'dehydrated-white-onion-flakes',
    'dehydrated-red-onion-flakes',
    'dehydrated-garlic-flakes',
    'garlic-granules',
    'dehydrated-ginger-flakes',
    'potato-flakes',
}

# Find dehydrated-powders category block
dp_marker = '"slug": "dehydrated-powders"'
dp_idx = content.find(dp_marker)
if dp_idx == -1:
    print("Could not find dehydrated-powders category!")
    exit(1)

# We can parse the JSON or cleanly filter products
# Let's inspect the products inside dehydrated-powders
prefix = content[:dp_idx]
rest = content[dp_idx:]

# Find where products starts
prod_start = rest.find('"products": [')
prod_list_start = dp_idx + prod_start + len('"products": [')

# Find the end of products array
# The end of products array is before the end of the category block
# Let's find `]  }` at the end of the file
end_prod_idx = content.rfind('    ]\n  }\n];')
if end_prod_idx == -1:
    end_prod_idx = content.rfind('    ]\r\n  }\r\n];')

print("prod_list_start:", prod_list_start, "end_prod_idx:", end_prod_idx)

# Let's verify by parsing the products JSON slice
products_str = '[' + content[prod_list_start:end_prod_idx].strip() + ']'
try:
    products = json.loads(products_str)
    print("Parsed products successfully! Total before:", len(products))
    filtered_products = [p for p in products if p['slug'] not in slugs_to_remove]
    print("Filtered products count:", len(filtered_products))
    for p in filtered_products:
        print("  Keep:", p['slug'], "-->", p['name'])

    # Format new products JSON indented with 6 spaces
    new_products_str = json.dumps(filtered_products, indent=6, ensure_ascii=False)
    # Strip opening [ and closing ]
    inner_prods = new_products_str[new_products_str.find('['):]
    
    # Reconstruct category products
    cat_header = content[:dp_idx + prod_start + len('"products": ')]
    cat_footer = content[end_prod_idx + len('    ]'):]
    
    # Let's indent properly (6 spaces for each product item)
    # Actually json.dumps(filtered_products, indent=6) already indents!
    # Let's format nicely:
    formatted_inner = json.dumps(filtered_products, indent=6, ensure_ascii=False)
    # The formatted_inner starts with [ and ends with ]
    new_content = content[:dp_idx + prod_start + len('"products": ')] + formatted_inner + '\n  }\n];' + content[content.find('export const allProducts'):]
    
    with open('src/data/products.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated src/data/products.ts!")
except Exception as e:
    print("Error parsing products JSON:", e)
