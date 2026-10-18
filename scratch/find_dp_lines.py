with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'dehydrated-powders' in l:
        print(f"dehydrated-powders found at line {i+1}: {l.strip()}")
    if i > 2000:
        print(f"Line {i+1}: {l.strip()}")
