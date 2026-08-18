import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { categories, recipes } from "../src/data/recipes.js";

const nutrition = JSON.parse(
  await readFile(new URL("../src/data/nutrition/SG.json", import.meta.url), "utf8"),
);
const nutritionIndex = JSON.parse(
  await readFile(new URL("../src/data/nutrition/nutrition-index.json", import.meta.url), "utf8"),
);
const profilesSource = await readFile(
  new URL("../src/data/recipeNutritionProfiles.js", import.meta.url),
  "utf8",
);

const expected = [
  ["SG-017", "Smoked Skinless/Boneless Chicken Thighs", 6],
  ["SG-018", "Baked Boneless Skinless Chicken Thighs", 6],
  ["SG-019", "Grilled Boneless Skinless Chicken Thighs", 6],
  ["SG-020", "Grilled Shish Kabob", 6],
  ["SG-021", "Grilled Chicken Legs", 6],
  ["SG-022", "Grilled Chicken Wings", 6],
  ["SG-023", "Grilled Chicken Quarters", 4],
  ["SG-024", "Baked Chicken Breasts", 4],
  ["SG-025", "Baked Bone-In Chicken Thighs", 4],
  ["SG-026", "Baked Chicken Legs", 4],
  ["SG-027", "Baked Chicken Wings", 4],
];

assert.equal(categories.find((category) => category.id === "SG")?.count, 25);
assert.equal(nutrition.filter((record) => record.series === "SG").length, 25);
assert.equal(
  nutritionIndex.filter((record) => /^SG-0(17|18|19|20|21|22|23|24|25|26|27)$/.test(record.recipeCode)).length,
  11,
);

for (const [code, title, servings] of expected) {
  const recipe = recipes.find((item) => item.id === code);
  const record = nutrition.find((item) => item.recipeCode === code);
  assert.ok(recipe, `${code} must exist in the recipe library`);
  assert.equal(recipe.title, title);
  assert.equal(recipe.servings, servings);
  assert.equal(recipe.categoryCode, "SG");
  assert.ok(recipe.ingredients.length >= 3);

  assert.ok(record, `${code} must have a nutrition record`);
  assert.equal(record.status, "provisional");
  assert.equal(record.variants[record.defaultVariant].nutritionFacts.servingsPerRecipe, servings);
  assert.notEqual(record.variants[record.defaultVariant].nutritionFacts.calories, null);
  assert.match(record.variants[record.defaultVariant].nutritionFacts.cholesterol, / mg$/);
  assert.equal(record.variants[record.defaultVariant].nutritionFacts.transFat, "0 g");

  for (const relativePath of [
    `../public/images/recipes/${code}.webp`,
    `../public/images/heroes/${code}.webp`,
    `../public/images/thumbs/recipes/${code}.webp`,
    `../public/images/thumbs/heroes/${code}.webp`,
  ]) {
    const url = new URL(relativePath, import.meta.url);
    await access(url);
    assert.ok((await stat(url)).size > 10_000, `${relativePath} must contain a real WebP asset`);
  }
}

assert.equal(nutrition.find((record) => record.recipeCode === "SG-020")?.defaultVariant, "beef");
assert.deepEqual(
  Object.keys(nutrition.find((record) => record.recipeCode === "SG-020")?.variants || {}),
  ["beef", "chicken"],
);
assert.match(profilesSource, /import sgNutrition from "\.\/nutrition\/SG\.json"/);
assert.match(profilesSource, /supplementalSgNutritionProfiles\[code\]/);

console.log("SG-017 through SG-027 recipes, TRAY assets, and nutrition v82.18 tests passed.");
