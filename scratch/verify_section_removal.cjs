const { chromium } = require('playwright');
const path = require('path');

const brainDir = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\a64ef508-192c-40b3-b71a-401b0ebbc774';

async function test() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to http://localhost:8082/products/fresh-vegetables...');
  await page.goto('http://localhost:8082/products/fresh-vegetables', { waitUntil: 'networkidle' });

  // Scroll down slightly below header
  await page.evaluate(() => window.scrollTo(0, 350));
  await page.waitForTimeout(600);

  const outPath = path.join(brainDir, 'fresh_vegetables_section_removed.png');
  await page.screenshot({ path: outPath, fullPage: false });
  console.log('Saved screenshot:', outPath);

  // Verify that "Cold Chain Managed" text is NOT anywhere on the page
  const hasColdChain = await page.evaluate(() => document.body.innerText.includes('Cold Chain Managed'));
  console.log('Is "Cold Chain Managed" present on page?:', hasColdChain);

  await browser.close();
}

test().catch(console.error);
