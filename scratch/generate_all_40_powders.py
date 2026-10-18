import json, os, re

# Load existing products from HEAD~1 to extract the original 10 removed powders:
import subprocess
git_old = subprocess.check_output(['git', 'show', 'HEAD~1:src/data/products.ts'], text=True, encoding='utf-8')

# The original 10 removed powders are:
# beetroot-powder, carrot-powder, green-chilli-powder, pumpkin-powder, mango-powder-amchur,
# banana-powder, lemon-powder, amla-powder, aloe-vera-powder, hibiscus-powder.

# Let's extract them from git_old
old_slugs = [
    'beetroot-powder', 'carrot-powder', 'green-chilli-powder', 'pumpkin-powder',
    'mango-powder-amchur', 'banana-powder', 'lemon-powder', 'amla-powder',
    'aloe-vera-powder', 'hibiscus-powder'
]

# Helper to find a product block
def extract_prod_block(text, slug):
    m = re.search(rf'(\s*\{{\s*slug:\s*"{slug}",[\s\S]*?\n\s*\}},?)', text)
    if m:
        return m.group(1).rstrip(',')
    return None

old_powder_blocks = {}
for s in old_slugs:
    blk = extract_prod_block(git_old, s)
    if not blk:
        print(f"Could not find old block for {s}")
    else:
        # ensure gallery has 4 items
        expected_gal = f'''gallery: [
          "/products/{s}.webp",
          "/products/{s}-ingredient.webp",
          "/products/{s}-2.webp",
          "/products/{s}-3.webp",
        ],'''
        blk = re.sub(r'gallery:\s*\[[\s\S]*?\],', expected_gal, blk)
        # remove flakes/granules
        blk = blk.replace('Flakes (3–5mm)', 'Superfine Powder (Mesh 80–100)')
        blk = blk.replace('Dried Slices & Flakes (3–5mm)', 'Superfine Powder (Mesh 80–100)')
        blk = blk.replace('Dried Slices & Flakes', 'Superfine Powder (Mesh 80–100)')
        blk = blk.replace('flakes', 'fine powders').replace('flake', 'powder')
        blk = blk.replace('granules', 'fine powder').replace('granule', 'powder')
        blk = blk.replace('kibbled', 'fine-milled').replace('minced', 'sieved')
        old_powder_blocks[s] = blk

print(f"Extracted {len(old_powder_blocks)} original removed powders from git history.")

# Define 18 new botanical/food powders
NEW_18_DATA = [
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

print("Script template ready.")
