import { completeDinners as defaultCompleteDinners } from "../data/completeDinners.js";
import { completeDinnerCollections as defaultCollections } from "../data/completeDinnerCollections.js";
import { createRecipeService } from "./RecipeService.js";
import { createCompleteDinnerService } from "./CompleteDinnerService.js";
import { createCollectionService } from "./CollectionService.js";
import { createRecommendationService } from "./RecommendationService.js";
import { createSearchService } from "./SearchService.js";
import { createHeroService } from "./HeroService.js";
import { createValidationService } from "./ValidationService.js";

export function createRfisPlatform({ recipes = [], dinners = defaultCompleteDinners, collections = defaultCollections, heroPlaceholder } = {}) {
  const recipeService = createRecipeService({ recipes });
  const completeDinnerService = createCompleteDinnerService({ dinners, recipeService });
  const collectionService = createCollectionService({ collections, completeDinnerService });
  const recommendationService = createRecommendationService({ completeDinnerService });
  const searchService = createSearchService({ recipeService, completeDinnerService, collectionService });
  const heroService = createHeroService({ placeholder: heroPlaceholder });
  const validationService = createValidationService({ recipeService, completeDinnerService, collectionService });

  return Object.freeze({
    recipes: recipeService,
    completeDinners: completeDinnerService,
    collections: collectionService,
    recommendations: recommendationService,
    search: searchService,
    heroes: heroService,
    validation: validationService,
  });
}

export default createRfisPlatform;
