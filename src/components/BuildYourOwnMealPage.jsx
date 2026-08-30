import { useEffect, useMemo, useRef, useState } from "react";
import { getRecipeNutritionVariant } from "../data/recipeNutritionProfiles.js";
import { recipeHeroImageCandidates } from "../features/recipe-viewer/recipeAssets.js";

export const MAIN_CATEGORIES = [
  ["AM", "American"], ["AS", "Asian"], ["HB", "Hamburgers"], ["IT", "Italian"],
  ["MX", "Mexican"], ["SF", "Seafood"], ["SG", "Meats"], ["CP", "Crock Pot Meals"],
];
const SIDE_CATEGORIES = [["SD", "Side Dishes"]];

export const MEAL_BUILDER_MAIN_IDS = new Set([
  "AM-001", "AM-002", "AM-003", "AM-004", "AM-005", "AM-006", "AM-007", "AM-008", "AM-009", "AM-010",
  "AM-011", "AM-012", "AM-013", "AM-014", "AM-015", "AM-016", "AM-018", "AM-020", "AM-037", "AM-041", "AM-053",
  "AM-017", "AM-019", "AM-021", "AM-022", "AM-023", "AM-024", "AM-025", "AM-026", "AM-027", "AM-028",
  "AM-029", "AM-030", "AM-031", "AM-032", "AM-033", "AM-034", "AM-035", "AM-036", "AM-038", "AM-039",
  "AM-040", "AM-042", "AM-043", "AM-044", "AM-045", "AM-046", "AM-047", "AM-048", "AM-049", "AM-050",
  "AM-051", "AM-052", "AM-054", "AM-055", "AM-056", "AM-057", "AM-058", "AM-059", "AM-060", "AM-061",
  "AM-062", "AM-064", "AM-065", "AM-066", "AM-067", "AM-068", "AM-069", "AM-070", "AM-071", "AM-072",
  "AM-073", "AM-074", "AM-075", "AM-076", "AM-077", "AM-078",
  "AS-001", "AS-002", "AS-003", "AS-004", "AS-005", "AS-006", "AS-007", "AS-008", "AS-009", "AS-010",
  "AS-011", "AS-012", "AS-013", "AS-014", "AS-015", "AS-016", "AS-017", "AS-018", "AS-019", "AS-020",
  "AS-021", "AS-022", "AS-023", "AS-024",
  ...Array.from({ length: 60 }, (_, index) => `IT-${String(index + 1).padStart(3, "0")}`),
  ...Array.from({ length: 20 }, (_, index) => `SF-${String(index + 1).padStart(3, "0")}`),
  ...Array.from({ length: 44 }, (_, index) => `MX-${String(index + 1).padStart(3, "0")}`),
  ...Array.from({ length: 180 }, (_, index) => `CP-${String(index + 1).padStart(3, "0")}`),
]);
export const MEAL_BUILDER_FULL_CANVAS_MAIN_IDS = new Set(
  [
    ...Array.from({ length: 78 }, (_, index) => index + 1)
      .filter((number) => number !== 63)
      .map((number) => `AM-${String(number).padStart(3, "0")}`),
    ...Array.from({ length: 21 }, (_, index) => `AS-${String(index + 1).padStart(3, "0")}`),
    ...Array.from({ length: 180 }, (_, index) => `CP-${String(index + 1).padStart(3, "0")}`),
    ...Array.from({ length: 20 }, (_, index) => `SF-${String(index + 1).padStart(3, "0")}`),
    ...Array.from({ length: 44 }, (_, index) => `MX-${String(index + 1).padStart(3, "0")}`),
    ...Array.from({ length: 60 }, (_, index) => `IT-${String(index + 1).padStart(3, "0")}`),
  ],
);
export const MEAL_BUILDER_SIDE_IDS = new Set(
  Array.from({ length: 53 }, (_, index) => `SD-${String(index + 1).padStart(3, "0")}`),
);
export const MEAL_BUILDER_DIVIDED_TRAY_SIDE_IDS = new Set(
  Array.from({ length: 53 }, (_, index) => `SD-${String(index + 1).padStart(3, "0")}`),
);
export const MEAL_BUILDER_STANDARD_FULL_CANVAS_MAIN_IDS = new Set([
  ...Array.from({ length: 21 }, (_, index) => `AS-${String(index + 1).padStart(3, "0")}`),
  ...Array.from({ length: 180 }, (_, index) => `CP-${String(index + 1).padStart(3, "0")}`),
  ...Array.from({ length: 60 }, (_, index) => `IT-${String(index + 1).padStart(3, "0")}`),
  ...Array.from({ length: 20 }, (_, index) => `SF-${String(index + 1).padStart(3, "0")}`),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23, 24, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]
    .map((number) => `MX-${String(number).padStart(3, "0")}`),
]);
export const MEAL_BUILDER_MAIN_LAYOUTS = new Map([
  ...Array.from(MEAL_BUILDER_MAIN_IDS)
    .filter((id) => !["AS-022", "AS-023", "AS-024"].includes(id))
    .filter((id) => !MEAL_BUILDER_STANDARD_FULL_CANVAS_MAIN_IDS.has(id))
    .filter((id) => !/^MX-02[5-9]$|^MX-030$/.test(id))
    .map((id) => [id, "two-thirds"]),
  ...Array.from({ length: 6 }, (_, index) => [`MX-${String(index + 25).padStart(3, "0")}`, "full-tray"]),
]);
const MEAL_BUILDER_LABEL_SHEETS = {
  "8163": {
    name: "Avery 8163",
    description: "Letter size · 2 columns × 5 rows · 2″ × 4″ labels",
    labelsPerSheet: 10,
    columns: 2,
    rows: 5,
    includesPhoto: true,
  },
  "5160": {
    name: "Avery 5160",
    description: "Letter size · 3 columns × 10 rows · 1″ × 2⅝″ labels",
    labelsPerSheet: 30,
    columns: 3,
    rows: 10,
    includesPhoto: false,
  },
};
const MEAL_BUILDER_LABEL_SETTINGS_KEY = "rrb_mealBuilderLabelSettings_v1";

