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
    const normalizedQuery = normalize(query);
    const queryTokens = tokenize(query);
    const collectionMatches = collectionService.list()
      .map((item) => {
        const resolved = collectionService.get(item.name);
        const haystack = normalize([
          item.name,
          ...(resolved?.dinners || []).slice(0, 10).map((dinner) => dinner.title),
        ].join(" "));
        return { item, score: scoreSearch(haystack, queryTokens) };
      })
      .filter(({ item, score }) =>
        normalizedQuery ? score > 0 || normalize(item.name).includes(normalizedQuery) : false
      )
      .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
      .map(({ item }) => item);
    return {
      recipes: recipeService.search(query, { limit: recipeLimit }),
      dinners: dinners(query).slice(0, dinnerLimit),
      collections: collectionMatches,
    };
  }

  return Object.freeze({ dinners, recipes: recipeService.search, all });
}

export default createSearchService;
