/**
 * WhatsApp message builder utilities for Aurelian International.
 *
 * Centralises the construction of pre-filled WhatsApp URLs so that every
 * touchpoint (Product Detail, ProductCard modal, EnquiryForm, BasketDrawer)
 * sends the same structured, professional trade message with the product name
 * and key specifications clearly visible to the business owner.
 */

import { site } from "@/data/site";

export interface WaProduct {
  name: string;
  category?: string;
  origin?: string;
  grade?: string;
  moq?: string;
  packaging?: string;
  certifications?: string[];
}

/**
 * Build a pre-filled WhatsApp URL for a SINGLE product enquiry.
 * Used on the product detail page and the quick-view modal.
 */
export function buildSingleProductWaUrl(product: WaProduct): string {
  const certLine =
    product.certifications && product.certifications.length > 0
      ? `\nCertifications: ${product.certifications.join(", ")}`
      : "";

  const message =
    `Hello Aurelian International,\n\n` +
    `I am interested in importing the following product and would like to request an export quotation:\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Product: *${product.name}*\n` +
    `Category: ${product.category || "—"}\n` +
    `Origin: ${product.origin || "India"}\n` +
    `Grade: ${product.grade || "Export Premium"}\n` +
    `MOQ: ${product.moq || "As per discussion"}\n` +
    (product.packaging ? `Packaging: ${product.packaging}\n` : "") +
    certLine +
    `\n━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Please share the FOB/CIF pricing, available shipping schedule, and inspection/lab certificate details.\n\n` +
    `Thank you.`;

  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a pre-filled WhatsApp URL for MULTIPLE products (basket / enquiry form).
 * Used in BasketDrawer and EnquiryForm.
 */
export function buildMultiProductWaUrl(
  products: WaProduct[],
  extra?: { company?: string; country?: string; quantity?: string }
): string {
  if (products.length === 0) {
    const fallback =
      `Hello Aurelian International,\n\n` +
      `I would like to request information about your export products. Please share your current catalog, FOB pricing, and shipping terms.\n\n` +
      `Thank you.`;
    return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(fallback)}`;
  }

  const productLines = products
    .map(
      (p, i) =>
        `${i + 1}. *${p.name}*` +
        (p.category ? ` (${p.category})` : "") +
        (p.origin ? ` — Origin: ${p.origin}` : "") +
        (p.grade ? ` — Grade: ${p.grade}` : "") +
        (p.moq ? ` — MOQ: ${p.moq}` : "")
    )
    .join("\n");

  const companyLine = extra?.company ? `\nCompany: ${extra.company}` : "";
  const countryLine = extra?.country ? `\nDestination: ${extra.country}` : "";
  const quantityLine = extra?.quantity ? `\nQuantity Required: ${extra.quantity}` : "";

  const message =
    `Hello Aurelian International,\n\n` +
    `I would like to request export quotations for the following products:\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    productLines +
    `\n━━━━━━━━━━━━━━━━━━━━━━` +
    companyLine +
    countryLine +
    quantityLine +
    `\n\nPlease share FOB/CIF pricing, container schedule, and lab certificates for each item.\n\n` +
    `Thank you.`;

  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
