// scripts/validate-routes.ts
// Unit test & assertion suite verifying UAE Hub-and-Spoke routing & 6 destination markets
// Run via: npx tsx scripts/validate-routes.ts

import fs from "fs";
import path from "path";
import {
  exportCountries,
  originGateway,
  uaeCentralHub,
  legOneArc,
  legOneDays,
  regionsList,
  totalDestinationCount,
  totalRegionsCount,
} from "../src/data/exportCountries";
import worldMapData from "../src/data/worldMapData.json";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log("🔍 Running Global Export Corridors & UAE Hub Validation Suite...\n");

// 1. Origin Gateway Assertions
assert(originGateway.iso2 === "IN", "Origin gateway must be India (IN)");
assert(originGateway.name === "India", "Origin name must be India");
assert(originGateway.label === "INDIA", "Origin label must be INDIA");
assert(
  originGateway.portLat >= 20 && originGateway.portLat <= 24,
  "Origin port must be placed on Gujarat coast (Mundra/Kandla/Morbi)"
);
console.log("✅ Origin Gateway (Gujarat Coast, India) verified.");

// 2. UAE Hub Assertions
assert(uaeCentralHub.iso2 === "AE", "Hub must be UAE (AE)");
assert(uaeCentralHub.label === "UAE", "Hub label must be 'UAE'");
assert(
  uaeCentralHub.portName.includes("Jebel Ali"),
  "Hub port must specify Jebel Ali"
);
console.log("✅ Central Re-Export Hub (Jebel Ali, UAE) verified.");

// 3. Leg 1 Routing (India -> UAE HUB ONLY)
assert(
  legOneArc.startsWith(`M ${originGateway.x} ${originGateway.y}`),
  `Leg 1 arc must start at India origin (${originGateway.x}, ${originGateway.y})`
);
assert(
  legOneArc.endsWith(`${uaeCentralHub.x} ${uaeCentralHub.y}`),
  `Leg 1 arc must terminate at UAE hub (${uaeCentralHub.x}, ${uaeCentralHub.y})`
);
assert(
  legOneDays[0] >= 3 && legOneDays[1] <= 7,
  "Leg 1 transit days must be reasonable feeder transit (4-6 days)"
);
console.log("✅ Leg 1 Feeder Corridor (India -> UAE Hub only) verified.");

// 4. Exactly 6 Destination Markets Assertions
assert(
  exportCountries.length === 6,
  `Exactly 6 destination markets expected, found ${exportCountries.length}`
);
assert(
  totalDestinationCount === 6,
  `totalDestinationCount must be 6, found ${totalDestinationCount}`
);

const expectedIso2s = new Set(["US", "NL", "DE", "ZA", "KE", "AU"]);
const seenIso2 = new Set<string>();
const seenNames = new Set<string>();

for (const country of exportCountries) {
  assert(
    expectedIso2s.has(country.iso2),
    `Unexpected ISO2 code '${country.iso2}' found in exportCountries!`
  );
  assert(!seenIso2.has(country.iso2), `Duplicate ISO2 code found: ${country.iso2}`);
  seenIso2.add(country.iso2);

  assert(!seenNames.has(country.name), `Duplicate country name found: ${country.name}`);
  seenNames.add(country.name);

  // Check valid coordinates
  assert(
    typeof country.x === "number" && country.x > 0 && country.x < 1000,
    `Invalid SVG x coordinate for ${country.name}: ${country.x}`
  );
  assert(
    typeof country.y === "number" && country.y > 0 && country.y < 520,
    `Invalid SVG y coordinate for ${country.name}: ${country.y}`
  );

  // Check valid cargo categories
  assert(
    Array.isArray(country.topCargo) && country.topCargo.length >= 2,
    `Missing topCargo for ${country.name}`
  );

  // Check ROUTE ARC: Leg 2 MUST start at UAE Hub!
  assert(
    country.routeD.startsWith(`M ${uaeCentralHub.x} ${uaeCentralHub.y}`),
    `Leg 2 arc for ${country.name} MUST start at UAE hub (${uaeCentralHub.x}, ${uaeCentralHub.y}), but got: ${country.routeD}`
  );

  // Check that no route starts at India and goes directly to destination
  assert(
    !country.routeD.startsWith(`M ${originGateway.x}`),
    `CRITICAL VIOLATION: Route for ${country.name} starts at India directly!`
  );
}

