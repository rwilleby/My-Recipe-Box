import { useEffect, useMemo, useState } from "react";
import { getRecipeNutritionRecord } from "../data/recipeNutritionProfiles";

function FactRow({ label, value, strong = false }) {
  return (
    <div className={strong ? "ficFactRow ficFactRowStrong" : "ficFactRow"}>
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
    </div>
  );
}

function ListSection({ title, items }) {
  return (
    <section className="ficSection">
      <h3>{title}</h3>
      <ul>{(items || []).map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

export default function FoodIntelligenceCard({ recipeCode }) {
  const record = useMemo(() => getRecipeNutritionRecord(recipeCode), [recipeCode]);
  const variantKeys = record ? Object.keys(record.variants || {}) : [];
  const [variantKey, setVariantKey] = useState(record?.defaultVariant || variantKeys[0] || "");

  useEffect(() => {
    setVariantKey(record?.defaultVariant || Object.keys(record?.variants || {})[0] || "");
  }, [record]);

  if (!record) {
    return (
      <div className="foodIntelligenceUnavailable">
        <strong>Food Intelligence is not available for this recipe yet.</strong>
        <span>No nutrition record is stored for {recipeCode}.</span>
      </div>
    );
  }

  const variant = record.variants[variantKey] || record.variants[record.defaultVariant];
  const facts = variant.nutritionFacts || {};
  const verified = record.status === "verified";

  return (
    <article className="foodIntelligenceCard" aria-label={`${record.title} Food Intelligence Card`}>
      <header className="ficHeader">
        <div>
          <span className="ficEyebrow">FOOD INTELLIGENCE CARD</span>
          <h2>{record.recipeCode} · {record.title}</h2>
          <p className={verified ? "ficStatus verified" : "ficStatus provisional"}>
            {verified ? "USDA Verified" : record.statusLabel || "Estimated nutritional information"}
          </p>
        </div>
        <label className="ficVariantControl">
          <span>Nutrition variant</span>
          <select value={variantKey} onChange={(event) => setVariantKey(event.target.value)}>
            {variantKeys.map((key) => <option value={key} key={key}>{record.variants[key].label}</option>)}
          </select>
        </label>
      </header>

      <div className="ficGrid">
        <section className="ficNutritionFacts">
          <h3>Nutrition Facts</h3>
          <div className="ficServingLine"><span>Serving size</span><strong>{facts.servingSize}</strong></div>
          <div className="ficServingLine"><span>Servings per recipe</span><strong>{facts.servingsPerRecipe}</strong></div>
          <FactRow label="Calories" value={facts.calories} strong />
          <FactRow label="Total Fat" value={facts.totalFat} />
          <FactRow label="Saturated Fat" value={facts.saturatedFat} />
          <FactRow label="Trans Fat" value={facts.transFat} />
          <FactRow label="Cholesterol" value={facts.cholesterol} />
          <FactRow label="Sodium" value={facts.sodium} />
          <FactRow label="Total Carbohydrate" value={facts.totalCarbohydrate} />
          <FactRow label="Dietary Fiber" value={facts.dietaryFiber} />
          <FactRow label="Total Sugars" value={facts.totalSugars} />
          <FactRow label="Includes Added Sugars" value={facts.addedSugars} />
          <FactRow label="Protein" value={facts.protein} strong />
        </section>

        <div className="ficContentColumns">
          <section className="ficMealBalance">
            <h3>MealBalance</h3>
            <strong>{variant.mealBalance?.score}</strong>
            <span>{variant.mealBalance?.label}</span>
          </section>
          <section className="ficSection"><h3>Eating Well</h3><p>{variant.eatingWell}</p></section>
          <section className="ficSection"><h3>Storage</h3><p>{variant.storage}</p></section>
          <section className="ficSection"><h3>Per Standard Serving</h3><p>{variant.perStandardServing}</p></section>
          <section className="ficSection"><h3>Portion Information</h3><p>{variant.portionInformation}</p></section>
          <ListSection title="Recipe DNA" items={variant.recipeDNA} />
          <ListSection title="Dietary Profile" items={variant.dietaryProfile} />
          <ListSection title="Pairs Well With" items={variant.pairsWellWith} />
          <section className="ficSection"><h3>Good to Know</h3><p>{variant.goodToKnow}</p></section>
          <section className="ficSection"><h3>Cook’s Tip</h3><p>{variant.cooksTip}</p></section>
          <section className="ficSection ficDataNotes"><h3>Data Notes</h3><p>{variant.dataNotes}</p></section>
        </div>
      </div>
    </article>
  );
}