function loadMealBuilderLabelSettings() {
  const defaults = { format: "8163", unavailable8163: [], unavailable5160: [], offsetX: 0, offsetY: 0, printOutlines: false };
  try {
    const stored = JSON.parse(window.localStorage.getItem(MEAL_BUILDER_LABEL_SETTINGS_KEY) || "null");
    if (!stored || typeof stored !== "object") return defaults;
    return {
      format: stored.format === "5160" ? "5160" : "8163",
      unavailable8163: (Array.isArray(stored.unavailable8163) ? stored.unavailable8163 : stored.unavailablePositions || [])
        .filter((position) => Number.isInteger(position) && position >= 1 && position <= 10),
      unavailable5160: (Array.isArray(stored.unavailable5160) ? stored.unavailable5160 : [])
        .filter((position) => Number.isInteger(position) && position >= 1 && position <= 30),
      offsetX: Number(stored.offsetX) || 0,
      offsetY: Number(stored.offsetY) || 0,
      printOutlines: Boolean(stored.printOutlines),
    };
  } catch {
    return defaults;
  }
}

export function createMealBuilderLabelPages(quantity, unavailablePositions = [], labelsPerSheet = 10) {
  const remainingLabels = Array.from({ length: Math.max(0, Number(quantity) || 0) }, (_, index) => ({ key: `meal-label-${index + 1}` }));
  const unavailable = new Set(unavailablePositions);
  const pages = [];
  let labelIndex = 0;

  const firstPage = Array.from({ length: labelsPerSheet }, (_, index) => {
    if (unavailable.has(index + 1) || labelIndex >= remainingLabels.length) return null;
    return remainingLabels[labelIndex++];
  });
  if (firstPage.some(Boolean)) pages.push(firstPage);

  while (labelIndex < remainingLabels.length) {
    pages.push(Array.from({ length: labelsPerSheet }, () => (
      labelIndex < remainingLabels.length ? remainingLabels[labelIndex++] : null
    )));
  }
  return pages;
}

function normalizeRecipeTitle(recipe) {
  return recipe?.title || recipe?.name || recipe?.id || "Recipe";
}

export function buildMealBuilderLabelTitle(mainRecipe, sideOneRecipe, sideTwoRecipe, mainTrayLayout = "standard") {
  if (!mainRecipe) return "Build-A-Meal";
  const mainTitle = normalizeRecipeTitle(mainRecipe);
  const sides = mainTrayLayout === "full-tray"
    ? []
    : mainTrayLayout === "two-thirds"
      ? [sideTwoRecipe]
      : [sideOneRecipe, sideTwoRecipe];
  const sideTitles = sides.filter(Boolean).map(normalizeRecipeTitle);
  if (!sideTitles.length) return mainTitle;
  if (sideTitles.length === 1) return `${mainTitle} with ${sideTitles[0]}`;
  return `${mainTitle} with ${sideTitles[0]} and ${sideTitles[1]}`;
}

function formatMealBuilderPrintDate(date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
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
        <span>{position === "main" ? <>Choose<br />Main</> : position === "side-one" ? "Choose Side 1" : "Choose Side 2"}</span>
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

  const folder = isMain
    ? "main"
    : position === "side-one"
      ? "side-1-middle"
      : "side-2-right";
  const usesDividedTrayLayer = !isMain && MEAL_BUILDER_DIVIDED_TRAY_SIDE_IDS.has(recipe.id);
  const usesFullCanvasMainLayer = isMain && MEAL_BUILDER_FULL_CANVAS_MAIN_IDS.has(recipe.id);
  return (
    <div className={`mealBuilderTrayFood mealBuilderTrayFood-${position} mealBuilderTrayFood-recipe-${recipe.id.toLowerCase()}${usesDividedTrayLayer ? " is-divided-tray-layer" : ""}${usesFullCanvasMainLayer ? " is-full-canvas-layer" : ""}`}>
      <img src={`${import.meta.env.BASE_URL}images/build-your-own/${folder}/${recipe.id}.webp`} alt="" />
    </div>
  );
}

