import { normalizeGLP1Classification } from "./glp1Nutrition.js";
import recipeClassificationDefaults from "./recipeClassifications.default.js";

// src/data/recipeClassifications.js
// Robert's Recipe Box — recipe classification system
//
// This file supplies the permanent classification vocabulary, default recipe
// classifications, and safe helpers. Existing recipes continue to work even
// before classifications are assigned.

export const RECIPE_COLLECTIONS = [
  "Slow Cooker Favorites",
  "Summer Cookouts",
  "Healthy Dinners",
  "Comfort Foods",
  "Casseroles",
  "Salad Jars",
  "Easy 30-Minute Meals",
  "Sunday Meals",
  "Complete Dinners",
  "Freezer-Friendly Meals",
  "Meals for Two",
  "Make-Ahead Meals",
];

export const RECIPE_ATTRIBUTES = [
  "Beef",
  "Chicken",
  "Pork",
  "Seafood",
  "Turkey",
  "Vegetarian",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Side Dish",
  "Dessert",
  "Lower Carb",
  "Lower Calorie",
  "Higher Protein",
  "Family Favorite",
  "Kid Friendly",
  "Freezer Friendly",
  "Make Ahead",
  "Serves Two",
];

export const COOKING_METHODS = [
  "Air Fryer",
  "Slow Cooker",
  "Oven",
  "Microwave",
  "Gas Grill",
  "Pellet Smoker",
  "Stovetop",
  "No Cook",
  "Bread Machine",
  "Pressure Cooker",
];

export const CLASSIFICATION_STORAGE_KEY = "rrb_admin_recipe_classifications";

export const DEFAULT_RECIPE_CLASSIFICATIONS = recipeClassificationDefaults;

export function emptyRecipeClassification(recipe) {
  return {
    primaryCategory: recipe?.category || "",
    collections: [],
    attributes: [],
    cookingMethods: [],
  };
}

export function normalizeRecipeClassification(recipe, saved = {}) {
  const baseClassification = {
    primaryCategory:
      saved.primaryCategory ||
      recipe.primaryCategory ||
      recipe.category ||
      "",
    collections: uniqueStrings(saved.collections ?? recipe.collections),
    attributes: uniqueStrings(saved.attributes ?? recipe.attributes),
    cookingMethods: uniqueStrings(
      saved.cookingMethods ?? recipe.cookingMethods
    ),
  };

  return {
    ...baseClassification,
    ...normalizeGLP1Classification({
      ...recipe,
      ...saved,
    }),
  };
}

export function mergeRecipeClassifications(recipes, classifications = {}) {
  const mergedClassifications = {
    ...DEFAULT_RECIPE_CLASSIFICATIONS,
    ...classifications,
  };

  return recipes.map((recipe) => ({
    ...recipe,
    ...normalizeRecipeClassification(recipe, mergedClassifications[recipe.id]),
  }));
}

export function loadRecipeClassifications() {
  try {
    const saved = window.localStorage.getItem(CLASSIFICATION_STORAGE_KEY);
    const savedClassifications = saved ? JSON.parse(saved) : {};

    return {
      ...DEFAULT_RECIPE_CLASSIFICATIONS,
      ...savedClassifications,
    };
  } catch {
    return { ...DEFAULT_RECIPE_CLASSIFICATIONS };
  }
}

export function saveRecipeClassifications(classifications) {
  window.localStorage.setItem(
    CLASSIFICATION_STORAGE_KEY,
    JSON.stringify(classifications)
  );
}


export function validateRecipeClassificationImport(imported, recipes = []) {
  const errors = [];
  const warnings = [];
  const accepted = {};
  const recipeIds = new Set(
    Array.isArray(recipes) ? recipes.map((recipe) => recipe.id) : []
  );

  if (!imported || typeof imported !== "object" || Array.isArray(imported)) {
    return {
      ok: false,
      accepted: {},
      errors: ["The selected file is not a recipe-classification object."],
      warnings: [],
    };
  }

  Object.entries(imported).forEach(([recipeId, record]) => {
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      errors.push(`${recipeId}: classification record must be an object.`);
      return;
    }

    if (recipeIds.size && !recipeIds.has(recipeId)) {
      warnings.push(`${recipeId}: recipe code is not in the current recipe library.`);
    }

    const unknownCollections = uniqueStrings(record.collections).filter(
      (value) => !RECIPE_COLLECTIONS.includes(value)
    );
    const unknownAttributes = uniqueStrings(record.attributes).filter(
      (value) => !RECIPE_ATTRIBUTES.includes(value)
    );
    const unknownMethods = uniqueStrings(record.cookingMethods).filter(
      (value) => !COOKING_METHODS.includes(value)
    );

    if (unknownCollections.length) {
      errors.push(`${recipeId}: unknown collection(s): ${unknownCollections.join(", ")}.`);
    }
    if (unknownAttributes.length) {
      errors.push(`${recipeId}: unknown attribute(s): ${unknownAttributes.join(", ")}.`);
    }
    if (unknownMethods.length) {
      errors.push(`${recipeId}: unknown cooking method(s): ${unknownMethods.join(", ")}.`);
    }

    if (
      !unknownCollections.length &&
      !unknownAttributes.length &&
      !unknownMethods.length
    ) {
      accepted[recipeId] = {
        ...record,
        collections: uniqueStrings(record.collections),
        attributes: uniqueStrings(record.attributes),
        cookingMethods: uniqueStrings(record.cookingMethods),
      };
    }
  });

  return {
    ok: errors.length === 0,
    accepted,
    errors,
    warnings,
  };
}

export function mergeRecipeClassificationImport(
  current = {},
  imported = {},
  recipes = []
) {
  const validation = validateRecipeClassificationImport(imported, recipes);
  if (!validation.ok) return validation;

  return {
    ...validation,
    merged: {
      ...DEFAULT_RECIPE_CLASSIFICATIONS,
      ...current,
      ...validation.accepted,
    },
  };
}

export function recipeMatchesCollection(recipe, collectionName) {
  return Array.isArray(recipe.collections) &&
    recipe.collections.includes(collectionName);
}

export function recipeMatchesAttribute(recipe, attributeName) {
  return Array.isArray(recipe.attributes) &&
    recipe.attributes.includes(attributeName);
}

export function recipeMatchesCookingMethod(recipe, methodName) {
  return Array.isArray(recipe.cookingMethods) &&
    recipe.cookingMethods.includes(methodName);
}

export function filterRecipesByClassification(
  recipes,
  { collection = "", attribute = "", cookingMethod = "" } = {}
) {
  return recipes.filter((recipe) => {
    const matchesCollection =
      !collection || recipeMatchesCollection(recipe, collection);
    const matchesAttribute =
      !attribute || recipeMatchesAttribute(recipe, attribute);
    const matchesMethod =
      !cookingMethod || recipeMatchesCookingMethod(recipe, cookingMethod);

    return matchesCollection && matchesAttribute && matchesMethod;
  });
}

function uniqueStrings(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item) => typeof item === "string" && item))];
}
