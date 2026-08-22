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
  "AM-001", "AM-005", "AM-007", "AM-008", "AM-010", "AM-015", "AM-018", "AM-020", "AM-037", "AM-041", "AM-053",
  "AM-017", "AM-019", "AM-021", "AM-022", "AM-023", "AM-024", "AM-025", "AM-026", "AM-027", "AM-028",
  "AM-029", "AM-030", "AM-031", "AM-032", "AM-033", "AM-034", "AM-035", "AM-036", "AM-038", "AM-039",
  "AM-040", "AM-042", "AM-043", "AM-044", "AM-045", "AM-046", "AM-047", "AM-048", "AM-049", "AM-050",
  "AM-051", "AM-052", "AM-054", "AM-055", "AM-056", "AM-057", "AM-058", "AM-059", "AM-060", "AM-061",
  "AM-062", "AM-064", "AM-065", "AM-066", "AM-067", "AM-068", "AM-069", "AM-070", "AM-071", "AM-072",
  "AM-073", "AM-074", "AM-075", "AM-076", "AM-077", "AM-078",
  "AS-001", "AS-002", "AS-003", "AS-004", "AS-005", "AS-006", "AS-007", "AS-008", "AS-009", "AS-010",
  "AS-011", "AS-012", "AS-013", "AS-014", "AS-015", "AS-016", "AS-017", "AS-018", "AS-019",
]);
const MEAL_BUILDER_SIDE_IDS = new Set([
  "SD-001", "SD-004", "SD-005", "SD-007", "SD-008", "SD-009", "SD-010", "SD-012", "SD-025",
]);
const MEAL_BUILDER_MAIN_LAYOUTS = new Map([
  ["AM-005", "full-tray"],
  ["AM-015", "two-thirds"],
  ["AM-073", "full-tray"],
  ["AM-074", "full-tray"],
  ["AM-075", "full-tray"],
  ["AM-076", "full-tray"],
  ["AM-077", "full-tray"],
  ["AM-078", "full-tray"],
  ["AS-001", "two-thirds"],
  ["AS-002", "two-thirds"],
  ["AS-003", "two-thirds"],
  ["AS-004", "two-thirds"],
  ["AS-005", "two-thirds"],
  ["AS-006", "two-thirds"],
  ["AS-007", "two-thirds"],
  ["AS-008", "two-thirds"],
  ["AS-009", "two-thirds"],
  ["AS-010", "two-thirds"],
  ["AS-011", "two-thirds"],
  ["AS-012", "two-thirds"],
  ["AS-013", "two-thirds"],
  ["AS-014", "two-thirds"],
  ["AS-015", "two-thirds"],
  ["AS-016", "two-thirds"],
  ["AS-017", "two-thirds"],
  ["AS-018", "full-tray"],
  ["AS-019", "full-tray"],
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
  if (!mainRecipe) return "Build Your Own Meal";
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

function MealNutritionLine({ label, recipe, includedMessage = "" }) {
  const calories = recipeCalories(recipe);
  return (
    <div className={`mealBuilderNutritionLine${includedMessage ? " is-included" : ""}`}>
      <span>{label}</span>
      <strong>{includedMessage || (recipe ? normalizeRecipeTitle(recipe) : "Choose a recipe")}</strong>
      <b>{includedMessage ? "Included" : calories === null ? "—" : `${Math.round(calories)} calories`}</b>
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

function MealBuilderFoodImage({ recipe, position, expanded = false }) {
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
    <div className={`mealBuilderTrayFood mealBuilderTrayFood-${position} mealBuilderTrayFood-recipe-${recipe.id.toLowerCase()}${expanded ? " is-expanded" : ""}`}>
      <img src={`${import.meta.env.BASE_URL}images/meal-builder/${folder}/${recipe.id}.webp`} alt="" />
    </div>
  );
}

function MealBuilderTrayPreview({ mainRecipe, sideOneRecipe, sideTwoRecipe, mainTrayLayout, className = "" }) {
  return (
    <div className={`mealBuilderTray${className ? ` ${className}` : ""}`} aria-label="Preview of the selected main dish and two sides">
      <img className="mealBuilderTrayBase" src={`${import.meta.env.BASE_URL}images/meal-builder/meal-builder-tray-base.webp`} alt="Empty white rectangular meal-prep tray" />
      <div className={`mealBuilderTrayInterior is-${mainTrayLayout}`} aria-hidden="true">
        <MealBuilderFoodImage recipe={mainRecipe} position="main" expanded={mainTrayLayout !== "standard"} />
        {mainTrayLayout === "standard" && <MealBuilderFoodImage recipe={sideOneRecipe} position="side-one" />}
        {mainTrayLayout !== "full-tray" && <MealBuilderFoodImage recipe={sideTwoRecipe} position="side-two" />}
      </div>
      <div className="mealBuilderTrayRim" aria-hidden="true" />
    </div>
  );
}

function MealChoiceStrip({ label, categories, category, onCategoryChange, recipes, selectedId, onSelect, excludeId = "", builderImageIds, disabled = false, disabledMessage = "", trayLayouts = null }) {
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
    <section className={`mealBuilderChoiceStrip${disabled ? " is-disabled" : ""}`} aria-label={`${label} recipe selector`} aria-disabled={disabled || undefined}>
      <div className="mealBuilderChoiceLead">
        <strong>{label}</strong>
        <label>
          <span>Search by Name</span>
          <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Enter recipe name" disabled={disabled} />
        </label>
        <label>
          <span>Sort by Cuisine</span>
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)} disabled={disabled}>
            {categories.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
      </div>
      {disabled ? (
        <div className="mealBuilderChoiceDisabled"><strong>{disabledMessage}</strong><span>This tray space is already occupied by the selected main dish.</span></div>
      ) : <div className="mealBuilderChoiceSlider">
        <button type="button" className="mealBuilderSlideButton" onClick={() => slide(-1)} aria-label={`Previous ${label} recipes`}>‹</button>
        <div className="mealBuilderChoiceRail" ref={railRef}>
          {visibleRecipes.map((recipe) => (
            <button type="button" key={recipe.id} className={`mealBuilderChoiceCard${selectedId === recipe.id ? " is-selected" : ""}`} onClick={() => onSelect(recipe.id)} aria-pressed={selectedId === recipe.id}>
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
        <button type="button" className="mealBuilderSlideButton" onClick={() => slide(1)} aria-label={`Next ${label} recipes`}>›</button>
      </div>}
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
  const [showLabelSetup, setShowLabelSetup] = useState(false);
  const [labelQuantity, setLabelQuantity] = useState(1);
  const [labelSettings, setLabelSettings] = useState(loadMealBuilderLabelSettings);
  const [labelPrintDate, setLabelPrintDate] = useState(() => new Date());

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

      <div className="mealBuilderTopGrid">
        <MealBuilderTrayPreview mainRecipe={mainRecipe} sideOneRecipe={sideOneRecipe} sideTwoRecipe={sideTwoRecipe} mainTrayLayout={mainTrayLayout} className="mealBuilderTrayPrimary" />

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
            <MealNutritionLine label="Side 1" recipe={sideOneRecipe} includedMessage={sideOneDisabled ? "Included with main dish" : ""} />
            <MealNutritionLine label="Side 2" recipe={sideTwoRecipe} includedMessage={sideTwoDisabled ? "Included with main dish" : ""} />
            <div className="mealBuilderNutritionTotal">
              <div><strong>{totalCalories ?? "—"}</strong><span>Est Calories</span></div>
              <div className="mealBuilderMbSummary"><span>MB</span><strong>{combinedMealBalance ?? "—"}</strong></div>
            </div>
          </div>
        </section>
      </div>

      <div className="mealBuilderSelectorStack">
        <MealChoiceStrip label="Main Dish" categories={MAIN_CATEGORIES} category={mainCategory} onCategoryChange={setMainCategory} recipes={mainRecipes} selectedId={mainId} onSelect={selectMain} builderImageIds={MEAL_BUILDER_MAIN_IDS} trayLayouts={MEAL_BUILDER_MAIN_LAYOUTS} />
        <MealChoiceStrip label="Side 1" categories={SIDE_CATEGORIES} category={sideOneCategory} onCategoryChange={setSideOneCategory} recipes={sideRecipes} selectedId={sideOneId} onSelect={setSideOneId} excludeId={sideTwoId} builderImageIds={MEAL_BUILDER_SIDE_IDS} disabled={sideOneDisabled} disabledMessage={mainTrayLayout === "full-tray" ? "Complete meal — sides included" : "Included with selected main dish"} />
        <MealChoiceStrip label="Side 2" categories={SIDE_CATEGORIES} category={sideTwoCategory} onCategoryChange={setSideTwoCategory} recipes={sideRecipes} selectedId={sideTwoId} onSelect={setSideTwoId} excludeId={sideOneId} builderImageIds={MEAL_BUILDER_SIDE_IDS} disabled={sideTwoDisabled} disabledMessage="Complete meal — sides included" />
      </div>

      <div className="mealBuilderActions">
        <div className="mealBuilderActionButtons">
          <button type="button" onClick={openLabelSetup}>Print Meal Labels</button>
          <button type="button" className="secondary" onClick={clearBuilder}>Clear &amp; Start Over</button>
        </div>
        <p>Choose Avery 8163 photo labels or Avery 5160 text-only labels. Both include calories, MealBalance, and the date printed.</p>
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
