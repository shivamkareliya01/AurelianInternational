// scripts/build.mjs
// Ensures NODE_ENV is strictly 'production' across all Vite environment threads (client & SSR)
process.env.NODE_ENV = "production";

import { spawnSync } from "node:child_process";
import process from "node:process";

console.log("[Build] Setting NODE_ENV=production for React 19 production JSX transform...");

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(npxCmd, ["vite", "build", "--mode", "production"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: "production",
  },
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
