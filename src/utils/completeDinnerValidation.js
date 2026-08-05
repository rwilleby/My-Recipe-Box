import { completeDinners, COMPLETE_DINNER_META } from "../data/completeDinners.js";

export function validateCompleteDinnerCatalog(recipes = []) {
  const recipeIds = new Set(recipes.map((recipe) => recipe.id));
  const ids = new Set();
  const legacyIds = new Set();
  const errors = [];

  for (const dinner of completeDinners) {
    if (ids.has(dinner.id)) errors.push(`Duplicate Complete Dinner ID: ${dinner.id}`);
    if (legacyIds.has(dinner.legacyId)) errors.push(`Duplicate legacy meal ID: ${dinner.legacyId}`);
    ids.add(dinner.id);
    legacyIds.add(dinner.legacyId);

    const recipeRefs = [dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])];
    for (const recipeId of recipeRefs) {
      if (!recipeIds.has(recipeId)) errors.push(`${dinner.legacyId}: missing recipe ${recipeId}`);
    }

    if (!dinner.sideRecipeIds?.length || dinner.sideRecipeIds.length > 2) {
      errors.push(`${dinner.legacyId}: must have one or two freezer sides`);
    }
    const expectedLayout = dinner.sideRecipeIds.length === 1 ? "one-side" : "two-side";
    if (dinner.hero?.layout !== expectedLayout) {
      errors.push(`${dinner.legacyId}: hero layout does not match side count`);
    }
  }

  if (completeDinners.length !== COMPLETE_DINNER_META.recordCount) {
    errors.push(`Catalog count mismatch: expected ${COMPLETE_DINNER_META.recordCount}, found ${completeDinners.length}`);
  }

  return { ok: errors.length === 0, errors, count: completeDinners.length };
}
