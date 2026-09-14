import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");
const cardStart = app.indexOf("function CompactDinnerCard");
const cardEnd = app.indexOf("function DinnerCombinationCard", cardStart);
const card = app.slice(cardStart, cardEnd);
const pageStart = app.indexOf("function DinnerCombinationsPage");
const pageEnd = app.indexOf("function HealthyMealsPage", pageStart);
const page = app.slice(pageStart, pageEnd > pageStart ? pageEnd : undefined);
const stripStart = page.indexOf("className=\"dinnerCategorySegmented completeDinnerCategorySegmented\"");
const stripEnd = page.indexOf("</div>", stripStart);
const strip = page.slice(stripStart, stripEnd);

assert.ok(cardStart >= 0 && cardEnd > cardStart, "CompactDinnerCard must exist");
assert.doesNotMatch(card, /compactDinnerCardMainDish/);
assert.doesNotMatch(card, /FZ\.webp|compactDinnerFreezerFriendly/);
assert.match(card, /\{meal\.calories \|\| "—"\} cal/);
assert.match(card, /\{meal\.protein \|\| "—"\}g protein/);
assert.match(card, /MB \{getComboMealBalanceScore\(meal\)\}/);
assert.match(card, /isFreezerFriendly && <span title="Freezer Friendly">FF<\/span>/);

const expectedOrder = ["Search for...", "AMERICAN", "ASIAN", "ITALIAN", "MEXICAN", "SEAFOOD", "PROTEIN", "VEGAN"];
let cursor = -1;
for (const label of expectedOrder) {
  const next = page.indexOf(label, cursor + 1);
  assert.ok(next > cursor, `${label} must appear in the requested control-strip order`);
  cursor = next;
}
assert.doesNotMatch(page, /Complete Dinner browsing toolbar/);
assert.doesNotMatch(strip, /\["light", "LIGHT"\]|\["all", "ALL"\]/);
assert.match(page, /Number\(favorites\.includes\(b\.id\)\) - Number\(favorites\.includes\(a\.id\)\)/);
assert.match(page, /localeCompare\([\s\S]*sensitivity: "base"/);
assert.match(css, /\.completeDinnerCategorySegmented\s*\{[\s\S]*repeat\(8/);

console.log("v99.1 Complete Dinner standard layout and ordering contracts passed.");
