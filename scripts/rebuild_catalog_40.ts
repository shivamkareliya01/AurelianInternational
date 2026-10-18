import fs from "fs";
import path from "path";
import { categories, Product } from "../src/data/products";

// 1. Existing 10 restored powders specs:
const RESTORED_10: Omit<Product, "image" | "gallery">[] = [
  {
    slug: "beetroot-powder",
    name: "Beetroot Powder",
    origin: "Belgaum, Karnataka & Maharashtra",
    grade: "Spray-Dried Superfine (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
    shelfLife: "24 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
    description: "Pure deep-magenta beetroot powder prepared from sweet, earth-grown beets, valued as a clean-label natural food colorant and nitric oxide-boosting nutrient. Extensively exported for pre-workout sports nutrition, red velvet bakery items, smoothies, and cosmetics. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
    alt: "Vivid magenta-purple beetroot powder in a wooden bowl beside whole and halved ruby-red beetroots"
  },
  {
    slug: "carrot-powder",
    name: "Carrot Powder",
    origin: "Punjab & Rajasthan",
    grade: "Air-Dried & Spray-Dried (Mesh 80–100)",
    packaging: "20–25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 11 MT",
    shelfLife: "24 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
    description: "Sweet, golden-orange powder milled from freshly washed and peeled Indian carrots, retaining natural provitamin A carotenoids and earthy sweetness. Widely utilized in baby food purées, instant soups, natural confectionery colorants, and wellness drink powders. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
    alt: "Bright golden-orange carrot powder in a wooden bowl beside fresh whole crisp orange carrots with leafy green tops"
  },
  {
    slug: "green-chilli-powder",
    name: "Green Chilli Powder",
    origin: "Anand, Gujarat & Guntur, Andhra Pradesh",
    grade: "Low-Temperature Dehydrated (Mesh 80–100)",
    packaging: "20 kg poly-lined cartons, 25 kg paper bags, private-label packs on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 10 MT",
    shelfLife: "18 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000"],
    description: "Crisp, piquant powder produced from fresh green chillies dehydrated under controlled low temperatures to safeguard bright green color and sharp capsaicin punch. Perfect for namkeen snack seasonings, Mexican salsa dry blends, chutneys, and instant ramen bases. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
    alt: "Sharp olive green chilli powder in a wooden bowl beside vibrant spicy fresh whole green chillies"
  },
  {
    slug: "pumpkin-powder",
    name: "Pumpkin Powder",
    origin: "Madhya Pradesh & Karnataka",
    grade: "Spray & Air-Dried (Mesh 80–100)",
    packaging: "20 kg poly-lined paper cartons, 25 kg paper bags, private-label packs on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 11 MT",
    shelfLife: "24 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000"],
    description: "Golden-yellow powder made from sweet ripened pumpkins, offering natural dietary fiber, carotenoids, and a mild nutty sweetness. Favored across Europe and North America for pumpkin spice blends, bakery mixes, pet food nutrition, and culinary thickening. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
    alt: "Golden orange pumpkin powder in a wooden bowl beside freshly cut ripe golden pumpkin wedges"
  },
  {
    slug: "mango-powder-amchur",
    name: "Mango Powder (Amchur)",
    origin: "Uttar Pradesh & Gujarat",
    grade: "Sun & Air-Dried Fine (Mesh 60–80)",
    packaging: "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
    shelfLife: "24 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000"],
    description: "Traditional Indian Amchur ground from unripe green mangoes, celebrated for delivering clean, sour, fruity acidity without adding liquid. An essential souring agent for chaat seasonings, samosa fillings, barbecue rubs, marinades, and sour confectionery. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
    alt: "Pale golden-beige mango amchur powder in a wooden bowl beside sun-dried slices and fresh raw green mango"
  },
  {
    slug: "banana-powder",
    name: "Banana Powder",
    origin: "Jalgaon, Maharashtra & Tamil Nadu",
    grade: "Spray & Drum-Dried (Mesh 80–100)",
    packaging: "20–25 kg nitrogen-flushed foil bags in cartons, private-label packs on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 10 MT",
    shelfLife: "18 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000", "HACCP"],
    description: "Creamy, highly digestible fruit powder processed from sun-ripened Indian Cavendish and Robusta bananas, packed with potassium and natural prebiotic fibers. Widely exported for infant feeding cereals, protein shake mixes, gluten-free baking, and dairy desserts. Typical specification, confirmed by the lab report for each batch (moisture ≤ 5.0%, no added colors or preservatives).",
    alt: "Creamy off-white banana powder in a wooden bowl beside fresh ripe and unpeeled bananas"
  },
  {
    slug: "lemon-powder",
    name: "Lemon Powder",
    origin: "Saurashtra, Gujarat & Andhra Pradesh",
    grade: "Spray-Dried Fruit Powder (Mesh 80–100)",
    packaging: "20 kg foil-sealed bags in cartons, 25 kg paper bags, private-label packs on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 11 MT",
    shelfLife: "18 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000", "BRCGS"],
    description: "Tangy, spray-dried citrus powder crafted from fragrant Kagzi lemons, preserving volatile limonene notes and natural citric acid sharpness. An indispensable ingredient for powdered drink mixes, lemon pepper seasonings, marinades, and confectionery glazes. Typical specification, confirmed by the lab report for each batch (moisture ≤ 4.5%, no added colors or preservatives).",
    alt: "Pale zesty lemon yellow powder in a wooden bowl beside fresh whole and juicy halved yellow lemons"
  },
  {
    slug: "amla-powder",
    name: "Amla Powder",
    origin: "Pratapgarh, Uttar Pradesh & Gujarat",
    grade: "Shade-Dried Botanical Powder (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 10–12 MT",
    shelfLife: "24 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000"],
    description: "Potent botanical powder milled from Indian gooseberries (Phyllanthus emblica), famous as nature's richest stable source of antioxidant Vitamin C and polyphenols. Extensively utilized in dietary supplements, immunity tonics, herbal hair treatments, and holistic cosmetics. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
    alt: "Nutritious greenish-brown amla powder in a wooden bowl beside whole fresh green Indian gooseberries"
  },
  {
    slug: "aloe-vera-powder",
    name: "Aloe Vera Powder",
    origin: "Jodhpur, Rajasthan & Gujarat",
    grade: "Spray-Dried 100:1 Inner Gel Powder (Mesh 80–100)",
    packaging: "10–20 kg aluminum foil barrier bags in cartons, private-label packs on request",
    moq: "500 kg – 1 MT (samples available); 1 × 20ft FCL about 10 MT",
    shelfLife: "24 months",
    certifications: ["FSSAI", "ISO 22000", "HACCP"],
    description: "Ultra-concentrated inner-leaf fillet gel powder derived from organically cultivated Aloe barbadensis Miller, gently spray-dried to maintain biological activity. Exported globally for premium skincare, soothing digestive formulas, cosmetic lotions, and functional beverages. Typical specification, confirmed by the lab report for each batch (moisture ≤ 5.0%, no added colors or preservatives).",
    alt: "Pale soothing beige-green aloe vera powder in a wooden bowl beside a thick freshly sliced aloe vera leaf revealing clear gel"
  },
  {
    slug: "hibiscus-powder",
    name: "Hibiscus Powder",
    origin: "Salem, Tamil Nadu & Karnataka",
    grade: "Air & Shadow-Dried Botanical (Mesh 80–100)",
    packaging: "20 kg paper bags with food-grade liner, 10 kg cartons, private-label packs on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 10 MT",
    shelfLife: "24 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000"],
    description: "Striking deep-burgundy botanical powder harvested from sun-dried Hibiscus sabdariffa calyces, providing natural anthocyanin pigmentation and tart fruity tang. Popular in artisan herbal teas, gin infusions, natural cosmetic blushes, and functional wellness beverages. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
    alt: "Deep crimson ruby-red hibiscus powder in a wooden bowl beside whole dried and fresh ruby-red hibiscus petals"
  }
];

