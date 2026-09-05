import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^SG-(?:00[1-5]|00[8-9]|01\d|02[0-7])$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);
const allowedUnits = new Set(STANDARD_COOKING_UNITS);

assert.equal(audited.length, 25);
assert.equal(rows.length, 311);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.14"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !allowedUnits.has(ingredient.cookingUnit)), []);
assert.equal(get("SG-001", "Flank steak").qty, 1.75);
assert.equal(get("SG-003", "Hot dogs").qty, 9);
assert.equal(get("SG-005", "Boneless skinless chicken breasts").shoppingQuantity, 2.5);
assert.equal(get("SG-008", "Whole beef brisket").shoppingQuantity, 14);
assert.equal(get("SG-012", "Baby back ribs").shoppingQuantity, 4);
assert.equal(get("SG-014", "Chicken legs").shoppingQuantity, 3);
assert.equal(get("SG-021", "Chicken legs").shoppingQuantity, 2.5);
assert.equal(get("SG-023", "Chicken leg quarters").shoppingQuantity, 4);
assert.equal(get("SG-025", "Bone-in skin-on chicken thighs (about 2.5 to 3 lb total)").shoppingQuantity, 2.75);
assert.equal(get("SG-002", "Flank steak or sirloin, thinly sliced").acceptableAlternatives.length, 2);
assert.equal(get("SG-020", "Beef sirloin or chicken breast").acceptableAlternatives.length, 2);
for (const [recipeId, name] of [["SG-003", "Favorite toppings and condiments"], ["SG-002", "Red bell pepper, optional"], ["SG-013", "Beef tallow or duck fat, optional"], ["SG-020", "Whole mushrooms, optional"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}
console.log("SG-001–SG-005 and SG-008–SG-027 ingredient checkpoint passed with zero review flags.");
