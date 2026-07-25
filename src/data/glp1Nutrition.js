// Robert's Recipe Box — GLP-1 Nutrition Support foundation
// Phase 1 foundation only. No medical claims are created automatically.
// Ratings and scores remain absent until nutrition data has been reviewed.

export const GLP1_RATINGS = Object.freeze([
  "Excellent",
  "Good",
  "Occasional",
  "Use Caution",
]);

export const GLP1_LEVELS = Object.freeze(["High", "Moderate", "Low"]);
export const GLP1_REVIEW_STATUSES = Object.freeze([
  "Not Reviewed",
  "Provisional",
  "Verified",
]);

export const GLP1_OPTIONAL_FIELDS = Object.freeze([
  "glp1Friendly",
  "glp1Rating",
  "glp1Score",
  "proteinLevel",
  "fiberLevel",
  "easyDigestion",
  "smallPortionFriendly",
  "doseIncreaseFriendly",
  "proteinFirst",
  "hydrationSupport",
  "nutrientDense",
  "addedSugarLevel",
  "satietyLevel",
  "glp1Notes",
  "suggestedGlp1ServingSize",
  "smallerServingProteinGrams",
  "smallerServingFiberGrams",
  "smallerServingCalories",
  "glp1ReviewStatus",
  "glp1ReviewedDate",
  "glp1DataSource",
]);

export const GLP1_SCORE_REQUIRED_NUTRITION_FIELDS = Object.freeze([
  "caloriesPerServing",
  "proteinGramsPerServing",
  "fiberGramsPerServing",
  "addedSugarGramsPerServing",
  "saturatedFatGramsPerServing",
]);

// Centralized, provisional weights. These can be revised later without
// editing recipe records. A score is never returned unless the required
// nutrition fields are present and finite.
export const GLP1_SCORE_CONFIG = Object.freeze({
  version: "phase-1-provisional-2026-07",
  weights: Object.freeze({
    proteinDensity: 0.24,
    fiber: 0.16,
    addedSugar: 0.12,
    saturatedFat: 0.10,
    calorieDensity: 0.08,
    nutrientDensity: 0.12,
    portionSuitability: 0.08,
    easeOfDigestion: 0.04,
    mealBalance: 0.06,
  }),
  notes:
    "The provisional score rewards nutrition quality in a practical serving. It does not reward a recipe merely for being extremely low in calories.",
});

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function optionalBoolean(value) {
  return typeof value === "boolean" ? value : undefined;
}

function optionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalEnum(value, allowed) {
  return allowed.includes(value) ? value : undefined;
}

function optionalNonNegativeNumber(value) {
  return isFiniteNumber(value) && value >= 0 ? value : undefined;
}

function assignIfDefined(target, key, value) {
  if (value !== undefined) target[key] = value;
}