// 2. 18 new botanical/food powders:
const NEW_18: Omit<Product, "image" | "gallery">[] = [
  {
    slug: "tulsi-holy-basil-leaf-powder",
    name: "Tulsi (Holy Basil) Leaf Powder",
    origin: "Uttar Pradesh & Madhya Pradesh",
    grade: "Air-Dried Botanical (Mesh 60–80)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 9 MT",
    shelfLife: "24 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000"],
    description: "Sacred green tulsi powder milled from shade-dried Ocimum sanctum foliage, offering warm clove-like pungency and sweet herbal undertones. Revered for ayurvedic wellness teas, functional beverage infusions, and natural herbal supplements. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
    alt: "Deep olive green tulsi holy basil leaf powder in a wooden bowl beside fresh sacred tulsi leaves"
  },
  {
    slug: "neem-leaf-powder",
    name: "Neem Leaf Powder",
    origin: "Rajasthan & Gujarat",
    grade: "Controlled Air-Dried (Mesh 60–80)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 9 MT",
    shelfLife: "24 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000"],
    description: "Deep forest green neem leaf powder harvested from mature Azadirachta indica foliage, carrying an intensely bitter herbal taste and rich limonoid content. Widely specified for ayurvedic health formulations, organic cosmetic cleansing bars, and herbal skin applications. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
    alt: "Rich forest green neem leaf powder in a wooden bowl beside fresh bitter neem sprigs and pinnate leaves"
  },
  {
    slug: "ashwagandha-root-powder",
    name: "Ashwagandha Root Powder",
    origin: "Madhya Pradesh & Rajasthan",
    grade: "Air-Dried Superfine (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 11 MT",
    shelfLife: "24 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000", "HACCP"],
    description: "Pale tan-beige adaptogenic root powder milled from graded Withania somnifera rhizomes, prized for its characteristic earthy aroma and bitter withanolide profile. A cornerstone ingredient in premium adaptogenic beverage mixes, dietary capsules, and nutraceutical formulas worldwide. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
    alt: "Pale earthy tan-beige ashwagandha root powder in a wooden bowl beside whole dried ashwagandha roots"
  },
  {
    slug: "shatavari-root-powder",
    name: "Shatavari Root Powder",
    origin: "Uttar Pradesh & Uttarakhand",
    grade: "Air-Dried Superfine (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 11 MT",
    shelfLife: "24 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000"],
    description: "Creamy ivory-beige botanical root powder produced from peeled Asparagus racemosus tubers, known for its sweet, mildly bitter taste and restorative tonic properties. Extensively utilized in herbal wellness teas, women's vitality formulations, and functional food premixes. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
    alt: "Creamy ivory-beige shatavari root powder in a wooden bowl beside peeled succulent shatavari roots"
  },
  {
    slug: "wheatgrass-powder",
    name: "Wheatgrass Powder",
    origin: "Punjab & Haryana",
    grade: "Dehydrated Superfine (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 8 MT",
    shelfLife: "18 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000"],
    description: "Vibrant emerald green cereal grass powder dehydrated from young organic Triticum aestivum shoots, packed with bioavailable chlorophyll and sweet grassy notes. An essential superfood component for detox green drinks, smoothie blends, and functional wellness shots. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
    alt: "Vibrant chlorophyll green wheatgrass powder in a wooden bowl beside fresh young green wheatgrass blades"
  },
  {
    slug: "okra-lady-finger-powder",
    name: "Okra (Lady Finger) Powder",
    origin: "Gujarat & Maharashtra",
    grade: "Air-Dried Superfine (Mesh 60–80)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 9 MT",
    shelfLife: "18 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000"],
    description: "Light moss-green functional vegetable powder derived from tender Abelmoschus esculentus pods, characterized by mild vegetal sweetness and natural thickening mucilage. Extensively incorporated into instant soups, gluten-free baking blends, sauce thickeners, and dietary fiber supplements. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
    alt: "Light moss green okra lady finger powder in a wooden bowl beside fresh whole and sliced green okra pods"
  },
  {
    slug: "bitter-gourd-karela-powder",
    name: "Bitter Gourd (Karela) Powder",
    origin: "Gujarat & Maharashtra",
    grade: "Dehydrated Fine (Mesh 60–80)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 9 MT",
    shelfLife: "18 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000"],
    description: "Medium olive green botanical powder made from mature Momordica charantia fruits, carrying a potent bitter profile rich in charantin and polypeptide-p. Favored globally for blood sugar support blends, detox drink premixes, and traditional herbal infusions. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
    alt: "Medium olive green bitter gourd karela powder in a wooden bowl beside fresh whole and round slices of bitter gourd"
  },
  {
    slug: "papaya-powder",
    name: "Papaya Powder",
    origin: "Gujarat & Andhra Pradesh",
    grade: "Spray-Dried & Air-Dried (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 11 MT",
    shelfLife: "18 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000"],
    description: "Golden orange-yellow fruit powder milled from tree-ripened Carica papaya fruit pulp, delivering natural fruit sweetness and active papain enzymes. Highly prized in digestive wellness drink mixes, baby foods, fruit confections, and enzyme-active cosmetics. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
    alt: "Warm golden orange papaya powder in a wooden bowl beside fresh ripe halved papaya showing glistening black seeds"
  },
  {
    slug: "pomegranate-anardana-powder",
    name: "Pomegranate (Anardana) Powder",
    origin: "Solapur, Maharashtra",
    grade: "Air-Dried Fine (Mesh 60–80)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 10 MT",
    shelfLife: "18 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000"],
    description: "Deep ruby maroon fruit powder prepared from dried Indian pomegranate arils, offering an appetizing sweet-tart acidity and rich punicalagin polyphenols. Ideal for savory meat rubs, barbecue glaze mixes, artisan snack dustings, and beverage flavorings. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
    alt: "Deep ruby maroon pomegranate powder in a wooden bowl beside fresh split pomegranates with juicy arils"
  },
  {
    slug: "guava-powder",
    name: "Guava Powder",
    origin: "Allahabad, Uttar Pradesh",
    grade: "Spray-Dried Superfine (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 11 MT",
    shelfLife: "18 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000"],
    description: "Delicate creamy soft beige-pink fruit powder spray-dried from fragrant Allahabad safeda guavas, brimming with tropical aroma and natural vitamin C. A staple for tropical juice reconstitution, dairy yoghurt flavorings, fruit dessert mixes, and confectionery dusting. Typical specification, confirmed by the lab report for each batch (moisture ≤ 5.5%, no added colors or preservatives).",
    alt: "Pale creamy guava powder in a wooden bowl beside fresh ripe whole and cut Indian guavas"
  },
  {
    slug: "jamun-black-plum-powder",
    name: "Jamun (Black Plum) Powder",
    origin: "Maharashtra & Karnataka",
    grade: "Controlled Air-Dried (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 10 MT",
    shelfLife: "24 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000"],
    description: "Deep royal purple-indigo fruit powder dehydrated from fresh Syzygium cumini berries, providing an astringent, pleasantly tart flavor packed with anthocyanins. Popular in glycemic wellness formulations, functional berry juices, and natural food coloring blends. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
    alt: "Deep royal purple-indigo jamun black plum powder in a wooden bowl beside ripe glossy whole and halved jamun berries"
  },
  {
    slug: "tamarind-powder",
    name: "Tamarind Powder",
    origin: "Karnataka & Andhra Pradesh",
    grade: "Spray-Dried Superfine (Mesh 60–80)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 11 MT",
    shelfLife: "24 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000"],
    description: "Rich caramel brown fruit powder spray-dried from mature Tamarindus indica pulp, delivering concentrated tartaric tang and savory fruity acidity. Widely utilized in instant curry paste seasonings, chat seasonings, barbecue marinades, and sour confectionery blends. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
    alt: "Rich caramel brown tamarind powder in a wooden bowl beside whole tamarind pods with sticky dark pulp"
  },
  {
    slug: "kokum-powder",
    name: "Kokum Powder",
    origin: "Konkan, Maharashtra & Goa",
    grade: "Shadow-Dried Botanical (Mesh 60–80)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 10 MT",
    shelfLife: "24 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000"],
    description: "Dark purple-black botanical powder processed from wild Garcinia indica rinds, delivering a distinctive fruity-sour tang loaded with hydroxycitric acid (HCA). Highly sought-after for coastal curry seasoning, refreshing digestive sherbets, and weight-management wellness blends. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
    alt: "Deep dark purple-black kokum powder in a wooden bowl beside dried dark purple kokum fruit rinds"
  },
  {
    slug: "coconut-milk-powder",
    name: "Coconut Milk Powder",
    origin: "Kerala & Tamil Nadu",
    grade: "Spray-Dried Superfine (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 12 MT",
    shelfLife: "18 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000", "BRCGS"],
    description: "Pure snow-white culinary powder spray-dried from freshly pressed mature coconut cream, possessing rich tropical sweetness and velvety mouthfeel. Readily dissolves into instant coconut milk or cream for curries, bakery glazes, smoothies, and vegan dairy alternatives. Typical specification, confirmed by the lab report for each batch (moisture ≤ 3.5%, no added colors or preservatives).",
    alt: "Pure snow white coconut milk powder in a wooden bowl beside fresh cracked coconut halves showing white flesh"
  },
  {
    slug: "butterfly-pea-flower-powder",
    name: "Butterfly Pea Flower Powder",
    origin: "Karnataka & Tamil Nadu",
    grade: "Controlled Air-Dried (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 8 MT",
    shelfLife: "24 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000"],
    description: "Vivid electric sapphire blue botanical powder milled from harvested Clitoria ternatea blossoms, celebrated for mild floral notes and pH-sensitive color-changing properties. Widely exported for artisan color-changing teas, cocktail syrups, natural food colorings, and wellness beverages. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
    alt: "Vivid electric sapphire blue butterfly pea flower powder in a wooden bowl beside fresh blue butterfly pea blossoms"
  },
  {
    slug: "rose-petal-powder",
    name: "Rose Petal Powder",
    origin: "Karnataka & Uttar Pradesh",
    grade: "Shadow-Dried Botanical (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 8 MT",
    shelfLife: "24 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000"],
    description: "Soft blush pink aromatic powder milled from organically grown Indian Damask rose petals, imbued with a delicate floral perfume and soothing cooling taste. Valued for luxury herbal tea blends, confectionery dusting, premium ayurvedic skincare, and wellness infusions. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.5%, no added colors or preservatives).",
    alt: "Soft blush pink rose petal powder in a wooden bowl beside fresh fragrant Indian Damask rose petals"
  },
  {
    slug: "purple-sweet-potato-powder",
    name: "Purple Sweet Potato Powder",
    origin: "Odisha & Gujarat",
    grade: "Dehydrated Superfine (Mesh 80–100)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 11 MT",
    shelfLife: "18 months",
    certifications: ["APEDA", "FSSAI", "ISO 22000"],
    description: "Intense violet purple vegetable powder made from dehydrated purple-fleshed Ipomoea batatas tubers, providing a mildly sweet nutty flavor and concentrated anthocyanins. Extensively used in bakery doughs, purple pasta, bubble tea powders, and natural vibrant food colorings. Typical specification, confirmed by the lab report for each batch (moisture ≤ 6.0%, no added colors or preservatives).",
    alt: "Intense vibrant violet purple sweet potato powder in a wooden bowl beside fresh whole and sliced purple sweet potatoes"
  },
  {
    slug: "lemongrass-powder",
    name: "Lemongrass Powder",
    origin: "Kerala & Karnataka",
    grade: "Air-Dried Fine (Mesh 60–80)",
    packaging: "25 kg paper bags with food-grade liner, private label on request",
    moq: "1 MT (samples available); 1 × 20ft FCL about 8 MT",
    shelfLife: "24 months",
    certifications: ["Spices Board", "FSSAI", "ISO 22000"],
    description: "Pale sage straw-green botanical powder ground from tender Cymbopogon citratus stalks, offering an exhilarating citrus-herbal aroma and crisp lemon flavor. Essential for Southeast Asian soup seasonings, ready-to-drink herbal tea sachets, and citrus spice rubs. Typical specification, confirmed by the lab report for each batch (moisture ≤ 7.0%, no added colors or preservatives).",
    alt: "Pale sage straw-green lemongrass powder in a wooden bowl beside freshly cut stalks and blades of fragrant lemongrass"
  }
];

