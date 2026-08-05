import {
  compact,
  normalize,
  normalizeLegacyId,
  normalizeMealNumber,
  normalizeStableId,
  unique,
} from "./rfisCore.js";

export function createCompleteDinnerService({ dinners = [], recipeService } = {}) {
  if (!recipeService) throw new Error("CompleteDinnerService requires recipeService");
  const ordered = [...dinners].sort((a, b) => Number(a.number) - Number(b.number));
  const byStableId = new Map();
  const byLegacyId = new Map();
  const byNumber = new Map();
  const byRecipeId = new Map();

  for (const dinner of ordered) {
    byStableId.set(normalizeStableId(dinner.id), dinner);
    byLegacyId.set(normalizeLegacyId(dinner.legacyId), dinner);
    byNumber.set(Number(dinner.number), dinner);
    for (const recipeId of unique([dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])])) {
      if (!byRecipeId.has(recipeId)) byRecipeId.set(recipeId, []);
      byRecipeId.get(recipeId).push(dinner);
    }
  }

  function get(identifier) {
    if (identifier === null || identifier === undefined || identifier === "") return null;
    if (typeof identifier === "object" && identifier.id) return get(identifier.id);
    const number = normalizeMealNumber(identifier);
    return byStableId.get(normalizeStableId(identifier)) ||
      byLegacyId.get(normalizeLegacyId(identifier)) ||
      (number ? byNumber.get(number) : null) || null;
  }

  function resolve(identifier) {
    const dinner = get(identifier);
    if (!dinner) return null;
    const entreeRecipe = recipeService.get(dinner.entreeRecipeId);
    const sideRecipes = (dinner.sideRecipeIds || []).map((id) => recipeService.get(id));
    const missingRecipeIds = [dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])]
      .filter((id) => !recipeService.has(id));
    return {
      ...dinner,
      entree: { role: "entree", recipeId: dinner.entreeRecipeId, recipe: entreeRecipe, exists: Boolean(entreeRecipe), name: recipeService.name(dinner.entreeRecipeId) },
      sides: (dinner.sideRecipeIds || []).map((id, index) => ({ role: `side-${index + 1}`, recipeId: id, recipe: sideRecipes[index], exists: Boolean(sideRecipes[index]), name: recipeService.name(id) })),
      recipeIds: [dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])],
      missingRecipeIds,
      referencesValid: missingRecipeIds.length === 0,
      heroReady: ["approved", "published"].includes(normalize(dinner.hero?.status)),
    };
  }

  function byRecipe(recipeId, { role = "any" } = {}) {
    const matches = byRecipeId.get(recipeId) || [];
    if (role === "entree") return matches.filter((d) => d.entreeRecipeId === recipeId);
    if (role === "side") return matches.filter((d) => (d.sideRecipeIds || []).includes(recipeId));
    return [...matches];
  }

  function filter({ cuisine, collections = [], recipeId, entreeRecipeId, sideRecipeId, heroStatus, status, oneSide } = {}) {
    const requiredCollections = Array.isArray(collections) ? collections : [collections];
    return ordered.filter((dinner) => {
      if (cuisine && normalize(dinner.cuisine) !== normalize(cuisine)) return false;
      if (requiredCollections.filter(Boolean).some((name) => !(dinner.collections || []).map(normalize).includes(normalize(name)))) return false;
      if (recipeId && ![dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])].includes(recipeId)) return false;
      if (entreeRecipeId && dinner.entreeRecipeId !== entreeRecipeId) return false;
      if (sideRecipeId && !(dinner.sideRecipeIds || []).includes(sideRecipeId)) return false;
      if (heroStatus && normalize(dinner.hero?.status) !== normalize(heroStatus)) return false;
      if (status && normalize(dinner.status) !== normalize(status)) return false;
      if (typeof oneSide === "boolean" && ((dinner.sideRecipeIds || []).length === 1) !== oneSide) return false;
      return true;
    });
  }

  function listEntrees() {
    const counts = new Map();
    for (const dinner of ordered) counts.set(dinner.entreeRecipeId, (counts.get(dinner.entreeRecipeId) || 0) + 1);
    return [...counts.entries()].map(([recipeId, dinnerCount]) => ({ recipeId, recipe: recipeService.get(recipeId), dinnerCount }))
      .sort((a, b) => recipeService.name(a.recipeId).localeCompare(recipeService.name(b.recipeId)));
  }

  function sideRecommendations(entreeRecipeId) {
    const counts = new Map();
    for (const dinner of byRecipe(entreeRecipeId, { role: "entree" })) {
      for (const recipeId of dinner.sideRecipeIds || []) {
        const item = counts.get(recipeId) || { recipeId, recipe: recipeService.get(recipeId), count: 0, dinnerIds: [] };
        item.count += 1;
        item.dinnerIds.push(dinner.id);
        counts.set(recipeId, item);
      }
    }
    return [...counts.values()].sort((a, b) => b.count - a.count || recipeService.name(a.recipeId).localeCompare(recipeService.name(b.recipeId)));
  }

  return Object.freeze({
    count: ordered.length,
    all: () => [...ordered],
    get,
    resolve,
    byRecipe,
    filter,
    listEntrees,
    sideRecommendations,
    has: (identifier) => Boolean(get(identifier)),
    hasRecipeReference: (recipeId) => byRecipeId.has(recipeId),
  });
}

export default createCompleteDinnerService;
