// scripts/visual-check.js
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve("public/test-screens");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log("🚀 Launching browser visual verification...");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  const page = await browser.newPage();
  
  // 1. Desktop 1920x1080
  await page.setViewportSize({ width: 1920, height: 1080 });
  console.log("Navigating to http://localhost:8082/markets...");
  await page.goto("http://localhost:8082/markets", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Scroll to map card
  const mapSection = await page.$("section:has(svg[viewBox='0 0 1000 520'])");
  if (mapSection) {
    await mapSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    // Take map section screenshot
    await mapSection.screenshot({ path: path.join(outDir, "map-section-1920.png") });
    console.log("Saved map-section-1920.png");
  }

  // Click Europe tab to inspect docked panel and route focus
  console.log("Clicking Europe tab...");
  const europeTab = await page.getByRole("button", { name: /Europe/i }).first();
  if (europeTab) {
    await europeTab.click();
    await page.waitForTimeout(500);
    if (mapSection) {
      await mapSection.screenshot({ path: path.join(outDir, "map-europe-focus-1920.png") });
      console.log("Saved map-europe-focus-1920.png");
    }
  }

  // Click a specific country (e.g. United Kingdom or Saudi Arabia)
  console.log("Clicking United Kingdom chip in docked panel...");
  const ukChip = await page.getByRole("button", { name: /United Kingdom/i }).first();
  if (ukChip) {
    await ukChip.click();
    await page.waitForTimeout(500);
    if (mapSection) {
      await mapSection.screenshot({ path: path.join(outDir, "map-uk-details-1920.png") });
      console.log("Saved map-uk-details-1920.png");
    }
  }

  // 2. Viewport 1280px
  console.log("Capturing 1280px...");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(500);
  if (mapSection) {
    await mapSection.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(outDir, "map-section-1280.png") });
  }

  // 3. Viewport 768px (Tablet)
  console.log("Capturing 768px...");
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  if (mapSection) {
    await mapSection.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(outDir, "map-section-768.png") });
  }

  // 4. Viewport 375px (Mobile iPhone SE)
  console.log("Capturing 375px...");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  if (mapSection) {
    await mapSection.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(outDir, "map-section-375.png") });
  }

  // 5. Home page compact map
  console.log("Capturing Home page compact map...");
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("http://localhost:8082/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const reachSection = await page.$("section:has(svg[viewBox='0 0 1000 520'])");
  if (reachSection) {
    await reachSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await reachSection.screenshot({ path: path.join(outDir, "home-reach-compact-map.png") });
    console.log("Saved home-reach-compact-map.png");
  }

  await browser.close();
  console.log("🎉 All visual screenshots captured successfully!");
}

run().catch((err) => {
  console.error("Error during visual check:", err);
  process.exit(1);
});