// Current 12 powders in categories:
const dehydratedCat = categories.find(c => c.slug === "dehydrated-powders")!;
const existingMap = new Map<string, Product>();
for (const p of dehydratedCat.products) {
  existingMap.set(p.slug, p);
}

// Map restored and new powders to full Product
const fullRestored: Product[] = RESTORED_10.map(p => ({
  ...p,
  image: `/products/${p.slug}.webp`,
  gallery: [
    `/products/${p.slug}.webp`,
    `/products/${p.slug}-ingredient.webp`,
    `/products/${p.slug}-2.webp`,
    `/products/${p.slug}-3.webp`,
  ]
}));

const fullNew18: Product[] = NEW_18.map(p => ({
  ...p,
  image: `/products/${p.slug}.webp`,
  gallery: [
    `/products/${p.slug}.webp`,
    `/products/${p.slug}-ingredient.webp`,
    `/products/${p.slug}-2.webp`,
    `/products/${p.slug}-3.webp`,
  ]
}));

const allPowderPool = new Map<string, Product>();
for (const p of dehydratedCat.products) {
  // Ensure gallery has all 4 items
  p.gallery = [
    `/products/${p.slug}.webp`,
    `/products/${p.slug}-ingredient.webp`,
    `/products/${p.slug}-2.webp`,
    `/products/${p.slug}-3.webp`,
  ];
  delete p.placeholder;
  allPowderPool.set(p.slug, p);
}
for (const p of fullRestored) allPowderPool.set(p.slug, p);
for (const p of fullNew18) allPowderPool.set(p.slug, p);

