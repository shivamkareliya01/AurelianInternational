import fs from 'fs';

let code = fs.readFileSync('src/data/products.ts', 'utf-8');

// 1. Add objectPosition to Product type
code = code.replace(
  /alt:\s*string;[\r\n]+};/,
  'alt: string;\r\n  objectPosition?: string;\r\n};'
);

// 2. Update alt texts for fresh vegetables
const replacements = [
  ['"Fresh harvested Nashik Red Onions with dry papery skin"', '"Fresh Nashik red onions with dry papery skin, Maharashtra"'],
  ['"Clean whole white onion bulbs"', '"Clean whole export-grade white onions, Gujarat"'],
  ['"Clean raw whole potatoes on rustic background"', '"Fresh export table and processing potatoes, Uttar Pradesh & Gujarat"'],
  ['"Fresh vine-ripened red tomatoes"', '"Fresh red vine tomatoes, Maharashtra & Karnataka"'],
  ['"Whole white garlic bulbs on stone slab"', '"Fresh whole white garlic bulbs with loose cloves, Madhya Pradesh"'],
  ['"Freshly washed ginger rhizomes on wooden board"', '"Freshly washed export ginger rhizomes, Kerala & Assam"'],
  ['"Fresh vibrant green chillies with calyx stems"', '"Fresh spicy green chillies with calyx stems, Andhra Pradesh"'],
  ['"Washed fresh crisp red and orange carrots"', '"Washed crisp red and orange carrots with trimmed tops, Rajasthan & Punjab"'],
  ['"Fresh green drumsticks moringa pods tied with twine"', '"Fresh tender drumstick moringa pods neatly bundled, Tamil Nadu & Andhra Pradesh"']
];

for (const [from, to] of replacements) {
  if (code.includes(from)) {
    code = code.replace(from, to);
    console.log(`Updated alt: ${from} -> ${to}`);
  } else {
    console.warn(`Warning: Could not find ${from}`);
  }
}

fs.writeFileSync('src/data/products.ts', code, 'utf-8');
console.log('Successfully updated src/data/products.ts');
