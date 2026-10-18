import json
import re

with open('scratch/build_products_ts.py', 'r', encoding='utf-8') as f:
    bps = f.read()

# Execute build_products_ts to get base categories and 22 original powders
scope = {}
exec(bps, scope)

agri = scope['agri']
veg = scope['veg']
fruits = scope['fruits']
spices_prods = scope['spices_prods']
natural_stones_prods = scope['natural_stones_prods']
ceramic_tiles_prods = scope['ceramic_tiles_prods']
dehydrated_map = scope['dehydrated_map']

# Sanitize 22 original powders
for slug, p in dehydrated_map.items():
    for key in ['name', 'grade', 'description', 'alt']:
        if key in p:
            val = p[key]
            val = val.replace('Flakes (3–5mm)', 'Superfine Powder (Mesh 80–100)')
            val = val.replace('Dried Slices & Flakes (3–5mm)', 'Superfine Powder (Mesh 80–100)')
            val = val.replace('Dried Slices & Flakes', 'Superfine Powder (Mesh 80–100)')
            val = val.replace('flakes', 'fine powders')
            val = val.replace('flake', 'powder')
            val = val.replace('granules', 'fine powder')
            val = val.replace('granule', 'powder')
            val = val.replace('kibbled', 'fine-milled')
            val = val.replace('minced', 'sieved')
            val = val.replace('chopped', 'pulverized')
            p[key] = val

