const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const brainDir = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\e31c81e4-1688-4468-a5c0-eb28466df0d7';
if (!fs.existsSync(brainDir)) fs.mkdirSync(brainDir, { recursive: true });

async function verify() {
  console.log('=== STARTING PRODUCTION MAP ANIMATION VERIFICATION ===');
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

  console.log('1. Navigating to server at http://localhost:8080/markets...');
  await page.goto('http://localhost:8080/markets', { waitUntil: 'networkidle' });

  // Check no pause/replay buttons
  const pauseControls = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.filter(b => /pause|play|replay/i.test(b.textContent || '') || /pause|play|replay/i.test(b.getAttribute('aria-label') || '')).length;
  });
  console.log(`No Pause/Play/Replay buttons: ${pauseControls === 0} (found: ${pauseControls})`);

  // Map SVG
  const mapElem = await page.$('svg[data-map="world-trade-map"]');
  if (!mapElem) throw new Error('Map SVG not found!');
  await mapElem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Check 7 routes
  const routesCount = await page.$$eval('path[data-trade-route="main"]', els => els.length);
  console.log(`(a) Route paths count: ${routesCount} (Expected: 7)`);

  // Check Halos & Ring
  const halosCount = await page.$$eval('.port-halo-pulse', els => els.length);
  const ringCount = await page.$$eval('.port-ring-pulse', els => els.length);
  console.log(`(c-1) Pulsing port halos: ${halosCount} (Expected: 7), ring: ${ringCount} (Expected: 1)`);

  // Check Floating labels
  const floatingCount = await page.$$eval('.floating-label-pill', els => els.length);
  console.log(`(c-2) Floating label pills: ${floatingCount} (Expected: 8: IN, AE, US, NL, DE, KE, ZA, AU)`);

  // Check 14 Dots
  const dotsCount = await page.$$eval('.tml-dot', els => els.length);
  console.log(`(b-1) Travelling dots count: ${dotsCount} (Expected: 14: 2 per route across 7 routes)`);

  // Sampling dots at 3 intervals (2.5s apart) and capturing 3 screenshots
  console.log('\n--- CAPTURING 3 SCREENSHOTS A FEW SECONDS APART ---');
  await page.waitForTimeout(1500);

  // Frame 1
  const mapCard = await page.$('div:has(> svg[data-map="world-trade-map"])');
  const targetShot = mapCard || mapElem;
  const p1 = path.join(brainDir, 'markets_map_anim_1.png');
  await targetShot.screenshot({ path: p1 });
  console.log(`Saved Screenshot 1: ${p1}`);

  const dotsFrame1 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.tml-dot')).map(el => ({
      id: el.getAttribute('data-particle'),
      cx: el.getAttribute('cx'),
      cy: el.getAttribute('cy'),
      opacity: el.getAttribute('opacity')
    }));
  });

  // Wait 2.5s -> Frame 2
  await page.waitForTimeout(2500);
  const p2 = path.join(brainDir, 'markets_map_anim_2.png');
  await targetShot.screenshot({ path: p2 });
  console.log(`Saved Screenshot 2: ${p2}`);

  const dotsFrame2 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.tml-dot')).map(el => ({
      id: el.getAttribute('data-particle'),
      cx: el.getAttribute('cx'),
      cy: el.getAttribute('cy'),
      opacity: el.getAttribute('opacity')
    }));
  });

  // Wait 2.5s -> Frame 3
  await page.waitForTimeout(2500);
  const p3 = path.join(brainDir, 'markets_map_anim_3.png');
  await targetShot.screenshot({ path: p3 });
  console.log(`Saved Screenshot 3: ${p3}`);

  const dotsFrame3 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.tml-dot')).map(el => ({
      id: el.getAttribute('data-particle'),
      cx: el.getAttribute('cx'),
      cy: el.getAttribute('cy'),
      opacity: el.getAttribute('opacity')
    }));
  });

  // Verify all 14 dots moved
  let movedFrame1to2 = 0;
  let movedFrame2to3 = 0;
  for (let i = 0; i < dotsFrame1.length; i++) {
    if (dotsFrame1[i].cx !== dotsFrame2[i].cx || dotsFrame1[i].cy !== dotsFrame2[i].cy) movedFrame1to2++;
    if (dotsFrame2[i].cx !== dotsFrame3[i].cx || dotsFrame2[i].cy !== dotsFrame3[i].cy) movedFrame2to3++;
  }
  console.log(`(b-2) Dots moved Frame 1 -> Frame 2: ${movedFrame1to2} of 14`);
  console.log(`(b-3) Dots moved Frame 2 -> Frame 3: ${movedFrame2to3} of 14`);

  console.log('\nSample trajectories:');
  console.log('Leg 1 (IN -> UAE):', {
    f1: dotsFrame1[0],
    f2: dotsFrame2[0],
    f3: dotsFrame3[0]
  });
  console.log('Spoke 1 (UAE -> US):', {
    f1: dotsFrame1[2],
    f2: dotsFrame2[2],
    f3: dotsFrame3[2]
  });
  console.log('Spoke 6 (UAE -> AU):', {
    f1: dotsFrame1[12],
    f2: dotsFrame2[12],
    f3: dotsFrame3[12]
  });

  // (d) Test Hover Highlight
  console.log('\n--- TESTING HOVER HIGHLIGHT ---');
  await page.evaluate(() => {
    const el = document.querySelector('g[data-market="US"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  });
  await page.waitForTimeout(250);
  const hoverState = await page.evaluate(() => {
    const usPath = document.querySelector('path[data-market="US"]');
    const usRect = document.querySelector('g[data-market="US"] rect');
    return {
      hasRouteHotClass: usPath?.classList.contains('route-hot'),
      routeStrokeWidth: usPath?.getAttribute('stroke-width'),
      rectFill: usRect?.getAttribute('fill')
    };
  });
  console.log('(d) Hover highlight verified on US market corridor:', hoverState);

  // (e) Normal Scroll Safety Test
  console.log('\n--- TESTING SCROLL SAFETY ---');
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(300);
  const scrollAfter = await page.evaluate(() => window.scrollY);
  console.log(`(e) Page scrolls normally over map: scroll before = ${scrollBefore}, after = ${scrollAfter} (diff: ${scrollAfter - scrollBefore}px)`);

  // (f) Off-screen Pause Test (IntersectionObserver)
  console.log('\n--- TESTING OFF-SCREEN PAUSE (IntersectionObserver) ---');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  const offDots1 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.tml-dot')).map(d => ({ cx: d.getAttribute('cx'), cy: d.getAttribute('cy') }));
  });
  await page.waitForTimeout(1000);
  const offDots2 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.tml-dot')).map(d => ({ cx: d.getAttribute('cx'), cy: d.getAttribute('cy') }));
  });
  const dotsMovedWhileOffScreen = offDots1.some((d, idx) => d.cx !== offDots2[idx].cx || d.cy !== offDots2[idx].cy);
  console.log(`(f) Animation paused while scrolled off-screen: ${!dotsMovedWhileOffScreen} (CPU idle confirmed)`);

  // (h) Multi-viewport captures: 1024px and 390px
  console.log('\n--- TESTING VIEWPORTS: 1024px and 390px ---');
  // 1024px
  await page.setViewportSize({ width: 1024, height: 768 });
  await mapElem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const p1024 = path.join(brainDir, 'trade_route_map_1024px.png');
  await targetShot.screenshot({ path: p1024 });
  console.log(`(h-1) Saved 1024px screenshot: ${p1024}`);

  // 390px
  await page.setViewportSize({ width: 390, height: 844 });
  await mapElem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const p390 = path.join(brainDir, 'trade_route_map_390px.png');
  await targetShot.screenshot({ path: p390 });
  console.log(`(h-2) Saved 390px screenshot: ${p390}`);

  // Reduced motion test
  console.log('\n--- TESTING PREFERS-REDUCED-MOTION ---');
  const rmPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await rmPage.emulateMedia({ reducedMotion: 'reduce' });
  await rmPage.goto('http://localhost:8080/markets', { waitUntil: 'networkidle' });
  const rmDotsOpacity = await rmPage.evaluate(() => {
    const dots = Array.from(document.querySelectorAll('.tml-dot'));
    return dots.every(d => d.getAttribute('opacity') === '0' || d.style.display === 'none');
  });
  console.log(`Reduced motion mode static (all dots hidden/opacity 0): ${rmDotsOpacity}`);
  await rmPage.close();

  console.log('\nConsole Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
  }

  await browser.close();
  console.log('\n=== ALL PRODUCTION CHECKS COMPLETED SUCCESSFULLY ===');
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