// Desired order of 40 powders:
// Mega-menu Top 4: White Onion, Garlic, Moringa Leaf, Tomato
const DESIRED_ORDER = [
  "white-onion-powder",
  "garlic-powder",
  "moringa-leaf-powder",
  "tomato-powder",
  // Next 18 original:
  "pink-red-onion-powder",
  "ginger-powder-saunth",
  "moringa-seed-powder",
  "spinach-powder",
  "curry-leaf-powder",
  "mint-leaf-powder",
  "coriander-leaf-powder",
  "kasuri-methi-powder",
  "beetroot-powder",
  "carrot-powder",
  "green-chilli-powder",
  "pumpkin-powder",
  "mango-powder-amchur",
  "banana-powder",
  "lemon-powder",
  "amla-powder",
  "aloe-vera-powder",
  "hibiscus-powder",
  // 18 new botanical/food:
  "tulsi-holy-basil-leaf-powder",
  "neem-leaf-powder",
  "ashwagandha-root-powder",
  "shatavari-root-powder",
  "wheatgrass-powder",
  "okra-lady-finger-powder",
  "bitter-gourd-karela-powder",
  "papaya-powder",
  "pomegranate-anardana-powder",
  "guava-powder",
  "jamun-black-plum-powder",
  "tamarind-powder",
  "kokum-powder",
  "coconut-milk-powder",
  "butterfly-pea-flower-powder",
  "rose-petal-powder",
  "purple-sweet-potato-powder",
  "lemongrass-powder"
];

