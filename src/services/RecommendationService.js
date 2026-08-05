import { normalize } from "./rfisCore.js";

export function createRecommendationService({ completeDinnerService } = {}) {
  if (!completeDinnerService) throw new Error("RecommendationService requires completeDinnerService");

  function relatedDinners(identifier, { limit = 8, excludeSameEntree = false } = {}) {
    const source = completeDinnerService.get(identifier);
    if (!source) return [];
    const sourceRecipes = new Set([source.entreeRecipeId, ...(source.sideRecipeIds || [])]);
    return completeDinnerService.all()
      .filter((candidate) => candidate.id !== source.id)
      .filter((candidate) => !excludeSameEntree || candidate.entreeRecipeId !== source.entreeRecipeId)
      .map((candidate) => {
        const sharedRecipes = [candidate.entreeRecipeId, ...(candidate.sideRecipeIds || [])].filter((id) => sourceRecipes.has(id));
        const sharedCollections = (candidate.collections || []).filter((name) => (source.collections || []).includes(name));
        const cuisineMatch = normalize(candidate.cuisine) === normalize(source.cuisine);
        const score = sharedRecipes.length * 10 + sharedCollections.length * 3 + (cuisineMatch ? 1 : 0);
        return { dinner: candidate, score, sharedRecipes, sharedCollections, cuisineMatch };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || Number(a.dinner.number) - Number(b.dinner.number))
      .slice(0, Math.max(0, limit));
  }

  return Object.freeze({
    relatedDinners,
    dinnersForRecipe: (recipeId, options) => completeDinnerService.byRecipe(recipeId, options),
    sidesForEntree: (recipeId) => completeDinnerService.sideRecommendations(recipeId),
  });
}

export default createRecommendationService;
