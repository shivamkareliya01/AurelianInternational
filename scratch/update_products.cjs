const fs = require('fs');

const shortenedDescriptions = {
  'makrana-white-marble':
    'Historic pure white calcite stone used to build the Taj Mahal, featuring near-zero water absorption, high mirror polish, and enduring luster.',
  'white-onion-powder':
    'Creamy white culinary powder made from premium dehydrated Bhavnagar white onions, delivering sharp pungency and rich savory sweetness.',
  'garlic-powder':
    'Finely ground golden-cream garlic powder processed from fully cured whole Indian garlic cloves, delivering intense savory umami and potent aroma.',
  'moringa-leaf-powder':
    'Nutrient-dense superfood powder produced from tender shade-dried leaves of Indian Moringa oleifera, retaining vivid green chlorophyll and vitamins.',
  'tomato-powder':
    'Concentrated spray-dried tomato powder derived from field-ripened red tomatoes, providing natural lycopene, bright acidity, and rich umami depth.',
  'pink-red-onion-powder':
    'Aromatic pinkish-red onion powder milled from high-solids Nashik red onions with authentic zesty flavor and deep caramelized undertones.',
  'ginger-powder':
    'Traditional Indian Saunth ground from peeled, cured ginger rhizomes of Kerala, renowned for fiery warmth and aromatic citrus nuance.',
  'spinach-powder':
    'Vibrant green powder manufactured from freshly harvested Indian Palak spinach leaves, gently dried to protect thermolabile iron and folic acid.',
  'mint-leaf-powder':
    'Refreshingly crisp mint powder milled from cleaned Mentha arvensis leaves, brimming with cooling essential oils and invigorating aroma.',
  'beetroot-powder':
    'Pure deep-magenta beetroot powder prepared from sweet, earth-grown beets, valued as a clean-label natural food colorant and nutrient.'
};

const raw = fs.readFileSync('src/data/products.ts', 'utf8');
const catMatch = raw.match(/export const categories: Category\[\] = (\[[\s\S]*?\]);\s*export const allProducts/);
if (!catMatch) {
  console.error('Could not match categories in src/data/products.ts');
  process.exit(1);
}
const originalCategories = JSON.parse(catMatch[1]);

const cleanedCategories = originalCategories.map(cat => ({
  slug: cat.slug,
  name: cat.name,
  headline: cat.headline,
  blurb: cat.blurb,
  image: cat.image,
  products: cat.products.map(p => {
    const shortDesc = shortenedDescriptions[p.slug] || p.shortDescription || p.description;
    const origin = p.specs ? p.specs.origin : p.origin;
    const gradeVariety = p.specs ? p.specs.gradeVariety : p.grade;
    const exportPackaging = p.specs ? p.specs.exportPackaging : p.packaging;
    const moq = p.specs ? p.specs.moq : p.moq;
    const shelfLife = p.specs ? p.specs.shelfLife : p.shelfLife;
    const certifications = p.specs ? p.specs.certifications : p.certifications;

    return {
      slug: p.slug,
      name: p.name,
      image: p.image,
      shortDescription: shortDesc,
      specs: {
        origin,
        gradeVariety,
        exportPackaging,
        moq,
        shelfLife,
        certifications
      }
    };
  })
}));

const header = `// 7 Categories, 62 Approved Export Products with Standardized Spec Architecture

export type ProductSpecs = {
  origin?: string;
  gradeVariety?: string;
  exportPackaging?: string;
  moq?: string;
  shelfLife?: string;
  certifications?: string[];
};

export type Product = {
  slug: string;
  name: string;
  image: string;
  shortDescription: string;
  specs: ProductSpecs;
  origin: string;
  grade: string;
  packaging: string;
  moq: string;
  shelfLife: string;
  certifications: string[];
  description: string;
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

export const categories: Category[] = ${JSON.stringify(cleanedCategories, null, 2)} as unknown as Category[];

export const allProducts: (Product & { category: Category })[] = categories.flatMap((c) =>
  c.products.map((p) => ({
    ...p,
    category: c,
    origin: p.specs.origin ?? "",
    grade: p.specs.gradeVariety ?? "",
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
  if (slug === "natural-stones-tiles") {
    return categories.find((c) => c.slug === "natural-stones") ?? categories[4];
  }
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
`;

fs.writeFileSync('src/data/products.ts', header, 'utf8');
console.log('Successfully wrote updated src/data/products.ts');
