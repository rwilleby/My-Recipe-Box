import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { formatTextRecipeIngredient } from "../src/utils/textRecipe.js";
import { APPROVED_INVENTORY_SUBCATEGORIES } from "../src/utils/americanIngredientStandardization.js";

const american = recipes.filter((recipe) => /^AM-/.test(recipe.id) && !recipe.originalRecipeId);
const rows = american.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));

assert.equal(american.length, 77, "AM-063 remains retired");
assert.equal(rows.length, 1051, "all established AM ingredient rows remain present");
assert.ok(rows.every(({ ingredient }) => ingredient.originalName === ingredient.name), "approved card-transcribed names are preserved");
assert.ok(rows.every(({ ingredient }) => ingredient.originalUnit === ingredient.unit), "approved card-transcribed units are preserved");
for (const field of ["canonicalName", "quantity", "unitStandard", "packageSize", "preparation", "optional", "masterItemId", "matchStatus", "inventoryCategory", "inventorySubcategory", "auditSource"]) {
  assert.ok(rows.every(({ ingredient }) => Object.prototype.hasOwnProperty.call(ingredient, field)), `${field} exists on every AM ingredient`);
}
assert.ok(rows.every(({ ingredient }) => ["exact", "approved-equivalence", "ambiguous", "unmatched"].includes(ingredient.matchStatus)));
assert.ok(rows.every(({ ingredient }) => ingredient.quantity === ingredient.qty));
assert.ok(rows.every(({ ingredient }) => {
  if (ingredient.inventoryCategory === "Fresh Produce") return Boolean(ingredient.inventorySubcategory);
  return APPROVED_INVENTORY_SUBCATEGORIES[ingredient.inventoryCategory]?.includes(ingredient.inventorySubcategory);
}), "every AM ingredient uses an approved category and subcategory");
assert.ok(rows.every(({ ingredient }) => ingredient.inventoryCategory !== "Produce"), "Produce is renamed Fresh Produce");
assert.equal(recipes.find((recipe) => recipe.id === "AM-001").ingredients.find((item) => item.originalName === "Black pepper").inventoryCategory, "Pantry/Canned");
assert.ok(rows.every(({ ingredient }) => formatTextRecipeIngredient(ingredient).includes(ingredient.originalName)), "selectable recipe wording remains unchanged");

const kidneyBeans = recipes.find((recipe) => recipe.id === "AM-009").ingredients.find((item) => item.originalName === "Kidney beans, drained");
assert.deepEqual(
  { canonicalName: kidneyBeans.canonicalName, unit: kidneyBeans.unitStandard, packageSize: kidneyBeans.packageSize, preparation: kidneyBeans.preparation },
  { canonicalName: "Beans — Kidney", unit: "can", packageSize: "15 ounces", preparation: "drained" },
);

const biscuits = recipes.find((recipe) => recipe.id === "AM-051").ingredients.find((item) => item.originalName === "Refrigerated biscuits");
assert.equal(biscuits.packageSize, "16.3 ounces");
assert.equal(biscuits.packageCount, 8);

const optional = recipes.find((recipe) => recipe.id === "AM-051").ingredients.find((item) => item.originalName === "Crushed red pepper");
assert.equal(optional.optional, true);
assert.equal(optional.unitStandard, "teaspoon");

console.log("v96.8 AM-001 through AM-078 ingredient standardization passed for 1,051 rows.");
