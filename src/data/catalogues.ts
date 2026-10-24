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
    id: "gvt_broucher",
    title: "GVT Brochure",
    productName: "Glazed Vitrified Tiles (GVT / PGVT)",
    categorySlug: "ceramic-tiles",
    productSlug: "glazed-vitrified-tiles",
    webUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/gvt_broucher.pdf",
    downloadUrl: "https://qvpbveosbgpfbovmvkwe.supabase.co/storage/v1/object/public/pdfs/gvt_broucher.pdf",
    coverImage: "/catalogues/endless-collection-cover.webp",
    description: "Premium large-format 600×1200mm and 800×1600mm digital glazed vitrified tiles with continuous veining, mirror high-gloss, and carving finishes.",
    pages: 52,
    sizeWeb: "8.9 MB",
    sizeOriginal: "24.2 MB",
  },
];

export function getCatalogueById(id: string): Catalogue | undefined {
  return catalogues.find((c) => c.id === id || (id === "endless-collection" && c.id === "gvt_broucher"));
}

export function getCatalogueForProduct(productName: string, productSlug?: string): Catalogue | undefined {
  return catalogues.find(
    (c) =>
      (productSlug && c.productSlug === productSlug) ||
      c.productName.toLowerCase() === productName.toLowerCase() ||
      (productSlug === "glazed-vitrified-tiles" && (c.id === "gvt_broucher" || c.id === "endless-collection"))
  );
}
