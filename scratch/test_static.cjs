const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8082/markets', { waitUntil: 'networkidle' });
  const mapElem = await page.$('svg[aria-label*="export map"]');
  if (mapElem) {
    await mapElem.scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(3000);
  
  const diag = await page.evaluate(() => {
    const dotTransforms = Array.from(document.querySelectorAll('#travelling-particles g[data-particle]')).map(g => ({
      id: g.getAttribute('data-particle'),
      transform: g.getAttribute('transform'),
      opacity: g.style.opacity
    }));
    return { dotTransforms: dotTransforms.slice(0, 5) };
  });
  console.log('Diagnostic after scroll:', JSON.stringify(diag, null, 2));
  await browser.close();
})();
