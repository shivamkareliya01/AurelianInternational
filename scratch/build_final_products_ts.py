import json

# Read scratch/build_products_ts.py to get dehydrated_prods and classic_spices
with open('scratch/build_products_ts.py', 'r', encoding='utf-8') as f:
    bps = f.read()

# We can execute or import, or extract definitions
# Let's inspect HEAD or orig products.ts
with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    orig = f.read()

start = orig.find('export const categories: Category[] = ') + len('export const categories: Category[] = ')
end = orig.rfind('];') + 1

existing_cats = json.loads(orig[start:end])

# 1. Agriculture (16)
agri = next(c for c in existing_cats if c['slug'] == 'agriculture')

# 2. Fresh Vegetables (14)
veg = next(c for c in existing_cats if c['slug'] == 'fresh-vegetables')

# 3. Fresh Fruits (Filter to 4)
fruits_raw = next(c for c in existing_cats if c['slug'] == 'fresh-fruits')
fruits_to_remove = {'thompson-seedless-grapes', 'nagpur-orange', 'lemon', 'papaya', 'pineapple'}
fruits_prods = [p for p in fruits_raw['products'] if p['slug'] not in fruits_to_remove]

# 4. Spices (14)
# Spices currently in existing_cats
spices_raw = next((c for c in existing_cats if c['slug'] == 'spices'), None)

# 5. Natural Stones (12)
# Check if natural-stones or natural-stones-tiles in existing_cats
stones_raw = next((c for c in existing_cats if c['slug'] in ('natural-stones', 'natural-stones-tiles')), None)
tile_slugs = {'vitrified-tiles', 'porcelain-tiles', 'ceramic-wall-tiles', 'glazed-vitrified-tiles',
              'large-format-porcelain-slabs', 'polished-porcelain-tiles', 'digital-wall-tiles',
              'subway-ceramic-tiles', 'outdoor-parking-tiles', 'anti-skid-ceramic-tiles'}
natural_stones_prods = [p for p in stones_raw['products'] if p['slug'] not in tile_slugs]

# Let's check classic spices from scratch/build_products_ts.py
# If spices_raw has 6, add classic spices
if len(spices_raw['products']) == 6:
    # Run the same script snippet from build_products_ts
    scope = {'existing_cats': existing_cats, 'json': json}
    exec(bps, scope)
    spices_prods = scope['spices_prods']
    dehydrated_prods_all = scope['dehydrated_prods']
else:
    spices_prods = spices_raw['products']
    scope = {'existing_cats': existing_cats, 'json': json}
    exec(bps, scope)
    dehydrated_prods_all = scope['dehydrated_prods']

# 6. Dehydrated Powders (22 pure powders, no flakes, no granules)
flakes_and_granules = {
    'dehydrated-white-onion-flakes',
    'dehydrated-red-onion-flakes',
    'dehydrated-garlic-flakes',
    'garlic-granules',
    'dehydrated-ginger-flakes',
    'potato-flakes',
}
dehydrated_prods = [p for p in dehydrated_prods_all if p['slug'] not in flakes_and_granules]

total_catalog = [
    {
        "slug": "agriculture",
        "name": "Agriculture",
        "headline": "Grains, Pulses & Oilseeds",
        "blurb": "Grains, pulses and oilseeds from India's most fertile belts, machine-cleaned, optical-sorted and packaged to stringent international trade standards.",
        "image": "/products/1121-basmati-rice.webp",
        "products": agri['products']
    },
    {
        "slug": "fresh-vegetables",
        "name": "Fresh Vegetables",
        "headline": "Farm-Fresh Export Vegetables",
        "blurb": "GI-tagged and farm-fresh Indian vegetables harvested at dawn, pre-cooled at packhouses, and air-freighted or dispatched in controlled-atmosphere reefers.",
        "image": "/products/category-fresh-vegetables.webp",
        "products": veg['products']
    },
    {
        "slug": "fresh-fruits",
        "name": "Fresh Fruits",
        "headline": "Orchard Fresh Indian Fruits",
        "blurb": "GI-tagged and orchard-fresh Indian fruits, pre-cooled at packhouses, hot-water treated, and dispatched via maritime reefers and direct air cargo.",
        "image": "/products/category-fresh-fruits.webp",
        "products": fruits_prods
    },
    {
        "slug": "spices",
        "name": "Spices",
        "headline": "Whole & Ground Spices",
        "blurb": "Whole and ground Indian spices from Kerala, Rajasthan, and Andhra Pradesh, laboratory-certified by the Spices Board of India for purity and essential oils.",
        "image": "/products/black-pepper.webp",
        "products": spices_prods
    },
    {
        "slug": "natural-stones",
        "name": "Natural Stones",
        "headline": "Quarried Slabs, Marble & Granite",
        "blurb": "Makrana marble, South Indian granite, quartzite, and hand-cut sandstone slabs from Rajasthan and the Deccan, precision-cut and packed in ISPM-15 wooden crates.",
        "image": "/products/makrana-white-marble.webp",
        "products": natural_stones_prods
    },
    {
        "slug": "dehydrated-powders",
        "name": "Dehydrated Powders",
        "headline": "Dehydrated Powders",
        "blurb": "Air-dried and spray-dried vegetable, herb and botanical powders for food, nutrition and wellness brands.",
        "image": "/products/category-dehydrated-powders.webp",
        "products": dehydrated_prods
    }
]

total_count = sum(len(c['products']) for c in total_catalog)
print("TOTAL CATEGORIES:", len(total_catalog))
print("TOTAL PRODUCTS:", total_count)
for c in total_catalog:
    print(f"  {c['slug']}: {len(c['products'])} items")

# Generate TypeScript file
ts_code = f"""// 6 Categories, {total_count} Approved Export Products with Dedicated High-Resolution Local Assets

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
  alt: string;
}};

export type Category = {{
  slug: string;
  name: string;
  headline: string;
  blurb: string;
  image: string;
  products: Product[];
}};

export const categories: Category[] = {json.dumps(total_catalog, indent=2, ensure_ascii=False)};

export const allProducts: (Product & {{ category: Category }})[] = categories.flatMap((c) =>
  c.products.map((p) => ({{ ...p, category: c }}))
);

export function getCategory(slug: string): Category | undefined {{
  if (slug === "natural-stones-tiles") {{
    return categories.find((c) => c.slug === "natural-stones") ?? categories[4];
  }}
  return categories.find((c) => c.slug === slug);
}}

export function getProduct(catSlug: string, prodSlug: string): Product | undefined {{
  const c = getCategory(catSlug);
  return c?.products.find((p) => p.slug === prodSlug);
}}
"""

with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("Successfully written to src/data/products.ts!")
