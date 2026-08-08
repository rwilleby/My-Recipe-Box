import { createId, isoNow } from "./kosCore.js";

const PLAN_KEY = "kos.mealPlanner.week.v1";
const DAY_ORDER = Object.freeze([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

function freeze(value) {
  if (Array.isArray(value)) return Object.freeze(value.map(freeze));
  if (value && typeof value === "object") {
    return Object.freeze(
      Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, freeze(item)])
      )
    );
  }
  return value;
}

function normalizeDay(day) {
  const value = String(day || "").trim().toLowerCase();
  if (!DAY_ORDER.includes(value)) {
    throw new Error(`Unsupported planner day: ${day}`);
  }
  return value;
}

function emptyPlan() {
  return {
    id: "current-week",
    weekOf: null,
    mode: "balanced",
    days: Object.fromEntries(DAY_ORDER.map((day) => [day, null])),
    createdAt: null,
    updatedAt: null,
  };
}

export function createMealPlanningService({
  storage,
  clock = () => new Date(),
  rfisPlatform = null,
  inventoryIntelligence = null,
} = {}) {
  if (!storage) throw new Error("MealPlanningService requires storage");

  function load() {
    try {
      const raw = storage.getItem(PLAN_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      const plan = parsed && typeof parsed === "object" ? parsed : emptyPlan();
      plan.days = {
        ...emptyPlan().days,
        ...(plan.days || {}),
      };
      return plan;
    } catch {
      return emptyPlan();
    }
  }

  function save(plan) {
    storage.setItem(PLAN_KEY, JSON.stringify(plan));
    return plan;
  }

  function current() {
    return freeze(load());
  }

  function start({
    weekOf = null,
    mode = "balanced",
  } = {}) {
    const now = clock();
    const plan = emptyPlan();
    plan.id = createId("PLAN", now);
    plan.weekOf = weekOf;
    plan.mode = String(mode || "balanced");
    plan.createdAt = isoNow(() => now);
    plan.updatedAt = isoNow(() => now);
    save(plan);
    return current();
  }

  function setMode(mode) {
    const plan = load();
    plan.mode = String(mode || "balanced");
    plan.updatedAt = isoNow(clock);
    save(plan);
    return current();
  }

  function assign(day, meal) {
    const key = normalizeDay(day);
    if (!meal || typeof meal !== "object") {
      throw new Error("meal is required");
    }

    const source = meal.source || "recipe";
    const normalized = {
      id: meal.id || createId("PLNITEM", clock()),
      source,
      title: String(meal.title || meal.name || "Meal").trim(),
      recipeId: meal.recipeId || null,
      completeDinnerId: meal.completeDinnerId || null,
      inventoryLotId: meal.inventoryLotId || null,
      cuisine: meal.cuisine || null,
      protein: meal.protein || null,
      mealBalance:
        Number.isFinite(Number(meal.mealBalance))
          ? Number(meal.mealBalance)
          : null,
      freezer: Boolean(
        meal.freezer ||
        source === "freezer" ||
        meal.inventoryLotId
      ),
      notes: String(meal.notes || ""),
      assignedAt: isoNow(clock),
    };

    const plan = load();
    plan.days[key] = normalized;
    plan.updatedAt = isoNow(clock);
    save(plan);
    return freeze(normalized);
  }

  function remove(day) {
    const key = normalizeDay(day);
    const plan = load();
    plan.days[key] = null;
    plan.updatedAt = isoNow(clock);
    save(plan);
    return current();
  }

  function clear() {
    const plan = load();
    plan.days = { ...emptyPlan().days };
    plan.updatedAt = isoNow(clock);
    save(plan);
    return current();
  }

  function assignInventoryLot(day, lotId) {
    if (!inventoryIntelligence) {
      throw new Error("Inventory intelligence is unavailable");
    }
    const item = inventoryIntelligence
      .readyToEat()
      .find((row) => row.id === lotId);
    if (!item) {
      throw new Error(`Ready meal not found: ${lotId}`);
    }

    return assign(day, {
      source: "freezer",
      title: item.name,
      inventoryLotId: item.id,
      recipeId: item.recipeId,
      completeDinnerId: item.completeDinnerId,
      freezer: item.storageLocation === "freezer",
    });
  }

  function assignCompleteDinner(day, identifier) {
    if (!rfisPlatform) {
      throw new Error("RFIS platform is unavailable");
    }
    const dinner = rfisPlatform.completeDinners.present(identifier);
    if (!dinner) {
      throw new Error(`Complete Dinner not found: ${identifier}`);
    }

    return assign(day, {
      source: "complete-dinner",
      title: dinner.title,
      completeDinnerId: dinner.id,
      cuisine: dinner.cuisine,
      freezer: Boolean(
        (dinner.collections || []).some((name) =>
          String(name).toLowerCase().includes("freezer")
        )
      ),
    });
  }

  function rows() {
    const plan = load();
    return freeze(
      DAY_ORDER.map((day) => ({
        day,
        meal: plan.days[day],
      }))
    );
  }

  function analysis() {
    const meals = rows()
      .map((row) => row.meal)
      .filter(Boolean);

    const cuisines = meals
      .map((meal) => meal.cuisine)
      .filter(Boolean);
    const proteins = meals
      .map((meal) => meal.protein)
      .filter(Boolean);

    const cuisineCounts = {};
    const proteinCounts = {};
    for (const value of cuisines) {
      cuisineCounts[value] = (cuisineCounts[value] || 0) + 1;
    }
    for (const value of proteins) {
      proteinCounts[value] = (proteinCounts[value] || 0) + 1;
    }

    const duplicateTitles = Object.entries(
      meals.reduce((acc, meal) => {
        acc[meal.title] = (acc[meal.title] || 0) + 1;
        return acc;
      }, {})
    )
      .filter(([, count]) => count > 1)
      .map(([title, count]) => ({ title, count }));

    const mealBalances = meals
      .map((meal) => meal.mealBalance)
      .filter((value) => Number.isFinite(value));

    const plannedCount = meals.length;
    const freezerCount = meals.filter((meal) => meal.freezer).length;

    return freeze({
      plannedCount,
      openDays: DAY_ORDER.length - plannedCount,
      freezerMeals: freezerCount,
      freshMeals: plannedCount - freezerCount,
      uniqueCuisines: new Set(cuisines).size,
      uniqueProteins: new Set(proteins).size,
      cuisineCounts,
      proteinCounts,
      duplicateTitles,
      averageMealBalance:
        mealBalances.length
          ? mealBalances.reduce((sum, value) => sum + value, 0) /
            mealBalances.length
          : null,
      variety: {
        cuisine:
          cuisines.length === 0
            ? "unknown"
            : new Set(cuisines).size >= Math.min(4, cuisines.length)
            ? "good"
            : "limited",
        protein:
          proteins.length === 0
            ? "unknown"
            : new Set(proteins).size >= Math.min(4, proteins.length)
            ? "good"
            : "limited",
      },
    });
  }

  function suggestions() {
    const planAnalysis = analysis();
    const rowsOut = [];

    if (planAnalysis.openDays > 0) {
      rowsOut.push({
        id: "fill-open-days",
        kind: "planning",
        title: `You could plan ${planAnalysis.openDays} more ${
          planAnalysis.openDays === 1 ? "day" : "days"
        }`,
        priority: 100,
      });
    }

    if (planAnalysis.duplicateTitles.length) {
      rowsOut.push({
        id: "reduce-repeat-meals",
        kind: "variety",
        title: "You could swap one repeated dinner for more variety",
        priority: 80,
        metadata: {
          duplicates: planAnalysis.duplicateTitles,
        },
      });
    }

    if (
      planAnalysis.plannedCount >= 4 &&
      planAnalysis.freezerMeals === 0
    ) {
      rowsOut.push({
        id: "consider-freezer-meal",
        kind: "freezer",
        title: "You could use one available freezer meal this week",
        priority: 65,
      });
    }

    if (planAnalysis.variety.cuisine === "limited") {
      rowsOut.push({
        id: "increase-cuisine-variety",
        kind: "variety",
        title: "You could add another cuisine for more variety",
        priority: 60,
      });
    }

    if (planAnalysis.variety.protein === "limited") {
      rowsOut.push({
        id: "increase-protein-variety",
        kind: "variety",
        title: "You could vary the protein choices this week",
        priority: 60,
      });
    }

    return freeze(
      rowsOut
        .sort((a, b) => b.priority - a.priority)
        .map((row) => ({
          ...row,
          tone: "optional",
          language: "could",
        }))
    );
  }

  function dashboard() {
    return freeze({
      plan: current(),
      rows: rows(),
      analysis: analysis(),
      suggestions: suggestions(),
    });
  }

  return Object.freeze({
    dayOrder: DAY_ORDER,
    current,
    start,
    setMode,
    assign,
    assignInventoryLot,
    assignCompleteDinner,
    remove,
    clear,
    rows,
    analysis,
    suggestions,
    dashboard,
  });
}

export default createMealPlanningService;
