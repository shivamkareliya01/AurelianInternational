const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const brainDir = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\a64ef508-192c-40b3-b71a-401b0ebbc774';

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('Navigating to http://localhost:8082/markets...');
  await page.goto('http://localhost:8082/markets', { waitUntil: 'networkidle' });
  
  // Find map section
  const mapElem = await page.$('svg[aria-label*="export map"]');
  if (mapElem) {
    await mapElem.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  }

  const outPath = path.join(brainDir, 'markets_map_current.png');
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`Saved screenshot: ${outPath}, errors: ${errors.length}`);
  
  await browser.close();
}

run().catch(console.error);
