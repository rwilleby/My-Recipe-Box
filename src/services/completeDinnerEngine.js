import { completeDinners as defaultCompleteDinners } from "../data/completeDinners.js";
import { completeDinnerCollections as defaultCollections } from "../data/completeDinnerCollections.js";

const normalize = (value) => String(value ?? "").trim().toLowerCase();
const compact = (values) => values.filter((value) => value !== null && value !== undefined && value !== "");

function tokenize(value) {
  return normalize(value)
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values)];
}

function normalizeMealNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  const match = String(value ?? "").match(/(?:cd|meal)?-?0*(\d{1,4})/i);
  return match ? Number(match[1]) : null;
}

function normalizeLegacyId(value) {
  const number = normalizeMealNumber(value);
  return number ? `meal-${String(number).padStart(3, "0")}` : normalize(value);
}

function normalizeStableId(value) {
  const number = normalizeMealNumber(value);
  return number ? `CD-${String(number).padStart(4, "0")}` : String(value ?? "").trim().toUpperCase();
}

function buildRecipeMap(recipes) {
  return new Map((recipes || []).filter(Boolean).map((recipe) => [recipe.id, recipe]));
}

function buildSearchText(dinner, recipeMap) {
  const recipeIds = [dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])];
  const recipeNames = recipeIds.map((id) => recipeMap.get(id)?.title || recipeMap.get(id)?.name || "");
  return normalize(compact([
    dinner.id,
    dinner.legacyId,
    dinner.number,
    dinner.title,
    dinner.cuisine,
    dinner.freshCompanion,
    dinner.optionalBread,
    dinner.garnish,
    ...(dinner.collections || []),
    ...recipeIds,
    ...recipeNames,
  ]).join(" "));
}

function resolveRecipe(recipeMap, recipeId, role) {
  const recipe = recipeMap.get(recipeId) || null;
  return {
    role,
    recipeId,
    recipe,
    exists: Boolean(recipe),
    name: recipe?.title || recipe?.name || recipeId,
  };
}

function scoreSearch(searchText, queryTokens) {
  if (!queryTokens.length) return 1;
  let score = 0;
  for (const token of queryTokens) {
    if (!searchText.includes(token)) return 0;
    score += searchText.startsWith(token) ? 4 : 1;
  }
  return score;
}

function includesAll(values, required) {
  const haystack = new Set((values || []).map(normalize));
  return (required || []).every((value) => haystack.has(normalize(value)));
}

function includesAny(values, requested) {
  if (!requested?.length) return true;
  const haystack = new Set((values || []).map(normalize));
  return requested.some((value) => haystack.has(normalize(value)));
}

