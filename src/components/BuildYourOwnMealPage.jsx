import { useEffect, useMemo, useRef, useState } from "react";
import { getRecipeNutritionVariant } from "../data/recipeNutritionProfiles.js";
import { recipeHeroImageCandidates } from "../features/recipe-viewer/recipeAssets.js";

const MAIN_CATEGORIES = [
  ["AM", "American"], ["AS", "Asian"], ["CP", "Crock Pot"], ["CS", "Casseroles"],
  ["DM", "Diet Meals"], ["HB", "Hamburgers"], ["HBP", "Hamburger Patties"],
  ["IT", "Italian"], ["MX", "Mexican"], ["QP", "Quiche"], ["SF", "Seafood"],
  ["SG", "Meats"], ["SW", "Sandwiches"],
];
const SIDE_CATEGORIES = [["SD", "Side Dishes"], ["SB", "Salads"], ["LF", "Breads & Rolls"]];

function normalizeRecipeTitle(recipe) {
  return recipe?.title || recipe?.name || recipe?.id || "Recipe";
}

function categoryCode(recipe) {
  return String(recipe?.categoryCode || recipe?.category || recipe?.id?.match(/^[A-Z]+/)?.[0] || "").toUpperCase();
}

function recipeCalories(recipe) {
  const raw = getRecipeNutritionVariant(recipe?.id)?.profile?.nutritionFacts?.calories;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function recipeMealBalance(recipe) {
  const parsed = Number(recipe?.mealBalance?.score);
  return Number.isFinite(parsed) ? parsed : null;
}

function HeroImage({ recipe, alt = "" }) {
  const candidates = useMemo(() => recipeHeroImageCandidates(recipe), [recipe]);
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => setImageIndex(0), [recipe?.id]);
  if (!recipe || !candidates[imageIndex]) return null;
  return <img src={`${import.meta.env.BASE_URL}${candidates[imageIndex]}`} alt={alt} onError={() => setImageIndex((current) => current + 1)} />;
}

function MealBuilderFoodImage({ recipe, position }) {
  if (!recipe) {
    return (
      <div className={`mealBuilderTrayFood mealBuilderTrayFood-${position} is-empty`}>
        <span>{position === "main" ? "Choose Main" : position === "side-one" ? "Choose Side 1" : "Choose Side 2"}</span>
      </div>
    );
  }
  return <div className={`mealBuilderTrayFood mealBuilderTrayFood-${position}`}><HeroImage recipe={recipe} /></div>;
}

