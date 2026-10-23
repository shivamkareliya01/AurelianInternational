import fs from "node:fs";
import path from "node:path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function createSheinCatalogue() {
  const destWeb = path.resolve("public/catalogues/shein-16x16-parking-tiles-web.pdf");
  const destOriginal = path.resolve("public/catalogues/shein-16x16-parking-tiles.pdf");

  if (fs.existsSync(destWeb) && fs.existsSync(destOriginal)) {
    console.log("Shein catalogue already exists.");
    return;
  }

  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pagesData = [
    {
      title: "SHEIN 16x16 PARKING TILES",
      subtitle: "Heavy-Duty Vitrified Outdoor Collection",
      content: [
        "AURELIAN INTERNATIONAL EXPORT CATALOGUE",
        "Manufactured in Morbi, Gujarat, India",
        "Standard Export Dimension: 400x400 mm (16x16 inch)",
        "Thickness: 12 mm / 16 mm High Compressive Density",
        "Surface: Anti-Skid Textured Punch / Heavy Load Bearing",
        "Water Absorption: < 0.05% (Impermeable BIa Group)",
      ],
    },
    {
      title: "TECHNICAL SPECIFICATIONS & LOAD TEST",
      subtitle: "ISO 13006 & EN 14411 Group BIa Compliance",
      content: [
        "Compressive Strength: > 2800 N/mm² (Vehicular Grade)",
        "Breaking Strength: > 6500 N",
        "Mohs Surface Hardness: Scale 7 - 8",
        "Slip Resistance Rating: R11 / R12 Wet & Dry Ramp Test",
        "Thermal Shock Resistance: Fully Resistant (15°C to 145°C)",
        "Frost Resistance: 100 Freeze-Thaw Cycles (ASTM C1026)",
        "Chemical & Stain Resistance: Class A Acid / Alkali Resistant",
      ],
    },
    {
      title: "EXPORT PACKING & CONTAINER SPECIFICATIONS",
      subtitle: "Standard 20-Foot Full Container Load (FCL)",
      content: [
        "Tiles Per Corrugated Box: 5 Pieces (0.80 sq. meters)",
        "Average Box Weight: Approx. 18.5 kg",
        "Pallet Type: ISPM-15 Heat-Treated & Fumigated Hardwood Pallets",
        "Boxes Per Pallet: 64 Boxes per Euro-style Pallet",
        "Total Pallets in 20ft FCL: 22 Heavy Pallets",
        "Total Surface Area in 20ft FCL: Approx. 1,126.4 sq. meters",
        "Total Gross Weight: Approx. 26.5 Metric Tons",
      ],
    },
    {
      title: "COMMERCIAL TERMS & QUALITY CERTIFICATION",
      subtitle: "Aurelian International Global Logistics Desk",
      content: [
        "Pre-Shipment Inspection: SGS / Bureau Veritas / TUV Rheinland",
        "Payment Terms: Irrevocable Confirmed L/C at Sight / TT Advance",
        "Incoterms Available: FOB Mundra / CIF / CFR Global Sea Ports",
        "Lead Time to Loading Port: 10-14 Business Days from Production",
        "Contact Export Desk: +91 70966 70655",
        "Official Email: exports@aurelianinternational.com",
      ],
    },
  ];

  for (let i = 0; i < pagesData.length; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const data = pagesData[i];

    // Background header bar
    page.drawRectangle({
      x: 0,
      y: 740,
      width: 595.28,
      height: 102,
      color: rgb(0.027, 0.102, 0.2), // Navy #071A33
    });

    // Gold accent stripe
    page.drawRectangle({
      x: 0,
      y: 736,
      width: 595.28,
      height: 4,
      color: rgb(0.788, 0.592, 0.247), // Gold #C9973F
    });

    // Header Title
    page.drawText(data.title, {
      x: 40,
      y: 790,
      size: 20,
      font: timesRomanFont,
      color: rgb(0.949, 0.784, 0.431), // #F2C86E
    });

    // Subtitle
    page.drawText(data.subtitle, {
      x: 40,
      y: 760,
      size: 12,
      font: regularFont,
      color: rgb(0.9, 0.9, 0.9),
    });

    // Body content list
    let currentY = 670;
    for (const item of data.content) {
      // Bullet dot
      page.drawCircle({
        x: 50,
        y: currentY + 4,
        size: 3,
        color: rgb(0.788, 0.592, 0.247),
      });

      page.drawText(item, {
        x: 65,
        y: currentY,
        size: 13,
        font: regularFont,
        color: rgb(0.1, 0.15, 0.22),
      });

      currentY -= 40;
    }

    // Footer bar
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 595.28,
      height: 40,
      color: rgb(0.96, 0.96, 0.95),
    });

    page.drawText(`Aurelian International — Export Product Catalogue — Page ${i + 1} of ${pagesData.length}`, {
      x: 40,
      y: 15,
      size: 9,
      font: regularFont,
      color: rgb(0.4, 0.45, 0.5),
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(destWeb, pdfBytes);
  fs.writeFileSync(destOriginal, pdfBytes);
  console.log("Successfully generated Shein catalogue at:", destWeb);
}

createSheinCatalogue();
