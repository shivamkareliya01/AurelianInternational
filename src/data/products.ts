// 6 Categories, 41 Approved Export Products with Standardized Spec Architecture

export type ProductSpecs = {
  origin?: string | undefined;
  gradeVariety?: string | undefined;
  size?: string | undefined;
  exportPackaging?: string | undefined;
  moq?: string | undefined;
  shelfLife?: string | undefined;
  certifications?: string[] | undefined;
};

export type Product = {
  slug: string;
  name: string;
  image: string;
  shortDescription: string;
  specs: ProductSpecs;
  origin: string;
  grade: string;
  size?: string | undefined;
  packaging: string;
  moq: string;
  shelfLife: string;
  certifications: string[];
  description: string;
  gallery: string[];
  alt: string;
  catalogueId?: string | undefined;
};

export type Category = {
  slug: string;
  name: string;
  headline: string;
  blurb: string;
  image: string;
  products: Product[];
};

export const categories: Category[] = [
  {
    "slug": "agriculture",
    "name": "Agriculture",
    "headline": "Grains, Pulses & Oilseeds",
    "blurb": "Grains, pulses and oilseeds from India's most fertile belts, machine-cleaned, optical-sorted and packaged to stringent international trade standards.",
    "image": "/products/category-agriculture.webp",
    "products": [
      {
        "slug": "1121-basmati-rice",
        "name": "1121 Basmati Rice",
        "image": "/products/1121-basmati-rice.webp",
        "shortDescription": "Extra-long grain aromatic basmati rice prized for elongation ratio exceeding 2.5x upon cooking, pristine pearl-white kernels, and sweet natural fragrance.",
        "specs": {
          "origin": "Punjab & Haryana",
          "gradeVariety": "1121 Steam / Raw / Sella (8.35mm+ Average Grain Length)",
          "exportPackaging": "5–40 kg Jute / Non-Woven PP bags",
          "moq": "1 × 20ft FCL (25 MT)",
          "shelfLife": "24 months",
          "certifications": [
            "APEDA",
            "ISO 22000",
            "FSSAI",
            "BRCGS"
          ]
        }
      },
      {
        "slug": "1509-basmati-rice",
        "name": "1509 Basmati Rice",
        "image": "/products/1509-basmati-rice.webp",
        "shortDescription": "High-yielding premium long grain basmati with remarkable elongation, smooth finish, and fast cooking time, favored across Middle Eastern and European food service.",
        "specs": {
          "origin": "Punjab & Western Uttar Pradesh",
          "gradeVariety": "1509 Golden / White Sella (8.40mm+ Grain Length)",
          "exportPackaging": "10–50 kg BOPP / PP Bags",
          "moq": "1 × 20ft FCL (25 MT)",
          "shelfLife": "24 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "ISO 22000"
          ]
        }
      },
      {
        "slug": "sella-basmati-rice",
        "name": "Sella Basmati Rice",
        "image": "/products/sella-basmati-rice.webp",
        "shortDescription": "Hydrothermally processed parboiled basmati with hard kernels that resist breakage, lock in essential nutrients, and cook into separate non-sticky grains.",
        "specs": {
          "origin": "Punjab & Haryana",
          "gradeVariety": "Golden & Creamy Parboiled Basmati Rice",
          "exportPackaging": "25–50 kg Jute & Polypropylene Sacks",
          "moq": "1 × 20ft FCL (25 MT)",
          "shelfLife": "24 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "HACCP"
          ]
        }
      },
      {
        "slug": "non-basmati-white-rice-ir64",
        "name": "Non-Basmati White Rice (IR64)",
        "image": "/products/non-basmati-white-rice-ir64.webp",
        "shortDescription": "Long grain Indian non-basmati rice celebrated for consistent culinary texture, high caloric value, and rigorous sorting for broken percentage control.",
        "specs": {
          "origin": "Andhra Pradesh & West Bengal",
          "gradeVariety": "IR64 Raw & Parboiled (5% / 25% Broken)",
          "exportPackaging": "25–50 kg PP bags / Big Bags",
          "moq": "1 × 20ft FCL (26 MT)",
          "shelfLife": "18 months",
          "certifications": [
            "APEDA",
            "FSSAI"
          ]
        }
      },
      {
        "slug": "sona-masoori-rice",
        "name": "Sona Masoori Rice",
        "image": "/products/sona-masoori-rice.webp",
        "shortDescription": "Lightweight, low-starch aromatic medium-grain rice cultivated in the fertile Tungabhadra basin, easy to digest and ideal for daily dietary consumption.",
        "specs": {
          "origin": "Andhra Pradesh & Karnataka",
          "gradeVariety": "Medium Grain Raw Aromatic (Aged 12+ Months)",
          "exportPackaging": "10–25 kg Poly Woven Bags",
          "moq": "1 × 20ft FCL (25 MT)",
          "shelfLife": "24 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "ISO 9001"
          ]
        }
      },
      {
        "slug": "milling-wheat",
        "name": "Milling Wheat",
        "image": "/products/milling-wheat.webp",
        "shortDescription": "Golden hard milling wheat with superior gluten strength, high hectoliter weight, and minimal dockage, engineered for premier bakery and semolina production.",
        "specs": {
          "origin": "Madhya Pradesh & Punjab",
          "gradeVariety": "Hard Golden Wheat (Protein 12–14%, Moisture < 12%)",
          "exportPackaging": "50 kg PP bags / Bulk containerized liner",
          "moq": "1 × 20ft FCL (25 MT)",
          "shelfLife": "12 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "Phytosanitary"
          ]
        }
      },
      {
        "slug": "yellow-maize",
        "name": "Yellow Maize",
        "image": "/products/yellow-maize.webp",
        "shortDescription": "Sun-dried bright yellow corn kernels free from live weevils or mold, providing exceptional energy density for poultry feed formulation and industrial starch processing.",
        "specs": {
          "origin": "Bihar, Karnataka & Maharashtra",
          "gradeVariety": "Food & Feed Grade (Aflatoxin < 20 ppb, Moisture < 14%)",
          "exportPackaging": "50 kg PP bags / Bulk in 20ft containers",
          "moq": "1 × 20ft FCL (24 MT)",
          "shelfLife": "12 months",
          "certifications": [
            "APEDA",
            "Non-GMO",
            "FSSAI"
          ]
        }
      },
      {
        "slug": "bajra-pearl-millet",
        "name": "Bajra (Pearl Millet)",
        "image": "/products/bajra-pearl-millet.webp",
        "shortDescription": "Nutrient-rich ancient cereal with high dietary iron, magnesium, and resistant starch, sourced from drought-resistant western Indian agrarian belts.",
        "specs": {
          "origin": "Rajasthan & Gujarat",
          "gradeVariety": "Machine Cleaned Bold Grey Grains (Purity 99%)",
          "exportPackaging": "25–50 kg PP Woven Bags",
          "moq": "1 × 20ft FCL (22 MT)",
          "shelfLife": "12 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "Organic Available"
          ]
        }
      },
      {
        "slug": "soybean",
        "name": "Soybean",
        "image": "/products/soybean.webp",
        "shortDescription": "Selected clean yellow soybeans with verified non-GMO provenance, low splits, and uniform size for soymilk, tofu, and high-protein nutrition products.",
        "specs": {
          "origin": "Madhya Pradesh & Maharashtra",
          "gradeVariety": "Non-GMO Yellow Food Grade (Protein 38%+, Oil 18%)",
          "exportPackaging": "50 kg PP bags / Jumbo Bags",
          "moq": "1 × 20ft FCL (24 MT)",
          "shelfLife": "12 months",
          "certifications": [
            "FSSAI",
            "Non-GMO Certified"
          ]
        }
      },
      {
        "slug": "groundnut-peanut-kernels",
        "name": "Groundnut (Peanut Kernels)",
        "image": "/products/groundnut-peanut-kernels.webp",
        "shortDescription": "Hulled peanut kernels carefully sorted for uniform size, rich nutty sweetness, high oil content, and stringent European aflatoxin limits (< 4 ppb).",
        "specs": {
          "origin": "Saurashtra, Gujarat",
          "gradeVariety": "Bold (40/50, 50/60) & Java (60/70, 70/80)",
          "exportPackaging": "25–50 kg Jute bags / Vacuum packed cartons",
          "moq": "1 × 20ft FCL (19 MT)",
          "shelfLife": "12 months",
          "certifications": [
            "APEDA",
            "IOPEPC",
            "FSSAI",
            "SGS Tested"
          ]
        }
      },
      {
        "slug": "sesame-seeds",
        "name": "Sesame Seeds",
        "image": "/products/sesame-seeds.webp",
        "shortDescription": "Premium sortex-cleaned white sesame seeds boasting rich aroma, minimum 48% oil content, and flawless uniform white color for tahini, bakery and confectionery.",
        "specs": {
          "origin": "Gujarat & Rajasthan",
          "gradeVariety": "Natural White 99/1 & Auto Hulled 99.95% Purity",
          "exportPackaging": "25–50 kg Multiwall Paper / PP Bags",
          "moq": "1 × 20ft FCL (19 MT)",
          "shelfLife": "12 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "Kosher",
            "Halal"
          ]
        }
      },
      {
        "slug": "kabuli-chickpeas",
        "name": "Kabuli Chickpeas",
        "image": "/products/kabuli-chickpeas.webp",
        "shortDescription": "Large-caliber cream-colored garbanzo beans machine cleaned and gravity separated for canning, salad packaging, and authentic hummus manufacturing.",
        "specs": {
          "origin": "Madhya Pradesh & Maharashtra",
          "gradeVariety": "Bold 42-44, 44-46 & 75-80 Count / Ounce",
          "exportPackaging": "25–50 kg PP Bags / Poly Bags",
          "moq": "1 × 20ft FCL (24 MT)",
          "shelfLife": "24 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "Phytosanitary"
          ]
        }
      },
      {
        "slug": "toor-dal",
        "name": "Toor Dal (Pigeon Pea)",
        "image": "/products/toor-dal.webp",
        "shortDescription": "Dehusked split yellow pigeon peas processed without chemical polish or artificial colors, delivering high protein and creamy texture to culinary applications.",
        "specs": {
          "origin": "Maharashtra & Karnataka",
          "gradeVariety": "Fatka Unpolished / Machine Cleaned Split",
          "exportPackaging": "25–50 kg Brand Printed PP Bags",
          "moq": "1 × 20ft FCL (24 MT)",
          "shelfLife": "18 months",
          "certifications": [
            "FSSAI",
            "APEDA",
            "AGMARK"
          ]
        }
      },
      {
        "slug": "moong-dal",
        "name": "Moong Dal (Green Gram)",
        "image": "/products/moong-dal.webp",
        "shortDescription": "Easily digestible premium green gram and bright yellow split lentils, laser sorted for uniform kernel size, zero stones, and maximum nutritional retention.",
        "specs": {
          "origin": "Rajasthan & Gujarat",
          "gradeVariety": "Yellow Split & Bold Green Whole Moong",
          "exportPackaging": "25–50 kg PP Bags",
          "moq": "1 × 20ft FCL (24 MT)",
          "shelfLife": "18 months",
          "certifications": [
            "FSSAI",
            "APEDA",
            "ISO 22000"
          ]
        }
      },
      {
        "slug": "masoor-dal",
        "name": "Masoor Dal (Red Lentil)",
        "image": "/products/masoor-dal.webp",
        "shortDescription": "Vibrant salmon-orange split red lentils, fast-cooking and packed with dietary iron, fiber, and plant-based protein for soups, curries and food purées.",
        "specs": {
          "origin": "Madhya Pradesh & Uttar Pradesh",
          "gradeVariety": "Bold Football & Polished Split Red Masoor",
          "exportPackaging": "25–50 kg Polypropylene Sacks",
          "moq": "1 × 20ft FCL (25 MT)",
          "shelfLife": "24 months",
          "certifications": [
            "APEDA",
            "FSSAI"
          ]
        }
      },
      {
        "slug": "urad-dal",
        "name": "Urad Dal (Black Gram)",
        "image": "/products/urad-dal.webp",
        "shortDescription": "Dense, protein-rich black gram pulses sorted for exceptional fermentation properties, binding quality, and creamy emulsion in batter formulations.",
        "specs": {
          "origin": "Andhra Pradesh & Maharashtra",
          "gradeVariety": "Whole Black Matpe & Split White Skinned Urad",
          "exportPackaging": "25–50 kg Poly Bags",
          "moq": "1 × 20ft FCL (24 MT)",
          "shelfLife": "18 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "AGMARK"
          ]
        }
      }
    ]
  },
  {
    "slug": "fresh-vegetables",
    "name": "Fresh Vegetables",
    "headline": "Farm-Fresh Export Vegetables",
    "blurb": "GI-tagged and farm-fresh Indian vegetables harvested at dawn, pre-cooled at packhouses, and air-freighted or dispatched in controlled-atmosphere reefers.",
    "image": "/products/category-fresh-vegetables.webp",
    "products": [
      {
        "slug": "nashik-red-onion",
        "name": "Nashik Red Onion",
        "image": "/products/nashik-red-onion.webp",
        "shortDescription": "World-renowned Maharashtra red onions with tight shiny skins, sharp pungent flavor, high solid content, and supreme transit dormancy.",
        "specs": {
          "origin": "Nashik, Maharashtra",
          "gradeVariety": "45mm+, 55mm+ Export Graded Bulbs",
          "exportPackaging": "5, 10, 25 kg Red Mesh / Leno Bags",
          "moq": "1 × 40ft Reefer FCL (29 MT)",
          "shelfLife": "60–90 days (1–2°C, 65% RH)",
          "certifications": [
            "APEDA",
            "GlobalGAP",
            "Phytosanitary"
          ]
        }
      },
      {
        "slug": "white-onion",
        "name": "White Onion",
        "image": "/products/white-onion.webp",
        "shortDescription": "High-total-soluble-solids white onions cultivated across Saurashtra, offering mild sweetness, crisp flesh, and optimal suitability for dehydration flakes.",
        "specs": {
          "origin": "Bhavnagar & Mahuva, Gujarat",
          "gradeVariety": "Table & Dehydration Grade 50mm+",
          "exportPackaging": "10, 25 kg Leno Mesh Bags",
          "moq": "1 × 40ft Reefer FCL (28 MT)",
          "shelfLife": "45–60 days",
          "certifications": [
            "APEDA",
            "GlobalGAP"
          ]
        }
      },
      {
        "slug": "potato",
        "name": "Potato",
        "image": "/products/potato.webp",
        "shortDescription": "Firm table and processing potatoes with smooth skin, shallow eyes, low reducing sugars, and zero internal defects, ideal for fresh cooking and crisp processing.",
        "specs": {
          "origin": "Agra, Uttar Pradesh & Gujarat",
          "gradeVariety": "Lady Rosetta / Kufri Jyoti / Chipsona (45mm–65mm)",
          "exportPackaging": "25–50 kg Jute & Mesh Bags",
          "moq": "1 × 40ft Reefer FCL (29 MT)",
          "shelfLife": "90–120 days (7–10°C)",
          "certifications": [
            "APEDA",
            "Phytosanitary"
          ]
        }
      },
      {
        "slug": "tomato",
        "name": "Tomato",
        "image": "/products/tomato.webp",
        "shortDescription": "Greenhouse and open-field vine-ripened tomatoes picked at turning stage to guarantee thick pericarp walls, firm texture, and balanced brix upon destination arrival.",
        "specs": {
          "origin": "Maharashtra & Karnataka",
          "gradeVariety": "Firm Red Semi-Ripe (55–65mm Diameter)",
          "exportPackaging": "5–10 kg Ventilated Corrugated Cartons",
          "moq": "1 × 40ft Reefer FCL (22 MT)",
          "shelfLife": "21–28 days (10–12°C)",
          "certifications": [
            "GlobalGAP",
            "APEDA"
          ]
        }
      },
      {
        "slug": "garlic",
        "name": "Garlic",
        "image": "/products/garlic.webp",
        "shortDescription": "Aromatic white garlic bulbs with tight protective skins, intense pungency, and robust allicin levels, sorted carefully to eliminate loose cloves and sun-scald.",
        "specs": {
          "origin": "Mandsaur, Madhya Pradesh & Gujarat",
          "gradeVariety": "Pure White Bold 35mm+, 45mm+ Cloves",
          "exportPackaging": "10–20 kg Mesh Bags / Small Mesh Sleeves",
          "moq": "1 × 40ft Reefer FCL (26 MT)",
          "shelfLife": "6 months (0–1°C, 65% RH)",
          "certifications": [
            "APEDA",
            "Phytosanitary"
          ]
        }
      },
      {
        "slug": "ginger",
        "name": "Ginger",
        "image": "/products/ginger.webp",
        "shortDescription": "Plump, washed Indian fresh ginger rhizomes free from soil, showing fibrous golden interior, spicy kick, and smooth outer skin for international supermarkets.",
        "specs": {
          "origin": "Wayanad, Kerala & Assam",
          "gradeVariety": "Fresh Washed Cochin Grade (150g+ Rhizome)",
          "exportPackaging": "13.6 kg / 30 lb Ventilated Plastic Crates & Cartons",
          "moq": "1 × 40ft Reefer FCL (24 MT)",
          "shelfLife": "45–60 days (12–14°C)",
          "certifications": [
            "APEDA",
            "GlobalGAP",
            "Phytosanitary"
          ]
        }
      },
      {
        "slug": "green-chilli",
        "name": "Green Chilli",
        "image": "/products/green-chilli.webp",
        "shortDescription": "Crisp, pungent fresh green chillies harvested at peak chlorophyll saturation with tight stems, vibrant green color, and high heat profile (SHU 25,000–50,000).",
        "specs": {
          "origin": "Guntur, Andhra Pradesh & Kolhapur",
          "gradeVariety": "G4 / Bullet / Jwala (6–9cm Length)",
          "exportPackaging": "4–5 kg Ventilated CFB Cartons with Air Holes",
          "moq": "Air Freight & Reefer FCL",
          "shelfLife": "14–21 days (8–10°C)",
          "certifications": [
            "APEDA",
            "GlobalGAP"
          ]
        }
      },
      {
        "slug": "drumstick-moringa",
        "name": "Drumstick (Moringa)",
        "image": "/products/drumstick-moringa.webp",
        "shortDescription": "Fresh Moringa oleifera pods handpicked at slender maturity to ensure succulent inner pulp, delicate seeds, and rich antioxidant properties.",
        "specs": {
          "origin": "Tamil Nadu & Andhra Pradesh",
          "gradeVariety": "Tender Slender Pods 45–60cm Length",
          "exportPackaging": "5, 10 kg Ventilated Cartons with protective straw",
          "moq": "Air Freight & Reefer FCL",
          "shelfLife": "12–16 days (8–10°C)",
          "certifications": [
            "APEDA",
            "GlobalGAP",
            "Phytosanitary"
          ]
        }
      }
    ]
  },
  {
    "slug": "fresh-fruits",
    "name": "Fresh Fruits",
    "headline": "Orchard Fresh Indian Fruits",
    "blurb": "GI-tagged and orchard-fresh Indian fruits, pre-cooled at packhouses, hot-water treated, and dispatched via maritime reefers and direct air cargo.",
    "image": "/products/category-fresh-fruits.webp",
    "products": [
      {
        "slug": "cavendish-banana",
        "name": "Cavendish Banana",
        "image": "/products/cavendish-banana.webp",
        "shortDescription": "Vibrant green Grand Naine Cavendish bananas packed in vacuum polyliners, ethylene-scavenged, and refrigerated for uniform artificial ripening overseas.",
        "specs": {
          "origin": "Jalgaon, Maharashtra & Andhra Pradesh",
          "gradeVariety": "G9 Grand Naine Export Grade (Hands 4–7, Caliber 39–46)",
          "exportPackaging": "13.5 kg / 18.2 kg Telescopic Bottom Vent Cartons",
          "moq": "1 × 40ft Reefer FCL (1540 Cartons)",
          "shelfLife": "30–35 days green life (13.5°C)",
          "certifications": [
            "GlobalGAP",
            "APEDA",
            "Phytosanitary"
          ]
        }
      },
      {
        "slug": "alphonso-mango",
        "name": "Alphonso Mango",
        "image": "/products/alphonso-mango.webp",
        "shortDescription": "The undisputed King of Mangoes, world-renowned for buttery non-fibrous golden pulp, royal saffron hue, and captivating tropical fragrance.",
        "specs": {
          "origin": "Ratnagiri & Devgad, Maharashtra",
          "gradeVariety": "GI Tagged Hand-Harvested 200–300g per piece",
          "exportPackaging": "3.5 kg Open Top Corrugated Cartons (12 Count)",
          "moq": "Air Freight Consignments (500 kg+)",
          "shelfLife": "14–21 days post-harvest",
          "certifications": [
            "GI Tagged",
            "APEDA",
            "USDA / EU VHT Approved"
          ]
        }
      },
      {
        "slug": "bhagwa-pomegranate",
        "name": "Bhagwa Pomegranate",
        "image": "/products/bhagwa-pomegranate.webp",
        "shortDescription": "Flagship Indian Bhagwa pomegranates with deep crimson glossy skin, soft edible seeds, and succulent dark-red arils with balanced acidity.",
        "specs": {
          "origin": "Solapur, Maharashtra",
          "gradeVariety": "Ruby Red Glossy Skin 250–400g (Grade A Export)",
          "exportPackaging": "3.5 kg / 4 kg Flat Cartons with net foam sleeves",
          "moq": "1 × 40ft Reefer FCL (20 MT)",
          "shelfLife": "60–75 days (5°C, 90% RH)",
          "certifications": [
            "GlobalGAP",
            "APEDA",
            "Phytosanitary"
          ]
        }
      }
    ]
  },
  {
    "slug": "spices",
    "name": "Spices",
    "headline": "Whole & Ground Spices",
    "blurb": "Whole and ground Indian spices from Kerala, Rajasthan, and Andhra Pradesh, laboratory-certified by the Spices Board of India for purity and essential oils.",
    "image": "/products/category-spices.webp",
    "products": [
      {
        "slug": "turmeric",
        "name": "Turmeric (Finger & Powder)",
        "image": "/products/turmeric.webp",
        "shortDescription": "Deep golden-yellow double-polished turmeric fingers and micro-pulverized powder with high bioactive curcumin content, low moisture, and zero lead chromate.",
        "specs": {
          "origin": "Erode, Tamil Nadu & Nizamabad",
          "gradeVariety": "Double Polished Fingers / Powder (Curcumin 3.0%–5.5%)",
          "exportPackaging": "25, 50 kg Jute Bags / Multilayer Paper Sacks",
          "moq": "1 × 20ft FCL (18 MT)",
          "shelfLife": "24 months",
          "certifications": [
            "Spices Board",
            "FSSAI",
            "ISO 22000",
            "Halal"
          ]
        }
      },
      {
        "slug": "guntur-red-chilli",
        "name": "Guntur Red Chilli",
        "image": "/products/guntur-red-chilli.webp",
        "shortDescription": "Intense fiery dried red chillies from India's chilli heartland, sun-dried to optimal moisture with deep crimson color values (ASTA 60–100) and pungent kick.",
        "specs": {
          "origin": "Guntur, Andhra Pradesh",
          "gradeVariety": "S4 Sannam / Teja Stemless (SHU 35,000–75,000)",
          "exportPackaging": "10, 25 kg Jute / PP Bags",
          "moq": "1 × 40ft HC FCL (14 MT)",
          "shelfLife": "18 months",
          "certifications": [
            "Spices Board",
            "FSSAI",
            "ASTA Clean"
          ]
        }
      },
      {
        "slug": "cumin-seeds",
        "name": "Cumin Seeds",
        "image": "/products/cumin-seeds.webp",
        "shortDescription": "Aromatic brown cumin seeds from Unjha's mega-mandis, mechanically cleaned and optical-sorted to eliminate weed seeds and ensure minimum 2.5% volatile oil.",
        "specs": {
          "origin": "Unjha, Gujarat & Rajasthan",
          "gradeVariety": "Singapore Quality (99%) & Europe Quality (99.5% Sortex)",
          "exportPackaging": "25–50 kg Multi-ply Paper / PP Bags",
          "moq": "1 × 20ft FCL (18 MT)",
          "shelfLife": "24 months",
          "certifications": [
            "Spices Board",
            "FSSAI",
            "BRCGS"
          ]
        }
      },
      {
        "slug": "cinnamon",
        "name": "Cinnamon",
        "image": "/products/cinnamon.webp",
        "shortDescription": "Paper-thin, multilayered rolled quills of true Ceylon cinnamon with delicate sweet taste, low coumarin content, and warm woody fragrance.",
        "specs": {
          "origin": "Kerala & Andaman",
          "gradeVariety": "Ceylon Alba & C5 Fine Quills",
          "exportPackaging": "10–25 kg Master Cartons",
          "moq": "1 × 20ft FCL (8 MT)",
          "shelfLife": "24 months",
          "certifications": [
            "Spices Board",
            "FSSAI"
          ]
        }
      }
    ]
  },
  {
    "slug": "dehydrated-powders",
    "name": "Dehydrated Powders",
    "headline": "Air-Dried & Spray-Dried Powders",
    "blurb": "Air-dried and spray-dried vegetable, herb and botanical powders for food, nutrition and wellness brands.",
    "image": "/products/category-dehydrated-powders.webp",
    "products": [
      {
        "slug": "white-onion-powder",
        "name": "White Onion Powder",
        "image": "/products/white-onion-powder.webp",
        "shortDescription": "Creamy white culinary powder made from premium dehydrated Bhavnagar white onions, delivering sharp pungency and rich savory sweetness.",
        "specs": {
          "origin": "Bhavnagar & Mahuva, Gujarat",
          "gradeVariety": "Air-Dried Superfine (Mesh 80–100)",
          "exportPackaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
          "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
          "shelfLife": "24 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "ISO 22000",
            "HACCP",
            "BRCGS"
          ]
        }
      },
      {
        "slug": "garlic-powder",
        "name": "Garlic Powder",
        "image": "/products/garlic-powder.webp",
        "shortDescription": "Finely ground golden-cream garlic powder processed from fully cured whole Indian garlic cloves, delivering intense savory umami and potent aroma.",
        "specs": {
          "origin": "Mandsaur, Madhya Pradesh & Rajkot, Gujarat",
          "gradeVariety": "Air-Dried Superfine (Mesh 80–100)",
          "exportPackaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
          "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
          "shelfLife": "24 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "ISO 22000",
            "BRCGS"
          ]
        }
      },
      {
        "slug": "moringa-leaf-powder",
        "name": "Moringa Leaf Powder",
        "image": "/products/moringa-leaf-powder.webp",
        "shortDescription": "Nutrient-dense superfood powder produced from tender shade-dried leaves of Indian Moringa oleifera, retaining vivid green chlorophyll and vitamins.",
        "specs": {
          "origin": "Madurai, Tamil Nadu & Guntur, Andhra Pradesh",
          "gradeVariety": "Shade-Dried Ultra-Fine (Mesh 80–100)",
          "exportPackaging": "20–25 kg nitrogen-flushed foil bags in cartons, private-label packs on request",
          "moq": "1 MT (samples available); 1 × 20ft FCL about 10 MT",
          "shelfLife": "24 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "ISO 22000",
            "HACCP"
          ]
        }
      },
      {
        "slug": "tomato-powder",
        "name": "Tomato Powder",
        "image": "/products/tomato-powder.webp",
        "shortDescription": "Concentrated spray-dried tomato powder derived from field-ripened red tomatoes, providing natural lycopene, bright acidity, and rich umami depth.",
        "specs": {
          "origin": "Nashik, Maharashtra & Kolar, Karnataka",
          "gradeVariety": "Spray-Dried & Air-Dried (Mesh 80–100)",
          "exportPackaging": "20–25 kg nitrogen-flushed foil bags in cartons, private-label packs on request",
          "moq": "1 MT (samples available); 1 × 20ft FCL about 11 MT",
          "shelfLife": "18 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "ISO 22000",
            "BRCGS"
          ]
        }
      },
      {
        "slug": "pink-red-onion-powder",
        "name": "Pink/Red Onion Powder",
        "image": "/products/pink-red-onion-powder.webp",
        "shortDescription": "Aromatic pinkish-red onion powder milled from high-solids Nashik red onions with authentic zesty flavor and deep caramelized undertones.",
        "specs": {
          "origin": "Nashik, Maharashtra & Mahuva, Gujarat",
          "gradeVariety": "Spray & Air-Dried (Mesh 80–100)",
          "exportPackaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
          "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
          "shelfLife": "24 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "ISO 22000",
            "HACCP"
          ]
        }
      },
      {
        "slug": "ginger-powder-saunth",
        "name": "Ginger Powder (Saunth)",
        "image": "/products/ginger-powder-saunth.webp",
        "shortDescription": "Traditional Indian Saunth ground from peeled, cured ginger rhizomes of Kerala, renowned for fiery warmth and aromatic citrus nuance. Essential for gingerbread baking, chai blends, herbal digestive formulas, curry powders, and wellness beverages. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.5%, no added colors or preservatives).",
        "specs": {
          "origin": "Wayanad & Idukki, Kerala",
          "gradeVariety": "Sun & Hot-Air Dried (Mesh 60–100)",
          "exportPackaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
          "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
          "shelfLife": "24 months",
          "certifications": [
            "Spices Board",
            "FSSAI",
            "ISO 22000",
            "HACCP"
          ]
        }
      },
      {
        "slug": "spinach-powder",
        "name": "Spinach Powder",
        "image": "/products/spinach-powder.webp",
        "shortDescription": "Vibrant green powder manufactured from freshly harvested Indian Palak spinach leaves, gently dried to protect thermolabile iron and folic acid.",
        "specs": {
          "origin": "Pune, Maharashtra & Punjab",
          "gradeVariety": "Air-Dried Microfine (Mesh 80–100)",
          "exportPackaging": "20 kg poly-lined cartons, 25 kg paper bags, private-label packs on request",
          "moq": "1 MT (samples available); 1 × 20ft FCL about 10 MT",
          "shelfLife": "18 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "ISO 22000",
            "HACCP"
          ]
        }
      },
      {
        "slug": "mint-leaf-powder",
        "name": "Mint Leaf Powder",
        "image": "/products/mint-leaf-powder.webp",
        "shortDescription": "Refreshingly crisp mint powder milled from cleaned Mentha arvensis leaves, brimming with cooling essential oils and invigorating aroma.",
        "specs": {
          "origin": "Bareilly, Uttar Pradesh & Madhya Pradesh",
          "gradeVariety": "Shadow-Dried Fine (Mesh 60–80)",
          "exportPackaging": "15–20 kg poly-lined cartons, 25 kg paper bags, private-label packs on request",
          "moq": "1 MT (samples available); 1 × 20ft FCL about 8 MT",
          "shelfLife": "18 months",
          "certifications": [
            "Spices Board",
            "FSSAI",
            "ISO 22000"
          ]
        }
      },
      {
        "slug": "beetroot-powder",
        "name": "Beetroot Powder",
        "image": "/products/beetroot-powder.webp",
        "shortDescription": "Pure deep-magenta beetroot powder prepared from sweet, earth-grown beets, valued as a clean-label natural food colorant and nutrient.",
        "specs": {
          "origin": "Belgaum, Karnataka & Maharashtra",
          "gradeVariety": "Spray-Dried Superfine (Mesh 80–100)",
          "exportPackaging": "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
          "moq": "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
          "shelfLife": "24 months",
          "certifications": [
            "APEDA",
            "FSSAI",
            "ISO 22000",
            "HACCP"
          ]
        }
      }
    ]
  },
  {
    "slug": "ceramic-tiles",
    "name": "Ceramic Tiles",
    "headline": "Ceramic & Vitrified Tiles Collections",
    "blurb": "Export-grade Glazed Vitrified Tiles (GVT & PGVT) manufactured in Morbi, Gujarat — high-definition Italian inkjet printing, nano-polished gloss, and ISO 13006 / CE international certifications.",
    "image": "/products/luxury-glazed-vitrified-tiles.webp",
    "products": [
      {
        "slug": "glazed-vitrified-tiles",
        "name": "Endless Collection",
        "catalogueId": "gvt_brochure",
        "image": "/products/luxury-glazed-vitrified-tiles.webp",
        "shortDescription": "Premium export-grade digital glazed vitrified tiles manufactured with high-definition Italian inkjet printing, authentic marble veining, nano-polished surfaces, and ultra-low water absorption (<0.05%).",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "3d-collection-2026",
        "name": "3D Collection 2026",
        "catalogueId": "3d-collection-2026",
        "image": "/products/3d-collection-2026.webp",
        "shortDescription": "Sculpted 3D visual depth vitrified surfaces with dimensional textures, subtle architectural relief, and high-definition surface clarity for luxury commercial and residential installations.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "bookmatch-collection-2026",
        "name": "Bookmatch Collection 2026",
        "catalogueId": "bookmatch-collection-2026",
        "image": "/products/bookmatch-collection-2026.webp",
        "shortDescription": "Symmetrical mirror-matched vein patterns engineered for expansive luxury living walls and feature floors, delivering flawless high-end natural marble visual continuity.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "carving-collection-2026",
        "name": "Carving Collection 2026",
        "catalogueId": "carving-collection-2026",
        "image": "/products/carving-collection-2026.webp",
        "shortDescription": "Micro-carved ink luster finish creating tactile vein grooves and sophisticated light play across natural stone textures for modern architectural spaces.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "decor-glossy-collection-2026",
        "name": "Decor Glossy Collection 2026",
        "catalogueId": "decor-glossy-collection-2026",
        "image": "/products/decor-glossy-collection-2026.webp",
        "shortDescription": "Artistic decorative patterns with crystalline high-gloss glaze, vibrant geometric and organic motifs, and seamless modular alignment.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "double-charge-collection-2026",
        "name": "Double Charge Collection 2026",
        "catalogueId": "double-charge-collection-2026",
        "image": "/products/double-charge-collection-2026.webp",
        "shortDescription": "Heavy-duty double-layered vitrified tiles designed for extreme high-traffic commercial and industrial architectural floors with maximum abrasion resistance.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "glossy-collection",
        "name": "Glossy Collection",
        "catalogueId": "glossy-collection-without-logo",
        "image": "/products/glossy-collection-without-logo.webp",
        "shortDescription": "Comprehensive collection of pristine mirror-polished glazed vitrified tiles with brilliant light reflectance, authentic marble nuances, and stain-resistant nano coating.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "gold-collection",
        "name": "Gold Collection",
        "catalogueId": "gold-collection",
        "image": "/products/gold-collection.webp",
        "shortDescription": "Opulent metallic gold-infused veining and luxury crystalline accents engineered for statement hospitality lobbies, luxury villas, and architectural facades.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "matt-collection",
        "name": "Matt Collection",
        "catalogueId": "matt-collection-without-logo",
        "image": "/products/matt-collection-without-logo.webp",
        "shortDescription": "Sophisticated non-reflective satin matt finishes with R10 anti-slip rating, natural warmth, velvety touch, and high scratch resistance for refined interiors.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "new-gold-and-endless-collection",
        "name": "New Gold & Endless Collection",
        "catalogueId": "new-gold-and-endless-collection-without-logo",
        "image": "/products/new-gold-and-endless-collection-without-logo.webp",
        "shortDescription": "Harmonized fusion of continuous endless veining highlighted with metallic gold luster inlays, creating seamless prestige flooring across contiguous rooms.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "staturio-collection-2026",
        "name": "Staturio Collection 2026",
        "catalogueId": "staturio-collection-2026-with-out",
        "image": "/products/staturio-collection-2026-with-out.webp",
        "shortDescription": "Timeless Italian Statuario marble replicas with deep dramatic grey veins running over an ultra-white porcelain body with high gloss and carving options.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "terrazo-collection-2026",
        "name": "Terrazo Collection 2026",
        "catalogueId": "terrazo-collection-2026-without-logo",
        "image": "/products/terrazo-collection-2026-without-logo.webp",
        "shortDescription": "Classic Venetian terrazzo stone chips embedded in modern vitrified slabs, blending mid-century architectural charm with high-density stain-proof durability.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      },
      {
        "slug": "wood-collection",
        "name": "Wood Collection",
        "catalogueId": "wood-collection-without-logo",
        "image": "/products/wood-collection-without-logo.webp",
        "shortDescription": "Organic hardwood timber grain reproduction with thermal stability, moisture resistance, realistic relief grooves, and zero rot or warping.",
        "specs": {
          "origin": "Morbi, Gujarat, India",
          "gradeVariety": "Glossy / High-Gloss / Carving / Matt",
          "size": "60 * 120 cm",
          "exportPackaging": "Corner-protected corrugated cartons on ISPM-15 heat-treated fumigated wooden pallets",
          "moq": "1 × 20ft FCL (approx. 1,300 sq.m)",
          "shelfLife": "Permanent Architectural Material",
          "certifications": [
            "ISO 13006 Group BIa",
            "CE Certified",
            "VOC Free",
            "SGS Inspected"
          ]
        }
      }
    ]
  }
] as unknown as Category[];

export const allProducts: (Product & { category: Category })[] = categories.flatMap((c) =>
  c.products.map((p) => ({
    ...p,
    catalogueId: p.catalogueId,
    category: c,
    origin: p.specs.origin ?? "",
    grade: p.specs.gradeVariety ?? "",
    size: p.specs.size,
    packaging: p.specs.exportPackaging ?? "",
    moq: p.specs.moq ?? "",
    shelfLife: p.specs.shelfLife ?? "",
    certifications: p.specs.certifications ?? [],
    description: p.shortDescription,
    gallery: [p.image],
    alt: p.name,
  }))
);

export function getCategory(slug: string): Category | undefined {
  
  return categories.find((c) => c.slug === slug);
}

export function getProduct(catSlug: string, prodSlug: string): (Product & { category: Category }) | undefined {
  return allProducts.find(
    (p) => (p.category.slug === catSlug || catSlug === "all") && p.slug === prodSlug
  );
}

export const totalCatalogCount = allProducts.length;

export function getCategoryCount(slug: string): number {
  return getCategory(slug)?.products.length ?? 0;
}