function MealChoiceStrip({ label, categories, category, onCategoryChange, recipes, selectedId, onSelect, excludeId = "" }) {
  const railRef = useRef(null);
  const visibleRecipes = useMemo(
    () => recipes
      .filter((recipe) => categoryCode(recipe) === category && recipe.id !== excludeId)
      .sort((a, b) => normalizeRecipeTitle(a).localeCompare(normalizeRecipeTitle(b))),
    [category, excludeId, recipes],
  );

  function slide(direction) {
    railRef.current?.scrollBy({ left: direction * Math.max(300, railRef.current.clientWidth * 0.72), behavior: "smooth" });
  }

  return (
    <section className="mealBuilderChoiceStrip" aria-label={`${label} recipe selector`}>
      <div className="mealBuilderChoiceLead">
        <strong>{label}</strong>
        <label>
          <span className="srOnly">Choose a category for {label}</span>
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            {categories.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
      </div>
      <div className="mealBuilderChoiceSlider">
        <button type="button" className="mealBuilderSlideButton" onClick={() => slide(-1)} aria-label={`Previous ${label} recipes`}>‹</button>
        <div className="mealBuilderChoiceRail" ref={railRef}>
          {visibleRecipes.map((recipe) => (
            <button type="button" key={recipe.id} className={`mealBuilderChoiceCard${selectedId === recipe.id ? " is-selected" : ""}`} onClick={() => onSelect(recipe.id)} aria-pressed={selectedId === recipe.id}>
              <span className="mealBuilderChoiceImage"><HeroImage recipe={recipe} /></span>
              <span className="mealBuilderChoiceTitle">{normalizeRecipeTitle(recipe)}</span>
            </button>
          ))}
          {!visibleRecipes.length && <p className="mealBuilderChoiceEmpty">No recipes are available in this category.</p>}
        </div>
        <button type="button" className="mealBuilderSlideButton" onClick={() => slide(1)} aria-label={`Next ${label} recipes`}>›</button>
      </div>
    </section>
  );
}

export default function BuildYourOwnMealPage({ recipes = [] }) {
  const [mainCategory, setMainCategory] = useState("AM");
  const [sideOneCategory, setSideOneCategory] = useState("SD");
  const [sideTwoCategory, setSideTwoCategory] = useState("SD");
  const [mainId, setMainId] = useState("");
  const [sideOneId, setSideOneId] = useState("");
  const [sideTwoId, setSideTwoId] = useState("");
  const [servings, setServings] = useState(4);
  const [eatNow, setEatNow] = useState(2);
  const [refrigerate, setRefrigerate] = useState(0);

  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const recipeMap = useMemo(() => new Map(safeRecipes.map((recipe) => [recipe.id, recipe])), [safeRecipes]);
  const mainRecipes = useMemo(() => safeRecipes.filter((recipe) => MAIN_CATEGORIES.some(([code]) => code === categoryCode(recipe))), [safeRecipes]);
  const sideRecipes = useMemo(() => safeRecipes.filter((recipe) => SIDE_CATEGORIES.some(([code]) => code === categoryCode(recipe))), [safeRecipes]);
  const mainRecipe = recipeMap.get(mainId) || null;
  const sideOneRecipe = recipeMap.get(sideOneId) || null;
  const sideTwoRecipe = recipeMap.get(sideTwoId) || null;
  const selectedRecipes = [mainRecipe, sideOneRecipe, sideTwoRecipe].filter(Boolean);
  const freezeLater = Math.max(0, servings - eatNow - refrigerate);
  const knownCalories = selectedRecipes.map(recipeCalories).filter((value) => value !== null);
  const totalCalories = selectedRecipes.length && knownCalories.length === selectedRecipes.length ? Math.round(knownCalories.reduce((sum, value) => sum + value, 0)) : null;
  const mealBalanceValues = selectedRecipes.map(recipeMealBalance).filter((value) => value !== null);
  const combinedMealBalance = mealBalanceValues.length ? Math.max(1, Math.min(10, Math.round(mealBalanceValues.reduce((sum, value) => sum + value, 0) / mealBalanceValues.length))) : null;

  function updateServings(value) {
    const next = Number(value);
    setServings(next);
    setEatNow(Math.min(eatNow, next));
    setRefrigerate(Math.min(refrigerate, Math.max(0, next - Math.min(eatNow, next))));
  }
  function updateEatNow(value) {
    const next = Number(value);
    setEatNow(next);
    if (next + refrigerate > servings) setRefrigerate(Math.max(0, servings - next));
  }
  function clearBuilder() {
    setMainId(""); setSideOneId(""); setSideTwoId("");
    setServings(4); setEatNow(2); setRefrigerate(0);
  }

  return (
    <main className="pageShell buildYourOwnMealPage">
      <section className="buildYourOwnMealIntro" aria-labelledby="build-your-own-meal-title">
        <h1 id="build-your-own-meal-title">See Your Meal Come Together</h1>
        <p>Mix and match a main dish and two sides using recipes already in your Recipe Box. Then decide what to eat now, refrigerate, or freeze for later.</p>
      </section>

      <div className="mealBuilderTray" aria-label="Preview of the selected main dish and two sides">
        <img className="mealBuilderTrayBase" src={`${import.meta.env.BASE_URL}images/meal-builder/meal-builder-tray-base.webp`} alt="Empty white rectangular meal-prep tray" />
        <div className="mealBuilderTrayInterior" aria-hidden="true">
          <MealBuilderFoodImage recipe={mainRecipe} position="main" />
          <MealBuilderFoodImage recipe={sideOneRecipe} position="side-one" />
          <MealBuilderFoodImage recipe={sideTwoRecipe} position="side-two" />
        </div>
        <div className="mealBuilderTrayRim" aria-hidden="true" />
      </div>

      <div className="mealBuilderSelectorStack">
        <MealChoiceStrip label="Main Dish" categories={MAIN_CATEGORIES} category={mainCategory} onCategoryChange={setMainCategory} recipes={mainRecipes} selectedId={mainId} onSelect={setMainId} />
        <MealChoiceStrip label="Side 1" categories={SIDE_CATEGORIES} category={sideOneCategory} onCategoryChange={setSideOneCategory} recipes={sideRecipes} selectedId={sideOneId} onSelect={setSideOneId} excludeId={sideTwoId} />
        <MealChoiceStrip label="Side 2" categories={SIDE_CATEGORIES} category={sideTwoCategory} onCategoryChange={setSideTwoCategory} recipes={sideRecipes} selectedId={sideTwoId} onSelect={setSideTwoId} excludeId={sideOneId} />
      </div>

      <section className="mealBuilderFinishRow">
        <div className="mealBuilderPortionPanel" aria-labelledby="meal-builder-portions-title">
          <div className="mealBuilderStepHeading"><span>Step 2</span><h2 id="meal-builder-portions-title">Plan the Portions</h2></div>
          <div className="mealBuilderPortionGrid">
            <label><span>Total Portions</span><select value={servings} onChange={(event) => updateServings(event.target.value)}>{[2, 4, 6].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label><span>Eat Now</span><select value={eatNow} onChange={(event) => updateEatNow(event.target.value)}>{Array.from({ length: servings + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label><span>Refrigerate</span><select value={refrigerate} onChange={(event) => setRefrigerate(Number(event.target.value))}>{Array.from({ length: Math.max(0, servings - eatNow) + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <div className="mealBuilderFreezeResult"><span>Freeze for Later</span><strong>{freezeLater}</strong></div>
          </div>
        </div>
        <div className="mealBuilderNutritionSummary" aria-label="Combined meal estimate">
          <div><span>Estimated Meal Calories</span><strong>{totalCalories ?? "—"}</strong><small>{totalCalories === null ? "Choose all three recipes for a complete estimate." : "Per assembled serving"}</small></div>
          <div className="mealBuilderMbSummary"><span>MealBalance</span><strong>{combinedMealBalance ?? "—"}</strong></div>
        </div>
      </section>

      <div className="mealBuilderActions">
        <button type="button" className="secondary" onClick={clearBuilder}>Clear &amp; Start Over</button>
        <p>This first version is a visual prototype. Saving the combination to the weekly plan and freezer inventory will be added after the tray presentation is approved.</p>
      </div>
    </main>
  );
}
