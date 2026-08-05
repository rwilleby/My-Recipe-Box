import { normalize, scoreSearch, tokenize } from "./rfisCore.js";

export function createSearchService({ recipeService, completeDinnerService, collectionService } = {}) {
  if (!recipeService || !completeDinnerService || !collectionService) throw new Error("SearchService requires recipe, dinner, and collection services");

  const dinnerIndex = new Map(completeDinnerService.all().map((dinner) => [
    dinner.id,
    normalize([
      dinner.id, dinner.legacyId, dinner.number, dinner.title, dinner.cuisine,
      dinner.freshCompanion, dinner.optionalBread, dinner.garnish,
      ...(dinner.collections || []), dinner.entreeRecipeId, ...(dinner.sideRecipeIds || []),
      recipeService.name(dinner.entreeRecipeId), ...(dinner.sideRecipeIds || []).map(recipeService.name),
    ].filter(Boolean).join(" ")),
  ]));

  function dinners(query, filterOptions = {}) {
    const tokens = tokenize(query);
    return completeDinnerService.filter(filterOptions)
      .map((dinner) => ({ dinner, score: scoreSearch(dinnerIndex.get(dinner.id) || "", tokens) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || Number(a.dinner.number) - Number(b.dinner.number))
      .map((item) => item.dinner);
  }

  function all(query, { recipeLimit = 20, dinnerLimit = 20 } = {}) {
    const collectionMatches = collectionService.list().filter((item) => normalize(item.name).includes(normalize(query)));
    return {
      recipes: recipeService.search(query, { limit: recipeLimit }),
      dinners: dinners(query).slice(0, dinnerLimit),
      collections: collectionMatches,
    };
  }

  return Object.freeze({ dinners, recipes: recipeService.search, all });
}

export default createSearchService;
