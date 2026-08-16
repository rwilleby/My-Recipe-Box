export const HOME_COMBO_MEAL_COUNT = 6;
export const HOME_COMBO_CUISINE_ORDER = ["AM", "AS", "HB", "IT", "MX", "SG"];

export const HOME_COMBO_APPROVED_MEAL_NUMBERS = {
  AM: [95, 94, 93, 89],
  AS: [44, 45, 82, 92],
  HB: [102, 23, 24, 22],
  IT: [27, 28, 65, 70],
  MX: [41, 75, 77, 72],
  SG: [32, 39, 42, 62],
};

export function getComboCuisineKey(meal) {
  const recipeCode = String(meal?.mainRecipeId || "").trim().toUpperCase();
  const prefix = recipeCode.match(/^([A-Z]{2,3})-/)?.[1] || "";
  const searchable = `${meal?.title || ""} ${meal?.mainDish || ""} ${meal?.subtitle || ""}`.toLowerCase();

  if (prefix === "AM") return "AM";
  if (prefix === "AS" || /asian|teriyaki|stir[- ]?fry|lo mein|fried rice|orange chicken/.test(searchable)) return "AS";
  if (["HB", "HBP"].includes(prefix) || /hamburger|burger|cheeseburger|patty melt/.test(searchable)) return "HB";
  if (prefix === "IT" || /italian|alfredo|pasta|lasagna|parmesan|marinara|spaghetti/.test(searchable)) return "IT";
  if (prefix === "MX" || /mexican|taco|enchilada|fajita|burrito|quesadilla|tamale/.test(searchable)) return "MX";
  if (["SG", "SF"].includes(prefix) || /seafood|fish|shrimp|salmon|tuna|cod|tilapia|crab/.test(searchable)) return "SG";
  return "OTHER";
}

export function comboMealNumber(meal) {
  const directNumber = Number(meal?.number);
  if (Number.isFinite(directNumber)) return directNumber;

  const idMatch = String(meal?.id || "").match(/(\d+)/);
  return idMatch ? Number(idMatch[1]) : null;
}

export function hasQuickDinnerHero(meal) {
  return meal?.heroAvailable === true && Boolean(String(meal?.image || "").trim());
}

function nextUnusedHomeComboMeal(pool, currentMeal, usedMealIds) {
  const available = pool.filter((meal) => meal && !usedMealIds.has(meal.id));
  if (!available.length) return null;

  const currentIndex = pool.findIndex((meal) => meal?.id === currentMeal?.id);
  if (currentIndex < 0) return available[0];

  for (let offset = 1; offset <= pool.length; offset += 1) {
    const candidate = pool[(currentIndex + offset) % pool.length];
    if (candidate && !usedMealIds.has(candidate.id)) return candidate;
  }

  return available[0];
}

export function selectVariedHomeComboMeals(allMeals, currentMeals = []) {
  const eligibleMeals = allMeals.filter(hasQuickDinnerHero);
  const mealsByNumber = new Map(
    eligibleMeals
      .map((meal) => [comboMealNumber(meal), meal])
      .filter(([mealNumber]) => Number.isFinite(mealNumber))
  );
  const selectedMeals = Array(HOME_COMBO_MEAL_COUNT).fill(null);
  const usedMealIds = new Set();

  HOME_COMBO_CUISINE_ORDER.forEach((cuisineKey, position) => {
    const approvedNumbers = HOME_COMBO_APPROVED_MEAL_NUMBERS[cuisineKey] || [];
    const approvedMeals = approvedNumbers
      .map((mealNumber) => mealsByNumber.get(mealNumber))
      .filter((meal) => meal && getComboCuisineKey(meal) === cuisineKey);
    const cuisineMeals = eligibleMeals.filter(
      (meal) => getComboCuisineKey(meal) === cuisineKey
    );
    const candidatePool = approvedMeals.length ? approvedMeals : cuisineMeals;
    const candidate = nextUnusedHomeComboMeal(
      candidatePool,
      currentMeals[position],
      usedMealIds
    );

    if (candidate) {
      selectedMeals[position] = candidate;
      usedMealIds.add(candidate.id);
    }
  });

  selectedMeals.forEach((selectedMeal, fallbackPosition) => {
    if (selectedMeal || usedMealIds.size >= eligibleMeals.length) return;
    const candidate = nextUnusedHomeComboMeal(
      eligibleMeals,
      currentMeals[fallbackPosition],
      usedMealIds
    );
    if (!candidate) return;
    selectedMeals[fallbackPosition] = candidate;
    usedMealIds.add(candidate.id);
  });

  return selectedMeals.filter(Boolean);
}
