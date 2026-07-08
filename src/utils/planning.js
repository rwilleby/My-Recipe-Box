export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const AISLES = ['Produce', 'Meat', 'Seafood', 'Dairy', 'Pantry', 'Bakery', 'Frozen', 'Other'];

export function emptyPlan() {
  return DAYS.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
}

export function scaleCost(recipe, servings) {
  const multiplier = servings / 4;
  return Math.max(0, recipe.baseCost4 * multiplier);
}

export function buildShoppingList(plan, recipes, servings) {
  const map = new Map();
  Object.values(plan).flat().forEach((recipeId) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;
    const factor = servings / recipe.servings;
    recipe.ingredients.forEach((item) => {
      const key = `${item.name}|${item.unit}|${item.aisle || 'Other'}`;
      const existing = map.get(key) || { ...item, qty: 0, cost: 0, checked: false };
      existing.qty += item.qty * factor;
      existing.cost += item.cost * factor;
      map.set(key, existing);
    });
  });
  return [...map.values()].sort((a, b) => AISLES.indexOf(a.aisle) - AISLES.indexOf(b.aisle) || a.name.localeCompare(b.name));
}

export function planCost(plan, recipes, servings) {
  return Object.values(plan)
    .flat()
    .reduce((total, recipeId) => {
      const recipe = recipes.find((r) => r.id === recipeId);
      return recipe ? total + scaleCost(recipe, servings) : total;
    }, 0);
}

export function formatQty(qty) {
  if (qty >= 10) return Math.round(qty).toString();
  if (Number.isInteger(qty)) return qty.toString();
  return qty.toFixed(1).replace('.0', '');
}
