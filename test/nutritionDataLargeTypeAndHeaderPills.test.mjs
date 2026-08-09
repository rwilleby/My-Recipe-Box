import assert from "node:assert/strict";
import fs from "node:fs";
const css = fs.readFileSync("src/App.css", "utf8");
const marker = "/* v71.7 — larger Nutrition Data typography + single-line nutrition pills */";
const index = css.lastIndexOf(marker);
assert.ok(index >= 0);
const finalCss = css.slice(index);
for (const token of [
  "flex-wrap: nowrap !important;",
  'grid-template-areas: "identity tools" !important;',
  "font-size: clamp(28px, 2.6vw, 40px) !important;",
  "font-size: clamp(26px, 2.3vw, 36px) !important;",
  "font-size: clamp(15px, 1.25vw, 20px) !important;",
  "font-size: clamp(18px, 1.5vw, 24px) !important;",
  "font-size: clamp(14px, 1.15vw, 18px) !important;",
  "font-size: clamp(12px, 1vw, 16px) !important;",
]) assert.ok(finalCss.includes(token), token);
console.log("Large Nutrition Data type and single-line header pill contracts passed");
