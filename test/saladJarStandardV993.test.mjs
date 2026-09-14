import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { recipes } from "../src/data/recipes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");
const pageStart = app.indexOf("function SaladJarLunchesPage");
const pageEnd = app.indexOf("function CollectionDetailPage", pageStart);
const page = app.slice(pageStart, pageEnd);
const cardStart = app.indexOf("function CompactSaladJarCard");
const cardEnd = app.indexOf("function SaladJarLunchesPage", cardStart);
const card = app.slice(cardStart, cardEnd);

assert.ok(recipes.filter((recipe) => recipe.categoryCode === "SB").length > 12);
assert.match(page, /placeholder="Search for\.\.\."/);
const expectedOrder = ["CHICKEN", "BEEF", "SEAFOOD", "MEATLESS", "CLASSIC", "MEDITERRANEAN"];
let cursor = page.indexOf('placeholder="Search for..."');
for (const label of expectedOrder) {
  const next = page.indexOf(label, cursor + 1);
  assert.ok(next > cursor, `${label} must follow Search in the requested order`);
  cursor = next;
}
assert.doesNotMatch(page, /Salad Jar Lunch browsing toolbar|Main Protein|Calorie Range|All MB/);
assert.match(page, /favoriteDifference/);
assert.match(page, /localeCompare/);
assert.match(page, /slice\(0, visibleLunchCount\)/);
assert.match(page, /Show More Salad Jars/);
assert.match(card, /compactDinnerCard compactSaladJarCard/);
assert.match(card, /compactDinnerCardMedia/);
assert.match(card, /compactDinnerCardFacts/);
assert.match(card, /View Lunch Details/);
assert.doesNotMatch(card, /FF|FZ\.webp|compactDinnerFreezerFriendly/);
assert.match(css, /\.saladJarSegmented\s*\{[\s\S]*repeat\(7/);

console.log("v99.3 Salad Jar compact layout, controls, sorting, and pagination contracts passed.");
