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
 * Resolves paths for the master Excel spreadsheet.
 * Priority:
 * 1. process.env.MASTER_EXCEL_PATH or process.env.EXCEL_SHEET_PATH (if set)
 * 2. Aurelian_Enquiries_Master.xlsx in workspace root
 * 3. data/Aurelian_Enquiries_Master.xlsx
 */
export function getMasterExcelPaths(): { primaryPath: string; backupPath: string } {
  const customPath = process.env["MASTER_EXCEL_PATH"] || process.env["EXCEL_SHEET_PATH"];
  const rootPath = customPath
    ? path.resolve(customPath)
    : path.resolve(process.cwd(), "Aurelian_Enquiries_Master.xlsx");
  const dataPath = path.resolve(process.cwd(), "data", "Aurelian_Enquiries_Master.xlsx");
  return { primaryPath: rootPath, backupPath: dataPath };
}

/**
 * Reads the latest Master Excel buffer from disk, or builds it on demand.
 */
export async function getMasterExcelBuffer(): Promise<Buffer> {
  const { primaryPath, backupPath } = getMasterExcelPaths();
  for (const p of [primaryPath, backupPath]) {
    if (fs.existsSync(p)) {
      try {
        return fs.readFileSync(p);
      } catch (err) {
        // file might be locked; proceed to next or build
      }
    }
  }
  const all = getAllEnquiriesForExport();
  return buildAllEnquiriesExcelBuffer(all);
}

/**
 * Appends a new enquiry as a row directly into the user's master Excel spreadsheet.
 * Does NOT create new individual spreadsheet files.
 */
export async function appendEnquiryToMasterExcel(enquiry: StoredEnquiry): Promise<{
  updatedPaths: string[];
  skippedDuplicate: boolean;
}> {
  const { primaryPath, backupPath } = getMasterExcelPaths();
  const targetPaths = primaryPath === backupPath ? [primaryPath] : [primaryPath, backupPath];
  const updatedPaths: string[] = [];
  let skippedDuplicate = false;

  for (const filePath of targetPaths) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      let workbook: ExcelJS.Workbook;
      let worksheet: ExcelJS.Worksheet;

      if (fs.existsSync(filePath)) {
        workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const existing =
          workbook.getWorksheet("All Export Enquiries") ||
          workbook.worksheets[0];
        worksheet = existing || workbook.addWorksheet("All Export Enquiries");
      } else {
        // If file doesn't exist yet, build full workbook from existing enquiries
        const all = getAllEnquiriesForExport();
        const buffer = await buildAllEnquiriesExcelBuffer(all);
        fs.writeFileSync(filePath, buffer);
        updatedPaths.push(filePath);
        continue;
      }

      const row1 = worksheet.getRow(1);
      const isHeaderEmpty = !row1.getCell(1).value;

      if (isHeaderEmpty) {
        worksheet.columns = [
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
        const hRow = worksheet.getRow(1);
        hRow.height = 30;
        hRow.eachCell((cell) => {
          cell.font = { name: "Arial", size: 10, bold: true, color: { argb: GOLD_ACCENT } };
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY_DARK } };
          cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        });
      }

      // Find Reference column index
      let refColIdx = 1;
      const firstRowValues = row1.values as (string | undefined)[];
      if (Array.isArray(firstRowValues)) {
        const found = firstRowValues.findIndex(
          (val) => typeof val === "string" && val.trim().toLowerCase() === "reference"
        );
        if (found > 0) refColIdx = found;
      }

      // Check if reference already exists to prevent duplicate rows
      let exists = false;
      const rowCount = worksheet.rowCount;
      for (let r = 2; r <= rowCount; r++) {
        const cellVal = String(worksheet.getRow(r).getCell(refColIdx).value || "").trim();
        if (cellVal === enquiry.reference) {
          exists = true;
          break;
        }
      }

      if (exists) {
        skippedDuplicate = true;
        continue;
      }

      const productsSummary = enquiry.products.map((p) => p.name).join(", ");
      const volume = enquiry.quantity ? `${enquiry.quantity} ${enquiry.unit}` : `Unit: ${enquiry.unit}`;

      const rowValues = [
        sanitizeExcelValue(enquiry.reference),
        sanitizeExcelValue(enquiry.createdAtIST),
        sanitizeExcelValue(enquiry.fullName),
        sanitizeExcelValue(enquiry.company),
        sanitizeExcelValue(enquiry.email),
        sanitizeExcelValue(enquiry.phone),
        sanitizeExcelValue(enquiry.country),
        sanitizeExcelValue(volume),
        sanitizeExcelValue(productsSummary),
        sanitizeExcelValue(enquiry.status),
        sanitizeExcelValue(enquiry.notes),
        sanitizeExcelValue(enquiry.sourcePage),
      ];

      const newRow = worksheet.addRow(rowValues);
      newRow.height = 24;
      const isEven = worksheet.rowCount % 2 === 0;
      newRow.eachCell((cell) => {
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

      await workbook.xlsx.writeFile(filePath);
      updatedPaths.push(filePath);
      console.log(`[Excel Append] Successfully appended ${enquiry.reference} to ${filePath}`);
    } catch (err: any) {
      if (err?.code === "EBUSY" || err?.message?.includes("busy or locked")) {
        console.warn(
          `[Excel Lock Notice] ${filePath} is currently open in Excel or another program. Enquiry is safely preserved in database and will sync once file is closed.`
        );
      } else {
        console.error(`[Excel Append Error] Failed on ${filePath}:`, err);
      }
    }
  }

  return { updatedPaths, skippedDuplicate };
}

/**
 * Automatically regenerates and saves the Master Excel Workbook (Aurelian_Enquiries_Master.xlsx)
 * both in the data/ directory and directly in the project root for 1-click access.
 */
export async function syncMasterExcelFile(): Promise<{ rootPath: string; dataPath: string; count: number }> {
  try {
    const all = getAllEnquiriesForExport();
    const buffer = await buildAllEnquiriesExcelBuffer(all);
    const { primaryPath, backupPath } = getMasterExcelPaths();
    
    for (const p of [primaryPath, backupPath]) {
      try {
        const dir = path.dirname(p);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(p, buffer);
      } catch (writeErr: any) {
        if (writeErr?.code === "EBUSY") {
          console.warn(`[Excel Sync Notice] ${p} is currently locked by Excel.`);
        } else {
          console.error(`[Excel Sync Warning] Error writing to ${p}:`, writeErr);
        }
      }
    }

    console.log(`[Excel Sync] Master Workbook synced (${all.length} enquiries) to ${primaryPath}`);
    return { rootPath: primaryPath, dataPath: backupPath, count: all.length };
  } catch (err) {
    console.error("[Excel Sync Error] Failed to generate Master Workbook:", err);
    throw err;
  }
}

/**
 * Deprecated: Individual quotation files are no longer generated to keep everything
 * centralized inside the single master Excel spreadsheet.
 */
export async function saveIndividualEnquiryExcel(_enquiry: StoredEnquiry): Promise<string> {
  // Deliberately no-op to prevent creating separate individual spreadsheet files
  return "";
}

