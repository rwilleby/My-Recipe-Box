export function createValidationService({ recipeService, completeDinnerService, collectionService } = {}) {
  if (!recipeService || !completeDinnerService || !collectionService) throw new Error("ValidationService requires RFIS services");

  function references() {
    const errors = [];
    for (const dinner of completeDinnerService.all()) {
      const resolved = completeDinnerService.resolve(dinner.id);
      if (resolved.missingRecipeIds.length) errors.push({ dinnerId: dinner.id, legacyId: dinner.legacyId, missingRecipeIds: resolved.missingRecipeIds });
    }
    return { ok: errors.length === 0, count: completeDinnerService.count, errors };
  }

  function duplicateCompositions() {
    const groups = new Map();
    for (const dinner of completeDinnerService.all()) {
      const key = [dinner.entreeRecipeId, ...(dinner.sideRecipeIds || []).slice().sort()].join("|");
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(dinner.id);
    }
    const duplicates = [...groups.entries()].filter(([, ids]) => ids.length > 1).map(([composition, dinnerIds]) => ({ composition, dinnerIds }));
    return { ok: duplicates.length === 0, duplicates };
  }

  function sideCounts() {
    const errors = completeDinnerService.all().filter((dinner) => ![1, 2].includes((dinner.sideRecipeIds || []).length)).map((dinner) => dinner.id);
    return { ok: errors.length === 0, dinnerIds: errors };
  }

  function collections() {
    const missing = [];
    for (const collection of collectionService.list()) {
      for (const dinnerId of collection.dinnerIds) if (!completeDinnerService.has(dinnerId)) missing.push({ collection: collection.name, dinnerId });
    }
    return { ok: missing.length === 0, missing };
  }

  function all() {
    const results = { references: references(), duplicateCompositions: duplicateCompositions(), sideCounts: sideCounts(), collections: collections() };
    return { ok: Object.values(results).every((result) => result.ok), results };
  }

  return Object.freeze({ references, duplicateCompositions, sideCounts, collections, all });
}

export default createValidationService;
