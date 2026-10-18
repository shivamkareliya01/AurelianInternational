import re

path = 'src/routes/products.$category.index.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove PowderSwatchStrip import
content = content.replace('import { PowderSwatchStrip } from "@/components/site/PowderSwatchStrip";\n', '')

# 2. Remove dehydrationSteps array
content = re.sub(r'const dehydrationSteps = \[[\s\S]*?\n\];\n', '', content)

# 3. Remove const isDehydrated = ...
content = re.sub(r'\s*const isDehydrated = c\.slug === "dehydrated-powders";\n', '\n', content)

# 4. Remove Section 3 & Section 4
old_sections = r'\{\/\* 3\. Powder Swatch Strip for Dehydrated Powders Only \*\/\}[\s\S]*?\{\/\* 5\. Product Cards Catalog Grid \*\/\}\n\s*<section'
new_sections = '{/* 3. Product Cards Catalog Grid */}\n      <section'

content = re.sub(old_sections, new_sections, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully removed Powder Swatch Strip and The Dehydration Process sections!')
