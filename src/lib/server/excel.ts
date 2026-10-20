import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import { allProducts } from "@/data/products";
import { sanitizeExcelValue } from "./security";
import { getAllEnquiriesForExport, type StoredEnquiry } from "./enquiry-store";

// Aurelian Brand Palette (ARGB for ExcelJS)
const NAVY_DARK = "FF071A33";
const NAVY_LIGHT = "FF0E2A4F";
const GOLD_ACCENT = "FFE3B95F";
const WHITE = "FFFFFFFF";
const TEXT_MUTED = "FF4A5568";
const BG_ALT = "FFF8FAFC";
const BORDER_COLOR = "FFE2E8F0";

/**
 * Builds a single enquiry Excel workbook with "Enquiry" and "Products" sheets.
 */
export async function buildEnquiryExcelBuffer(enquiry: StoredEnquiry): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Aurelian International Trade Desk";
  workbook.created = new Date();
  workbook.modified = new Date();

  // ==========================================
  // SHEET 1: "Enquiry"
  // ==========================================
  const enquirySheet = workbook.addWorksheet("Enquiry", {
    pageSetup: {
      paperSize: 9, // A4
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
    views: [{ showGridLines: true }],
  });

  // Title Banner
  enquirySheet.mergeCells("A1:B1");
  const titleCell = enquirySheet.getCell("A1");
  titleCell.value = `Aurelian International — Commercial Export Enquiry ${enquiry.reference}`;
  titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: GOLD_ACCENT } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY_DARK } };
  titleCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  enquirySheet.getRow(1).height = 36;

  // Subtitle row
  enquirySheet.mergeCells("A2:B2");
  const subCell = enquirySheet.getCell("A2");
  subCell.value = `Official export quotation request transmitted on ${enquiry.createdAtIST}`;
  subCell.font = { name: "Arial", size: 9, italic: true, color: { argb: "FFCBD5E1" } };
  subCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY_LIGHT } };
  subCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  enquirySheet.getRow(2).height = 20;

  // Blank spacer row
  enquirySheet.getRow(3).height = 10;

  // Two-column key/value specifications
  const specs: [string, string][] = [
    ["Reference Number", enquiry.reference],
    ["Submission Date / Time (IST)", enquiry.createdAtIST],
    ["Submission Date / Time (UTC)", enquiry.createdAtUTC],
    ["Client Full Name", enquiry.fullName],
    ["Importing Company", enquiry.company],
    ["Official Trade Email", enquiry.email],
    ["Phone / WhatsApp", enquiry.phone],
    ["Destination Country", enquiry.country],
    ["Order Volume (Quantity & Unit)", enquiry.quantity ? `${enquiry.quantity} ${enquiry.unit}` : `Not specified (Unit: ${enquiry.unit})`],
    ["Requested Products Count", `${enquiry.products.length} product(s)`],
    ["Specification & Shipping Notes", enquiry.notes || "None provided"],
    ["Source Page / Origin", enquiry.sourcePage || "/"],
    ["Enquiry Status", enquiry.status],
    ["Visitor IP", enquiry.ip],
  ];

  let currentRow = 4;
  for (const [key, val] of specs) {
    const row = enquirySheet.getRow(currentRow);
    const keyCell = row.getCell(1);
    const valCell = row.getCell(2);

    keyCell.value = key;
    keyCell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF1E293B" } };
    keyCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
    keyCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    keyCell.border = {
      top: { style: "thin", color: { argb: BORDER_COLOR } },
      left: { style: "thin", color: { argb: BORDER_COLOR } },
      bottom: { style: "thin", color: { argb: BORDER_COLOR } },
      right: { style: "thin", color: { argb: BORDER_COLOR } },
    };

    valCell.value = sanitizeExcelValue(val);
    valCell.font = { name: "Arial", size: 10, color: { argb: "FF0F172A" } };
    valCell.alignment = { vertical: "middle", horizontal: "left", wrapText: true, indent: 1 };
    valCell.border = {
      top: { style: "thin", color: { argb: BORDER_COLOR } },
      left: { style: "thin", color: { argb: BORDER_COLOR } },
      bottom: { style: "thin", color: { argb: BORDER_COLOR } },
      right: { style: "thin", color: { argb: BORDER_COLOR } },
    };

    if (key === "Specification & Shipping Notes") {
      row.height = Math.max(28, Math.min(100, (val.length / 50) * 16));
    } else {
      row.height = 24;
    }
    currentRow++;
  }

  enquirySheet.getColumn(1).width = 32;
  enquirySheet.getColumn(2).width = 75;

  // ==========================================
  // SHEET 2: "Products"
  // ==========================================
  const productsSheet = workbook.addWorksheet("Products", {
    pageSetup: {
      paperSize: 9, // A4
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
    views: [{ state: "frozen", ySplit: 1, showGridLines: true }],
  });

  // Table Columns
  const columns = [
    { header: "No.", key: "no", width: 8 },
    { header: "Product", key: "name", width: 28 },
    { header: "Category", key: "category", width: 22 },
    { header: "Origin", key: "origin", width: 22 },
    { header: "Grade / Variety", key: "grade", width: 28 },
    { header: "Export Packaging", key: "packaging", width: 28 },
    { header: "Minimum Order (MOQ)", key: "moq", width: 22 },
    { header: "Shelf Life", key: "shelfLife", width: 18 },
    { header: "Certifications", key: "certifications", width: 28 },
  ];

  productsSheet.columns = columns;

  // Format Header Row
  const headerRow = productsSheet.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: GOLD_ACCENT } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY_DARK } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "medium", color: { argb: GOLD_ACCENT } },
      bottom: { style: "medium", color: { argb: GOLD_ACCENT } },
      left: { style: "thin", color: { argb: "FF334155" } },
      right: { style: "thin", color: { argb: "FF334155" } },
    };
  });

  // Populate Products
  enquiry.products.forEach((prod, index) => {
    // Look up full specs from catalogue if not already present
    const catalogItem = allProducts.find(
      (p) =>
        p.name.toLowerCase() === prod.name.toLowerCase() ||
        (prod.slug && p.slug === prod.slug)
    );

    const origin = prod.origin || catalogItem?.specs?.origin || catalogItem?.origin || "India";
    const grade = prod.grade || catalogItem?.specs?.gradeVariety || catalogItem?.grade || "Export Premium";
    const packaging = prod.packaging || catalogItem?.specs?.packaging || catalogItem?.packaging || "Standard Export Bags / Bulk";
    const moq = prod.moq || catalogItem?.specs?.moq || catalogItem?.moq || "1 x 20ft FCL";
    const shelfLife = prod.shelfLife || catalogItem?.specs?.shelfLife || "12–24 Months";
    const certs =
      prod.certifications?.join(", ") ||
      catalogItem?.specs?.certifications ||
      "APEDA, FSSAI, Phyto, Certificate of Origin";

    const row = productsSheet.addRow({
      no: index + 1,
      name: sanitizeExcelValue(prod.name),
      category: sanitizeExcelValue(prod.category),
      origin: sanitizeExcelValue(origin),
      grade: sanitizeExcelValue(grade),
      packaging: sanitizeExcelValue(packaging),
      moq: sanitizeExcelValue(moq),
      shelfLife: sanitizeExcelValue(shelfLife),
      certifications: sanitizeExcelValue(certs),
    });

    row.height = 24;
    const isEven = index % 2 === 1;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: "Arial", size: 9, color: { argb: "FF0F172A" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: colNumber === 1 ? "center" : "left",
        wrapText: true,
      };
      if (isEven) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BG_ALT } };
      }
      cell.border = {
        top: { style: "thin", color: { argb: BORDER_COLOR } },
        bottom: { style: "thin", color: { argb: BORDER_COLOR } },
        left: { style: "thin", color: { argb: BORDER_COLOR } },
        right: { style: "thin", color: { argb: BORDER_COLOR } },
      };
    });
  });

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Builds a consolidated master Excel workbook containing ALL enquiries.
 */
