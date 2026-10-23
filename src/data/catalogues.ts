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
    id: "shein-16x16-parking-tiles",
    title: "Shein 16×16 Heavy Duty Parking Tiles Catalogue",
    productName: "Shein 16x16 Parking Tiles",
    categorySlug: "ceramic-tiles",
    productSlug: "outdoor-parking-tiles",
    webUrl: "/catalogues/shein-16x16-parking-tiles-web.pdf",
    downloadUrl: "/catalogues/shein-16x16-parking-tiles.pdf",
    coverImage: "/catalogues/shein-16x16-parking-tiles-cover.webp",
    description: "Full technical specification, punch surface textures, breaking strength ratings, and export pallet layouts for 16×16 inch (400×400mm) vitrified parking tiles.",
    pages: 20,
    sizeWeb: "6.4 MB",
    sizeOriginal: "18.2 MB",
  },
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
      productName.toLowerCase().includes("shein") ||
      (productSlug === "glazed-vitrified-tiles" && c.id === "endless-collection")
  );
}
