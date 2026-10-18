import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's locate the boundary of `ceramic-tiles`
start_marker = '  {\n    "slug": "ceramic-tiles",'
end_marker = '  {\n    "slug": "dehydrated-powders",'

start_pos = content.find(start_marker)
end_pos = content.find(end_marker)

print("start_pos:", start_pos, "end_pos:", end_pos)
if start_pos != -1 and end_pos != -1:
    new_content = content[:start_pos] + content[end_pos:]
    with open('src/data/products.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully removed ceramic-tiles!")
else:
    print("Markers not found!")
