import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    content = f.read()


# Dictionary of specific alt texts
ALT_TEXTS = {
    "white-onion-powder": "Cream-white white onion powder heaped in a wooden bowl beside fresh whole white onions on a clean marble surface",
    "pink-red-onion-powder": "Soft pink-lilac red onion powder in a wooden bowl beside fresh whole and sliced red onions",
    "garlic-powder": "Fine off-white garlic powder in a wooden bowl beside fresh whole garlic bulbs and peeled cloves",
    "ginger-powder-saunth": "Pale yellow-beige dry ginger saunth powder in a wooden bowl beside fresh knobby ginger rhizomes",
    "moringa-leaf-powder": "Vibrant emerald green moringa leaf powder in a wooden bowl beside fresh green moringa leaf sprigs",
    "moringa-seed-powder": "Pale beige-tan moringa seed powder in a wooden bowl beside whole dried moringa pods and seeds",
    "spinach-powder": "Dark forest green spinach powder in a wooden bowl beside crisp fresh whole green spinach leaves",
    "curry-leaf-powder": "Dark olive green curry leaf powder in a wooden bowl beside aromatic glossy fresh curry leaf sprigs",
    "mint-leaf-powder": "Bright green mint leaf powder in a wooden bowl beside freshly picked fragrant mint leaves",
    "coriander-leaf-powder": "Fresh medium-green coriander leaf powder in a wooden bowl beside crisp cilantro sprigs with tender stems",
    "kasuri-methi-powder": "Sage green fenugreek leaf kasuri methi powder in a wooden bowl beside whole dried and fresh fenugreek leaves",
    "tomato-powder": "Rich brick red-orange tomato powder in a wooden bowl beside ripe, glossy whole and sliced red tomatoes",
    "beetroot-powder": "Vivid magenta-purple beetroot powder in a wooden bowl beside whole and halved ruby-red beetroots",
    "carrot-powder": "Bright golden-orange carrot powder in a wooden bowl beside fresh whole crisp orange carrots with leafy green tops",
    "green-chilli-powder": "Sharp olive green chilli powder in a wooden bowl beside vibrant spicy fresh whole green chillies",
    "pumpkin-powder": "Golden orange pumpkin powder in a wooden bowl beside freshly cut ripe golden pumpkin wedges",
    "mango-powder-amchur": "Pale golden-beige mango amchur powder in a wooden bowl beside sun-dried slices and fresh raw green mango",
    "banana-powder": "Creamy off-white banana powder in a wooden bowl beside fresh ripe and unpeeled bananas",
    "lemon-powder": "Pale zesty lemon yellow powder in a wooden bowl beside fresh whole and juicy halved yellow lemons",
    "amla-powder": "Nutritious greenish-brown amla powder in a wooden bowl beside whole fresh green Indian gooseberries",
    "aloe-vera-powder": "Pale soothing beige-green aloe vera powder in a wooden bowl beside a thick freshly sliced aloe vera leaf revealing clear gel",
    "hibiscus-powder": "Deep crimson ruby-red hibiscus powder in a wooden bowl beside whole dried and fresh ruby-red hibiscus petals"
}

# Update gallery and alt in products.ts
for slug, alt in ALT_TEXTS.items():
    # Replace gallery of 3 with gallery of 4
    old_gal_pattern = rf'slug:\s*"{slug}",[\s\S]*?gallery:\s*\[[\s\S]*?\]'
    # Find the specific product block
    pattern = rf'(slug:\s*"{slug}",[\s\S]*?gallery:\s*\[)([\s\S]*?)(\],[\s\S]*?alt:\s*)"([^"]*)"'
    
    def repl(m):
        prefix = m.group(1)
        suffix = m.group(3)
        new_gal = f'\n          "/products/{slug}.webp",\n          "/products/{slug}-ingredient.webp",\n          "/products/{slug}-2.webp",\n          "/products/{slug}-3.webp",\n        '
        return f'{prefix}{new_gal}{suffix}"{alt}"'
    
    content, count = re.subn(pattern, repl, content)
    if count == 0:
        print(f"Warning: pattern not matched for {slug}")
    else:
        print(f"Updated {slug}")

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Finished updating products.ts gallery and alt texts.")
