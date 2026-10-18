import { execSync } from "child_process";
const data = execSync("git show HEAD~1:src/data/products.ts", { encoding: "utf-8" });
const m = data.match(/slug:\s*"ceramic-tiles"[\s\S]*?products:\s*(\[[\s\S]*?\]),\s*\}\s*,\s*\{\s*slug:\s*"dehydrated-powders"/);
if (m) {
  const slugs = Array.from(m[1].matchAll(/slug:\s*"([^"]+)"/g)).map(x => x[1]);
  console.log("HEAD~1 ceramic-tiles slugs count:", slugs.length, slugs);
} else {
  console.log("No match");
}
