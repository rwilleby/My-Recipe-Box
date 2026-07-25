// Robert's Recipe Box — GLP-1 Nutrition Support filters and preset views
// Phase 2 of the controlled implementation: filter/preset infrastructure only.
//
// GLP-1-specific filters require reviewed classification data. General practical
// filters such as Low Sodium, Freezer Friendly, and Meal Prep Friendly may also
// match existing recipe classifications and tags.

export const GLP1_RECIPE_FILTERS = Object.freeze([
  { id: "glp1-friendly", label: "GLP-1 Friendly" },
  { id: "high-protein", label: "High Protein" },
  { id: "high-fiber", label: "High Fiber" },
  { id: "small-portion-friendly", label: "Small Portion Friendly" },
  { id: "easy-digestion", label: "Easy Digestion" },
  { id: "protein-first", label: "Protein First" },
  { id: "nutrient-dense", label: "Nutrient Dense" },
  { id: "low-added-sugar", label: "Low Added Sugar" },
  { id: "dose-increase-friendly", label: "Dose-Increase Friendly" },
  { id: "hydration-support", label: "Hydration Support" },
  { id: "high-satiety", label: "High Satiety" },
  { id: "diabetes-friendly", label: "Diabetes Friendly" },
  { id: "low-sodium", label: "Low Sodium" },
  { id: "freezer-friendly", label: "Freezer Friendly" },
  { id: "meal-prep-friendly", label: "Meal Prep Friendly" },
]);

export const GLP1_RECIPE_COLLECTION_PRESETS = Object.freeze([
  {
    id: "glp1-friendly-recipes",
    label: "GLP-1 Friendly Recipes",
    filters: ["glp1-friendly"],
  },
  {
    id: "high-protein-breakfasts",
    label: "High-Protein Breakfasts",
    filters: ["high-protein"],
    recipeTypes: ["breakfast"],
  },
  {
    id: "protein-first-main-dishes",
    label: "Protein-First Main Dishes",
    filters: ["protein-first"],
    recipeTypes: ["main"],
  },
  {
    id: "small-meals",
    label: "Small Meals",
    filters: ["small-portion-friendly"],
  },
  {
    id: "easy-digestion-meals",
    label: "Easy-Digestion Meals",
    filters: ["easy-digestion"],
  },
  {
    id: "high-fiber-recipes",
    label: "High-Fiber Recipes",
    filters: ["high-fiber"],
  },
  {
    id: "low-added-sugar-recipes",
    label: "Low-Added-Sugar Recipes",
    filters: ["low-added-sugar"],
  },
  {
    id: "glp1-snacks",
    label: "GLP-1 Snacks",
    filters: ["glp1-friendly"],
    recipeTypes: ["snack"],
  },
  {
    id: "dose-increase-friendly-meals",
    label: "Dose-Increase Friendly Meals",
    filters: ["dose-increase-friendly"],
  },
  {
    id: "soups-and-soft-foods",
    label: "Soups and Soft Foods",
    filters: ["easy-digestion"],
    keywords: ["soup", "stew", "oatmeal", "yogurt", "smoothie", "scrambled", "mashed"],
  },
  {
    id: "freezer-friendly-glp1-meals",
    label: "Freezer-Friendly GLP-1 Meals",
    filters: ["glp1-friendly", "freezer-friendly"],
  },
  {
    id: "high-protein-comfort-foods",
    label: "High-Protein Comfort Foods",
    filters: ["high-protein"],
    collections: ["Comfort Foods"],
  },
]);

const REVIEWED_STATUSES = new Set(["Provisional", "Verified"]);

