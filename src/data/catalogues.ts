export interface Catalogue {
  id: string;
  title: string;
  productName: string;
  categorySlug?: string;
  productSlug?: string;
  webUrl: string;
  downloadUrl: string;
  coverImage: string;
  description?: string;
  pages?: number;
  sizeWeb?: string;
  sizeOriginal?: string;
}

export const catalogues: Catalogue[] = [
  {
    id: "gvt_brochure",
    title: "Endless Collection",
    productName: "Endless Collection",
    categorySlug: "ceramic-tiles",
    productSlug: "glazed-vitrified-tiles",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/gvt_brochure.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/gvt_brochure.pdf",
    coverImage: "/catalogues/endless-collection-cover.webp",
    description: "Premium large-format 600×1200mm digital glazed vitrified tiles with continuous veining, mirror high-gloss, and carving finishes.",
    pages: 52,
    sizeWeb: "8.9 MB",
    sizeOriginal: "23.16 MB",
  },
  {
    id: "3d-collection-2026",
    title: "3D Collection 2026",
    productName: "3D Collection 2026",
    categorySlug: "ceramic-tiles",
    productSlug: "3d-collection-2026",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/3d-collection-2026.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/3d-collection-2026.pdf",
    coverImage: "/catalogues/3d-collection-2026-cover.webp",
    description: "Sculpted 3D visual depth vitrified surfaces with dimensional textures, subtle relief, and architectural elegance.",
    pages: 48,
    sizeWeb: "36.26 MB",
    sizeOriginal: "36.26 MB",
  },
  {
    id: "bookmatch-collection-2026",
    title: "Bookmatch Collection 2026",
    productName: "Bookmatch Collection 2026",
    categorySlug: "ceramic-tiles",
    productSlug: "bookmatch-collection-2026",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/bookmatch-collection-2026.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/bookmatch-collection-2026.pdf",
    coverImage: "/catalogues/bookmatch-collection-2026-cover.webp",
    description: "Symmetrical mirror-matched vein patterns engineered for expansive luxury living walls and feature floors.",
    pages: 44,
    sizeWeb: "6.54 MB",
    sizeOriginal: "77.15 MB",
  },
  {
    id: "carving-collection-2026",
    title: "Carving Collection 2026",
    productName: "Carving Collection 2026",
    categorySlug: "ceramic-tiles",
    productSlug: "carving-collection-2026",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/carving-collection-2026.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/carving-collection-2026.pdf",
    coverImage: "/catalogues/carving-collection-2026-cover.webp",
    description: "Micro-carved ink luster finish creating tactile vein grooves and sophisticated light play across natural stone textures.",
    pages: 36,
    sizeWeb: "16.67 MB",
    sizeOriginal: "16.67 MB",
  },
  {
    id: "decor-glossy-collection-2026",
    title: "Decor Glossy Collection 2026",
    productName: "Decor Glossy Collection 2026",
    categorySlug: "ceramic-tiles",
    productSlug: "decor-glossy-collection-2026",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/decor-glossy-collection-2026.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/decor-glossy-collection-2026.pdf",
    coverImage: "/catalogues/decor-glossy-collection-2026-cover.webp",
    description: "Artistic decorative patterns with high-gloss crystalline glaze, vibrant motifs, and seamless modular continuity.",
    pages: 50,
    sizeWeb: "45.02 MB",
    sizeOriginal: "45.02 MB",
  },
  {
    id: "double-charge-collection-2026",
    title: "Double Charge Collection 2026",
    productName: "Double Charge Collection 2026",
    categorySlug: "ceramic-tiles",
    productSlug: "double-charge-collection-2026",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/double-charge-collection-2026.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/double-charge-collection-2026.pdf",
    coverImage: "/catalogues/double-charge-collection-2026-cover.webp",
    description: "Heavy-duty double-layered vitrified tiles designed for extreme high-traffic commercial and industrial architectural floors.",
    pages: 40,
    sizeWeb: "26.50 MB",
    sizeOriginal: "56.44 MB",
  },
  {
    id: "glossy-collection-without-logo",
    title: "Glossy Collection",
    productName: "Glossy Collection",
    categorySlug: "ceramic-tiles",
    productSlug: "glossy-collection",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/glossy-collection-without-logo.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/glossy-collection-without-logo.pdf",
    coverImage: "/catalogues/glossy-collection-without-logo-cover.webp",
    description: "Comprehensive 300+ page showcase of pristine mirror-polished glazed vitrified tiles with brilliant light reflectance.",
    pages: 331,
    sizeWeb: "40.27 MB",
    sizeOriginal: "100.89 MB",
  },
  {
    id: "gold-collection",
    title: "Gold Collection",
    productName: "Gold Collection",
    categorySlug: "ceramic-tiles",
    productSlug: "gold-collection",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/gold-collection.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/gold-collection.pdf",
    coverImage: "/catalogues/gold-collection-cover.webp",
    description: "Opulent metallic gold-infused veining and luxury accents for statement hospitality and luxury residential projects.",
    pages: 72,
    sizeWeb: "18.42 MB",
    sizeOriginal: "90.35 MB",
  },
  {
    id: "matt-collection-without-logo",
    title: "Matt Collection",
    productName: "Matt Collection",
    categorySlug: "ceramic-tiles",
    productSlug: "matt-collection",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/matt-collection-without-logo.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/matt-collection-without-logo.pdf",
    coverImage: "/catalogues/matt-collection-without-logo-cover.webp",
    description: "Sophisticated non-reflective satin matt finishes with R10 anti-slip rating, natural warmth, and velvety surface texture.",
    pages: 60,
    sizeWeb: "29.15 MB",
    sizeOriginal: "29.15 MB",
  },
  {
    id: "new-gold-and-endless-collection-without-logo",
    title: "New Gold & Endless Collection",
    productName: "New Gold & Endless Collection",
    categorySlug: "ceramic-tiles",
    productSlug: "new-gold-and-endless-collection",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/new-gold-and-endless-collection-without-logo.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/new-gold-and-endless-collection-without-logo.pdf",
    coverImage: "/catalogues/new-gold-and-endless-collection-without-logo-cover.webp",
    description: "Harmonized fusion of continuous endless vein structures highlighted with subtle metallic gold luster inlays.",
    pages: 42,
    sizeWeb: "20.63 MB",
    sizeOriginal: "20.63 MB",
  },
  {
    id: "staturio-collection-2026-with-out",
    title: "Staturio Collection 2026",
    productName: "Staturio Collection 2026",
    categorySlug: "ceramic-tiles",
    productSlug: "staturio-collection-2026",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/staturio-collection-2026-with-out.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/staturio-collection-2026-with-out.pdf",
    coverImage: "/catalogues/staturio-collection-2026-with-out-cover.webp",
    description: "Timeless Italian Statuario marble replicas with deep dramatic grey veins running over an ultra-white porcelain body.",
    pages: 78,
    sizeWeb: "11.44 MB",
    sizeOriginal: "105.47 MB",
  },
  {
    id: "terrazo-collection-2026-without-logo",
    title: "Terrazo Collection 2026",
    productName: "Terrazo Collection 2026",
    categorySlug: "ceramic-tiles",
    productSlug: "terrazo-collection-2026",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/terrazo-collection-2026-without-logo.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/terrazo-collection-2026-without-logo.pdf",
    coverImage: "/catalogues/terrazo-collection-2026-without-logo-cover.webp",
    description: "Classic Venetian terrazzo stone chips embedded in modern vitrified slabs, blending mid-century charm with high durability.",
    pages: 46,
    sizeWeb: "24.29 MB",
    sizeOriginal: "24.29 MB",
  },
  {
    id: "wood-collection-without-logo",
    title: "Wood Collection",
    productName: "Wood Collection",
    categorySlug: "ceramic-tiles",
    productSlug: "wood-collection",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/wood-collection-without-logo.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/wood-collection-without-logo.pdf",
    coverImage: "/catalogues/wood-collection-without-logo-cover.webp",
    description: "Organic hardwood timber grain reproduction with thermal stability, moisture resistance, and realistic relief grooves.",
    pages: 38,
    sizeWeb: "8.08 MB",
    sizeOriginal: "8.08 MB",
  },
];

export function getCatalogueById(id: string): Catalogue | undefined {
  return catalogues.find(
    (c) =>
      c.id === id ||
      (c.id === "gvt_brochure" && (id === "endless-collection" || id === "gvt_broucher"))
  );
}

export function getCatalogueForProduct(
  productName: string,
  productSlug?: string,
  catalogueId?: string
): Catalogue | undefined {
  return catalogues.find(
    (c) =>
      (catalogueId && c.id === catalogueId) ||
      (productSlug && (c.productSlug === productSlug || c.id === productSlug)) ||
      c.productName.toLowerCase() === productName.toLowerCase() ||
      c.title.toLowerCase() === productName.toLowerCase() ||
      (productSlug === "glazed-vitrified-tiles" &&
        (c.id === "gvt_brochure" || c.id === "gvt_broucher" || c.id === "endless-collection"))
  );
}
