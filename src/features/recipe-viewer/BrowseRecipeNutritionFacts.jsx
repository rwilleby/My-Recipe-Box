import { getRecipeNutritionVariant } from "../../data/recipeNutritionProfiles";
import { getCrockPotNutritionEstimate } from "../../utils/crockPotNutritionEstimate.js";

function formatNutritionValue(value, unit = "") {
  if (value === null || value === undefined || value === "") return "—";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "—";
    if (!unit || /[a-zA-Z%]/.test(trimmed)) return trimmed;
    return `${trimmed} ${unit}`;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const display = Number.isInteger(value) ? value : Math.round(value * 10) / 10;
    return unit ? `${display} ${unit}` : String(display);
  }

  return "—";
}

export default function BrowseRecipeNutritionFacts({ recipe }) {
  const nutrition =
    getRecipeNutritionVariant(recipe.id)?.profile?.nutritionFacts ||
    getCrockPotNutritionEstimate(recipe);
  const rows = [
    ["Total Fat", nutrition?.totalFat, "g", true],
    ["Saturated Fat", nutrition?.saturatedFat, "g", false],
    ["Trans Fat", nutrition?.transFat, "g", false],
    ["Cholesterol", nutrition?.cholesterol, "mg", false],
    ["Sodium", nutrition?.sodium, "mg", true],
    ["Total Carbs", nutrition?.totalCarbohydrate, "g", true],
    ["Dietary Fiber", nutrition?.dietaryFiber, "g", false],
    ["Total Sugars", nutrition?.totalSugars, "g", false],
    ["Added Sugars", nutrition?.addedSugars, "g", false],
  ];

  return (
    <aside className="browseRecipeNutritionFacts" aria-label={`${recipe.title} Nutrition Facts`}>
      <h3>Nutrition Facts</h3>
      <div className="browseNutritionHeavyRule" />
      <div className="browseNutritionServingRow">
        <span>Serving size</span>
        <strong>{nutrition?.servingSize || "1 serving"}</strong>
      </div>
      <div className="browseNutritionServingRow">
        <span>Servings per recipe</span>
        <strong>{nutrition?.servingsPerRecipe ?? recipe.servings ?? "—"}</strong>
      </div>
      <div className="browseNutritionHeavyRule browseNutritionHeavyRuleSmall" />
      <div className="browseNutritionCalories">
        <span>Calories</span>
        <strong>{formatNutritionValue(nutrition?.calories)}</strong>
      </div>
      <div className="browseNutritionMediumRule" />
      <div className="browseNutritionRows">
        {rows.map(([label, value, unit, bold]) => (
          <div key={label} className={`browseNutritionRow${bold ? " isBold" : ""}`}>
            <span>{label}</span>
            <strong>{formatNutritionValue(value, unit)}</strong>
          </div>
        ))}
      </div>
      <div className="browseNutritionHeavyRule browseNutritionProteinRule" />
      <div className="browseNutritionProtein">
        <span>Protein</span>
        <strong>{formatNutritionValue(nutrition?.protein, "g")}</strong>
      </div>
      {nutrition?.estimatedRange && (
        <p className="browseNutritionEstimateNote">{nutrition.estimateNote}</p>
      )}
    </aside>
  );
}
