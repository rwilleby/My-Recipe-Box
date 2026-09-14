export const PLANNER_MEAL_SOURCE_PREFIX = "@meal:";

const PILOT_DIET_MEALS = Object.freeze({
  "DM-001": [{ title: "Herb-Roasted Chicken", displayRecipeId: "DM-001" }, { title: "Roasted Baby Potatoes", displayRecipeId: "SD-037" }, { title: "Broccoli & Red Pepper", displayRecipeId: "SD-005" }],
  "DM-002": [{ title: "Baked Chicken with Gravy", displayRecipeId: "DM-002" }, { title: "Mashed Potatoes", displayRecipeId: "SD-003" }, { title: "Stuffing", displayRecipeId: "SD-002" }],
  "DM-003": [{ title: "Chicken Fettuccine Alfredo", displayRecipeId: "IT-001" }, { title: "Broccoli", displayRecipeId: "SD-005" }],
  "DM-004": [{ title: "Sesame Chicken", displayRecipeId: "DM-004" }, { title: "Brown Rice", displayRecipeId: "SD-018" }, { title: "Stir-Fry Vegetables", displayRecipeId: "SD-039" }],
  "DM-005": [{ title: "Chicken Parmesan", displayRecipeId: "DM-005" }, { title: "Spaghetti", displayRecipeId: "SD-020" }],
  "DM-006": [{ title: "Orange Chicken", displayRecipeId: "AS-010" }, { title: "Brown Rice", displayRecipeId: "SD-018" }, { title: "Mixed Vegetables", displayRecipeId: "SD-039" }],
  "DM-007": [{ title: "Chicken Enchilada Suiza", displayRecipeId: "DM-007" }, { title: "Brown Rice", displayRecipeId: "SD-018" }],
  "DM-008": [{ title: "Apple Cranberry Chicken", displayRecipeId: "DM-008" }, { title: "Whole-Wheat Orzo", displayRecipeId: "SD-006" }, { title: "Green Beans & Carrots", displayRecipeId: "SD-012" }],
  "DM-009": [{ title: "Chicken Teriyaki", displayRecipeId: "DM-009" }, { title: "Asian-Style Noodles", displayRecipeId: "SD-011" }, { title: "Broccoli & Carrots", displayRecipeId: "SD-039" }],
  "DM-010": [{ title: "Maple Bourbon Chicken", displayRecipeId: "DM-010" }, { title: "Brown Rice & Quinoa", displayRecipeId: "SD-038" }, { title: "Sweet Potatoes", displayRecipeId: "SD-028" }],
  "DM-011": [{ title: "Roasted Turkey", displayRecipeId: "DM-011" }, { title: "Roasted Red Potatoes", displayRecipeId: "SD-037" }, { title: "Green Beans", displayRecipeId: "SD-004" }],
  "DM-012": [{ title: "Glazed Turkey Tenderloins", displayRecipeId: "DM-012" }, { title: "Mashed Sweet Potatoes", displayRecipeId: "SD-028" }, { title: "Stuffing", displayRecipeId: "SD-002" }],
  "DM-013": [{ title: "Steak Portabella", displayRecipeId: "DM-013" }, { title: "Broccoli", displayRecipeId: "SD-005" }],
  "DM-014": [{ title: "Salisbury Steak", displayRecipeId: "DM-014" }, { title: "Macaroni & Cheese", displayRecipeId: "SD-007" }],
  "DM-015": [{ title: "Meatloaf with Gravy", displayRecipeId: "DM-015" }, { title: "Mashed Potatoes", displayRecipeId: "SD-003" }],
  "DM-016": [{ title: "Swedish Meatballs with Gravy", displayRecipeId: "DM-016" }, { title: "Pasta", displayRecipeId: "SD-006" }],
  "DM-017": [{ title: "Macaroni & Beef in Tomato Sauce", displayRecipeId: "DM-017" }],
  "DM-018": [{ title: "Cheeseburger Mac with Tomatoes & Onions", displayRecipeId: "DM-018" }],
  "DM-019": [{ title: "Spaghetti with Meat Sauce", displayRecipeId: "DM-019" }],
  "DM-020": [{ title: "Garlic Sesame Noodles with Beef & Vegetables", displayRecipeId: "DM-020" }],
  "DM-021": [{ title: "Five-Cheese Rigatoni", displayRecipeId: "DM-021" }],
  "DM-022": [{ title: "Butternut Squash Ravioli with Sage Sauce", displayRecipeId: "DM-022" }],
  "DM-023": [{ title: "Light Chicken Carbonara", displayRecipeId: "DM-023" }],
  "DM-024": [{ title: "Cheese Ravioli in Marinara", displayRecipeId: "DM-024" }],
  "DM-025": [{ title: "Creamy Pasta Primavera", displayRecipeId: "DM-025" }],
  "DM-026": [{ title: "Lasagna with Meat Sauce", displayRecipeId: "DM-026" }],
  "DM-027": [{ title: "Macaroni & Cheese with Broccoli", displayRecipeId: "DM-027" }],
  "DM-028": [{ title: "Marry Me Rigatoni with Chicken", displayRecipeId: "DM-028" }],
  "DM-029": [{ title: "Pesto Rigatoni with Chicken & Spinach", displayRecipeId: "DM-029" }],
  "DM-030": [{ title: "Ricotta & Spinach Ravioli", displayRecipeId: "DM-030" }],
  "DM-031": [{ title: "Chicken Teriyaki Noodles", displayRecipeId: "DM-031" }],
  "DM-032": [{ title: "Korean BBQ Chicken", displayRecipeId: "DM-032" }, { title: "Brown Rice", displayRecipeId: "SD-018" }, { title: "Broccoli & Carrots", displayRecipeId: "SD-039" }],
  "DM-033": [{ title: "Indian Butter Chicken", displayRecipeId: "DM-033" }, { title: "Basmati Rice", displayRecipeId: "SD-048" }],
  "DM-034": [{ title: "Garlic-Sesame Beef Noodles", displayRecipeId: "DM-034" }],
  "DM-035": [{ title: "Sweet-and-Sour Chicken", displayRecipeId: "DM-035" }, { title: "Brown Rice", displayRecipeId: "SD-018" }, { title: "Pineapple, Peppers & Onions", displayRecipeId: "SD-039" }],
  "DM-036": [{ title: "Thai Coconut Curry Chicken", displayRecipeId: "DM-036" }, { title: "Jasmine Rice", displayRecipeId: "SD-052" }, { title: "Peppers & Green Beans", displayRecipeId: "SD-039" }],
  "DM-037": [{ title: "Hunan-Style Beef & Broccoli", displayRecipeId: "DM-037" }, { title: "Brown Rice", displayRecipeId: "SD-018" }],
  "DM-038": [{ title: "Cashew Chicken with Vegetables", displayRecipeId: "DM-038" }, { title: "Jasmine Rice", displayRecipeId: "SD-052" }],
  "DM-039": [{ title: "Chicken Peanut Noodles", displayRecipeId: "DM-039" }],
  "DM-040": [{ title: "Chicken Tikka Masala", displayRecipeId: "DM-040" }, { title: "Peas & Basmati Rice", displayRecipeId: "SD-012" }],
  "DM-041": [{ title: "Fiesta Grilled Chicken", displayRecipeId: "DM-041" }, { title: "Mexican Rice", displayRecipeId: "MX-013" }],
  "DM-042": [{ title: "Beef Enchilada Rice Bowl", displayRecipeId: "DM-042" }],
  "DM-043": [{ title: "Seasoned Chicken", displayRecipeId: "MX-028" }, { title: "Brown Rice & Black Beans", displayRecipeId: "MX-015" }, { title: "Corn, Peppers & Onions", displayRecipeId: "SD-039" }],
  "DM-044": [{ title: "Southwest Chicken", displayRecipeId: "DM-044" }, { title: "Quinoa & Black Beans", displayRecipeId: "VG-030" }, { title: "Corn & Red Pepper", displayRecipeId: "SD-008" }],
  "DM-045": [{ title: "Turkey Taco Mac", displayRecipeId: "DM-045" }],
  "DM-046": [{ title: "Green Chile Chicken", displayRecipeId: "DM-046" }, { title: "Brown Rice", displayRecipeId: "SD-018" }, { title: "Corn", displayRecipeId: "SD-008" }],
  "DM-047": [{ title: "Santa Fe Rice & Beans", displayRecipeId: "DM-047" }],
  "DM-048": [{ title: "Salsa Verde Chicken", displayRecipeId: "DM-048" }, { title: "Brown Rice", displayRecipeId: "SD-018" }, { title: "Pinto Beans & Vegetables", displayRecipeId: "SD-014" }],
  "DM-049": [{ title: "Beef Taco Bowl", displayRecipeId: "DM-049" }],
  "DM-050": [{ title: "Chipotle Chicken", displayRecipeId: "DM-050" }, { title: "Sweet Potatoes", displayRecipeId: "SD-028" }, { title: "Black Beans & Corn", displayRecipeId: "MX-015" }],
  "DM-051": [{ title: "Lemon Pepper Fish", displayRecipeId: "DM-051" }, { title: "Brown Rice", displayRecipeId: "SD-018" }, { title: "Broccoli", displayRecipeId: "SD-005" }],
  "DM-052": [{ title: "Garlic Butter Shrimp", displayRecipeId: "DM-052" }, { title: "Whole-Wheat Orzo", displayRecipeId: "SD-006" }, { title: "Zucchini & Bell Peppers", displayRecipeId: "SD-039" }],
  "DM-053": [{ title: "Parmesan-Crusted Fish", displayRecipeId: "DM-053" }, { title: "Roasted Baby Potatoes", displayRecipeId: "SD-037" }, { title: "Green Beans", displayRecipeId: "SD-004" }],
  "DM-054": [{ title: "Teriyaki Salmon", displayRecipeId: "DM-054" }, { title: "Brown Rice", displayRecipeId: "SD-018" }, { title: "Broccoli", displayRecipeId: "SD-005" }],
  "DM-055": [{ title: "Shrimp Alfredo", displayRecipeId: "DM-055" }, { title: "Broccoli", displayRecipeId: "SD-005" }],
  "DM-056": [{ title: "Cajun Shrimp", displayRecipeId: "DM-056" }, { title: "Brown Rice", displayRecipeId: "SD-018" }, { title: "Peppers & Zucchini", displayRecipeId: "SD-039" }],
  "DM-057": [{ title: "Mediterranean Fish", displayRecipeId: "DM-057" }, { title: "Whole-Wheat Couscous", displayRecipeId: "SD-018" }, { title: "Spinach", displayRecipeId: "QP-004" }],
  "DM-058": [{ title: "Sweet Chili Shrimp", displayRecipeId: "DM-058" }, { title: "Jasmine Rice", displayRecipeId: "SD-052" }, { title: "Broccoli & Bell Peppers", displayRecipeId: "SD-039" }],
  "DM-059": [{ title: "Herb-Roasted Salmon", displayRecipeId: "DM-059" }, { title: "Roasted Baby Potatoes", displayRecipeId: "SD-037" }, { title: "Green Beans", displayRecipeId: "SD-004" }],
  "DM-060": [{ title: "Fish Florentine", displayRecipeId: "DM-060" }, { title: "Brown Rice", displayRecipeId: "SD-018" }],
});

