import json

import subprocess

orig = subprocess.check_output(['git', 'show', 'HEAD:src/data/products.ts'], text=True, encoding='utf-8')

start = orig.find('export const categories: Category[] = ') + len('export const categories: Category[] = ')
end = orig.rfind('];') + 1

existing_cats = json.loads(orig[start:end])

# 1. Agriculture (16)
agri = next(c for c in existing_cats if c['slug'] == 'agriculture')

# 2. Fresh Vegetables (14)
veg = next(c for c in existing_cats if c['slug'] == 'fresh-vegetables')

# 3. Fresh Fruits (9)
fruits = next(c for c in existing_cats if c['slug'] == 'fresh-fruits')

# 4. Spices (14 = 6 existing + 8 classic Indian spices)
spices_existing = next(c for c in existing_cats if c['slug'] == 'spices')
classic_spices = [
    {
        "slug": "coriander-seeds",
        "name": "Coriander Seeds (Dhania)",
        "origin": "Kota & Ramganj Mandi, Rajasthan",
        "grade": "Eagle & Scoop Quality (Machine Cleaned 99% Purity)",
        "packaging": "25–50 kg Jute / PP Bags",
        "moq": "1 × 20ft FCL (14 MT)",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Golden-green aromatic coriander seeds from Rajasthan with sweet citrus aroma, high volatile oil content, and minimal split seeds.",
        "image": "/products/coriander-seeds.webp",
        "gallery": [
            "/products/coriander-seeds.webp",
            "/products/coriander-seeds-2.webp",
            "/products/coriander-seeds-3.webp"
        ],
        "alt": "Whole dried Indian coriander seeds in rustic bowl"
    },
    {
        "slug": "green-cardamom",
        "name": "Green Cardamom (Alleppey Bold)",
        "origin": "Idukki & Wayanad, Kerala",
        "grade": "Alleppey Green Extra Bold (7.5mm – 8mm+)",
        "packaging": "10 kg Master Cartons with 5 kg Vacuum Pouches",
        "moq": "500 kg Air Freight / LCL",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Queen of spices: plump, deep-emerald green cardamom pods handpicked in the Western Ghats, celebrated for intense floral camphor aromatics.",
        "image": "/products/green-cardamom.webp",
        "gallery": [
            "/products/green-cardamom.webp",
            "/products/green-cardamom-2.webp",
            "/products/green-cardamom-3.webp"
        ],
        "alt": "Whole bold green cardamom pods from Kerala"
    },
    {
        "slug": "cloves",
        "name": "Cloves (Laung)",
        "origin": "Kanyakumari & Kottayam, Kerala",
        "grade": "Hand-Picked Bold Whole Cloves (Head-On)",
        "packaging": "10–25 kg Multiwall Paper Sacks with Liner",
        "moq": "1 MT (1 × 20ft FCL about 11 MT)",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Dark reddish-brown dried flower buds with plump crowns and oil-rich stems, delivering pungent warm sweetness and high eugenol content.",
        "image": "/products/cloves.webp",
        "gallery": [
            "/products/cloves.webp",
            "/products/cloves-2.webp",
            "/products/cloves-3.webp"
        ],
        "alt": "Whole dried cloves with unbroken heads"
    },
    {
        "slug": "fennel-seeds",
        "name": "Fennel Seeds (Saunf)",
        "origin": "Unjha & Saurashtra, Gujarat",
        "grade": "Lucknowi Small Green & Machine Cleaned Bold",
        "packaging": "25–50 kg Polypropylene Sacks",
        "moq": "1 × 20ft FCL (13 MT)",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Fragrant slender green fennel seeds with sweet licorice notes and digestive essential oils, optical-sorted to eliminate dust and immature seeds.",
        "image": "/products/fennel-seeds.webp",
        "gallery": [
            "/products/fennel-seeds.webp",
            "/products/fennel-seeds-2.webp",
            "/products/fennel-seeds-3.webp"
        ],
        "alt": "Aromatic green Indian fennel seeds saunf"
    },
    {
        "slug": "mustard-seeds",
        "name": "Mustard Seeds (Rai & Sarson)",
        "origin": "Rajasthan & Haryana",
        "grade": "Small Brown & Bold Black (99.5% Purity)",
        "packaging": "25–50 kg PP Bags",
        "moq": "1 × 20ft FCL (18 MT)",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Round, oil-rich brown and black mustard seeds prized for intense pungent flavor upon tempering, cold-pressing, and seasoning applications.",
        "image": "/products/mustard-seeds.webp",
        "gallery": [
            "/products/mustard-seeds.webp",
            "/products/mustard-seeds-2.webp",
            "/products/mustard-seeds-3.webp"
        ],
        "alt": "Glossy whole brown mustard seeds in wooden spoon"
    },
    {
        "slug": "star-anise",
        "name": "Star Anise (Chakra Phool)",
        "origin": "Arunachal Pradesh & Kerala",
        "grade": "Whole 8-Arm Stars (Broken < 5%)",
        "packaging": "10 kg Corrugated Master Cartons",
        "moq": "1 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Distinctive star-shaped fruit carminatives with lustrous brown seeds, packing warm anethole aroma essential for biryanis and mulled blends.",
        "image": "/products/star-anise.webp",
        "gallery": [
            "/products/star-anise.webp",
            "/products/star-anise-2.webp",
            "/products/star-anise-3.webp"
        ],
        "alt": "Whole eight-pointed star anise spice on dark slate"
    },
    {
        "slug": "bay-leaf",
        "name": "Indian Bay Leaf (Tejpatta)",
        "origin": "Meghalaya & Assam",
        "grade": "Whole Sun-Dried Greenish-Brown Leaves",
        "packaging": "10–20 kg Pressed Bales / Cartons",
        "moq": "1 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Authentic Cinnamomum tamala leaves distinguished by three longitudinal veins, delivering cinnamon-clove aromatic warmth to slow-cooked dishes.",
        "image": "/products/bay-leaf.webp",
        "gallery": [
            "/products/bay-leaf.webp",
            "/products/bay-leaf-2.webp",
            "/products/bay-leaf-3.webp"
        ],
        "alt": "Whole dried Indian bay leaves tejpatta"
    },
    {
        "slug": "garam-masala",
        "name": "Royal Garam Masala Blend",
        "origin": "Kerala & Gujarat",
        "grade": "Traditional Whole Spice Ground Blend",
        "packaging": "20–25 kg Kraft Bags / Retail Pouches",
        "moq": "1 MT",
        "shelfLife": "18 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Signature regal aromatic blend of slow-roasted black cardamom, mace, cinnamon, cloves, coriander, and cumin ground to velvety perfection.",
        "image": "/products/garam-masala.webp",
        "gallery": [
            "/products/garam-masala.webp",
            "/products/garam-masala-2.webp",
            "/products/garam-masala-3.webp"
        ],
        "alt": "Rich brown aromatic ground garam masala spice blend"
    }
]

