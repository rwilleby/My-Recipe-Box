function recipeName(recipe, fallback = "Recipe") {
  return recipe?.title || recipe?.name || recipe?.id || fallback;
}

function normalizeName(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function createCollectionService({
  collections = {},
  completeDinnerService,
  recipeService,
} = {}) {
  if (!completeDinnerService) {
    throw new Error("CollectionService requires completeDinnerService");
  }

  const normalized = Object.freeze(
    Object.fromEntries(
      Object.entries(collections).map(([name, dinnerIds]) => [
        name,
        Object.freeze([...(dinnerIds || [])]),
      ])
    )
  );

  const nameIndex = new Map(
    Object.keys(normalized).map((name) => [normalizeName(name), name])
  );

  function canonicalName(name) {
    return nameIndex.get(normalizeName(name)) || null;
  }

  function list({ sampleLimit = 3 } = {}) {
    return Object.entries(normalized)
      .map(([name, dinnerIds]) => {
        const dinners = dinnerIds
          .map((id) => completeDinnerService.get(id))
          .filter(Boolean);
        return Object.freeze({
          name,
          count: dinners.length,
          dinnerIds: Object.freeze(dinners.map((dinner) => dinner.id)),
          sampleDinners: Object.freeze(
            dinners.slice(0, Math.max(0, sampleLimit)).map((dinner) =>
              Object.freeze({
                id: dinner.id,
                legacyId: dinner.legacyId,
                number: dinner.number,
                title: dinner.title,
                cuisine: dinner.cuisine,
              })
            )
          ),
        });
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function has(name) {
    return canonicalName(name) !== null;
  }

  function get(name, { sampleLimit = 3 } = {}) {
    const resolvedName = canonicalName(name);
    if (!resolvedName) return null;

    const dinnerIds = normalized[resolvedName];
    const dinners = dinnerIds
      .map((id) => completeDinnerService.get(id))
      .filter(Boolean);

    const recipeIds = new Set();
    for (const dinner of dinners) {
      recipeIds.add(dinner.entreeRecipeId);
      for (const sideId of dinner.sideRecipeIds || []) recipeIds.add(sideId);
    }

    const recipes = recipeService
      ? [...recipeIds]
          .map((id) => recipeService.get(id))
          .filter(Boolean)
          .map((recipe) =>
            Object.freeze({
              id: recipe.id,
              name: recipeName(recipe),
              category: recipe.category || recipe.categoryCode || "",
            })
          )
      : [];

    return Object.freeze({
      name: resolvedName,
      count: dinners.length,
      dinnerIds: Object.freeze(dinners.map((dinner) => dinner.id)),
      dinners: Object.freeze(dinners),
      recipes: Object.freeze(recipes),
      sampleDinners: Object.freeze(
        dinners.slice(0, Math.max(0, sampleLimit)).map((dinner) =>
          Object.freeze({
            id: dinner.id,
            legacyId: dinner.legacyId,
            number: dinner.number,
            title: dinner.title,
            cuisine: dinner.cuisine,
          })
        )
      ),
    });
  }

  function namesForDinner(identifier) {
    const dinner = completeDinnerService.get(identifier);
    if (!dinner) return [];

    return Object.entries(normalized)
      .filter(([, dinnerIds]) => dinnerIds.includes(dinner.id))
      .map(([name]) => name)
      .sort((a, b) => a.localeCompare(b));
  }

  function summaries({ sampleLimit = 3 } = {}) {
    return list({ sampleLimit });
  }

  function search(query, { sampleLimit = 3 } = {}) {
    const term = normalizeName(query);
    if (!term) return [];

    return list({ sampleLimit })
      .map((collection) => {
        const detail = get(collection.name, { sampleLimit });
        const haystack = [
          collection.name,
          ...detail.sampleDinners.map((dinner) => dinner.title),
          ...detail.recipes.slice(0, 12).map((recipe) => recipe.name),
        ]
          .join(" ")
          .toLowerCase();

        const exact = normalizeName(collection.name) === term ? 100 : 0;
        const starts = normalizeName(collection.name).startsWith(term) ? 50 : 0;
        const includes = haystack.includes(term) ? 20 : 0;

        return { ...collection, score: exact + starts + includes };
      })
      .filter((collection) => collection.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }

  return Object.freeze({
    list,
    summaries,
    get,
    has,
    namesForDinner,
    search,
  });
}

export default createCollectionService;
