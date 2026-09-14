const EXCLUDED_PANTRY_BASICS = /^(water|ice|salt|kosher salt|sea salt|black pepper|ground black pepper|olive oil|vegetable oil|cooking spray|nonstick cooking spray|garlic powder|onion powder|dried parsley|dried oregano)$/i;
const PROTEIN_INGREDIENTS = /chicken|beef|steak|turkey|ham|bacon|shrimp|crab|tuna|salmon|egg|chickpea|edamame|cottage cheese/i;
const SALAD_BASES = /lettuce|romaine|spinach|cabbage|kale|greens/i;
const DRESSINGS = /dressing|vinaigrette|sauce|mayonnaise|yogurt/i;

export function saladJarIngredientNames(recipe) {
  const seen = new Set();
  return (recipe?.ingredients || [])
    .map((ingredient, index) => ({
      name: String(ingredient?.name || "").replace(/\s*\([^)]*\)\s*/g, " ").replace(/,.*$/, "").trim(),
      index,
    }))
    .filter(({ name }) => name && !EXCLUDED_PANTRY_BASICS.test(name))
    .filter(({ name }) => {
      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((ingredient) => ({
      ...ingredient,
      priority: PROTEIN_INGREDIENTS.test(ingredient.name) ? 3 : SALAD_BASES.test(ingredient.name) ? 2 : DRESSINGS.test(ingredient.name) ? 1 : 0,
    }))
    .sort((a, b) => b.priority - a.priority || a.index - b.index)
    .map(({ name }) => name);
}

export function saladJarIngredientPreview(recipe) {
  const candidates = saladJarIngredientNames(recipe);
  const firstSix = candidates.slice(0, 6);
  return (firstSix.join(" · ").length <= 110 ? firstSix : candidates.slice(0, 5)).join(" · ");
}
