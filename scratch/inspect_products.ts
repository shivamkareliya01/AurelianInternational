import { categories } from '../src/data/products';

console.log('Categories count:', categories.length);
categories.forEach(cat => {
  console.log(`\nCategory: ${cat.name} (${cat.slug}) - ${cat.products.length} products`);
  cat.products.forEach(p => console.log(`   - [${p.slug}] "${p.name}"`));
});