function normalizedStrings(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function recipeSearchText(recipe) {
  return [
    recipe?.id,
    recipe?.title,
    recipe?.category,
    recipe?.categoryCode,
    ...(recipe?.attributes || []),
    ...(recipe?.collections || []),
    ...(recipe?.tags || []),
    ...(recipe?.dietaryTags || []),
    ...(recipe?.ingredients || []).map((ingredient) =>
      typeof ingredient === "string"
        ? ingredient
        : ingredient?.name || ingredient?.ingredient || ""
    ),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hasNamedClassification(recipe, names) {
  const wanted = new Set(names.map((name) => name.toLowerCase()));
  return [
    ...normalizedStrings(recipe?.attributes),
    ...normalizedStrings(recipe?.collections),
    ...normalizedStrings(recipe?.tags),
    ...normalizedStrings(recipe?.dietaryTags),
  ].some((item) => wanted.has(item));
}

export function isGLP1RecipeReviewed(recipe) {
  return REVIEWED_STATUSES.has(recipe?.glp1ReviewStatus);
}

export function glp1RecipeMatchesFilter(recipe, filterId) {
  if (!filterId) return true;

  const reviewed = isGLP1RecipeReviewed(recipe);
  switch (filterId) {
    case "glp1-friendly":
      return reviewed && recipe?.glp1Friendly === true;
    case "high-protein":
      return (
        (reviewed && recipe?.proteinLevel === "High") ||
        hasNamedClassification(recipe, ["Higher Protein", "High Protein"])
      );
    case "high-fiber":
      return reviewed && recipe?.fiberLevel === "High";
    case "small-portion-friendly":
      return reviewed && recipe?.smallPortionFriendly === true;
    case "easy-digestion":
      return reviewed && recipe?.easyDigestion === true;
    case "protein-first":
      return reviewed && recipe?.proteinFirst === true;
    case "nutrient-dense":
      return reviewed && recipe?.nutrientDense === true;
    case "low-added-sugar":
      return reviewed && recipe?.addedSugarLevel === "Low";
    case "dose-increase-friendly":
      return reviewed && recipe?.doseIncreaseFriendly === true;
    case "hydration-support":
      return reviewed && recipe?.hydrationSupport === true;
    case "high-satiety":
      return reviewed && recipe?.satietyLevel === "High";
    case "diabetes-friendly":
      return (
        recipe?.diabetesFriendly === true ||
        hasNamedClassification(recipe, ["Diabetes Friendly"])
      );
    case "low-sodium":
      return (
        recipe?.lowSodium === true ||
        hasNamedClassification(recipe, ["Low Sodium", "Lower Sodium"])
      );
    case "freezer-friendly":
      return (
        recipe?.freezerFriendly === true ||
        hasNamedClassification(recipe, [
          "Freezer Friendly",
          "Freezer-Friendly Meals",
          "Quick & Easy Freezer Meals",
        ])
      );
    case "meal-prep-friendly":
      return (
        recipe?.mealPrepFriendly === true ||
        hasNamedClassification(recipe, [
          "Make Ahead",
          "Make-Ahead Meals",
          "Meal Prep Friendly",
          "Salad Jars",
        ])
      );
    default:
      return true;
  }
}

export function recipeMatchesAllGLP1Filters(recipe, selectedFilterIds = []) {
  return selectedFilterIds.every((filterId) =>
    glp1RecipeMatchesFilter(recipe, filterId)
  );
}

export function getGLP1CollectionPreset(presetId) {
  return (
    GLP1_RECIPE_COLLECTION_PRESETS.find((preset) => preset.id === presetId) ||
    null
  );
}

function inferredRecipeType(recipe) {
  const code = String(recipe?.categoryCode || recipe?.id || "")
    .split("-")[0]
    .toUpperCase();
  const text = recipeSearchText(recipe);

  if (/\b(breakfast|brunch|muffin|oatmeal|pancake|waffle|egg)\b/.test(text)) {
    return "breakfast";
  }
  if (/\b(snack|bite|dip|spread)\b/.test(text)) return "snack";
  if (["SD", "SB", "LF", "DS", "CC", "CO", "DN", "JJ", "PM"].includes(code)) {
    return "other";
  }
  return "main";
}

export function recipeMatchesGLP1Preset(recipe, presetId) {
  if (!presetId) return true;
  const preset = getGLP1CollectionPreset(presetId);
  if (!preset) return true;

  if (!recipeMatchesAllGLP1Filters(recipe, preset.filters || [])) return false;

  if (
    preset.recipeTypes?.length &&
    !preset.recipeTypes.includes(inferredRecipeType(recipe))
  ) {
    return false;
  }

  if (
    preset.collections?.length &&
    !preset.collections.some((collection) =>
      normalizedStrings(recipe?.collections).includes(collection.toLowerCase())
    )
  ) {
    return false;
  }

  if (preset.keywords?.length) {
    const text = recipeSearchText(recipe);
    if (!preset.keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
      return false;
    }
  }

  return true;
}
