const RANGES = [
  { min: 1, max: 2, label: "Very Light" },
  { min: 3, max: 4, label: "Balanced" },
  { min: 5, max: 6, label: "Moderate" },
  { min: 7, max: 8, label: "Rich" },
  { min: 9, max: 10, label: "Indulgent" },
];

export const DIET_MEAL_BALANCE_BY_ID = Object.freeze({
  "DM-001": 3, "DM-002": 4, "DM-003": 4, "DM-004": 4, "DM-005": 5, "DM-006": 4, "DM-007": 4, "DM-008": 4, "DM-009": 4, "DM-010": 5,
  "DM-011": 3, "DM-012": 4, "DM-013": 3, "DM-014": 6, "DM-015": 5, "DM-016": 5, "DM-017": 4, "DM-018": 6, "DM-019": 4, "DM-020": 4,
  "DM-021": 6, "DM-022": 4, "DM-023": 6, "DM-024": 5, "DM-025": 4, "DM-026": 5, "DM-027": 6, "DM-028": 6, "DM-029": 6, "DM-030": 5,
  "DM-031": 5, "DM-032": 5, "DM-033": 5, "DM-034": 5, "DM-035": 5, "DM-036": 6, "DM-037": 5, "DM-038": 6, "DM-039": 6, "DM-040": 6,
  "DM-041": 6, "DM-042": 6, "DM-043": 5, "DM-044": 6, "DM-045": 6, "DM-046": 6, "DM-047": 5, "DM-048": 5, "DM-049": 5, "DM-050": 5,
  "DM-051": 4, "DM-052": 5, "DM-053": 5, "DM-054": 7, "DM-055": 6, "DM-056": 5, "DM-057": 5, "DM-058": 5, "DM-059": 7, "DM-060": 5,
});

function numberFrom(value) { return Number(String(value ?? "").replace(/[^0-9.]/g, "")) || 0; }

export function nutritionMealBalance(nutritionFacts) {
  const calories = numberFrom(nutritionFacts?.calories);
  if (!calories) return null;
  const totalFat = numberFrom(nutritionFacts?.totalFat);
  let score = calories <= 275 ? 3 : calories <= 349 ? 4 : calories <= 424 ? 5 : calories <= 499 ? 6 : 7;
  if (totalFat >= 15 && score < 7) score += 1;
  return { score, label: RANGES.find((range) => score >= range.min && score <= range.max)?.label || "Moderate", status: "nutrition-estimated" };
}

export function dietMealBalanceFor(recipeId) {
  const score = DIET_MEAL_BALANCE_BY_ID[recipeId];
  return score ? { score, label: RANGES.find((range) => score >= range.min && score <= range.max)?.label || "Moderate", status: "nutrition-estimated" } : null;
}
