#!/usr/bin/env node

/**
 * Aurelian International — Retry Pending Enquiries Job
 * 
 * Re-attempts synchronization of enquiries flagged with "pending_sync"
 * into Google Apps Script / Google Sheets.
 * 
 * Usage:
 *   node scripts/retry-pending-enquiries.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT_DIR, "data", "enquiries.json");
const ENV_FILE = path.join(ROOT_DIR, ".env");

// Simple .env parser without external dependencies
function loadEnv() {
  if (!fs.existsSync(ENV_FILE)) return;
  const content = fs.readFileSync(ENV_FILE, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx <= 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

loadEnv();

const WEB_APP_URL = process.env.WEB_APP_URL;
const ENQUIRY_SECRET = process.env.ENQUIRY_SECRET;

if (!WEB_APP_URL) {
  console.error("❌ Error: WEB_APP_URL is not set in environment or .env file.");
  process.exit(1);
}

if (!fs.existsSync(DATA_FILE)) {
  console.log("ℹ️ No data/enquiries.json file found. Nothing to sync.");
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
const pending = (data.enquiries || []).filter((e) => e.syncStatus === "pending_sync");

if (pending.length === 0) {
  console.log("✅ All enquiries are already synced. Zero items pending.");
  process.exit(0);
}

console.log(`🚀 Found ${pending.length} pending enquiries. Retrying sync with Google Apps Script...`);

let successCount = 0;
let failCount = 0;

for (const enq of pending) {
  const payload = {
    secret: ENQUIRY_SECRET,
    reference: enq.reference,
    name: `${enq.firstName} ${enq.lastName}`.trim(),
    firstName: enq.firstName,
    lastName: enq.lastName,
    company: enq.company,
    email: enq.email,
    phone: enq.phone,
    country: enq.country,
    product: enq.products.map((p) => p.name).join(", "),
    products: enq.products.map((p) => p.name),
    quantity: enq.quantity,
    unit: enq.unit,
    message: enq.notes,
    notes: enq.notes,
    sourcePage: enq.sourcePage,
  };

  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      redirect: "follow",
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let resJson = null;
    try {
      resJson = JSON.parse(text);
    } catch {}

    if (res.ok && resJson?.ok) {
      enq.syncStatus = "synced";
      if (resJson.reference) {
        enq.reference = resJson.reference;
      }
      enq.syncError = undefined;
      enq.logs.push(`Apps Script synchronized via retry script at ${new Date().toISOString()}`);
      successCount++;
      console.log(`  ✅ Synced [${enq.reference}] — ${enq.company} (${enq.email})`);
    } else {
      failCount++;
      const errMsg = resJson?.error || `HTTP ${res.status}: ${text.slice(0, 100)}`;
      enq.syncError = errMsg;
      console.warn(`  ⚠️ Failed [${enq.reference}]: ${errMsg}`);
    }
  } catch (err) {
    failCount++;
    enq.syncError = err.message || String(err);
    console.warn(`  ⚠️ Network error for [${enq.reference}]: ${err.message}`);
  }
}

// Write back updated data
fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");

console.log("\n=========================================");
console.log(`Sync complete: ${successCount} succeeded, ${failCount} failed.`);
console.log("=========================================");
