import re

content = open('src/data/products.ts', 'r', encoding='utf-8').read()

terms = ["turmeric", "drumstick", "moringa", "chilli", "amla"]
for t in terms:
    matches = re.findall(r'\{\s*"slug":\s*"([^"]*' + t + r'[^"]*)",\s*"name":\s*"([^"]+)"', content, re.IGNORECASE)
    print(f"Term '{t}': {matches}")
