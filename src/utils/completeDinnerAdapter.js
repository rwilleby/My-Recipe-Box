import { getRecipeNutritionVariant } from "../data/recipeNutritionProfiles.js";

const DEFAULT_FREEZER_LIFE = "Best quality within 3 months of the freeze date.";
const DEFAULT_OVEN = "Remove the lid, cover with foil, and heat at 350°F until the center reaches 165°F. Re-crisp separately packaged fried items in an air fryer or oven.";
const DEFAULT_MICROWAVE = "Thaw overnight when possible. Transfer to a microwave-safe dish and heat in short intervals until the center reaches 165°F, stirring or rotating the sides as needed.";

const PROTEIN_TAGS = [
  ["chicken", ["chicken"]],
  ["beef", ["beef", "steak", "brisket", "meatloaf", "hamburger", "barbacoa", "roast"]],
  ["pork", ["pork", "ham", "bacon", "sausage", "carnitas"]],
  ["turkey", ["turkey"]],
  ["seafood", ["shrimp", "salmon", "tilapia", "fish", "crab", "crawfish", "seafood"]],
  ["vegetarian", ["eggplant", "vegetarian"]],
];

const SIDE_TAGS = [
  ["rice", ["rice"]],
  ["potatoes", ["potato", "fries", "tater", "hashbrown"]],
  ["pasta", ["pasta", "noodle", "spaghetti", "macaroni", "alfredo"]],
  ["vegetables", ["bean", "broccoli", "corn", "carrot", "asparagus", "zucchini", "cabbage", "vegetable", "sprouts"]],
  ["beans", ["bean"]],
  ["bread", ["bread", "stuffing", "roll", "tortilla"]],
];

function parseNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const match = String(value).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function roundNutrient(value) {
  if (value === null || !Number.isFinite(value)) return null;
  return Math.round(value * 10) / 10;
}

function sumNutrition(recipeIds) {
  const facts = recipeIds
    .map((recipeId) => getRecipeNutritionVariant(recipeId)?.profile?.nutritionFacts)
    .filter(Boolean);

  if (!facts.length) return {};

  const fields = {
    calories: "calories",
    protein: "protein",
    carbs: "totalCarbohydrate",
    fat: "totalFat",
    fiber: "dietaryFiber",
    sodium: "sodium",
    saturatedFat: "saturatedFat",
    totalSugars: "totalSugars",
    addedSugars: "addedSugars",
    cholesterol: "cholesterol",
  };

  return Object.fromEntries(
    Object.entries(fields).map(([outputKey, sourceKey]) => {
      const values = facts.map((item) => parseNumber(item[sourceKey])).filter((value) => value !== null);
      return [outputKey, values.length ? roundNutrient(values.reduce((sum, value) => sum + value, 0)) : null];
    })
  );
}

function inferTags(dinner, recipeMap) {
  const recipeIds = [dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])];
  const text = [
    dinner.title,
    dinner.cuisine,
    ...(dinner.collections || []),
    ...recipeIds.map((id) => recipeMap.get(id)?.title || ""),
  ].join(" ").toLowerCase();

  const tags = new Set(["complete dinner", "dinner combination", "freezer meal"]);
  PROTEIN_TAGS.forEach(([tag, terms]) => {
    if (terms.some((term) => text.includes(term))) tags.add(tag);
  });
  SIDE_TAGS.forEach(([tag, terms]) => {
    if (terms.some((term) => text.includes(term))) tags.add(tag);
  });
  if (dinner.cuisine) tags.add(String(dinner.cuisine).toLowerCase());
  return [...tags];
}

function aggregateMealBalance(recipeIds, recipeMap) {
  const scores = recipeIds
    .map((id) => Number(recipeMap.get(id)?.mealBalance?.score))
    .filter((score) => Number.isFinite(score) && score >= 1 && score <= 10);
  if (!scores.length) return { score: null, label: "Not yet assigned", status: "estimated" };

  const score = Math.max(1, Math.min(10, Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length)));
  const label = score <= 2 ? "Very Light" : score <= 4 ? "Balanced" : score <= 6 ? "Moderate" : score <= 8 ? "Rich" : "Indulgent";
  return { score, label, status: "estimated" };
}

function servingLabel(recipe, isMain) {
  if (!recipe) return isMain ? "1 serving" : "1/2 to 3/4 cup";
  if (isMain) return "1 serving";
  return "1 standard serving";
}

export function adaptCompleteDinnerForLegacyUi(dinner, recipes = []) {
  const recipeMap = new Map((recipes || []).map((recipe) => [recipe.id, recipe]));
  const entree = recipeMap.get(dinner.entreeRecipeId);
  const sides = (dinner.sideRecipeIds || []).map((recipeId) => recipeMap.get(recipeId)).filter(Boolean);
  const allRecipeIds = [dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])];
  const nutrition = sumNutrition(allRecipeIds);
  const sideNames = sides.map((side) => side.title);

  return {
    id: dinner.legacyId,
    rfisId: dinner.id,
    number: dinner.number,
    // Do not expose a hero path until the replacement image has been formally approved.
    // This prevents legacy MEAL-### files from appearing against newly rebuilt dinners.
    heroAvailable: ["approved", "published"].includes(String(dinner.hero?.status || "").toLowerCase()),
    image: ["approved", "published"].includes(String(dinner.hero?.status || "").toLowerCase())
      ? (dinner.hero?.image || `images/dinner-combinations/MEAL-${String(dinner.number).padStart(3, "0")}.webp`)
      : "",
    thumbnail: ["approved", "published"].includes(String(dinner.hero?.status || "").toLowerCase())
      ? (dinner.hero?.thumbnail || "")
      : "",
    title: entree?.title || dinner.title.replace(/\s+Complete Dinner$/i, ""),
    subtitle: sideNames.length ? `With ${sideNames.join(" & ")}` : "Complete Dinner",
    mainDish: entree?.title || dinner.title,
    mainServing: servingLabel(entree, true),
    mainRecipeId: dinner.entreeRecipeId,
    sides: sides.map((side) => ({
      name: side.title,
      serving: servingLabel(side, false),
      recipeId: side.id,
    })),
    ...nutrition,
    sugars: nutrition.totalSugars,
    mealBalance: aggregateMealBalance(allRecipeIds, recipeMap),
    freezerLife: DEFAULT_FREEZER_LIFE,
    ovenInstructions: DEFAULT_OVEN,
    microwaveInstructions: DEFAULT_MICROWAVE,
    freshCompanion: dinner.freshCompanion || "",
    optionalBread: dinner.optionalBread || "",
    garnish: dinner.garnish || "",
    cuisine: dinner.cuisine || "",
    collections: dinner.collections || [],
    tags: inferTags(dinner, recipeMap),
    heroLayout: dinner.hero?.layout || "two-side",
    heroStatus: dinner.hero?.status || "not-started",
    rfisVersion: dinner.version,
    rfisNotes: dinner.notes || "",
  };
}

export function adaptCompleteDinnersForLegacyUi(completeDinners, recipes = []) {
  return (completeDinners || [])
    .map((dinner) => adaptCompleteDinnerForLegacyUi(dinner, recipes))
    .sort((a, b) => Number(a.number) - Number(b.number));
}