# Define the 18 new powders
new_powders = [
    {
        "slug": "tulsi-holy-basil-leaf-powder",
        "name": "Tulsi (Holy Basil) Leaf Powder",
        "origin": "Uttar Pradesh & Madhya Pradesh",
        "grade": "Shadow-Dried Botanical Superfine Powder (Mesh 80–100)",
        "packaging": "25 kg multiwall paper sacks with food-grade inner liner; private-label packs on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Fragrant olive-green Ayurvedic powder derived from shade-dried Ocimum sanctum leaves with a warm, peppery herbal aroma and brisk taste. Widely utilized in adaptogenic herbal tea blends, nutritional supplements, and holistic wellness formulations. Typical specification (moisture ≤ 7.0%, volatile oil ≥ 0.4%), confirmed by batch lab report.",
        "image": "/products/tulsi-holy-basil-leaf-powder.webp",
        "gallery": [
            "/products/tulsi-holy-basil-leaf-powder.webp",
            "/products/tulsi-holy-basil-leaf-powder-ingredient.webp",
            "/products/tulsi-holy-basil-leaf-powder-2.webp",
            "/products/tulsi-holy-basil-leaf-powder-3.webp"
        ],
        "alt": "Pure Indian Tulsi holy basil leaf powder with fresh holy basil leaves and flowering tops"
    },
    {
        "slug": "neem-leaf-powder",
        "name": "Neem Leaf Powder",
        "origin": "Rajasthan & Gujarat",
        "grade": "Air-Dried Botanical Superfine Powder (Mesh 80–100)",
        "packaging": "25 kg poly-lined multiwall kraft bags; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "GMP"],
        "description": "Vibrant forest-green botanical powder ground from mature Azadirachta indica leaves with a characteristic bitter herbal profile. Essential for natural cosmetics, purifying skincare scrubs, and therapeutic botanical extracts. Typical specification (moisture ≤ 6.5%, pure leaf matter), subject to lab report.",
        "image": "/products/neem-leaf-powder.webp",
        "gallery": [
            "/products/neem-leaf-powder.webp",
            "/products/neem-leaf-powder-ingredient.webp",
            "/products/neem-leaf-powder-2.webp",
            "/products/neem-leaf-powder-3.webp"
        ],
        "alt": "Finely milled neem leaf powder alongside fresh green neem leaves and twigs"
    },
    {
        "slug": "ashwagandha-root-powder",
        "name": "Ashwagandha Root Powder",
        "origin": "Madhya Pradesh & Rajasthan",
        "grade": "Dehydrated Prime Root Powder (Mesh 80–100)",
        "packaging": "25 kg HDPE fiber drums with food-grade liner; custom retail packs on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "GMP"],
        "description": "Pale tan-beige botanical root powder milled from dried Withania somnifera taproots offering a sweet-earthy aroma and subtle bitter undertone. Renowned worldwide for adaptogenic beverage formulations, functional dietary capsules, and sports nutrition mixes. Typical specification (withanolides ≥ 1.5–2.5%, moisture ≤ 7.0%), subject to batch lab report.",
        "image": "/products/ashwagandha-root-powder.webp",
        "gallery": [
            "/products/ashwagandha-root-powder.webp",
            "/products/ashwagandha-root-powder-ingredient.webp",
            "/products/ashwagandha-root-powder-2.webp",
            "/products/ashwagandha-root-powder-3.webp"
        ],
        "alt": "Fine beige ashwagandha root powder with whole dried ashwagandha roots"
    },
    {
        "slug": "shatavari-root-powder",
        "name": "Shatavari Root Powder",
        "origin": "Uttar Pradesh & Uttarakhand",
        "grade": "Air-Dried Tuberous Root Powder (Mesh 80–100)",
        "packaging": "25 kg kraft paper bags with inner polyethylene liner; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "GMP"],
        "description": "Silky cream-ivory powder prepared from clean peeled tuberous roots of Asparagus racemosus with a mild sweet-bitter flavor profile. Celebrated in traditional herbal tonics, women's wellness dietary blends, and functional protein mixes. Typical specification (saponins ≥ 15%, moisture ≤ 7.5%), confirmed by batch lab report.",
        "image": "/products/shatavari-root-powder.webp",
        "gallery": [
            "/products/shatavari-root-powder.webp",
            "/products/shatavari-root-powder-ingredient.webp",
            "/products/shatavari-root-powder-2.webp",
            "/products/shatavari-root-powder-3.webp"
        ],
        "alt": "Creamy white shatavari root powder displayed with fresh peeled shatavari roots"
    },
    {
        "slug": "wheatgrass-powder",
        "name": "Wheatgrass Powder",
        "origin": "Punjab & Haryana",
        "grade": "Low-Temperature Dehydrated Grass Powder (Mesh 80–100)",
        "packaging": "20–25 kg nitrogen-flushed foil-lined bags; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "BRCGS"],
        "description": "Luminous chlorophyll-rich emerald green powder milled from tender young Triticum aestivum shoots harvested at jointing stage with an intensely fresh earthy taste. An international staple for green superfood blends, cold-pressed juice powders, and cleansing smoothies. Typical specification (chlorophyll ≥ 500 mg/100g, moisture ≤ 6.0%), subject to lab report.",
        "image": "/products/wheatgrass-powder.webp",
        "gallery": [
            "/products/wheatgrass-powder.webp",
            "/products/wheatgrass-powder-ingredient.webp",
            "/products/wheatgrass-powder-2.webp",
            "/products/wheatgrass-powder-3.webp"
        ],
        "alt": "Vibrant emerald green wheatgrass powder with freshly cut tender wheatgrass blades"
    },
    {
        "slug": "okra-lady-finger-powder",
        "name": "Okra (Lady Finger) Powder",
        "origin": "Gujarat & Maharashtra",
        "grade": "Air-Dried Vegetable Powder (Mesh 60–80)",
        "packaging": "25 kg food-grade poly bags in corrugated export cartons; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Delicate moss-green vegetable powder made from tender sun-dried Abelmoschus esculentus pods with a grassy vegetative flavor and natural soluble fiber viscosity. Prized as a clean-label natural thickener for soups, bakery dough conditioning, and dietary fiber supplements. Typical specification (moisture ≤ 6.5%, mucilage intact), subject to lab report.",
        "image": "/products/okra-lady-finger-powder.webp",
        "gallery": [
            "/products/okra-lady-finger-powder.webp",
            "/products/okra-lady-finger-powder-ingredient.webp",
            "/products/okra-lady-finger-powder-2.webp",
            "/products/okra-lady-finger-powder-3.webp"
        ],
        "alt": "Fine light green okra powder accompanied by fresh tender whole and star-sliced okra pods"
    },
    {
        "slug": "bitter-gourd-karela-powder",
        "name": "Bitter Gourd (Karela) Powder",
        "origin": "Gujarat & Maharashtra",
        "grade": "Dehydrated Superfine Powder (Mesh 80–100)",
        "packaging": "25 kg double-lined kraft bags; private label packing available",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "GMP"],
        "description": "Earthy olive-green powder processed from deseeded Momordica charantia fruits delivering an intensely bitter, crisp botanical flavor profile. In high global demand for metabolic wellness teas, glycemic support formulations, and functional dietary concentrates. Typical specification (charantin active content, moisture ≤ 6.5%), subject to batch lab report.",
        "image": "/products/bitter-gourd-karela-powder.webp",
        "gallery": [
            "/products/bitter-gourd-karela-powder.webp",
            "/products/bitter-gourd-karela-powder-ingredient.webp",
            "/products/bitter-gourd-karela-powder-2.webp",
            "/products/bitter-gourd-karela-powder-3.webp"
        ],
        "alt": "Milled olive green bitter gourd karela powder with bumpy fresh green bitter melons"
    },
    {
        "slug": "papaya-powder",
        "name": "Papaya Powder",
        "origin": "Gujarat & Andhra Pradesh",
        "grade": "Spray-Dried / Hot Air-Dried Fruit Powder (Mesh 60–80)",
        "packaging": "20–25 kg nitrogen-sealed bags in master cartons; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Warm golden-amber fruit powder milled from vine-ripened Carica papaya with a naturally sweet tropical scent and active papain enzymes. Extensively used in fruit smoothies, digestive nutrition formulas, natural meat tenderizers, and enzymatic cosmetic face masks. Typical specification (moisture ≤ 6.0%, papain activity verified), subject to lab report.",
        "image": "/products/papaya-powder.webp",
        "gallery": [
            "/products/papaya-powder.webp",
            "/products/papaya-powder-ingredient.webp",
            "/products/papaya-powder-2.webp",
            "/products/papaya-powder-3.webp"
        ],
        "alt": "Golden yellow-orange papaya powder with ripe juicy papaya fruit halves and black seeds"
    },
    {
        "slug": "pomegranate-anardana-powder",
        "name": "Pomegranate (Anardana) Powder",
        "origin": "Maharashtra",
        "grade": "Dehydrated Aril Powder (Mesh 60–80)",
        "packaging": "25 kg poly-lined export kraft drums; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "BRCGS"],
        "description": "Deep ruby-maroon fruit powder ground from sun-dehydrated Punica granatum arils delivering a robust sweet-sour tangy punch. Highly valued as an authentic culinary souring agent in curry rubs, snack seasonings, and functional antioxidant juice powders. Typical specification (punicalagins & polyphenols high, moisture ≤ 7.0%), subject to lab report.",
        "image": "/products/pomegranate-anardana-powder.webp",
        "gallery": [
            "/products/pomegranate-anardana-powder.webp",
            "/products/pomegranate-anardana-powder-ingredient.webp",
            "/products/pomegranate-anardana-powder-2.webp",
            "/products/pomegranate-anardana-powder-3.webp"
        ],
        "alt": "Ruby maroon pomegranate anardana powder with split open pomegranate fruit and juicy red arils"
    },
    {
        "slug": "guava-powder",
        "name": "Guava Powder",
        "origin": "Uttar Pradesh",
        "grade": "Spray-Dried Superfine Fruit Powder (Mesh 80–100)",
        "packaging": "20–25 kg foil-laminated cartons with moisture barrier; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Soft creamy pale blush-beige powder spray-dried from fresh Allahabad Safeda guavas carrying an intoxicating sweet floral aroma and mellow fruity taste. Ideal for confectionery centers, tropical beverage instant blends, yogurt flavoring, and functional vitamin C enrichment. Typical specification (ascorbic acid content preserved, moisture ≤ 5.5%), subject to lab report.",
        "image": "/products/guava-powder.webp",
        "gallery": [
            "/products/guava-powder.webp",
            "/products/guava-powder-ingredient.webp",
            "/products/guava-powder-2.webp",
            "/products/guava-powder-3.webp"
        ],
        "alt": "Delicate cream-pink guava powder with fresh green Allahabad Safeda guavas and cut halves"
    },
    {
        "slug": "jamun-black-plum-powder",
        "name": "Jamun (Black Plum) Powder",
        "origin": "Maharashtra & Karnataka",
        "grade": "Dehydrated Fruit & Seed Powder (Mesh 80–100)",
        "packaging": "25 kg fiber drums with hermetic poly-liner; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "GMP"],
        "description": "Rich deep purple-indigo powder ground from whole wild Syzygium cumini berries imparting a delightfully tart, astringent taste and anthocyanin hue. Renowned in nutraceutical formulations for glycemic wellness, gut health tonics, and natural berry-toned colorants. Typical specification (anthocyanin pigments intact, moisture ≤ 6.5%), subject to lab report.",
        "image": "/products/jamun-black-plum-powder.webp",
        "gallery": [
            "/products/jamun-black-plum-powder.webp",
            "/products/jamun-black-plum-powder-ingredient.webp",
            "/products/jamun-black-plum-powder-2.webp",
            "/products/jamun-black-plum-powder-3.webp"
        ],
        "alt": "Deep royal purple jamun fruit powder beside glossy fresh dark black plums"
    },
    {
        "slug": "tamarind-powder",
        "name": "Tamarind Powder",
        "origin": "Karnataka & Andhra Pradesh",
        "grade": "Spray-Dried Superfine Culinary Powder (Mesh 80–100)",
        "packaging": "25 kg vacuum-sealed foil bags inside master export cartons; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Warm caramel-brown free-flowing fruit powder crafted from concentrated pulp of mature Tamarindus indica pods with an intense tangy-sour flavor. Widely utilized in global noodle sauces, barbecue marinades, savory snack dusting, and instant soup bases. Typical specification (tartaric acid 10–14%, moisture ≤ 5.0%), subject to batch lab report.",
        "image": "/products/tamarind-powder.webp",
        "gallery": [
            "/products/tamarind-powder.webp",
            "/products/tamarind-powder-ingredient.webp",
            "/products/tamarind-powder-2.webp",
            "/products/tamarind-powder-3.webp"
        ],
        "alt": "Free flowing caramel brown tamarind powder with fresh curved tamarind pods in brittle shells"
    },
    {
        "slug": "kokum-powder",
        "name": "Kokum Powder",
        "origin": "Konkan, Maharashtra & Goa",
        "grade": "Air-Dried Coastal Botanical Powder (Mesh 60–80)",
        "packaging": "25 kg double-bagged poly-lined export containers; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Intense dark maroon-purple powder derived from sun-cured rinds of Garcinia indica offering a sharp, refreshing fruity acidity without vinegar harshness. A celebrated ingredient in coastal seafood marinades, digestive coolers, and natural hydroxycitric acid (HCA) wellness supplements. Typical specification (HCA content ≥ 10%, moisture ≤ 7.0%), subject to lab report.",
        "image": "/products/kokum-powder.webp",
        "gallery": [
            "/products/kokum-powder.webp",
            "/products/kokum-powder-ingredient.webp",
            "/products/kokum-powder-2.webp",
            "/products/kokum-powder-3.webp"
        ],
        "alt": "Dark purple kokum powder with whole dried kokum rinds and fresh purple fruit"
    },
    {
        "slug": "coconut-milk-powder",
        "name": "Coconut Milk Powder",
        "origin": "Kerala & Tamil Nadu",
        "grade": "Spray-Dried Pure Emulsified Powder (Mesh 80–100)",
        "packaging": "20–25 kg nitrogen-flushed multiwall bags; private label retail pouches available",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "BRCGS"],
        "description": "Snow-white, creamy botanical powder spray-dried from fresh first-press coconut cream delivering a rich tropical dairy-free mouthfeel and authentic coconut taste. Essential for dairy-free creamers, Asian curry bases, instant bakery dessert mixes, and clean-label confectionery. Typical specification (fat content 60–65%, moisture ≤ 2.5%), subject to batch lab report.",
        "image": "/products/coconut-milk-powder.webp",
        "gallery": [
            "/products/coconut-milk-powder.webp",
            "/products/coconut-milk-powder-ingredient.webp",
            "/products/coconut-milk-powder-2.webp",
            "/products/coconut-milk-powder-3.webp"
        ],
        "alt": "Snow white coconut milk powder beside cracked fresh coconuts with rich white meat"
    },
    {
        "slug": "butterfly-pea-flower-powder",
        "name": "Butterfly Pea Flower Powder",
        "origin": "Karnataka & Tamil Nadu",
        "grade": "Shadow-Dried Botanical Superfine Powder (Mesh 80–100)",
        "packaging": "10–20 kg light-shielded vacuum bags in master cartons; private label on request",
        "moq": "500 kg / 1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Electrifying sapphire-blue flower powder ground from Clitoria ternatea blossoms providing an earthy mild floral taste and famous pH-sensitive color-changing properties. Globally trending in artisanal cocktails, blue matcha lattes, specialty baking, and vibrant clean-label natural cosmetics. Typical specification (100% natural flower petals, moisture ≤ 6.5%), subject to lab report.",
        "image": "/products/butterfly-pea-flower-powder.webp",
        "gallery": [
            "/products/butterfly-pea-flower-powder.webp",
            "/products/butterfly-pea-flower-powder-ingredient.webp",
            "/products/butterfly-pea-flower-powder-2.webp",
            "/products/butterfly-pea-flower-powder-3.webp"
        ],
        "alt": "Vivid royal blue butterfly pea flower powder with fresh blooming Clitoria ternatea flowers"
    },
    {
        "slug": "rose-petal-powder",
        "name": "Rose Petal Powder",
        "origin": "Karnataka & Uttar Pradesh",
        "grade": "Shadow-Dried Floral Superfine Powder (Mesh 80–100)",
        "packaging": "20–25 kg aroma-barrier kraft drums; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "GMP"],
        "description": "Romantic dusty rose-pink floral powder sieved from shade-dried organic Rosa damascena petals with a luscious sweet floral perfume and soothing flavor. Prized in gourmet confectionery flavoring, herbal cosmetic facial packs, luxury bath teas, and exotic confectionery dusting. Typical specification (volatile floral oils preserved, moisture ≤ 6.5%), subject to lab report.",
        "image": "/products/rose-petal-powder.webp",
        "gallery": [
            "/products/rose-petal-powder.webp",
            "/products/rose-petal-powder-ingredient.webp",
            "/products/rose-petal-powder-2.webp",
            "/products/rose-petal-powder-3.webp"
        ],
        "alt": "Soft blush pink rose petal powder with fragrant fresh Indian Damask rose petals"
    },
    {
        "slug": "purple-sweet-potato-powder",
        "name": "Purple Sweet Potato Powder",
        "origin": "Odisha & Gujarat",
        "grade": "Dehydrated Superfine Root Powder (Mesh 80–100)",
        "packaging": "25 kg poly-lined multiwall kraft bags; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Vibrant royal violet-purple tuber powder milled from sweet purple-fleshed sweet potatoes delivering a gentle earthy sweetness and rich anthocyanin pigments. Widely applied in gluten-free bakery doughs, purple pasta coloring, specialty ice creams, and vibrant smoothie mixes. Typical specification (moisture ≤ 6.0%, intense natural pigmentation), subject to batch lab report.",
        "image": "/products/purple-sweet-potato-powder.webp",
        "gallery": [
            "/products/purple-sweet-potato-powder.webp",
            "/products/purple-sweet-potato-powder-ingredient.webp",
            "/products/purple-sweet-potato-powder-2.webp",
            "/products/purple-sweet-potato-powder-3.webp"
        ],
        "alt": "Bright purple sweet potato powder with fresh whole and cut violet sweet potatoes"
    },
    {
        "slug": "lemongrass-powder",
        "name": "Lemongrass Powder",
        "origin": "Kerala & Karnataka",
        "grade": "Air-Dried Botanical Powder (Mesh 80–100)",
        "packaging": "20–25 kg food-grade poly-lined sacks; private label on request",
        "moq": "1 MT (samples available upon request)",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Crisp straw-green botanical powder milled from dried Cymbopogon citratus stalks releasing an invigorating citrus-herbal aroma and bright zesty taste. A staple in Asian culinary seasonings, herbal wellness teas, soup seasonings, and aromatherapeutic wellness beverages. Typical specification (citral content intact, moisture ≤ 6.5%), subject to batch lab report.",
        "image": "/products/lemongrass-powder.webp",
        "gallery": [
            "/products/lemongrass-powder.webp",
            "/products/lemongrass-powder-ingredient.webp",
            "/products/lemongrass-powder-2.webp",
            "/products/lemongrass-powder-3.webp"
        ],
        "alt": "Fine light green lemongrass powder with freshly harvested crisp lemongrass stalks"
    }
]

