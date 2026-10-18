import fs from "fs";

const files = fs.readdirSync("public/products").filter(f => f.endsWith(".webp") && !f.includes("-2") && !f.includes("-3") && !f.includes("-ingredient") && !f.startsWith("category-"));
console.log("All main webp products in public/products (" + files.length + "):");
console.log(files.sort());
