import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";

const categories = { PM: [14, 189], QP: [30, 359], SB: [20, 251], SD: [52, 407], SF: [20, 196], SG: [25, 311] };
const selected = recipes.filter((recipe) => categories[recipe.categoryCode]);
assert.equal(selected.length, 161, "all 161 active source cards must be represented");
assert.equal(selected.reduce((sum, recipe) => sum + recipe.ingredients.length, 0), 1713);

for (const [code, [recipeCount, ingredientCount]] of Object.entries(categories)) {
  const group = selected.filter((recipe) => recipe.categoryCode === code);
  assert.equal(group.length, recipeCount, `${code} recipe count`);
  assert.equal(group.reduce((sum, recipe) => sum + recipe.ingredients.length, 0), ingredientCount, `${code} ingredient count`);
}

for (const recipe of selected) {
  assert.ok(recipe.ingredients.length >= 4, `${recipe.id} must not use an empty/broad fallback`);
  for (const item of recipe.ingredients) {
    assert.ok(item.name.trim(), `${recipe.id} ingredient name`);
    assert.ok(Number.isFinite(item.qty) && item.qty > 0, `${recipe.id}/${item.name} positive quantity`);
    assert.ok(item.unit.trim(), `${recipe.id}/${item.name} unit`);
    assert.ok(item.aisle.trim(), `${recipe.id}/${item.name} aisle`);
    assert.equal(item.cost, 0, `${recipe.id}/${item.name} does not invent pricing`);
  }
}

const recipe = (id) => recipes.find((entry) => entry.id === id);
const item = (id, name) => recipe(id).ingredients.find((entry) => entry.name === name);
assert.equal(item("PM-001", "Rolled oats").qty, 1.5);
assert.equal(item("PM-012", "Salt").qty, 0.5);
assert.equal(item("QP-017", "Frozen peas").qty, 0.5);
assert.equal(recipe("QP-021").ingredients.filter((entry) => entry.name === "Salt").length, 1, "duplicate printed salt becomes one shopping checkbox");
assert.equal(item("QP-028", "Cream cheese").qty, 8);
assert.ok(item("SB-019", "Salt"));
assert.ok(item("SB-019", "Black pepper"));
assert.equal(item("SD-020", "Butter or olive oil, optional").unit, "amount not specified");
assert.equal(item("SD-026", "Water").unit, "amount not specified");
assert.equal(item("SD-032", "Oil for frying").unit, "amount not specified");
assert.equal(item("SF-016", "Seafood or chicken stock").qty, 4);
assert.equal(item("SF-016", "Smoked sausage, sliced").qty, 1);
assert.equal(item("SF-016", "Shrimp, peeled and deveined").qty, 1);
assert.equal(item("SG-022", "Olive oil"), undefined, "directions-only oil is excluded");
assert.equal(item("SG-027", "Baking powder").qty, 1);

for (const code of Object.keys(categories)) {
  const nutrition = JSON.parse(fs.readFileSync(new URL(`../src/data/nutrition/${code}.json`, import.meta.url)));
  for (const row of nutrition.filter((entry) => entry.active && !entry.retired)) {
    const match = recipe(row.recipeCode);
    if (!match || row.recipeCode === "SG-012") continue;
    assert.equal(match.title, row.title, `${row.recipeCode} title must match nutrition identity`);
  }
}
assert.equal(recipe("SG-012").title, "Smoked Pork Ribs");
const sgNutrition = JSON.parse(fs.readFileSync(new URL("../src/data/nutrition/SG.json", import.meta.url)));
assert.equal(sgNutrition.find((row) => row.recipeCode === "SG-012").title, "Lemon Pepper Chicken", "known source-database mismatch remains explicit, not silently attached to ribs");

console.log("v84.15 PM/QP/SB/SD/SF/SG ingredient-data contracts passed (161 recipes, 1,713 items).");
