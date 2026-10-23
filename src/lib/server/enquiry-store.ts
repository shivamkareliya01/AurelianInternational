// src/lib/server/enquiry-store.ts
// Persistent enquiry data storage engine (File-backed with atomic commits)

import fs from "node:fs";
import path from "node:path";

export type EnquiryStatus = "New" | "Contacted" | "Quoted" | "Won" | "Lost";
export type EmailStatus = "sent" | "email_failed" | "skipped_test_mode" | "pending";

export interface EnquiryProductItem {
  name: string;
  category: string;
  slug?: string;
  origin?: string;
  grade?: string;
  moq?: string;
  packaging?: string;
  shelfLife?: string;
  certifications?: string[];
}

export interface StoredEnquiry {
  id: string;
  reference: string;
  year: number;
  seq: number;
  createdAtUTC: string;
  createdAtIST: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  state?: string;
  city?: string;
  pincode?: string;
  quantity: string;
  unit: "MT" | "FCL" | "kg";
  notes: string;
  products: EnquiryProductItem[];
  sourcePage: string;
  sourceCard?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  ip: string;
  userAgent: string;
  status: EnquiryStatus;
  emailStatus: EmailStatus;
  emailRetries: number;
  syncStatus?: "synced" | "pending_sync";
  syncError?: string;
  syncRetries?: number;
  logs: string[];
}

interface EnquiriesDataFile {
  counters: Record<string, number>; // e.g. { "2026": 1 }
  enquiries: StoredEnquiry[];
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "enquiries.json");

function ensureDataFile(): EnquiriesDataFile {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initial: EnquiriesDataFile = {
      counters: {},
      enquiries: [],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }

  try {
    const content = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(content) as EnquiriesDataFile;
  } catch (err) {
    console.error("Failed to parse enquiries.json, resetting with backup:", err);
    const initial: EnquiriesDataFile = { counters: {}, enquiries: [] };
    return initial;
  }
}

function writeDataFile(data: EnquiriesDataFile): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempPath = `${DATA_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tempPath, DATA_FILE);
}

export function formatISTDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

export function generateNextReference(year?: number): { reference: string; seq: number; year: number } {
  const currentYear = year || new Date().getFullYear();
  const yearKey = currentYear.toString();

  const data = ensureDataFile();
  const currentSeq = data.counters[yearKey] || 0;
  const nextSeq = currentSeq + 1;
  data.counters[yearKey] = nextSeq;
  writeDataFile(data);

  const formattedSeq = nextSeq.toString().padStart(4, "0");
  const reference = `AV-${currentYear}-${formattedSeq}`;

  return { reference, seq: nextSeq, year: currentYear };
}

export function saveEnquiry(enquiry: Omit<StoredEnquiry, "id">): StoredEnquiry {
  const data = ensureDataFile();
  const fullEnquiry: StoredEnquiry = {
    ...enquiry,
    id: `enq_${enquiry.reference.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now()}`,
  };

  data.enquiries.unshift(fullEnquiry);
  writeDataFile(data);
  return fullEnquiry;
}

export function getEnquiryById(id: string): StoredEnquiry | null {
  const data = ensureDataFile();
  return data.enquiries.find((e) => e.id === id || e.reference === id) || null;
}

export function getEnquiryByRef(ref: string): StoredEnquiry | null {
  const data = ensureDataFile();
  return data.enquiries.find((e) => e.reference.toUpperCase() === ref.toUpperCase()) || null;
}

export function listEnquiries(options: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}): { total: number; enquiries: StoredEnquiry[] } {
  const data = ensureDataFile();
  let list = [...data.enquiries];

  // Filter by status if provided and not "All"
  if (options.status && options.status !== "All") {
    list = list.filter((e) => e.status.toLowerCase() === options.status?.toLowerCase());
  }

  // Filter by search term
  if (options.search) {
    const q = options.search.trim().toLowerCase();
    list = list.filter((e) => {
      return (
        e.reference.toLowerCase().includes(q) ||
        e.company.toLowerCase().includes(q) ||
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.country.toLowerCase().includes(q) ||
        e.products.some((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      );
    });
  }

  const total = list.length;
  const offset = options.offset || 0;
  const limit = options.limit || 50;

  return {
    total,
    enquiries: list.slice(offset, offset + limit),
  };
}

export function updateEnquiryStatus(idOrRef: string, status: EnquiryStatus): StoredEnquiry | null {
  const data = ensureDataFile();
  const item = data.enquiries.find((e) => e.id === idOrRef || e.reference === idOrRef);
  if (!item) return null;

  item.status = status;
  item.logs.push(`Status updated to '${status}' at ${formatISTDate()}`);
  writeDataFile(data);
  return item;
}

export function updateEnquiryEmailStatus(
  idOrRef: string,
  emailStatus: EmailStatus,
  logMessage?: string
): StoredEnquiry | null {
  const data = ensureDataFile();
  const item = data.enquiries.find((e) => e.id === idOrRef || e.reference === idOrRef);
  if (!item) return null;

  item.emailStatus = emailStatus;
  if (emailStatus === "email_failed") {
    item.emailRetries = (item.emailRetries || 0) + 1;
  }
  if (logMessage) {
    item.logs.push(logMessage);
  }
  writeDataFile(data);
  return item;
}

export function updateEnquirySyncStatus(
  idOrRef: string,
  syncStatus: "synced" | "pending_sync",
  syncError?: string,
  assignedRef?: string
): StoredEnquiry | null {
  const data = ensureDataFile();
  const item = data.enquiries.find((e) => e.id === idOrRef || e.reference === idOrRef);
  if (!item) return null;

  item.syncStatus = syncStatus;
  if (assignedRef) {
    item.reference = assignedRef;
  }
  if (syncError) {
    item.syncError = syncError;
    item.syncRetries = (item.syncRetries || 0) + 1;
    item.logs.push(`Apps Script sync attempt failed: ${syncError} at ${formatISTDate()}`);
  } else if (syncStatus === "synced") {
    item.syncError = undefined;
    item.logs.push(`Apps Script synced successfully (Ref: ${item.reference}) at ${formatISTDate()}`);
  }
  writeDataFile(data);
  return item;
}

export function getPendingSyncEnquiries(): StoredEnquiry[] {
  const data = ensureDataFile();
  return data.enquiries.filter((e) => e.syncStatus === "pending_sync");
}

export function getAllEnquiriesForExport(): StoredEnquiry[] {
  const data = ensureDataFile();
  return [...data.enquiries];
}

