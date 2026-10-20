const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    else console.log('PAGE LOG:', msg.type(), msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log('Navigating to http://localhost:8080/markets...');
  await page.goto('http://localhost:8080/markets', { waitUntil: 'networkidle' });

  const mapSvg = await page.$('svg[data-map="world-trade-map"]');
  console.log('Map SVG found:', !!mapSvg);
  if (mapSvg) {
    await mapSvg.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  }

  const routes = await page.$$('path[data-trade-route="main"]');
  console.log('Route paths count:', routes.length, '(Expected: 7)');

  const halos = await page.$$('.port-halo-pulse');
  const rings = await page.$$('.port-ring-pulse');
  console.log('Halos count:', halos.length, '(Expected: 7 - UAE + 6 destinations)');
  console.log('Ring count:', rings.length, '(Expected: 1 - India origin)');

  const floatingLabels = await page.$$('.floating-label-pill');
  console.log('Floating labels count:', floatingLabels.length, '(Expected: 8)');

  const dots = await page.$$('.tml-dot');
  console.log('Dots count:', dots.length, '(Expected: 14)');

  const getDots = async () => {
    return page.evaluate(() => {
      return Array.from(document.querySelectorAll('.tml-dot')).map(el => ({
        id: el.getAttribute('data-particle'),
        cx: el.getAttribute('cx'),
        cy: el.getAttribute('cy'),
        opacity: el.getAttribute('opacity')
      }));
    });
  };

  // Wait for initial draw-in & startAt
  await page.waitForTimeout(2000);
  const d1 = await getDots();
  await page.waitForTimeout(2500);
  const d2 = await getDots();

  console.log('Sample Leg 1 dot at t=2s:', d1[0]);
  console.log('Sample Leg 1 dot at t=4.5s:', d2[0]);
  console.log('Sample Spoke dot at t=2s:', d1[2]);
  console.log('Sample Spoke dot at t=4.5s:', d2[2]);

  let movedCount = 0;
  for (let i = 0; i < d1.length; i++) {
    if (d1[i].cx !== d2[i].cx || d1[i].cy !== d2[i].cy) {
      movedCount++;
    }
  }
  console.log(`Active moving dots count: ${movedCount} of ${d1.length}`);

  // Test hover highlight
  await page.evaluate(() => {
    const el = document.querySelector('g[data-market="US"]');
    if (el) el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  });
  await page.waitForTimeout(300);
  const isHot = await page.evaluate(() => {
    const p = document.querySelector('path[data-market="US"]');
    return p ? p.classList.contains('route-hot') : 'path not found';
  });
  console.log('Hover on US label brightens route (route-hot):', isHot);

  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors:', consoleErrors);
  }

  await browser.close();
})();
