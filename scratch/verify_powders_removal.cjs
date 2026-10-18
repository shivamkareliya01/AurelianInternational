const { chromium } = require('playwright');
const path = require('path');

const brainDir = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\a64ef508-192c-40b3-b71a-401b0ebbc774';

async function test() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to http://localhost:8082/products/dehydrated-powders...');
  await page.goto('http://localhost:8082/products/dehydrated-powders', { waitUntil: 'networkidle' });

  // Scroll down slightly below header
  await page.evaluate(() => window.scrollTo(0, 350));
  await page.waitForTimeout(600);

  const outPath = path.join(brainDir, 'dehydrated_powders_sections_removed.png');
  await page.screenshot({ path: outPath, fullPage: false });
  console.log('Saved screenshot:', outPath);

  // Check that "The Dehydration Process" and "Botanical Color Spectrum" are NOT on the page
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Has "The Dehydration Process"?:', bodyText.includes('The Dehydration Process'));
  console.log('Has "Botanical Color Spectrum"?:', bodyText.includes('Botanical Color Spectrum'));

  await browser.close();
}

test().catch(console.error);
