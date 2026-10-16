# scripts/build_catalog.py
import json

catalog = [
    {
        "slug": "agriculture",
        "name": "Agriculture",
        "headline": "Grains, Pulses & Staples",
        "blurb": "Grains and cereals from India's most fertile belts, machine-cleaned, optical-sorted and packaged to stringent international trade standards.",
        "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1600&q=80",
        "products": [
            {
                "slug": "basmati-rice",
                "name": "1121 Basmati Rice",
                "origin": "Punjab & Haryana",
                "grade": "1121 / 1509 (Sella, Steam, Raw)",
                "packaging": "5–40 kg Jute / Non-Woven PP bags",
                "moq": "1 × 20ft FCL (25 MT)",
                "shelfLife": "24 months",
                "certifications": ["APEDA", "ISO 22000", "FSSAI", "BRCGS"],
                "description": "Aged 1121 and 1509 extra-long grain basmati rice renowned worldwide for an elongation ratio exceeding 2.5x, slender pristine kernel texture, and authentic natural aroma.",
                "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1568283096533-078a24930eb8?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "non-basmati-rice",
                "name": "Non-Basmati White Rice",
                "origin": "Andhra Pradesh & West Bengal",
                "grade": "IR64, Sona Masoori, PR106 (5% / 25% Broken)",
                "packaging": "25–50 kg PP bags / Big Bags",
                "moq": "1 × 20ft FCL (26 MT)",
                "shelfLife": "18 months",
                "certifications": ["APEDA", "FSSAI"],
                "description": "High-purity everyday Indian white and parboiled rice varieties including IR64 and delicate Sona Masoori, custom sorted for broken percentage and moisture control.",
                "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "wheat",
                "name": "Milling Wheat",
                "origin": "Madhya Pradesh & Punjab",
                "grade": "Sharbati / Lokwan / Milling Grade A",
                "packaging": "50 kg PP bags / Bulk containerized liner",
                "moq": "1 × 20ft FCL (25 MT)",
                "shelfLife": "12 months",
                "certifications": ["APEDA", "FSSAI", "Phytosanitary"],
                "description": "Golden hard wheat with high test weight, rich protein (12–14%), strong gluten quality, and minimal foreign matter, ideal for commercial flour and pasta milling.",
                "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "yellow-maize",
                "name": "Yellow Maize (Corn)",
                "origin": "Karnataka, Bihar & Maharashtra",
                "grade": "Feed Grade & Food Grade (Aflatoxin < 20 ppb)",
                "packaging": "50 kg PP bags / Bulk in 20ft container",
                "moq": "1 × 20ft FCL (25 MT)",
                "shelfLife": "12 months",
                "certifications": ["FSSAI", "SGS Certified"],
                "description": "Clean, sun-dried bright yellow maize with high starch and energy content, tested batch-wise for low moisture (< 14%) and guaranteed non-GMO purity.",
                "image": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "millets",
                "name": "Indian Super Millets",
                "origin": "Rajasthan & Karnataka",
                "grade": "Pearl (Bajra), Sorghum (Jowar), Finger (Ragi)",
                "packaging": "25–50 kg vacuum or PP bags",
                "moq": "1 × 20ft FCL (20 MT)",
                "shelfLife": "12 months",
                "certifications": ["APEDA", "Nutri-Cereal Certified"],
                "description": "Ancient gluten-free nutrient-dense grains sourced from rain-fed drylands. Highly rich in dietary fiber, iron, and calcium for global health foods manufacturers.",
                "image": "https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "soybean",
                "name": "Non-GMO Soybean",
                "origin": "Madhya Pradesh & Maharashtra",
                "grade": "Food Grade / 38%+ Protein",
                "packaging": "50 kg PP bags / Jumbo Bags",
                "moq": "1 × 20ft FCL (24 MT)",
                "shelfLife": "12 months",
                "certifications": ["FSSAI", "Non-GMO Project Verified"],
                "description": "Selected clean yellow soybeans with guaranteed non-GMO origin, low split percentage, high oil content (18–20%), and exceptional protein consistency for soymilk, tofu, and food processing.",
                "image": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "groundnut",
                "name": "Indian Groundnut (Peanut)",
                "origin": "Saurashtra, Gujarat",
                "grade": "Bold (40/50, 50/60) & Java (50/60, 60/70)",
                "packaging": "25–50 kg jute / vacuum packing",
                "moq": "1 × 20ft FCL (19 MT)",
                "shelfLife": "12 months",
                "certifications": ["APEDA", "IOPEPC", "FSSAI"],
                "description": "Hand-picked and sorted peanut kernels from Gujarat's Saurashtra belt. Naturally crunchy with sweet nutty flavor, aflatoxin controlled under strict lab testing.",
                "image": "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "sesame-seeds",
                "name": "Natural & Hulled Sesame Seeds",
                "origin": "Gujarat & Rajasthan",
                "grade": "Auto-Sortex 99.95% Purity / White & Natural",
                "packaging": "25–50 kg 4-ply paper or PP bags",
                "moq": "1 × 20ft FCL (19 MT)",
                "shelfLife": "12 months",
                "certifications": ["APEDA", "FSSAI", "ISO 22000"],
                "description": "Mechanically hulled and Sortex-cleaned premium white sesame seeds with over 99.95% purity and uniform pearly color, favored by bakeries, confectioners, and tahini makers worldwide.",
                "image": "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "chickpeas",
                "name": "Kabuli Chickpeas (Garbanzo)",
                "origin": "Madhya Pradesh & Maharashtra",
                "grade": "Dollar / Bold 75/80, 44/46, 42/44 count",
                "packaging": "25–50 kg PP bags / Jute bags",
                "moq": "1 × 20ft FCL (24 MT)",
                "shelfLife": "24 months",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Jumbo sized Kabuli chickpeas featuring creamy uniform color, thin skin, high protein, and quick soaking characteristics. Graded precisely by count per ounce.",
                "image": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "pulses",
                "name": "Indian Pulses & Lentils (Dal)",
                "origin": "Maharashtra & Karnataka",
                "grade": "Toor (Pigeon Pea), Moong (Green Gram), Urad, Masoor",
                "packaging": "25–50 kg PP bags / Custom retail packs",
                "moq": "1 × 20ft FCL (20 MT)",
                "shelfLife": "18 months",
                "certifications": ["FSSAI", "APEDA", "ISO 22000"],
                "description": "Sortex-cleaned polished and unpolished split lentils with vibrant natural color, high plant-protein concentration, and certified low foreign-matter limits.",
                "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "cotton",
                "name": "Raw Cotton Bales",
                "origin": "Gujarat & Maharashtra",
                "grade": "Shankar-6 (28–30 mm Staple Length)",
                "packaging": "Fumigated Cotton Bales (approx 170 kg each)",
                "moq": "1 × 40ft HC FCL (approx 160 bales)",
                "shelfLife": "Indefinite under dry storage",
                "certifications": ["Cotton Corporation of India", "Phytosanitary"],
                "description": "Standard Shankar-6 Indian raw cotton bales with high micronaire value (3.8–4.2), superior tensile strength, low trash content, and pristine bright white luster.",
                "image": "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "sugar",
                "name": "Refined White Cane Sugar",
                "origin": "Maharashtra & Uttar Pradesh",
                "grade": "ICUMSA 45 & ICUMSA 100",
                "packaging": "50 kg PP / Jute bags with inner poly liner",
                "moq": "1 × 20ft FCL (26 MT)",
                "shelfLife": "24 months",
                "certifications": ["FSSAI", "ISO 22000", "Halal"],
                "description": "Sparkling crystal cane sugar processed in modern Indian sugar mills. Low moisture (< 0.04%), 100% free-flowing, and internationally compliant with food grade ICUMSA specifications.",
                "image": "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "jaggery",
                "name": "Natural Cane Jaggery (Gur)",
                "origin": "Kolhapur, Maharashtra",
                "grade": "Chemical-Free Cubes, Blocks & Powder",
                "packaging": "1 kg retail tubs / 10–25 kg master cartons",
                "moq": "1 MT",
                "shelfLife": "12 months",
                "certifications": ["FSSAI", "Organic Certified (NPOP/USDA)"],
                "description": "Authentic artisan unrefined jaggery made strictly from sugarcane juice without synthetic clarifiers or added chemicals. Rich in iron, minerals, and deep caramel flavor notes.",
                "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1600&q=80"
                ]
            }
        ]
    },
    {
        "slug": "fresh-vegetables",
        "name": "Fresh Vegetables",
        "headline": "Cold-Chain Farm Harvest",
        "blurb": "Field-fresh Indian vegetables harvested at peak maturity, sorted in packhouses, pre-cooled, and exported in reefer containers to global wholesale terminals.",
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
        "products": [
            {
                "slug": "red-onion",
                "name": "Nashik Red Onion",
                "origin": "Nashik, Maharashtra",
                "grade": "45–65 mm / 55 mm+ Jumbo",
                "packaging": "5, 10, 25 kg red leno mesh bags",
                "moq": "1 × 40ft Reefer Container (28 MT)",
                "shelfLife": "45–60 days in cold transit",
                "certifications": ["APEDA", "GlobalG.A.P.", "FSSAI"],
                "description": "World-famous pungent red onions from Maharashtra's volcanic soils. Dense multilayered skins, low internal moisture, and renowned durability during oceanic container transit.",
                "image": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "white-onion",
                "name": "Fresh White Onion",
                "origin": "Mahuva & Bhavnagar, Gujarat",
                "grade": "40–60 mm Export Grade A",
                "packaging": "10–25 kg mesh bags / custom cartons",
                "moq": "1 × 40ft Reefer FCL (28 MT)",
                "shelfLife": "45 days",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Crisp white onions with sweet mild pungency and high solid matter content. Ideal for fresh culinary service and dehydration processing plants.",
                "image": "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "potato",
                "name": "Fresh Table Potato",
                "origin": "Agra, Uttar Pradesh & Gujarat",
                "grade": "Chipsona / LR / Kufri Pukhraj (45 mm+)",
                "packaging": "25–50 kg jute / mesh bags",
                "moq": "1 × 40ft Reefer (28 MT)",
                "shelfLife": "90 days at 8–10°C",
                "certifications": ["APEDA", "GlobalG.A.P."],
                "description": "Dirt-brushed or washed firm potatoes with shallow eyes and clean skin. Tailored varieties for fresh retail consumption or high-dry-matter French fry and potato chip slicing.",
                "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "tomato",
                "name": "Vine-Ripened Tomato",
                "origin": "Kolar, Karnataka & Nashik",
                "grade": "Class 1 Breaker / Turning Stage (55–70 mm)",
                "packaging": "6–10 kg corrugated ventilated cartons",
                "moq": "1 × 40ft Reefer (18 MT)",
                "shelfLife": "21 days",
                "certifications": ["APEDA", "GlobalG.A.P."],
                "description": "Firm oval and round tomatoes picked strictly at breaker stage to ensure pristine arrival color and unbruised flesh across global maritime transit routes.",
                "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "garlic",
                "name": "Indian Snow Garlic",
                "origin": "Mandsaur, Madhya Pradesh",
                "grade": "Yamuna Safed / G2 (35–55 mm)",
                "packaging": "10–20 kg mesh bags / 500g net packs",
                "moq": "1 × 20ft Reefer / FCL (14 MT)",
                "shelfLife": "6 months",
                "certifications": ["APEDA", "FSSAI"],
                "description": "White cured garlic bulbs with intense pungency and high allicin content. Thick papery skins prevent peeling or sprouting in container transit.",
                "image": "https://images.unsplash.com/photo-1615477032219-612ec2ac495b?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1615477032219-612ec2ac495b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "ginger",
                "name": "Fresh Washed Ginger",
                "origin": "Wayanad, Kerala & Assam",
                "grade": "Bold Knots (150g–300g per hand)",
                "packaging": "10–13 kg air-ventilated export cartons",
                "moq": "1 × 40ft Reefer (24 MT)",
                "shelfLife": "45 days at 12–14°C",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Plump aromatic ginger rhizomes, pressure-washed and cured to remove excess soil and moisture. Low fibrousness with sharp spicy essential oils.",
                "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1615477032219-612ec2ac495b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "green-chilli",
                "name": "Fresh Green Chilli",
                "origin": "Guntur & Kolhapur",
                "grade": "G4 / Teja Fresh (7–10 cm length)",
                "packaging": "4–5 kg CFB cartons with craft paper lining",
                "moq": "1 MT air freight / 40ft reefer",
                "shelfLife": "21 days",
                "certifications": ["APEDA", "GlobalG.A.P."],
                "description": "Crisp emerald-green chillies with firm stems and clean gloss. Balanced heat value and zero chemical residues under monitored packing conditions.",
                "image": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "okra",
                "name": "Fresh Okra (Lady Finger)",
                "origin": "Gujarat & Maharashtra",
                "grade": "Grade A Tender (7–10 cm slender)",
                "packaging": "5 kg ventilated cartons",
                "moq": "1 MT air / Reefer mixed",
                "shelfLife": "14 days",
                "certifications": ["APEDA", "GlobalG.A.P."],
                "description": "Hand-plucked tender green okra free of fibre with crisp snap test. Packed under rapid cold chain within hours of sunrise harvest.",
                "image": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "brinjal",
                "name": "Fresh Brinjal (Aubergine)",
                "origin": "Pune & Belgaum",
                "grade": "Export Grade (Deep Glossy Purple)",
                "packaging": "6–8 kg CFB export cartons",
                "moq": "1 MT",
                "shelfLife": "18 days at 10°C",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Tender seedless eggplants with lustrous deep purple skin, solid green calyx, and succulent tender flesh, graded by strict weight and dimension uniformity.",
                "image": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "cauliflower",
                "name": "Snow White Cauliflower",
                "origin": "Nashik & Punjab",
                "grade": "Compact Head (700g–1200g)",
                "packaging": "Individual poly sleeve / 8–10 kg cartons",
                "moq": "1 × 40ft Reefer",
                "shelfLife": "25 days at 0–2°C",
                "certifications": ["GlobalG.A.P.", "APEDA"],
                "description": "Firm snow-white curd heads protected with natural green jacket leaves, pre-cooled within 2 hours of field picking to safeguard delicate florets.",
                "image": "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "cabbage",
                "name": "Green Cabbage",
                "origin": "Ooty & Maharashtra",
                "grade": "Dense Round Head (800g–1500g)",
                "packaging": "15–20 kg mesh sacks / cartons",
                "moq": "1 × 40ft Reefer (26 MT)",
                "shelfLife": "40 days",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Solid tight-wrapped heads with crisp waxy leaves and fresh green coloration, harvested with trimmed outer wrapper leaves for maximum shelf integrity.",
                "image": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "carrot",
                "name": "Red & Orange Carrots",
                "origin": "Rajasthan & Haryana",
                "grade": "Washed Red Delhi & Kuroda (15–20 cm)",
                "packaging": "10 kg plastic crates / poly lined cartons",
                "moq": "1 × 40ft Reefer (24 MT)",
                "shelfLife": "30 days at 1–3°C",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Sweet, crunchy hydro-cooled carrots with vibrant ruby red or deep orange interior, thoroughly hydro-washed and dried to eliminate surface moisture.",
                "image": "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "green-peas",
                "name": "Tender Green Peas",
                "origin": "Punjab & Himachal Pradesh",
                "grade": "Sweet Pods (8–10 seeds per pod)",
                "packaging": "5–10 kg ventilated crates",
                "moq": "1 MT",
                "shelfLife": "14 days at 2°C",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Plump hand-selected whole pea pods bursting with sweet tender green peas, packed into cold transit vehicles directly from mountain valley orchards.",
                "image": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "drumstick",
                "name": "Fresh Drumstick (Moringa)",
                "origin": "Tamil Nadu & Gujarat",
                "grade": "PKM-1 Tender Green (45–60 cm)",
                "packaging": "5 kg corrugated export boxes",
                "moq": "1 MT air / Reefer",
                "shelfLife": "18 days",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Tender, pulp-filled moringa drumsticks known globally as a nutrient superfood, hand-harvested straight from certified pesticide-controlled groves.",
                "image": "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=1600&q=80"
                ]
            }
        ]
    },
    {
        "slug": "fresh-fruits",
        "name": "Fresh Fruits",
        "headline": "Sun-Ripened Tropical Orchards",
        "blurb": "GI-tagged premium Indian mangoes, bananas, pomegranates, and table grapes from monitored orchards, packed in modern cold chains.",
        "image": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1600&q=80",
        "products": [
            {
                "slug": "banana",
                "name": "Cavendish Banana",
                "origin": "Jalgaon, Maharashtra & Andhra Pradesh",
                "grade": "Grand Naine (G9) / Grade A (18–22 cm cluster)",
                "packaging": "13 kg telescopic CFB carton with vacuum poly bag",
                "moq": "1 × 40ft Reefer (1540 cartons / 20 MT)",
                "shelfLife": "30 days controlled atmosphere transit",
                "certifications": ["GlobalG.A.P.", "APEDA", "ISO 22000"],
                "description": "Premium G9 Cavendish bananas harvested at mature green stage with calibration between 39–44. Treated with foam pads and ethylene absorbents for precise destination ripening.",
                "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "mango",
                "name": "Alphonso & Kesar Mango",
                "origin": "Ratnagiri & Devgad (Alphonso), Gir (Kesar)",
                "grade": "GI Certified / Hot Water & Vapor Heat Treated",
                "packaging": "2.5–3 kg display cartons (9–12 pieces)",
                "moq": "500 kg air freight / Reefer container",
                "shelfLife": "18–21 days",
                "certifications": ["APEDA", "GI Tagged", "USFDA / EU Phytosanitary"],
                "description": "The undisputed King of Fruits. Unrivaled saffron flesh, intoxicating aroma, and fiberless silk texture with natural sweetness reaching over 20° Brix.",
                "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "pomegranate",
                "name": "Bhagwa Pomegranate",
                "origin": "Solapur & Nashik, Maharashtra",
                "grade": "Ruby Red Arils (200g–400g per fruit)",
                "packaging": "3.5–4 kg cartons (9, 10, 12 count)",
                "moq": "1 × 40ft Reefer (18 MT)",
                "shelfLife": "60 days at 5°C",
                "certifications": ["GlobalG.A.P.", "APEDA"],
                "description": "Renowned Bhagwa variety with deep glossy scarlet skin, soft edible seeds, and sweet, antioxidant-packed dark red juice with no astringency.",
                "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "grapes",
                "name": "Thompson Seedless Grapes",
                "origin": "Nashik, Maharashtra",
                "grade": "Export Grade 18 mm+ Berry Diameter",
                "packaging": "4.5–5 kg cartons / 500g punnets with SO2 sheets",
                "moq": "1 × 40ft Reefer (2400 cartons)",
                "shelfLife": "60 days at -0.5°C",
                "certifications": ["GlobalG.A.P.", "GrapeNet Tracked", "APEDA"],
                "description": "Crisp sweet green table grapes from audited Nashik vineyards. Traceable via India's GrapeNet portal with zero harmful pesticide residue compliance.",
                "image": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "pineapple",
                "name": "Queen & MD2 Pineapple",
                "origin": "Vazhakulam, Kerala & Tripura",
                "grade": "GI Vazhakulam / MD2 Golden (1.2–1.8 kg)",
                "packaging": "12 kg telescopic carton (6–10 count)",
                "moq": "1 × 40ft Reefer (16 MT)",
                "shelfLife": "28 days",
                "certifications": ["APEDA", "GI Tagged"],
                "description": "Fragrant golden pineapples with pleasant balanced acidity, high sugar content (14–16° Brix), crisp core, and stunning natural aroma.",
                "image": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "papaya",
                "name": "Red Lady Papaya",
                "origin": "Andhra Pradesh & Gujarat",
                "grade": "Red Flesh (800g–1500g)",
                "packaging": "6 kg cartons with foam net sleeves",
                "moq": "1 MT air / Reefer",
                "shelfLife": "21 days",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Oblong fruit with radiant salmon-red flesh, smooth sweet buttery texture, and high natural papain enzyme profile.",
                "image": "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "orange",
                "name": "Nagpur Mandarin Orange",
                "origin": "Nagpur, Maharashtra",
                "grade": "GI Certified Export (65–80 mm)",
                "packaging": "10 kg CFB cartons with ventilated partitions",
                "moq": "1 × 40ft Reefer (22 MT)",
                "shelfLife": "35 days",
                "certifications": ["APEDA", "GI Tagged"],
                "description": "Easy-peel loose-skinned sweet citrus renowned across the Middle East and Asia for rich juice yield, thin peel, and mouthwatering tang.",
                "image": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "lemon",
                "name": "Kagzi Seedless Lemon",
                "origin": "Gujarat & Andhra Pradesh",
                "grade": "Export Grade 35–45 mm",
                "packaging": "6–10 kg net bags in master cartons",
                "moq": "1 MT air / Reefer",
                "shelfLife": "40 days",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Paper-thin skin lemons bursting with high citric acid juice, bright lemon fragrance, and smooth spotless golden rind.",
                "image": "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1600&q=80"
                ]
            }
        ]
    },
    {
        "slug": "spices",
        "name": "Spices",
        "headline": "Authentic Whole & Ground Aromatics",
        "blurb": "Pure Indian spices with intense volatile oil content, steam-sterilized, certified by Spices Board of India, and packed in barrier bags.",
        "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
        "products": [
            {
                "slug": "turmeric",
                "name": "Turmeric Finger & Powder",
                "origin": "Salem & Erode, Tamil Nadu",
                "grade": "Curcumin 3.5%–5.5% (Polished Finger & Mesh 80)",
                "packaging": "25 kg PP bags with inner liner / Vacuum packs",
                "moq": "1 MT",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI", "ISO 22000", "USFDA"],
                "description": "Golden Salem and Nizamabad turmeric fingers with high bioactive curcumin concentration, deep saffron-yellow hue, and earthy pungent aroma.",
                "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "red-chilli",
                "name": "Guntur Dried Red Chilli",
                "origin": "Guntur, Andhra Pradesh & Byadgi, Karnataka",
                "grade": "Teja (S17), Byadgi (KDL), Sanam (S4)",
                "packaging": "10–25 kg compressed jute bales / cartons",
                "moq": "1 × 40ft HC FCL (14 MT) / 1 MT LCL",
                "shelfLife": "12 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "World-famous Guntur Teja chillies offering intense heat (SHU 60,000–85,000) alongside wrinkle-skinned Byadgi chillies celebrated for deep red natural ASTA color value.",
                "image": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "black-pepper",
                "name": "Malabar Black Pepper",
                "origin": "Tellicherry & Idukki, Kerala",
                "grade": "TGSEB (Tellicherry Garbled) 550–600 G/L",
                "packaging": "25 kg multiply paper bags / vacuum pouches",
                "moq": "1 MT",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "ISO 22000", "Steam Sterilized"],
                "description": "The Black Gold of the Malabar Coast. Sun-ripened bold peppercorns machine-graded for bulk density, high piperine percentage, and complex woody pungency.",
                "image": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "cumin",
                "name": "Cumin Seeds (Jeera)",
                "origin": "Unjha, Gujarat & Rajasthan",
                "grade": "Sortex Cleaned 99.5% / European Quality",
                "packaging": "25–50 kg PP bags / paper sacks",
                "moq": "1 MT",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Distinctive aromatic cumin seeds harvested from the arid fields of Unjha. Low moisture, volatile oil > 3%, and zero foreign seed contamination.",
                "image": "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "coriander",
                "name": "Coriander Seeds (Dhania)",
                "origin": "Ramganj Mandi, Rajasthan & MP",
                "grade": "Eagle / Scooter / Badami (Whole & Powder)",
                "packaging": "25–40 kg jute bags / paper bags",
                "moq": "1 MT",
                "shelfLife": "18 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Uniform spherical coriander seeds with delicate sweet citrus aroma and high essential oil content, cleaned on multi-deck sieves.",
                "image": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "cardamom",
                "name": "Green Cardamom (Elaichi)",
                "origin": "Idukki Hills, Kerala",
                "grade": "Alleppey Green Extra Bold (7.5–8.5 mm)",
                "packaging": "5–10 kg vacuum cartons with food-grade inner poly",
                "moq": "250 kg",
                "shelfLife": "18 months",
                "certifications": ["Spices Board", "GI Tagged"],
                "description": "Queen of Spices. Hand-picked bold cardamom pods with deep emerald green hue, full seed count, and intensely floral, camphoraceous aroma.",
                "image": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "cloves",
                "name": "Whole Dried Cloves (Laung)",
                "origin": "Kanyakumari & Kerala",
                "grade": "Hand-Picked Bold (No Stems, No Headless)",
                "packaging": "10–25 kg cartons with moisture barrier",
                "moq": "500 kg",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Dark reddish-brown unopened flower buds bursting with eugenol essential oil. Highly prized for intense warmth and culinary sweetness.",
                "image": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "cinnamon",
                "name": "Cinnamon & Cassia Quills",
                "origin": "Kerala & Meghalaya",
                "grade": "C5 Special / Cassia Splits & Rolls",
                "packaging": "10–25 kg master export cartons",
                "moq": "500 kg",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Carefully scraped inner tree bark rolled into tight aromatic quills. Sweet woody flavor notes with high cinnamaldehyde content.",
                "image": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "fenugreek",
                "name": "Fenugreek Seeds (Methi)",
                "origin": "Rajasthan & MP",
                "grade": "Bold Machine Cleaned (99% Purity)",
                "packaging": "25–50 kg PP bags",
                "moq": "1 MT",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Rhomboid golden-yellow seeds carrying a bittersweet maple aroma. Rich in soluble fiber, widely used in curry blends and herbal nutraceuticals.",
                "image": "https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "fennel",
                "name": "Fennel Seeds (Saunf)",
                "origin": "Gujarat & Rajasthan",
                "grade": "Lucknowi Green Medium / Sortex",
                "packaging": "25–50 kg PP bags",
                "moq": "1 MT",
                "shelfLife": "18 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Vibrant light-green fennel seeds with pleasant sweet licorice notes and digestive anethole oils. Machine cleaned without artificial polishing.",
                "image": "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1607672632458-9eb56696346b?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "mustard-seeds",
                "name": "Indian Mustard Seeds (Rai)",
                "origin": "Rajasthan & Haryana",
                "grade": "Small Black / Bold Brown / Yellow",
                "packaging": "25–50 kg PP bags",
                "moq": "1 MT",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Small spherical seeds delivering pungent sharpness when crushed or popped in hot oil. Graded for oil yield and pure seed purity.",
                "image": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "star-anise",
                "name": "Whole Star Anise (Chakra Phool)",
                "origin": "Arunachal Pradesh & Kerala",
                "grade": "Autumn Crop 8-Point Whole (Zero Broken)",
                "packaging": "10 kg export cartons with poly lining",
                "moq": "500 kg",
                "shelfLife": "24 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "Star-shaped dried seed pods with sweet star-anethole aroma. Carefully sorted so each star arrives intact and glossy.",
                "image": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "bay-leaf",
                "name": "Indian Bay Leaf (Tejpatta)",
                "origin": "Meghalaya & Uttarakhand",
                "grade": "Whole Green Dried Leaves (Cinnamomum Tamala)",
                "packaging": "10–25 kg compressed bales",
                "moq": "500 kg",
                "shelfLife": "18 months",
                "certifications": ["Spices Board", "FSSAI"],
                "description": "True Indian tejpatta leaves characterized by three parallel veins running the length of the leaf. Sweet clove-cinnamon fragrance distinctly unlike European bay laurel.",
                "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "garam-masala",
                "name": "Royal Garam Masala Blend",
                "origin": "Mumbai Processing Unit",
                "grade": "16-Whole Spice Artisan Roasting (Custom Mesh)",
                "packaging": "1–25 kg foil zipper pouches / food buckets",
                "moq": "500 kg",
                "shelfLife": "18 months",
                "certifications": ["Spices Board", "FSSAI", "ISO 22000"],
                "description": "Proprietary warm spice formulation roasted under controlled temperatures and slow ground. Contains no fillers, salt, or artificial colors.",
                "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1600&q=80"
                ]
            }
        ]
    },
    {
        "slug": "natural-stones",
        "name": "Natural Stones & Tiles",
        "headline": "Rajasthan Quarries & Morbi Ceramics",
        "blurb": "Architectural marble, granite, quartzite, and certified vitrified porcelain tiles cut to precision millimetric tolerances and crated in fumigated wood.",
        "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
        "products": [
            {
                "slug": "marble-tiles",
                "name": "Indian Marble Tiles & Slabs",
                "origin": "Makrana & Rajsamand, Rajasthan",
                "grade": "Makrana White, Statuario, Indian Green (Verde)",
                "packaging": "Heavy-duty fumigated wooden crates with foam cushioning",
                "moq": "1 × 20ft FCL (450–550 m²)",
                "shelfLife": "Indefinite",
                "certifications": ["ISO 9001", "CE Certified", "ASTM Tested"],
                "description": "Historic Indian calcite marble quarried in Rajasthan. 98% calcium purity, mirror polished or honed finish with high tensile strength and elegant dark veining.",
                "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "granite-slabs",
                "name": "Polished Granite Slabs",
                "origin": "Karnataka, Telangana & Andhra Pradesh",
                "grade": "Black Galaxy, Tan Brown, Kashmir White (20 & 30 mm)",
                "packaging": "Fumigated wooden A-frames & bundles",
                "moq": "1 × 20ft FCL (approx 400 m² of 20mm)",
                "shelfLife": "Indefinite",
                "certifications": ["ISO 9001", "CE Marking"],
                "description": "Dense igneous granite with mirror polish, flamed, or leathered surface options. Highly resistant to freeze-thaw cycles, abrasions, and chemical staining.",
                "image": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "sandstone",
                "name": "Teakwood & Rainbow Sandstone",
                "origin": "Dholpur & Jodhpur, Rajasthan",
                "grade": "Honed, Sawn, Natural Cleft (20–50 mm)",
                "packaging": "Wooden crates with edge strapping",
                "moq": "1 × 20ft FCL (500 m²)",
                "shelfLife": "Indefinite",
                "certifications": ["ISO 9001", "CE Certified"],
                "description": "Natural architectural sandstone showcasing organic woodgrain textures and pastel banding. Slip resistant and frost tolerant for luxury exterior paving and facade cladding.",
                "image": "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "limestone",
                "name": "Kota Stone (Blue & Brown Limestone)",
                "origin": "Kota, Rajasthan",
                "grade": "Natural Split, Polished, Cobbled (22–30 mm)",
                "packaging": "Wooden pallets / crates",
                "moq": "1 × 20ft FCL (550 m²)",
                "shelfLife": "Indefinite",
                "certifications": ["ISO 9001"],
                "description": "Tough fine-grained limestone in iconic greenish-blue and warm honey-brown shades. Extremely non-porous and rugged for commercial pathways and corridors.",
                "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "slate",
                "name": "Indian Multi-Color Slate",
                "origin": "Kund, Haryana & Himachal Pradesh",
                "grade": "Natural 3D Cleft Tiles (10–15 mm)",
                "packaging": "Corrugated boxes in wooden crates",
                "moq": "1 × 20ft FCL (600 m²)",
                "shelfLife": "Indefinite",
                "certifications": ["ISO 9001", "CE"],
                "description": "Richly textured slate tiles with natural rustic cleavage. Rust, copper, charcoal, and emerald nuances that create dramatic architectural accent walls and roofing.",
                "image": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "quartzite",
                "name": "Golden Quartzite Flagstone",
                "origin": "Deoli, Rajasthan",
                "grade": "Hard Metamorphic Quartzite (12–25 mm)",
                "packaging": "Wooden crates with plastic wrap",
                "moq": "1 × 20ft FCL (500 m²)",
                "shelfLife": "Indefinite",
                "certifications": ["ISO 9001"],
                "description": "Sparkling metamorphic quartzite containing tiny mica crystals. Exceptional silica hardness (Mohs 7) making it virtually indestructible against weathering and pool chemicals.",
                "image": "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "ceramic-tiles",
                "name": "Glazed Ceramic Wall Tiles",
                "origin": "Morbi, Gujarat",
                "grade": "First Choice Premium (300×450, 300×600 mm)",
                "packaging": "Printed export cartons on shrink-wrapped pallets",
                "moq": "1 × 20ft FCL (2000 m²)",
                "shelfLife": "Indefinite",
                "certifications": ["ISO 13006", "CE Mark", "EN 14411"],
                "description": "High-definition digital printed ceramic wall tiles manufactured in India's tile capital, Morbi. Lustrous glossy or satin-matte finishes with zero water absorbency defects.",
                "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "vitrified-tiles",
                "name": "Double Charge Vitrified Tiles",
                "origin": "Morbi, Gujarat",
                "grade": "Nano Polished 600×600 mm, 800×800 mm",
                "packaging": "Euro standard wooden pallets with corner guards",
                "moq": "1 × 20ft FCL (1400 m²)",
                "shelfLife": "Indefinite",
                "certifications": ["ISO 9001", "CE", "Green Building Certified"],
                "description": "Heavy-traffic double charge tiles with a 3–4mm dense top layer of colored porcelain granule mix. Nano polished surface gives diamond-like gloss with anti-stain resistance.",
                "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "porcelain-tiles",
                "name": "Large Format Porcelain Slabs",
                "origin": "Morbi, Gujarat",
                "grade": "GVT / PGVT 800×1600 mm & 1200×2400 mm (9 mm & 15 mm)",
                "packaging": "Steel reinforced wooden cases",
                "moq": "1 × 20ft FCL (1100 m²)",
                "shelfLife": "Indefinite",
                "certifications": ["ISO 13006", "CE", "ASTM C373"],
                "description": "Ultra-large architectural porcelain slabs faithfully reproducing Italian marble, onyx, and raw concrete. Water absorption < 0.05% with rectifying laser precision.",
                "image": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "cobblestones",
                "name": "Hand-Cut Granite Cobblestones",
                "origin": "Jhansi, Uttar Pradesh & Bangalore",
                "grade": "Hand-Cut / Tumbled / Flamed (10×10×10 cm, 10×10×5 cm)",
                "packaging": "1 MT heavy-duty wooden boxes / Jumbo bags",
                "moq": "1 × 20ft FCL (26 MT)",
                "shelfLife": "Indefinite",
                "certifications": ["ISO 9001", "CE"],
                "description": "Traditional robust granite paving cubes for historical town squares, private driveways, and European street scapes. Non-slip natural split edges.",
                "image": "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "gravel",
                "name": "River Gravel & Polished Pebbles",
                "origin": "Narmada River & Gujarat",
                "grade": "Tumbled & Washed (10–25 mm, 25–50 mm, Snow White / Black)",
                "packaging": "25 kg poly bags inside 1 MT bulk bags",
                "moq": "1 × 20ft FCL (25 MT)",
                "shelfLife": "Indefinite",
                "certifications": ["ISO 9001"],
                "description": "Smooth rounded river pebbles in natural black, white, and red tones, washed free of sand and graded for luxury landscape architecture, water bodies, and terrariums.",
                "image": "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80"
                ]
            }
        ]
    },
    {
        "slug": "dry-fruits",
        "name": "Dry Fruits & Nuts",
        "headline": "Premium Hand-Sorted Kernels",
        "blurb": "Whole white Indian cashews, Kashmiri walnuts, California almonds, and sun-cured raisins nitrogen-flushed to preserve crunchy freshness.",
        "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
        "products": [
            {
                "slug": "cashew-nuts",
                "name": "Indian Cashew Kernels",
                "origin": "Goa, Mangalore & Kollam, Kerala",
                "grade": "W180 (King Size), W210, W240, W320 White Wholes",
                "packaging": "11.34 kg (25 lb) vacuum tins or flexible foil bags (2 tins/carton)",
                "moq": "1 MT",
                "shelfLife": "24 months",
                "certifications": ["CEPC", "FSSAI", "ISO 22000", "HACCP"],
                "description": "Internationally celebrated whole white cashews with uniform pale ivory color, sweet buttery crunch, and zero scorch marks. Graded precisely to CEPC standards.",
                "image": "https://images.unsplash.com/photo-1536591375315-1b836814d45d?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1536591375315-1b836814d45d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "almonds",
                "name": "Premium Graded Almonds",
                "origin": "Processed & Packed in India",
                "grade": "Nonpareil / Mamra / California Select (23/25, 27/30)",
                "packaging": "10–25 kg nitrogen flushed cartons",
                "moq": "1 MT",
                "shelfLife": "18 months",
                "certifications": ["FSSAI", "ISO 22000"],
                "description": "Sweet, uniform almond kernels sorted with optical cameras. Rich in Vitamin E and beneficial plant oils with clean smooth skins.",
                "image": "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1536591375315-1b836814d45d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "walnuts",
                "name": "Kashmiri Snow White Walnuts",
                "origin": "Anantnag & Shopian, Kashmir",
                "grade": "Extra Light Halves / Light Quarters (Organic)",
                "packaging": "5–10 kg vacuum bags in corrugated master cartons",
                "moq": "500 kg",
                "shelfLife": "12 months at cool temp",
                "certifications": ["FSSAI", "APEDA", "Organic Certified"],
                "description": "Rare wild-harvested Kashmiri walnuts. Naturally pale cream halves rich in Omega-3 fatty acids, devoid of chemical bleaching agents.",
                "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1536591375315-1b836814d45d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "pistachios",
                "name": "Roasted & Salted Pistachios",
                "origin": "Processed & Packed in India",
                "grade": "Naturally In-Shell Open (28/30, 30/32 count)",
                "packaging": "10 kg vacuum cartons / Retail pouches",
                "moq": "1 MT",
                "shelfLife": "12 months",
                "certifications": ["FSSAI", "ISO 22000"],
                "description": "Round smiling pistachios with vivid purple-green kernels, light sea salt seasoning, and satisfying crunchy snap.",
                "image": "https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1536591375315-1b836814d45d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "raisins",
                "name": "Golden & Green Raisins",
                "origin": "Sangli & Nashik, Maharashtra",
                "grade": "Long Green / Golden Yellow Grade AAA",
                "packaging": "10–15 kg telescopic export cartons with food grade liner",
                "moq": "1 MT",
                "shelfLife": "18 months",
                "certifications": ["APEDA", "FSSAI"],
                "description": "Naturally shade-dried elongated raisins from Indian Thompson seedless vines. Succulent plump chew, sweet natural sugars, and zero grit.",
                "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1536591375315-1b836814d45d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "dates",
                "name": "Fresh & Semi-Dry Dates (Khajoor)",
                "origin": "Kutch, Gujarat",
                "grade": "Barhi (Fresh Yellow) & Black Medjool Grade A",
                "packaging": "5–10 kg cartons / 500g vacuum sealed packs",
                "moq": "1 MT",
                "shelfLife": "12 months",
                "certifications": ["FSSAI", "APEDA"],
                "description": "Succulent dates harvested in coastal arid Gujarat. Naturally sweet, soft caramel flesh rich in dietary fiber, potassium, and minerals.",
                "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1536591375315-1b836814d45d?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "figs",
                "name": "Dried Anjeer (Figs)",
                "origin": "Purandar, Maharashtra & Gujarat",
                "grade": "Jumbo Garland String / Grade A Natural",
                "packaging": "5–10 kg wooden / paper boxes with garland rings",
                "moq": "500 kg",
                "shelfLife": "12 months",
                "certifications": ["FSSAI", "APEDA"],
                "description": "Round dried whole figs with tiny sweet crunchy seeds and honey-colored interior. Hand strung on cotton cords in traditional export garlands.",
                "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1536591375315-1b836814d45d?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "apricots",
                "name": "Sun-Dried Sweet Apricots",
                "origin": "Ladakh & Kashmir",
                "grade": "Raktsey Karpo (White Seed) & Orange Pitted",
                "packaging": "5–10 kg cartons",
                "moq": "500 kg",
                "shelfLife": "12 months",
                "certifications": ["GI Tagged", "Organic Certified"],
                "description": "Famous Himalayan apricots dried under high-altitude sunshine. Unmatched natural sweetness with edible sweet kernels inside.",
                "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "peanuts-bold",
                "name": "Blanched & Roasted Peanuts",
                "origin": "Gujarat",
                "grade": "Bold 38/42, 40/50, Java 50/60",
                "packaging": "25 kg vacuum bags / Big Bags",
                "moq": "1 × 20ft FCL (19 MT)",
                "shelfLife": "12 months",
                "certifications": ["IOPEPC", "FSSAI", "BRCGS"],
                "description": "Skin-blanched whole and split peanut kernels sorted with laser sorters. Ready for peanut butter production, chocolate confections, and snack roasting.",
                "image": "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "makhana",
                "name": "Royal Fox Nut (Phool Makhana)",
                "origin": "Mithila, Bihar",
                "grade": "5+ Suta & 6 Suta Super Jumbo (18–24 mm)",
                "packaging": "8–10 kg compressed PP bags / custom retail nitrogen pouches",
                "moq": "500 kg",
                "shelfLife": "12 months",
                "certifications": ["GI Tagged", "FSSAI", "Organic Certified"],
                "description": "GI-tagged popped lotus water-lily seeds. Pure snow-white puffs loaded with plant protein, magnesium, and zero cholesterol, prized in the global healthy snacking revolution.",
                "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1536591375315-1b836814d45d?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=1600&q=80"
                ]
            }
        ]
    },
    {
        "slug": "processed-food",
        "name": "Processed Food & Others",
        "headline": "Plantations, Oils & Industrial Exports",
        "blurb": "Certified Assam and Darjeeling teas, South Indian coffees, virgin cold-pressed oils, organic coco peat, and precision PVC infrastructure supplies.",
        "image": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=80",
        "products": [
            {
                "slug": "tea",
                "name": "Assam & Darjeeling Export Tea",
                "origin": "Assam & Darjeeling, West Bengal",
                "grade": "FTGFOP1 First Flush / Assam Orthodox & CTC BP",
                "packaging": "25–50 kg multiwall paper sacks with aluminum foil lining",
                "moq": "1 MT",
                "shelfLife": "24 months",
                "certifications": ["Tea Board of India", "Rainforest Alliance", "FSSAI"],
                "description": "Malty rich Assam whole-leaf orthodox teas alongside the champagne of teas: delicate muscatel-noted Darjeeling first flush harvests from high-elevation Himalayan estates.",
                "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "coffee",
                "name": "Indian Plantation Coffee Beans",
                "origin": "Coorg & Chikmagalur, Karnataka",
                "grade": "Arabica Plantation AA / Robusta Kaapi Royale",
                "packaging": "60 kg GrainPro hermetic bags in jute sacks",
                "moq": "1 × 20ft FCL (19.2 MT)",
                "shelfLife": "18 months",
                "certifications": ["Coffee Board of India", "UTZ Certified"],
                "description": "Shade-grown single-origin green coffee beans grown under rainforest canopies alongside cardamom and pepper. Low acidity with notes of dark cocoa and spice.",
                "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "coconut",
                "name": "Desiccated Coconut & Copra",
                "origin": "Pollachi, Tamil Nadu & Kerala",
                "grade": "Fine & Medium Grade (High Fat 65%+)",
                "packaging": "25–50 kg kraft paper bags with inner polyethylene liner",
                "moq": "1 × 20ft FCL (14 MT)",
                "shelfLife": "12 months",
                "certifications": ["Coconut Development Board", "FSSAI", "ISO 22000"],
                "description": "Pure white dried shredded coconut kernel without sulfur dioxide bleaching. High natural virgin lauric oil content for fine confectionery, chocolate bars, and bakeries.",
                "image": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "edible-oils",
                "name": "Cold-Pressed Edible Oils",
                "origin": "Gujarat, Rajasthan & Kerala",
                "grade": "Extra Virgin Wood-Pressed (Mustard, Peanut, Sesame, Coconut)",
                "packaging": "1, 5, 15 Litre food cans / 200L drums / Flexitank (21 MT)",
                "moq": "1 MT / Flexitank",
                "shelfLife": "12 months",
                "certifications": ["FSSAI", "AGMARK Certified", "ISO 22000"],
                "description": "Cold-pressed wood churned (Kachi Ghani) pure oils extracted without solvent extraction or excessive heating, retaining all natural micro-nutrients and rich aroma.",
                "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "pickles-sauces",
                "name": "Traditional Indian Pickles & Chutneys",
                "origin": "Gujarat & Maharashtra",
                "grade": "Mango, Lime, Mixed, Garlic, Chilli (Export Recipe)",
                "packaging": "300g–1 kg glass jars / 5–20 kg food service pails",
                "moq": "1 MT",
                "shelfLife": "24 months",
                "certifications": ["FSSAI", "USFDA Registered", "BRCGS"],
                "description": "Slow-cured traditional Indian relishes prepared with sun-cured spices and cold-pressed mustard or sesame oil, crafted without synthetic coloring.",
                "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "coir-products",
                "name": "Coco Peat & Coir Fiber",
                "origin": "Pollachi, Tamil Nadu & Kerala",
                "grade": "Low EC (< 0.5 mS/cm) 5 kg Compressed Blocks / Geo-textiles",
                "packaging": "Palletized shrink-wrapped blocks / Jumbo bales",
                "moq": "1 × 40ft HC FCL (approx 26 MT)",
                "shelfLife": "Indefinite under dry storage",
                "certifications": ["Coir Board of India", "OMRI Listed for Organic Use"],
                "description": "Washed, desalted coco peat growing medium for commercial horticulture and greenhouses. Expands to over 75 Litres per 5 kg block with exceptional moisture aeration.",
                "image": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1600&q=80"
                ]
            },
            {
                "slug": "polymers-pvc",
                "name": "Export Grade PVC Pipes & Fittings",
                "origin": "Ahmedabad & Daman",
                "grade": "Schedule 40/80, ASTM D1785 / ISO 1452 Pressure Pipes",
                "packaging": "Bundled with protective strapping / boxed fittings",
                "moq": "1 × 20ft FCL (10 MT)",
                "shelfLife": "Indefinite",
                "certifications": ["BIS / ISI Mark", "ISO 9001", "WRAS Approved"],
                "description": "Rigid unplasticized uPVC and CPVC plumbing pipes and precision compression fittings. UV resistant, lead-free formulation certified for international potable water infrastructure.",
                "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=80",
                    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1600&q=80"
                ]
            }
        ]
    }
]

ts_code = """// Auto-generated full product catalog for Aurelian International
// 7 Categories, 77 Unique Export Products with Dedicated High-Resolution Images

export type Product = {
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
};

export type Category = {
  slug: string;
  name: string;
  headline: string;
  blurb: string;
  image: string;
  products: Product[];
};

export const categories: Category[] = """ + json.dumps(catalog, indent=2) + """;

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProduct = (cat: string, slug: string) => getCategory(cat)?.products.find((x) => x.slug === slug);
export const allProducts = categories.flatMap((c) =>
  c.products.map((pr) => ({ ...pr, category: c }))
);
"""

with open(r"c:\Users\ASUS\Desktop\3d animated website\Aurelian inport exptort\pixel-perfect-replica\src\data\products.ts", "w", encoding="utf-8") as f:
    f.write(ts_code)

print("Catalog built successfully! Categories:", len(catalog), "Total products:", sum(len(c["products"]) for c in catalog))
