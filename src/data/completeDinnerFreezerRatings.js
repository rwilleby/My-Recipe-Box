// Complete Dinners approved for the site's strongest whole-meal freezer-friendly label.
// Keep this list separate from meals whose entree freezes well but whose sides do not.
export const FREEZER_FRIENDLY_COMPLETE_DINNER_NUMBERS = Object.freeze([
  1, 4, 5, 7, 8, 12, 14, 16, 18, 23, 25, 26, 31, 32, 38, 40, 41, 43,
  59, 60, 61, 64, 65, 69, 70, 71, 72, 76, 77, 78, 79, 80, 87, 88, 89,
  90, 129, 130, 131, 142, 143, 149, 150,
]);

const FREEZER_FRIENDLY_COMPLETE_DINNER_SET = new Set(
  FREEZER_FRIENDLY_COMPLETE_DINNER_NUMBERS,
);

export function isFreezerFriendlyCompleteDinner(mealOrNumber) {
  const number =
    typeof mealOrNumber === "object" && mealOrNumber !== null
      ? mealOrNumber.number
      : mealOrNumber;

  return FREEZER_FRIENDLY_COMPLETE_DINNER_SET.has(Number(number));
}
