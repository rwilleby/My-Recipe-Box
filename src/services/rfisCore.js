export const normalize = (value) => String(value ?? "").trim().toLowerCase();
export const compact = (values) => values.filter((value) => value !== null && value !== undefined && value !== "");
export const unique = (values) => [...new Set(values)];

export function tokenize(value) {
  return normalize(value)
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function normalizeMealNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  const match = String(value ?? "").match(/(?:cd|meal)?-?0*(\d{1,4})/i);
  return match ? Number(match[1]) : null;
}

export function normalizeLegacyId(value) {
  const number = normalizeMealNumber(value);
  return number ? `meal-${String(number).padStart(3, "0")}` : normalize(value);
}

export function normalizeStableId(value) {
  const number = normalizeMealNumber(value);
  return number ? `CD-${String(number).padStart(4, "0")}` : String(value ?? "").trim().toUpperCase();
}

export function recipeDisplayName(recipe, fallback = "Recipe") {
  return recipe?.title || recipe?.name || recipe?.id || fallback;
}

export function buildRecipeMap(recipes = []) {
  return new Map(recipes.filter(Boolean).map((recipe) => [recipe.id, recipe]));
}

export function scoreSearch(searchText, queryTokens) {
  if (!queryTokens.length) return 1;
  let score = 0;
  for (const token of queryTokens) {
    if (!searchText.includes(token)) return 0;
    score += searchText.startsWith(token) ? 4 : 1;
  }
  return score;
}
