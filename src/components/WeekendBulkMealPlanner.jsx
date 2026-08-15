import { useEffect, useMemo, useState } from "react";
import { sortRecipesByCode } from "../utils/recipeSorting";
import {
  WEEKEND_LABEL_SHEET,
  createWeekendLabelEntries,
  createWeekendLabelPages,
  formatCompactLabelDate,
  localDateInputValue,
} from "../utils/weekendBulkLabels";
import HelpTooltip from "./HelpTooltip";
import "./WeekendBulkMealPlanner.css";
import "./WeekendBulkMealPlanner.v51.css";

const STORAGE_KEY = "rrb_weekendBulkMealPlanner_v1";
const LABEL_SETTINGS_KEY = "rrb_weekendBulkLabelSettings_v1";

const PLAN_TYPES = [
  { key: "ALL", label: "All Recipes", icon: "images/icons/AL.png" },
  { key: "FAVORITES", label: "Your Favorites", icon: "images/icons/favorites.webp" },
  { key: "SG", label: "Meats", icon: "images/icons/SG.webp" },
  { key: "CP", label: "Crock Pot", icon: "images/icons/CP-bulk.png" },
  { key: "CS", label: "Casseroles", icon: "images/icons/CS.webp" },
  { key: "SD", label: "Side Dishes", icon: "images/icons/SD.webp" },
  { key: "DS", label: "Desserts", icon: "images/icons/DS-bulk.png" },
];

function parseLocalDateInput(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, monthIndex, day, 12, 0, 0, 0);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function addDaysToInputDate(value, days) {
  const date = parseLocalDateInput(value);
  if (!date) return "";
  date.setDate(date.getDate() + Number(days || 0));
  return localDateInputValue(date);
}

function addMonthsToInputDate(value, months) {
  const date = parseLocalDateInput(value);
  if (!date) return "";

  const originalDay = date.getDate();
  const target = new Date(date.getFullYear(), date.getMonth() + Number(months || 0), 1, 12, 0, 0, 0);
  const lastDayOfTargetMonth = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
    12,
    0,
    0,
    0,
  ).getDate();

  target.setDate(Math.min(originalDay, lastDayOfTargetMonth));
  return localDateInputValue(target);
}

function defaultBulkUseByDates(createdDate) {
  return {
    refrigeratorUseBy: addDaysToInputDate(createdDate, 7),
    freezeUseBy: addMonthsToInputDate(createdDate, 3),
  };
}

const BULK_BASES = [
  { id: "BASE-001", title: "Cooked Ground Beef", detail: "Freeze flat in meal-size portions for tacos, pasta, chili, or casseroles.", defaultPortions: 8 },
  { id: "BASE-002", title: "Shredded Chicken", detail: "Use in salads, sandwiches, soups, enchiladas, and quick casseroles.", defaultPortions: 8 },
  { id: "BASE-003", title: "Pulled Pork", detail: "Package plain or lightly seasoned for sandwiches, bowls, tacos, and pizza.", defaultPortions: 8 },
  { id: "BASE-004", title: "Cooked Rice", detail: "Cool quickly and freeze in one- or two-meal portions.", defaultPortions: 10 },
  { id: "BASE-005", title: "Cooked Pasta", detail: "Cook just shy of tender and portion for quick skillets, soups, or baked meals.", defaultPortions: 8 },
  { id: "BASE-006", title: "Seasoned Beans", detail: "Portion for bowls, side dishes, chili, soups, and Mexican meals.", defaultPortions: 8 },
  { id: "BASE-007", title: "Roasted Vegetables", detail: "Prepare a flexible mix for bowls, omelets, side dishes, and pasta.", defaultPortions: 8 },
  { id: "BASE-008", title: "Mashed Potatoes", detail: "Freeze in individual or dinner-size portions for fast side dishes.", defaultPortions: 8 },
  { id: "BASE-009", title: "Soup or Sauce Starter", detail: "Freeze concentrated bases in measured portions for later meals.", defaultPortions: 6 },
  { id: "BASE-010", title: "Breakfast Egg Portions", detail: "Bake and portion for quick breakfasts, sandwiches, or bowls.", defaultPortions: 8 },
];

