function duplicateGroups(items, keySelector) {
  const groups = new Map();
  for (const item of items) {
    const key = keySelector(item);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.entries()]
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => ({
      key,
      dinnerIds: group.map((item) => item.id),
      legacyIds: group.map((item) => item.legacyId).filter(Boolean),
    }));
}

export function createValidationService({
  recipeService,
  completeDinnerService,
  collectionService,
  heroService,
} = {}) {
  if (!recipeService || !completeDinnerService || !collectionService) {
    throw new Error("ValidationService requires RFIS services");
  }

  function references() {
    const errors = [];
    for (const dinner of completeDinnerService.all()) {
      const resolved = completeDinnerService.resolve(dinner.id);
      if (resolved.missingRecipeIds.length) {
        errors.push({
          dinnerId: dinner.id,
          legacyId: dinner.legacyId,
          missingRecipeIds: resolved.missingRecipeIds,
        });
      }
    }
    return {
      ok: errors.length === 0,
      checked: completeDinnerService.count,
      errors,
    };
  }

  function duplicateIds() {
    const dinners = completeDinnerService.all();
    const stable = duplicateGroups(dinners, (dinner) => dinner.id);
    const legacy = duplicateGroups(dinners, (dinner) => dinner.legacyId);
    const numbers = duplicateGroups(dinners, (dinner) =>
      Number.isFinite(Number(dinner.number)) ? String(Number(dinner.number)) : null
    );
    return {
      ok: stable.length === 0 && legacy.length === 0 && numbers.length === 0,
      stable,
      legacy,
      numbers,
    };
  }

  function duplicateCompositions() {
    const groups = duplicateGroups(
      completeDinnerService.all(),
      (dinner) => [
        dinner.entreeRecipeId,
        ...(dinner.sideRecipeIds || []).slice().sort(),
      ].join("|")
    ).map((group) => ({
      composition: group.key,
      dinnerIds: group.dinnerIds,
      legacyIds: group.legacyIds,
    }));

    return {
      ok: groups.length === 0,
      duplicates: groups,
    };
  }

  function sideCounts() {
    const errors = completeDinnerService
      .all()
      .filter((dinner) => ![1, 2].includes((dinner.sideRecipeIds || []).length))
      .map((dinner) => ({
        dinnerId: dinner.id,
        legacyId: dinner.legacyId,
        sideCount: (dinner.sideRecipeIds || []).length,
      }));

    return {
      ok: errors.length === 0,
      errors,
      dinnerIds: errors.map((item) => item.dinnerId),
    };
  }

  function heroLayouts() {
    const errors = [];
    for (const dinner of completeDinnerService.all()) {
      const sideCount = (dinner.sideRecipeIds || []).length;
      const expected =
        sideCount === 1
          ? "2/3 entrée + 1/3 side"
          : sideCount === 2
            ? "Entrée + two sides"
            : null;
      const actual = dinner.hero?.layout || dinner.heroLayout || "";
      if (expected && actual !== expected) {
        errors.push({
          dinnerId: dinner.id,
          legacyId: dinner.legacyId,
          sideCount,
          expected,
          actual,
        });
      }
    }
    return {
      ok: errors.length === 0,
      errors,
    };
  }

  function collections() {
    const missing = [];
    for (const collection of collectionService.list()) {
      for (const dinnerId of collection.dinnerIds) {
        if (!completeDinnerService.has(dinnerId)) {
          missing.push({ collection: collection.name, dinnerId });
        }
      }
    }
    return {
      ok: missing.length === 0,
      missing,
    };
  }

  function heroes() {
    const dinners = completeDinnerService.all();
    if (!heroService) {
      return {
        ok: true,
        supported: false,
        total: dinners.length,
        approved: 0,
        pending: dinners.length,
        missingCanonicalPath: [],
      };
    }

    const approved = dinners.filter((dinner) => heroService.approved(dinner));
    const missingCanonicalPath = approved
      .filter((dinner) => !heroService.candidates(dinner).length)
      .map((dinner) => ({
        dinnerId: dinner.id,
        legacyId: dinner.legacyId,
      }));

    return {
      ok: missingCanonicalPath.length === 0,
      supported: true,
      total: dinners.length,
      approved: approved.length,
      pending: dinners.length - approved.length,
      missingCanonicalPath,
    };
  }

  function summary() {
    const results = {
      references: references(),
      duplicateIds: duplicateIds(),
      duplicateCompositions: duplicateCompositions(),
      sideCounts: sideCounts(),
      heroLayouts: heroLayouts(),
      collections: collections(),
      heroes: heroes(),
    };

    const structuralKeys = [
      "references",
      "duplicateIds",
      "duplicateCompositions",
      "sideCounts",
      "heroLayouts",
      "collections",
      "heroes",
    ];

    return {
      ok: structuralKeys.every((key) => results[key].ok),
      dinnerCount: completeDinnerService.count,
      recipeCount: recipeService.count,
      issueCount:
        results.references.errors.length +
        results.duplicateIds.stable.length +
        results.duplicateIds.legacy.length +
        results.duplicateIds.numbers.length +
        results.duplicateCompositions.duplicates.length +
        results.sideCounts.errors.length +
        results.heroLayouts.errors.length +
        results.collections.missing.length +
        results.heroes.missingCanonicalPath.length,
      results,
    };
  }

  function all() {
    return summary();
  }

  return Object.freeze({
    references,
    duplicateIds,
    duplicateCompositions,
    sideCounts,
    heroLayouts,
    collections,
    heroes,
    summary,
    all,
  });
}

export default createValidationService;