export function MealBuilderTrayPreview({ mainRecipe, sideOneRecipe, sideTwoRecipe, mainTrayLayout, className = "" }) {
  return (
    <div className={`mealBuilderTray${className ? ` ${className}` : ""}`} aria-label="Preview of the selected main dish and two sides">
      <img className="mealBuilderTrayBase" src={`${import.meta.env.BASE_URL}images/meal-builder/meal-builder-tray-base.webp`} alt="Empty white rectangular meal-prep tray" />
      <div className={`mealBuilderTrayInterior is-${mainTrayLayout}`} aria-hidden="true">
        <MealBuilderFoodImage recipe={mainRecipe} position="main" />
        {mainTrayLayout === "standard" && <MealBuilderFoodImage recipe={sideOneRecipe} position="side-one" />}
        {mainTrayLayout !== "full-tray" && <MealBuilderFoodImage recipe={sideTwoRecipe} position="side-two" />}
      </div>
      <div className="mealBuilderTrayRim" aria-hidden="true" />
    </div>
  );
}

function MealChoiceStrip({ label, recipes, selectedId, onSelect, excludeId = "", builderImageIds, categoryOptions, categoryLabel, disabled = false, disabledMessage = "", trayLayouts = null }) {
  const railRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedId) || null;
  const visibleRecipes = useMemo(
    () => {
      const query = searchQuery.trim().toLocaleLowerCase();
      const categoryOrder = new Map(categoryOptions.map(([code], index) => [code, index]));
      return recipes
      .filter((recipe) => recipe.id !== excludeId)
      .filter((recipe) => categoryFilter === "ALL" || categoryCode(recipe) === categoryFilter)
      .filter((recipe) => !query || `${normalizeRecipeTitle(recipe)} ${recipe.id}`.toLocaleLowerCase().includes(query))
      .sort((a, b) => {
        const categoryDifference = (categoryOrder.get(categoryCode(a)) ?? 999) - (categoryOrder.get(categoryCode(b)) ?? 999);
        return categoryDifference || normalizeRecipeTitle(a).localeCompare(normalizeRecipeTitle(b)) || a.id.localeCompare(b.id);
      });
    },
    [categoryFilter, excludeId, recipes, searchQuery],
  );

  function slide(direction) {
    railRef.current?.scrollBy({ top: direction * Math.max(180, railRef.current.clientHeight * 0.62), behavior: "smooth" });
  }

  return (
    <section className={`mealBuilderChoiceColumn${disabled ? " is-disabled" : ""}`} aria-label={`${label} recipe selector`} aria-disabled={disabled || undefined}>
      <div className="mealBuilderChoiceLead">
        <strong>{label}</strong>
        {selectedRecipe ? (
          <button type="button" className="mealBuilderSelectedDish has-selection" onClick={() => onSelect("")} aria-label={`Deselect ${normalizeRecipeTitle(selectedRecipe)}`}>
            <HeroImage recipe={selectedRecipe} /><span>{normalizeRecipeTitle(selectedRecipe)}</span>
          </button>
        ) : <div className="mealBuilderSelectedDish"><span>Choose a Dish</span></div>}
        <label>
          <span>{categoryLabel}</span>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} disabled={disabled}>
            <option value="ALL">All</option>
            {categoryOptions.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
        <label>
          <span>Search by Name</span>
          <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="FILTER" disabled={disabled} />
        </label>
      </div>
      {disabled ? (
        <div className="mealBuilderChoiceDisabled"><strong>{disabledMessage}</strong><span>This tray space is already occupied by the selected main dish.</span></div>
      ) : <div className="mealBuilderChoiceSlider">
        <button type="button" className="mealBuilderSlideButton" onClick={() => slide(-1)} aria-label={`Previous ${label} recipes`}>↑</button>
        <div className="mealBuilderChoiceRail" ref={railRef}>
          {visibleRecipes.map((recipe) => (
            <button
              type="button"
              key={recipe.id}
              className={`mealBuilderChoiceCard${selectedId === recipe.id ? " is-selected" : ""}`}
              onClick={() => onSelect(recipe.id)}
              aria-pressed={selectedId === recipe.id}
            >
              <span className="mealBuilderChoiceImage">
                <HeroImage recipe={recipe} />
                {trayLayouts?.get(recipe.id) === "full-tray" && <span className="mealBuilderTrayTypeBadge">Full Tray</span>}
                {trayLayouts?.get(recipe.id) === "two-thirds" && <span className="mealBuilderTrayTypeBadge">2/3 Tray</span>}
              </span>
              <span className="mealBuilderChoiceTitle">{normalizeRecipeTitle(recipe)}</span>
              <MealChoiceStats recipe={recipe} />
            </button>
          ))}
          {!visibleRecipes.length && <p className="mealBuilderChoiceEmpty">No matching recipes found.</p>}
        </div>
        <button type="button" className="mealBuilderSlideButton" onClick={() => slide(1)} aria-label={`Next ${label} recipes`}>↓</button>
      </div>}
    </section>
  );
}

