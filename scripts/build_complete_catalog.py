import json
import subprocess
import os

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
        "moq": "1 × 20ft FCL (15 MT)",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Pungent tiny spherical oil-bearing seeds releasing sharp nutty heat upon crackling in hot oil, optical sorted for uniform color and clean seed coat.",
        "image": "/products/mustard-seeds.webp",
        "gallery": [
            "/products/mustard-seeds.webp",
            "/products/mustard-seeds-2.webp",
            "/products/mustard-seeds-3.webp"
        ],
        "alt": "Small round dark Indian mustard seeds rai"
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
spices_prods = spices_existing['products'] + classic_spices

# 5. Natural Stones (12 products) & 6. Ceramic Tiles (10 products)
stones_tiles_cat = next(c for c in existing_cats if c['slug'] == 'natural-stones-tiles')
tile_slugs = {'vitrified-tiles', 'porcelain-tiles', 'ceramic-wall-tiles'}
natural_stones_prods = [p for p in stones_tiles_cat['products'] if p['slug'] not in tile_slugs]
ceramic_tiles_base = [p for p in stones_tiles_cat['products'] if p['slug'] in tile_slugs]

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
ceramic_tiles_prods = ceramic_tiles_base + extra_tiles

# 7. DEHYDRATED POWDERS (TARGET: EXACTLY 40 FINE POWDERS, NO FLAKES/GRANULES)
# Top 4 for Mega-Menu:
TOP_4_POWDERS = [
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
        "alt": "Cream-white white onion powder heaped in a wooden bowl beside fresh whole white onions on a clean marble surface"
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
        "alt": "Fine off-white garlic powder in a wooden bowl beside fresh whole garlic bulbs and peeled cloves"
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
        "alt": "Vibrant emerald green moringa leaf powder in a wooden bowl beside fresh green moringa leaf sprigs"
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
        "alt": "Rich brick red-orange tomato powder in a wooden bowl beside ripe, glossy whole and sliced red tomatoes"
    }
]

REMAINING_18_ORIGINAL = [
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
        "alt": "Soft pink-lilac red onion powder in a wooden bowl beside fresh whole and sliced red onions"
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
        "alt": "Pale yellow-beige dry ginger saunth powder in a wooden bowl beside fresh knobby ginger rhizomes"
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
        "alt": "Pale beige-tan moringa seed powder in a wooden bowl beside whole dried moringa pods and seeds"
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
        "alt": "Dark forest green spinach powder in a wooden bowl beside crisp fresh whole green spinach leaves"
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
        "alt": "Dark olive green curry leaf powder in a wooden bowl beside aromatic glossy fresh curry leaf sprigs"
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
        "alt": "Bright green mint leaf powder in a wooden bowl beside freshly picked fragrant mint leaves"
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
        "alt": "Fresh medium-green coriander leaf powder in a wooden bowl beside crisp cilantro sprigs with tender stems"
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
        "alt": "Sage green fenugreek leaf kasuri methi powder in a wooden bowl beside whole dried and fresh fenugreek leaves"
    },
    {
        "slug": "beetroot-powder",
        "name": "Beetroot Powder",
        "origin": "Belgaum, Karnataka & Maharashtra",
        "grade": "Spray-Dried Superfine (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Pure deep-magenta beetroot powder prepared from sweet, earth-grown beets, valued as a clean-label natural food colorant and nitric oxide-boosting nutrient. Extensively exported for pre-workout sports nutrition, red velvet bakery items, smoothies, and cosmetics. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "alt": "Vivid magenta-purple beetroot powder in a wooden bowl beside whole and halved ruby-red beetroots"
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
        "alt": "Bright golden-orange carrot powder in a wooden bowl beside fresh whole crisp orange carrots with leafy green tops"
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
        "alt": "Sharp olive green chilli powder in a wooden bowl beside vibrant spicy fresh whole green chillies"
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
        "alt": "Golden orange pumpkin powder in a wooden bowl beside freshly cut ripe golden pumpkin wedges"
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
        "alt": "Pale golden-beige mango amchur powder in a wooden bowl beside sun-dried slices and fresh raw green mango"
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
        "alt": "Creamy off-white banana powder in a wooden bowl beside fresh ripe and unpeeled bananas"
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
        "alt": "Pale zesty lemon yellow powder in a wooden bowl beside fresh whole and juicy halved yellow lemons"
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
        "alt": "Nutritious greenish-brown amla powder in a wooden bowl beside whole fresh green Indian gooseberries"
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
        "alt": "Pale soothing beige-green aloe vera powder in a wooden bowl beside a thick freshly sliced aloe vera leaf revealing clear gel"
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
        "alt": "Deep crimson ruby-red hibiscus powder in a wooden bowl beside whole dried and fresh ruby-red hibiscus petals"
    }
]

