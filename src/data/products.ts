import farm from "@/assets/farm.jpg";
import spices from "@/assets/spices.jpg";
import marble from "@/assets/marble.jpg";
import dryfruits from "@/assets/dryfruits.jpg";
import produce from "@/assets/produce.jpg";
import pvc from "@/assets/pvc.jpg";

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
};

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  image: string;
  products: Product[];
};

const p = (
  slug: string,
  name: string,
  origin: string,
  grade: string,
  packaging: string,
  moq: string,
  shelfLife: string,
  certifications: string[],
  description: string,
): Product => ({ slug, name, origin, grade, packaging, moq, shelfLife, certifications, description });

export const categories: Category[] = [
  {
    slug: "agriculture",
    name: "Agriculture",
    blurb: "Grains and cereals from India's most fertile belts, cleaned and sorted to export standard.",
    image: farm,
    products: [
      p("wheat", "Milling Wheat", "Madhya Pradesh", "Sharbati / Lokwan", "25–50 kg PP bags", "1 × 20ft FCL", "12 months", ["APEDA", "FSSAI"], "High-protein milling wheat with golden kernels, low moisture and minimal foreign matter."),
      p("basmati-rice", "1121 Basmati Rice", "Punjab & Haryana", "Sella / Steam", "5–40 kg jute or non-woven", "1 × 20ft FCL", "24 months", ["APEDA", "ISO 22000"], "Extra-long grain aged basmati with exceptional elongation and aroma."),
      p("non-basmati-rice", "Non-Basmati Rice", "Andhra Pradesh", "IR64 / Sona Masoori", "25–50 kg PP bags", "1 × 20ft FCL", "18 months", ["APEDA", "FSSAI"], "Reliable everyday rice varieties for wholesale and food service."),
      p("yellow-corn", "Yellow Maize", "Karnataka", "Feed & Food Grade", "50 kg PP bags / bulk", "1 × 20ft FCL", "12 months", ["FSSAI"], "Bright yellow maize for animal feed and food processing, aflatoxin tested."),
    ],
  },
  {
    slug: "fresh-produce",
    name: "Fresh Vegetables & Fruits",
    blurb: "Farm-fresh produce graded, cooled and packed within hours of harvest.",
    image: produce,
    products: [
      p("red-onion", "Nashik Red Onion", "Nashik, Maharashtra", "45–65 mm", "5–25 kg mesh bags", "1 × 40ft reefer", "45 days", ["APEDA", "GlobalG.A.P."], "Pungent, deep-red onions with firm skin and long shelf life."),
      p("potato", "Fresh Potato", "Uttar Pradesh", "Table & Processing", "25–50 kg mesh bags", "1 × 40ft reefer", "90 days", ["APEDA"], "Clean, uniform potatoes suitable for retail and chips processing."),
      p("tomato", "Fresh Tomato", "Karnataka", "Class I", "Ventilated cartons", "1 × 40ft reefer", "21 days", ["APEDA"], "Bright, firm tomatoes harvested at breaker stage for export transit."),
      p("garlic", "Indian Garlic", "Madhya Pradesh", "30–55 mm", "10–20 kg mesh bags", "1 × 20ft FCL", "6 months", ["APEDA", "FSSAI"], "Strong-flavoured white garlic, well-cured and cleaned."),
      p("banana", "Cavendish Banana", "Jalgaon, Maharashtra", "Grade A", "13 kg cartons", "1 × 40ft reefer", "28 days", ["GlobalG.A.P."], "Export-grade G9 Cavendish bananas with controlled ripening."),
      p("grapes", "Thompson Seedless Grapes", "Nashik, Maharashtra", "18 mm+", "4.5–5 kg punnets", "1 × 40ft reefer", "60 days", ["GlobalG.A.P.", "APEDA"], "Crisp, sweet green grapes from residue-monitored vineyards."),
    ],
  },
  {
    slug: "spices",
    name: "Spices",
    blurb: "Whole and ground spices with intense colour, aroma and full traceability.",
    image: spices,
    products: [
      p("turmeric", "Turmeric Finger & Powder", "Erode, Tamil Nadu", "Curcumin 3–5%", "25 kg PP / custom retail", "1 MT", "24 months", ["Spices Board", "FSSAI"], "Bright golden turmeric with high curcumin content."),
      p("red-chilli", "Red Chilli", "Guntur, Andhra Pradesh", "Teja / S17 / 334", "10–25 kg bags", "1 MT", "12 months", ["Spices Board"], "Vivid red chillies with balanced heat and colour value."),
      p("black-pepper", "Black Pepper", "Kerala", "550–600 G/L", "25 kg PP bags", "1 MT", "24 months", ["Spices Board", "ISO 22000"], "Bold Malabar pepper, machine-cleaned and steam-sterilised on request."),
      p("cumin", "Cumin Seeds", "Unjha, Gujarat", "99% purity", "25–50 kg bags", "1 MT", "24 months", ["Spices Board", "FSSAI"], "Singapore and Europe quality cumin with strong aroma."),
      p("cardamom", "Green Cardamom", "Idukki, Kerala", "7–8 mm bold", "10 kg cartons", "250 kg", "18 months", ["Spices Board"], "Hand-picked bold green cardamom with deep colour and aroma."),
    ],
  },
  {
    slug: "natural-stones",
    name: "Natural Stones & Tiles",
    blurb: "Marble, granite and aggregates from Rajasthan and the Deccan, cut to spec.",
    image: marble,
    products: [
      p("marble-tiles", "Marble Tiles", "Rajasthan", "Premium / Commercial", "Fumigated wooden crates", "1 × 20ft FCL", "—", ["ISO 9001"], "Polished and honed marble tiles in standard and custom sizes."),
      p("granite-slabs", "Granite Slabs", "Karnataka & Telangana", "Gangsaw / Cutter", "Wooden bundles", "1 × 20ft FCL", "—", ["ISO 9001"], "Black, absolute and multicolour granite slabs, mirror polished."),
      p("gravel", "Gravel & Pebbles", "Gujarat", "Washed / Tumbled", "1 MT jumbo bags", "1 × 20ft FCL", "—", ["ISO 9001"], "Decorative and construction-grade gravel, washed and size-graded."),
    ],
  },
  {
    slug: "dry-fruits",
    name: "Dry Fruits",
    blurb: "Premium nuts and dried fruit, sorted by hand and sealed for freshness.",
    image: dryfruits,
    products: [
      p("cashew", "Cashew Kernels", "Goa & Kerala", "W180 / W240 / W320", "10 kg vacuum tins", "1 MT", "12 months", ["FSSAI", "ISO 22000"], "Whole white cashews with consistent size and creamy bite."),
      p("almond", "Almonds", "Processed in India", "Nonpareil / Mamra", "10–25 kg cartons", "500 kg", "12 months", ["FSSAI"], "Sweet, crunchy almonds sorted and packed in hygienic facilities."),
      p("raisins", "Golden Raisins", "Sangli, Maharashtra", "Grade A", "10–15 kg cartons", "1 MT", "12 months", ["FSSAI", "APEDA"], "Plump golden raisins, cleaned and naturally sun-dried."),
      p("dates", "Dates", "Kutch, Gujarat", "Premium", "5–10 kg cartons", "1 MT", "12 months", ["FSSAI"], "Soft, rich dates packed fresh for retail and wholesale."),
    ],
  },
  {
    slug: "polymers",
    name: "Polymers & Building Materials",
    blurb: "Certified PVC pipes and fittings for plumbing, irrigation and infrastructure.",
    image: pvc,
    products: [
      p("pvc-pipes", "uPVC Pipes", "Gujarat", "IS 4985 / ASTM", "Bundled lengths", "1 × 40ft FCL", "—", ["BIS", "ISO 9001"], "Pressure-rated uPVC pipes in 20–315 mm diameters."),
      p("pvc-fittings", "PVC Fittings", "Gujarat", "SCH 40 / SCH 80", "Cartons", "1 × 20ft FCL", "—", ["BIS", "ISO 9001"], "Elbows, tees, couplers and valves to match every pipe system."),
    ],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProduct = (cat: string, slug: string) => getCategory(cat)?.products.find((x) => x.slug === slug);
export const allProducts = categories.flatMap((c) => c.products.map((pr) => ({ ...pr, category: c })));