export async function buildAllEnquiriesExcelBuffer(enquiries: StoredEnquiry[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Aurelian International Trade Desk";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("All Export Enquiries", {
    pageSetup: { paperSize: 9, orientation: "landscape" },
    views: [{ state: "frozen", ySplit: 1, showGridLines: true }],
  });

  sheet.columns = [
    { header: "Reference", key: "reference", width: 16 },
    { header: "Date / Time (IST)", key: "dateIST", width: 22 },
    { header: "Client Name", key: "clientName", width: 22 },
    { header: "Importing Company", key: "company", width: 26 },
    { header: "Trade Email", key: "email", width: 26 },
    { header: "Phone / WhatsApp", key: "phone", width: 20 },
    { header: "Destination Country", key: "country", width: 20 },
    { header: "Order Volume", key: "volume", width: 18 },
    { header: "Products Requested", key: "products", width: 36 },
    { header: "Status", key: "status", width: 14 },
    { header: "Shipping Notes", key: "notes", width: 40 },
    { header: "Source Page", key: "sourcePage", width: 20 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: GOLD_ACCENT } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY_DARK } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  });

  enquiries.forEach((e, idx) => {
    const productsSummary = e.products.map((p) => p.name).join(", ");
    const volume = e.quantity ? `${e.quantity} ${e.unit}` : `Unit: ${e.unit}`;

    const row = sheet.addRow({
      reference: sanitizeExcelValue(e.reference),
      dateIST: sanitizeExcelValue(e.createdAtIST),
      clientName: sanitizeExcelValue(e.fullName),
      company: sanitizeExcelValue(e.company),
      email: sanitizeExcelValue(e.email),
      phone: sanitizeExcelValue(e.phone),
      country: sanitizeExcelValue(e.country),
      volume: sanitizeExcelValue(volume),
      products: sanitizeExcelValue(productsSummary),
      status: sanitizeExcelValue(e.status),
      notes: sanitizeExcelValue(e.notes),
      sourcePage: sanitizeExcelValue(e.sourcePage),
    });

    row.height = 24;
    const isEven = idx % 2 === 1;
    row.eachCell((cell) => {
      cell.font = { name: "Arial", size: 9 };
      cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
      if (isEven) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BG_ALT } };
      }
      cell.border = {
        top: { style: "thin", color: { argb: BORDER_COLOR } },
        bottom: { style: "thin", color: { argb: BORDER_COLOR } },
        left: { style: "thin", color: { argb: BORDER_COLOR } },
        right: { style: "thin", color: { argb: BORDER_COLOR } },
      };
    });
  });

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Sanitizes company name for safe cross-platform file naming.
 */
