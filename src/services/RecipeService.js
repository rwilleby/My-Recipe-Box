import { buildRecipeMap, normalize, recipeDisplayName, tokenize, scoreSearch } from "./rfisCore.js";

export function createRecipeService({ recipes = [] } = {}) {
  const ordered = [...recipes];
  const byId = buildRecipeMap(ordered);
  const searchIndex = new Map(
    ordered.map((recipe) => [
      recipe.id,
      normalize([
        recipe.id,
        recipeDisplayName(recipe),
        recipe.category,
        ...(recipe.attributes || []),
        ...(recipe.methods || []),
      ].filter(Boolean).join(" ")),
    ])
  );

  function get(identifier) {
    if (!identifier) return null;
    if (typeof identifier === "object" && identifier.id) return byId.get(identifier.id) || null;
    return byId.get(String(identifier).trim()) || null;
  }

  function search(query, { category, limit } = {}) {
    const tokens = tokenize(query);
    const matches = ordered
      .filter((recipe) => !category || normalize(recipe.category) === normalize(category))
      .map((recipe) => ({ recipe, score: scoreSearch(searchIndex.get(recipe.id) || "", tokens) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || recipeDisplayName(a.recipe).localeCompare(recipeDisplayName(b.recipe)))
      .map((item) => item.recipe);
    return Number.isFinite(limit) ? matches.slice(0, Math.max(0, limit)) : matches;
  }

  return Object.freeze({
    count: ordered.length,
    all: () => [...ordered],
    get,
    has: (identifier) => Boolean(get(identifier)),
    search,
    byCategory: (category) => ordered.filter((recipe) => normalize(recipe.category) === normalize(category)),
    name: (identifier) => recipeDisplayName(get(identifier), String(identifier || "Recipe")),
  });
}

export default createRecipeService;
