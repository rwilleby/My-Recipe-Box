import { createId, isoNow, normalizeQuantity } from "./kosCore.js";

const ACTIVE_KEY = "kos.productionCenter.active.v1";

function deepFreeze(value) {
  if (Array.isArray(value)) return Object.freeze(value.map(deepFreeze));
  if (value && typeof value === "object") {
    return Object.freeze(
      Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, deepFreeze(item)])
      )
    );
  }
  return value;
}

export function createProductionCenterService({
  storage,
  clock,
  actions,
  rfisBridge = null,
  workflow,
  assistant,
  opportunities,
  memory,
  templates,
  timeline,
} = {}) {
  if (!storage || !actions || !workflow || !assistant || !opportunities || !memory || !templates || !timeline) {
    throw new Error("ProductionCenterService requires KOS workflow services");
  }

  function loadActive() {
    try {
      const raw = storage.getItem(ACTIVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveActive(session) {
    if (session) storage.setItem(ACTIVE_KEY, JSON.stringify(session));
    else storage.removeItem(ACTIVE_KEY);
    return session;
  }

  function active() {
    const row = loadActive();
    return row ? deepFreeze(row) : null;
  }

  function start({
    title,
    recipeId = null,
    method = "other",
    totalYield = null,
    unit = "servings",
    notes = "",
  } = {}) {
    if (active()) throw new Error("A Production Center session is already active");
    const resolved =
      recipeId && rfisBridge ? rfisBridge.recipe(recipeId) : null;
    const name = String(title || resolved?.name || "").trim();
    if (!name) throw new Error("Production title is required");

    const now = isoNow(clock);
    const session = {
      id: createId("ACTIVE", clock?.()),
      title: name,
      recipeId: recipeId || null,
      method:
        method !== "other"
          ? method
          : resolved?.cookingMethods?.[0] || "other",
      totalYield:
        totalYield === null || totalYield === ""
          ? null
          : normalizeQuantity(totalYield, "totalYield"),
      unit,
      notes: String(notes || ""),
      status: "cooking",
      startedAt: now,
      updatedAt: now,
    };
    saveActive(session);
    return deepFreeze(session);
  }

  function update(changes = {}) {
    const current = loadActive();
    if (!current) throw new Error("No active Production Center session");
    const allowed = [
      "title",
      "method",
      "totalYield",
      "unit",
      "notes",
    ];
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        current[key] =
          key === "totalYield" && changes[key] !== null
            ? normalizeQuantity(changes[key], "totalYield")
            : changes[key];
      }
    }
    current.updatedAt = isoNow(clock);
    saveActive(current);
    return deepFreeze(current);
  }

  function cancel() {
    const current = loadActive();
    saveActive(null);
    return current ? deepFreeze({ ...current, status: "cancelled" }) : null;
  }

  function finish({
    totalYield,
    eatenNow = 0,
    savedQuantity = 0,
    savedAs = "finished-meal",
    savedName,
    storageLocation = "freezer",
    unit,
    notes,
  } = {}) {
    const current = loadActive();
    if (!current) throw new Error("No active Production Center session");

    const finalYield =
      totalYield ?? current.totalYield;
    if (finalYield === null || finalYield === undefined) {
      throw new Error("totalYield is required to finish cooking");
    }

    const result =
      current.recipeId && rfisBridge
        ? rfisBridge.cookRecipe({
            recipeId: current.recipeId,
            totalYield: finalYield,
            eatenNow,
            savedQuantity,
            savedAs,
            savedName: savedName || current.title,
            storageLocation,
            unit: unit || current.unit,
            method: current.method,
          })
        : actions.cook({
            title: current.title,
            recipeId: current.recipeId,
            totalYield: finalYield,
            eatenNow,
            savedQuantity,
            savedAs,
            savedName: savedName || current.title,
            storageLocation,
            unit: unit || current.unit,
            method: current.method,
          });

    if (notes || current.notes) {
      // Completed session already exists; notes are retained in the active-session summary.
    }

    saveActive(null);
    return deepFreeze({
      activeSession: {
        ...current,
        status: "completed",
        completedAt: isoNow(clock),
      },
      result,
      next: assistant.suggestions({ limit: 6 }),
    });
  }

  function resumeCard() {
    const current = active();
    if (!current) return null;
    return deepFreeze({
      id: current.id,
      title: current.title,
      status: current.status,
      method: current.method,
      startedAt: current.startedAt,
      recipeId: current.recipeId,
      totalYield: current.totalYield,
      action: "resume-production",
    });
  }

  function home() {
    return deepFreeze({
      active: resumeCard(),
      kitchen: workflow.dashboard(),
      suggestions: assistant.suggestions({ limit: 6 }),
      opportunities: opportunities.list({ limit: 6 }),
      repeatSuggestions: memory.productionPatterns({
        minimumOccurrences: 2,
      }),
      templates: templates.all(),
      recent: timeline.entries({ limit: 8 }),
    });
  }

  return Object.freeze({
    active,
    start,
    update,
    cancel,
    finish,
    resumeCard,
    home,
  });
}

export default createProductionCenterService;