spices_prods = list(spices_existing['products']) + classic_spices

# 5. Natural Stones (12 quarried stones)
stones_tiles_existing = next(c for c in existing_cats if c['slug'] == 'natural-stones-tiles')
tile_slugs = {'vitrified-tiles', 'porcelain-tiles', 'ceramic-wall-tiles'}
natural_stones_prods = [p for p in stones_tiles_existing['products'] if p['slug'] not in tile_slugs]
ceramic_tiles_prods = [p for p in stones_tiles_existing['products'] if p['slug'] in tile_slugs]

# Add extra tile products to make 10 tiles
extra_tiles = [
    {
        "slug": "glazed-vitrified-tiles",
        "name": "Glazed Vitrified Tiles (GVT/PGVT)",
        "origin": "Morbi, Gujarat",
        "grade": "Rectified Glazed Porcelain (600x1200mm / 800x1600mm)",
        "packaging": "Fumigated Euro Pallets / Corrugated Cartons",
        "moq": "1 × 20ft Heavy FCL (1,200 sq.m)",
        "shelfLife": "Permanent Durability",
        "certifications": ["ISO 9001", "ISO 13006", "CE", "ISPM-15"],
        "description": "High-gloss and satin-matte glazed vitrified tiles featuring digital Italian marble veining, zero water absorption (<0.05%), and high breaking strength.",
        "image": "/products/glazed-vitrified-tiles.webp",
        "gallery": [
            "/products/glazed-vitrified-tiles.webp",
            "/products/glazed-vitrified-tiles-2.webp",
            "/products/glazed-vitrified-tiles-3.webp"
        ],
        "alt": "Glazed vitrified tiles with marble patterns packed on pallets"
    },
    {
        "slug": "large-format-porcelain-slabs",
        "name": "Large Format Porcelain Slabs",
        "origin": "Morbi, Gujarat",
        "grade": "Sintered Compact Slabs (1200x2400mm, 9mm & 12mm)",
        "packaging": "Heavy-Duty A-Frame Crates with Corner Guards",
        "moq": "1 × 20ft FCL (850 sq.m)",
        "shelfLife": "Permanent Durability",
        "certifications": ["ISO 9001", "ISO 13006", "CE"],
        "description": "Continuous-vein oversized porcelain slabs engineered for luxury kitchen countertops, seamless floor spans, and ventilated architectural exterior facades.",
        "image": "/products/large-format-porcelain-slabs.webp",
        "gallery": [
            "/products/large-format-porcelain-slabs.webp",
            "/products/large-format-porcelain-slabs-2.webp",
            "/products/large-format-porcelain-slabs-3.webp"
        ],
        "alt": "Continuous large format porcelain slab surfaces on display"
    },
    {
        "slug": "polished-porcelain-tiles",
        "name": "Polished Porcelain Floor Tiles",
        "origin": "Morbi, Gujarat",
        "grade": "Nano-Coated Polished Finish (600x600mm)",
        "packaging": "Corrugated Cartons with Plastic Strapping",
        "moq": "1 × 20ft Heavy FCL (1,400 sq.m)",
        "shelfLife": "Permanent Durability",
        "certifications": ["ISO 9001", "ISO 13006"],
        "description": "Ultra-reflective polished porcelain tiles protected by nano stain-repellent coats, ideal for high-traffic commercial airports, hotels, and retail malls.",
        "image": "/products/polished-porcelain-tiles.webp",
        "gallery": [
            "/products/polished-porcelain-tiles.webp",
            "/products/polished-porcelain-tiles-2.webp",
            "/products/polished-porcelain-tiles-3.webp"
        ],
        "alt": "Mirror polished porcelain floor tiles reflecting architectural light"
    },
    {
        "slug": "digital-wall-tiles",
        "name": "Digital Ceramic Wall Tiles",
        "origin": "Morbi, Gujarat",
        "grade": "High-Definition Ceramic (300x450mm & 300x600mm)",
        "packaging": "Fumigated Pallets / Reinforced Boxes",
        "moq": "1 × 20ft FCL (1,800 sq.m)",
        "shelfLife": "Permanent Durability",
        "certifications": ["ISO 9001", "ISO 13006", "CE"],
        "description": "Vibrant HD digital printed ceramic wall tiles featuring stone, botanical, and geometric motifs, water-resistant for residential bathroom and kitchen walls.",
        "image": "/products/digital-wall-tiles.webp",
        "gallery": [
            "/products/digital-wall-tiles.webp",
            "/products/digital-wall-tiles-2.webp",
            "/products/digital-wall-tiles-3.webp"
        ],
        "alt": "Digital ceramic wall tiles in decorative patterns"
    },
    {
        "slug": "subway-ceramic-tiles",
        "name": "Subway Ceramic Tiles",
        "origin": "Morbi, Gujarat",
        "grade": "Glossy Beveled Edge (75x150mm & 75x300mm)",
        "packaging": "Export Cartons in Wooden Pallets",
        "moq": "1 × 20ft FCL (1,500 sq.m)",
        "shelfLife": "Permanent Durability",
        "certifications": ["ISO 9001", "CE"],
        "description": "Classic beveled-edge subway ceramic tiles in glossy white, emerald, and midnight navy, prized by interior architects for hospitality backsplashes.",
        "image": "/products/subway-ceramic-tiles.webp",
        "gallery": [
            "/products/subway-ceramic-tiles.webp",
            "/products/subway-ceramic-tiles-2.webp",
            "/products/subway-ceramic-tiles-3.webp"
        ],
        "alt": "Classic beveled subway ceramic tiles on vertical display"
    },
    {
        "slug": "outdoor-parking-tiles",
        "name": "Outdoor Vitrified Parking Tiles",
        "origin": "Morbi, Gujarat",
        "grade": "Heavy Duty 12mm & 16mm Thickness (400x400mm)",
        "packaging": "Fumigated Wooden Pallets",
        "moq": "1 × 20ft FCL (1,100 sq.m)",
        "shelfLife": "Permanent Durability",
        "certifications": ["ISO 9001", "ISO 13006"],
        "description": "High-load vitrified parking tiles engineered with textured punch surfaces and extreme compressive strength to withstand continuous vehicular traffic.",
        "image": "/products/outdoor-parking-tiles.webp",
        "gallery": [
            "/products/outdoor-parking-tiles.webp",
            "/products/outdoor-parking-tiles-2.webp",
            "/products/outdoor-parking-tiles-3.webp"
        ],
        "alt": "Heavy duty outdoor vitrified parking tiles with anti-skid surface"
    },
    {
        "slug": "anti-skid-ceramic-tiles",
        "name": "Anti-Skid Ceramic Floor Tiles",
        "origin": "Morbi, Gujarat",
        "grade": "R10 / R11 Slip Resistance (300x300mm & 600x600mm)",
        "packaging": "Export Cartons with Strapping",
        "moq": "1 × 20ft FCL (1,400 sq.m)",
        "shelfLife": "Permanent Durability",
        "certifications": ["ISO 9001", "ISO 13006", "CE"],
        "description": "Matte-finish ceramic tiles with friction-treated surfaces meeting international wet-slip ratings, engineered for pool decks, commercial kitchens, and wet areas.",
        "image": "/products/anti-skid-ceramic-tiles.webp",
        "gallery": [
            "/products/anti-skid-ceramic-tiles.webp",
            "/products/anti-skid-ceramic-tiles-2.webp",
            "/products/anti-skid-ceramic-tiles-3.webp"
        ],
        "alt": "Anti-skid matte ceramic floor tiles"
    }
]
ceramic_tiles_prods.extend(extra_tiles)