export function mealSourceMarker(type, id) { return `${PLANNER_MEAL_SOURCE_PREFIX}${type}:${id}`; }
export function parseMealSourceMarker(value) { const match = String(value || "").match(/^@meal:([^:]+):(.+)$/); return match ? { type: match[1], id: match[2] } : null; }
export function pilotDietMealIds() { return Object.keys(PILOT_DIET_MEALS); }
export function getDietMealComponents(recipeId) { return PILOT_DIET_MEALS[recipeId] || []; }
export function buildDietMealPlanItems(recipeId) { const components = PILOT_DIET_MEALS[recipeId]; if (!components) return null; return [recipeId, ...components.slice(1).map((_, index) => `${recipeId}::S${index + 1}`), ...Array(Math.max(0, 4 - components.length)).fill(null), mealSourceMarker("diet", recipeId)]; }
export function buildSavedMealPlanItems(meal) { if (!meal?.id || !meal?.mainId) return null; return [meal.mainId, meal.sideOneId || null, meal.sideTwoId || null, null, mealSourceMarker("saved", meal.id)]; }
export function resolveDietPlannerComponent(value, recipes) {
  const match = String(value || "").match(/^(DM-\d{3})::S([12])$/); if (!match) return null;
  const component = PILOT_DIET_MEALS[match[1]]?.[Number(match[2])]; if (!component) return null;
  const imageRecipe = recipes.find((recipe) => recipe.id === component.displayRecipeId);
  return { id: value, title: component.title, heroImage: imageRecipe?.heroImage || imageRecipe?.image || "", mealBalance: imageRecipe?.mealBalance, plannerComponent: true, parentDietMealId: match[1] };
}
export function resolveDietPlannerMain(value, recipes) {
  const component = PILOT_DIET_MEALS[value]?.[0]; if (!component) return null;
  const parent = recipes.find((recipe) => recipe.id === value); if (!parent) return null;
  const imageRecipe = recipes.find((recipe) => recipe.id === component.displayRecipeId);
  return { ...parent, title: component.title, heroImage: imageRecipe?.heroImage || imageRecipe?.image || parent.heroImage || parent.image || "", plannerMealParent: true };
}
