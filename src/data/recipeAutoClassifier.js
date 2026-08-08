import {
  COOKING_METHODS,
  RECIPE_ATTRIBUTES,
  RECIPE_COLLECTIONS,
  normalizeRecipeClassification,
} from "./recipeClassifications.js";

const unique = (values = []) => [...new Set(values.filter(Boolean))];

function recipeText(recipe) {
  return [
    recipe?.id,
    recipe?.title,
    recipe?.category,
    ...(recipe?.ingredients || []).map((item) => item?.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hasAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function addSuggestion(list, value, confidence, reason) {
  if (!value || list.some((item) => item.value === value)) return;
  list.push({ value, confidence, reason });
}

function suggestAttributes(recipe, text) {
  const suggestions = [];
  const code = recipe.categoryCode;

  const proteinRules = [
    ["Beef", ["beef", "steak", "hamburger", "meatloaf", "meatball", "pot roast", "brisket", "sirloin", "cheeseburger", "burger"]],
    ["Chicken", ["chicken"]],
    ["Pork", ["pork", "ham ", "sausage", "bacon", "ribs"]],
    ["Seafood", ["shrimp", "salmon", "tilapia", "catfish", "tuna", "crab", "fish", "seafood", "scallop"]],
    ["Turkey", ["turkey"]],
  ];

  for (const [value, terms] of proteinRules) {
    if (hasAny(text, terms)) {
      addSuggestion(
        suggestions,
        value,
        "high",
        `Title or ingredient data indicates ${value.toLowerCase()}.`
      );
    }
  }

  if (code === "SF") addSuggestion(suggestions, "Seafood", "high", "Seafood recipe category.");
  if (code === "SD") addSuggestion(suggestions, "Side Dish", "high", "Side Dishes category.");
  if (["CC", "CO", "CR", "DN", "DS"].includes(code)) {
    addSuggestion(suggestions, "Dessert", "high", "Dessert recipe category.");
  }
  if (["AM", "AS", "CS", "HB", "HBP", "IT", "MX", "SF", "SG"].includes(code)) {
    addSuggestion(suggestions, "Dinner", "high", "Main-dish recipe category.");
  }
  if (code === "PM") {
    addSuggestion(suggestions, "Higher Protein", "high", "Protein Muffins category.");
    addSuggestion(suggestions, "Breakfast", "medium", "Protein muffins commonly support breakfast or snacks.");
  }
  if (code === "SB") {
    addSuggestion(suggestions, "Lunch", "medium", "Salad and bowl recipes commonly support lunch.");
  }
  if (recipe.servings === 2) {
    addSuggestion(suggestions, "Serves Two", "high", "Stored recipe serving count is 2.");
  }
  if (hasAny(text, ["freezer", "freeze", "make ahead"])) {
    addSuggestion(suggestions, "Freezer Friendly", "medium", "Recipe data indicates freezer or make-ahead use.");
  }

  return suggestions.filter((item) => RECIPE_ATTRIBUTES.includes(item.value));
}

function suggestMethods(recipe, text) {
  const suggestions = [];
  const rules = [
    ["Slow Cooker", ["slow cooker", "crockpot", "crock pot"]],
    ["Air Fryer", ["air fryer", "air-fried", "air fried"]],
    ["Microwave", ["microwave"]],
    ["Pellet Smoker", ["smoked", "smoker", "pellet"]],
    ["Gas Grill", ["grilled", "grill "]],
    ["Stovetop", ["skillet", "stovetop", "pan fried", "pan-fried", "fried rice", "stir fry", "stir-fry"]],
    ["Oven", ["baked", "bake", "casserole", "roast", "roasted", "ziti", "lasagna", "pot pie", "cobbler", "cheesecake"]],
    ["No Cook", ["no cook", "no-cook"]],
    ["Bread Machine", ["bread machine"]],
    ["Pressure Cooker", ["pressure cooker", "instant pot"]],
  ];

  for (const [value, terms] of rules) {
    if (hasAny(text, terms)) {
      addSuggestion(suggestions, value, "high", `Recipe name or stored data indicates ${value}.`);
    }
  }

  if (["CC", "CO", "CR", "CS", "DN", "QP"].includes(recipe.categoryCode)) {
    addSuggestion(suggestions, "Oven", "medium", `${recipe.category} normally uses the oven; review exceptions.`);
  }
  if (recipe.categoryCode === "LF") {
    addSuggestion(suggestions, "Bread Machine", "medium", "Loafs & Rolls may use the site's bread-machine workflow.");
  }

  return suggestions.filter((item) => COOKING_METHODS.includes(item.value));
}

function suggestCollections(recipe, text, attributes, methods) {
  const suggestions = [];
  const attributeValues = new Set(attributes.map((item) => item.value));
  const methodValues = new Set(methods.map((item) => item.value));

  if (methodValues.has("Slow Cooker")) {
    addSuggestion(suggestions, "Slow Cooker Favorites", "high", "Slow Cooker cooking method.");
  }
  if (Number(recipe.time) <= 30) {
    addSuggestion(suggestions, "Easy 30-Minute Meals", "high", `Stored recipe time is ${recipe.time} minutes.`);
  }
  if (attributeValues.has("Freezer Friendly")) {
    addSuggestion(suggestions, "Freezer-Friendly Meals", "medium", "Freezer-friendly recipe attribute.");
  }
  if (recipe.servings === 2) {
    addSuggestion(suggestions, "Meals for Two", "high", "Stored serving count is 2.");
  }
  if (
    recipe.categoryCode === "SG" ||
    methodValues.has("Gas Grill") ||
    methodValues.has("Pellet Smoker") ||
    hasAny(text, ["bbq", "barbecue", "grilled"])
  ) {
    addSuggestion(suggestions, "Summer Cookouts", "medium", "Grill, smoker, or BBQ profile.");
  }
  if (
    ["AM", "CS"].includes(recipe.categoryCode) &&
    hasAny(text, [
      "meatloaf",
      "pot roast",
      "chicken and dumplings",
      "macaroni",
      "mac & cheese",
      "casserole",
      "gravy",
      "chicken fried",
      "country fried",
    ])
  ) {
    addSuggestion(suggestions, "Comfort Foods", "medium", "Classic comfort-food title or profile.");
  }
  if (hasAny(text, ["casserole", "lasagna", "bake", "baked ziti"])) {
    addSuggestion(suggestions, "Casseroles", "high", "Casserole or baked-dish title.");
    addSuggestion(suggestions, "Make-Ahead Meals", "medium", "Casserole or bake profile commonly supports make-ahead preparation.");
  }
  if (recipe.categoryCode === "SB" && text.includes("jar")) {
    addSuggestion(suggestions, "Salad Jars", "high", "Salad jar title or category.");
    addSuggestion(suggestions, "Make-Ahead Meals", "medium", "Salad jars are designed for advance preparation.");
  }

  return suggestions.filter((item) => RECIPE_COLLECTIONS.includes(item.value));
}

export function classifyRecipe(recipe, saved = {}) {
  const current = normalizeRecipeClassification(recipe, saved);
  const text = recipeText(recipe);
  const attributes = suggestAttributes(recipe, text);
  const cookingMethods = suggestMethods(recipe, text);
  const collections = suggestCollections(recipe, text, attributes, cookingMethods);
  const allSuggestions = [...attributes, ...cookingMethods, ...collections];
  const high = allSuggestions.filter((item) => item.confidence === "high");
  const medium = allSuggestions.filter((item) => item.confidence === "medium");

  return {
    recipeId: recipe.id,
    title: recipe.title,
    current,
    proposed: {
      primaryCategory: current.primaryCategory || recipe.category || "",
      attributes,
      cookingMethods,
      collections,
    },
    confidence: high.length > 0 && medium.length <= 2 ? "high" : "review",
    counts: { high: high.length, medium: medium.length },
  };
}

function mergeSuggestions(existing, suggestions, allowedConfidence) {
  return unique([
    ...existing,
    ...suggestions
      .filter((item) => allowedConfidence.has(item.confidence))
      .map((item) => item.value),
  ]);
}

export function applyAutoClassification(
  recipe,
  saved = {},
  result,
  { includeMedium = false } = {}
) {
  const current = normalizeRecipeClassification(recipe, saved);
  const allowedConfidence = new Set(includeMedium ? ["high", "medium"] : ["high"]);

  return {
    ...current,
    primaryCategory: current.primaryCategory || recipe.category || "",
    collections: mergeSuggestions(current.collections, result.proposed.collections, allowedConfidence),
    attributes: mergeSuggestions(current.attributes, result.proposed.attributes, allowedConfidence),
    cookingMethods: mergeSuggestions(current.cookingMethods, result.proposed.cookingMethods, allowedConfidence),
  };
}

export function classifyRecipeLibrary(recipes = [], classifications = {}) {
  const results = recipes.map((recipe) => classifyRecipe(recipe, classifications[recipe.id]));
  return {
    results,
    highConfidence: results.filter((result) => result.confidence === "high"),
    needsReview: results.filter((result) => result.confidence !== "high"),
  };
}
