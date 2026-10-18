import re

content = open('src/data/products.ts', 'r', encoding='utf-8').read()

# Extract categories
categories_match = re.search(r'export const categories: Category\[\] = (\[.*?\]);\s*\n\s*export const allProducts', content, re.DOTALL)
# Or let's inspect the 22 requested powders against all products
to_remove_names = [
    "Lemongrass Powder",
    "Butterfly Pea Flower Powder",
    "Rose Petal Powder",
    "Purple Sweet Potato Powder",
    "Tamarind Powder",
    "Kokum Powder",
    "Coconut Milk Powder",
    "Pomegranate (Anardana) Powder",
    "Guava Powder",
    "Jamun (Black Plum) Powder",
    "Okra (Lady Finger) Powder",
    "Bitter Gourd (Karela) Powder",
    "Papaya Powder",
    "Shatavari Root Powder",
    "Wheatgrass Powder",
    "Lemon Powder",
    "Amla Powder",
    "Aloe Vera Powder",
    "Turmeric Powder",
    "Drumstick (Moringa) Pod Powder",
    "Carrot Powder",
    "Red Chilli Powder"
]

to_remove_fruits = [
    "Thompson Seedless Grapes",
    "Nagpur Orange",
    "Lemon",
    "Papaya",
    "Pineapple",
    "Kesar Mango"
]

print("--- Searching for products in products.ts ---")
all_prods = re.findall(r'\{\s*"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"', content)

print(f"Total products in products.ts: {len(all_prods)}")

print("\n--- Matching requested powders ---")
for target in to_remove_names:
    matches = [p for p in all_prods if target.lower() in p[1].lower() or p[1].lower() in target.lower()]
    print(f"Target '{target}': {matches}")

print("\n--- Matching requested fruits ---")
for target in to_remove_fruits:
    matches = [p for p in all_prods if p[1].lower() == target.lower()]
    print(f"Target fruit '{target}': {matches}")
