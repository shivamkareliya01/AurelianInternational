import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

// Read extracted paths from stream0
const streamText = fs.readFileSync('stream0.txt', 'utf8');
const lines = streamText.replace(/\r/g, '\n').split('\n');

const PAGE_H = 3325.5079;
const paths: Array<{ color: string; rule: string; d: string }> = [];
let currentColor = '#f0d193';
let currentCmds: string[] = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed) continue;

  const mCol = trimmed.match(/([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\s+scn/);
  if (mCol) {
    const r = Math.round(parseFloat(mCol[1]) * 255);
    const g = Math.round(parseFloat(mCol[2]) * 255);
    const b = Math.round(parseFloat(mCol[3]) * 255);
    currentColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  const tokens = trimmed.split(/\s+/);
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok === 'm' && i >= 2) {
      const x = parseFloat(tokens[i - 2]);
      const y = parseFloat(tokens[i - 1]);
      currentCmds.push(`M ${x.toFixed(4)} ${(PAGE_H - y).toFixed(4)}`);
    } else if (tok === 'l' && i >= 2) {
      const x = parseFloat(tokens[i - 2]);
      const y = parseFloat(tokens[i - 1]);
      currentCmds.push(`L ${x.toFixed(4)} ${(PAGE_H - y).toFixed(4)}`);
    } else if (tok === 'c' && i >= 6) {
      const x1 = parseFloat(tokens[i - 6]);
      const y1 = parseFloat(tokens[i - 5]);
      const x2 = parseFloat(tokens[i - 4]);
      const y2 = parseFloat(tokens[i - 3]);
      const x3 = parseFloat(tokens[i - 2]);
      const y3 = parseFloat(tokens[i - 1]);
      currentCmds.push(
        `C ${x1.toFixed(4)} ${(PAGE_H - y1).toFixed(4)} ${x2.toFixed(4)} ${(PAGE_H - y2).toFixed(4)} ${x3.toFixed(4)} ${(PAGE_H - y3).toFixed(4)}`
      );
    } else if (tok === 'h') {
      currentCmds.push('Z');
    } else if (tok === 'f' || tok === 'f*') {
      if (currentCmds.length > 0) {
        paths.push({
          color: currentColor,
          rule: tok === 'f*' ? 'evenodd' : 'nonzero',
          d: currentCmds.join(' '),
        });
        currentCmds = [];
      }
    }
  }
}

console.log(`Parsed ${paths.length} vector paths`);

const emblemD = [paths[1].d, paths[2].d, paths[3].d].join(' ');
const aurelianD = paths[4].d;

// 1. Full Square Dark Logo (Exact original from PDF, 3326.7 x 3325.5)
const svgFullDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3326.7 3325.5" width="100%" height="100%">
  <rect width="3326.7" height="3325.5" fill="#030F29"/>
  <g fill="#F0D193" fill-rule="evenodd">
    <path d="${emblemD}"/>
    <path d="${aurelianD}"/>
  </g>
  <text x="1663.35" y="2102.6" text-anchor="middle" font-family="'DM Sans', 'Montserrat', -apple-system, sans-serif" font-size="88" font-weight="500" fill="#FFFFFF" letter-spacing="0.42em">International</text>
</svg>`;

// 2. Stacked Transparent Logo (Cropped closely to the logo mark + typography)
// Bounds: X [846.2, 2480.4] (w=1634.2), Y [1218.5, 2125] (h=906.5)
// With balanced padding:
const svgStackedTransparent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="800 1180 1727 970" width="100%" height="100%">
  <g fill="#F0D193" fill-rule="evenodd">
    <path d="${emblemD}"/>
    <path d="${aurelianD}"/>
  </g>
  <text x="1663.35" y="2102.6" text-anchor="middle" font-family="'DM Sans', 'Montserrat', -apple-system, sans-serif" font-size="88" font-weight="500" fill="#FFFFFF" letter-spacing="0.42em">International</text>
</svg>`;

// 3. Standalone Emblem / Symbol (Cropped to emblem bounds [1375.5, 1218.5, 534.0, 419.4])
const svgSymbol = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1365 1208 554 440" width="100%" height="100%">
  <path d="${emblemD}" fill="#F0D193" fill-rule="evenodd"/>
