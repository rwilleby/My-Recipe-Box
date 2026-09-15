import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");
const pageStart = app.indexOf("function DinnerCombinationsPage");
const pageEnd = app.indexOf("function HealthyMealsPage", pageStart);
const page = app.slice(pageStart, pageEnd > pageStart ? pageEnd : undefined);

const expectedOrder = ["Search for...", "ALL", "AMERICAN", "ASIAN", "ITALIAN", "MEXICAN", "SEAFOOD", "VEGAN", "PROTEIN"];
let cursor = -1;
for (const label of expectedOrder) {
  const next = page.indexOf(label, cursor + 1);
  assert.ok(next > cursor, `${label} must appear in the requested Complete Dinner control-strip order`);
  cursor = next;
}

assert.match(page, /className="completeDinnerProteinFilter"/);
assert.match(page, /<select[\s\S]*value=\{proteinFilter\}[\s\S]*DINNER_PROTEIN_FILTERS\.map/);
assert.doesNotMatch(page, /<span className="srOnly">Filter Complete Dinners by protein<\/span>/);
assert.match(page, /if \(category === "all"\) setProteinFilter\("all"\)/);
assert.doesNotMatch(page, /\["protein", "PROTEIN"\]/);
assert.match(css, /\.completeDinnerCategorySegmented\s*\{[\s\S]*repeat\(9/);
assert.match(css, /\.completeDinnerProteinFilter select/);
assert.match(css, /\.completeDinnerCategorySearch input\[type="search"\][\s\S]*appearance: none !important/);

console.log("v99.14 Complete Dinner control-strip contracts passed.");
