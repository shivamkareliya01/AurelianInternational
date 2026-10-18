import fs from "fs";

const STONES_12 = [
  "makrana-white-marble",
  "statuario-marble",
  "indian-green-marble",
  "black-galaxy-granite",
  "tan-brown-granite",
  "kashmir-white-granite",
  "rainbow-sandstone",
  "kota-limestone",
  "himachal-slate",
  "quartzite",
  "cobblestones",
  "pebbles-river-gravel"
];

const TILES_10 = [
  "vitrified-tiles",
  "porcelain-tiles",
  "ceramic-wall-tiles",
  "glazed-vitrified-tiles",
  "polished-porcelain-tiles",
  "digital-wall-tiles",
  "subway-ceramic-tiles",
  "outdoor-parking-tiles",
  "anti-skid-ceramic-tiles",
  "vitrified-pgvt-tiles" // or outdoor-paver-tiles
];

console.log("Checking 12 stones:");
for (const s of STONES_12) {
  const p = `public/products/${s}.webp`;
  console.log(`  ${s}: exists=${fs.existsSync(p)}`);
}

console.log("\nChecking 10 tiles:");
for (const s of TILES_10) {
  const p = `public/products/${s}.webp`;
  console.log(`  ${s}: exists=${fs.existsSync(p)}`);
}
