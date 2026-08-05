import {
  normalize,
  normalizeLegacyId,
  normalizeMealNumber,
  normalizeStableId,
  unique,
} from "./rfisCore.js";

function freezeList(values = []) {
  return Object.freeze([...values]);
}

export function createCompleteDinnerService({
  dinners = [],
  recipeService,
} = {}) {
  if (!recipeService) {
    throw new Error("CompleteDinnerService requires recipeService");
  }

  const ordered = [...dinners].sort(
    (a, b) => Number(a.number) - Number(b.number)
  );
  const byStableId = new Map();
  const byLegacyId = new Map();
  const byNumber = new Map();
  const byRecipeId = new Map();

  for (const dinner of ordered) {
    byStableId.set(normalizeStableId(dinner.id), dinner);
    byLegacyId.set(normalizeLegacyId(dinner.legacyId), dinner);
    byNumber.set(Number(dinner.number), dinner);

    for (const recipeId of unique([
      dinner.entreeRecipeId,
      ...(dinner.sideRecipeIds || []),
    ])) {
      if (!byRecipeId.has(recipeId)) byRecipeId.set(recipeId, []);
      byRecipeId.get(recipeId).push(dinner);
    }
  }

  function get(identifier) {
    if (
      identifier === null ||
      identifier === undefined ||
      identifier === ""
    ) {
      return null;
    }

    if (typeof identifier === "object" && identifier.id) {
      return get(identifier.id);
    }

    const number = normalizeMealNumber(identifier);
    return (
      byStableId.get(normalizeStableId(identifier)) ||
      byLegacyId.get(normalizeLegacyId(identifier)) ||
      (number ? byNumber.get(number) : null) ||
      null
    );
  }

  function resolve(identifier) {
    const dinner = get(identifier);
    if (!dinner) return null;

    const entreeProfile = recipeService.profile(dinner.entreeRecipeId);
    const sideProfiles = (dinner.sideRecipeIds || []).map((id) =>
      recipeService.profile(id)
    );
    const missingRecipeIds = [
      dinner.entreeRecipeId,
      ...(dinner.sideRecipeIds || []),
    ].filter((id) => !recipeService.has(id));

    return Object.freeze({
      ...dinner,
      entree: Object.freeze({
        role: "entree",
        recipeId: dinner.entreeRecipeId,
        recipe: entreeProfile?.recipe || null,
        profile: entreeProfile || null,
        exists: Boolean(entreeProfile),
        name: entreeProfile?.name || dinner.entreeRecipeId,
      }),
      sides: Object.freeze(
        (dinner.sideRecipeIds || []).map((id, index) => {
          const profile = sideProfiles[index];
          return Object.freeze({
            role: `side-${index + 1}`,
            recipeId: id,
            recipe: profile?.recipe || null,
            profile: profile || null,
            exists: Boolean(profile),
            name: profile?.name || id,
          });
        })
      ),
      recipeIds: freezeList([
        dinner.entreeRecipeId,
        ...(dinner.sideRecipeIds || []),
      ]),
      missingRecipeIds: freezeList(missingRecipeIds),
      referencesValid: missingRecipeIds.length === 0,
      heroReady: ["approved", "published"].includes(
        normalize(dinner.hero?.status || dinner.heroStatus)
      ),
    });
  }

  function present(identifier) {
    const resolved = resolve(identifier);
    if (!resolved) return null;

    return Object.freeze({
      id: resolved.id,
      legacyId: resolved.legacyId,
      number: resolved.number,
      title: resolved.title,
      status: resolved.status,
      cuisine: resolved.cuisine || "",
      collections: freezeList(resolved.collections || []),
      entreeRecipeId: resolved.entree.recipeId,
      entreeName: resolved.entree.name,
      sideRecipeIds: freezeList(
        resolved.sides.map((side) => side.recipeId)
      ),
      sideNames: freezeList(
        resolved.sides.map((side) => side.name)
      ),
      freshCompanion: resolved.freshCompanion || "",
      optionalBread: resolved.optionalBread || "",
      garnish: resolved.garnish || "",
      sideCount: resolved.sides.length,
      heroLayout:
        resolved.hero?.layout || resolved.heroLayout || "",
      heroStatus:
        resolved.hero?.status ||
        resolved.heroStatus ||
        "not-started",
      referencesValid: resolved.referencesValid,
      missingRecipeIds: resolved.missingRecipeIds,
    });
  }

  function byRecipe(recipeId, { role = "any" } = {}) {
    const matches = byRecipeId.get(recipeId) || [];

    if (role === "entree") {
      return matches.filter(
        (dinner) => dinner.entreeRecipeId === recipeId
      );
    }

    if (role === "side") {
      return matches.filter((dinner) =>
        (dinner.sideRecipeIds || []).includes(recipeId)
      );
    }

    return [...matches];
  }

  function filter({
    cuisine,
    collections = [],
    recipeId,
    entreeRecipeId,
    sideRecipeId,
    heroStatus,
    status,
    oneSide,
  } = {}) {
    const requiredCollections = Array.isArray(collections)
      ? collections
      : [collections];

    return ordered.filter((dinner) => {
      if (
        cuisine &&
        normalize(dinner.cuisine) !== normalize(cuisine)
      ) {
        return false;
      }

      const normalizedCollections = (dinner.collections || []).map(
        normalize
      );
      if (
        requiredCollections
          .filter(Boolean)
          .some(
            (name) =>
              !normalizedCollections.includes(normalize(name))
          )
      ) {
        return false;
      }

      if (
        recipeId &&
        ![
          dinner.entreeRecipeId,
          ...(dinner.sideRecipeIds || []),
        ].includes(recipeId)
      ) {
        return false;
      }

      if (
        entreeRecipeId &&
        dinner.entreeRecipeId !== entreeRecipeId
      ) {
        return false;
      }

      if (
        sideRecipeId &&
        !(dinner.sideRecipeIds || []).includes(sideRecipeId)
      ) {
        return false;
      }

      const actualHeroStatus =
        dinner.hero?.status || dinner.heroStatus;
      if (
        heroStatus &&
        normalize(actualHeroStatus) !== normalize(heroStatus)
      ) {
        return false;
      }

      if (
        status &&
        normalize(dinner.status) !== normalize(status)
      ) {
        return false;
      }

      if (
        typeof oneSide === "boolean" &&
        ((dinner.sideRecipeIds || []).length === 1) !== oneSide
      ) {
        return false;
      }

      return true;
    });
  }

  function listEntrees() {
    const counts = new Map();

    for (const dinner of ordered) {
      counts.set(
        dinner.entreeRecipeId,
        (counts.get(dinner.entreeRecipeId) || 0) + 1
      );
    }

    return [...counts.entries()]
      .map(([recipeId, dinnerCount]) => ({
        recipeId,
        recipe: recipeService.get(recipeId),
        profile: recipeService.profile(recipeId),
        dinnerCount,
      }))
      .sort((a, b) =>
        recipeService.name(a.recipeId).localeCompare(
          recipeService.name(b.recipeId)
        )
      );
  }

  function sideRecommendations(entreeRecipeId) {
    const counts = new Map();

    for (const dinner of byRecipe(entreeRecipeId, {
      role: "entree",
    })) {
      for (const recipeId of dinner.sideRecipeIds || []) {
        const item = counts.get(recipeId) || {
          recipeId,
          recipe: recipeService.get(recipeId),
          profile: recipeService.profile(recipeId),
          count: 0,
          dinnerIds: [],
        };
        item.count += 1;
        item.dinnerIds.push(dinner.id);
        counts.set(recipeId, item);
      }
    }

    return [...counts.values()].sort(
      (a, b) =>
        b.count - a.count ||
        recipeService
          .name(a.recipeId)
          .localeCompare(recipeService.name(b.recipeId))
    );
  }

  function cuisines() {
    const counts = new Map();

    for (const dinner of ordered) {
      const cuisine = dinner.cuisine || "Not assigned";
      counts.set(cuisine, (counts.get(cuisine) || 0) + 1);
    }

    return [...counts.entries()]
      .map(([name, count]) => Object.freeze({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function summary() {
    const oneSide = ordered.filter(
      (dinner) => (dinner.sideRecipeIds || []).length === 1
    ).length;
    const twoSide = ordered.filter(
      (dinner) => (dinner.sideRecipeIds || []).length === 2
    ).length;
    const validReferences = ordered.filter(
      (dinner) => resolve(dinner)?.referencesValid
    ).length;

    return Object.freeze({
      total: ordered.length,
      oneSide,
      twoSide,
      validReferences,
      invalidReferences: ordered.length - validReferences,
      uniqueEntrees: new Set(
        ordered.map((dinner) => dinner.entreeRecipeId)
      ).size,
      uniqueSides: new Set(
        ordered.flatMap(
          (dinner) => dinner.sideRecipeIds || []
        )
      ).size,
      cuisines: freezeList(cuisines()),
    });
  }

  return Object.freeze({
    count: ordered.length,
    all: () => [...ordered],
    get,
    resolve,
    present,
    byRecipe,
    filter,
    listEntrees,
    sideRecommendations,
    cuisines,
    summary,
    has: (identifier) => Boolean(get(identifier)),
    hasRecipeReference: (recipeId) => byRecipeId.has(recipeId),
  });
}

export default createCompleteDinnerService;