export default function BuildYourOwnMealPage({
  recipes = [],
  openRecipeCard = () => {},
  savedMeals = [],
  onSaveMeal = () => {},
  onToggleSavedMealFavorite = () => {},
  onDeleteSavedMeal = () => {},
  requestedSavedMealId = "",
  onSavedMealLoaded = () => {},
}) {
  const [mainId, setMainId] = useState("");
  const [sideOneId, setSideOneId] = useState("");
  const [sideTwoId, setSideTwoId] = useState("");
  const [servings, setServings] = useState(4);
  const [eatNow, setEatNow] = useState(2);
  const [refrigerate, setRefrigerate] = useState(0);
  const [showLabelSetup, setShowLabelSetup] = useState(false);
  const [labelQuantity, setLabelQuantity] = useState(1);
  const [labelSettings, setLabelSettings] = useState(loadMealBuilderLabelSettings);
  const [labelPrintDate, setLabelPrintDate] = useState(() => new Date());
  const [activeSavedMealId, setActiveSavedMealId] = useState("");
  const [saveConfirmation, setSaveConfirmation] = useState("");

  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const recipeMap = useMemo(() => new Map(safeRecipes.map((recipe) => [recipe.id, recipe])), [safeRecipes]);
  const mainRecipes = useMemo(() => safeRecipes.filter((recipe) => MAIN_CATEGORIES.some(([code]) => code === categoryCode(recipe))), [safeRecipes]);
  const sideRecipes = useMemo(() => safeRecipes.filter((recipe) => SIDE_CATEGORIES.some(([code]) => code === categoryCode(recipe))), [safeRecipes]);
  const mainRecipe = recipeMap.get(mainId) || null;
  const sideOneRecipe = recipeMap.get(sideOneId) || null;
  const sideTwoRecipe = recipeMap.get(sideTwoId) || null;
  const mainTrayLayout = MEAL_BUILDER_MAIN_LAYOUTS.get(mainId) || "standard";
  const sideOneDisabled = mainTrayLayout === "two-thirds" || mainTrayLayout === "full-tray";
  const sideTwoDisabled = mainTrayLayout === "full-tray";
  const selectedRecipes = [
    mainRecipe,
    ...(mainTrayLayout === "standard" ? [sideOneRecipe, sideTwoRecipe] : mainTrayLayout === "two-thirds" ? [sideTwoRecipe] : []),
  ].filter(Boolean);
  const freezeLater = Math.max(0, servings - eatNow - refrigerate);
  const knownCalories = selectedRecipes.map(recipeCalories).filter((value) => value !== null);
  const totalCalories = selectedRecipes.length && knownCalories.length === selectedRecipes.length ? Math.round(knownCalories.reduce((sum, value) => sum + value, 0)) : null;
  const mealBalanceValues = selectedRecipes.map(recipeMealBalance).filter((value) => value !== null);
  const combinedMealBalance = mealBalanceValues.length ? Math.max(1, Math.min(10, Math.round(mealBalanceValues.reduce((sum, value) => sum + value, 0) / mealBalanceValues.length))) : null;
  const mealLabelTitle = buildMealBuilderLabelTitle(mainRecipe, sideOneRecipe, sideTwoRecipe, mainTrayLayout);
  const activeLabelSheet = MEAL_BUILDER_LABEL_SHEETS[labelSettings.format];
  const activeUnavailableKey = labelSettings.format === "5160" ? "unavailable5160" : "unavailable8163";
  const activeUnavailablePositions = labelSettings[activeUnavailableKey];
  const mealLabelDetails = `${totalCalories === null ? "Calories —" : `${totalCalories} calories`} · MB ${combinedMealBalance ?? "—"} · Printed ${formatMealBuilderPrintDate(labelPrintDate)}`;
  const labelPages = useMemo(
    () => createMealBuilderLabelPages(labelQuantity, activeUnavailablePositions, activeLabelSheet.labelsPerSheet),
    [activeLabelSheet.labelsPerSheet, activeUnavailablePositions, labelQuantity],
  );
  const firstAvailableLabelPosition = Array.from(
    { length: activeLabelSheet.labelsPerSheet },
    (_, index) => index + 1,
  ).find((position) => !activeUnavailablePositions.includes(position)) || activeLabelSheet.labelsPerSheet;
  const firstPagePrintedPositions = new Set(
    (labelPages[0] || []).map((entry, index) => entry ? index + 1 : null).filter(Boolean),
  );

  const safeSavedMeals = Array.isArray(savedMeals) ? savedMeals : [];
  const activeSavedMeal = safeSavedMeals.find((meal) => meal.id === activeSavedMealId) || null;

  useEffect(() => {
    try {
      window.localStorage.setItem(MEAL_BUILDER_LABEL_SETTINGS_KEY, JSON.stringify(labelSettings));
    } catch {
      // Printing remains available when browser storage is disabled.
    }
  }, [labelSettings]);

  useEffect(() => {
    const clearPrintMode = () => {
      document.body.classList.remove("printingMealBuilderLabels", "printingMealBuilderLabelOutlines");
    };
    window.addEventListener("afterprint", clearPrintMode);
    return () => {
      window.removeEventListener("afterprint", clearPrintMode);
      clearPrintMode();
    };
  }, []);

  useEffect(() => {
    if (!requestedSavedMealId) return;
    const savedMeal = safeSavedMeals.find((meal) => meal.id === requestedSavedMealId);
    if (savedMeal) loadSavedMeal(savedMeal);
    onSavedMealLoaded();
  }, [requestedSavedMealId]);

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
  function selectMain(recipeId) {
    const nextLayout = MEAL_BUILDER_MAIN_LAYOUTS.get(recipeId) || "standard";
    setMainId(recipeId);
    if (nextLayout === "two-thirds" || nextLayout === "full-tray") setSideOneId("");
    if (nextLayout === "full-tray") setSideTwoId("");
  }
  function clearBuilder() {
    setMainId(""); setSideOneId(""); setSideTwoId("");
    setServings(4); setEatNow(2); setRefrigerate(0);
    setActiveSavedMealId("");
    setSaveConfirmation("");
  }
  function loadSavedMeal(savedMeal) {
    if (!savedMeal) return;
    const nextMainId = recipeMap.has(savedMeal.mainId) ? savedMeal.mainId : "";
    const nextLayout = MEAL_BUILDER_MAIN_LAYOUTS.get(nextMainId) || "standard";
    setMainId(nextMainId);
    setSideOneId(nextLayout === "standard" && recipeMap.has(savedMeal.sideOneId) ? savedMeal.sideOneId : "");
    setSideTwoId(nextLayout !== "full-tray" && recipeMap.has(savedMeal.sideTwoId) ? savedMeal.sideTwoId : "");
    const nextServings = [2, 4, 6].includes(Number(savedMeal.servings)) ? Number(savedMeal.servings) : 4;
    const nextEatNow = Math.max(0, Math.min(nextServings, Number(savedMeal.eatNow) || 0));
    const nextRefrigerate = Math.max(0, Math.min(nextServings - nextEatNow, Number(savedMeal.refrigerate) || 0));
    setServings(nextServings);
    setEatNow(nextEatNow);
    setRefrigerate(nextRefrigerate);
    setActiveSavedMealId(savedMeal.id);
    setSaveConfirmation(`Loaded ${savedMeal.title || "saved meal"}.`);
  }
  function saveCurrentMeal() {
    if (!mainRecipe) {
      window.alert("Choose a main dish before saving this meal.");
      return;
    }
    const now = new Date().toISOString();
    const savedMeal = {
      id: activeSavedMealId || `BYOM-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      schemaVersion: 1,
      title: mealLabelTitle,
      mainId,
      mainTrayLayout,
      sideOneId: mainTrayLayout === "standard" ? sideOneId : "",
      sideTwoId: mainTrayLayout === "full-tray" ? "" : sideTwoId,
      servings,
      eatNow,
      refrigerate,
      favorite: activeSavedMeal?.favorite || false,
      totalCalories,
      mealBalance: combinedMealBalance,
      createdAt: activeSavedMeal?.createdAt || now,
      updatedAt: now,
    };
    onSaveMeal(savedMeal);
    setActiveSavedMealId(savedMeal.id);
    setSaveConfirmation(`Saved ${savedMeal.title}.`);
  }
  function deleteActiveSavedMeal() {
    if (!activeSavedMeal) return;
    onDeleteSavedMeal(activeSavedMeal.id);
    setActiveSavedMealId("");
    setSaveConfirmation(`Removed ${activeSavedMeal.title}.`);
  }
  function openLabelSetup() {
    if (!mainRecipe) {
      window.alert("Choose a main dish before printing meal labels.");
      return;
    }
    setLabelQuantity(Math.max(1, Math.min(10, freezeLater || 1)));
    setLabelPrintDate(new Date());
    setShowLabelSetup(true);
  }
  function chooseStartingLabelPosition(position) {
    const start = Math.max(1, Math.min(activeLabelSheet.labelsPerSheet, Number(position) || 1));
    setLabelSettings((current) => ({
      ...current,
      [activeUnavailableKey]: Array.from({ length: start - 1 }, (_, index) => index + 1),
    }));
  }
  function toggleUnavailableLabelPosition(position) {
    setLabelSettings((current) => {
      const unavailable = new Set(current[activeUnavailableKey]);
      if (unavailable.has(position)) unavailable.delete(position);
      else if (unavailable.size < activeLabelSheet.labelsPerSheet - 1) unavailable.add(position);
      return { ...current, [activeUnavailableKey]: [...unavailable].sort((a, b) => a - b) };
    });
  }
  function printConfiguredLabels() {
    setLabelPrintDate(new Date());
    document.body.classList.add("printingMealBuilderLabels");
    if (labelSettings.printOutlines) document.body.classList.add("printingMealBuilderLabelOutlines");
    window.setTimeout(() => window.print(), 80);
  }

  return (
    <main className="pageShell buildYourOwnMealPage">
      <section className="buildYourOwnMealIntro" aria-labelledby="build-your-own-meal-title">
        <h1 id="build-your-own-meal-title">See Your Meal Come Together</h1>
        <p>Mix and match a main dish and two sides using recipes already in your Recipe Box.</p>
        <p>Then decide what to eat now, refrigerate, or freeze for later.</p>
      </section>

      <div className="mealBuilderWorkspaceGrid">
        <section className="mealBuilderPreviewColumn" aria-label="Meal tray and calorie overview">
          <MealBuilderTrayPreview mainRecipe={mainRecipe} sideOneRecipe={sideOneRecipe} sideTwoRecipe={sideTwoRecipe} mainTrayLayout={mainTrayLayout} className="mealBuilderTrayPrimary" />
          <div className="mealBuilderTrayRecipeLinks" aria-label="View selected recipe cards">
            <button type="button" disabled={!mainRecipe} onClick={() => mainRecipe && openRecipeCard(mainRecipe.id)} aria-label={mainRecipe ? `View recipe card for ${normalizeRecipeTitle(mainRecipe)}` : "Select a main dish to view its recipe card"}>
              <span>Main</span><strong>{mainRecipe ? "View Recipe" : "Not Selected"}</strong>
            </button>
            <button type="button" disabled={!sideOneRecipe || sideOneDisabled} onClick={() => sideOneRecipe && !sideOneDisabled && openRecipeCard(sideOneRecipe.id)} aria-label={sideOneRecipe && !sideOneDisabled ? `View recipe card for ${normalizeRecipeTitle(sideOneRecipe)}` : "Select Side 1 to view its recipe card"}>
              <span>Side 1</span><strong>{sideOneDisabled ? "Included in Main" : sideOneRecipe ? "View Recipe" : "Not Selected"}</strong>
            </button>
            <button type="button" disabled={!sideTwoRecipe || sideTwoDisabled} onClick={() => sideTwoRecipe && !sideTwoDisabled && openRecipeCard(sideTwoRecipe.id)} aria-label={sideTwoRecipe && !sideTwoDisabled ? `View recipe card for ${normalizeRecipeTitle(sideTwoRecipe)}` : "Select Side 2 to view its recipe card"}>
              <span>Side 2</span><strong>{sideTwoDisabled ? "Included in Main" : sideTwoRecipe ? "View Recipe" : "Not Selected"}</strong>
            </button>
          </div>
          <div className="mealBuilderMealSummaryCard">
            <div className="mealBuilderNutritionSummary" aria-label="Estimated Meal Calories and MealBalance">
              <div className="mealBuilderNutritionTotal">
                <div><strong>{totalCalories ?? "—"}</strong><span>Est Calories</span></div>
                <div className="mealBuilderMbSummary"><span>MB</span><strong>{combinedMealBalance ?? "—"}</strong></div>
              </div>
            </div>
            <div className="mealBuilderPortionPanel" aria-labelledby="meal-builder-portions-title">
              <div className="mealBuilderStepHeading"><h2 id="meal-builder-portions-title">Portion Plan</h2></div>
              <div className="mealBuilderPortionGrid">
                <label><span>Portion</span><select value={servings} onChange={(event) => updateServings(event.target.value)}>{[2, 4, 6].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
                <label><span>Eat Now</span><select value={eatNow} onChange={(event) => updateEatNow(event.target.value)}>{Array.from({ length: servings + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}</select></label>
                <label><span>Refrigerate</span><select value={refrigerate} onChange={(event) => setRefrigerate(Number(event.target.value))}>{Array.from({ length: Math.max(0, servings - eatNow) + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}</select></label>
                <div className="mealBuilderFreezeResult"><span>Freeze</span><strong>{freezeLater}</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mealBuilderDishSelectors" aria-label="Dish selectors">
          <div className="mealBuilderSelectorColumns">
            <MealChoiceStrip label="Main Dish" recipes={mainRecipes} selectedId={mainId} onSelect={selectMain} builderImageIds={MEAL_BUILDER_MAIN_IDS} categoryOptions={MAIN_CATEGORIES} categoryLabel="Sort by Cuisine" trayLayouts={MEAL_BUILDER_MAIN_LAYOUTS} />
            <MealChoiceStrip label="Side 1" recipes={sideRecipes} selectedId={sideOneId} onSelect={setSideOneId} excludeId={sideTwoId} builderImageIds={MEAL_BUILDER_SIDE_IDS} categoryOptions={SIDE_CATEGORIES} categoryLabel="Sort by Type" disabled={sideOneDisabled} disabledMessage={mainTrayLayout === "full-tray" ? "Complete meal — sides included" : "Included with selected main dish"} />
            <MealChoiceStrip label="Side 2" recipes={sideRecipes} selectedId={sideTwoId} onSelect={setSideTwoId} excludeId={sideOneId} builderImageIds={MEAL_BUILDER_SIDE_IDS} categoryOptions={SIDE_CATEGORIES} categoryLabel="Sort by Type" disabled={sideTwoDisabled} disabledMessage="Complete meal — sides included" />
          </div>
        </section>
      </div>

      <div className="mealBuilderActions">
        <div className="mealBuilderSavedMealsBar">
          <label>
            <span>Saved Meals</span>
            <select
              value={activeSavedMealId}
              onChange={(event) => loadSavedMeal(safeSavedMeals.find((meal) => meal.id === event.target.value))}
            >
              <option value="">Choose a saved meal</option>
              {safeSavedMeals.map((meal) => <option key={meal.id} value={meal.id}>{meal.favorite ? "♥ " : ""}{meal.title}</option>)}
            </select>
          </label>
          <button type="button" className="mealBuilderFavoriteSavedButton" disabled={!activeSavedMeal} onClick={() => onToggleSavedMealFavorite(activeSavedMeal.id)} aria-pressed={activeSavedMeal?.favorite || false}>
            <span aria-hidden="true">{activeSavedMeal?.favorite ? "♥" : "♡"}</span>
            {activeSavedMeal?.favorite ? "IN FAVORITES" : "ADD TO FAVORITES"}
          </button>
          <button type="button" className="secondary mealBuilderDeleteSavedButton" disabled={!activeSavedMeal} onClick={deleteActiveSavedMeal}>DELETE SAVED MEAL</button>
        </div>
        {saveConfirmation && <p className="mealBuilderSaveConfirmation" role="status">{saveConfirmation}</p>}
        <div className="mealBuilderActionButtons">
          <button type="button" onClick={saveCurrentMeal}>{activeSavedMeal ? "UPDATE SAVED MEAL" : "SAVE MEAL"}</button>
          <button type="button" onClick={openLabelSetup}>PRINT MEAL LABELS</button>
          <button type="button" className="secondary" onClick={clearBuilder}>CLEAR &amp; START OVER</button>
        </div>
      </div>

      {showLabelSetup && (
        <div className="mealBuilderLabelSetupBackdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowLabelSetup(false);
        }}>
          <section className="mealBuilderLabelSetup" role="dialog" aria-modal="true" aria-labelledby="meal-builder-label-setup-title">
            <header>
              <div>
                <span className="aiBadge">LABEL SHEET SETUP</span>
                <h2 id="meal-builder-label-setup-title">Print Meal Labels</h2>
                <p><strong>{activeLabelSheet.name}</strong> · {activeLabelSheet.description}</p>
              </div>
              <button type="button" className="mealBuilderLabelSetupClose" onClick={() => setShowLabelSetup(false)} aria-label="Close label sheet setup">×</button>
            </header>

            <div className="mealBuilderLabelSetupBody">
              <div className="mealBuilderLabelSheetPicker">
                <div className={`mealBuilderLabelPreview${activeLabelSheet.includesPhoto ? "" : " is-text-only"}`}>
                  {activeLabelSheet.includesPhoto && <MealBuilderTrayPreview mainRecipe={mainRecipe} sideOneRecipe={sideOneRecipe} sideTwoRecipe={sideTwoRecipe} mainTrayLayout={mainTrayLayout} className="mealBuilderLabelTray" />}
                  <div className="mealBuilderLabelPreviewCopy"><strong>{mealLabelTitle}</strong><span>{mealLabelDetails}</span></div>
                </div>
                <div className="mealBuilderLabelPickerHeading">
                  <div><strong>Click any missing or previously used labels.</strong><span>Green positions will print. Gray positions will stay blank.</span></div>
                  <button type="button" className="ghost" onClick={() => setLabelSettings((current) => ({ ...current, [activeUnavailableKey]: [] }))}>Use New Sheet</button>
                </div>
                <div className={`mealBuilderLabelPositionGrid is-avery-${labelSettings.format}`} aria-label={`${activeLabelSheet.labelsPerSheet} ${activeLabelSheet.name} label positions`}>
                  {Array.from({ length: activeLabelSheet.labelsPerSheet }, (_, index) => {
                    const position = index + 1;
                    const unavailable = activeUnavailablePositions.includes(position);
                    const willPrint = firstPagePrintedPositions.has(position);
                    return (
                      <button
                        type="button"
                        key={position}
                        className={unavailable ? "used" : willPrint ? "willPrint" : "available"}
                        aria-pressed={unavailable}
                        aria-label={`Label position ${position}: ${unavailable ? "used" : willPrint ? "will print" : "available"}`}
                        onClick={() => toggleUnavailableLabelPosition(position)}
                      >
                        <strong>{position}</strong>
                        <span>{unavailable ? "USED" : willPrint ? "PRINT" : "OPEN"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className="mealBuilderLabelControls">
                <label><span>Label format</span><select value={labelSettings.format} onChange={(event) => setLabelSettings((current) => ({ ...current, format: event.target.value }))}><option value="8163">Avery 8163 — Photo + Text</option><option value="5160">Avery 5160 — Text Only</option></select></label>
                <label><span>Number of labels</span><select value={labelQuantity} onChange={(event) => setLabelQuantity(Number(event.target.value))}>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label>
                <label><span>Start at label</span><select value={firstAvailableLabelPosition} onChange={(event) => chooseStartingLabelPosition(event.target.value)}>{Array.from({ length: activeLabelSheet.labelsPerSheet }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label>
                <p className="mealBuilderLabelStartHelp">Choosing a starting number marks each earlier position as used. Click any position for further adjustments.</p>
                <div className="mealBuilderLabelPrintSummary">
                  <div><strong>{labelQuantity}</strong><span>Labels to print</span></div>
                  <div><strong>{activeLabelSheet.labelsPerSheet - activeUnavailablePositions.length}</strong><span>Open on first sheet</span></div>
                  <div><strong>{labelPages.length}</strong><span>Sheet{labelPages.length === 1 ? "" : "s"} needed</span></div>
                </div>
                <fieldset>
                  <legend>Printer alignment</legend>
                  <label><span>Left / right adjustment</span><div><input type="number" min="-5" max="5" step="0.1" value={labelSettings.offsetX} onChange={(event) => setLabelSettings((current) => ({ ...current, offsetX: Number(event.target.value) || 0 }))} /><em>mm</em></div></label>
                  <label><span>Up / down adjustment</span><div><input type="number" min="-5" max="5" step="0.1" value={labelSettings.offsetY} onChange={(event) => setLabelSettings((current) => ({ ...current, offsetY: Number(event.target.value) || 0 }))} /><em>mm</em></div></label>
                  <label className="mealBuilderOutlineChoice"><input type="checkbox" checked={labelSettings.printOutlines} onChange={(event) => setLabelSettings((current) => ({ ...current, printOutlines: event.target.checked }))} /><span>Print light outlines for a plain-paper test</span></label>
                </fieldset>
                <div className="mealBuilderLabelSetupActions">
                  <button type="button" className="ghost" onClick={() => setShowLabelSetup(false)}>Cancel</button>
                  <button type="button" onClick={printConfiguredLabels}>Print {labelQuantity} Label{labelQuantity === 1 ? "" : "s"}</button>
                </div>
                <small>In the printer window, use Letter paper, Actual Size or 100%, and turn off browser headers and footers.</small>
              </aside>
            </div>
          </section>
        </div>
      )}

      <section
        className={`mealBuilderLabelSheet is-avery-${labelSettings.format}`}
        aria-hidden="true"
        style={{
          "--meal-builder-label-offset-x": `${labelSettings.offsetX}mm`,
          "--meal-builder-label-offset-y": `${labelSettings.offsetY}mm`,
        }}
      >
        {labelPages.map((page, pageIndex) => (
          <div className="mealBuilderLabelPage" key={`meal-label-page-${pageIndex + 1}`}>
            {page.map((entry, positionIndex) => entry ? (
              <article className={`mealBuilderPrintableLabel${activeLabelSheet.includesPhoto ? "" : " is-text-only"}`} key={entry.key}>
                {activeLabelSheet.includesPhoto && <MealBuilderTrayPreview mainRecipe={mainRecipe} sideOneRecipe={sideOneRecipe} sideTwoRecipe={sideTwoRecipe} mainTrayLayout={mainTrayLayout} className="mealBuilderLabelTray" />}
                <div className="mealBuilderPrintableLabelCopy"><strong>{mealLabelTitle}</strong><span>{mealLabelDetails}</span></div>
              </article>
            ) : <div className="mealBuilderPrintableLabel empty" key={`empty-${pageIndex}-${positionIndex}`} />)}
          </div>
        ))}
      </section>
    </main>
  );
}
