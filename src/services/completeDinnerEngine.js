import { createRfisPlatform } from "./createRfisPlatform.js";

// Compatibility facade. Existing UI code can continue to use the historical
// completeDinnerEngine API while all behavior is supplied by shared RFIS services.
export function createCompleteDinnerEngine(options = {}) {
  const platform = createRfisPlatform(options);
  const dinners = platform.completeDinners;

  return Object.freeze({
    count: dinners.count,
    all: dinners.all,
    getDinner: dinners.get,
    resolveDinner: dinners.resolve,
    getDinnersByRecipe: dinners.byRecipe,
    getCollection: platform.collections.get,
    listCollections: platform.collections.list,
    filterDinners: dinners.filter,
    search: platform.search.dinners,
    getRelated: platform.recommendations.relatedDinners,
    listEntrees: dinners.listEntrees,
    getSideRecommendations: dinners.sideRecommendations,
    validateReferences: platform.validation.references,
    validateAll: platform.validation.all,
    hasDinner: dinners.has,
    hasRecipeReference: dinners.hasRecipeReference,
    services: platform,
  });
}

export default createCompleteDinnerEngine;
