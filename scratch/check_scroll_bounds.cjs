const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:8080/markets', { waitUntil: 'networkidle' });

  // 1. Scroll into view and verify moving
  const mapElem = await page.$('svg[data-map="world-trade-map"]');
  await mapElem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  const onScreen1 = await page.evaluate(() => document.querySelector('.tml-dot').getAttribute('cx'));
  await page.waitForTimeout(1000);
  const onScreen2 = await page.evaluate(() => document.querySelector('.tml-dot').getAttribute('cx'));
  console.log('Dots moving while on screen:', onScreen1 !== onScreen2);

  // 2. Scroll completely off-screen (bottom of page)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  const offScreen1 = await page.evaluate(() => document.querySelector('.tml-dot').getAttribute('cx'));
  await page.waitForTimeout(1000);
  const offScreen2 = await page.evaluate(() => document.querySelector('.tml-dot').getAttribute('cx'));
  console.log('Dots moving while scrolled completely off-screen (should be false):', offScreen1 !== offScreen2);
  console.log('Animation paused off-screen (CPU idle):', offScreen1 === offScreen2);

  // 3. Scroll back into view and verify resumes automatically
  await mapElem.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const resume1 = await page.evaluate(() => document.querySelector('.tml-dot').getAttribute('cx'));
  await page.waitForTimeout(1000);
  const resume2 = await page.evaluate(() => document.querySelector('.tml-dot').getAttribute('cx'));
  console.log('Dots resumed moving when scrolled back into view:', resume1 !== resume2);

  await browser.close();
})();
