// 5 Categories, 68 Approved Export Products with Dedicated High-Resolution Local Assets

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
  alt: string;
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
    "image": "/products/1121-basmati-rice.webp",
    "products": [
      {
        "slug": "1121-basmati-rice",
        "name": "1121 Basmati Rice",
        "origin": "Punjab & Haryana",
        "grade": "1121 Steam / Raw / Sella (8.35mm+ Average Grain Length)",
        "packaging": "5\u201340 kg Jute / Non-Woven PP bags",
        "moq": "1 \u00d7 20ft FCL (25 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "APEDA",
          "ISO 22000",
          "FSSAI",
          "BRCGS"
        ],
        "description": "Extra-long grain aromatic basmati rice prized for elongation ratio exceeding 2.5x upon cooking, pristine pearl-white kernels, and sweet natural fragrance.",
        "image": "/products/1121-basmati-rice.webp",
        "gallery": [
          "/products/1121-basmati-rice.webp",
          "/products/1121-basmati-rice-2.webp",
          "/products/1121-basmati-rice-3.webp"
        ],
        "alt": "Aged 1121 Indian Basmati Rice extra-long slender grains"
      },
      {
        "slug": "1509-basmati-rice",
        "name": "1509 Basmati Rice",
        "origin": "Punjab & Western Uttar Pradesh",
        "grade": "1509 Golden / White Sella (8.40mm+ Grain Length)",
        "packaging": "10\u201350 kg BOPP / PP Bags",
        "moq": "1 \u00d7 20ft FCL (25 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "APEDA",
          "FSSAI",
          "ISO 22000"
        ],
        "description": "High-yielding premium long grain basmati with remarkable elongation, smooth finish, and fast cooking time, favored across Middle Eastern and European food service.",
        "image": "/products/1509-basmati-rice.webp",
        "gallery": [
          "/products/1509-basmati-rice.webp",
          "/products/1509-basmati-rice-2.webp",
          "/products/1509-basmati-rice-3.webp"
        ],
        "alt": "High quality 1509 Basmati Rice milled grains"
      },
      {
        "slug": "sella-basmati-rice",
        "name": "Sella Basmati Rice",
        "origin": "Punjab & Haryana",
        "grade": "Golden & Creamy Parboiled Basmati Rice",
        "packaging": "25\u201350 kg Jute & Polypropylene Sacks",
        "moq": "1 \u00d7 20ft FCL (25 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "APEDA",
          "FSSAI",
          "HACCP"
        ],
        "description": "Hydrothermally processed parboiled basmati with hard kernels that resist breakage, lock in essential nutrients, and cook into separate non-sticky grains.",
        "image": "/products/sella-basmati-rice.webp",
        "gallery": [
          "/products/sella-basmati-rice.webp",
          "/products/sella-basmati-rice-2.webp",
          "/products/sella-basmati-rice-3.webp"
        ],
        "alt": "Golden Sella parboiled basmati rice grains"
      },
      {
        "slug": "non-basmati-white-rice-ir64",
        "name": "Non-Basmati White Rice (IR64)",
        "origin": "Andhra Pradesh & West Bengal",
        "grade": "IR64 Raw & Parboiled (5% / 25% Broken)",
        "packaging": "25\u201350 kg PP bags / Big Bags",
        "moq": "1 \u00d7 20ft FCL (26 MT)",
        "shelfLife": "18 months",
        "certifications": [
          "APEDA",
          "FSSAI"
        ],
        "description": "Long grain Indian non-basmati rice celebrated for consistent culinary texture, high caloric value, and rigorous sorting for broken percentage control.",
        "image": "/products/non-basmati-white-rice-ir64.webp",
        "gallery": [
          "/products/non-basmati-white-rice-ir64.webp",
          "/products/non-basmati-white-rice-ir64-2.webp",
          "/products/non-basmati-white-rice-ir64-3.webp"
        ],
        "alt": "IR64 Non-Basmati polished white rice in bowl"
      },
      {
        "slug": "sona-masoori-rice",
        "name": "Sona Masoori Rice",
        "origin": "Andhra Pradesh & Karnataka",
        "grade": "Medium Grain Raw Aromatic (Aged 12+ Months)",
        "packaging": "10\u201325 kg Poly Woven Bags",
        "moq": "1 \u00d7 20ft FCL (25 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "APEDA",
          "FSSAI",
          "ISO 9001"
        ],
        "description": "Lightweight, low-starch aromatic medium-grain rice cultivated in the fertile Tungabhadra basin, easy to digest and ideal for daily dietary consumption.",
        "image": "/products/sona-masoori-rice.webp",
        "gallery": [
          "/products/sona-masoori-rice.webp",
          "/products/sona-masoori-rice-2.webp",
          "/products/sona-masoori-rice-3.webp"
        ],
        "alt": "Sona Masoori lightweight raw white rice"
      },
      {
        "slug": "milling-wheat",
        "name": "Milling Wheat",
        "origin": "Madhya Pradesh & Punjab",
        "grade": "Hard Golden Wheat (Protein 12\u201314%, Moisture < 12%)",
        "packaging": "50 kg PP bags / Bulk containerized liner",
        "moq": "1 \u00d7 20ft FCL (25 MT)",
        "shelfLife": "12 months",
        "certifications": [
          "APEDA",
          "FSSAI",
          "Phytosanitary"
        ],
        "description": "Golden hard milling wheat with superior gluten strength, high hectoliter weight, and minimal dockage, engineered for premier bakery and semolina production.",
        "image": "/products/milling-wheat.webp",
        "gallery": [
          "/products/milling-wheat.webp",
          "/products/milling-wheat-2.webp",
          "/products/milling-wheat-3.webp"
        ],
        "alt": "Golden milling wheat grain kernels closeup"
      },
      {
        "slug": "yellow-maize",
        "name": "Yellow Maize",
        "origin": "Bihar, Karnataka & Maharashtra",
        "grade": "Food & Feed Grade (Aflatoxin < 20 ppb, Moisture < 14%)",
        "packaging": "50 kg PP bags / Bulk in 20ft containers",
        "moq": "1 \u00d7 20ft FCL (24 MT)",
        "shelfLife": "12 months",
        "certifications": [
          "APEDA",
          "Non-GMO",
          "FSSAI"
        ],
        "description": "Sun-dried bright yellow corn kernels free from live weevils or mold, providing exceptional energy density for poultry feed formulation and industrial starch processing.",
        "image": "/products/yellow-maize.webp",
        "gallery": [
          "/products/yellow-maize.webp",
          "/products/yellow-maize-2.webp",
          "/products/yellow-maize-3.webp"
        ],
        "alt": "Bright yellow maize corn kernels"
      },
      {
        "slug": "bajra-pearl-millet",
        "name": "Bajra (Pearl Millet)",
        "origin": "Rajasthan & Gujarat",
        "grade": "Machine Cleaned Bold Grey Grains (Purity 99%)",
        "packaging": "25\u201350 kg PP Woven Bags",
        "moq": "1 \u00d7 20ft FCL (22 MT)",
        "shelfLife": "12 months",
        "certifications": [
          "APEDA",
          "FSSAI",
          "Organic Available"
        ],
        "description": "Nutrient-rich ancient cereal with high dietary iron, magnesium, and resistant starch, sourced from drought-resistant western Indian agrarian belts.",
        "image": "/products/bajra-pearl-millet.webp",
        "gallery": [
          "/products/bajra-pearl-millet.webp",
          "/products/bajra-pearl-millet-2.webp",
          "/products/bajra-pearl-millet-3.webp"
        ],
        "alt": "Machine-cleaned bold Pearl Millet Bajra grains"
      },
      {
        "slug": "soybean",
        "name": "Soybean",
        "origin": "Madhya Pradesh & Maharashtra",
        "grade": "Non-GMO Yellow Food Grade (Protein 38%+, Oil 18%)",
        "packaging": "50 kg PP bags / Jumbo Bags",
        "moq": "1 \u00d7 20ft FCL (24 MT)",
        "shelfLife": "12 months",
        "certifications": [
          "FSSAI",
          "Non-GMO Certified"
        ],
        "description": "Selected clean yellow soybeans with verified non-GMO provenance, low splits, and uniform size for soymilk, tofu, and high-protein nutrition products.",
        "image": "/products/soybean.webp",
        "gallery": [
          "/products/soybean.webp",
          "/products/soybean-2.webp",
          "/products/soybean-3.webp"
        ],
        "alt": "Non-GMO golden yellow soybeans in wooden bowl"
      },
      {
        "slug": "groundnut-peanut-kernels",
        "name": "Groundnut (Peanut Kernels)",
        "origin": "Saurashtra, Gujarat",
        "grade": "Bold (40/50, 50/60) & Java (60/70, 70/80)",
        "packaging": "25\u201350 kg Jute bags / Vacuum packed cartons",
        "moq": "1 \u00d7 20ft FCL (19 MT)",
        "shelfLife": "12 months",
        "certifications": [
          "APEDA",
          "IOPEPC",
          "FSSAI",
          "SGS Tested"
        ],
        "description": "Hulled peanut kernels carefully sorted for uniform size, rich nutty sweetness, high oil content, and stringent European aflatoxin limits (< 4 ppb).",
        "image": "/products/groundnut-peanut-kernels.webp",
        "gallery": [
          "/products/groundnut-peanut-kernels.webp",
          "/products/groundnut-peanut-kernels-2.webp",
          "/products/groundnut-peanut-kernels-3.webp"
        ],
        "alt": "Raw shelled groundnut peanut kernels with reddish skin in dark bowl"
      },
      {
        "slug": "sesame-seeds",
        "name": "Sesame Seeds",
        "origin": "Gujarat & Rajasthan",
        "grade": "Natural White 99/1 & Auto Hulled 99.95% Purity",
        "packaging": "25\u201350 kg Multiwall Paper / PP Bags",
        "moq": "1 \u00d7 20ft FCL (19 MT)",
        "shelfLife": "12 months",
        "certifications": [
          "APEDA",
          "FSSAI",
          "Kosher",
          "Halal"
        ],
        "description": "Premium sortex-cleaned white sesame seeds boasting rich aroma, minimum 48% oil content, and flawless uniform white color for tahini, bakery and confectionery.",
        "image": "/products/sesame-seeds.webp",
        "gallery": [
          "/products/sesame-seeds.webp",
          "/products/sesame-seeds-2.webp",
          "/products/sesame-seeds-3.webp"
        ],
        "alt": "Pearly white natural sesame seeds in ceramic bowl"
      },
      {
        "slug": "kabuli-chickpeas",
        "name": "Kabuli Chickpeas",
        "origin": "Madhya Pradesh & Maharashtra",
        "grade": "Bold 42-44, 44-46 & 75-80 Count / Ounce",
        "packaging": "25\u201350 kg PP Bags / Poly Bags",
        "moq": "1 \u00d7 20ft FCL (24 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "APEDA",
          "FSSAI",
          "Phytosanitary"
        ],
        "description": "Large-caliber cream-colored garbanzo beans machine cleaned and gravity separated for canning, salad packaging, and authentic hummus manufacturing.",
        "image": "/products/kabuli-chickpeas.webp",
        "gallery": [
          "/products/kabuli-chickpeas.webp",
          "/products/kabuli-chickpeas-2.webp",
          "/products/kabuli-chickpeas-3.webp"
        ],
        "alt": "Whole dried Kabuli chickpeas garbanzo beans in wooden bowl"
      },
      {
        "slug": "toor-dal",
        "name": "Toor Dal (Pigeon Pea)",
        "origin": "Maharashtra & Karnataka",
        "grade": "Fatka Unpolished / Machine Cleaned Split",
        "packaging": "25\u201350 kg Brand Printed PP Bags",
        "moq": "1 \u00d7 20ft FCL (24 MT)",
        "shelfLife": "18 months",
        "certifications": [
          "FSSAI",
          "APEDA",
          "AGMARK"
        ],
        "description": "Dehusked split yellow pigeon peas processed without chemical polish or artificial colors, delivering high protein and creamy texture to culinary applications.",
        "image": "/products/toor-dal.webp",
        "gallery": [
          "/products/toor-dal.webp",
          "/products/toor-dal-2.webp",
          "/products/toor-dal-3.webp"
        ],
        "alt": "Yellow split Toor Dal pigeon peas in traditional bowl"
      },
      {
        "slug": "moong-dal",
        "name": "Moong Dal (Green Gram)",
        "origin": "Rajasthan & Gujarat",
        "grade": "Yellow Split & Bold Green Whole Moong",
        "packaging": "25\u201350 kg PP Bags",
        "moq": "1 \u00d7 20ft FCL (24 MT)",
        "shelfLife": "18 months",
        "certifications": [
          "FSSAI",
          "APEDA",
          "ISO 22000"
        ],
        "description": "Easily digestible premium green gram and bright yellow split lentils, laser sorted for uniform kernel size, zero stones, and maximum nutritional retention.",
        "image": "/products/moong-dal.webp",
        "gallery": [
          "/products/moong-dal.webp",
          "/products/moong-dal-2.webp",
          "/products/moong-dal-3.webp"
        ],
        "alt": "Golden yellow split Moong Dal lentils"
      },
      {
        "slug": "masoor-dal",
        "name": "Masoor Dal (Red Lentil)",
        "origin": "Madhya Pradesh & Uttar Pradesh",
        "grade": "Bold Football & Polished Split Red Masoor",
        "packaging": "25\u201350 kg Polypropylene Sacks",
        "moq": "1 \u00d7 20ft FCL (25 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "APEDA",
          "FSSAI"
        ],
        "description": "Vibrant salmon-orange split red lentils, fast-cooking and packed with dietary iron, fiber, and plant-based protein for soups, curries and food pur\u00e9es.",
        "image": "/products/masoor-dal.webp",
        "gallery": [
          "/products/masoor-dal.webp",
          "/products/masoor-dal-2.webp",
          "/products/masoor-dal-3.webp"
        ],
        "alt": "Vibrant salmon-orange split Masoor Dal red lentils"
      },
      {
        "slug": "urad-dal",
        "name": "Urad Dal (Black Gram)",
        "origin": "Andhra Pradesh & Maharashtra",
        "grade": "Whole Black Matpe & Split White Skinned Urad",
        "packaging": "25\u201350 kg Poly Bags",
        "moq": "1 \u00d7 20ft FCL (24 MT)",
        "shelfLife": "18 months",
        "certifications": [
          "APEDA",
          "FSSAI",
          "AGMARK"
        ],
        "description": "Dense, protein-rich black gram pulses sorted for exceptional fermentation properties, binding quality, and creamy emulsion in batter formulations.",
        "image": "/products/urad-dal.webp",
        "gallery": [
          "/products/urad-dal.webp",
          "/products/urad-dal-2.webp",
          "/products/urad-dal-3.webp"
        ],
        "alt": "Polished black gram and split white Urad Dal"
      }
    ]
  },
  {
    "slug": "fresh-vegetables",
    "name": "Fresh Vegetables",
    "headline": "Farm-Fresh Export Vegetables",
    "blurb": "Field-fresh vegetables from Maharashtra and Gujarat, harvest-cooled, grading-line sorted and shipped in temperature-controlled reefer containers.",
    "image": "/products/nashik-red-onion.webp",
    "products": [
      {
        "slug": "nashik-red-onion",
        "name": "Nashik Red Onion",
        "origin": "Nashik, Maharashtra",
        "grade": "45mm+, 55mm+ Export Graded Bulbs",
        "packaging": "5, 10, 25 kg Red Mesh / Leno Bags",
        "moq": "1 \u00d7 40ft Reefer FCL (29 MT)",
        "shelfLife": "60\u201390 days (1\u20132\u00b0C, 65% RH)",
        "certifications": [
          "APEDA",
          "GlobalGAP",
          "Phytosanitary"
        ],
        "description": "World-renowned Maharashtra red onions with tight shiny skins, sharp pungent flavor, high solid content, and supreme transit dormancy.",
        "image": "/products/nashik-red-onion.webp",
        "gallery": [
          "/products/nashik-red-onion.webp",
          "/products/nashik-red-onion-2.webp",
          "/products/nashik-red-onion-3.webp"
        ],
        "alt": "Fresh harvested Nashik Red Onions with dry papery skin"
      },
      {
        "slug": "white-onion",
        "name": "White Onion",
        "origin": "Bhavnagar & Mahuva, Gujarat",
        "grade": "Table & Dehydration Grade 50mm+",
        "packaging": "10, 25 kg Leno Mesh Bags",
        "moq": "1 \u00d7 40ft Reefer FCL (28 MT)",
        "shelfLife": "45\u201360 days",
        "certifications": [
          "APEDA",
          "GlobalGAP"
        ],
        "description": "High-total-soluble-solids white onions cultivated across Saurashtra, offering mild sweetness, crisp flesh, and optimal suitability for dehydration flakes.",
        "image": "/products/white-onion.webp",
        "gallery": [
          "/products/white-onion.webp",
          "/products/white-onion-2.webp",
          "/products/white-onion-3.webp"
        ],
        "alt": "Clean whole white onion bulbs"
      },
      {
        "slug": "potato",
        "name": "Potato",
        "origin": "Agra, Uttar Pradesh & Gujarat",
        "grade": "Lady Rosetta / Kufri Jyoti / Chipsona (45mm\u201365mm)",
        "packaging": "25\u201350 kg Jute & Mesh Bags",
        "moq": "1 \u00d7 40ft Reefer FCL (29 MT)",
        "shelfLife": "90\u2013120 days (7\u201310\u00b0C)",
        "certifications": [
          "APEDA",
          "Phytosanitary"
        ],
        "description": "Firm table and processing potatoes with smooth skin, shallow eyes, low reducing sugars, and zero internal defects, ideal for fresh cooking and crisp processing.",
        "image": "/products/potato.webp",
        "gallery": [
          "/products/potato.webp",
          "/products/potato-2.webp",
          "/products/potato-3.webp"
        ],
        "alt": "Clean raw whole potatoes on rustic background"
      },
      {
        "slug": "tomato",
        "name": "Tomato",
        "origin": "Maharashtra & Karnataka",
        "grade": "Firm Red Semi-Ripe (55\u201365mm Diameter)",
        "packaging": "5\u201310 kg Ventilated Corrugated Cartons",
        "moq": "1 \u00d7 40ft Reefer FCL (22 MT)",
        "shelfLife": "21\u201328 days (10\u201312\u00b0C)",
        "certifications": [
          "GlobalGAP",
          "APEDA"
        ],
        "description": "Greenhouse and open-field vine-ripened tomatoes picked at turning stage to guarantee thick pericarp walls, firm texture, and balanced brix upon destination arrival.",
        "image": "/products/tomato.webp",
        "gallery": [
          "/products/tomato.webp",
          "/products/tomato-2.webp",
          "/products/tomato-3.webp"
        ],
        "alt": "Fresh vine-ripened red tomatoes"
      },
      {
        "slug": "garlic",
        "name": "Garlic",
        "origin": "Mandsaur, Madhya Pradesh & Gujarat",
        "grade": "Pure White Bold 35mm+, 45mm+ Cloves",
        "packaging": "10\u201320 kg Mesh Bags / Small Mesh Sleeves",
        "moq": "1 \u00d7 40ft Reefer FCL (26 MT)",
        "shelfLife": "6 months (0\u20131\u00b0C, 65% RH)",
        "certifications": [
          "APEDA",
          "Phytosanitary"
        ],
        "description": "Aromatic white garlic bulbs with tight protective skins, intense pungency, and robust allicin levels, sorted carefully to eliminate loose cloves and sun-scald.",
        "image": "/products/garlic.webp",
        "gallery": [
          "/products/garlic.webp",
          "/products/garlic-2.webp",
          "/products/garlic-3.webp"
        ],
        "alt": "Whole white garlic bulbs on stone slab"
      },
      {
        "slug": "ginger",
        "name": "Ginger",
        "origin": "Wayanad, Kerala & Assam",
        "grade": "Fresh Washed Cochin Grade (150g+ Rhizome)",
        "packaging": "13.6 kg / 30 lb Ventilated Plastic Crates & Cartons",
        "moq": "1 \u00d7 40ft Reefer FCL (24 MT)",
        "shelfLife": "45\u201360 days (12\u201314\u00b0C)",
        "certifications": [
          "APEDA",
          "GlobalGAP",
          "Phytosanitary"
        ],
        "description": "Plump, washed Indian fresh ginger rhizomes free from soil, showing fibrous golden interior, spicy kick, and smooth outer skin for international supermarkets.",
        "image": "/products/ginger.webp",
        "gallery": [
          "/products/ginger.webp",
          "/products/ginger-2.webp",
          "/products/ginger-3.webp"
        ],
        "alt": "Freshly washed ginger rhizomes on wooden board"
      },
      {
        "slug": "green-chilli",
        "name": "Green Chilli",
        "origin": "Guntur, Andhra Pradesh & Kolhapur",
        "grade": "G4 / Bullet / Jwala (6\u20139cm Length)",
        "packaging": "4\u20135 kg Ventilated CFB Cartons with Air Holes",
        "moq": "Air Freight & Reefer FCL",
        "shelfLife": "14\u201321 days (8\u201310\u00b0C)",
        "certifications": [
          "APEDA",
          "GlobalGAP"
        ],
        "description": "Crisp, pungent fresh green chillies harvested at peak chlorophyll saturation with tight stems, vibrant green color, and high heat profile (SHU 25,000\u201350,000).",
        "image": "/products/green-chilli.webp",
        "gallery": [
          "/products/green-chilli.webp",
          "/products/green-chilli-2.webp",
          "/products/green-chilli-3.webp"
        ],
        "alt": "Fresh vibrant green chillies with calyx stems"
      },
      {
        "slug": "okra-lady-finger",
        "name": "Okra (Lady Finger)",
        "origin": "Gujarat & Maharashtra",
        "grade": "Tender Green 7\u201310cm Length (Blemish Free)",
        "packaging": "4\u20135 kg Telescopic Cartons",
        "moq": "Air Freight / Reefer FCL",
        "shelfLife": "10\u201314 days (10\u201312\u00b0C)",
        "certifications": [
          "GlobalGAP",
          "APEDA"
        ],
        "description": "Tender, ridge-defined green okra pods harvested at dawn, pre-cooled immediately, and air-freighted to prevent pod fiberization and tip discoloration.",
        "image": "/products/okra-lady-finger.webp",
        "gallery": [
          "/products/okra-lady-finger.webp",
          "/products/okra-lady-finger-2.webp",
          "/products/okra-lady-finger-3.webp"
        ],
        "alt": "Fresh tender green okra pods lady fingers"
      },
      {
        "slug": "brinjal-eggplant",
        "name": "Brinjal (Eggplant)",
        "origin": "Maharashtra & Gujarat",
        "grade": "Glossy Dark Purple Oval / Round (150\u2013250g)",
        "packaging": "5\u201310 kg Corrugated Boxes with dividers",
        "moq": "Air Freight / Reefer FCL",
        "shelfLife": "14\u201318 days (10\u201312\u00b0C)",
        "certifications": [
          "APEDA",
          "GlobalGAP"
        ],
        "description": "Glossy, deep-purple Indian aubergines with firm white flesh, minimal seed development, and fresh green calyx, selected for culinary roasting and curries.",
        "image": "/products/brinjal-eggplant.webp",
        "gallery": [
          "/products/brinjal-eggplant.webp",
          "/products/brinjal-eggplant-2.webp",
          "/products/brinjal-eggplant-3.webp"
        ],
        "alt": "Glossy deep purple Indian brinjals eggplants with fresh green calyx"
      },
      {
        "slug": "cauliflower",
        "name": "Cauliflower",
        "origin": "Punjab & Haryana",
        "grade": "Snow White Compact Curds (600\u2013900g, Jacket Pack)",
        "packaging": "10\u201312 kg Telescopic Master Cartons",
        "moq": "1 \u00d7 40ft Reefer FCL (18 MT)",
        "shelfLife": "21\u201328 days (0\u20132\u00b0C)",
        "certifications": [
          "GlobalGAP",
          "APEDA"
        ],
        "description": "Densely packed snow-white cauliflower heads protected by trimmed outer wrapper leaves, free from riciness, yellowing, or mechanical bruising.",
        "image": "/products/cauliflower.webp",
        "gallery": [
          "/products/cauliflower.webp",
          "/products/cauliflower-2.webp",
          "/products/cauliflower-3.webp"
        ],
        "alt": "Fresh snow white cauliflower curd with green leaves"
      },
      {
        "slug": "cabbage",
        "name": "Cabbage",
        "origin": "Maharashtra & West Bengal",
        "grade": "Dense Round Green Heads (800g\u20131.5kg)",
        "packaging": "15\u201320 kg Mesh Bags / Master Cartons",
        "moq": "1 \u00d7 40ft Reefer FCL (25 MT)",
        "shelfLife": "45\u201360 days (0\u20132\u00b0C)",
        "certifications": [
          "APEDA",
          "Phytosanitary"
        ],
        "description": "Compact, heavy green cabbage heads with crisp overlapping leaves, carefully harvested and trimmed to deliver exceptional refrigerated transit longevity.",
        "image": "/products/cabbage.webp",
        "gallery": [
          "/products/cabbage.webp",
          "/products/cabbage-2.webp",
          "/products/cabbage-3.webp"
        ],
        "alt": "Fresh compact green cabbage head"
      },
      {
        "slug": "carrot",
        "name": "Carrot",
        "origin": "Rajasthan & Punjab",
        "grade": "Red Delhi & Nantes Orange (15\u201320cm, Topped & Washed)",
        "packaging": "10, 20 kg Poly Bags inside Cartons",
        "moq": "1 \u00d7 40ft Reefer FCL (26 MT)",
        "shelfLife": "60\u201390 days (0\u20131\u00b0C)",
        "certifications": [
          "APEDA",
          "GlobalGAP"
        ],
        "description": "Hydro-cooled and polished sweet red and orange carrots with crisp core, high beta-carotene, and uniform conical shape, free from root branching.",
        "image": "/products/carrot.webp",
        "gallery": [
          "/products/carrot.webp",
          "/products/carrot-2.webp",
          "/products/carrot-3.webp"
        ],
        "alt": "Washed fresh crisp red and orange carrots"
      },
      {
        "slug": "green-peas",
        "name": "Green Peas",
        "origin": "Punjab & Madhya Pradesh",
        "grade": "Fresh Pods & IQF Blast Frozen Grade A",
        "packaging": "5\u201310 kg Polylined Cartons / 1 kg IQF Pouches",
        "moq": "1 \u00d7 40ft Reefer FCL (22 MT)",
        "shelfLife": "14 days fresh / 24 months IQF (-18\u00b0C)",
        "certifications": [
          "BRCGS",
          "FSSAI",
          "APEDA"
        ],
        "description": "Plump, tender green peas with sweet natural sugars, available freshly harvested in pods or individually quick-frozen within 4 hours of farm picking.",
        "image": "/products/green-peas.webp",
        "gallery": [
          "/products/green-peas.webp",
          "/products/green-peas-2.webp",
          "/products/green-peas-3.webp"
        ],
        "alt": "Fresh tender green peas and pods in rustic bowl"
      },
      {
        "slug": "drumstick-moringa",
        "name": "Drumstick (Moringa)",
        "origin": "Tamil Nadu & Andhra Pradesh",
        "grade": "Tender Slender Pods 45\u201360cm Length",
        "packaging": "5, 10 kg Ventilated Cartons with protective straw",
        "moq": "Air Freight & Reefer FCL",
        "shelfLife": "12\u201316 days (8\u201310\u00b0C)",
        "certifications": [
          "APEDA",
          "GlobalGAP",
          "Phytosanitary"
        ],
        "description": "Fresh Moringa oleifera pods handpicked at slender maturity to ensure succulent inner pulp, delicate seeds, and rich antioxidant properties.",
        "image": "/products/drumstick-moringa.webp",
        "gallery": [
          "/products/drumstick-moringa.webp",
          "/products/drumstick-moringa-2.webp",
          "/products/drumstick-moringa-3.webp"
        ],
        "alt": "Fresh green drumsticks moringa pods tied with twine"
      }
    ]
  },
  {
    "slug": "fresh-fruits",
    "name": "Fresh Fruits",
    "headline": "Orchard Fresh Indian Fruits",
    "blurb": "GI-tagged and orchard-fresh Indian fruits, pre-cooled at packhouses, hot-water treated, and dispatched via maritime reefers and direct air cargo.",
    "image": "/products/cavendish-banana.webp",
    "products": [
      {
        "slug": "cavendish-banana",
        "name": "Cavendish Banana",
        "origin": "Jalgaon, Maharashtra & Andhra Pradesh",
        "grade": "G9 Grand Naine Export Grade (Hands 4\u20137, Caliber 39\u201346)",
        "packaging": "13.5 kg / 18.2 kg Telescopic Bottom Vent Cartons",
        "moq": "1 \u00d7 40ft Reefer FCL (1540 Cartons)",
        "shelfLife": "30\u201335 days green life (13.5\u00b0C)",
        "certifications": [
          "GlobalGAP",
          "APEDA",
          "Phytosanitary"
        ],
        "description": "Vibrant green Grand Naine Cavendish bananas packed in vacuum polyliners, ethylene-scavenged, and refrigerated for uniform artificial ripening overseas.",
        "image": "/products/cavendish-banana.webp",
        "gallery": [
          "/products/cavendish-banana.webp",
          "/products/cavendish-banana-2.webp",
          "/products/cavendish-banana-3.webp"
        ],
        "alt": "Export grade green Cavendish banana hands and cluster"
      },
      {
        "slug": "alphonso-mango",
        "name": "Alphonso Mango",
        "origin": "Ratnagiri & Devgad, Maharashtra",
        "grade": "GI Tagged Hand-Harvested 200\u2013300g per piece",
        "packaging": "3.5 kg Open Top Corrugated Cartons (12 Count)",
        "moq": "Air Freight Consignments (500 kg+)",
        "shelfLife": "14\u201321 days post-harvest",
        "certifications": [
          "GI Tagged",
          "APEDA",
          "USDA / EU VHT Approved"
        ],
        "description": "The undisputed King of Mangoes, world-renowned for buttery non-fibrous golden pulp, royal saffron hue, and captivating tropical fragrance.",
        "image": "/products/alphonso-mango.webp",
        "gallery": [
          "/products/alphonso-mango.webp",
          "/products/alphonso-mango-2.webp",
          "/products/alphonso-mango-3.webp"
        ],
        "alt": "Golden ripe Alphonso mangoes from Ratnagiri"
      },
      {
        "slug": "kesar-mango",
        "name": "Kesar Mango",
        "origin": "Gir, Gujarat",
        "grade": "GI Tagged Queen Mango (220\u2013280g per fruit)",
        "packaging": "3.5 kg / 5 kg Export Master Boxes",
        "moq": "Air Freight & Sea Reefer FCL",
        "shelfLife": "16\u201322 days",
        "certifications": [
          "GI Tagged",
          "APEDA",
          "Phytosanitary"
        ],
        "description": "Famous Queen of Mangoes from the foothills of Gir forest, featuring intense saffron pulp color, high natural brix (20\u00b0+), and luscious sweetness.",
        "image": "/products/kesar-mango.webp",
        "gallery": [
          "/products/kesar-mango.webp",
          "/products/kesar-mango-2.webp",
          "/products/kesar-mango-3.webp"
        ],
        "alt": "Ripe sweet Gir Kesar mangoes on wooden tray"
      },
      {
        "slug": "bhagwa-pomegranate",
        "name": "Bhagwa Pomegranate",
        "origin": "Solapur, Maharashtra",
        "grade": "Ruby Red Glossy Skin 250\u2013400g (Grade A Export)",
        "packaging": "3.5 kg / 4 kg Flat Cartons with net foam sleeves",
        "moq": "1 \u00d7 40ft Reefer FCL (20 MT)",
        "shelfLife": "60\u201375 days (5\u00b0C, 90% RH)",
        "certifications": [
          "GlobalGAP",
          "APEDA",
          "Phytosanitary"
        ],
        "description": "Flagship Indian Bhagwa pomegranates with deep crimson glossy skin, soft edible seeds, and succulent dark-red arils with balanced acidity.",
        "image": "/products/bhagwa-pomegranate.webp",
        "gallery": [
          "/products/bhagwa-pomegranate.webp",
          "/products/bhagwa-pomegranate-2.webp",
          "/products/bhagwa-pomegranate-3.webp"
        ],
        "alt": "Whole ripe ruby-red Bhagwa pomegranate and juicy cut arils"
      },
      {
        "slug": "thompson-seedless-grapes",
        "name": "Thompson Seedless Grapes",
        "origin": "Nashik, Maharashtra",
        "grade": "Brix 16\u00b0+, Berry Diameter 16mm\u201318mm",
        "packaging": "5 kg Cartons (10 \u00d7 500g Punnets / Pouch Bags)",
        "moq": "1 \u00d7 40ft Reefer FCL (2400 Cartons)",
        "shelfLife": "45\u201360 days (-0.5 to 0\u00b0C with SO2 pads)",
        "certifications": [
          "GlobalGAP",
          "GrapeNet Traceable",
          "APEDA"
        ],
        "description": "Crisp green Thompson seedless grapes cultivated in Maharashtra's grape capital, sulfur-pad protected, and pesticide-residue certified to EU MRL levels.",
        "image": "/products/thompson-seedless-grapes.webp",
        "gallery": [
          "/products/thompson-seedless-grapes.webp",
          "/products/thompson-seedless-grapes-2.webp",
          "/products/thompson-seedless-grapes-3.webp"
        ],
        "alt": "Crisp green Thompson seedless grape bunch"
      },
      {
        "slug": "nagpur-orange",
        "name": "Nagpur Orange",
        "origin": "Nagpur & Amravati, Maharashtra",
        "grade": "Mandarin Sweet Oranges 65\u201375mm Diameter",
        "packaging": "10, 15 kg Telescopic Cartons",
        "moq": "1 \u00d7 40ft Reefer FCL (24 MT)",
        "shelfLife": "30\u201345 days (5\u20137\u00b0C)",
        "certifications": [
          "GI Tagged",
          "APEDA"
        ],
        "description": "GI-tagged loose-jacket mandarin oranges packed with sweet-tangy juice, vibrant pebbled peel, and high natural ascorbic acid content.",
        "image": "/products/nagpur-orange.webp",
        "gallery": [
          "/products/nagpur-orange.webp",
          "/products/nagpur-orange-2.webp",
          "/products/nagpur-orange-3.webp"
        ],
        "alt": "Fresh Nagpur mandarin oranges with green leaf"
      },
      {
        "slug": "lemon",
        "name": "Lemon",
        "origin": "Nellore, Andhra Pradesh & Gujarat",
        "grade": "Kagzi Juicy Seedless Thin Skin (35\u201345mm)",
        "packaging": "6, 10 kg Corrugated Boxes",
        "moq": "Air Freight & Reefer FCL",
        "shelfLife": "30\u201340 days (8\u201310\u00b0C)",
        "certifications": [
          "APEDA",
          "Phytosanitary"
        ],
        "description": "Thin-skinned, highly aromatic Indian Kagzi lemons bursting with acidic juice (45%+ recovery) and essential peel oils for culinary and beverage blending.",
        "image": "/products/lemon.webp",
        "gallery": [
          "/products/lemon.webp",
          "/products/lemon-2.webp",
          "/products/lemon-3.webp"
        ],
        "alt": "Fresh juicy thin-skinned yellow Kagzi lemons"
      },
      {
        "slug": "papaya",
        "name": "Papaya",
        "origin": "Karnataka & Maharashtra",
        "grade": "Red Lady Taiwan Sweet 786 (1.0\u20131.8 kg)",
        "packaging": "6\u20138 kg Cartons with foam protection",
        "moq": "Air Freight & Reefer FCL",
        "shelfLife": "18\u201324 days (10\u201312\u00b0C)",
        "certifications": [
          "APEDA",
          "GlobalGAP"
        ],
        "description": "Firm-fleshed oblong Red Lady papayas with deep reddish-orange pulp, sweet musky aroma, thick skin for transit protection, and high papain enzymes.",
        "image": "/products/papaya.webp",
        "gallery": [
          "/products/papaya.webp",
          "/products/papaya-2.webp",
          "/products/papaya-3.webp"
        ],
        "alt": "Ripe sweet Red Lady papaya sliced showing red pulp"
      },
      {
        "slug": "pineapple",
        "name": "Pineapple",
        "origin": "Vazhakulam, Kerala & Assam",
        "grade": "GI Tagged Queen & MD2 Sweet Golden (1.2\u20131.8kg)",
        "packaging": "12 kg Horizontal / Vertical Cartons (6\u20138 Count)",
        "moq": "1 \u00d7 40ft Reefer FCL (18 MT)",
        "shelfLife": "21\u201328 days (8\u201310\u00b0C)",
        "certifications": [
          "GI Tagged",
          "APEDA",
          "Phytosanitary"
        ],
        "description": "GI-certified Vazhakulam Queen pineapples possessing pleasant golden pulp, fragrant aroma, crisp core, and rich sugar-acid balance.",
        "image": "/products/pineapple.webp",
        "gallery": [
          "/products/pineapple.webp",
          "/products/pineapple-2.webp",
          "/products/pineapple-3.webp"
        ],
        "alt": "Golden ripe sweet pineapple with crown"
      }
    ]
  },
  {
    "slug": "spices",
    "name": "Spices",
    "headline": "Whole & Ground Spices",
    "blurb": "Whole and ground Indian spices from Kerala, Rajasthan, and Andhra Pradesh, laboratory-certified by the Spices Board of India for purity and essential oils.",
    "image": "/products/turmeric.webp",
    "products": [
      {
        "slug": "turmeric",
        "name": "Turmeric (Finger & Powder)",
        "origin": "Erode, Tamil Nadu & Nizamabad",
        "grade": "Double Polished Fingers / Powder (Curcumin 3.0%\u20135.5%)",
        "packaging": "25, 50 kg Jute Bags / Multilayer Paper Sacks",
        "moq": "1 \u00d7 20ft FCL (18 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "Spices Board",
          "FSSAI",
          "ISO 22000",
          "Halal"
        ],
        "description": "Deep golden-yellow double-polished turmeric fingers and micro-pulverized powder with high bioactive curcumin content, low moisture, and zero lead chromate.",
        "image": "/products/turmeric.webp",
        "gallery": [
          "/products/turmeric.webp",
          "/products/turmeric-2.webp",
          "/products/turmeric-3.webp"
        ],
        "alt": "Polished whole turmeric fingers and ground turmeric powder"
      },
      {
        "slug": "guntur-red-chilli",
        "name": "Guntur Red Chilli",
        "origin": "Guntur, Andhra Pradesh",
        "grade": "S4 Sannam / Teja Stemless (SHU 35,000\u201375,000)",
        "packaging": "10, 25 kg Jute / PP Bags",
        "moq": "1 \u00d7 40ft HC FCL (14 MT)",
        "shelfLife": "18 months",
        "certifications": [
          "Spices Board",
          "FSSAI",
          "ASTA Clean"
        ],
        "description": "Intense fiery dried red chillies from India's chilli heartland, sun-dried to optimal moisture with deep crimson color values (ASTA 60\u2013100) and pungent kick.",
        "image": "/products/guntur-red-chilli.webp",
        "gallery": [
          "/products/guntur-red-chilli.webp",
          "/products/guntur-red-chilli-2.webp",
          "/products/guntur-red-chilli-3.webp"
        ],
        "alt": "Sun-dried fiery red chillies in basket"
      },
      {
        "slug": "black-pepper",
        "name": "Black Pepper",
        "origin": "Idukki & Wayanad, Kerala",
        "grade": "Malabar Garbled TGSEB (550\u2013570 g/l density)",
        "packaging": "25\u201350 kg Polypropylene / Jute Bags",
        "moq": "1 \u00d7 20ft FCL (15 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "Spices Board",
          "Rainforest Alliance",
          "FSSAI"
        ],
        "description": "Celebrated Black Gold of Malabar, high-density Tellicherry garbled black peppercorns delivering bold piperine kick (5\u20137%) and complex woody aromatics.",
        "image": "/products/black-pepper.webp",
        "gallery": [
          "/products/black-pepper.webp",
          "/products/black-pepper-2.webp",
          "/products/black-pepper-3.webp"
        ],
        "alt": "Whole dried black peppercorns on rustic stone"
      },
      {
        "slug": "cumin-seeds",
        "name": "Cumin Seeds",
        "origin": "Unjha, Gujarat & Rajasthan",
        "grade": "Singapore Quality (99%) & Europe Quality (99.5% Sortex)",
        "packaging": "25\u201350 kg Multi-ply Paper / PP Bags",
        "moq": "1 \u00d7 20ft FCL (18 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "Spices Board",
          "FSSAI",
          "BRCGS"
        ],
        "description": "Aromatic brown cumin seeds from Unjha's mega-mandis, mechanically cleaned and optical-sorted to eliminate weed seeds and ensure minimum 2.5% volatile oil.",
        "image": "/products/cumin-seeds.webp",
        "gallery": [
          "/products/cumin-seeds.webp",
          "/products/cumin-seeds-2.webp",
          "/products/cumin-seeds-3.webp"
        ],
        "alt": "Aromatic brown cumin seeds in brass bowl"
      },
      {
        "slug": "coriander-seeds",
        "name": "Coriander Seeds",
        "origin": "Ramganj Mandi, Rajasthan & MP",
        "grade": "Eagle / Scooter / Badami Whole Seeds",
        "packaging": "20\u201325 kg Poly Bags",
        "moq": "1 \u00d7 20ft FCL (10 MT)",
        "shelfLife": "18 months",
        "certifications": [
          "Spices Board",
          "FSSAI"
        ],
        "description": "Golden-green spherical coriander seeds with fresh citrus-floral bouquet and high linalool content, sorted for split-free whole kernel integrity.",
        "image": "/products/coriander-seeds.webp",
        "gallery": [
          "/products/coriander-seeds.webp",
          "/products/coriander-seeds-2.webp",
          "/products/coriander-seeds-3.webp"
        ],
        "alt": "Whole dried golden coriander seeds in dish"
      },
      {
        "slug": "green-cardamom",
        "name": "Green Cardamom",
        "origin": "Idukki Hills, Kerala",
        "grade": "Alleppey Green Extra Bold (AGEB 8mm+ Diameter)",
        "packaging": "5 kg \u00d7 2 Vacuum Cartons inside Master Case",
        "moq": "500 kg LCL / Air Freight",
        "shelfLife": "24 months",
        "certifications": [
          "Spices Board",
          "GI Tagged",
          "ISO 22000"
        ],
        "description": "Queen of Spices grown in the misty Cardamom Hills of Kerala, featuring large plump pods with intact black seeds and intense sweet cineole aroma.",
        "image": "/products/green-cardamom.webp",
        "gallery": [
          "/products/green-cardamom.webp",
          "/products/green-cardamom-2.webp",
          "/products/green-cardamom-3.webp"
        ],
        "alt": "Plump extra-bold green cardamom pods in ceramic dish"
      },
      {
        "slug": "cloves",
        "name": "Cloves",
        "origin": "Kanyakumari, Tamil Nadu & Kerala",
        "grade": "Zanzibar / Lal Pari Handpicked Bold Headed",
        "packaging": "10, 25 kg Cartons / Jute Bags",
        "moq": "1 \u00d7 20ft FCL (11 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "Spices Board",
          "FSSAI"
        ],
        "description": "Hand-picked whole dried flower buds with intact crown heads, dark reddish-brown body, and supreme eugenol essential oil concentration (18%+).",
        "image": "/products/cloves.webp",
        "gallery": [
          "/products/cloves.webp",
          "/products/cloves-2.webp",
          "/products/cloves-3.webp"
        ],
        "alt": "Handpicked whole dried cloves with intact crowns"
      },
      {
        "slug": "cinnamon",
        "name": "Cinnamon",
        "origin": "Kerala & Andaman",
        "grade": "Ceylon Alba & C5 Fine Quills",
        "packaging": "10\u201325 kg Master Cartons",
        "moq": "1 \u00d7 20ft FCL (8 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "Spices Board",
          "FSSAI"
        ],
        "description": "Paper-thin, multilayered rolled quills of true Ceylon cinnamon with delicate sweet taste, low coumarin content, and warm woody fragrance.",
        "image": "/products/cinnamon.webp",
        "gallery": [
          "/products/cinnamon.webp",
          "/products/cinnamon-2.webp",
          "/products/cinnamon-3.webp"
        ],
        "alt": "Rolled quills of true dried cinnamon sticks"
      },
      {
        "slug": "fenugreek-seeds",
        "name": "Fenugreek Seeds",
        "origin": "Rajasthan & Madhya Pradesh",
        "grade": "Machine Cleaned Bold Golden Seeds (99.5% Purity)",
        "packaging": "25\u201350 kg Polypropylene Bags",
        "moq": "1 \u00d7 20ft FCL (20 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "Spices Board",
          "FSSAI"
        ],
        "description": "Rhomboid golden-yellow fenugreek seeds with distinct bittersweet aroma and rich galactomannan soluble fiber, widely exported for curry blends and extracts.",
        "image": "/products/fenugreek-seeds.webp",
        "gallery": [
          "/products/fenugreek-seeds.webp",
          "/products/fenugreek-seeds-2.webp",
          "/products/fenugreek-seeds-3.webp"
        ],
        "alt": "Clean golden fenugreek seeds in dish"
      },
      {
        "slug": "fennel-seeds",
        "name": "Fennel Seeds",
        "origin": "Gujarat & Rajasthan",
        "grade": "Abu Road Green / Lucknowi Sweet Fennel",
        "packaging": "25\u201350 kg PP Bags",
        "moq": "1 \u00d7 20ft FCL (14 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "Spices Board",
          "FSSAI"
        ],
        "description": "Sweet, fragrant green-tinged fennel seeds with pronounced anethole sweetness, cleaned machine-wise to remove straw and foreign matter.",
        "image": "/products/fennel-seeds.webp",
        "gallery": [
          "/products/fennel-seeds.webp",
          "/products/fennel-seeds-2.webp",
          "/products/fennel-seeds-3.webp"
        ],
        "alt": "Fragrant green fennel seeds in bowl"
      },
      {
        "slug": "mustard-seeds",
        "name": "Mustard Seeds",
        "origin": "Rajasthan & Haryana",
        "grade": "Bold Black & Small Yellow Seeds (99.5% Sortex)",
        "packaging": "25\u201350 kg Poly Sacks",
        "moq": "1 \u00d7 20ft FCL (22 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "Spices Board",
          "FSSAI"
        ],
        "description": "Clean, spherical dark brown and black mustard seeds delivering sharp pungent sinigrin bite when tempered in oils, highly demanded by condiment makers.",
        "image": "/products/mustard-seeds.webp",
        "gallery": [
          "/products/mustard-seeds.webp",
          "/products/mustard-seeds-2.webp",
          "/products/mustard-seeds-3.webp"
        ],
        "alt": "Whole black Indian mustard seeds filling bronze dish"
      },
      {
        "slug": "star-anise",
        "name": "Star Anise",
        "origin": "Arunachal Pradesh & South India",
        "grade": "Autumn Crop Whole 8-Point Stars (Broken < 5%)",
        "packaging": "10 kg Master Corrugated Cartons",
        "moq": "1 \u00d7 20ft FCL (7 MT)",
        "shelfLife": "24 months",
        "certifications": [
          "Spices Board",
          "Phytosanitary"
        ],
        "description": "Aromatic 8-pointed star-shaped pericarp pods encasing glossy seed kernels, delivering intense liquorice and anethole sweetness to seasonings.",
        "image": "/products/star-anise.webp",
        "gallery": [
          "/products/star-anise.webp",
          "/products/star-anise-2.webp",
          "/products/star-anise-3.webp"
        ],
        "alt": "Whole dried 8-pointed star anise pods in wooden bowl"
      },
      {
        "slug": "bay-leaf",
        "name": "Bay Leaf (Tejpatta)",
        "origin": "Uttarakhand & Meghalaya",
        "grade": "Wild Harvested Sun Dried Whole Greenish Leaves",
        "packaging": "10\u201315 kg Bales / Cartons",
        "moq": "1 \u00d7 20ft FCL (6 MT)",
        "shelfLife": "18 months",
        "certifications": [
          "Spices Board",
          "FSSAI"
        ],
        "description": "Authentic Indian bay leaves (Cinnamomum tamala) with prominent three-ribbed veins, possessing warm clove-cinnamon nuances distinct from laurel bay.",
        "image": "/products/bay-leaf.webp",
        "gallery": [
          "/products/bay-leaf.webp",
          "/products/bay-leaf-2.webp",
          "/products/bay-leaf-3.webp"
        ],
        "alt": "Whole dried Indian bay leaves tejpatta with three distinct veins"
      },
      {
        "slug": "garam-masala",
        "name": "Garam Masala",
        "origin": "Mumbai & Gujarat",
        "grade": "Signature 12-Spice Roasted Aromatic Blend",
        "packaging": "1, 5, 25 kg Nitrogen Flushed Foil Pouches",
        "moq": "500 kg LCL / 20ft FCL",
        "shelfLife": "18 months",
        "certifications": [
          "FSSAI",
          "Spices Board",
          "BRCGS"
        ],
        "description": "Proprietary slow-roasted blend of cardamom, cinnamon, cloves, mace, cumin, and black pepper, micro-ground into a velvety, warming spice mix.",
        "image": "/products/garam-masala.webp",
        "gallery": [
          "/products/garam-masala.webp",
          "/products/garam-masala-2.webp",
          "/products/garam-masala-3.webp"
        ],
        "alt": "Freshly ground royal Garam Masala spice blend in bowl"
      }
    ]
  },
  {
    "slug": "natural-stones-tiles",
    "name": "Natural Stones & Tiles",
    "headline": "Quarried Stones, Slabs & Tiles",
    "blurb": "Architectural marbles, granites, sandstones and vitrified tiles from Rajasthan and Morbi, gangsaw cut, calibrated, and packed in fumigated ISPM-15 wooden crates.",
    "image": "/products/makrana-white-marble.webp",
    "products": [
      {
        "slug": "makrana-white-marble",
        "name": "Makrana White Marble",
        "origin": "Makrana, Rajasthan",
        "grade": "Pure Calcite Marble Slabs & Tiles (98% CaCO3)",
        "packaging": "Fumigated Euro-spec Wooden A-frames & Crates",
        "moq": "1 \u00d7 20ft Heavy FCL (400 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "ISO 9001",
          "ASTM C503",
          "ISPM-15"
        ],
        "description": "The historic pure white calcite stone used to build the Taj Mahal. Virtually impervious to water absorption, high mirror polish, and enduring luster.",
        "image": "/products/makrana-white-marble.webp",
        "gallery": [
          "/products/makrana-white-marble.webp",
          "/products/makrana-white-marble-2.webp",
          "/products/makrana-white-marble-3.webp"
        ],
        "alt": "Polished Makrana white marble slab surface with delicate grey veining"
      },
      {
        "slug": "statuario-marble",
        "name": "Statuario Marble",
        "origin": "Rajasthan & Processed Hubs",
        "grade": "First Choice Gangsaw Slabs (18mm, 20mm thickness)",
        "packaging": "Heavy Wooden Crates with plastic separators",
        "moq": "1 \u00d7 20ft Heavy FCL (380 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "CE Certified",
          "ISO 9001"
        ],
        "description": "Ultra-luxury white marble with dramatic contrasting grey veining patterns, book-matched for seamless interior feature walls and flooring.",
        "image": "/products/statuario-marble.webp",
        "gallery": [
          "/products/statuario-marble.webp",
          "/products/statuario-marble-2.webp",
          "/products/statuario-marble-3.webp"
        ],
        "alt": "Statuario white marble slab with bold dramatic grey veins"
      },
      {
        "slug": "indian-green-marble",
        "name": "Indian Green Marble",
        "origin": "Udaipur & Dungarpur, Rajasthan",
        "grade": "Forest Green & Emerald Polished Slabs",
        "packaging": "Seaworthy Treated Wooden Bundles",
        "moq": "1 \u00d7 20ft Heavy FCL (420 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "ASTM C503",
          "ISPM-15"
        ],
        "description": "Vibrant serpentine green marble featuring rich emerald tones and fine dark mineral webbing, offering superior compressive strength for countertops and paving.",
        "image": "/products/indian-green-marble.webp",
        "gallery": [
          "/products/indian-green-marble.webp",
          "/products/indian-green-marble-2.webp",
          "/products/indian-green-marble-3.webp"
        ],
        "alt": "Deep emerald green marble slab texture with natural webbing"
      },
      {
        "slug": "black-galaxy-granite",
        "name": "Black Galaxy Granite",
        "origin": "Chimakurthy, Ongole, Andhra Pradesh",
        "grade": "Pitch Black with Golden Bronzite Crystals (Gangsaw Slabs)",
        "packaging": "Fumigated Wooden A-Frames",
        "moq": "1 \u00d7 20ft Heavy FCL (380 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "ASTM C615",
          "CE Mark",
          "ISPM-15"
        ],
        "description": "Deep obsidian-black igneous granite embedded with naturally glistening golden and copper flecks, prized globally for upscale kitchens and facades.",
        "image": "/products/black-galaxy-granite.webp",
        "gallery": [
          "/products/black-galaxy-granite.webp",
          "/products/black-galaxy-granite-2.webp",
          "/products/black-galaxy-granite-3.webp"
        ],
        "alt": "Polished Black Galaxy granite slab with golden crystalline flecks"
      },
      {
        "slug": "tan-brown-granite",
        "name": "Tan Brown Granite",
        "origin": "Karimnagar, Telangana",
        "grade": "Dark Brown with Reddish-Black Crystals (18mm/20mm/30mm)",
        "packaging": "Heavy Wooden Bundles with edge guards",
        "moq": "1 \u00d7 20ft Heavy FCL (400 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "ASTM C615",
          "CE Mark"
        ],
        "description": "Hard-wearing magmatic granite with rich chocolate-brown matrix and crimson-black floral crystals, highly resistant to weathering and acid stains.",
        "image": "/products/tan-brown-granite.webp",
        "gallery": [
          "/products/tan-brown-granite.webp",
          "/products/tan-brown-granite-2.webp",
          "/products/tan-brown-granite-3.webp"
        ],
        "alt": "Tan Brown granite slab surface with dark crystal blooms"
      },
      {
        "slug": "kashmir-white-granite",
        "name": "Kashmir White Granite",
        "origin": "Madurai, Tamil Nadu",
        "grade": "Snow White with Burgundy Garnet Flecks",
        "packaging": "ISPM-15 Wooden Crates",
        "moq": "1 \u00d7 20ft Heavy FCL (400 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "ASTM C615",
          "ISO 9001"
        ],
        "description": "Elegant white granite with subtle mint undertones and tiny burgundy garnets, delivering a soft contemporary architectural ambiance.",
        "image": "/products/kashmir-white-granite.webp",
        "gallery": [
          "/products/kashmir-white-granite.webp",
          "/products/kashmir-white-granite-2.webp",
          "/products/kashmir-white-granite-3.webp"
        ],
        "alt": "Kashmir White granite surface with garnet mineral flecks"
      },
      {
        "slug": "rainbow-sandstone",
        "name": "Rainbow Sandstone",
        "origin": "Khatu, Nagaur, Rajasthan",
        "grade": "Fine-Grained Sawn Slabs & Calibrated Paving Tiles",
        "packaging": "Wooden Pallets with plastic corner caps",
        "moq": "1 \u00d7 20ft FCL (450 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "ASTM C616",
          "ISPM-15"
        ],
        "description": "Naturally layered sedimentary stone showing vibrant swirls of violet, brown, yellow and red, widely used for exterior pool decks and patio paving.",
        "image": "/products/rainbow-sandstone.webp",
        "gallery": [
          "/products/rainbow-sandstone.webp",
          "/products/rainbow-sandstone-2.webp",
          "/products/rainbow-sandstone-3.webp"
        ],
        "alt": "Natural layered Rainbow sandstone texture with wave veining"
      },
      {
        "slug": "kota-limestone",
        "name": "Kota Limestone",
        "origin": "Kota & Ramganjmandi, Rajasthan",
        "grade": "Kota Blue & Kota Brown (Honed / Polished / Rough)",
        "packaging": "Wooden Palletized Crates",
        "moq": "1 \u00d7 20ft Heavy FCL (500 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "ASTM C568",
          "ISO 9001"
        ],
        "description": "Fine-grained dolomite limestone in cool bluish-grey and warm brown hues, naturally non-slip, extremely tough, and ideal for heavy pedestrian traffic.",
        "image": "/products/kota-limestone.webp",
        "gallery": [
          "/products/kota-limestone.webp",
          "/products/kota-limestone-2.webp",
          "/products/kota-limestone-3.webp"
        ],
        "alt": "Honed Kota blue and brown limestone paving slabs"
      },
      {
        "slug": "himachal-slate",
        "name": "Himachal Slate",
        "origin": "Kangra Valley, Himachal Pradesh",
        "grade": "Silver Grey, Black & Multi-Color Natural Cleft",
        "packaging": "Export Wooden Crates",
        "moq": "1 \u00d7 20ft FCL (500 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "ASTM C406",
          "ISPM-15"
        ],
        "description": "Metamorphic foliated stone splitting into fine, textured slabs with natural cleft finish, ideal for rustic roofing, garden stepping stones, and wall cladding.",
        "image": "/products/himachal-slate.webp",
        "gallery": [
          "/products/himachal-slate.webp",
          "/products/himachal-slate-2.webp",
          "/products/himachal-slate-3.webp"
        ],
        "alt": "Natural cleft Himachal slate stone texture"
      },
      {
        "slug": "quartzite",
        "name": "Quartzite",
        "origin": "Deoli, Rajasthan",
        "grade": "Golden, Copper & Silver Cleft Flagstones",
        "packaging": "Heavy Wooden Pallets",
        "moq": "1 \u00d7 20ft FCL (450 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "ASTM C616",
          "ISO 9001"
        ],
        "description": "Ultra-hard metamorphic quartz sandstone with crystalline shimmer, completely frost-proof and acid-resistant for interior and exterior flooring.",
        "image": "/products/quartzite.webp",
        "gallery": [
          "/products/quartzite.webp",
          "/products/quartzite-2.webp",
          "/products/quartzite-3.webp"
        ],
        "alt": "Golden cleft quartzite architectural stone surface"
      },
      {
        "slug": "vitrified-tiles",
        "name": "Vitrified Tiles",
        "origin": "Morbi, Gujarat",
        "grade": "Double Charge & Glazed Porcelain (600\u00d7600, 600\u00d71200mm)",
        "packaging": "Export corrugated cartons with corner caps",
        "moq": "1 \u00d7 20ft FCL (1400 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "ISO 13006 Group BIa",
          "CE Mark"
        ],
        "description": "Dense vitrified porcelain tiles pressed under 7200 tonnes, nano-polished for scratch resistance, water absorption under 0.05%, and heavy footfall durability.",
        "image": "/products/vitrified-tiles.webp",
        "gallery": [
          "/products/vitrified-tiles.webp",
          "/products/vitrified-tiles-2.webp",
          "/products/vitrified-tiles-3.webp"
        ],
        "alt": "High-gloss polished vitrified porcelain floor tile sample"
      },
      {
        "slug": "porcelain-tiles",
        "name": "Porcelain Tiles",
        "origin": "Morbi, Gujarat",
        "grade": "Large Format Sintered Slabs (800\u00d71600mm, 1200\u00d72400mm)",
        "packaging": "Euro-spec wooden A-frames & heavy pallets",
        "moq": "1 \u00d7 20ft FCL (1000 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "CE Certified",
          "Green Building LEED"
        ],
        "description": "Large sintered porcelain slabs reproducing fine Calacatta and Statuario veins, ideal for joint-free kitchen countertops, bathroom vanities, and facades.",
        "image": "/products/porcelain-tiles.webp",
        "gallery": [
          "/products/porcelain-tiles.webp",
          "/products/porcelain-tiles-2.webp",
          "/products/porcelain-tiles-3.webp"
        ],
        "alt": "Large format sintered porcelain slab tile texture"
      },
      {
        "slug": "ceramic-wall-tiles",
        "name": "Ceramic Wall Tiles",
        "origin": "Morbi, Gujarat",
        "grade": "Glossy & Matte Digital Glazed (300\u00d7600mm, 300\u00d7450mm)",
        "packaging": "Corrugated Cartons on shrink-wrapped pallets",
        "moq": "1 \u00d7 20ft FCL (1800 sq.m)",
        "shelfLife": "Permanent",
        "certifications": [
          "ISO 13006 / EN 14411",
          "CE"
        ],
        "description": "High-definition inkjet printed ceramic wall tiles with stain-resistant protective glaze, lightweight clay body, and modern geometric motifs.",
        "image": "/products/ceramic-wall-tiles.webp",
        "gallery": [
          "/products/ceramic-wall-tiles.webp",
          "/products/ceramic-wall-tiles-2.webp",
          "/products/ceramic-wall-tiles-3.webp"
        ],
        "alt": "Glazed ceramic wall tile sample with marble veining"
      },
      {
        "slug": "cobblestones",
        "name": "Cobblestones",
        "origin": "Rajasthan & Karnataka",
        "grade": "Hand-Cut Granite Cobbles (10\u00d710\u00d710cm, 10\u00d710\u00d75cm)",
        "packaging": "Loose Heavy Crates / 1 MT Big Bags",
        "moq": "1 \u00d7 20ft FCL (27 MT)",
        "shelfLife": "Permanent",
        "certifications": [
          "CE Certified",
          "ASTM C615"
        ],
        "description": "Six-sided natural cleft granite pavers creating timeless European-style driveways, plazas, and pedestrian walkways with extreme wheel-load endurance.",
        "image": "/products/cobblestones.webp",
        "gallery": [
          "/products/cobblestones.webp",
          "/products/cobblestones-2.webp",
          "/products/cobblestones-3.webp"
        ],
        "alt": "Hand-cut natural cleft granite cobblestone pavers"
      },
      {
        "slug": "pebbles-river-gravel",
        "name": "Pebbles & River Gravel",
        "origin": "Narmada River & Haridwar",
        "grade": "Tumble-Polished River Pebbles (10\u201325mm, 25\u201350mm)",
        "packaging": "25 kg Poly bags inside 1 MT Jumbo Bags",
        "moq": "1 \u00d7 20ft FCL (27 MT)",
        "shelfLife": "Permanent",
        "certifications": [
          "ISO 9001"
        ],
        "description": "Naturally water-rounded silica pebbles in black, white, and ochre, tumble-polished for aquarium hardscaping, terrazzo flooring, and Japanese zen gardens.",
        "image": "/products/pebbles-river-gravel.webp",
        "gallery": [
          "/products/pebbles-river-gravel.webp",
          "/products/pebbles-river-gravel-2.webp",
          "/products/pebbles-river-gravel-3.webp"
        ],
        "alt": "Tumble-polished smooth river pebbles and decorative gravel"
      }
    ]
  }
];

export const allProducts: (Product & { category: Category })[] = categories.flatMap((c) =>
  c.products.map((p) => ({ ...p, category: c }))
);

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(catSlug: string, prodSlug: string): Product | undefined {
  const c = getCategory(catSlug);
  return c?.products.find((p) => p.slug === prodSlug);
}
