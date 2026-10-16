# scripts/resolve_all_unique_images.py
import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import json

# Load json block from text
start = text.find('export const categories: Category[] = [') + len('export const categories: Category[] = ')
end = text.rfind('export const allProducts:')
json_str = text[start:end].strip()
if json_str.endswith(';'):
    json_str = json_str[:-1].strip()

cats = json.loads(json_str)

# Curated pool of 77 completely unique, verified food, commodity & stone photos:
curated_unique_images = {
    # Agriculture (13)
    "basmati-rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1600&q=80",
    "non-basmati-rice": "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1600&q=80",
    "wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80",
    "yellow-maize": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1600&q=80",
    "millets": "https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1600&q=80",
    "soybean": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1600&q=80",
    "groundnut": "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=1600&q=80",
    "sesame-seeds": "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
    "chickpeas": "https://images.unsplash.com/photo-1587334274328-64186a80aeee?auto=format&fit=crop&w=1600&q=80",
    "pulses": "https://images.unsplash.com/photo-1546069901-d6a362bbbb7d?auto=format&fit=crop&w=1600&q=80",
    "cotton": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80",
    "sugar": "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=1600&q=80",
    "jaggery": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=80",

    # Fresh Vegetables (14)
    "nashik-red-onion": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1600&q=80",
    "white-onion": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1600&q=80",
    "potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1600&q=80",
    "tomato": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1600&q=80",
    "garlic": "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=1600&q=80",
    "ginger": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1600&q=80",
    "green-chilli": "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=1600&q=80",
    "okra": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=1600&q=80",
    "brinjal": "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1600&q=80",
    "cauliflower": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=1600&q=80",
    "cabbage": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=1600&q=80",
    "carrot": "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=1600&q=80",
    "green-peas": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=1600&q=80",
    "drumstick": "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=1600&q=80",

    # Fresh Fruits (8)
    "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1600&q=80",
    "mango": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1600&q=80",
    "pomegranate": "https://images.unsplash.com/photo-1541344999736-83eca872f241?auto=format&fit=crop&w=1600&q=80",
    "grapes": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1600&q=80",
    "pineapple": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=1600&q=80",
    "papaya": "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=1600&q=80",
    "orange": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1600&q=80",
    "lemon": "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=1600&q=80",

    # Spices (14)
    "turmeric": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80",
    "red-chilli": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1600&q=80",
    "black-pepper": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80",
    "cumin": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1600&q=80",
    "coriander": "https://images.unsplash.com/photo-1596040033282-55079a419eb2?auto=format&fit=crop&w=1600&q=80",
    "cardamom": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1600&q=80",
    "cloves": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1600&q=80",
    "cinnamon": "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1600&q=80",
    "fenugreek": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1600&q=80",
    "fennel": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
    "mustard-seeds": "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1600&q=80",
    "star-anise": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80",
    "bay-leaf": "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=1600&q=80",
    "garam-masala": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",

    # Natural Stones & Tiles (11)
    "marble-tiles": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "granite-slabs": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    "sandstone": "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80",
    "limestone": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
    "slate": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
    "quartzite": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    "ceramic-tiles": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
    "vitrified-tiles": "https://images.unsplash.com/photo-1502005229762-ee1b2da97e06?auto=format&fit=crop&w=1600&q=80",
    "porcelain-tiles": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    "cobblestones": "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1600&q=80",
    "gravel": "https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&w=1600&q=80",

    # Dry Fruits & Nuts (10)
    "cashew-nuts": "https://images.unsplash.com/photo-1536591375315-1b836814d45d?auto=format&fit=crop&w=1600&q=80",
    "almonds": "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=1600&q=80",
    "walnuts": "https://images.unsplash.com/photo-1568283096533-078a24930eb8?auto=format&fit=crop&w=1600&q=80",
    "pistachios": "https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=1600&q=80",
    "raisins": "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?auto=format&fit=crop&w=1600&q=80",
    "dates": "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=1600&q=80",
    "figs": "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=1600&q=80",
    "apricots": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=1600&q=80",
    "peanuts-bold": "https://images.unsplash.com/photo-1528751095030-9b34eb89e602?auto=format&fit=crop&w=1600&q=80",
    "makhana": "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=1600&q=80",

    # Processed Food & Others (7)
    "tea": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80",
    "coffee": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=80",
    "coconut": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=80",
    "edible-oils": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1600&q=80",
    "pickles-sauces": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80",
    "coir-products": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80",
    "polymers-pvc": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80",
}

# Apply unique images to all products
assigned_images = set()
for c in cats:
    for p in c["products"]:
        slug = p["slug"]
        if slug in curated_unique_images:
            p["image"] = curated_unique_images[slug]
            p["gallery"][0] = curated_unique_images[slug]
        assigned_images.add(p["image"])

total_prods = sum(len(c["products"]) for c in cats)
print(f"Total products: {total_prods}")
print(f"Total unique images: {len(assigned_images)}")

if total_prods != len(assigned_images):
    print("WARNING: Some products still share images!")
    from collections import Counter
    counts = Counter(p["image"] for c in cats for p in c["products"])
    for url, count in counts.items():
        if count > 1:
            shared = [p["name"] for c in cats for p in c["products"] if p["image"] == url]
            print(f"Shared {count} times ({url}): {shared}")
else:
    print("SUCCESS: ALL 77 PRODUCTS HAVE 100% UNIQUE IMAGES!")

    # Write updated catalog to src/data/products.ts
    out = f"""// Auto-generated full product catalog for Aurelian International
// 7 Categories, 77 Unique Export Products with Dedicated High-Resolution Images

export type Product = {{
  slug: string;
  name: string;
  origin: string;
  grade: string;
  packaging: string;
  moq: string;
  shelfLife: string;
  certifications: string[];
  description: string;
  image: string;
  gallery: string[];
}};

export type Category = {{
  slug: string;
  name: string;
  headline: string;
  blurb: string;
  image: string;
  products: Product[];
}};

export const categories: Category[] = {json.dumps(cats, indent=2)};

export const allProducts: {{ product: Product; category: Category }}[] = categories.flatMap((c) =>
  c.products.map((p) => ({{ product: p, category: c }}))
);

export function getCategory(slug: string): Category | undefined {{
  return categories.find((c) => c.slug === slug);
}}

export function getProduct(catSlug: string, prodSlug: string): Product | undefined {{
  const c = getCategory(catSlug);
  return c?.products.find((p) => p.slug === prodSlug);
}}
"""
    with open('src/data/products.ts', 'w', encoding='utf-8') as f:
        f.write(out)
    print("Successfully written updated src/data/products.ts")