console.log("Desired order count:", DESIRED_ORDER.length);
const finalPowders: Product[] = [];
for (const slug of DESIRED_ORDER) {
  const p = allPowderPool.get(slug);
  if (!p) {
    console.error(`MISSING PRODUCT: ${slug}`);
  } else {
    finalPowders.push(p);
  }
}
console.log("Final powders assembled:", finalPowders.length);

// Update categories array
const newCategories = categories.map(cat => {
  if (cat.slug === "dehydrated-powders") {
    return {
      ...cat,
      products: finalPowders
    };
  }
  return cat;
});

const totalProducts = newCategories.reduce((acc, c) => acc + c.products.length, 0);
console.log("Total catalog products:", totalProducts);

const fileHeader = `// 7 Categories, ${totalProducts} Approved Export Products with Dedicated High-Resolution Local Assets

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

export const categories: Category[] = ${JSON.stringify(newCategories, null, 2)};

export const allProducts: (Product & { category: Category })[] = categories.flatMap((c) =>
  c.products.map((p) => ({ ...p, category: c }))
);

export function getCategory(slug: string): Category | undefined {
  if (slug === "natural-stones-tiles") {
    return categories.find((c) => c.slug === "natural-stones") ?? categories[4];
  }
  return categories.find((c) => c.slug === slug);
}

export function getProduct(catSlug: string, prodSlug: string): Product | undefined {
  const c = getCategory(catSlug);
  return c?.products.find((p) => p.slug === prodSlug);
}
`;

fs.writeFileSync(path.resolve("src/data/products.ts"), fileHeader, "utf-8");
console.log("Successfully rebuilt src/data/products.ts with 115 products!");
