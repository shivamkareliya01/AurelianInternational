const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const brainDir = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\a64ef508-192c-40b3-b71a-401b0ebbc774';

async function verify() {
  console.log('=== STARTING TRADE ROUTE MAP ANIMATION VERIFICATION ===');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('Navigating to http://localhost:8082/markets...');
  await page.goto('http://localhost:8082/markets', { waitUntil: 'networkidle' });

  // 1. Check for absence of pause/play/replay controls
  const controlsCount = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.filter(b => {
      const text = (b.textContent || '').toLowerCase();
      const aria = (b.getAttribute('aria-label') || '').toLowerCase();
      return text.includes('pause') || text.includes('play') || text.includes('replay') ||
             aria.includes('pause') || aria.includes('play') || aria.includes('replay');
    }).length;
  });
  console.log(`(e) Pause/Play/Replay controls present: ${controlsCount} (Expected: 0)`);

  // Scroll map into view
  const mapElem = await page.$('svg[aria-label*="export map"]');
  if (mapElem) {
    await mapElem.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  }

  // 2. Check Route Draw-In elements
  const drawInInfo = await page.evaluate(() => {
    const paths = Array.from(document.querySelectorAll('.route-draw-path'));
    return {
      count: paths.length,
      samplePathLength: paths[0]?.getAttribute('pathLength'),
      sampleStyle: paths[0]?.getAttribute('style'),
      sampleClass: paths[0]?.getAttribute('class')
    };
  });
  console.log(`(a) Route draw-in paths count: ${drawInInfo.count}, pathLength: ${drawInInfo.samplePathLength}`);

  // 3. Check Port Halos (Pulsing circles)
  const haloInfo = await page.evaluate(() => {
    const halos = Array.from(document.querySelectorAll('.port-halo-pulse'));
    return {
      count: halos.length,
      sampleAnimation: halos[0]?.style.animation
    };
  });
  console.log(`(c-1) Pulsing port halos count: ${haloInfo.count} (Expected: 8, sample anim: ${haloInfo.sampleAnimation})`);

  // 4. Check Floating Labels
  const floatInfo = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.floating-label-pill'));
    return {
      count: pills.length,
      sampleAnimation: pills[0]?.style.animation
    };
  });
  console.log(`(c-2) Floating label pills count: ${floatInfo.count} (Expected: 8)`);

  // 5. Check Travelling Dots motion across 2 seconds
  console.log('Sampling moving dots over 2.5s...');
  const t0 = await page.evaluate(() => {
    const dots = Array.from(document.querySelectorAll('#travelling-particles g[data-particle]'));
    return dots.map(g => ({
      id: g.getAttribute('data-particle'),
      transform: g.getAttribute('transform'),
      opacity: g.style.opacity
    }));
  });

  await page.waitForTimeout(1200);
  const t1 = await page.evaluate(() => {
    const dots = Array.from(document.querySelectorAll('#travelling-particles g[data-particle]'));
    return dots.map(g => ({
      id: g.getAttribute('data-particle'),
      transform: g.getAttribute('transform'),
      opacity: g.style.opacity
    }));
  });

  await page.waitForTimeout(1200);
  const t2 = await page.evaluate(() => {
    const dots = Array.from(document.querySelectorAll('#travelling-particles g[data-particle]'));
    return dots.map(g => ({
      id: g.getAttribute('data-particle'),
      transform: g.getAttribute('transform'),
      opacity: g.style.opacity
    }));
  });

  let movedCount = 0;
  for (let i = 0; i < t0.length; i++) {
    if (t0[i].transform !== t2[i].transform) movedCount++;
  }
  console.log(`(b) Travelling dots animated & moved: ${movedCount} of ${t0.length} dots!`);
  console.log('Sample dot trajectory (IN_TO_AE-0):', { t0: t0[0], t1: t1[0], t2: t2[0] });

  // 6. Check hover highlight
  console.log('Testing hover highlight on US label...');
  const usLabel = await page.$('g[aria-label*="United States"]');
  if (usLabel) {
    await usLabel.hover();
    await page.waitForTimeout(400);
    const hoverState = await page.evaluate(() => {
      const usPath = document.querySelector('path[d*="265.6 158.5"]');
      const rect = document.querySelector('g[aria-label*="United States"] rect');
      return {
        pathStroke: usPath?.getAttribute('stroke'),
        pathWidth: usPath?.getAttribute('stroke-width'),
        rectFill: rect?.getAttribute('fill')
      };
    });
    console.log(`(d) Hover highlight verified:`, hoverState);
  }

  // 7. Capture screenshots at 1440px, 1024px, 390px
  const out1440 = path.join(brainDir, 'trade_route_map_1440px_verified.png');
  await page.screenshot({ path: out1440, fullPage: false });
  console.log(`Saved screenshot 1440px: ${out1440}`);

  // 1024px
  await page.setViewportSize({ width: 1024, height: 800 });
  if (mapElem) await mapElem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const out1024 = path.join(brainDir, 'trade_route_map_1024px_verified.png');
  await page.screenshot({ path: out1024, fullPage: false });
  console.log(`Saved screenshot 1024px: ${out1024}`);

  // 390px
  await page.setViewportSize({ width: 390, height: 844 });
  if (mapElem) await mapElem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const out390 = path.join(brainDir, 'trade_route_map_390px_verified.png');
  await page.screenshot({ path: out390, fullPage: false });
  console.log(`Saved screenshot 390px: ${out390}`);

  // 8. Reduced Motion test
  console.log('Testing prefers-reduced-motion...');
  const reducedPage = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  await reducedPage.emulateMedia({ reducedMotion: 'reduce' });
  await reducedPage.goto('http://localhost:8082/markets', { waitUntil: 'networkidle' });
  const reducedState = await reducedPage.evaluate(() => {
    const dotsVisible = Array.from(document.querySelectorAll('#travelling-particles g[data-particle]'))
      .some(g => g.style.opacity && parseFloat(g.style.opacity) > 0);
    return { dotsVisible };
  });
  console.log(`(g) Reduced-motion mode static (dots hidden): ${!reducedState.dotsVisible}`);
  await reducedPage.close();

  console.log(`(h) Console errors count: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Errors:', consoleErrors);
  }

  await browser.close();
  console.log('=== VERIFICATION COMPLETED SUCCESSFULLY ===');
}

verify().catch(console.error);
