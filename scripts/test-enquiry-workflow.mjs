#!/usr/bin/env node

/**
 * Aurelian International — Comprehensive Enquiry Workflow Automated Test Suite
 * 
 * Verifies:
 * 1. Valid submission with working Google Apps Script mock (200 OK + Reference)
 * 2. Field validation: Invalid email format (400 Bad Request)
 * 3. Field validation: Empty products array (400 Bad Request)
 * 4. Spam defense: Honeypot filled (400 Bad Request)
 * 5. Spam defense: Rapid submission under 3 seconds (400 Bad Request)
 * 6. Rate limiting: 6th submission in one hour (429 Rate Limit)
 * 7. Error resilience: Apps Script returns unauthorized (Saved as pending_sync)
 * 8. Error resilience: Apps Script offline/down (Saved as pending_sync with fallback)
 * 9. Security audit: Confirm zero secrets or Web App URLs in frontend code/bundle
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const API_URL = "http://localhost:8080/api/enquiry";
const MOCK_PORT = 9876;
const MOCK_URL = `http://127.0.0.1:${MOCK_PORT}/exec`;
const TEST_SECRET = "aurelian_test_secret_key_1234567890";

let mockServer;
let mockResponseMode = "ok"; // "ok" | "unauthorized" | "error"
let lastMockReceivedPayload = null;
let mockRequestCount = 0;

function startMockAppsScript() {
  return new Promise((resolve) => {
    mockServer = http.createServer((req, res) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        mockRequestCount++;
        try {
          lastMockReceivedPayload = JSON.parse(body);
        } catch {
          lastMockReceivedPayload = body;
        }

        if (mockResponseMode === "unauthorized") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: "unauthorized" }));
        } else if (mockResponseMode === "error") {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: false, error: "Apps Script Internal Error" }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, reference: `AV-2026-MOCK-${mockRequestCount}` }));
        }
      });
    });

    mockServer.listen(MOCK_PORT, () => {
      resolve();
    });
  });
}

function stopMockAppsScript() {
  return new Promise((resolve) => {
    if (mockServer) {
      mockServer.close(resolve);
    } else {
      resolve();
    }
  });
}

let ipCounter = 1;
async function postApi(payload, headers = {}) {
  const testIp = headers["x-forwarded-for"] || `10.200.0.${ipCounter++}`;
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": testIp,
      ...headers,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log("==================================================================");
  console.log("  AURELIAN INTERNATIONAL — ENQUIRY WORKFLOW TEST SUITE");
  console.log("==================================================================\n");

  await startMockAppsScript();
  console.log(`📡 Local Google Apps Script Mock listening on ${MOCK_URL}\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = "") {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} — ${details}`);
      failed++;
    }
  }

  // 1. Valid Submission Test
  console.log("--- 1. Testing Valid Submission ---");
  mockResponseMode = "ok";
  const validPayload = {
    firstName: "Elena",
    lastName: "Rostova",
    company: "Nordic Organic Imports AB",
    email: "elena@nordicorganics.se",
    phone: "+46 8 123 4567",
    country: "Sweden",
    products: ["Beetroot Powder", "Spinach Powder"],
    quantity: "15",
    unit: "MT",
    notes: "Requires EU organic and ISO 22000 certification with CIF Gothenburg port pricing.",
    formLoadedAt: Date.now() - 5000, // 5s ago
    sourcePage: "/products/dehydrated-powders",
  };

  const t1 = await postApi(validPayload);
  assert(
    t1.status === 200 && t1.data?.ok === true && Boolean(t1.data?.reference),
    "Valid enquiry returns HTTP 200 with reference number",
    `Got status ${t1.status}: ${JSON.stringify(t1.data)}`
  );
  console.log(`     Assigned Reference: ${t1.data?.reference}`);

  // 2. Field Validation: Invalid Email
  console.log("\n--- 2. Testing Field Validation: Invalid Email ---");
  const invalidEmailPayload = {
    ...validPayload,
    email: "not-an-email",
    formLoadedAt: Date.now() - 5000,
  };
  const t2 = await postApi(invalidEmailPayload);
  assert(
    t2.status === 400 && t2.data?.errors?.email !== undefined,
    "Invalid email triggers HTTP 400 and returns field-level error",
    `Got status ${t2.status}: ${JSON.stringify(t2.data)}`
  );

  // 3. Field Validation: Empty Products
  console.log("\n--- 3. Testing Field Validation: Empty Products ---");
  const emptyProductsPayload = {
    ...validPayload,
    products: [],
    formLoadedAt: Date.now() - 5000,
  };
  const t3 = await postApi(emptyProductsPayload);
  assert(
    t3.status === 400 && t3.data?.errors?.products !== undefined,
    "Empty products array triggers HTTP 400 and returns field-level error",
    `Got status ${t3.status}: ${JSON.stringify(t3.data)}`
  );

  // 4. Spam Defense: Honeypot Filled
  console.log("\n--- 4. Testing Spam Defense: Honeypot ---");
  const honeypotPayload = {
    ...validPayload,
    _hp_company_fax: "Spam bot filled this",
    formLoadedAt: Date.now() - 5000,
  };
  const t4 = await postApi(honeypotPayload);
  assert(
    t4.status === 400 && t4.data?.error?.includes("anti-bot"),
    "Honeypot rejection triggers HTTP 400",
    `Got status ${t4.status}: ${JSON.stringify(t4.data)}`
  );

  // 5. Spam Defense: Rapid Submission (< 3 seconds)
  console.log("\n--- 5. Testing Spam Defense: Rapid Submission (<3s) ---");
  const rapidPayload = {
    ...validPayload,
    formLoadedAt: Date.now() - 500, // only 0.5s elapsed
  };
  const t5 = await postApi(rapidPayload);
  assert(
    t5.status === 400 && t5.data?.error?.includes("too quickly"),
    "Rapid submission under 3 seconds triggers HTTP 400",
    `Got status ${t5.status}: ${JSON.stringify(t5.data)}`
  );

  // 6. Rate Limiting: 6th Request from Same IP
  console.log("\n--- 6. Testing Rate Limiting (5 requests/hr limit) ---");
  const spamIp = "192.168.99.10";
  let got429 = false;
  for (let i = 1; i <= 6; i++) {
    const res = await postApi(
      {
        ...validPayload,
        email: `buyer_${i}@testcompany.com`,
        formLoadedAt: Date.now() - 4000,
      },
      { "x-forwarded-for": spamIp }
    );
    if (res.status === 429) {
      got429 = true;
      break;
    }
  }
  assert(
    got429,
    "6th request within an hour triggers HTTP 429 Rate Limit",
    "Did not receive HTTP 429 on 6th request"
  );

  // 7. Error Resilience: Apps Script returns unauthorized
  console.log("\n--- 7. Testing Resilience: Apps Script Unauthorized ---");
  mockResponseMode = "unauthorized";
  const unauthPayload = {
    ...validPayload,
    email: "unauth_test@example.com",
    formLoadedAt: Date.now() - 5000,
  };
  const t7 = await postApi(unauthPayload, { "x-forwarded-for": "10.0.0.1" });
  assert(
    t7.status === 200 && t7.data?.ok === true && Boolean(t7.data?.reference),
    "Server gracefully handles Apps Script unauthorized and saves locally",
    `Got status ${t7.status}: ${JSON.stringify(t7.data)}`
  );

  // 8. Error Resilience: Apps Script Down / Offline
  console.log("\n--- 8. Testing Resilience: Apps Script Offline ---");
  await stopMockAppsScript(); // Shut down mock server to simulate downtime
  const offlinePayload = {
    ...validPayload,
    email: "offline_test@example.com",
    formLoadedAt: Date.now() - 5000,
  };
  const t8 = await postApi(offlinePayload, { "x-forwarded-for": "10.0.0.2" });
  assert(
    t8.status === 200 && t8.data?.ok === true && Boolean(t8.data?.reference),
    "Server gracefully handles offline Apps Script and returns fallback reference",
    `Got status ${t8.status}: ${JSON.stringify(t8.data)}`
  );

  // 9. Security Audit: Check for secrets in frontend
  console.log("\n--- 9. Security Audit: Checking Frontend Bundle for Leaks ---");
  const srcSiteDir = path.join(ROOT_DIR, "src");
  let foundLeak = false;
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        if (!full.includes("server") && !full.includes("node_modules")) {
          scanDir(full);
        }
      } else if (/\.(tsx|ts|js|jsx)$/.test(f)) {
        // Exclude server-only files (server/ and api.*.ts)
        if (f.startsWith("api.") || f === "server.ts" || f === "start.ts") continue;
        const content = fs.readFileSync(full, "utf8");
        if (content.includes("ENQUIRY_SECRET") || content.includes("script.google.com")) {
          console.error(`  🚨 LEAK FOUND in client file: ${full}`);
          foundLeak = true;
        }
      }
    }
  }
  scanDir(srcSiteDir);
  assert(
    !foundLeak,
    "Zero ENQUIRY_SECRET or script.google.com occurrences in client code",
    "Client code contains sensitive secrets"
  );

  // Check .gitignore contains .env
  const gitignore = fs.readFileSync(path.join(ROOT_DIR, ".gitignore"), "utf8");
  assert(
    gitignore.includes(".env"),
    ".gitignore properly excludes .env files from git commits",
    ".env is not in .gitignore"
  );

  console.log("\n==================================================================");
  console.log(`  TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================================\n");

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
