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

const MEAL_BUILDER_MAIN_IDS = new Set([
  "AM-001", "AM-007", "AM-008", "AM-010", "AM-018", "AM-020", "AM-037", "AM-041", "AM-053",
]);
const MEAL_BUILDER_SIDE_IDS = new Set([
  "SD-001", "SD-004", "SD-005", "SD-007", "SD-008", "SD-009", "SD-010", "SD-012", "SD-025",
]);

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
  const raw = recipe?.mealBalance?.score;
  if (raw === null || raw === undefined || raw === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function MealChoiceStats({ recipe }) {
  const calories = recipeCalories(recipe);
  const mealBalance = recipeMealBalance(recipe);

  return (
    <span className="mealBuilderChoiceStats" aria-label={`${calories === null ? "Calories unavailable" : `${Math.round(calories)} calories`}; ${mealBalance === null ? "MealBalance unrated" : `MealBalance ${mealBalance}`}`}>
      <span className="mealBuilderChoiceCalories">{calories === null ? "Calories —" : `${Math.round(calories)} calories`}</span>
      <span className={`mealBuilderChoiceMb${mealBalance === null ? " is-unrated" : ""}`} title={mealBalance === null ? "MealBalance not yet rated" : `MealBalance ${mealBalance}`}>{mealBalance ?? "—"}</span>
    </span>
  );
}

function MealNutritionLine({ label, recipe }) {
  const calories = recipeCalories(recipe);
  return (
    <div className="mealBuilderNutritionLine">
      <span>{label}</span>
      <strong>{recipe ? normalizeRecipeTitle(recipe) : "Choose a recipe"}</strong>
      <b>{calories === null ? "—" : `${Math.round(calories)} calories`}</b>
    </div>
  );
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

  const isMain = position === "main";
  const hasBuilderImage = (isMain ? MEAL_BUILDER_MAIN_IDS : MEAL_BUILDER_SIDE_IDS).has(recipe.id);
  if (!hasBuilderImage) {
    return (
      <div className={`mealBuilderTrayFood mealBuilderTrayFood-${position} is-empty is-unavailable`}>
        <span>Meal image coming soon</span>
      </div>
    );
  }

  const folder = isMain ? "main" : "sides";
  return (
    <div className={`mealBuilderTrayFood mealBuilderTrayFood-${position}`}>
      <img src={`${import.meta.env.BASE_URL}images/meal-builder/${folder}/${recipe.id}.webp`} alt="" />
    </div>
  );
}

function MealChoiceStrip({ label, categories, category, onCategoryChange, recipes, selectedId, onSelect, excludeId = "", builderImageIds }) {
  const railRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const visibleRecipes = useMemo(
    () => {
      const query = searchQuery.trim().toLocaleLowerCase();
      return recipes
      .filter((recipe) => categoryCode(recipe) === category && recipe.id !== excludeId)
      .filter((recipe) => !query || `${normalizeRecipeTitle(recipe)} ${recipe.id}`.toLocaleLowerCase().includes(query))
      .sort((a, b) => {
        const proofDifference = Number(builderImageIds.has(b.id)) - Number(builderImageIds.has(a.id));
        return proofDifference || normalizeRecipeTitle(a).localeCompare(normalizeRecipeTitle(b));
      });
    },
    [builderImageIds, category, excludeId, recipes, searchQuery],
  );

  function slide(direction) {
    railRef.current?.scrollBy({ left: direction * Math.max(300, railRef.current.clientWidth * 0.72), behavior: "smooth" });
  }

  return (
    <section className="mealBuilderChoiceStrip" aria-label={`${label} recipe selector`}>
      <div className="mealBuilderChoiceLead">
        <strong>{label}</strong>
        <label>
          <span>Search by Name</span>
          <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Enter recipe name" />
        </label>
        <label>
          <span>Sort by Cuisine</span>
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
              <MealChoiceStats recipe={recipe} />
            </button>
          ))}
          {!visibleRecipes.length && <p className="mealBuilderChoiceEmpty">No matching recipes found.</p>}
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
        <p>Mix and match a main dish and two sides using recipes already in your Recipe Box.</p>
        <p>Then decide what to eat now, refrigerate, or freeze for later.</p>
      </section>

      <div className="mealBuilderTopGrid">
        <div className="mealBuilderTray" aria-label="Preview of the selected main dish and two sides">
          <img className="mealBuilderTrayBase" src={`${import.meta.env.BASE_URL}images/meal-builder/meal-builder-tray-base.webp`} alt="Empty white rectangular meal-prep tray" />
          <div className="mealBuilderTrayInterior" aria-hidden="true">
            <MealBuilderFoodImage recipe={mainRecipe} position="main" />
            <MealBuilderFoodImage recipe={sideOneRecipe} position="side-one" />
            <MealBuilderFoodImage recipe={sideTwoRecipe} position="side-two" />
          </div>
          <div className="mealBuilderTrayRim" aria-hidden="true" />
        </div>

        <section className="mealBuilderFinishRow mealBuilderPlanColumn">
          <div className="mealBuilderPortionPanel" aria-labelledby="meal-builder-portions-title">
            <div className="mealBuilderStepHeading"><h2 id="meal-builder-portions-title">Overview</h2></div>
            <div className="mealBuilderPortionGrid">
              <label><span>Portions</span><select value={servings} onChange={(event) => updateServings(event.target.value)}>{[2, 4, 6].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <label><span>Eat Now</span><select value={eatNow} onChange={(event) => updateEatNow(event.target.value)}>{Array.from({ length: servings + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <label><span>Refrigerate</span><select value={refrigerate} onChange={(event) => setRefrigerate(Number(event.target.value))}>{Array.from({ length: Math.max(0, servings - eatNow) + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <div className="mealBuilderFreezeResult"><span>Freeze</span><strong>{freezeLater}</strong></div>
            </div>
          </div>
          <div className="mealBuilderNutritionSummary" aria-label="Estimated Meal Calories and MealBalance">
            <MealNutritionLine label="Meal" recipe={mainRecipe} />
            <MealNutritionLine label="Side 1" recipe={sideOneRecipe} />
            <MealNutritionLine label="Side 2" recipe={sideTwoRecipe} />
            <div className="mealBuilderNutritionTotal">
              <div><strong>{totalCalories ?? "—"}</strong><span>Est Calories</span></div>
              <div className="mealBuilderMbSummary"><span>MB</span><strong>{combinedMealBalance ?? "—"}</strong></div>
            </div>
          </div>
        </section>
      </div>

      <div className="mealBuilderSelectorStack">
        <MealChoiceStrip label="Main Dish" categories={MAIN_CATEGORIES} category={mainCategory} onCategoryChange={setMainCategory} recipes={mainRecipes} selectedId={mainId} onSelect={setMainId} builderImageIds={MEAL_BUILDER_MAIN_IDS} />
        <MealChoiceStrip label="Side 1" categories={SIDE_CATEGORIES} category={sideOneCategory} onCategoryChange={setSideOneCategory} recipes={sideRecipes} selectedId={sideOneId} onSelect={setSideOneId} excludeId={sideTwoId} builderImageIds={MEAL_BUILDER_SIDE_IDS} />
        <MealChoiceStrip label="Side 2" categories={SIDE_CATEGORIES} category={sideTwoCategory} onCategoryChange={setSideTwoCategory} recipes={sideRecipes} selectedId={sideTwoId} onSelect={setSideTwoId} excludeId={sideOneId} builderImageIds={MEAL_BUILDER_SIDE_IDS} />
      </div>

      <div className="mealBuilderActions">
        <button type="button" className="secondary" onClick={clearBuilder}>Clear &amp; Start Over</button>
        <p>This first version is a visual prototype. Saving the combination to the weekly plan and freezer inventory will be added after the tray presentation is approved.</p>
      </div>
    </main>
  );
}
