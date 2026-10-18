const fs = require('fs');

const slugsToRemove = new Set([
  'carrot',
  'moringa-seed-powder',
  'curry-leaf-powder',
  'coriander-leaf-powder',
  'kasuri-methi-powder',
  'tulsi-holy-basil-leaf-powder',
  'black-pepper',
  'fenugreek-seeds',
  'coriander-seeds',
  'green-cardamom',
  'cloves',
  'fennel-seeds',
  'mustard-seeds',
  'star-anise',
  'bay-leaf',
  'garam-masala'
]);

// 1. Process src/data/products.ts
console.log('Reading src/data/products.ts...');
const productsCode = fs.readFileSync('src/data/products.ts', 'utf8');

// Parse the categories array from the file
// Find the categories block
const marker = 'export const categories: Category[] = ';
const startIdx = productsCode.indexOf(marker);
if (startIdx === -1) throw new Error('Marker not found');

const endMarker = '\nexport const allProducts:';
const endIdx = productsCode.indexOf(endMarker);
if (endIdx === -1) throw new Error('End marker not found');

const jsonStr = productsCode.substring(startIdx + marker.length, endIdx).trim();
const categories = JSON.parse(jsonStr.endsWith(';') ? jsonStr.slice(0, -1) : jsonStr);

let removedCount = 0;
categories.forEach(cat => {
  const before = cat.products.length;
  cat.products = cat.products.filter(p => {
    if (slugsToRemove.has(p.slug)) {
      console.log(`Removing product: [${cat.slug}] ${p.slug} ("${p.name}")`);
      removedCount++;
      return false;
    }
    return true;
  });
  console.log(`Category "${cat.name}" count: ${before} -> ${cat.products.length}`);
  if (cat.slug === 'spices' && cat.image === '/products/black-pepper.webp') {
    cat.image = '/products/turmeric.webp';
    console.log(`Updated Spices category hero image to /products/turmeric.webp`);
  }
});

console.log(`Total removed from products.ts: ${removedCount} (Expected: 16)`);

// Reconstruct products.ts
const newCategoriesJson = JSON.stringify(categories, null, 2);
const header = productsCode.substring(0, startIdx).replace(/\d+ Approved Export Products/, `${78 - removedCount} Approved Export Products`);
const footer = productsCode.substring(endIdx);
const newProductsCode = `${header}${marker}${newCategoriesJson};\n${footer}`;

fs.writeFileSync('src/data/products.ts', newProductsCode);
console.log('Successfully wrote updated src/data/products.ts');

// 2. Process src/data/powderColors.ts
console.log('Updating src/data/powderColors.ts...');
const powderSlugsToRemove = [
  'moringa-seed-powder',
  'curry-leaf-powder',
  'coriander-leaf-powder',
  'kasuri-methi-powder',
  'tulsi-holy-basil-leaf-powder'
];

let powderColorsCode = fs.readFileSync('src/data/powderColors.ts', 'utf8');
powderColorsCode = powderColorsCode.replace('// --- 14 Core Dehydrated Powders ---', '// --- 9 Core Dehydrated Powders ---');

// For each powder slug, remove its entry block
powderSlugsToRemove.forEach(slug => {
  // Regex to remove the entry: "slug": { ... },
  const reg = new RegExp(`\\s*"${slug}":\\s*\\{[^}]*\\},?`, 'g');
  powderColorsCode = powderColorsCode.replace(reg, '');
  console.log(`Removed ${slug} from powderColors.ts`);
});

fs.writeFileSync('src/data/powderColors.ts', powderColorsCode);
console.log('Successfully wrote updated src/data/powderColors.ts');
