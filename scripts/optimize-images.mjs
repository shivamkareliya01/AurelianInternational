import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const productsDir = path.join(publicDir, 'products');
const thumbsDir = path.join(productsDir, 'thumbs');
const previewsDir = path.join(productsDir, 'previews');

if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });
if (!fs.existsSync(previewsDir)) fs.mkdirSync(previewsDir, { recursive: true });

// Read products.ts to extract all product images
const productsFilePath = path.join(root, 'src', 'data', 'products.ts');
const code = fs.readFileSync(productsFilePath, 'utf8');

const regex = /"image":\s*"([^"]+)"/g;
let match;
const imagePaths = [];
while ((match = regex.exec(code)) !== null) {
  imagePaths.push(match[1]);
}

const uniqueImages = [...new Set(imagePaths)];
console.log(`Found ${uniqueImages.length} unique primary product images in products.ts.`);

// Grab all .webp and .jpg files in public/products
const allProductFiles = fs.readdirSync(productsDir).filter(f => {
  const ext = path.extname(f).toLowerCase();
  return (ext === '.webp' || ext === '.jpg' || ext === '.jpeg' || ext === '.png') && !fs.statSync(path.join(productsDir, f)).isDirectory();
});

console.log(`Found ${allProductFiles.length} total image files in public/products.`);

async function processImages() {
  const beforeStats = [];
  let totalOrigBytes = 0;
  let totalThumbBytes = 0;
  let totalPreviewBytes = 0;

  for (const filename of allProductFiles) {
    const origPath = path.join(productsDir, filename);
    const baseName = path.parse(filename).name;
    const thumbPath = path.join(thumbsDir, `${baseName}.webp`);
    const previewPath = path.join(previewsDir, `${baseName}.webp`);

    const origStat = fs.statSync(origPath);
    totalOrigBytes += origStat.size;

    const metadata = await sharp(origPath).metadata();
    beforeStats.push({
      file: filename,
      width: metadata.width,
      height: metadata.height,
      size: origStat.size,
      kb: (origStat.size / 1024).toFixed(1)
    });

    // 1. Generate Thumbnail: 96x96 WebP quality 70 (fit: cover)
    await sharp(origPath)
      .resize(96, 96, { fit: 'cover', position: 'center' })
      .webp({ quality: 70, effort: 5 })
      .toFile(thumbPath);

    const thumbStat = fs.statSync(thumbPath);
    totalThumbBytes += thumbStat.size;

    // 2. Generate Preview: 640px wide WebP quality 75 (maintain aspect ratio)
    await sharp(origPath)
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 75, effort: 5 })
      .toFile(previewPath);

    const prevStat = fs.statSync(previewPath);
    totalPreviewBytes += prevStat.size;
  }

  beforeStats.sort((a, b) => b.size - a.size);

  console.log('\n=== TOP 10 LARGEST ORIGINAL FILES ===');
  beforeStats.slice(0, 10).forEach((s, idx) => {
    console.log(`${idx + 1}. ${s.file} (${s.width}x${s.height}) - ${s.kb} KB`);
  });

  console.log('\n=== MEASURED RESULTS (BEFORE vs AFTER) ===');
  console.log(`Original total size: ${(totalOrigBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized thumbnails (96x96 @ q70) total size: ${(totalThumbBytes / 1024).toFixed(1)} KB (avg ${(totalThumbBytes / allProductFiles.length / 1024).toFixed(1)} KB each)`);
  console.log(`Optimized previews (640w @ q75) total size: ${(totalPreviewBytes / (1024 * 1024)).toFixed(2)} MB (avg ${(totalPreviewBytes / allProductFiles.length / 1024).toFixed(1)} KB each)`);
  console.log(`Weight reduction for thumbnails: ${(((totalOrigBytes - totalThumbBytes) / totalOrigBytes) * 100).toFixed(1)}% savings!`);

  // Measure thumbnail size for 78 catalog items
  let catalogThumbBytes = 0;
  for (const img of uniqueImages) {
    const baseName = path.parse(img).name;
    const thumbPath = path.join(thumbsDir, `${baseName}.webp`);
    if (fs.existsSync(thumbPath)) {
      catalogThumbBytes += fs.statSync(thumbPath).size;
    }
  }
  console.log(`\nCatalog 78 thumbnails total payload on popup open: ${(catalogThumbBytes / 1024).toFixed(1)} KB (down from ${(totalOrigBytes / (1024 * 1024)).toFixed(2)} MB!)`);
}

processImages().catch(err => {
  console.error(err);
  process.exit(1);
});
