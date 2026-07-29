import { useEffect, useMemo, useState } from "react";
import { getRecipeNutritionRecord, getRecipeNutritionVariant, normalizeRecipeCode } from "../data/recipeNutritionProfiles";

function FactRow({ label, value, strong = false }) {
  return <div className={strong ? "ficFactRow ficFactRowStrong" : "ficFactRow"}><span>{label}</span><strong>{value ?? "—"}</strong></div>;
}
function ListSection({ title, items }) {
  const storedItems = Array.isArray(items) ? items.filter(Boolean) : [];
  return <section className="ficSection"><h3>{title}</h3>{storedItems.length ? <ul>{storedItems.map((item,index)=><li key={`${title}-${index}-${item}`}>{item}</li>)}</ul> : <p>Not yet available.</p>}</section>;
}
function TextSection({ title, value, className = "" }) {
  return <section className={`ficSection ${className}`.trim()}><h3>{title}</h3><p>{value || "Not yet available."}</p></section>;
}
function FoodIntelligenceUnavailable({ recipeCode }) {
  const normalizedCode = normalizeRecipeCode(recipeCode);
  return <article className="foodIntelligenceUnavailable" aria-label={`${normalizedCode || "Recipe"} Food Intelligence availability`}>
    <span className="ficUnavailableEyebrow">FOOD INTELLIGENCE CARD</span>
    <strong>Food Intelligence is coming soon.</strong>
    <p>No stored nutrition record is currently available for <b>{normalizedCode || "this recipe"}</b>.</p>
    <p>The website will display this card automatically after a reviewed database profile is added for the recipe code.</p>
    <small>No nutrition values are calculated or estimated in your browser.</small>
  </article>;
}
export default function FoodIntelligenceCard({ recipeCode }) {
  const record = useMemo(() => getRecipeNutritionRecord(recipeCode), [recipeCode]);
  const variantKeys = useMemo(() => Object.keys(record?.variants || {}), [record]);
  const [variantKey,setVariantKey] = useState(record?.defaultVariant || variantKeys[0] || "");
  useEffect(() => { setVariantKey(record?.defaultVariant || Object.keys(record?.variants || {})[0] || ""); }, [record]);
  if (!record) return <FoodIntelligenceUnavailable recipeCode={recipeCode} />;
  const selected = getRecipeNutritionVariant(recipeCode, variantKey);
  const variant = selected?.profile;
  if (!variant) return <FoodIntelligenceUnavailable recipeCode={recipeCode} />;
  const facts=variant.nutritionFacts || {};
  const verified=record.status === "verified";
  const statusText=verified ? "USDA Verified" : record.statusLabel || "Estimated nutritional information";
  return <article className="foodIntelligenceCard" aria-label={`${record.title} Food Intelligence Card`}>
    <header className="ficHeader"><div><span className="ficEyebrow">FOOD INTELLIGENCE CARD</span><h2>{record.recipeCode} · {record.title}</h2><p className={verified ? "ficStatus verified" : "ficStatus provisional"}>{statusText}</p></div>
    {variantKeys.length>1 && <label className="ficVariantControl"><span>Nutrition variant</span><select value={selected.key} onChange={e=>setVariantKey(e.target.value)}>{variantKeys.map(key=><option value={key} key={key}>{record.variants[key].label}</option>)}</select></label>}</header>
    <div className="ficGrid"><section className="ficNutritionFacts"><h3>Nutrition Facts</h3><div className="ficServingLine"><span>Serving size</span><strong>{facts.servingSize ?? "—"}</strong></div><div className="ficServingLine"><span>Servings per recipe</span><strong>{facts.servingsPerRecipe ?? "—"}</strong></div><FactRow label="Calories" value={facts.calories} strong/><FactRow label="Total Fat" value={facts.totalFat}/><FactRow label="Saturated Fat" value={facts.saturatedFat}/><FactRow label="Trans Fat" value={facts.transFat}/><FactRow label="Cholesterol" value={facts.cholesterol}/><FactRow label="Sodium" value={facts.sodium}/><FactRow label="Total Carbohydrate" value={facts.totalCarbohydrate}/><FactRow label="Dietary Fiber" value={facts.dietaryFiber}/><FactRow label="Total Sugars" value={facts.totalSugars}/><FactRow label="Includes Added Sugars" value={facts.addedSugars}/><FactRow label="Protein" value={facts.protein} strong/></section>
    <div className="ficContentColumns"><section className="ficMealBalance"><h3>MealBalance</h3><strong>{variant.mealBalance?.score ?? "—"}</strong><span>{variant.mealBalance?.label || "Not yet available."}</span></section><TextSection title="Eating Well" value={variant.eatingWell}/><TextSection title="Storage" value={variant.storage}/><TextSection title="Per Standard Serving" value={variant.perStandardServing}/><TextSection title="Portion Information" value={variant.portionInformation}/><ListSection title="Recipe DNA" items={variant.recipeDNA}/><ListSection title="Dietary Profile" items={variant.dietaryProfile}/><ListSection title="Pairs Well With" items={variant.pairsWellWith}/><TextSection title="Good to Know" value={variant.goodToKnow}/><TextSection title="Cook’s Tip" value={variant.cooksTip}/><TextSection title="Data Notes" value={variant.dataNotes} className="ficDataNotes"/></div></div>
  </article>;
}
