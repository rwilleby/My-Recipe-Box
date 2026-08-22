import { useEffect, useMemo, useState } from "react";
import { getRecipeNutritionVariant } from "../data/recipeNutritionProfiles.js";
import { recipeImageCandidates } from "../features/recipe-viewer/recipeAssets.js";

const MAIN_CATEGORY_CODES = new Set([
  "AM", "AS", "CP", "CS", "DM", "HB", "HBP", "IT", "MX", "QP", "SF", "SG", "SW",
]);

const SIDE_CATEGORY_CODES = new Set(["SD", "SB", "LF"]);

function normalizeRecipeTitle(recipe) {
  return recipe?.title || recipe?.name || recipe?.id || "Recipe";
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

function MealBuilderFoodImage({ recipe, position }) {
  // Empty slots render before a recipe is selected. recipeImageCandidates
  // expects a real recipe, so never call it with null during the initial page
  // render.
  const candidates = useMemo(
    () => (recipe ? recipeImageCandidates(recipe) : []),
    [recipe],
  );
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => setImageIndex(0), [recipe?.id]);

  if (!recipe) {
    return (
      <div className={`mealBuilderTrayFood mealBuilderTrayFood-${position} is-empty`}>
        <span>{position === "main" ? "Choose Main" : position === "side-one" ? "Choose Side 1" : "Choose Side 2"}</span>
      </div>
    );
  }

  const imagePath = candidates[imageIndex];
  if (!imagePath) {
    return (
      <div className={`mealBuilderTrayFood mealBuilderTrayFood-${position} is-empty`}>
        <span>{normalizeRecipeTitle(recipe)}</span>
      </div>
    );
  }

  return (
    <div className={`mealBuilderTrayFood mealBuilderTrayFood-${position}`}>
      <img
        src={`${import.meta.env.BASE_URL}${imagePath}`}
        alt=""
        aria-hidden="true"
        onError={() => setImageIndex((current) => current + 1)}
      />
    </div>
  );
}

function RecipeSelect({ id, label, value, onChange, recipes, excludeId = "" }) {
  return (
    <label className="mealBuilderRecipeSelect" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Choose a recipe</option>
        {recipes
          .filter((recipe) => recipe.id !== excludeId)
          .map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.title} ({recipe.id})
            </option>
          ))}
      </select>
    </label>
  );
}