const PACKAGE_OPTIONS = [
  "Quart freezer bag",
  "Gallon freezer bag",
  "Vacuum-seal bag",
  "8oz deli container",
  "16oz deli container",
  "32oz deli container",
  "5.5oz mini foil pans",
  "24oz foil freezer pan",
  "29oz craft freezer box",
  "Silicone freezer block",
  "Other (see notes)",
];

const DESTINATIONS = [
  { value: "freezer", label: "Freezer" },
  { value: "refrigerator", label: "Refrigerator" },
  { value: "both", label: "Both" },
];

function safeLoadPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === "object") {
      return {
        weekendName: saved.weekendName || "This Weekend",
        prepDay: saved.prepDay || "Saturday",
        notes: saved.notes || "",
        items: Array.isArray(saved.items) ? saved.items.map((item) => {
          const legacyPackages = {
            "1-cup deli container": "8oz deli container",
            "2-cup deli container": "16oz deli container",
            "3-cup meal container": "24oz foil freezer pan",
            "5-cup family container": "32oz deli container",
            "Foil freezer pan": "24oz foil freezer pan",
            "Glass refrigerator container": "Other (see notes)",
          };
          const createdDate = item.createdDate || localDateInputValue();
          const defaultDates = defaultBulkUseByDates(createdDate);

          return {
            ...item,
            finish: item.finish || "Whole",
            package: legacyPackages[item.package] || item.package || "Quart freezer bag",
            labelQuantity: Math.max(0, Number(item.labelQuantity ?? item.batches ?? 1)),
            createdDate,
            refrigeratorUseBy: item.refrigeratorUseBy || defaultDates.refrigeratorUseBy,
            freezeUseBy: item.freezeUseBy || defaultDates.freezeUseBy,
          };
        }) : [],
      };
    }
  } catch {
    // Use the clean starter plan when saved browser data cannot be read.
  }
  return { weekendName: "This Weekend", prepDay: "Saturday", notes: "", items: [] };
}

function safeLoadLabelSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(LABEL_SETTINGS_KEY));
    if (saved && typeof saved === "object") {
      return {
        unavailablePositions: Array.isArray(saved.unavailablePositions)
          ? saved.unavailablePositions.map(Number).filter((position) => position >= 1 && position <= 30)
          : [],
        offsetX: Math.max(-5, Math.min(5, Number(saved.offsetX) || 0)),
        offsetY: Math.max(-5, Math.min(5, Number(saved.offsetY) || 0)),
        printOutlines: Boolean(saved.printOutlines),
      };
    }
  } catch {
    // Use the standard sheet settings when saved browser data cannot be read.
  }
  return { unavailablePositions: [], offsetX: 0, offsetY: 0, printOutlines: false };
}

function recipeCode(recipe) {
  return String(recipe?.categoryCode || recipe?.id || "").split("-")[0].toUpperCase();
}

function recipeSearchText(recipe) {
  return [
    recipe?.id,
    recipe?.title,
    recipe?.category,
    recipe?.categoryCode,
    recipe?.cookingMethod,
    recipe?.method,
    ...(Array.isArray(recipe?.collections) ? recipe.collections : []),
    ...(Array.isArray(recipe?.tags) ? recipe.tags : []),
  ].filter(Boolean).join(" ").toLowerCase();
}

function imageCandidates(item) {
  if (item.sourceType === "base") return ["images/recipes/AM-000.webp"];
  return [
    item.heroImage,
    `images/thumbs/heroes/${item.id}.webp`,
    `images/heroes/${item.id}.webp`,
    `images/thumbs/recipes/${item.id}.webp`,
    `images/recipes/${item.id}.webp`,
    "images/recipes/AM-000.webp",
  ].filter(Boolean);
}

function PlannerImage({ item }) {
  const candidates = useMemo(() => imageCandidates(item), [item.id, item.sourceType]);
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [item.id]);
  return (
    <img
      src={`${import.meta.env.BASE_URL}${candidates[index]}`}
      alt=""
      onError={() => setIndex((current) => Math.min(current + 1, candidates.length - 1))}
    />
  );
}

