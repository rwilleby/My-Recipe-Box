import assert from "node:assert/strict";
import fs from "node:fs";
import { buildDietMealPlanItems, buildSavedMealPlanItems, parseMealSourceMarker, pilotDietMealIds, resolveDietPlannerComponent, resolveDietPlannerMain } from "../src/data/plannerMealBundles.js";
import { recipes } from "../src/data/recipes.js";

const app = fs.readFileSync("src/App.jsx", "utf8");
assert.equal(pilotDietMealIds().length, 60);
assert.deepEqual(pilotDietMealIds(), Array.from({ length: 60 }, (_, index) => `DM-${String(index + 1).padStart(3, "0")}`));
pilotDietMealIds().forEach((id) => {
  const items = buildDietMealPlanItems(id);
  assert.equal(items.length, 5, `${id} should fill four planner rows plus its source marker`);
  assert.equal(parseMealSourceMarker(items[4])?.id, id);
  assert.ok(resolveDietPlannerMain(id, recipes)?.heroImage, `${id} should have a main hero image`);
  items.slice(1, 3).filter(Boolean).forEach((itemId) => assert.ok(resolveDietPlannerComponent(itemId, recipes)?.heroImage, `${itemId} should have a component hero image`));
});
const diet = buildDietMealPlanItems("DM-006");
assert.equal(diet.length, 5);
assert.deepEqual(diet.slice(0, 4), ["DM-006", "DM-006::S1", "DM-006::S2", null]);
assert.deepEqual(parseMealSourceMarker(diet[4]), { type: "diet", id: "DM-006" });
assert.equal(resolveDietPlannerComponent("DM-006::S1", [{ id: "SD-018", heroImage: "rice.webp" }]).title, "Brown Rice");
assert.deepEqual(resolveDietPlannerMain("DM-006", [{ id: "DM-006", title: "Orange Chicken with Rice & Vegetables", heroImage: "meal.webp" }, { id: "AS-010", title: "Orange Chicken", heroImage: "orange.webp" }]), { id: "DM-006", title: "Orange Chicken", heroImage: "orange.webp", plannerMealParent: true });
assert.deepEqual(buildSavedMealPlanItems({ id: "BYOM-1", mainId: "AM-001", sideOneId: "SD-003", sideTwoId: "SD-004" }).slice(0, 4), ["AM-001", "SD-003", "SD-004", null]);
assert.match(app, /<option value="saved-meals">My Saved Meals<\/option>/);
assert.match(app, /pickerCategory === "diet-meals" && dietMealItems/);
assert.match(app, /mealSourceMarker\("complete", meal\.id\)/);
assert.match(app, /setPickerCategory\(row\.type === "main" \? "diet-meals" : "all"\)/);
console.log("v98.7 full Diet Meal component contracts passed.");
