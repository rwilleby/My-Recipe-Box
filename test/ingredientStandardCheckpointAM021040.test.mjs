import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";
import { formatTextRecipeIngredient } from "../src/utils/textRecipe.js";

const audited = recipes.filter((recipe) => /^AM-(?:02[1-9]|03\d|040)$/.test(recipe.id));
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId)
  .ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.5"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);

assert.deepEqual(
  (({ qty, unit, preparation, shoppingEquivalent }) => ({ qty, unit, preparation, shoppingEquivalent }))(get("AM-021", "Medium onion, finely diced")),
  { qty: 1, unit: "cup", preparation: "finely diced", shoppingEquivalent: "About 1 medium onion" },
);
assert.equal(get("AM-026", "Large onion, sliced").qty, 1.5);
assert.equal(get("AM-029", "Small onion, chopped").qty, 0.5);
assert.equal(get("AM-029", "Cream of chicken soup").qty, 21);
assert.equal(get("AM-029", "Cream of chicken soup").unit, "ounce");
assert.equal(get("AM-035", "Cream cheese, softened").qty, 8);
assert.equal(get("AM-035", "Cream cheese, softened").unit, "ounce");

const bakedChicken = get("AM-037", "Boneless skinless chicken breasts");
assert.equal(bakedChicken.qty, 6);
assert.equal(bakedChicken.unit, "each");
assert.equal(bakedChicken.shoppingQuantity, 2);
assert.equal(bakedChicken.shoppingUnit, "pound");

const optionalParsley = get("AM-021", "Chopped parsley");
assert.equal(optionalParsley.includeInShopping, false);
assert.equal(consolidateShoppingItems([optionalParsley]).length, 0);
assert.equal(formatTextRecipeIngredient(optionalParsley), "Parsley, chopped, optional");

const servingSide = get("AM-028", "Mashed potatoes");
assert.equal(servingSide.reviewStatus, "approved");
assert.equal(servingSide.includeInShopping, false);

assert.deepEqual(
  (({ shoppingQuantity, shoppingUnit, shoppingEquivalent }) => ({ shoppingQuantity, shoppingUnit, shoppingEquivalent }))(get("AM-021", "Mashed potatoes")),
  { shoppingQuantity: 3, shoppingUnit: "pound", shoppingEquivalent: "About 3 pounds potatoes or prepared mashed potatoes" },
);
for (const recipeId of ["AM-030", "AM-031", "AM-032", "AM-033", "AM-034", "AM-035"]) {
  const chicken = recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => /^Cooked chicken/.test(ingredient.originalName));
  assert.equal(chicken.shoppingQuantity, 1);
  assert.equal(chicken.shoppingUnit, "pound");
}
assert.equal(get("AM-036", "Cooked chicken, shredded").shoppingQuantity, 1.5);
assert.deepEqual(
  [get("AM-035", "Bacon, cooked and crumbled"), get("AM-036", "Cooked bacon, crumbled")].map(({ shoppingQuantity, shoppingUnit }) => [shoppingQuantity, shoppingUnit]),
  [[6, "ounce"], [8, "ounce"]],
);
assert.equal(get("AM-038", "Bone-in skin-on chicken pieces, thighs, drumsticks, or breasts").shoppingQuantity, 3);

console.log("AM-021 through AM-040 ingredient checkpoint passed with zero review flags.");
