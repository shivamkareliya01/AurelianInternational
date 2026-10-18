import json

# Update worldMapData.json so that ONLY the 8 allowed countries are marked
with open('src/data/worldMapData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Allowed gold-fill set
gold_countries = {
    "India",
    "United Arab Emirates",
    "United States",
    "Netherlands",
    "Germany",
    "South Africa",
    "Kenya",
    "Australia"
}

modified_count = 0
gold_count = 0
for c in data.get('countries', []):
    name = c.get('name')
    if name == 'India':
        c['isIndia'] = True
        c['isServed'] = False
        gold_count += 1
    elif name in gold_countries:
        c['isIndia'] = False
        c['isServed'] = True
        gold_count += 1
    else:
        c['isIndia'] = False
        c['isServed'] = False

with open('src/data/worldMapData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print(f"Updated worldMapData.json. Exactly {gold_count} countries in gold set: {gold_countries}")
