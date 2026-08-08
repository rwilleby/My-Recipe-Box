function freeze(value) {
  if (Array.isArray(value)) return Object.freeze(value.map(freeze));
  if (value && typeof value === "object") {
    return Object.freeze(
      Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, freeze(item)])
      )
    );
  }
  return value;
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function extractIngredients(recipe) {
  const candidates = [
    recipe?.ingredients,
    recipe?.ingredientList,
    recipe?.items,
  ];
  const raw = candidates.find((value) => Array.isArray(value));
  if (!raw) return [];

  return raw
    .map((item) => {
      if (typeof item === "string") return { name: item };
      if (!item || typeof item !== "object") return null;
      return {
        name:
          item.name ||
          item.ingredient ||
          item.item ||
          item.label ||
          "",
        quantity:
          Number.isFinite(Number(item.quantity))
            ? Number(item.quantity)
            : null,
        unit: item.unit || "",
      };
    })
    .filter((item) => normalize(item?.name));
}

export function createUseWhatIHaveService({
  pantry,
  rfisPlatform = null,
} = {}) {
  if (!pantry) {
    throw new Error("UseWhatIHaveService requires pantry inventory");
  }

  function availableMap() {
    const map = new Map();
    for (const item of pantry.all()) {
      const key = normalize(item.name);
      map.set(key, (map.get(key) || 0) + Number(item.quantity || 0));
    }
    return map;
  }

  function scoreRecipe(recipe) {
    const ingredients = extractIngredients(recipe);
    const available = availableMap();

    if (!ingredients.length) {
      return freeze({
        recipeId: recipe?.id || null,
        title: recipe?.title || recipe?.name || "Recipe",
        ingredientCount: 0,
        matchedCount: 0,
        missingCount: 0,
        matchPercent: null,
        matched: [],
        missing: [],
      });
    }

    const matched = [];
    const missing = [];

    for (const ingredient of ingredients) {
      const key = normalize(ingredient.name);
      if ((available.get(key) || 0) > 0) {
        matched.push(ingredient);
      } else {
        missing.push(ingredient);
      }
    }

    return freeze({
      recipeId: recipe?.id || null,
      title: recipe?.title || recipe?.name || "Recipe",
      ingredientCount: ingredients.length,
      matchedCount: matched.length,
      missingCount: missing.length,
      matchPercent:
        ingredients.length > 0
          ? Math.round((matched.length / ingredients.length) * 100)
          : null,
      matched,
      missing,
    });
  }

  function ranked({ limit = 20 } = {}) {
    if (!rfisPlatform) return freeze([]);

    const recipes =
      rfisPlatform.recipes.all?.() ||
      rfisPlatform.recipes.list?.() ||
      [];

    return freeze(
      recipes
        .map(scoreRecipe)
        .filter((row) => row.ingredientCount > 0)
        .sort(
          (a, b) =>
            b.matchPercent - a.matchPercent ||
            a.missingCount - b.missingCount ||
            a.title.localeCompare(b.title)
        )
        .slice(0, Math.max(0, limit))
    );
  }

  function byIngredients(names = []) {
    const wanted = new Set(
      names.map(normalize).filter(Boolean)
    );

    if (!rfisPlatform || wanted.size === 0) return freeze([]);

    const recipes =
      rfisPlatform.recipes.all?.() ||
      rfisPlatform.recipes.list?.() ||
      [];

    return freeze(
      recipes
        .map((recipe) => ({
          score: scoreRecipe(recipe),
          selectedMatches: extractIngredients(recipe).filter((ingredient) =>
            wanted.has(normalize(ingredient.name))
          ).length,
        }))
        .filter((row) => row.selectedMatches > 0)
        .sort(
          (a, b) =>
            b.selectedMatches - a.selectedMatches ||
            (b.score.matchPercent || 0) - (a.score.matchPercent || 0)
        )
        .map((row) => row.score)
    );
  }

  return Object.freeze({
    scoreRecipe,
    ranked,
    byIngredients,
  });
}

export default createUseWhatIHaveService;
