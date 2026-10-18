const { chromium } = require('playwright');

async function test() {
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

  console.log('Checking /products/dehydrated-powders...');
  await page.goto('http://localhost:8082/products/dehydrated-powders', { waitUntil: 'networkidle' });
  const powderTitles = await page.$$eval('.product-card h3', els => els.map(e => e.textContent.trim()));
  console.log('Dehydrated Powders on page (' + powderTitles.length + '):', powderTitles);

  console.log('Checking /products/spices...');
  await page.goto('http://localhost:8082/products/spices', { waitUntil: 'networkidle' });
  const spiceTitles = await page.$$eval('.product-card h3', els => els.map(e => e.textContent.trim()));
  console.log('Spices on page (' + spiceTitles.length + '):', spiceTitles);

  console.log('Checking /products/fresh-vegetables...');
  await page.goto('http://localhost:8082/products/fresh-vegetables', { waitUntil: 'networkidle' });
  const vegTitles = await page.$$eval('.product-card h3', els => els.map(e => e.textContent.trim()));
  console.log('Vegetables on page (' + vegTitles.length + '):', vegTitles);

  console.log('Console errors count:', errors.length);
  if (errors.length > 0) console.error('Errors:', errors);

  await browser.close();
}

test().catch(console.error);