function makePlanItem(item, type, prepDay) {
  const createdDate = localDateInputValue();
  const defaultDates = defaultBulkUseByDates(createdDate);

  return {
    uid: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    id: item.id,
    title: item.title,
    type,
    sourceType: item.sourceType || "recipe",
    batches: 1,
    portions: Number(item.defaultPortions || item.servings || 4),
    destination: "both",
    refrigeratorPortions: 2,
    package: type === "DS" ? "8oz deli container" : "Quart freezer bag",
    day: prepDay,
    finish: "Whole",
    labelNote: "",
    labelQuantity: 1,
    createdDate,
    refrigeratorUseBy: defaultDates.refrigeratorUseBy,
    freezeUseBy: defaultDates.freezeUseBy,
    completed: false,
  };
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export default function WeekendBulkMealPlanner({ recipes = [], favorites = [], openRecipeCard }) {
  const [plan, setPlan] = useState(safeLoadPlan);
  const [labelSettings, setLabelSettings] = useState(safeLoadLabelSettings);
  const [showLabelSetup, setShowLabelSetup] = useState(false);
  const [activeType, setActiveType] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem(LABEL_SETTINGS_KEY, JSON.stringify(labelSettings));
  }, [labelSettings]);

  const catalog = useMemo(() => {
    const matchingRecipes = activeType === "ALL"
      ? recipes
      : activeType === "FAVORITES"
        ? recipes.filter((recipe) => favorites.includes(recipe.id))
        : recipes.filter((recipe) => recipeCode(recipe) === activeType);
    return sortRecipesByCode(matchingRecipes).map((recipe) => ({ ...recipe, sourceType: "recipe" }));
  }, [activeType, favorites, recipes]);

  const filteredCatalog = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return catalog;
    const searchableCatalog = term
      ? recipes.map((recipe) => ({ ...recipe, sourceType: "recipe" }))
      : catalog;
    return sortRecipesByCode(
      searchableCatalog.filter((item) => `${item.id} ${item.title} ${item.detail || ""}`.toLowerCase().includes(term)),
    );
  }, [catalog, recipes, search]);

  const summary = useMemo(() => {
    const totalBatches = plan.items.reduce((sum, item) => sum + Number(item.batches || 0), 0);
    const totalPortions = plan.items.reduce((sum, item) => sum + Number(item.portions || 0) * Number(item.batches || 1), 0);
    const refrigerator = plan.items.reduce((sum, item) => {
      if (item.destination === "refrigerator") return sum + Number(item.portions || 0) * Number(item.batches || 1);
      if (item.destination === "both") return sum + Math.min(Number(item.refrigeratorPortions || 0), Number(item.portions || 0) * Number(item.batches || 1));
      return sum;
    }, 0);
    return { totalBatches, totalPortions, refrigerator, freezer: Math.max(0, totalPortions - refrigerator) };
  }, [plan.items]);

  const labelEntries = useMemo(() => createWeekendLabelEntries(plan.items), [plan.items]);
  const labelPages = useMemo(
    () => createWeekendLabelPages(labelEntries, labelSettings.unavailablePositions),
    [labelEntries, labelSettings.unavailablePositions],
  );
  const firstAvailablePosition = Array.from(
    { length: WEEKEND_LABEL_SHEET.labelsPerSheet },
    (_, index) => index + 1,
  ).find((position) => !labelSettings.unavailablePositions.includes(position)) || WEEKEND_LABEL_SHEET.labelsPerSheet;
  const firstPagePrintedPositions = new Set(
    (labelPages[0] || []).map((entry, index) => entry ? index + 1 : null).filter(Boolean),
  );

  function updatePlan(patch) {
    setPlan((current) => ({ ...current, ...patch }));
  }

  function addItem(item) {
    setPlan((current) => ({
      ...current,
      items: [...current.items, makePlanItem(item, activeType, current.prepDay)],
    }));
  }

  function updateItem(uid, patch) {
    setPlan((current) => ({
      ...current,
      items: current.items.map((item) => item.uid === uid ? { ...item, ...patch } : item),
    }));
  }

  function updateCreatedDate(uid, createdDate) {
    const defaultDates = defaultBulkUseByDates(createdDate);
    updateItem(uid, {
      createdDate,
      refrigeratorUseBy: defaultDates.refrigeratorUseBy,
      freezeUseBy: defaultDates.freezeUseBy,
    });
  }

  function removeItem(uid) {
    setPlan((current) => ({ ...current, items: current.items.filter((item) => item.uid !== uid) }));
  }

  function clearPlan() {
    if (!window.confirm("Clear every item from this weekend bulk plan?")) return;
    setPlan((current) => ({ ...current, items: [], notes: "" }));
  }

  function downloadPlan() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), ...plan }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "weekend-bulk-meal-plan.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function downloadLabels() {
    const rows = [["Recipe title", "Recipe code", "Finish", "Package", "Date created", "Refrigerator use by", "Freeze use by", "Label number", "Label quantity"]];
    plan.items.forEach((item) => {
      const labelQuantity = Math.max(0, Number(item.labelQuantity || 0));
      Array.from({ length: labelQuantity }, (_, labelIndex) => rows.push([
        item.title,
        item.id,
        item.finish || "Whole",
        item.package,
        item.createdDate || "",
        item.refrigeratorUseBy || "",
        item.freezeUseBy || "",
        labelIndex + 1,
        labelQuantity,
      ]));
    });
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "weekend-bulk-meal-labels.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function printLabels() {
    if (!labelEntries.length) {
      window.alert("Add at least one food and choose at least one label before printing labels.");
      return;
    }
    setShowLabelSetup(true);
  }

  function printConfiguredLabels() {
    document.body.classList.add("printingWeekendLabels");
    if (labelSettings.printOutlines) document.body.classList.add("printingWeekendLabelOutlines");
    window.setTimeout(() => window.print(), 50);
  }

  function chooseStartingPosition(position) {
    const start = Math.max(1, Math.min(WEEKEND_LABEL_SHEET.labelsPerSheet, Number(position) || 1));
    setLabelSettings((current) => ({
      ...current,
      unavailablePositions: Array.from({ length: start - 1 }, (_, index) => index + 1),
    }));
  }

  function toggleUnavailablePosition(position) {
    setLabelSettings((current) => {
      const unavailable = new Set(current.unavailablePositions);
      if (unavailable.has(position)) unavailable.delete(position);
      else unavailable.add(position);
      return { ...current, unavailablePositions: [...unavailable].sort((a, b) => a - b) };
    });
  }

  function printCookingOverview() {
    if (!plan.items.length) {
      window.alert("Add at least one food to My Cooking Plan before printing the overview.");
      return;
    }
    document.body.classList.add("printingWeekendOverview");
    window.setTimeout(() => window.print(), 50);
  }

  useEffect(() => {
    const cleanup = () => {
      document.body.classList.remove("printingWeekendLabels");
      document.body.classList.remove("printingWeekendLabelOutlines");
      document.body.classList.remove("printingWeekendOverview");
    };
    window.addEventListener("afterprint", cleanup);
    return () => window.removeEventListener("afterprint", cleanup);
  }, []);

  return (
    <main className="weekendBulkPage pageShell">
      <section className="weekendBulkIntro">
        <div className="weekendBulkIntroCopy">
          <span className="aiBadge">WEEKEND PRODUCTION PLAN</span>
          <h2>
            <span>Plan, shop &amp; cook once.</span>
            <span>Relax &amp; save for weeks.</span>
          </h2>
          <p>Build a plan that fits your equipment, available time, household size, and freezer space. Your selections and packaging notes stay in this browser so you can return to the plan while you shop, cook, cool, label, and store everything.</p>
        </div>
        <div className="weekendBulkPlanName">
          <label>
            <span>Plan name</span>
            <input value={plan.weekendName} onChange={(event) => updatePlan({ weekendName: event.target.value })} />
          </label>
          <label>
            <span>Main prep day</span>
            <select value={plan.prepDay} onChange={(event) => updatePlan({ prepDay: event.target.value })}>
              <option>Saturday</option>
              <option>Sunday</option>
              <option>Both days</option>
            </select>
          </label>
          <div className="weekendBulkCounterRow">
            <div className="weekendBulkMiniStat"><strong>{plan.items.length}</strong><span>Foods selected</span></div>
            <div className="weekendBulkMiniStat"><strong>{summary.totalBatches}</strong><span>Total batches</span></div>
            <div className="weekendBulkMiniStat"><strong>{summary.refrigerator}</strong><span>Refrigerator portions</span></div>
            <div className="weekendBulkMiniStat"><strong>{summary.freezer}</strong><span>Freezer portions</span></div>
          </div>
        </div>
      </section>

      <section className="weekendBulkTypeTabs" role="tablist" aria-label="Bulk cooking groups">
        {PLAN_TYPES.map((type) => (
          <button
            key={type.key}
            type="button"
            role="tab"
            aria-selected={activeType === type.key}
            className={activeType === type.key ? "active" : ""}
            onClick={() => { setActiveType(type.key); setSearch(""); }}
          >
            <span className="weekendBulkTypeIcon"><img src={`${import.meta.env.BASE_URL}${type.icon}`} alt="" /></span>
            <strong>{type.label}</strong>
          </button>
        ))}
      </section>

      <section className="weekendBulkTray" aria-label="Food selection tray">
          <div className="weekendBulkSearchRow">
            <label className="weekendBulkSearch">
              <span>Search all recipes</span>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the full library by recipe name or code" />
            </label>
            <div className="weekendBulkCatalogCount">{filteredCatalog.length} choices shown · scroll right to see more</div>
          </div>

          <div className="weekendBulkCatalog">
            {filteredCatalog.map((item) => (
              <article className="weekendBulkCatalogCard" key={item.id}>
                <PlannerImage item={item} />
                <div className="weekendBulkCatalogBody">
                  <small>{item.id}</small>
                  <strong>{item.title}</strong>
                  <div className="weekendBulkCatalogActions">
                    {item.sourceType === "recipe" && openRecipeCard && (
                      <button type="button" className="ghost" onClick={() => openRecipeCard(item.id, recipes, "Weekend Bulk Meal Planner")}>VIEW</button>
                    )}
                    <button type="button" onClick={() => addItem(item)}>ADD</button>
                  </div>
                </div>
              </article>
            ))}
            {!filteredCatalog.length && (
              <div className="weekendBulkEmpty">No matching choices were found in this group.</div>
            )}
          </div>
      </section>

      <section className="weekendBulkPlan" aria-label="Weekend bulk meal plan">
          <div className="weekendBulkPlanHeader">
            <div>
              <span className="aiBadge">MY COOKING PLAN</span>
              <h2>My Cooking Plan</h2>
            </div>
            <div className="weekendBulkHeaderActions">
              <button type="button" onClick={() => window.print()}>Print</button>
              <span className="helpTooltipAction">
                <button type="button" onClick={printCookingOverview}>Print Cooking Overview</button>
                <HelpTooltip placement="bottom" text="Prints a cook-day summary with the meal order, quantities, packaging details, notes, and safety reminders." />
              </span>
              <span className="helpTooltipAction">
                <button type="button" onClick={printLabels}>Print Labels</button>
                <HelpTooltip placement="bottom" text="Opens the L LIKED 30-label sheet setup so you can skip used positions, preview placement, adjust alignment, and print the exact quantity selected." />
              </span>
              <span className="helpTooltipAction">
                <button type="button" onClick={downloadLabels}>Labels CSV</button>
                <HelpTooltip placement="bottom" text="Downloads one CSV row for every label requested, ready for a label-printing or mail-merge program." />
              </span>
              <span className="helpTooltipAction">
                <button type="button" onClick={downloadPlan}>Save Copy</button>
                <HelpTooltip placement="bottom" text="Downloads a JSON backup of this weekend plan. Your working plan also remains saved in this browser." />
              </span>
              <span className="helpTooltipAction">
                <button type="button" className="danger" onClick={clearPlan}>Clear</button>
                <HelpTooltip placement="bottom" text="Removes every recipe and the weekend notes from this plan after you confirm." />
              </span>
            </div>
          </div>

          {!plan.items.length ? (
            <div className="weekendBulkEmptyPlan">
              <span>▦</span>
              <h3>Your weekend plan is empty.</h3>
              <p>Choose a cooking group on the left and add recipes or base foods.</p>
            </div>
          ) : (
            <div className="weekendBulkPlanList">
              {plan.items.map((item, index) => (
                <article className={item.completed ? "weekendBulkPlanCard completed" : "weekendBulkPlanCard"} key={item.uid}>
                  <div className="weekendBulkPlanCardTop">
                    <label className="weekendBulkComplete">
                      <input type="checkbox" checked={item.completed} onChange={(event) => updateItem(item.uid, { completed: event.target.checked })} />
                      <span>Done</span>
                    </label>
                    <div className="weekendBulkPlanThumb"><PlannerImage item={item} /></div>
                    <div className="weekendBulkPlanIdentity">
                      <span>#{index + 1}</span>
                      <h3>{item.title}</h3>
                      <small>{item.id}</small>
                    </div>
                    <div className="weekendBulkHeaderFields">
                      <label><span>Batches</span><input type="number" min="1" max="20" value={item.batches} onChange={(event) => updateItem(item.uid, { batches: Math.max(1, Number(event.target.value) || 1) })} /></label>
                      <label><span>Portions</span><input type="number" min="1" max="50" value={item.portions} onChange={(event) => updateItem(item.uid, { portions: Math.max(1, Number(event.target.value) || 1) })} /></label>
                      <label><span>Store</span><select value={item.destination} onChange={(event) => updateItem(item.uid, { destination: event.target.value })}>{DESTINATIONS.map((destination) => <option key={destination.value} value={destination.value}>{destination.label}</option>)}</select></label>
                      <label><span>Refrigerator</span><input type="number" min="0" max="50" disabled={item.destination !== "both"} value={item.destination === "both" ? item.refrigeratorPortions : item.destination === "refrigerator" ? item.portions : 0} onChange={(event) => updateItem(item.uid, { refrigeratorPortions: Math.max(0, Number(event.target.value) || 0) })} /></label>
                      <label><span className="helpTooltipLabel">Labels <HelpTooltip text="Choose how many labels this recipe should create. This quantity is used by both Print Labels and Labels CSV." /></span><select value={item.labelQuantity ?? 1} onChange={(event) => updateItem(item.uid, { labelQuantity: Number(event.target.value) })}>{Array.from({ length: 21 }, (_, quantity) => <option key={quantity} value={quantity}>{quantity}</option>)}</select></label>
                    </div>
                    <button type="button" className="weekendBulkRemove" onClick={() => removeItem(item.uid)} aria-label={`Remove ${item.title}`}>×</button>
                  </div>

                  <div className="weekendBulkFields">
                    <label><span className="helpTooltipLabel">Finish <HelpTooltip text="Records how the food will be portioned before storage: whole, sliced, cubed, or shredded." /></span><select value={item.finish || "Whole"} onChange={(event) => updateItem(item.uid, { finish: event.target.value })}><option>Whole</option><option>Sliced</option><option>Cubed</option><option>Shredded</option></select></label>
                    <label><span className="helpTooltipLabel">Package in <HelpTooltip text="Select the bag, pan, container, or freezer block you plan to use for this recipe." /></span><select value={item.package} onChange={(event) => updateItem(item.uid, { package: event.target.value })}>{PACKAGE_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label>
                    <label><span>Prep day</span><select value={item.day} onChange={(event) => updateItem(item.uid, { day: event.target.value })}><option>Saturday</option><option>Sunday</option></select></label>
                    <label><span>Label / finishing note</span><input value={item.labelNote} onChange={(event) => updateItem(item.uid, { labelNote: event.target.value })} placeholder="Thaw overnight; add sauce" /></label>
                    <label><span>Date created</span><input type="date" value={item.createdDate || ""} onChange={(event) => updateCreatedDate(item.uid, event.target.value)} /></label>
                    <label><span>Refrigerator use by</span><input type="date" value={item.refrigeratorUseBy || ""} onChange={(event) => updateItem(item.uid, { refrigeratorUseBy: event.target.value })} /></label>
                    <label><span>Freeze use by</span><input type="date" value={item.freezeUseBy || ""} onChange={(event) => updateItem(item.uid, { freezeUseBy: event.target.value })} /></label>
                  </div>
                </article>
              ))}
            </div>
          )}

      </section>

      {showLabelSetup && (
        <div className="weekendBulkLabelSetupBackdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowLabelSetup(false);
        }}>
          <section className="weekendBulkLabelSetup" role="dialog" aria-modal="true" aria-labelledby="weekend-label-setup-title">
            <header>
              <div>
                <span className="aiBadge">LABEL SHEET SETUP</span>
                <h2 id="weekend-label-setup-title">Print My Freezer Labels</h2>
                <p><strong>{WEEKEND_LABEL_SHEET.name}</strong> · Letter size · 3 columns × 10 rows · 1″ × 2⅝″ labels</p>
              </div>
              <button type="button" className="weekendBulkLabelSetupClose" onClick={() => setShowLabelSetup(false)} aria-label="Close label sheet setup">×</button>
            </header>

            <div className="weekendBulkLabelSetupBody">
              <div className="weekendBulkLabelSheetPicker">
                <div className="weekendBulkLabelPickerHeading">
                  <div><strong>Click any missing or previously used labels.</strong><span>Green positions will receive labels. Gray positions will stay blank.</span></div>
                  <button type="button" className="ghost" onClick={() => setLabelSettings((current) => ({ ...current, unavailablePositions: [] }))}>Use New Sheet</button>
                </div>
                <div className="weekendBulkLabelPositionGrid" aria-label="Thirty label positions">
                  {Array.from({ length: WEEKEND_LABEL_SHEET.labelsPerSheet }, (_, index) => {
                    const position = index + 1;
                    const unavailable = labelSettings.unavailablePositions.includes(position);
                    const willPrint = firstPagePrintedPositions.has(position);
                    return (
                      <button
                        type="button"
                        key={position}
                        className={unavailable ? "used" : willPrint ? "willPrint" : "available"}
                        aria-pressed={unavailable}
                        aria-label={`Label position ${position}: ${unavailable ? "used" : willPrint ? "will print" : "available"}`}
                        onClick={() => toggleUnavailablePosition(position)}
                      >
                        <strong>{position}</strong>
                        <span>{unavailable ? "USED" : willPrint ? "PRINT" : "OPEN"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className="weekendBulkLabelControls">
                <label>
                  <span>Start at label</span>
                  <select value={firstAvailablePosition} onChange={(event) => chooseStartingPosition(event.target.value)}>
                    {Array.from({ length: WEEKEND_LABEL_SHEET.labelsPerSheet }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
                  </select>
                </label>
                <p className="weekendBulkLabelStartHelp">Choosing a starting number marks every earlier position as used. You can then click individual positions to make further adjustments.</p>
                <div className="weekendBulkLabelPrintSummary">
                  <div><strong>{labelEntries.length}</strong><span>Labels to print</span></div>
                  <div><strong>{30 - labelSettings.unavailablePositions.length}</strong><span>Open on first sheet</span></div>
                  <div><strong>{labelPages.length}</strong><span>Sheet{labelPages.length === 1 ? "" : "s"} needed</span></div>
                </div>
                <fieldset>
                  <legend>Printer alignment</legend>
                  <label><span>Left / right adjustment</span><div><input type="number" min="-5" max="5" step="0.1" value={labelSettings.offsetX} onChange={(event) => setLabelSettings((current) => ({ ...current, offsetX: Number(event.target.value) || 0 }))} /><em>mm</em></div></label>
                  <label><span>Up / down adjustment</span><div><input type="number" min="-5" max="5" step="0.1" value={labelSettings.offsetY} onChange={(event) => setLabelSettings((current) => ({ ...current, offsetY: Number(event.target.value) || 0 }))} /><em>mm</em></div></label>
                  <label className="weekendBulkOutlineChoice"><input type="checkbox" checked={labelSettings.printOutlines} onChange={(event) => setLabelSettings((current) => ({ ...current, printOutlines: event.target.checked }))} /><span>Print light outlines for a plain-paper test</span></label>
                </fieldset>
                <div className="weekendBulkLabelSetupActions">
                  <button type="button" className="ghost" onClick={() => setShowLabelSetup(false)}>Cancel</button>
                  <button type="button" onClick={printConfiguredLabels}>Print {labelEntries.length} Label{labelEntries.length === 1 ? "" : "s"}</button>
                </div>
                <small>In the printer window, use Letter paper, Actual Size or 100%, and turn off browser headers and footers.</small>
              </aside>
            </div>
          </section>
        </div>
      )}

      <section className="weekendBulkChecklist">
            <h3>Packaging & Safety Checklist</h3>
            <ul>
              <li>Cool cooked food promptly before sealing and refrigerating or freezing.</li>
              <li>Confirm the title, code, finish, package, created date, and use-by dates before printing labels.</li>
              <li>Freeze bags flat when practical, then stand them upright to save space.</li>
              <li>Reserve the refrigerator portions you expect to eat first; freeze the rest promptly.</li>
            </ul>
      </section>
      <section className="weekendBulkNotes">
        <label>
          <span>Weekend notes</span>
          <textarea value={plan.notes} onChange={(event) => updatePlan({ notes: event.target.value })} placeholder="Shopping reminders, thawing notes, equipment order, or prep assignments..." />
        </label>
      </section>

      <section
        className="weekendBulkLabelSheet"
        aria-hidden="true"
        style={{ "--label-offset-x": `${labelSettings.offsetX}mm`, "--label-offset-y": `${labelSettings.offsetY}mm` }}
      >
        {labelPages.map((page, pageIndex) => (
          <div className="weekendBulkLabelPage" key={`label-page-${pageIndex}`}>
            {page.map((entry, slotIndex) => entry ? (
              <article className="weekendBulkPrintableLabel" key={entry.key}>
                <strong className={entry.title.length > 34 ? "veryCompact" : entry.title.length > 25 ? "compact" : ""}>{entry.title}</strong>
                <span className={`${entry.code} | ${entry.finish} | ${entry.package}`.length > 54 ? "veryCompact" : ""}>{entry.code} | {entry.finish} | {entry.package}</span>
                <small>Made {formatCompactLabelDate(entry.createdDate)} | Fridge {formatCompactLabelDate(entry.refrigeratorUseBy)} | Freeze {formatCompactLabelDate(entry.freezeUseBy)}</small>
              </article>
            ) : <div className="weekendBulkPrintableLabel empty" aria-hidden="true" key={`empty-${pageIndex}-${slotIndex}`} />)}
          </div>
        ))}
      </section>

      <section className="weekendBulkOverviewSheet" aria-hidden="true">
        <header>
          <p>ROBERT'S RECIPE BOX · WEEKEND BULK COOKING</p>
          <h1>{plan.weekendName || "My Weekend Bulk Plan"}</h1>
          <div><strong>Main prep day:</strong> {plan.prepDay} <span>•</span> <strong>{plan.items.length}</strong> foods <span>•</span> <strong>{summary.totalBatches}</strong> batches <span>•</span> <strong>{summary.totalPortions}</strong> portions</div>
        </header>
        <section className="weekendBulkOverviewSummary">
          <div><strong>{summary.refrigerator}</strong><span>Refrigerator portions</span></div>
          <div><strong>{summary.freezer}</strong><span>Freezer portions</span></div>
          <div><strong>{plan.items.filter((item) => item.completed).length}</strong><span>Marked complete</span></div>
        </section>
        <h2>Cooking & Packaging Overview</h2>
        <table>
          <thead><tr><th>#</th><th>Meal / Item</th><th>Qty.</th><th>Finish</th><th>Storage</th><th>Package / Label Note</th></tr></thead>
          <tbody>{plan.items.map((item, index) => (
            <tr key={item.uid}><td>{item.completed ? "✓" : index + 1}</td><td><strong>{item.title}</strong><small>{item.id} · {item.day}</small></td><td>{item.batches} batch{Number(item.batches) === 1 ? "" : "es"}<small>{Number(item.portions) * Number(item.batches)} portions</small></td><td>{item.finish || "Whole"}</td><td>{item.destination}{item.destination === "both" ? ` (${item.refrigeratorPortions} refrigerated)` : ""}</td><td>{item.package}<small>{item.labelNote || "Label with food, portions, and freeze date."}</small></td></tr>
          ))}</tbody>
        </table>
        <div className="weekendBulkOverviewColumns">
          <section><h2>Items to Have Ready</h2><ul><li>Chosen bags or containers for every batch</li><li>Permanent or dissolvable labels and marker</li><li>Sheet pans or shallow pans for prompt cooling</li><li>Freezer space cleared before cooking begins</li><li>Thermometer, timers, and clean prep tools</li></ul></section>
          <section><h2>Successful Cook Hints</h2><ul><li>Start the longest-cooking foods first and prep cold items while they cook.</li><li>Keep raw-meat tools separate from ready-to-eat food.</li><li>Cool cooked food promptly in shallow portions before sealing.</li><li>Reserve near-term refrigerator portions; freeze the rest promptly.</li><li>Freeze bags flat, then stand upright once solid.</li></ul></section>
        </div>
        {plan.notes && <section className="weekendBulkOverviewNotes"><h2>Weekend Notes</h2><p>{plan.notes}</p></section>}
      </section>
    </main>
  );
}
