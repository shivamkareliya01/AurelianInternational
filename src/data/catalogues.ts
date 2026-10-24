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
    id: "endless-collection",
    title: "ENDLESS COLLECTION Tile Brochure",
    productName: "Glazed Vitrified Tiles (GVT / PGVT)",
    categorySlug: "ceramic-tiles",
    productSlug: "glazed-vitrified-tiles",
    webUrl: "/catalogues/endless-collection-web.pdf",
    downloadUrl: "/catalogues/endless-collection.pdf",
    coverImage: "/catalogues/endless-collection-cover.webp",
    description: "Premium large-format 600×1200mm and 800×1600mm digital glazed vitrified tiles with continuous veining, mirror high-gloss, and carving finishes.",
    pages: 52,
    sizeWeb: "8.9 MB",
    sizeOriginal: "51.9 MB",
  },
];

export function getCatalogueById(id: string): Catalogue | undefined {
  return catalogues.find((c) => c.id === id);
}

export function getCatalogueForProduct(productName: string, productSlug?: string): Catalogue | undefined {
  return catalogues.find(
    (c) =>
      (productSlug && c.productSlug === productSlug) ||
      c.productName.toLowerCase() === productName.toLowerCase() ||
      (productSlug === "glazed-vitrified-tiles" && c.id === "endless-collection")
  );
}
