import {
  buildRecipeMap,
  normalize,
  recipeDisplayName,
  tokenize,
  scoreSearch,
} from "./rfisCore.js";

function uniqueStrings(values = []) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.trim()))];
}

export function createRecipeService({
  recipes = [],
  hasNutritionRecord = () => false,
} = {}) {
  const ordered = [...recipes];
  const byId = buildRecipeMap(ordered);

  const profiles = new Map(
    ordered.map((recipe) => {
      const attributes = uniqueStrings(recipe.attributes || []);
      const collections = uniqueStrings(recipe.collections || []);
      const methods = uniqueStrings(recipe.cookingMethods || recipe.methods || []);
      const category = recipe.primaryCategory || recipe.category || recipe.categoryCode || "Not assigned";
      const classificationCount = attributes.length + collections.length + methods.length;
      return [recipe.id, Object.freeze({
        id: recipe.id,
        name: recipeDisplayName(recipe),
        category,
        categoryCode: recipe.categoryCode || "",
        attributes: Object.freeze(attributes),
        collections: Object.freeze(collections),
        cookingMethods: Object.freeze(methods),
        classificationCount,
        classificationStatus: classificationCount > 0 ? "Classified" : "Needs classification",
        hasNutritionRecord: Boolean(hasNutritionRecord(recipe.id)),
        recipe,
      })];
    })
  );

  const searchIndex = new Map(
    ordered.map((recipe) => {
      const profile = profiles.get(recipe.id);
      return [recipe.id, normalize([
        recipe.id,
        profile.name,
        profile.category,
        profile.categoryCode,
        ...profile.attributes,
        ...profile.collections,
        ...profile.cookingMethods,
      ].filter(Boolean).join(" "))];
    })
  );

  function get(identifier) {
    if (!identifier) return null;
    if (typeof identifier === "object" && identifier.id) return byId.get(identifier.id) || null;
    return byId.get(String(identifier).trim()) || null;
  }

  function profile(identifier) {
    const recipe = get(identifier);
    return recipe ? profiles.get(recipe.id) || null : null;
  }

  function present(identifier) {
    const item = profile(identifier);
    if (!item) return null;
    return Object.freeze({
      id: item.id,
      name: item.name,
      category: item.category,
      categoryCode: item.categoryCode,
      hasNutritionRecord: item.hasNutritionRecord,
      classificationCount: item.classificationCount,
      classificationStatus: item.classificationStatus,
    });
  }

  function search(query, { category, limit } = {}) {
    const tokens = tokenize(query);
    const matches = ordered
      .filter((recipe) => !category || normalize(profile(recipe.id)?.category) === normalize(category))
      .map((recipe) => ({ recipe, score: scoreSearch(searchIndex.get(recipe.id) || "", tokens) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || recipeDisplayName(a.recipe).localeCompare(recipeDisplayName(b.recipe)))
      .map((item) => item.recipe);
    return Number.isFinite(limit) ? matches.slice(0, Math.max(0, limit)) : matches;
  }

  function byCategory(category) {
    return ordered.filter((recipe) => normalize(profile(recipe.id)?.category) === normalize(category));
  }

  function categories() {
    const counts = new Map();
    for (const recipe of ordered) {
      const category = profile(recipe.id)?.category || "Not assigned";
      counts.set(category, (counts.get(category) || 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => Object.freeze({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function nutritionSummary() {
    const available = ordered.filter((recipe) => profile(recipe.id)?.hasNutritionRecord).length;
    return Object.freeze({
      total: ordered.length,
      available,
      missing: ordered.length - available,
      complete: available === ordered.length,
    });
  }

  function classificationSummary() {
    const classified = ordered.filter((recipe) => profile(recipe.id)?.classificationCount > 0).length;
    return Object.freeze({
      total: ordered.length,
      classified,
      missing: ordered.length - classified,
      complete: classified === ordered.length,
    });
  }

  return Object.freeze({
    count: ordered.length,
    all: () => [...ordered],
    get,
    has: (identifier) => Boolean(get(identifier)),
    profile,
    present,
    search,
    byCategory,
    categories,
    nutritionSummary,
    classificationSummary,
    name: (identifier) => recipeDisplayName(get(identifier), String(identifier || "Recipe")),
  });
}

export default createRecipeService;
