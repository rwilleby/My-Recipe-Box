import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDietMealComponents, pilotDietMealIds } from "../src/data/plannerMealBundles.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");
const pageStart = app.indexOf("function HealthyDinnersPage");
const pageEnd = app.indexOf("function getSaladJarProtein", pageStart);
const page = app.slice(pageStart, pageEnd);
const cardStart = app.indexOf("function CompactHealthyDinnerCard");
const cardEnd = app.indexOf("function HealthyDinnersPage", cardStart);
const card = app.slice(cardStart, cardEnd);

assert.equal(pilotDietMealIds().length, 60);
assert.ok(getDietMealComponents("DM-001").length >= 3);
assert.match(page, /placeholder="Search for\.\.\."/);
const expectedOrder = ["BEEF", "CHICKEN", "PASTA", "SEAFOOD", "MEATLESS", "VEGAN"];
let cursor = page.indexOf('placeholder="Search for..."');
for (const label of expectedOrder) {
  const next = page.indexOf(label, cursor + 1);
  assert.ok(next > cursor, `${label} must follow Search in the requested order`);
  cursor = next;
}
assert.doesNotMatch(page, /Healthy Dinner browsing toolbar|Main Protein|Calorie Range|All MB/);
assert.match(page, /favoriteDifference/);
assert.match(page, /localeCompare/);
assert.match(page, /slice\(0, visibleDinnerCount\)/);
assert.match(page, /Show More Diet Meals/);
assert.match(card, /compactDinnerCard compactHealthyDinnerCard/);
assert.match(card, /compactDinnerCardMedia/);
assert.match(card, /compactDinnerCardSides/);
assert.match(card, /compactDinnerCardFacts/);
assert.match(card, /View Dinner Details/);
assert.match(card, /Freezer Friendly">FF/);
assert.doesNotMatch(card, /FZ\.webp|compactDinnerFreezerFriendly/);
assert.match(css, /\.healthyDinnerSegmented\s*\{[\s\S]*repeat\(7/);

console.log("v99.2 Healthy Dinners compact layout, controls, sorting, and pagination contracts passed.");
