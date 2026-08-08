import { createId, isoNow } from "./kosCore.js";

const SHOPPING_KEY = "kos.shopping.list.v1";

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

function normalizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function keyFor(name, unit = "") {
  return `${normalizeName(name).toLowerCase()}::${String(unit || "").trim().toLowerCase()}`;
}

export function createShoppingIntelligenceService({
  storage,
  clock = () => new Date(),
  mealPlanner = null,
  rfisPlatform = null,
} = {}) {
  if (!storage) {
    throw new Error("ShoppingIntelligenceService requires storage");
  }

  function load() {
    try {
      const raw = storage.getItem(SHOPPING_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && typeof parsed === "object"
        ? {
            items: Array.isArray(parsed.items) ? parsed.items : [],
            updatedAt: parsed.updatedAt || null,
          }
        : { items: [], updatedAt: null };
    } catch {
      return { items: [], updatedAt: null };
    }
  }

  function save(state) {
    state.updatedAt = isoNow(clock);
    storage.setItem(SHOPPING_KEY, JSON.stringify(state));
    return state;
  }

  function all({ includeChecked = true } = {}) {
    const rows = load().items;
    return freeze(
      rows
        .filter((item) => includeChecked || !item.checked)
        .sort((a, b) => {
          if (a.checked !== b.checked) return a.checked ? 1 : -1;
          return a.name.localeCompare(b.name);
        })
    );
  }

  function upsert({
    name,
    quantity = 1,
    unit = "",
    category = "",
    source = "manual",
    sourceIds = [],
    notes = "",
  } = {}) {
    const cleanName = normalizeName(name);
    if (!cleanName) throw new Error("Shopping item name is required");

    const amount = Number(quantity);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Shopping quantity must be greater than zero");
    }

    const state = load();
    const key = keyFor(cleanName, unit);
    const existing = state.items.find((item) => item.key === key);

    if (existing) {
      existing.quantity += amount;
      existing.sourceIds = [
        ...new Set([...(existing.sourceIds || []), ...sourceIds]),
      ];
      existing.sources = [
        ...new Set([...(existing.sources || []), source]),
      ];
      existing.updatedAt = isoNow(clock);
      save(state);
      return freeze(existing);
    }

    const item = {
      id: createId("SHOP", clock()),
      key,
      name: cleanName,
      quantity: amount,
      unit: String(unit || "").trim(),
      category: String(category || "").trim(),
      sources: [source],
      sourceIds: [...new Set(sourceIds)],
      notes: String(notes || ""),
      checked: false,
      createdAt: isoNow(clock),
      updatedAt: isoNow(clock),
    };
    state.items.push(item);
    save(state);
    return freeze(item);
  }

  function remove(id) {
    const state = load();
    const before = state.items.length;
    state.items = state.items.filter((item) => item.id !== id);
    if (state.items.length === before) {
      throw new Error(`Shopping item not found: ${id}`);
    }
    save(state);
    return all();
  }

  function check(id, checked = true) {
    const state = load();
    const item = state.items.find((row) => row.id === id);
    if (!item) throw new Error(`Shopping item not found: ${id}`);
    item.checked = Boolean(checked);
    item.updatedAt = isoNow(clock);
    save(state);
    return freeze(item);
  }

  function clearChecked() {
    const state = load();
    state.items = state.items.filter((item) => !item.checked);
    save(state);
    return all();
  }

  function clearAll() {
    save({ items: [], updatedAt: null });
    return all();
  }

  function recipeIngredients(recipeId) {
    if (!rfisPlatform) return [];
    const recipe =
      rfisPlatform.recipes.get(recipeId) ||
      rfisPlatform.recipes.profile(recipeId) ||
      null;
    if (!recipe) return [];

    const candidates = [
      recipe.ingredients,
      recipe.ingredientList,
      recipe.items,
    ];
    const raw = candidates.find((value) => Array.isArray(value));
    if (!raw) return [];

    return raw
      .map((item) => {
        if (typeof item === "string") {
          return {
            name: item,
            quantity: 1,
            unit: "",
            category: "",
          };
        }
        if (!item || typeof item !== "object") return null;
        return {
          name:
            item.name ||
            item.ingredient ||
            item.item ||
            item.label ||
            "",
          quantity:
            Number.isFinite(Number(item.quantity))
              ? Number(item.quantity)
              : 1,
          unit: item.unit || "",
          category: item.category || "",
        };
      })
      .filter((item) => normalizeName(item?.name));
  }

  function addRecipe(recipeId, {
    multiplier = 1,
    source = "recipe",
  } = {}) {
    const factor = Number(multiplier);
    if (!Number.isFinite(factor) || factor <= 0) {
      throw new Error("Recipe multiplier must be greater than zero");
    }

    const ingredients = recipeIngredients(recipeId);
    const added = [];
    for (const ingredient of ingredients) {
      added.push(
        upsert({
          ...ingredient,
          quantity: ingredient.quantity * factor,
          source,
          sourceIds: [recipeId],
        })
      );
    }
    return freeze(added);
  }

  function rebuildFromPlanner({
    keepManual = true,
  } = {}) {
    if (!mealPlanner) {
      throw new Error("Meal planner is unavailable");
    }

    const state = load();
    state.items = keepManual
      ? state.items.filter((item) =>
          (item.sources || []).includes("manual")
        )
      : [];
    save(state);

    for (const row of mealPlanner.rows()) {
      const meal = row.meal;
      if (!meal) continue;

      if (meal.recipeId) {
        addRecipe(meal.recipeId, {
          source: `planner:${row.day}`,
        });
      }

      if (
        meal.completeDinnerId &&
        rfisPlatform
      ) {
        const dinner =
          rfisPlatform.completeDinners.present(
            meal.completeDinnerId
          );
        if (dinner) {
          const recipeIds = [
            dinner.entreeRecipeId,
            ...(dinner.sideRecipeIds || []),
          ];
          for (const recipeId of recipeIds) {
            if (recipeId) {
              addRecipe(recipeId, {
                source: `planner:${row.day}`,
              });
            }
          }
        }
      }
    }

    return dashboard();
  }

  function summary() {
    const rows = all();
    const unchecked = rows.filter((item) => !item.checked);
    const checked = rows.filter((item) => item.checked);

    const categories = {};
    for (const item of unchecked) {
      const category = item.category || "Other";
      categories[category] = (categories[category] || 0) + 1;
    }

    return freeze({
      totalItems: rows.length,
      remainingItems: unchecked.length,
      checkedItems: checked.length,
      categories,
      complete:
        rows.length > 0 && unchecked.length === 0,
    });
  }

  function overlaps() {
    return freeze(
      all()
        .filter(
          (item) =>
            (item.sourceIds || []).length > 1 ||
            (item.sources || []).length > 1
        )
        .map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          sources: item.sources,
          sourceIds: item.sourceIds,
        }))
    );
  }

  function dashboard() {
    return freeze({
      items: all(),
      summary: summary(),
      overlaps: overlaps(),
    });
  }

  return Object.freeze({
    all,
    upsert,
    remove,
    check,
    clearChecked,
    clearAll,
    addRecipe,
    rebuildFromPlanner,
    summary,
    overlaps,
    dashboard,
  });
}

export default createShoppingIntelligenceService;
