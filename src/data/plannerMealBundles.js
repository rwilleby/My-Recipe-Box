export const PLANNER_MEAL_SOURCE_PREFIX = "@meal:";

const PILOT_DIET_MEALS = Object.freeze({
  "DM-001": [{ title: "Herb-Roasted Chicken", displayRecipeId: "DM-001" }, { title: "Roasted Baby Potatoes", displayRecipeId: "SD-037" }, { title: "Broccoli & Red Pepper", displayRecipeId: "SD-005" }],
  "DM-003": [{ title: "Chicken Fettuccine Alfredo", displayRecipeId: "IT-001" }, { title: "Broccoli", displayRecipeId: "SD-005" }],
  "DM-006": [{ title: "Orange Chicken", displayRecipeId: "AS-010" }, { title: "Brown Rice", displayRecipeId: "SD-018" }, { title: "Mixed Vegetables", displayRecipeId: "SD-039" }],
  "DM-021": [{ title: "Five-Cheese Rigatoni", displayRecipeId: "DM-021" }],
  "DM-043": [{ title: "Seasoned Chicken", displayRecipeId: "MX-028" }, { title: "Brown Rice & Black Beans", displayRecipeId: "MX-015" }, { title: "Corn, Peppers & Onions", displayRecipeId: "SD-039" }],
});

export function mealSourceMarker(type, id) { return `${PLANNER_MEAL_SOURCE_PREFIX}${type}:${id}`; }
export function parseMealSourceMarker(value) { const match = String(value || "").match(/^@meal:([^:]+):(.+)$/); return match ? { type: match[1], id: match[2] } : null; }
export function pilotDietMealIds() { return Object.keys(PILOT_DIET_MEALS); }
export function buildDietMealPlanItems(recipeId) { const components = PILOT_DIET_MEALS[recipeId]; if (!components) return null; return [recipeId, ...components.slice(1).map((_, index) => `${recipeId}::S${index + 1}`), ...Array(Math.max(0, 4 - components.length)).fill(null), mealSourceMarker("diet", recipeId)]; }
export function buildSavedMealPlanItems(meal) { if (!meal?.id || !meal?.mainId) return null; return [meal.mainId, meal.sideOneId || null, meal.sideTwoId || null, null, mealSourceMarker("saved", meal.id)]; }
export function resolveDietPlannerComponent(value, recipes) {
  const match = String(value || "").match(/^(DM-\d{3})::S([12])$/); if (!match) return null;
  const component = PILOT_DIET_MEALS[match[1]]?.[Number(match[2])]; if (!component) return null;
  const imageRecipe = recipes.find((recipe) => recipe.id === component.displayRecipeId);
  return { id: value, title: component.title, heroImage: imageRecipe?.heroImage || imageRecipe?.image || "", plannerComponent: true, parentDietMealId: match[1] };
}
export function resolveDietPlannerMain(value, recipes) {
  const component = PILOT_DIET_MEALS[value]?.[0]; if (!component) return null;
  const parent = recipes.find((recipe) => recipe.id === value); if (!parent) return null;
  const imageRecipe = recipes.find((recipe) => recipe.id === component.displayRecipeId);
  return { ...parent, title: component.title, heroImage: imageRecipe?.heroImage || imageRecipe?.image || parent.heroImage || parent.image || "", plannerMealParent: true };
}
