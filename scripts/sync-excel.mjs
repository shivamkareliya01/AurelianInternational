import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Dynamically run through tsx or node
console.log("Generating Aurelian_Enquiries_Master.xlsx from existing enquiries...");
