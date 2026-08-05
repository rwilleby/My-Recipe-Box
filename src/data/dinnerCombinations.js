import { recipes } from "./recipes.js";
import { completeDinners } from "./completeDinners.js";
import { adaptCompleteDinnersForLegacyUi } from "../utils/completeDinnerAdapter.js";

export const DINNER_PROTEIN_FILTERS = [
  "chicken",
  "beef",
  "pork",
  "turkey",
  "seafood",
  "vegetarian",
];

export const DINNER_SIDE_FILTERS = [
  "rice",
  "potatoes",
  "pasta",
  "vegetables",
  "beans",
  "bread",
];

// Compatibility export: the existing UI continues to consume the legacy meal
// shape while RFIS remains the authoritative Complete Dinner data source.
export const dinnerCombinations = adaptCompleteDinnersForLegacyUi(completeDinners, recipes);

export function getDinnerCombinationSearchText(meal = {}) {
  return [
    meal.id,
    meal.rfisId,
    meal.number,
    meal.title,
    meal.subtitle,
    meal.mainDish,
    meal.cuisine,
    meal.freshCompanion,
    meal.optionalBread,
    meal.garnish,
    ...(meal.collections || []),
    ...(meal.sides || []).flatMap((side) => [side.name, side.serving, side.recipeId]),
    ...(meal.tags || []),
  ].filter(Boolean).join(" ").toLowerCase();
}