</svg>`;

// 4. Horizontal Lockup for Navbar
// Emblem on left (h=340, w=433), Aurelian text on right (h=210, w=1140), International underneath
// Total viewBox: 0 0 1780 380
const svgHorizontal = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1780 380" width="100%" height="100%">
  <!-- Emblem: origin [1375.5, 1218.5], size 534x419.4 -> scale to height ~ 340 (scale ~ 0.81) -->
  <g transform="translate(20, 20) scale(0.81)">
    <g transform="translate(-1375.5, -1218.5)">
      <path d="${emblemD}" fill="#F0D193" fill-rule="evenodd"/>
    </g>
  </g>
  <!-- Text Group: Aurelian origin [846.2, 1678.5], size 1634.2x302 -> scale ~ 0.72 (width ~ 1176, height ~ 217) -->
  <g transform="translate(500, 25) scale(0.72)">
    <g transform="translate(-846.2, -1678.5)">
      <path d="${aurelianD}" fill="#F0D193" fill-rule="evenodd"/>
    </g>
    <!-- International subtitle centered under Aurelian (Aurelian width in local coords is 1634, center is 817) -->
    <text x="817" y="380" text-anchor="middle" font-family="'DM Sans', 'Montserrat', -apple-system, sans-serif" font-size="108" font-weight="500" fill="#FFFFFF" letter-spacing="0.46em">International</text>
  </g>
</svg>`;

// Write SVGs
fs.writeFileSync('public/brand/aurelian-logo-dark.svg', svgFullDark);
fs.writeFileSync('public/brand/aurelian-logo-stacked.svg', svgStackedTransparent);
fs.writeFileSync('public/brand/aurelian-symbol.svg', svgSymbol);
fs.writeFileSync('public/brand/aurelian-logo-horizontal.svg', svgHorizontal);
fs.writeFileSync('public/favicon.svg', svgSymbol);

console.log('SVGs written successfully!');

// Render high-res PNGs using Resvg
function renderPng(svgStr: string, outPath: string, width: number) {
  const resvg = new Resvg(svgStr, { fitTo: { mode: 'width', value: width } });
  const pngData = resvg.render();
  fs.writeFileSync(outPath, pngData.asPng());
  console.log(`Rendered ${outPath} (${width}px wide)`);
}

// 1. Full dark original logo (1600x1600)
renderPng(svgFullDark, 'public/brand/logo-original.png', 1600);
renderPng(svgFullDark, 'public/brand/aurelian-logo-dark.png', 1600);

// 2. Horizontal logo transparent (for navbar & general use) - 1200px wide
renderPng(svgHorizontal, 'public/brand/aurelian-logo-horizontal.png', 1200);

// 3. Stacked logo transparent (for footer, loader, 404) - 1200px wide
renderPng(svgStackedTransparent, 'public/brand/aurelian-logo-stacked.png', 1200);

// 4. Overwrite default `aurelian-logo-transparent.png` with horizontal lockup (best fit for navbar)
renderPng(svgHorizontal, 'public/brand/aurelian-logo-transparent.png', 1200);
renderPng(svgHorizontal, 'public/logo.png', 1200);
renderPng(svgHorizontal, 'public/brand/logo-navbar.png', 1200);
renderPng(svgHorizontal, 'public/brand/logo-transparent.png', 1200);

// 5. Standalone Symbol transparent (for loader, floating badge, favicon)
renderPng(svgSymbol, 'public/brand/aurelian-symbol-transparent.png', 512);
renderPng(svgSymbol, 'public/brand/infinity-symbol-transparent.png', 512);
renderPng(svgSymbol, 'public/brand/favicon-512.png', 512);
renderPng(svgSymbol, 'public/favicon.png', 192);
renderPng(svgSymbol, 'public/apple-touch-icon.png', 180);
renderPng(svgSymbol, 'public/favicon-32x32.png', 32);
renderPng(svgSymbol, 'public/favicon-16x16.png', 16);

console.log('All PNG brand assets generated successfully!');