export function createCompleteDinnerEngine({
  dinners = defaultCompleteDinners,
  collections = defaultCollections,
  recipes = [],
} = {}) {
  const recipeMap = buildRecipeMap(recipes);
  const ordered = [...(dinners || [])].sort((a, b) => Number(a.number) - Number(b.number));
  const byStableId = new Map();
  const byLegacyId = new Map();
  const byNumber = new Map();
  const byRecipeId = new Map();
  const searchIndex = new Map();

  for (const dinner of ordered) {
    byStableId.set(normalizeStableId(dinner.id), dinner);
    byLegacyId.set(normalizeLegacyId(dinner.legacyId), dinner);
    byNumber.set(Number(dinner.number), dinner);
    searchIndex.set(dinner.id, buildSearchText(dinner, recipeMap));

    const refs = unique([dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])]);
    for (const recipeId of refs) {
      if (!byRecipeId.has(recipeId)) byRecipeId.set(recipeId, []);
      byRecipeId.get(recipeId).push(dinner);
    }
  }

  const collectionMap = new Map(
    Object.entries(collections || {}).map(([name, ids]) => [normalize(name), { name, ids: [...ids] }])
  );

  function getDinner(identifier) {
    if (identifier === null || identifier === undefined || identifier === "") return null;
    if (typeof identifier === "object" && identifier.id) return getDinner(identifier.id);
    const number = normalizeMealNumber(identifier);
    return (
      byStableId.get(normalizeStableId(identifier)) ||
      byLegacyId.get(normalizeLegacyId(identifier)) ||
      (number ? byNumber.get(number) : null) ||
      null
    );
  }

  function resolveDinner(identifier) {
    const dinner = getDinner(identifier);
    if (!dinner) return null;
    const entree = resolveRecipe(recipeMap, dinner.entreeRecipeId, "entree");
    const sides = (dinner.sideRecipeIds || []).map((id, index) => resolveRecipe(recipeMap, id, `side-${index + 1}`));
    const missingRecipeIds = [entree, ...sides].filter((item) => !item.exists).map((item) => item.recipeId);

    return {
      ...dinner,
      entree,
      sides,
      recipeIds: [dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])],
      missingRecipeIds,
      referencesValid: missingRecipeIds.length === 0,
      heroReady: ["approved", "published"].includes(normalize(dinner.hero?.status)),
    };
  }

  function getDinnersByRecipe(recipeId, { role = "any" } = {}) {
    const matches = byRecipeId.get(recipeId) || [];
    if (role === "entree") return matches.filter((dinner) => dinner.entreeRecipeId === recipeId);
    if (role === "side") return matches.filter((dinner) => (dinner.sideRecipeIds || []).includes(recipeId));
    return [...matches];
  }

  function getCollection(name) {
    const entry = collectionMap.get(normalize(name));
    if (!entry) return null;
    return {
      name: entry.name,
      dinnerIds: [...entry.ids],
      dinners: entry.ids.map(getDinner).filter(Boolean),
    };
  }

  function listCollections() {
    return [...collectionMap.values()]
      .map((entry) => ({ name: entry.name, count: entry.ids.length, dinnerIds: [...entry.ids] }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function filterDinners({
    cuisine,
    collections: requestedCollections = [],
    recipeId,
    entreeRecipeId,
    sideRecipeId,
    heroStatus,
    status,
    oneSide,
  } = {}) {
    const requested = Array.isArray(requestedCollections) ? requestedCollections : [requestedCollections];
    return ordered.filter((dinner) => {
      if (cuisine && normalize(dinner.cuisine) !== normalize(cuisine)) return false;
      if (!includesAll(dinner.collections || [], requested)) return false;
      if (recipeId && ![dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])].includes(recipeId)) return false;
      if (entreeRecipeId && dinner.entreeRecipeId !== entreeRecipeId) return false;
      if (sideRecipeId && !(dinner.sideRecipeIds || []).includes(sideRecipeId)) return false;
      if (heroStatus && normalize(dinner.hero?.status) !== normalize(heroStatus)) return false;
      if (status && normalize(dinner.status) !== normalize(status)) return false;
      if (typeof oneSide === "boolean" && ((dinner.sideRecipeIds || []).length === 1) !== oneSide) return false;
      return true;
    });
  }

  function search(query, options = {}) {
    const queryTokens = tokenize(query);
    const candidates = filterDinners(options);
    return candidates
      .map((dinner) => ({ dinner, score: scoreSearch(searchIndex.get(dinner.id) || "", queryTokens) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || Number(a.dinner.number) - Number(b.dinner.number))
      .map((item) => item.dinner);
  }

  function getRelated(identifier, { limit = 8, excludeSameEntree = false } = {}) {
    const source = getDinner(identifier);
    if (!source) return [];
    const sourceRecipes = new Set([source.entreeRecipeId, ...(source.sideRecipeIds || [])]);
    return ordered
      .filter((candidate) => candidate.id !== source.id)
      .filter((candidate) => !excludeSameEntree || candidate.entreeRecipeId !== source.entreeRecipeId)
      .map((candidate) => {
        const candidateRecipes = [candidate.entreeRecipeId, ...(candidate.sideRecipeIds || [])];
        const sharedRecipes = candidateRecipes.filter((id) => sourceRecipes.has(id));
        const sharedCollections = (candidate.collections || []).filter((name) => (source.collections || []).includes(name));
        const cuisineMatch = normalize(candidate.cuisine) === normalize(source.cuisine) ? 1 : 0;
        const score = sharedRecipes.length * 10 + sharedCollections.length * 3 + cuisineMatch;
        return { dinner: candidate, score, sharedRecipes, sharedCollections };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || Number(a.dinner.number) - Number(b.dinner.number))
      .slice(0, Math.max(0, limit));
  }

  function validateReferences() {
    const errors = [];
    for (const dinner of ordered) {
      const resolved = resolveDinner(dinner.id);
      if (resolved.missingRecipeIds.length) {
        errors.push({ dinnerId: dinner.id, legacyId: dinner.legacyId, missingRecipeIds: resolved.missingRecipeIds });
      }
    }
    return { ok: errors.length === 0, count: ordered.length, errors };
  }

  return Object.freeze({
    count: ordered.length,
    all: () => [...ordered],
    getDinner,
    resolveDinner,
    getDinnersByRecipe,
    getCollection,
    listCollections,
    filterDinners,
    search,
    getRelated,
    validateReferences,
    hasDinner: (identifier) => Boolean(getDinner(identifier)),
    hasRecipeReference: (recipeId) => byRecipeId.has(recipeId),
  });
}

export default createCompleteDinnerEngine;