NEW_18_BOTANICALS = [
    {
        "slug": "tulsi-holy-basil-leaf-powder",
        "name": "Tulsi (Holy Basil) Leaf Powder",
        "origin": "Uttar Pradesh & Madhya Pradesh",
        "grade": "Air-Dried Botanical (Mesh 60–80)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 9 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Sacred green tulsi powder milled from shade-dried Ocimum sanctum foliage, offering warm clove-like pungency and sweet herbal undertones. Revered for ayurvedic wellness teas, functional beverage infusions, and natural herbal supplements. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "alt": "Deep olive green tulsi holy basil leaf powder in a wooden bowl beside fresh sacred tulsi leaves"
    },
    {
        "slug": "neem-leaf-powder",
        "name": "Neem Leaf Powder",
        "origin": "Rajasthan & Gujarat",
        "grade": "Controlled Air-Dried (Mesh 60–80)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 9 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Deep forest green neem leaf powder harvested from mature Azadirachta indica foliage, carrying an intensely bitter herbal taste and rich limonoid content. Widely specified for ayurvedic health formulations, organic cosmetic cleansing bars, and herbal skin applications. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "alt": "Rich forest green neem leaf powder in a wooden bowl beside fresh bitter neem sprigs and pinnate leaves"
    },
    {
        "slug": "ashwagandha-root-powder",
        "name": "Ashwagandha Root Powder",
        "origin": "Madhya Pradesh & Rajasthan",
        "grade": "Air-Dried Superfine (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 11 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000", "HACCP"],
        "description": "Pale tan-beige adaptogenic root powder milled from graded Withania somnifera rhizomes, prized for its characteristic earthy aroma and bitter withanolide profile. A cornerstone ingredient in premium adaptogenic beverage mixes, dietary capsules, and nutraceutical formulas worldwide. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "alt": "Pale earthy tan-beige ashwagandha root powder in a wooden bowl beside whole dried ashwagandha roots"
    },
    {
        "slug": "shatavari-root-powder",
        "name": "Shatavari Root Powder",
        "origin": "Uttar Pradesh & Uttarakhand",
        "grade": "Air-Dried Superfine (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 11 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Creamy ivory-beige botanical root powder produced from peeled Asparagus racemosus tubers, known for its sweet, mildly bitter taste and restorative tonic properties. Extensively utilized in herbal wellness teas, women's vitality formulations, and functional food premixes. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "alt": "Creamy ivory-beige shatavari root powder in a wooden bowl beside peeled succulent shatavari roots"
    },
    {
        "slug": "wheatgrass-powder",
        "name": "Wheatgrass Powder",
        "origin": "Punjab & Haryana",
        "grade": "Dehydrated Superfine (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 8 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Vibrant emerald green cereal grass powder dehydrated from young organic Triticum aestivum shoots, packed with bioavailable chlorophyll and sweet grassy notes. An essential superfood component for detox green drinks, smoothie blends, and functional wellness shots. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
        "alt": "Vibrant chlorophyll green wheatgrass powder in a wooden bowl beside fresh young green wheatgrass blades"
    },
    {
        "slug": "okra-lady-finger-powder",
        "name": "Okra (Lady Finger) Powder",
        "origin": "Gujarat & Maharashtra",
        "grade": "Air-Dried Superfine (Mesh 60–80)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 9 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Light moss-green functional vegetable powder derived from tender Abelmoschus esculentus pods, characterized by mild vegetal sweetness and natural thickening mucilage. Extensively incorporated into instant soups, gluten-free baking blends, sauce thickeners, and dietary fiber supplements. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "alt": "Light moss green okra lady finger powder in a wooden bowl beside fresh whole and sliced green okra pods"
    },
    {
        "slug": "bitter-gourd-karela-powder",
        "name": "Bitter Gourd (Karela) Powder",
        "origin": "Gujarat & Maharashtra",
        "grade": "Dehydrated Fine (Mesh 60–80)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 9 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Medium olive green botanical powder made from mature Momordica charantia fruits, carrying a potent bitter profile rich in charantin and polypeptide-p. Favored globally for blood sugar support blends, detox drink premixes, and traditional herbal infusions. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "alt": "Medium olive green bitter gourd karela powder in a wooden bowl beside fresh whole and round slices of bitter gourd"
    },
    {
        "slug": "papaya-powder",
        "name": "Papaya Powder",
        "origin": "Gujarat & Andhra Pradesh",
        "grade": "Spray-Dried & Air-Dried (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 11 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Golden orange-yellow fruit powder milled from tree-ripened Carica papaya fruit pulp, delivering natural fruit sweetness and active papain enzymes. Highly prized in digestive wellness drink mixes, baby foods, fruit confections, and enzyme-active cosmetics. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "alt": "Warm golden orange papaya powder in a wooden bowl beside fresh ripe halved papaya showing glistening black seeds"
    },
    {
        "slug": "pomegranate-anardana-powder",
        "name": "Pomegranate (Anardana) Powder",
        "origin": "Solapur, Maharashtra",
        "grade": "Air-Dried Fine (Mesh 60–80)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Deep ruby maroon fruit powder prepared from dried Indian pomegranate arils, offering an appetizing sweet-tart acidity and rich punicalagin polyphenols. Ideal for savory meat rubs, barbecue glaze mixes, artisan snack dustings, and beverage flavorings. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "alt": "Deep ruby maroon pomegranate powder in a wooden bowl beside fresh split pomegranates with juicy arils"
    },
    {
        "slug": "guava-powder",
        "name": "Guava Powder",
        "origin": "Allahabad, Uttar Pradesh",
        "grade": "Spray-Dried Superfine (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 11 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Delicate creamy soft beige-pink fruit powder spray-dried from fragrant Allahabad safeda guavas, brimming with tropical aroma and natural vitamin C. A staple for tropical juice reconstitution, dairy yoghurt flavorings, fruit dessert mixes, and confectionery dusting. Typical specification, confirmed by the lab report for each batch (moisture ≤ 5.5%, no added colors or preservatives).",
        "alt": "Pale creamy guava powder in a wooden bowl beside fresh ripe whole and cut Indian guavas"
    },
    {
        "slug": "jamun-black-plum-powder",
        "name": "Jamun (Black Plum) Powder",
        "origin": "Maharashtra & Karnataka",
        "grade": "Controlled Air-Dried (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10 MT",
        "shelfLife": "24 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Deep royal purple-indigo fruit powder dehydrated from fresh Syzygium cumini berries, providing an astringent, pleasantly tart flavor packed with anthocyanins. Popular in glycemic wellness formulations, functional berry juices, and natural food coloring blends. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
        "alt": "Deep royal purple-indigo jamun black plum powder in a wooden bowl beside ripe glossy whole and halved jamun berries"
    },
    {
        "slug": "tamarind-powder",
        "name": "Tamarind Powder",
        "origin": "Karnataka & Andhra Pradesh",
        "grade": "Spray-Dried Superfine (Mesh 60–80)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 11 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Rich caramel brown fruit powder spray-dried from mature Tamarindus indica pulp, delivering concentrated tartaric tang and savory fruity acidity. Widely utilized in instant curry paste seasonings, chat seasonings, barbecue marinades, and sour confectionery blends. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "alt": "Rich caramel brown tamarind powder in a wooden bowl beside whole tamarind pods with sticky dark pulp"
    },
    {
        "slug": "kokum-powder",
        "name": "Kokum Powder",
        "origin": "Konkan, Maharashtra & Goa",
        "grade": "Shadow-Dried Botanical (Mesh 60–80)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 10 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Dark purple-black botanical powder processed from wild Garcinia indica rinds, delivering a distinctive fruity-sour tang loaded with hydroxycitric acid (HCA). Highly sought-after for coastal curry seasoning, refreshing digestive sherbets, and weight-management wellness blends. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "alt": "Deep dark purple-black kokum powder in a wooden bowl beside dried dark purple kokum fruit rinds"
    },
    {
        "slug": "coconut-milk-powder",
        "name": "Coconut Milk Powder",
        "origin": "Kerala & Tamil Nadu",
        "grade": "Spray-Dried Superfine (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 12 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000", "BRCGS"],
        "description": "Pure snow-white culinary powder spray-dried from freshly pressed mature coconut cream, possessing rich tropical sweetness and velvety mouthfeel. Readily dissolves into instant coconut milk or cream for curries, bakery glazes, smoothies, and vegan dairy alternatives. Typical specification, confirmed by the lab report for each batch (moisture ≤ 3.5%, no added colors or preservatives).",
        "alt": "Pure snow white coconut milk powder in a wooden bowl beside fresh cracked coconut halves showing white flesh"
    },
    {
        "slug": "butterfly-pea-flower-powder",
        "name": "Butterfly Pea Flower Powder",
        "origin": "Karnataka & Tamil Nadu",
        "grade": "Controlled Air-Dried (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 8 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Vivid electric sapphire blue botanical powder milled from harvested Clitoria ternatea blossoms, celebrated for mild floral notes and pH-sensitive color-changing properties. Widely exported for artisan color-changing teas, cocktail syrups, natural food colorings, and wellness beverages. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
        "alt": "Vivid electric sapphire blue butterfly pea flower powder in a wooden bowl beside fresh blue butterfly pea blossoms"
    },
    {
        "slug": "rose-petal-powder",
        "name": "Rose Petal Powder",
        "origin": "Karnataka & Uttar Pradesh",
        "grade": "Shadow-Dried Botanical (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 8 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Soft blush pink aromatic powder milled from organically grown Indian Damask rose petals, imbued with a delicate floral perfume and soothing cooling taste. Valued for luxury herbal tea blends, confectionery dusting, premium ayurvedic skincare, and wellness infusions. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
        "alt": "Soft blush pink rose petal powder in a wooden bowl beside fresh fragrant Indian Damask rose petals"
    },
    {
        "slug": "purple-sweet-potato-powder",
        "name": "Purple Sweet Potato Powder",
        "origin": "Odisha & Gujarat",
        "grade": "Dehydrated Superfine (Mesh 80–100)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 11 MT",
        "shelfLife": "18 months",
        "certifications": ["APEDA", "FSSAI", "ISO 22000"],
        "description": "Intense violet purple vegetable powder made from dehydrated purple-fleshed Ipomoea batatas tubers, providing a mildly sweet nutty flavor and concentrated anthocyanins. Extensively used in bakery doughs, purple pasta, bubble tea powders, and natural vibrant food colorings. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
        "alt": "Intense vibrant violet purple sweet potato powder in a wooden bowl beside fresh whole and sliced purple sweet potatoes"
    },
    {
        "slug": "lemongrass-powder",
        "name": "Lemongrass Powder",
        "origin": "Kerala & Karnataka",
        "grade": "Air-Dried Fine (Mesh 60–80)",
        "packaging": "25 kg paper bags with food-grade liner, private label on request",
        "moq": "1 MT (samples available); 1 × 20ft FCL about 8 MT",
        "shelfLife": "24 months",
        "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
        "description": "Pale sage straw-green botanical powder ground from tender Cymbopogon citratus stalks, offering an exhilarating citrus-herbal aroma and crisp lemon flavor. Essential for Southeast Asian soup seasonings, ready-to-drink herbal tea sachets, and citrus spice rubs. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
        "alt": "Pale sage straw-green lemongrass powder in a wooden bowl beside freshly cut stalks and blades of fragrant lemongrass"
    }
]

# Ensure image and gallery properties for all 40 powders:
all_40_powders = TOP_4_POWDERS + REMAINING_18_ORIGINAL + NEW_18_BOTANICALS
for p in all_40_powders:
    slug = p['slug']
    p['image'] = f"/products/{slug}.webp"
    p['gallery'] = [
        f"/products/{slug}.webp",
        f"/products/{slug}-ingredient.webp",
        f"/products/{slug}-2.webp",
        f"/products/{slug}-3.webp",
    ]

print(f"Total Dehydrated Powders assembled: {len(all_40_powders)}")

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
        "products": all_40_powders
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

print("Successfully generated src/data/products.ts with all 115 products!")
