const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const brainDir = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\a64ef508-192c-40b3-b71a-401b0ebbc774';

async function run() {
  console.log('Launching browser to capture verified screenshots...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  const viewports = [
    { width: 1440, height: 900, name: 'dehydrated_powders_1440px_verified.png' },
    { width: 1024, height: 900, name: 'dehydrated_powders_1024px_verified.png' },
    { width: 390, height: 844, name: 'dehydrated_powders_390px_verified.png' }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    console.log(`Navigating to ${vp.width}px view...`);
    await page.goto('http://localhost:8082/products/dehydrated-powders', { waitUntil: 'networkidle' });
    
    // Scroll down to the products grid
    const gridElem = await page.$('#white-onion-powder');
    if (gridElem) {
      await gridElem.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
    } else {
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(1000);
    }

    const outPath = path.join(brainDir, vp.name);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot at ${vp.width}px: ${outPath}`);
    console.log(`Console errors count at ${vp.width}px: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Errors:', errors);
    }
    await page.close();
  }

  await browser.close();
  console.log('Finished capturing all verification screenshots successfully!');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
