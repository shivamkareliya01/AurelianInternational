const fs = require('fs');

const content = fs.readFileSync('src/data/products.ts', 'utf8');

// The file exports products array
// Let's match product items
const lines = content.split('\n');
const items = [];
let current = null;

for (const line of lines) {
  const idMatch = line.match(/^\s*id:\s*["']([^"']+)["']/);
  if (idMatch) {
    if (current) items.push(current);
    current = { id: idMatch[1] };
  }
  const nameMatch = line.match(/^\s*name:\s*["']([^"']+)["']/);
  if (nameMatch && current) {
    current.name = nameMatch[1];
  }
  const catMatch = line.match(/^\s*category:\s*["']([^"']+)["']/);
  if (catMatch && current) {
    current.category = catMatch[1];
  }
}
if (current) items.push(current);

console.log('Total products found:', items.length);
console.log(items);
