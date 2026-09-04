import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^AM-(?:04[1-9]|05\d|060)$/.test(recipe.id));
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId)
  .ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.5"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);

assert.equal(get("AM-041", "Bone-in skin-on chicken thighs").shoppingQuantity, 3);
assert.equal(get("AM-042", "Boneless skinless chicken breasts").shoppingQuantity, 2);
assert.equal(get("AM-043", "Cooked chicken, cubed").shoppingQuantity, 2);
assert.equal(get("AM-057", "Cooked chicken, diced").shoppingQuantity, 1.5);
assert.equal(get("AM-045", "Meaty ham hock or 2 cups diced ham").acceptableAlternatives.length, 2);
assert.equal(get("AM-045", "Meaty ham hock or 2 cups diced ham").shoppingEquivalent, "One meaty ham hock (about 1.5 pounds) or about 12 ounces diced ham");
assert.equal(get("AM-047", "Boneless pork chops").shoppingQuantity, 2);
assert.equal(get("AM-048", "Bone-in pork chops").shoppingQuantity, 3);
assert.equal(get("AM-049", "Bone-in pork chops").shoppingQuantity, 3);
assert.equal(get("AM-053", "Ham steaks, 1/2-inch thick").shoppingQuantity, 3);
assert.equal(get("AM-053", "Ham steaks, 1/2-inch thick").preparation, "1/2-inch thick");

assert.equal(get("AM-044", "Small onion, diced").qty, 0.5);
assert.equal(get("AM-048", "Large onion, sliced").qty, 1.5);
assert.equal(get("AM-060", "Medium onion, chopped").qty, 1);
assert.equal(get("AM-044", "Pork and beans").qty, 30);
assert.equal(get("AM-060", "Crushed tomatoes").qty, 56);

for (const [recipeId, originalName] of [
  ["AM-042", "Cooked spaghetti"],
  ["AM-046", "Cooking spray or butter, for dish"],
  ["AM-049", "Vegetable oil"],
  ["AM-050", "Coleslaw"],
  ["AM-058", "Butter or lettuce"],
  ["AM-060", "Fresh basil, chopped"],
]) {
  const ingredient = get(recipeId, originalName);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}

const roast = get("AM-054", "Pork shoulder roast, 3–4 lb");
assert.equal(roast.cookingQuantity, 3.5);
assert.equal(roast.shoppingEquivalent, "One 3–4-pound pork shoulder roast");

console.log("AM-041 through AM-060 ingredient checkpoint passed with zero review flags.");