# 7. Dehydrated Powders & Flakes (28 products, with the top 4 products first!)
dehydrated_prods = [
    # Top 4 products required for Mega-Menu:
    {
        "slug": "white-onion-powder",
        "name": "White Onion Powder",
        "origin": "Bhavnagar & Mahuva, Gujarat",
        "grade": "Air-Dried Superfine (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP", "BRCGS"],
        "description": "Creamy white culinary powder made from premium dehydrated Bhavnagar white onions, delivering sharp pungency and rich savory sweetness. Ideal for seasoning blends, dry soup mixes, marinades, sauces, and industrial snack coatings. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "image": "/products/white-onion-powder.webp",
        "gallery": [
            "/products/white-onion-powder.webp",
            "/products/white-onion-powder-2.webp",
            "/products/white-onion-powder-3.webp"
        ],
        "alt": "Air-dried Indian white onion powder in wooden bowl with fresh white onions"
    },
    {
        "slug": "garlic-powder",
        "name": "Garlic Powder",
        "origin": "Mandsaur, Madhya Pradesh & Rajkot, Gujarat",
        "grade": "Air-Dried Superfine (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "BRCGS"],
        "description": "Finely ground golden-cream garlic powder processed from fully cured whole Indian garlic cloves, delivering intense savory umami and potent aroma. An essential building block for spice rubs, sausage blends, garlic butter bases, and international snack flavorings. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "image": "/products/garlic-powder.webp",
        "gallery": [
            "/products/garlic-powder.webp",
            "/products/garlic-powder-2.webp",
            "/products/garlic-powder-3.webp"
        ],
        "alt": "Superfine Indian garlic powder in wooden bowl with whole garlic bulbs"
    },
    {
        "slug": "moringa-leaf-powder",
        "name": "Moringa Leaf Powder",
        "origin": "Madurai, Tamil Nadu & Guntur, Andhra Pradesh",
        "grade": "Shade-Dried Ultra-Fine (Mesh 80–100)",
        "packaging": "20–25 kg nitrogen-flushed foil bags in cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Nutrient-dense superfood powder produced from tender shade-dried leaves of Indian Moringa oleifera, retaining vivid green chlorophyll and vitamins. Heavily sought after for health capsules, green smoothie mixes, nutritional bars, and functional skincare. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "image": "/products/moringa-leaf-powder.webp",
        "gallery": [
            "/products/moringa-leaf-powder.webp",
            "/products/moringa-leaf-powder-2.webp",
            "/products/moringa-leaf-powder-3.webp"
        ],
        "alt": "Vibrant green moringa leaf powder in bowl with fresh moringa leaves"
    },
    {
        "slug": "tomato-powder",
        "name": "Tomato Powder",
        "origin": "Nashik, Maharashtra & Kolar, Karnataka",
        "grade": "Spray-Dried & Air-Dried (Mesh 80–100)",
        "packaging": "20–25 kg nitrogen-flushed foil bags in cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 11 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "BRCGS"],
        "description": "Concentrated spray-dried tomato powder derived from field-ripened red tomatoes, providing natural lycopene, bright acidity, and rich umami depth. Ideal for instant pasta sauces, pizza seasoning blends, dry soup bases, and extruded snack dusting. Typical specification, confirmed by the lab report for each batch (moisture ≤ 5.0%, no added colors or preservatives).",
        "image": "/products/tomato-powder.webp",
        "gallery": [
            "/products/tomato-powder.webp",
            "/products/tomato-powder-2.webp",
            "/products/tomato-powder-3.webp"
        ],
        "alt": "Vibrant red-orange spray dried tomato powder with fresh ripe tomatoes"
    },
    # Rest of the 24 products:
    {
        "slug": "pink-red-onion-powder",
        "name": "Pink/Red Onion Powder",
        "origin": "Nashik, Maharashtra & Mahuva, Gujarat",
        "grade": "Spray & Air-Dried (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Aromatic pinkish-red onion powder milled from high-solids Nashik red onions with authentic zesty flavor and deep caramelized undertones. Extensively used in ramen broths, meat seasonings, extruded snacks, and dehydrated gravies. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
        "image": "/products/pink-red-onion-powder.webp",
        "gallery": [
            "/products/pink-red-onion-powder.webp",
            "/products/pink-red-onion-powder-2.webp",
            "/products/pink-red-onion-powder-3.webp"
        ],
        "alt": "Dehydrated Indian pink and red onion powder with whole red onions on slate"
    },
    {
        "slug": "dehydrated-white-onion-flakes",
        "name": "Dehydrated White Onion Flakes",
        "origin": "Bhavnagar & Mahuva, Gujarat",
        "grade": "Kibbled (8–15mm), Chopped (3–5mm), Minced (1–3mm), Granules (8–16 mesh)",
        "packaging": "14–15 kg poly-lined cartons, 20 kg paper bags, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 8–10 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "BRCGS"],
        "description": "Uniformly dehydrated white onion flakes available in kibbled, chopped, minced, and granule grades with rapid rehydration and crisp allium texture. Widely exported for instant noodles, canned ready-meals, salad toppings, and commercial pizza sauces. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "image": "/products/dehydrated-white-onion-flakes.webp",
        "gallery": [
            "/products/dehydrated-white-onion-flakes.webp",
            "/products/dehydrated-white-onion-flakes-2.webp",
            "/products/dehydrated-white-onion-flakes-3.webp"
        ],
        "alt": "Dehydrated white onion flakes kibbled and chopped with whole white onion"
    },
    {
        "slug": "dehydrated-red-onion-flakes",
        "name": "Dehydrated Red Onion Flakes",
        "origin": "Nashik & Jalgaon, Maharashtra",
        "grade": "Kibbled (8–15mm) & Chopped (3–5mm)",
        "packaging": "14 kg poly-lined cartons, 20 kg paper bags, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 8–10 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Vibrant dehydrated red onion kibbles retaining natural anthocyanin streaks, robust pungency, and satisfying chew upon rehydration. Perfect for artisan bread baking, dry soup kits, burger patties, and European deli mixes. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
        "image": "/products/dehydrated-red-onion-flakes.webp",
        "gallery": [
            "/products/dehydrated-red-onion-flakes.webp",
            "/products/dehydrated-red-onion-flakes-2.webp",
            "/products/dehydrated-red-onion-flakes-3.webp"
        ],
        "alt": "Dehydrated red onion flakes and kibbled pieces beside fresh red onion"
    },
    {
        "slug": "dehydrated-garlic-flakes",
        "name": "Dehydrated Garlic Flakes",
        "origin": "Mandsaur, Madhya Pradesh & Gujarat",
        "grade": "Flakes (3–5mm Sliced)",
        "packaging": "20 kg poly-lined cartons, 25 kg paper bags, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Carefully sliced and hot-air dehydrated garlic cloves offering full-bodied aromatic pungency and attractive toasted appearance. Preferred by commercial spice mills, pickle manufacturers, sausage producers, and institutional soup processors. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "image": "/products/dehydrated-garlic-flakes.webp",
        "gallery": [
            "/products/dehydrated-garlic-flakes.webp",
            "/products/dehydrated-garlic-flakes-2.webp",
            "/products/dehydrated-garlic-flakes-3.webp"
        ],
        "alt": "Dehydrated garlic flakes and sliced cloves with fresh garlic bulb"
    },
    {
        "slug": "garlic-granules",
        "name": "Garlic Granules",
        "origin": "Mandsaur, Madhya Pradesh & Gujarat",
        "grade": "Granules (Mesh 8–16 / 16–26)",
        "packaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "BRCGS"],
        "description": "Free-flowing granular garlic particles engineered for uniform dispersion without dusting or caking during dry blending. Extensively utilized in barbecue rubs, bagel seasonings, table dispensers, and institutional spice formulations. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "image": "/products/garlic-granules.webp",
        "gallery": [
            "/products/garlic-granules.webp",
            "/products/garlic-granules-2.webp",
            "/products/garlic-granules-3.webp"
        ],
        "alt": "Golden cream garlic granules with fresh garlic cloves"
    },
    {
        "slug": "ginger-powder-saunth",
        "name": "Ginger Powder (Saunth)",
        "origin": "Wayanad & Idukki, Kerala",
        "grade": "Sun & Hot-Air Dried (Mesh 60–100)",
        "packaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Traditional Indian Saunth ground from peeled, cured ginger rhizomes of Kerala, renowned for fiery warmth and aromatic citrus nuance. Essential for gingerbread baking, chai blends, herbal digestive formulas, curry powders, and wellness beverages. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.5%, no added colors or preservatives).",
        "image": "/products/ginger-powder-saunth.webp",
        "gallery": [
            "/products/ginger-powder-saunth.webp",
            "/products/ginger-powder-saunth-2.webp",
            "/products/ginger-powder-saunth-3.webp"
        ],
        "alt": "Ground dry ginger powder saunth with fresh ginger root"
    },
    {
        "slug": "dehydrated-ginger-flakes",
        "name": "Dehydrated Ginger Flakes",
        "origin": "Wayanad, Kerala & Assam",
        "grade": "Dried Slices & Flakes (3–5mm)",
        "packaging": "20 kg poly-lined cartons, 25 kg paper bags, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 9 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Clean cross-cut dried ginger slices preserved through controlled dehydration to lock in potent gingerols and volatile essential oils. Valued for herbal tea infusions, culinary decoctions, artisanal distilling, and industrial ginger oleoresin extraction. Typical specification, confirmed by the lab report for each batch (moisture ≤ 8.0%, no added colors or preservatives).",
        "image": "/products/dehydrated-ginger-flakes.webp",
        "gallery": [
            "/products/dehydrated-ginger-flakes.webp",
            "/products/dehydrated-ginger-flakes-2.webp",
            "/products/dehydrated-ginger-flakes-3.webp"
        ],
        "alt": "Dehydrated sliced ginger flakes with fresh knobby ginger rhizome"
    },
    {
        "slug": "moringa-seed-powder",
        "name": "Moringa Seed Powder",
        "origin": "Tamil Nadu & Karnataka",
        "grade": "Cold-Milled Botanical Powder (Mesh 60–80)",
        "packaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Finely milled powder from winged moringa seeds, recognized for its natural coagulating, antioxidant, and therapeutic fatty acid profile. Used in functional health supplements, natural cosmetic formulations, and premium botanical wellness applications. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.5%, no added colors or preservatives).",
        "image": "/products/moringa-seed-powder.webp",
        "gallery": [
            "/products/moringa-seed-powder.webp",
            "/products/moringa-seed-powder-2.webp",
            "/products/moringa-seed-powder-3.webp"
        ],
        "alt": "Fine moringa seed powder in rustic wooden bowl with winged seeds"
    },
    {
        "slug": "spinach-powder",
        "name": "Spinach Powder",
        "origin": "Pune, Maharashtra & Punjab",
        "grade": "Air-Dried Microfine (Mesh 80–100)",
        "packaging": "20 kg poly-lined cartons, 25 kg paper bags, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Vibrant green powder manufactured from freshly harvested Indian Palak spinach leaves, gently dried to protect thermolabile iron and folic acid. Widely used as an organic natural colorant and nutritional booster in pastas, bakery items, soups, and beverages. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
        "image": "/products/spinach-powder.webp",
        "gallery": [
            "/products/spinach-powder.webp",
            "/products/spinach-powder-2.webp",
            "/products/spinach-powder-3.webp"
        ],
        "alt": "Deep green spinach powder with fresh spinach leaves on dark slate"
    },
    {
        "slug": "curry-leaf-powder",
        "name": "Curry Leaf Powder",
        "origin": "Coimbatore, Tamil Nadu & Andhra Pradesh",
        "grade": "Controlled Air-Dried (Mesh 60–80)",
        "packaging": "20 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 9 MT",
        "shelfLife": "18 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Highly aromatic botanical powder made from mature Indian Murraya koenigii foliage, delivering the quintessential citrus-savory aroma of southern curries. Extensively utilized in south Asian spice seasonings, savory rice mixes, chutneys, and ayurvedic hair care formulas. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "image": "/products/curry-leaf-powder.webp",
        "gallery": [
            "/products/curry-leaf-powder.webp",
            "/products/curry-leaf-powder-2.webp",
            "/products/curry-leaf-powder-3.webp"
        ],
        "alt": "Aromatic curry leaf powder in bowl with fresh curry leaves"
    },
    {
        "slug": "mint-leaf-powder",
        "name": "Mint Leaf Powder",
        "origin": "Bareilly, Uttar Pradesh & Madhya Pradesh",
        "grade": "Shadow-Dried Fine (Mesh 60–80)",
        "packaging": "15–20 kg poly-lined cartons, 25 kg paper bags, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 8 MT",
        "shelfLife": "18 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Refreshingly crisp mint powder milled from cleaned Mentha arvensis leaves, brimming with cooling essential oils and invigorating aroma. A staple ingredient in raita seasonings, iced tea blends, mint chocolate confectionery, and herbal digestives. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "image": "/products/mint-leaf-powder.webp",
        "gallery": [
            "/products/mint-leaf-powder.webp",
            "/products/mint-leaf-powder-2.webp",
            "/products/mint-leaf-powder-3.webp"
        ],
        "alt": "Fresh green mint leaf powder with sprigs of fresh garden mint"
    },
    {
        "slug": "coriander-leaf-powder",
        "name": "Coriander Leaf Powder",
        "origin": "Rajasthan & Madhya Pradesh",
        "grade": "Air-Dried Herbaceous Powder (Mesh 60–80)",
        "packaging": "20 kg poly-lined master cartons, 10 kg paper sacks, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 8 MT",
        "shelfLife": "18 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Aromatic green herb powder processed from tender Indian cilantro foliage, capturing fresh herbal top-notes without enzymatic browning. Ideal for instant salsa mixes, guacamole seasonings, dry curries, and green snack dustings. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "image": "/products/coriander-leaf-powder.webp",
        "gallery": [
            "/products/coriander-leaf-powder.webp",
            "/products/coriander-leaf-powder-2.webp",
            "/products/coriander-leaf-powder-3.webp"
        ],
        "alt": "Bright herbal green coriander leaf powder with fresh cilantro sprigs"
    },
    {
        "slug": "kasuri-methi-powder",
        "name": "Fenugreek Leaf Powder (Kasuri Methi)",
        "origin": "Nagaur, Rajasthan",
        "grade": "Premium Sun & Air-Dried (Mesh 60–80)",
        "packaging": "15–20 kg poly-lined cartons, 25 kg paper bags, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 8 MT",
        "shelfLife": "18 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "World-famous Nagauri Kasuri Methi ground into uniform botanical powder, prized for its unmistakable bittersweet fragrance and maple-like savory finish. Essential for rich North Indian gravies, butter chicken sauces, paratha doughs, and Mediterranean spice rubs. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.5%, no added colors or preservatives).",
        "image": "/products/kasuri-methi-powder.webp",
        "gallery": [
            "/products/kasuri-methi-powder.webp",
            "/products/kasuri-methi-powder-2.webp",
            "/products/kasuri-methi-powder-3.webp"
        ],
        "alt": "Fragrant Kasuri Methi fenugreek leaf powder with dried herb leaves"
    },
    {
        "slug": "beetroot-powder",
        "name": "Beetroot Powder",
        "origin": "Belgaum, Karnataka & Maharashtra",
        "grade": "Spray-Dried Fine (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Pure deep-magenta beetroot powder prepared from sweet, earth-grown beets, valued as a clean-label natural food colorant and nitric oxide-boosting nutrient. Extensively exported for pre-workout sports nutrition, red velvet bakery items, smoothies, and cosmetics. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "image": "/products/beetroot-powder.webp",
        "gallery": [
            "/products/beetroot-powder.webp",
            "/products/beetroot-powder-2.webp",
            "/products/beetroot-powder-3.webp"
        ],
        "alt": "Deep ruby magenta beetroot powder in wooden bowl with fresh beetroot"
    },
    {
        "slug": "carrot-powder",
        "name": "Carrot Powder",
        "origin": "Punjab & Rajasthan",
        "grade": "Air-Dried & Spray-Dried (Mesh 80–100)",
        "packaging": "20–25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 11 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Sweet, golden-orange powder milled from freshly washed and peeled Indian carrots, retaining natural provitamin A carotenoids and earthy sweetness. Widely utilized in baby food purées, instant soups, natural confectionery colorants, and wellness drink powders. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "image": "/products/carrot-powder.webp",
        "gallery": [
            "/products/carrot-powder.webp",
            "/products/carrot-powder-2.webp",
            "/products/carrot-powder-3.webp"
        ],
        "alt": "Vibrant orange carrot powder with fresh whole crisp carrots"
    },
    {
        "slug": "green-chilli-powder",
        "name": "Green Chilli Powder",
        "origin": "Anand, Gujarat & Guntur, Andhra Pradesh",
        "grade": "Low-Temperature Dehydrated (Mesh 80–100)",
        "packaging": "20 kg poly-lined cartons, 25 kg paper bags, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10 MT",
        "shelfLife": "18 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Crisp, piquant powder produced from fresh green chillies dehydrated under controlled low temperatures to safeguard bright green color and sharp capsaicin punch. Perfect for namkeen snack seasonings, Mexican salsa dry blends, chutneys, and instant ramen bases. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "image": "/products/green-chilli-powder.webp",
        "gallery": [
            "/products/green-chilli-powder.webp",
            "/products/green-chilli-powder-2.webp",
            "/products/green-chilli-powder-3.webp"
        ],
        "alt": "Piquant green chilli powder with fresh fiery green chillies"
    },
    {
        "slug": "potato-flakes",
        "name": "Potato Flakes",
        "origin": "Gujarat & Uttar Pradesh",
        "grade": "Drum-Dried Dehydrated Flakes",
        "packaging": "20–25 kg multiwall paper sacks with inner PE liner, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 9–11 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Fluffy, drum-dried dehydrated potato flakes manufactured from select high-solids Indian processing potatoes, rehydrating instantaneously into smooth mashed potato. Extensively exported for snack pellet manufacturing, extruded crisps, croquette coatings, and bakery dough conditioning. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "image": "/products/potato-flakes.webp",
        "gallery": [
            "/products/potato-flakes.webp",
            "/products/potato-flakes-2.webp",
            "/products/potato-flakes-3.webp"
        ],
        "alt": "Creamy white dehydrated potato flakes with whole raw potato"
    },
    {
        "slug": "pumpkin-powder",
        "name": "Pumpkin Powder",
        "origin": "Madhya Pradesh & Karnataka",
        "grade": "Spray & Air-Dried (Mesh 80–100)",
        "packaging": "20 kg poly-lined paper cartons, 25 kg paper bags, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 11 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Golden-yellow powder made from sweet ripened pumpkins, offering natural dietary fiber, carotenoids, and a mild nutty sweetness. Favored across Europe and North America for pumpkin spice blends, bakery mixes, pet food nutrition, and culinary thickening. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
        "image": "/products/pumpkin-powder.webp",
        "gallery": [
            "/products/pumpkin-powder.webp",
            "/products/pumpkin-powder-2.webp",
            "/products/pumpkin-powder-3.webp"
        ],
        "alt": "Golden yellow pumpkin powder with fresh sliced pumpkin squash"
    },
    {
        "slug": "mango-powder-amchur",
        "name": "Mango Powder (Amchur)",
        "origin": "Uttar Pradesh & Gujarat",
        "grade": "Sun & Air-Dried Fine (Mesh 60–80)",
        "packaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Traditional Indian Amchur ground from unripe green mangoes, celebrated for delivering clean, sour, fruity acidity without adding liquid. An essential souring agent for chaat seasonings, samosa fillings, barbecue rubs, marinades, and sour confectionery. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "image": "/products/mango-powder-amchur.webp",
        "gallery": [
            "/products/mango-powder-amchur.webp",
            "/products/mango-powder-amchur-2.webp",
            "/products/mango-powder-amchur-3.webp"
        ],
        "alt": "Tart green mango amchur powder with sliced raw green mango"
    },
    {
        "slug": "banana-powder",
        "name": "Banana Powder",
        "origin": "Jalgaon, Maharashtra & Tamil Nadu",
        "grade": "Spray & Drum-Dried (Mesh 80–100)",
        "packaging": "20–25 kg nitrogen-flushed foil bags in cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Creamy, highly digestible fruit powder processed from sun-ripened Indian Cavendish and Robusta bananas, packed with potassium and natural prebiotic fibers. Widely exported for infant feeding cereals, protein shake mixes, gluten-free baking, and dairy desserts. Typical specification, confirmed by the lab report for each batch (moisture ≤ 5.0%, no added colors or preservatives).",
        "image": "/products/banana-powder.webp",
        "gallery": [
            "/products/banana-powder.webp",
            "/products/banana-powder-2.webp",
            "/products/banana-powder-3.webp"
        ],
        "alt": "Pale cream banana powder in wooden bowl with fresh yellow bananas"
    },
    {
        "slug": "lemon-powder",
        "name": "Lemon Powder",
        "origin": "Saurashtra, Gujarat & Andhra Pradesh",
        "grade": "Spray-Dried Fruit Powder (Mesh 80–100)",
        "packaging": "20 kg foil-sealed bags in cartons, 25 kg paper bags, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 11 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "BRCGS"],
        "description": "Tangy, spray-dried citrus powder crafted from fragrant Kagzi lemons, preserving volatile limonene notes and natural citric acid sharpness. An indispensable ingredient for powdered drink mixes, lemon pepper seasonings, marinades, and confectionery glazes. Typical specification, confirmed by the lab report for each batch (moisture ≤ 4.5%, no added colors or preservatives).",
        "image": "/products/lemon-powder.webp",
        "gallery": [
            "/products/lemon-powder.webp",
            "/products/lemon-powder-2.webp",
            "/products/lemon-powder-3.webp"
        ],
        "alt": "Sunny yellow spray dried lemon powder with fresh yellow lemons"
    },
    {
        "slug": "amla-powder",
        "name": "Amla Powder",
        "origin": "Pratapgarh, Uttar Pradesh & Gujarat",
        "grade": "Shade-Dried Botanical Powder (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Potent botanical powder milled from Indian gooseberries (Phyllanthus emblica), famous as nature's richest stable source of antioxidant Vitamin C and polyphenols. Extensively utilized in dietary supplements, immunity tonics, herbal hair treatments, and holistic cosmetics. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "image": "/products/amla-powder.webp",
        "gallery": [
            "/products/amla-powder.webp",
            "/products/amla-powder-2.webp",
            "/products/amla-powder-3.webp"
        ],
        "alt": "Herbal amla gooseberry powder in bowl with fresh green amla berries"
    },
    {
        "slug": "aloe-vera-powder",
        "name": "Aloe Vera Powder",
        "origin": "Jodhpur, Rajasthan & Gujarat",
        "grade": "Spray-Dried 100:1 Inner Gel Powder (Mesh 80–100)",
        "packaging": "10–20 kg aluminum foil barrier bags in cartons, private-label packs on request",
        "moq": "500 kg – 1 MT (samples available); 1 × 20ft FCL about 10 MT",
        "shelfLife": "24 months",
        "certifications": ["FSSAI", "ISO 22000", "HACCP"],
        "description": "Ultra-concentrated inner-leaf fillet gel powder derived from organically cultivated Aloe barbadensis Miller, gently spray-dried to maintain biological activity. Exported globally for premium skincare, soothing digestive formulas, cosmetic lotions, and functional beverages. Typical specification, confirmed by the lab report for each batch (moisture ≤ 5.0%, no added colors or preservatives).",
        "image": "/products/aloe-vera-powder.webp",
        "gallery": [
            "/products/aloe-vera-powder.webp",
            "/products/aloe-vera-powder-2.webp",
            "/products/aloe-vera-powder-3.webp"
        ],
        "alt": "Pristine white aloe vera inner gel powder with freshly cut aloe succulent leaves"
    },
    {
        "slug": "hibiscus-powder",
        "name": "Hibiscus Powder",
        "origin": "Salem, Tamil Nadu & Karnataka",
        "grade": "Air & Shadow-Dried Botanical (Mesh 80–100)",
        "packaging": "20 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Striking deep-burgundy botanical powder harvested from sun-dried Hibiscus sabdariffa calyces, providing natural anthocyanin pigmentation and tart fruity tang. Popular in artisan herbal teas, gin infusions, natural cosmetic blushes, and functional wellness beverages. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
        "image": "/products/hibiscus-powder.webp",
        "gallery": [
            "/products/hibiscus-powder.webp",
            "/products/hibiscus-powder-2.webp",
            "/products/hibiscus-powder-3.webp"
        ],
        "alt": "Deep burgundy hibiscus flower powder with whole dried hibiscus calyces"
    }
]

# Filter out flakes and granules, keeping only the 22 pure powders in exact brief order:
TARGET_22_ORDER = [
    'white-onion-powder',
    'pink-red-onion-powder',
    'garlic-powder',
    'ginger-powder-saunth',
    'moringa-leaf-powder',
    'moringa-seed-powder',
    'spinach-powder',
    'curry-leaf-powder',
    'mint-leaf-powder',
    'coriander-leaf-powder',
    'kasuri-methi-powder',
    'tomato-powder',
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

dehydrated_map = {p['slug']: p for p in dehydrated_prods}
dehydrated_prods = []
for slug in TARGET_22_ORDER:
    p = dehydrated_map[slug]
    # Sanitize any flake or granule wording
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
    dehydrated_prods.append(p)

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
        "products": dehydrated_prods
    }
]

total_count = sum(len(c['products']) for c in total_catalog)
print("TOTAL CATEGORIES:", len(total_catalog))
print("TOTAL PRODUCTS:", total_count)
for c in total_catalog:
    print(f"  {c['slug']}: {len(c['products'])} items")

# Generate TypeScript file
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

print("Successfully written to src/data/products.ts!")