export function normalizeGLP1Classification(source = {}) {
  const input = isObject(source) ? source : {};
  const normalized = {};

  assignIfDefined(normalized, "glp1Friendly", optionalBoolean(input.glp1Friendly));
  assignIfDefined(normalized, "glp1Rating", optionalEnum(input.glp1Rating, GLP1_RATINGS));

  const score = optionalNonNegativeNumber(input.glp1Score);
  if (score !== undefined && score <= 10) normalized.glp1Score = score;

  assignIfDefined(normalized, "proteinLevel", optionalEnum(input.proteinLevel, GLP1_LEVELS));
  assignIfDefined(normalized, "fiberLevel", optionalEnum(input.fiberLevel, GLP1_LEVELS));
  assignIfDefined(normalized, "easyDigestion", optionalBoolean(input.easyDigestion));
  assignIfDefined(normalized, "smallPortionFriendly", optionalBoolean(input.smallPortionFriendly));
  assignIfDefined(normalized, "doseIncreaseFriendly", optionalBoolean(input.doseIncreaseFriendly));
  assignIfDefined(normalized, "proteinFirst", optionalBoolean(input.proteinFirst));
  assignIfDefined(normalized, "hydrationSupport", optionalBoolean(input.hydrationSupport));
  assignIfDefined(normalized, "nutrientDense", optionalBoolean(input.nutrientDense));
  assignIfDefined(normalized, "addedSugarLevel", optionalEnum(input.addedSugarLevel, GLP1_LEVELS));
  assignIfDefined(normalized, "satietyLevel", optionalEnum(input.satietyLevel, GLP1_LEVELS));
  assignIfDefined(normalized, "glp1Notes", optionalString(input.glp1Notes));
  assignIfDefined(normalized, "suggestedGlp1ServingSize", optionalString(input.suggestedGlp1ServingSize));
  assignIfDefined(normalized, "smallerServingProteinGrams", optionalNonNegativeNumber(input.smallerServingProteinGrams));
  assignIfDefined(normalized, "smallerServingFiberGrams", optionalNonNegativeNumber(input.smallerServingFiberGrams));
  assignIfDefined(normalized, "smallerServingCalories", optionalNonNegativeNumber(input.smallerServingCalories));

  normalized.glp1ReviewStatus =
    optionalEnum(input.glp1ReviewStatus, GLP1_REVIEW_STATUSES) || "Not Reviewed";

  assignIfDefined(normalized, "glp1ReviewedDate", optionalString(input.glp1ReviewedDate));
  assignIfDefined(normalized, "glp1DataSource", optionalString(input.glp1DataSource));

  // Never retain a displayed rating or score on an unreviewed record.
  if (normalized.glp1ReviewStatus === "Not Reviewed") {
    delete normalized.glp1Rating;
    delete normalized.glp1Score;
    delete normalized.glp1Friendly;
  }

  return normalized;
}

export function hasRequiredGLP1Nutrition(nutrition = {}) {
  if (!isObject(nutrition)) return false;
  return GLP1_SCORE_REQUIRED_NUTRITION_FIELDS.every((field) =>
    isFiniteNumber(nutrition[field])
  );
}

export function calculateProvisionalGLP1Score({ nutrition, indicators = {} } = {}) {
  if (!hasRequiredGLP1Nutrition(nutrition)) return null;

  const calories = Math.max(1, nutrition.caloriesPerServing);
  const proteinDensity = Math.min(10, (nutrition.proteinGramsPerServing / calories) * 200);
  const fiber = Math.min(10, nutrition.fiberGramsPerServing * 1.5);
  const addedSugar = Math.max(0, 10 - nutrition.addedSugarGramsPerServing * 1.2);
  const saturatedFat = Math.max(0, 10 - nutrition.saturatedFatGramsPerServing * 1.1);

  // Calorie density is intentionally a small factor and is capped so the
  // formula does not reward nutritionally incomplete low-calorie recipes.
  const calorieDensity = Math.max(0, Math.min(10, 10 - Math.max(0, calories - 500) / 75));
  const nutrientDensity = indicators.nutrientDense === true ? 10 : indicators.nutrientDense === false ? 3 : 5;
  const portionSuitability = indicators.smallPortionFriendly === true ? 10 : indicators.smallPortionFriendly === false ? 3 : 5;
  const easeOfDigestion = indicators.easyDigestion === true ? 10 : indicators.easyDigestion === false ? 3 : 5;
  const mealBalance = isFiniteNumber(indicators.mealBalanceScore)
    ? Math.max(0, Math.min(10, indicators.mealBalanceScore))
    : 5;

  const factors = {
    proteinDensity,
    fiber,
    addedSugar,
    saturatedFat,
    calorieDensity,
    nutrientDensity,
    portionSuitability,
    easeOfDigestion,
    mealBalance,
  };

  const weighted = Object.entries(GLP1_SCORE_CONFIG.weights).reduce(
    (total, [key, weight]) => total + factors[key] * weight,
    0
  );

  return Math.round(Math.max(0, Math.min(10, weighted)) * 10) / 10;
}

export function canDisplayGLP1Rating(record = {}) {
  const normalized = normalizeGLP1Classification(record);
  return (
    normalized.glp1ReviewStatus !== "Not Reviewed" &&
    typeof normalized.glp1Rating === "string" &&
    isFiniteNumber(normalized.glp1Score)
  );
}
