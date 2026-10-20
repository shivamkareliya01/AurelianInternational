#!/usr/bin/env node

/**
 * Aurelian International — Standalone Master Excel Sync Script
 * Regenerates or updates Aurelian_Enquiries_Master.xlsx from data/enquiries.json
 * 
 * Usage:
 *   node scripts/sync-excel.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "data", "enquiries.json");
const ROOT_EXCEL = path.join(ROOT, "Aurelian_Enquiries_Master.xlsx");
const DATA_EXCEL = path.join(ROOT, "data", "Aurelian_Enquiries_Master.xlsx");

const NAVY_DARK = "FF071A33";
const GOLD_ACCENT = "FFE3B95F";
const BG_ALT = "FFF8FAFC";
const BORDER_COLOR = "FFE2E8F0";

function sanitize(val) {
  if (val === null || val === undefined) return "";
  const s = String(val).trim();
  if (/^[=+\-@\t\r]/.test(s)) return `'${s}`;
  return s;
}

async function run() {
  console.log("==================================================================");
  console.log("  Aurelian International — Sync Master Excel Workbook");
  console.log("==================================================================");

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ Data file not found: ${DATA_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw);
  const enquiries = parsed.enquiries || [];

  console.log(`Found ${enquiries.length} enquiries in data/enquiries.json.`);

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
    const productsSummary = (e.products || []).map((p) => p.name).join(", ");
    const volume = e.quantity ? `${e.quantity} ${e.unit || "MT"}` : `Unit: ${e.unit || "MT"}`;

    const row = sheet.addRow({
      reference: sanitize(e.reference),
      dateIST: sanitize(e.createdAtIST),
      clientName: sanitize(e.fullName),
      company: sanitize(e.company),
      email: sanitize(e.email),
      phone: sanitize(e.phone),
      country: sanitize(e.country),
      volume: sanitize(volume),
      products: sanitize(productsSummary),
      status: sanitize(e.status),
      notes: sanitize(e.notes),
      sourcePage: sanitize(e.sourcePage),
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

  const buffer = await workbook.xlsx.writeBuffer();

  for (const p of [ROOT_EXCEL, DATA_EXCEL]) {
    try {
      fs.writeFileSync(p, Buffer.from(buffer));
      console.log(`✓ Saved master sheet: ${p}`);
    } catch (err) {
      if (err.code === "EBUSY") {
        console.warn(`⚠️ Warning: ${p} is open in Excel. Close Excel and re-run to update.`);
      } else {
        console.error(`❌ Error writing to ${p}:`, err.message);
      }
    }
  }

  console.log("\nDone! Master Excel sheet is up to date.");
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
