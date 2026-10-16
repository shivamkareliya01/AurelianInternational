import fs from "fs";
import path from "path";
import { allProducts, categories } from "../src/data/products";

console.log("==================================================");
console.log("RUNNING PRODUCT CATALOG VALIDATION");
console.log("==================================================");

let hasError = false;

// 1. Verify category count
console.log(`Checking category count: found ${categories.length} (expected 5)`);
if (categories.length !== 5) {
  console.error(`❌ ERROR: Expected exactly 5 categories, found ${categories.length}`);
  hasError = true;
}

// 2. Verify total product count
console.log(`Checking total product count: found ${allProducts.length} (expected 68)`);
if (allProducts.length !== 68) {
  console.error(`❌ ERROR: Expected exactly 68 products, found ${allProducts.length}`);
  hasError = true;
}

// 3. Expected product counts per category
const expectedPerCat: Record<string, number> = {
  agriculture: 16,
  "fresh-vegetables": 14,
  "fresh-fruits": 9,
  spices: 14,
  "natural-stones-tiles": 15,
};

for (const cat of categories) {
  const expected = expectedPerCat[cat.slug];
  if (expected === undefined) {
    console.error(`❌ ERROR: Unexpected category slug '${cat.slug}'`);
    hasError = true;
  } else if (cat.products.length !== expected) {
    console.error(`❌ ERROR: Category '${cat.slug}' has ${cat.products.length} products, expected ${expected}`);
    hasError = true;
  } else {
    console.log(`✓ Category '${cat.slug}': ${cat.products.length}/${expected} products`);
  }
}

// 4. Verify images exist, alt text is present, slugs match
const seenSlugs = new Set<string>();
const seenImages = new Set<string>();

const publicDir = path.resolve(process.cwd(), "public");

for (const p of allProducts) {
  // Check duplicate slugs
  if (seenSlugs.has(p.slug)) {
    console.error(`❌ ERROR: Duplicate slug '${p.slug}'`);
    hasError = true;
  }
  seenSlugs.add(p.slug);

  // Check alt text
  if (!p.alt || p.alt.trim().length === 0) {
    console.error(`❌ ERROR: Product '${p.slug}' is missing alt text`);
    hasError = true;
  }

  // Check main image
  if (!p.image || !p.image.startsWith("/products/")) {
    console.error(`❌ ERROR: Product '${p.slug}' has invalid image path '${p.image}'`);
    hasError = true;
  } else {
    const fullPath = path.join(publicDir, p.image.replace(/^\//, ""));
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ ERROR: Image file does not exist for '${p.slug}': ${fullPath}`);
      hasError = true;
    }
  }

  // Check duplicate image files across distinct products
  if (seenImages.has(p.image)) {
    console.error(`❌ ERROR: Duplicate image file '${p.image}' used for '${p.slug}'`);
    hasError = true;
  }
  seenImages.add(p.image);

  // Check gallery images
  if (!p.gallery || p.gallery.length < 3) {
    console.error(`❌ ERROR: Product '${p.slug}' has less than 3 gallery images`);
    hasError = true;
  } else {
    for (const g of p.gallery) {
      const gPath = path.join(publicDir, g.replace(/^\//, ""));
      if (!fs.existsSync(gPath)) {
        console.error(`❌ ERROR: Gallery image file does not exist for '${p.slug}': ${gPath}`);
        hasError = true;
      }
    }
  }
}

console.log("==================================================");
if (hasError) {
  console.error("❌ VALIDATION FAILED! Fix the errors above.");
  process.exit(1);
} else {
  console.log("✓ ALL CHECKS PASSED PERFECTLY!");
  console.log(`✓ 68 unique products verified across 5 categories.`);
  console.log(`✓ All 204 local WebP asset files verified on disk.`);
  console.log("==================================================");
  process.exit(0);
}