export function getSanitizedExcelFilename(reference: string, company: string): string {
  const cleanCompany = company
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 30);
  return `Enquiry_${reference}_${cleanCompany || "Client"}.xlsx`;
}

/**
 * Automatically regenerates and saves the Master Excel Workbook (Aurelian_Enquiries_Master.xlsx)
 * both in the data/ directory and directly in the project root for 1-click access.
 */
export async function syncMasterExcelFile(): Promise<{ rootPath: string; dataPath: string; count: number }> {
  try {
    const all = getAllEnquiriesForExport();
    const buffer = await buildAllEnquiriesExcelBuffer(all);
    const dataDir = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dataPath = path.join(dataDir, "Aurelian_Enquiries_Master.xlsx");
    const rootPath = path.resolve(process.cwd(), "Aurelian_Enquiries_Master.xlsx");
    fs.writeFileSync(dataPath, buffer);
    fs.writeFileSync(rootPath, buffer);
    console.log(`[Excel Sync] Saved Master Workbook (${all.length} enquiries) to ${rootPath}`);
    return { rootPath, dataPath, count: all.length };
  } catch (err) {
    console.error("[Excel Sync Error] Failed to generate Master Workbook:", err);
    throw err;
  }
}

/**
 * Saves a dedicated, beautifully styled Excel spreadsheet for an individual enquiry.
 */
export async function saveIndividualEnquiryExcel(enquiry: StoredEnquiry): Promise<string> {
  try {
    const buffer = await buildEnquiryExcelBuffer(enquiry);
    const outboxDir = path.resolve(process.cwd(), "data", "outbox");
    if (!fs.existsSync(outboxDir)) {
      fs.mkdirSync(outboxDir, { recursive: true });
    }
    const filename = getSanitizedExcelFilename(enquiry.reference, enquiry.company);
    const filePath = path.join(outboxDir, filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`[Excel Export] Individual quotation workbook saved to ${filePath}`);
    return filePath;
  } catch (err) {
    console.warn(`[Excel Export Warning] Failed to save individual workbook:`, err);
    return "";
  }
}
