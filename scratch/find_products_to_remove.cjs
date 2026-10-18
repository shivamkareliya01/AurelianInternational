const fs = require('fs');

// Read products.ts
const content = fs.readFileSync('src/data/products.ts', 'utf8');

// Evaluate the exported categories
// Because it's typescript, let's extract the categories JSON or use TS transpilation
const categoriesStart = content.indexOf('export const categories: Category[] = [');
const tsCode = content.substring(categoriesStart).replace('export const categories: Category[] = ', 'module.exports = ');

// Save temp and require
fs.writeFileSync('scratch/temp_categories.js', tsCode);
const categories = require('./temp_categories.js');

console.log('Categories count:', categories.length);

const targets = [
  'carrot',
  'tulsi',
  'fenugreek leaf',
  'kasuri methi',
  'coriander leaf',
  'curry leaf',
  'moringa seed',
  'black pepper',
  'fenugreek seed',
  'clove',
  'coriander seed',
  'dhania',
  'fennel',
  'saunf',
  'cardamom',
  'mustard',
  'star anise',
  'bay leaf',
  'tejpatta',
  'garam masala'
];

const matched = [];
const unmatchedTargets = new Set(targets);

categories.forEach(cat => {
  cat.products.forEach(p => {
    const pName = p.name.toLowerCase();
    const pSlug = p.slug.toLowerCase();
    for (const t of targets) {
      if (pName.includes(t) || pSlug.includes(t)) {
        matched.push({ category: cat.name, catSlug: cat.slug, slug: p.slug, name: p.name, matchedTerm: t });
        unmatchedTargets.delete(t);
      }
    }
  });
});

console.log(`Matched ${matched.length} products:`);
matched.forEach(m => console.log(`- [${m.catSlug}] ${m.slug} ("${m.name}") (matched: ${m.matchedTerm})`));

console.log('\nAll products in Dehydrated Powders and Spices:');
categories.forEach(cat => {
  if (cat.slug.includes('powder') || cat.slug.includes('spice')) {
    console.log(`\n=== Category: ${cat.name} (${cat.slug}) ===`);
    cat.products.forEach(p => console.log(`  - ${p.slug}: "${p.name}"`));
  }
});
