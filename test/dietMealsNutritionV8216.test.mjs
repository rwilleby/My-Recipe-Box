import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";

const records = JSON.parse(await readFile(new URL("../src/data/nutrition/DM.json", import.meta.url), "utf8"));
const nutritionIndex = JSON.parse(await readFile(new URL("../src/data/nutrition/nutrition-index.json", import.meta.url), "utf8"));
const nutritionProfilesSource = await readFile(new URL("../src/data/recipeNutritionProfiles.js", import.meta.url), "utf8");
const iconUrl = new URL("../public/images/categories/DM.webp", import.meta.url);

assert.equal(records.length, 60);
assert.equal(new Set(records.map((record) => record.recipeCode)).size, 60);
assert.equal(records[0].recipeCode, "DM-001");
assert.equal(records.at(-1).recipeCode, "DM-060");
assert.equal(nutritionIndex.filter((entry) => entry.series === "DM").length, 60);

for (const [index, record] of records.entries()) {
  const expectedCode = `DM-${String(index + 1).padStart(3, "0")}`;
  assert.equal(record.recipeCode, expectedCode);
  assert.equal(record.series, "DM");
  assert.equal(record.status, "provisional");
  assert.equal(record.defaultVariant, "one-meal");
  assert.equal(record.variants["one-meal"].nutritionFacts.servingsPerRecipe, 4);
  assert.ok(record.variants["one-meal"].nutritionFacts.calories >= 230);
  assert.match(record.variants["one-meal"].calorieRange, /^\d{3}-\d{3} calories per meal$/);
}

assert.match(nutritionProfilesSource, /import dmNutrition from "\.\/nutrition\/DM\.json"/);
assert.match(nutritionProfilesSource, /if \(dmRecipeNutritionProfiles\[code\]\) return dmRecipeNutritionProfiles\[code\]/);

assert.equal(records[0].variants["one-meal"].calorieRange, "250-280 calories per meal");
assert.equal(records[0].variants["one-meal"].nutritionFacts.calories, 265);
assert.equal(records.at(-1).variants["one-meal"].calorieRange, "370-400 calories per meal");
assert.equal(records.at(-1).variants["one-meal"].nutritionFacts.calories, 385);

await access(iconUrl);
assert.ok((await stat(iconUrl)).size > 10_000);
assert.ok((await stat(iconUrl)).size < 100_000);

console.log("Diet Meals nutrition records and supplied category icon v82.16 tests passed.");
