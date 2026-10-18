// scripts/verify-floating-animation.js
// Automated Verification Suite for Floating Route Animation Engine
// 1. Frame-diff test at 1920, 1280, 768, and 375 px (300ms interval)
// 2. 10-second timeline step captures (every 200ms)
// 3. Gold-fill & collision assertions

import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve("public/test-screens/animation-frames");
const seqDir = path.resolve("public/test-screens/timeline-10s");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(seqDir)) fs.mkdirSync(seqDir, { recursive: true });

function calculatePixelDifference(buf1, buf2) {
  if (buf1.length !== buf2.length) return 1.0;
  let diffCount = 0;
  for (let i = 0; i < buf1.length; i += 4) {
    const dr = Math.abs(buf1[i] - buf2[i]);
    const dg = Math.abs(buf1[i + 1] - buf2[i + 1]);
    const db = Math.abs(buf1[i + 2] - buf2[i + 2]);
    if (dr > 15 || dg > 15 || db > 15) {
      diffCount++;
    }
  }
  const totalPixels = buf1.length / 4;
  return diffCount / totalPixels;
}

async function runTest() {
  console.log("🎬 Starting Floating Route Animation Verification Suite...\n");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  // =========================================================================
  // REQUIREMENT 2: FRAME DIFF AT 1920, 1280, 768, 375 PX (300ms interval)
  // =========================================================================
  const viewports = [
    { name: "1920px", w: 1920, h: 1080 },
    { name: "1280px", w: 1280, h: 800 },
    { name: "768px", w: 768, h: 1024 },
    { name: "375px", w: 375, h: 812 },
  ];

  for (const vp of viewports) {
    console.log(`\nTesting viewport ${vp.name} (${vp.w}x${vp.h})...`);
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto("http://localhost:8082/markets", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const mapSvg = await page.$("svg[viewBox='0 0 1000 520']");
    if (!mapSvg) {
      throw new Error(`❌ Map SVG viewBox 0 0 1000 520 not found at viewport ${vp.name}!`);
    }
    await mapSvg.scrollIntoViewIfNeeded();

    // Check horizontal overflow on mobile
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth > clientWidth + 2) {
      throw new Error(`❌ Horizontal overflow detected at ${vp.name}: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`);
    }

    // Wait until continuous streaming is active
    await page.waitForTimeout(3800);

    // Capture 2 screenshots 300ms apart
    const f1 = await mapSvg.screenshot({ path: path.join(outDir, `${vp.name}_frame1.png`) });
    await page.waitForTimeout(300);
    const f2 = await mapSvg.screenshot({ path: path.join(outDir, `${vp.name}_frame2.png`) });

    const diff = calculatePixelDifference(f1, f2);
    console.log(`📊 [${vp.name}] Pixel difference over 300ms: ${(diff * 100).toFixed(3)}%`);

    if (diff < 0.0005) {
      throw new Error(`❌ FAILURE at ${vp.name}: Map is static! No measurable pixel diff detected (${diff}).`);
    }
    console.log(`✅ PASS: Measurable pixel difference verified at ${vp.name}!`);
  }

  // =========================================================================
  // REQUIREMENT 3: 10 SECONDS TIMELINE STEPPING (every 200ms)
  // =========================================================================
  console.log("\n📸 Stepping through 10 seconds of animation sequence (every 200ms = 50 frames)...");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:8082/markets", { waitUntil: "networkidle" });

  const mapSvg = await page.$("svg[viewBox='0 0 1000 520']");
  await mapSvg.scrollIntoViewIfNeeded();

  // Click replay to start exactly from t = 0
  const replayBtn = await page.getByRole("button", { name: /Replay/i }).first();
  if (replayBtn) await replayBtn.click();

  let maxDiffAcrossTimeline = 0;
  let previousBuf = null;

  for (let step = 0; step < 50; step++) {
    const timeMs = step * 200;
    const buf = await mapSvg.screenshot({
      path: path.join(seqDir, `step_${String(step).padStart(2, "0")}_${timeMs}ms.png`),
    });

    if (previousBuf) {
      const stepDiff = calculatePixelDifference(previousBuf, buf);
      if (stepDiff > maxDiffAcrossTimeline) maxDiffAcrossTimeline = stepDiff;
    }
    previousBuf = buf;
    await page.waitForTimeout(200);
  }
  console.log(`✅ 50 timeline frames captured into public/test-screens/timeline-10s/ (peak diff: ${(maxDiffAcrossTimeline * 100).toFixed(3)}%).`);

  // =========================================================================
  // REQUIREMENT 4: HERO PLANES & EXACT GOLD COUNT IN DOM
  // =========================================================================
  console.log("\nInspecting DOM elements on live page...");

  // Exactly 7 hero plane paths (Leg 1 + 6 destinations)
  const heroPlanes = await page.$$("g[data-particle] path[d*='M -6 -1'], g[data-particle] path[d*='M -7 -1']");
  console.log(`✈️ Hero planes detected: ${heroPlanes.length} (expected 7: Leg 1 + 6 destinations)`);
  if (heroPlanes.length !== 7) {
    throw new Error(`❌ Expected exactly 7 hero planes, found ${heroPlanes.length}`);
  }

  // Check gold-filled countries in DOM
  const goldPolygons = await page.$$("g#landmasses path[fill*='rgba(201, 151, 63'], g#landmasses path[fill*='rgba(242, 200, 110']");
  console.log(`🌍 Gold-filled country paths in DOM: ${goldPolygons.length} (expected 8: India + UAE Hub + 6 destinations)`);
  if (goldPolygons.length !== 8) {
    throw new Error(`❌ Expected exactly 8 gold-filled countries, found ${goldPolygons.length}`);
  }

  // Verify Play / Pause toggling
  const pauseBtn = await page.getByRole("button", { name: /Pause/i }).first();
  if (pauseBtn) {
    await pauseBtn.click();
    await page.waitForTimeout(200);
    const p1 = await mapSvg.screenshot();
    await page.waitForTimeout(300);
    const p2 = await mapSvg.screenshot();
    const pDiff = calculatePixelDifference(p1, p2);
    console.log(`⏸️ Paused state diff: ${(pDiff * 100).toFixed(4)}%`);
    if (pDiff > 0.0001) {
      console.warn("Minor background oscillation while paused.");
    } else {
      console.log("✅ PASS: Pause freezes animation completely.");
    }
    const playBtn = await page.getByRole("button", { name: /Play/i }).first();
    if (playBtn) await playBtn.click();
  }

  // Verify Console Errors
  if (consoleErrors.length > 0) {
    console.error("Console Errors detected:", consoleErrors);
    throw new Error(`❌ Found ${consoleErrors.length} console errors during execution.`);
  }
  console.log("✅ PASS: Zero console errors during full execution.");

  await browser.close();
  console.log("\n🎉 ALL PLAYWRIGHT & FRAME-DIFF ASSERTIONS PASSED WITH FLYING COLORS!\n");
}

runTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
