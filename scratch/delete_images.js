import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public/products');

// Slugs of deleted products
const fruitExactPrefixes = [
  'kesar-mango',
  'thompson-seedless-grapes',
  'nagpur-orange',
  'pineapple',
];

// Note: lemon and papaya have powder equivalents (lemon-powder*, papaya-powder*).
// We ONLY delete lemon and papaya fresh fruit images!
const fruitExactFiles = [
  'lemon.webp',
  'lemon-2.webp',
  'lemon-3.webp',
  'papaya.webp',
  'papaya-2.webp',
  'papaya-3.webp',
];

const powderPrefixes = [
  'butterfly-pea-flower-powder',
  'rose-petal-powder',
  'purple-sweet-potato-powder',
  'lemongrass-powder',
];

const files = fs.readdirSync(publicDir);
const toDelete = [];

for (const file of files) {
  // check exact fruit files
  if (fruitExactFiles.includes(file)) {
    toDelete.push(file);
    continue;
  }
  // check fruit prefixes
  if (fruitExactPrefixes.some(prefix => file.startsWith(prefix))) {
    toDelete.push(file);
    continue;
  }
  // check powder prefixes
  if (powderPrefixes.some(prefix => file.startsWith(prefix))) {
    toDelete.push(file);
    continue;
  }
}

console.log('Files identified for deletion (' + toDelete.length + '):');
toDelete.forEach(f => console.log(' - ' + f));

// Verify none of the preserved powders or fruits are in toDelete
const forbiddenInDelete = ['lemon-powder', 'papaya-powder', 'alphonso', 'banana', 'coconut-milk-powder'];
for (const f of toDelete) {
  for (const forb of forbiddenInDelete) {
    if (f.startsWith(forb)) {
      throw new Error(`CRITICAL ERROR: file ${f} matches forbidden pattern ${forb}! Aborting.`);
    }
  }
}

// Delete files
for (const f of toDelete) {
  fs.unlinkSync(path.join(publicDir, f));
}

console.log('\nSuccessfully deleted ' + toDelete.length + ' product image files.');