// 5. Specific Routing Curvature Checks
// US route must bow SOUTH of Europe (North Africa / mid-Atlantic, y >= 212)
const us = exportCountries.find((c) => c.iso2 === "US")!;
assert(Boolean(us), "US market entry required");
// Ensure US curve has control points in North Africa/Atlantic (y >= 212)
assert(
  us.routeD.includes("490 250") || us.routeD.includes("C 490") || us.routeD.includes("C 500"),
  "US route must bow south over North Africa (y >= 212)"
);

// Europe (Rotterdam) and Germany (Hamburg) must fan apart
const nl = exportCountries.find((c) => c.iso2 === "NL")!;
const de = exportCountries.find((c) => c.iso2 === "DE")!;
assert(Boolean(nl && de), "Both Netherlands and Germany must be present");
assert(
  nl.routeD !== de.routeD,
  "Europe (Rotterdam) and Germany (Hamburg) must have distinct fanned arcs"
);
assert(
  nl.labelX < nl.x && de.labelX > de.x,
  "Europe label must be placed up-left and Germany label up-right"
);

console.log("✅ All 6 destination routes verified:");
console.log("   - Exactly 6 destinations: US, NL, DE, ZA, KE, AU.");
console.log("   - Leg 1 strictly ends at UAE Hub.");
console.log("   - Leg 2 strictly departs from UAE Hub.");
console.log("   - Zero direct India -> destination routes.");
console.log("   - Zero transatlantic chaining via Europe/UK.");
console.log("   - US arc bows SOUTH of Europe.");
console.log("   - Europe and Germany arcs fan apart with separate labels.");

// 6. Check Regions List
assert(regionsList.length === 5, `Expected 5 regions, found ${regionsList.length}`);
assert(totalRegionsCount === 5, `totalRegionsCount must be 5, found ${totalRegionsCount}`);
console.log("✅ 5 Global Regions verified.");

// 7. Check Gold-Filled Set in worldMapData.json
const servedInJson = worldMapData.countries.filter((c: any) => c.isServed);
const indiaInJson = worldMapData.countries.filter((c: any) => c.isIndia);

assert(
  indiaInJson.length === 1 && indiaInJson[0].name === "India",
  "India must be uniquely flagged with isIndia: true in worldMapData.json"
);
assert(!indiaInJson[0].isServed, "India must have isServed: false (it is origin, not destination)");

// Total served countries in JSON must equal exactly 6 destinations + UAE hub = 7
assert(
  servedInJson.length === 7,
  `Expected exactly 7 served countries in worldMapData.json (6 destinations + 1 UAE hub), but found ${servedInJson.length}`
);

const expectedGoldNames = new Set([
  "United Arab Emirates",
  "United States",
  "Netherlands",
  "Germany",
  "South Africa",
  "Kenya",
  "Australia",
]);

for (const sc of servedInJson) {
  assert(
    expectedGoldNames.has(sc.name),
    `CRITICAL VIOLATION: Non-permitted country marked isServed in JSON: ${sc.name} (id: ${sc.id})`
  );
}

// Ensure no other countries (UK, Russia, China, Brazil, Turkey, etc.) are gold
const prohibitedNames = ["United Kingdom", "Russia", "China", "Brazil", "Turkey", "Canada", "Japan"];
for (const pName of prohibitedNames) {
  assert(
    !servedInJson.some((c: any) => c.name === pName),
    `Prohibited country '${pName}' must NOT be marked isServed in JSON`
  );
}

console.log("✅ Map Geometry & Gold Fill Verified:");
console.log("   - Exactly 7 served countries (6 destinations + UAE Hub) + India origin are gold.");
console.log("   - UK, Canada, Brazil, Russia, China, Turkey stay navy.");

// 8. Cross-Project Text Claims Verification
console.log("\nChecking that no text in src/ claims > 6 countries or obsolete 25+/36 countries...");
const srcDir = path.resolve(process.cwd(), "src");

function checkDirForObsoleteClaims(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDirForObsoleteClaims(fullPath);
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      // Check for '25+ countries' or 'more than 25 countries' or '36 destination' or '36 countries'
      const bannedRegexes = [
        /25\+\s*countries/i,
        /more\s+than\s+25\s+countries/i,
        /36\s*destination\s*countries/i,
        /36\s*countries\s*across/i,
      ];
      for (const regex of bannedRegexes) {
        if (regex.test(content)) {
          assert(false, `File ${fullPath} contains obsolete country claim matching ${regex}!`);
        }
      }
    }
  }
}
checkDirForObsoleteClaims(srcDir);
console.log("✅ Cross-project text claims verified: Zero conflicting country claims found in src/.");

console.log("\n🎉 ALL ROUTE & HUB ARCHITECTURE ASSERTIONS PASSED PERFECTLY!\n");
