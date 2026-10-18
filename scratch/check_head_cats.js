import { execSync } from "child_process";
const data = execSync("git show HEAD~1:src/data/products.ts", { encoding: "utf-8" });
const cats = Array.from(data.matchAll(/"slug":\s*"([^"]+)",\s*"name":\s*"([^"]+)"/g)).map(x => x[1]);
console.log("Categories in HEAD~1:", cats);
const prods = Array.from(data.matchAll(/"slug":\s*"([^"]+)"/g)).map(x => x[1]);
console.log("Total slugs in HEAD~1:", prods.length);