# Build the exact 40 powders in required order:
# Top 4: White Onion, Garlic, Moringa Leaf, Tomato
TOP_4_SLUGS = [
    'white-onion-powder',
    'garlic-powder',
    'moringa-leaf-powder',
    'tomato-powder',
]

REMAINING_18_ORIGINALS = [
    'pink-red-onion-powder',
    'ginger-powder-saunth',
    'moringa-seed-powder',
    'spinach-powder',
    'curry-leaf-powder',
    'mint-leaf-powder',
    'coriander-leaf-powder',
    'kasuri-methi-powder',
    'beetroot-powder',
    'carrot-powder',
    'green-chilli-powder',
    'pumpkin-powder',
    'mango-powder-amchur',
    'banana-powder',
    'lemon-powder',
    'amla-powder',
    'aloe-vera-powder',
    'hibiscus-powder',
]

all_40_dehydrated = []

for s in TOP_4_SLUGS:
    all_40_dehydrated.append(dehydrated_map[s])

for s in REMAINING_18_ORIGINALS:
    all_40_dehydrated.append(dehydrated_map[s])

for p in new_powders:
    all_40_dehydrated.append(p)

print(f"Total dehydrated powders assembled: {len(all_40_dehydrated)}")

# Ensure each powder has exactly 4 gallery images: [slug, slug-ingredient, slug-2, slug-3]
for p in all_40_dehydrated:
    s = p['slug']
    p['image'] = f"/products/{s}.webp"
    p['gallery'] = [
        f"/products/{s}.webp",
        f"/products/{s}-ingredient.webp",
        f"/products/{s}-2.webp",
        f"/products/{s}-3.webp"
    ]

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
        "products": fruits['products']
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
        "slug": "ceramic-tiles",
        "name": "Ceramic & Vitrified Tiles",
        "headline": "Vitrified & Porcelain Surfaces",
        "blurb": "High-durability vitrified, porcelain, and digital ceramic wall and floor tiles manufactured in Morbi, Gujarat, compliant with ISO 13006 / EN 14411 international standards.",
        "image": "/products/vitrified-tiles.webp",
        "products": ceramic_tiles_prods
    },
    {
        "slug": "dehydrated-powders",
        "name": "Dehydrated Powders",
        "headline": "Air-Dried & Spray-Dried Powders",
        "blurb": "Air-dried and spray-dried vegetable, herb and botanical powders for food, nutrition and wellness brands.",
        "image": "/products/category-dehydrated-powders.webp",
        "products": all_40_dehydrated
    }
]

total_count = sum(len(c['products']) for c in total_catalog)
print("TOTAL CATEGORIES:", len(total_catalog))
print("TOTAL PRODUCTS:", total_count)
for c in total_catalog:
    print(f"  {c['slug']}: {len(c['products'])} items")

assert total_count == 115, f"Expected 115 products, got {total_count}"
assert len(all_40_dehydrated) == 40, f"Expected 40 powders, got {len(all_40_dehydrated)}"

ts_code = f"""// 7 Categories, {total_count} Approved Export Products with Dedicated High-Resolution Local Assets

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

export const categories: Category[] = {json.dumps(total_catalog, indent=2)};

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

print("SUCCESS: src/data/products.ts written with 115 products and 40 dehydrated powders!")
