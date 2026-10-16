export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "export-documentation-guide",
    title: "The Importer's Guide to Indian Export Documentation",
    excerpt: "Every certificate your cargo needs — and why each one matters at your destination port.",
    category: "Trade Guides",
    date: "2026-09-18",
    readTime: "7 min read",
    author: "Arjun Mehta",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Importing from India is straightforward once you understand the paperwork that travels with your cargo. A complete document set protects you at customs and speeds up clearance.",
      "The core set includes the commercial invoice, packing list and bill of lading. Agricultural goods also need a phytosanitary certificate issued by India's Plant Protection authority, and most destinations require a certificate of origin.",
      "For food products, ask for lab analysis reports covering moisture, aflatoxin and pesticide residues. Our team prepares these for every batch and shares drafts before shipment so there are no surprises.",
      "When ordering containerized cargo, ensure your clearing agent receives advance scan copies 5 days prior to vessel berthing to clear duty assessments in advance."
    ],
  },
  {
    slug: "spice-quality-markers",
    title: "Five Quality Markers of Export-Grade Indian Spices",
    excerpt: "Curcumin, ASTA colour, volatile oil — what the numbers on an analytical spec sheet really mean.",
    category: "Products",
    date: "2026-08-30",
    readTime: "5 min read",
    author: "Meera Iyer",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Spice quality is measurable. Buyers who know the right chemical and physical markers negotiate better and receive more consistent product.",
      "For turmeric, curcumin percentage drives colour and therapeutic value. For red chilli, ASTA colour units and pungency (SHU) define the grade. Black pepper is judged by bulk density in grams per litre (G/L), while cumin is measured by volatile essential oil purity.",
      "Always request a pre-shipment sample tied strictly to the actual lot number, accompanied by a third-party Certificate of Analysis from Spices Board approved laboratories."
    ],
  },
  {
    slug: "container-loading-best-practice",
    title: "Inside a Container Loading: How We Protect Cargo at Sea",
    excerpt: "From fumigation to desiccants, the small engineering details that keep goods fresh across 40 days at sea.",
    category: "Logistics",
    date: "2026-08-12",
    readTime: "6 min read",
    author: "Rohan Shah",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
    body: [
      "A container crossing the equator can see massive swings in temperature and relative humidity. Without thorough preparation, container sweat and condensation can ruin delicate grains and produce.",
      "We line every container with multi-layer kraft paper, hang high-capacity calcium chloride desiccant poles, perform methyl bromide or phosphine fumigation where mandated, and take high-resolution photographs of every pallet prior to door sealing.",
      "Real-time GPS tracking and temperature data loggers accompany high-value reefer shipments, providing end-to-end cold-chain assurance."
    ],
  },
  {
    slug: "choosing-indian-marble",
    title: "Specifying Indian Marble & Granite for Luxury Developments",
    excerpt: "A specifier's primer on Rajasthan's calcite stones, Southern granites, and dry-lay procedures.",
    category: "Natural Stone",
    date: "2026-07-22",
    readTime: "4 min read",
    author: "Lukas Brandt",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Rajasthan has quarried monumental marble for centuries, supplying the Taj Mahal and modern luxury residences across Europe, the Gulf, and North America.",
      "When specifying Makrana or Statuario marble, establish finish (honed vs mirror polished), thickness tolerances (±1 mm), and dry-lay approvals before crating. Every bundle must be inspected sequentially so bookmatching across floors and walls aligns seamlessly.",
      "Our stone yards pre-assemble full slab dry-lays under natural overhead lighting and provide 4K aerial photography before crates are sealed."
    ],
  },
  {
    slug: "cold-chain-fresh-produce",
    title: "Mastering Cold-Chain Logistics for Tropical Fruits & Veg",
    excerpt: "How pre-cooling within 2 hours of harvest preserves crispness in onions, bananas, and grapes.",
    category: "Logistics",
    date: "2026-07-05",
    readTime: "6 min read",
    author: "Rohan Shah",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Exporting perishable produce across 15 to 30 days of sea transit requires precise post-harvest management. The golden rule is removing field heat immediately.",
      "Hydro-cooling and forced-air cooling bring core pulp temperature down to target levels within 120 minutes of farm plucking. Controlled atmosphere reefer containers manage oxygen and carbon dioxide levels to put fruit into a state of suspended respiration.",
      "Ethylene scrubbers and sulfur dioxide pads prevent premature ripening and fungal growth, ensuring fruit arrives with orchard-fresh firmness."
    ],
  },
  {
    slug: "basmati-grain-science",
    title: "The Science of Basmati Aging: Why 2-Year Aged Rice Bakes Better",
    excerpt: "Why premium 1121 and 1509 basmati requires patient aging in controlled bonded warehouses.",
    category: "Products",
    date: "2026-06-18",
    readTime: "5 min read",
    author: "Arjun Mehta",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Freshly harvested paddy contains natural moisture and active amylase enzymes that cause kernels to cook soft and sticky. True basmati must undergo controlled aging.",
      "Over 12 to 24 months in aerated dry storage, starch molecules gelatinize, moisture stabilizes below 12.5%, and natural 2-acetyl-1-pyrroline aroma compounds intensify.",
      "When cooked, aged basmati elongates to over 22 millimeters without bursting or releasing excess starch, producing the pristine non-sticky separation prized in biryanis and fine dining."
    ],
  },
  {
    slug: "navigating-export-incoterms",
    title: "FOB, CIF or DDP: Choosing the Right Incoterm for Your Port",
    excerpt: "Balancing freight risk, terminal handling charges, and demurrage insurance.",
    category: "Trade Guides",
    date: "2026-05-29",
    readTime: "8 min read",
    author: "Ananya Rao",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Selecting the appropriate Incoterm defines exactly where cost and cargo risk transfer from the Indian exporter to the international consignee.",
      "FOB (Free on Board) at JNPT or Mundra works best for large trading houses with negotiated global freight contracts. CIF (Cost, Insurance & Freight) protects smaller buyers by bundling competitive marine transit and institute cargo clauses (Class A) up to their destination berth.",
      "We recommend clear agreement on detention and demurrage free-days (typically requesting 14–21 free days at destination) to avoid costly port storage fees during customs clearance."
    ],
  }
];

export const getPost = (slug: string) => posts.find((x) => x.slug === slug);
