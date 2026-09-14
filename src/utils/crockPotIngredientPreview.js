const EXCLUDED_PANTRY_BASICS = /^(water|ice|salt|kosher salt|sea salt|black pepper|ground black pepper|olive oil|vegetable oil|cooking spray|nonstick cooking spray|garlic powder|onion powder|dried parsley|dried oregano)$/i;
const DEFINING_PROTEINS = /chicken|beef|steak|turkey|ham|pork|bacon|sausage|kielbasa|shrimp|fish|meatball|beans|lentils/i;
const BASE_INGREDIENTS = /potato|rice|pasta|noodle|tortilla|biscuit|bread|oats|grits|corn|tomato|broth|stock/i;
const DEFINING_SAUCES = /sauce|gravy|salsa|cream|cheese|barbecue|enchilada/i;

export function crockPotIngredientNames(recipe) {
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
      priority: DEFINING_PROTEINS.test(ingredient.name) ? 3 : BASE_INGREDIENTS.test(ingredient.name) ? 2 : DEFINING_SAUCES.test(ingredient.name) ? 1 : 0,
    }))
    .sort((a, b) => b.priority - a.priority || a.index - b.index)
    .map(({ name }) => name);
}

export function crockPotIngredientPreview(recipe) {
  const candidates = crockPotIngredientNames(recipe);
  const firstSix = candidates.slice(0, 6);
  return (firstSix.join(" · ").length <= 110 ? firstSix : candidates.slice(0, 5)).join(" · ");
}
