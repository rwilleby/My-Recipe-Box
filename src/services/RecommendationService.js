import { normalize } from "./rfisCore.js";

function recipeName(recipe, fallback) {
  return recipe?.title || recipe?.name || fallback || "Recipe";
}

function collectionOverlap(source = [], candidate = []) {
  const candidateSet = new Set(candidate);
  return source.filter((name) => candidateSet.has(name));
}

export function createRecommendationService({
  completeDinnerService,
  recipeService,
} = {}) {
  if (!completeDinnerService) {
    throw new Error("RecommendationService requires completeDinnerService");
  }

  function relationshipScore(source, candidate) {
    const sourceRecipes = new Set([
      source.entreeRecipeId,
      ...(source.sideRecipeIds || []),
    ]);
    const sharedRecipes = [
      candidate.entreeRecipeId,
      ...(candidate.sideRecipeIds || []),
    ].filter((id) => sourceRecipes.has(id));
    const sharedCollections = collectionOverlap(
      source.collections || [],
      candidate.collections || []
    );
    const cuisineMatch =
      normalize(candidate.cuisine) === normalize(source.cuisine);

    return {
      score:
        sharedRecipes.length * 10 +
        sharedCollections.length * 3 +
        (cuisineMatch ? 1 : 0),
      sharedRecipes,
      sharedCollections,
      cuisineMatch,
    };
  }

  function reasonLabels(relationship) {
    const recipeLabels = relationship.sharedRecipes.map((recipeId) => {
      const recipe = recipeService?.get?.(recipeId);
      return `Shares ${recipeName(recipe, recipeId)}`;
    });
    const collectionLabels = relationship.sharedCollections.map(
      (name) => `${name} collection`
    );
    const cuisineLabels = relationship.cuisineMatch
      ? [`Matching ${relationship.dinner.cuisine} cuisine`]
      : [];
    return [...recipeLabels, ...collectionLabels, ...cuisineLabels];
  }

  function relatedDinners(
    identifier,
    { limit = 8, excludeSameEntree = false } = {}
  ) {
    const source = completeDinnerService.get(identifier);
    if (!source) return [];

    return completeDinnerService
      .all()
      .filter((candidate) => candidate.id !== source.id)
      .filter(
        (candidate) =>
          !excludeSameEntree ||
          candidate.entreeRecipeId !== source.entreeRecipeId
      )
      .map((candidate) => {
        const relationship = relationshipScore(source, candidate);
        return {
          dinner: candidate,
          ...relationship,
        };
      })
      .filter((item) => item.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          Number(a.dinner.number) - Number(b.dinner.number)
      )
      .slice(0, Math.max(0, limit));
  }

  function relatedDinnerCards(identifier, options = {}) {
    return relatedDinners(identifier, options).map((relationship) => {
      const resolved = completeDinnerService.resolve(
        relationship.dinner.id
      );
      return Object.freeze({
        id: relationship.dinner.id,
        legacyId: relationship.dinner.legacyId,
        number: relationship.dinner.number,
        title: relationship.dinner.title,
        cuisine: relationship.dinner.cuisine,
        entreeRecipeId: relationship.dinner.entreeRecipeId,
        entreeName: recipeName(
          resolved?.entree?.recipe,
          relationship.dinner.entreeRecipeId
        ),
        score: relationship.score,
        reasons: reasonLabels(relationship),
        sharedRecipeIds: relationship.sharedRecipes,
        sharedCollections: relationship.sharedCollections,
        cuisineMatch: relationship.cuisineMatch,
      });
    });
  }

  function dinnersForRecipe(
    recipeId,
    { role = "any", limit = null } = {}
  ) {
    const dinners = completeDinnerService.byRecipe(recipeId, { role });
    const mapped = dinners.map((dinner) =>
      Object.freeze({
        dinner,
        role:
          dinner.entreeRecipeId === recipeId
            ? "entree"
            : (dinner.sideRecipeIds || []).includes(recipeId)
              ? "side"
              : "related",
      })
    );
    return limit !== null && limit !== undefined && Number.isFinite(Number(limit))
      ? mapped.slice(0, Math.max(0, Number(limit)))
      : mapped;
  }

  function recipeRoleSummary(recipeId) {
    const relationships = dinnersForRecipe(recipeId);
    const entreeCount = relationships.filter(
      (item) => item.role === "entree"
    ).length;
    const sideCount = relationships.filter(
      (item) => item.role === "side"
    ).length;
    return Object.freeze({
      recipeId,
      dinnerCount: relationships.length,
      entreeCount,
      sideCount,
      relationships,
    });
  }

  function entreeOptions() {
    return completeDinnerService.listEntrees().map((item) =>
      Object.freeze({
        recipeId: item.recipeId,
        recipe: item.recipe,
        name: recipeName(item.recipe, item.recipeId),
        dinnerCount: item.dinnerCount,
      })
    );
  }

  function sidesForEntree(recipeId) {
    return completeDinnerService
      .sideRecommendations(recipeId)
      .map((item) =>
        Object.freeze({
          recipeId: item.recipeId,
          recipe: item.recipe,
          name: recipeName(item.recipe, item.recipeId),
          count: item.count,
          dinnerIds: [...item.dinnerIds],
        })
      );
  }

  function approvedDinnersForEntree(
    recipeId,
    { sideRecipeId = null } = {}
  ) {
    return dinnersForRecipe(recipeId, { role: "entree" })
      .map((item) => item.dinner)
      .filter(
        (dinner) =>
          !sideRecipeId ||
          (dinner.sideRecipeIds || []).includes(sideRecipeId)
      );
  }

  return Object.freeze({
    relatedDinners,
    relatedDinnerCards,
    dinnersForRecipe,
    recipeRoleSummary,
    entreeOptions,
    sidesForEntree,
    approvedDinnersForEntree,
  });
}

export default createRecommendationService;