export default function BuildYourOwnMealPage({ recipes = [], openRecipeCard = () => {} }) {
  const [mainId, setMainId] = useState("");
  const [sideOneId, setSideOneId] = useState("");
  const [sideTwoId, setSideTwoId] = useState("");
  const [servings, setServings] = useState(4);
  const [eatNow, setEatNow] = useState(2);
  const [refrigerate, setRefrigerate] = useState(0);

  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const recipeMap = useMemo(
    () => new Map(safeRecipes.map((recipe) => [recipe.id, recipe])),
    [safeRecipes],
  );

  const mainRecipes = useMemo(
    () => safeRecipes
      .filter((recipe) => MAIN_CATEGORY_CODES.has(String(recipe?.categoryCode || "").toUpperCase()))
      .sort((a, b) => normalizeRecipeTitle(a).localeCompare(normalizeRecipeTitle(b))),
    [safeRecipes],
  );

  const sideRecipes = useMemo(
    () => safeRecipes
      .filter((recipe) => SIDE_CATEGORY_CODES.has(String(recipe?.categoryCode || "").toUpperCase()))
      .sort((a, b) => normalizeRecipeTitle(a).localeCompare(normalizeRecipeTitle(b))),
    [safeRecipes],
  );

  const mainRecipe = recipeMap.get(mainId) || null;
  const sideOneRecipe = recipeMap.get(sideOneId) || null;
  const sideTwoRecipe = recipeMap.get(sideTwoId) || null;
  const selectedRecipes = [mainRecipe, sideOneRecipe, sideTwoRecipe].filter(Boolean);
  const freezeLater = Math.max(0, servings - eatNow - refrigerate);
  const knownCalories = selectedRecipes.map(recipeCalories).filter((value) => value !== null);
  const totalCalories = selectedRecipes.length && knownCalories.length === selectedRecipes.length
    ? Math.round(knownCalories.reduce((sum, value) => sum + value, 0))
    : null;
  const mealBalanceValues = selectedRecipes.map(recipeMealBalance).filter((value) => value !== null);
  const combinedMealBalance = mealBalanceValues.length
    ? Math.max(1, Math.min(10, Math.round(mealBalanceValues.reduce((sum, value) => sum + value, 0) / mealBalanceValues.length)))
    : null;

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
    setMainId("");
    setSideOneId("");
    setSideTwoId("");
    setServings(4);
    setEatNow(2);
    setRefrigerate(0);
  }

  return (
    <main className="pageShell buildYourOwnMealPage">
      <section className="buildYourOwnMealIntro" aria-labelledby="build-your-own-meal-title">
        <h1 id="build-your-own-meal-title">See Your Meal Come Together</h1>
        <p>
          Mix and match a main dish and two sides using recipes already in your Recipe Box. Then decide what to eat now, refrigerate, or freeze for later.
        </p>
      </section>

      <section className="mealBuilderWorkspace">
        <div className="mealBuilderPreviewColumn">
          <div className="mealBuilderTray" aria-label="Preview of the selected main dish and two sides">
            <img
              className="mealBuilderTrayBase"
              src={`${import.meta.env.BASE_URL}images/meal-builder/meal-builder-tray-base.webp`}
              alt="Empty white rectangular meal-prep tray"
            />
            <div className="mealBuilderTrayInterior" aria-hidden="true">
              <MealBuilderFoodImage recipe={mainRecipe} position="main" />
              <MealBuilderFoodImage recipe={sideOneRecipe} position="side-one" />
              <MealBuilderFoodImage recipe={sideTwoRecipe} position="side-two" />
            </div>
            <div className="mealBuilderTrayRim" aria-hidden="true" />
          </div>

          <div className="mealBuilderPreviewSummary" aria-live="polite">
            <div>
              <span>Main</span>
              <strong>{mainRecipe ? mainRecipe.title : "Not selected"}</strong>
            </div>
            <div>
              <span>Side 1</span>
              <strong>{sideOneRecipe ? sideOneRecipe.title : "Not selected"}</strong>
            </div>
            <div>
              <span>Side 2</span>
              <strong>{sideTwoRecipe ? sideTwoRecipe.title : "Not selected"}</strong>
            </div>
          </div>
        </div>

        <div className="mealBuilderControlsColumn">
          <section className="mealBuilderControlPanel" aria-labelledby="meal-builder-choose-title">
            <div className="mealBuilderStepHeading">
              <span>Step 1</span>
              <h2 id="meal-builder-choose-title">Choose What Goes in the Tray</h2>
            </div>
            <div className="mealBuilderSelectGrid">
              <RecipeSelect id="meal-builder-main" label="Main Dish" value={mainId} onChange={setMainId} recipes={mainRecipes} />
              <RecipeSelect id="meal-builder-side-one" label="Side 1" value={sideOneId} onChange={setSideOneId} recipes={sideRecipes} excludeId={sideTwoId} />
              <RecipeSelect id="meal-builder-side-two" label="Side 2" value={sideTwoId} onChange={setSideTwoId} recipes={sideRecipes} excludeId={sideOneId} />
            </div>
            {selectedRecipes.length > 0 && (
              <div className="mealBuilderRecipeLinks">
                {selectedRecipes.map((recipe) => (
                  <button key={recipe.id} type="button" onClick={() => openRecipeCard(recipe.id)}>
                    View {recipe.title}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="mealBuilderControlPanel" aria-labelledby="meal-builder-portions-title">
            <div className="mealBuilderStepHeading">
              <span>Step 2</span>
              <h2 id="meal-builder-portions-title">Plan the Portions</h2>
            </div>
            <div className="mealBuilderPortionGrid">
              <label>
                <span>Total Portions</span>
                <select value={servings} onChange={(event) => updateServings(event.target.value)}>
                  {[2, 4, 6].map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <label>
                <span>Eat Now</span>
                <select value={eatNow} onChange={(event) => updateEatNow(event.target.value)}>
                  {Array.from({ length: servings + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <label>
                <span>Refrigerate</span>
                <select value={refrigerate} onChange={(event) => setRefrigerate(Number(event.target.value))}>
                  {Array.from({ length: Math.max(0, servings - eatNow) + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <div className="mealBuilderFreezeResult">
                <span>Freeze for Later</span>
                <strong>{freezeLater}</strong>
              </div>
            </div>
          </section>

          <section className="mealBuilderNutritionSummary" aria-label="Combined meal estimate">
            <div>
              <span>Estimated Meal Calories</span>
              <strong>{totalCalories ?? "—"}</strong>
              <small>{totalCalories === null ? "Complete nutrition is not available for every selection." : "Per assembled serving"}</small>
            </div>
            <div className="mealBuilderMbSummary">
              <span>MealBalance</span>
              <strong>{combinedMealBalance ?? "—"}</strong>
            </div>
          </section>

          <div className="mealBuilderActions">
            <button type="button" className="secondary" onClick={clearBuilder}>Clear &amp; Start Over</button>
            <p>This first version is a visual prototype. Saving the combination to the weekly plan and freezer inventory will be added after the tray presentation is approved.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
