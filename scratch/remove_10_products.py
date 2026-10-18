with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Update header comment
text = text.replace('// 7 Categories, 97 Approved Export Products', '// 7 Categories, 87 Approved Export Products', 1)

# Find beetroot-powder block up to hibiscus-powder block
start_str = '      {\n        slug: "beetroot-powder",'
end_str = '      {\n        slug: "hibiscus-powder",'

idx_start = text.find(start_str)
idx_end_block = text.find(end_str)
idx_closing = text.find('    ],', idx_end_block)

print(f"idx_start: {idx_start}, idx_end_block: {idx_end_block}, idx_closing: {idx_closing}")
if idx_start != -1 and idx_closing != -1:
    new_text = text[:idx_start] + text[idx_closing:]
    with open('src/data/products.ts', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Successfully removed 10 products from src/data/products.ts!")
else:
    print("Failed to locate slice!")
