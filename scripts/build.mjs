// scripts/build.mjs
// Ensures NODE_ENV is strictly 'production' across all Vite environment threads (client & SSR)
process.env.NODE_ENV = "production";

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

console.log("[Build] Setting NODE_ENV=production for React 19 production JSX transform...");

// Ensure local bundled pdf.worker.min.mjs exists in public/
const workerSrc = path.resolve("node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
const workerDest = path.resolve("public/pdf.worker.min.mjs");
if (fs.existsSync(workerSrc) && !fs.existsSync(workerDest)) {
  fs.copyFileSync(workerSrc, workerDest);
  console.log("[Build] Copied local pdf.worker.min.mjs to public/");
}

const nitroPreset = process.env.NITRO_PRESET || "vercel";
console.log(`[Build] Target deployment preset: ${nitroPreset}`);

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(npxCmd, ["vite", "build", "--mode", "production"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: "production",
    NITRO_PRESET: nitroPreset,
  },
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
