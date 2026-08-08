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

const READY_TYPES = new Set([
  "finished-meal",
  "lunch",
  "snack",
  "dessert",
  "family-meal",
]);

function ageDays(createdAt, now) {
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return 0;
  return Math.max(
    0,
    Math.floor((now.getTime() - created.getTime()) / 86400000)
  );
}

export function createInventoryIntelligenceService({
  inventory,
  workflow,
  assistant,
  clock = () => new Date(),
} = {}) {
  if (!inventory || !workflow || !assistant) {
    throw new Error(
      "InventoryIntelligenceService requires inventory, workflow, and assistant"
    );
  }

  function snapshot() {
    const rows = inventory.all();
    const now = clock();

    const items = rows.map((lot) =>
      freeze({
        id: lot.id,
        name: lot.name,
        itemType: lot.itemType,
        quantity: lot.quantityAvailable,
        unit: lot.unit,
        storageLocation: lot.storageLocation,
        recipeId: lot.recipeId || null,
        completeDinnerId: lot.completeDinnerId || null,
        ageDays: ageDays(lot.createdAt, now),
        readyToEat: READY_TYPES.has(lot.itemType),
        component: lot.itemType === "component",
        createdAt: lot.createdAt,
      })
    );

    const byLocation = {};
    const byType = {};
    for (const item of items) {
      byLocation[item.storageLocation] =
        (byLocation[item.storageLocation] || 0) + item.quantity;
      byType[item.itemType] =
        (byType[item.itemType] || 0) + item.quantity;
    }

    return freeze({
      totalLots: items.length,
      totalUnits: items.reduce((sum, item) => sum + item.quantity, 0),
      readyMealUnits: items
        .filter((item) => item.readyToEat)
        .reduce((sum, item) => sum + item.quantity, 0),
      componentUnits: items
        .filter((item) => item.component)
        .reduce((sum, item) => sum + item.quantity, 0),
      byLocation,
      byType,
      items,
    });
  }

  function byLocation(location) {
    const key = String(location || "").trim();
    return freeze(
      snapshot().items.filter(
        (item) => !key || item.storageLocation === key
      )
    );
  }

  function readyToEat({
    location = null,
    query = "",
  } = {}) {
    const term = String(query || "").trim().toLowerCase();
    return freeze(
      snapshot().items
        .filter((item) => item.readyToEat)
        .filter(
          (item) =>
            !location || item.storageLocation === location
        )
        .filter(
          (item) =>
            !term ||
            item.name.toLowerCase().includes(term) ||
            String(item.recipeId || "").toLowerCase().includes(term) ||
            String(item.completeDinnerId || "").toLowerCase().includes(term)
        )
        .sort(
          (a, b) =>
            b.ageDays - a.ageDays ||
            a.name.localeCompare(b.name)
        )
    );
  }

  function components({
    location = null,
    query = "",
  } = {}) {
    const term = String(query || "").trim().toLowerCase();
    return freeze(
      snapshot().items
        .filter((item) => item.component)
        .filter(
          (item) =>
            !location || item.storageLocation === location
        )
        .filter(
          (item) =>
            !term ||
            item.name.toLowerCase().includes(term) ||
            String(item.recipeId || "").toLowerCase().includes(term)
        )
        .sort(
          (a, b) =>
            b.ageDays - a.ageDays ||
            a.name.localeCompare(b.name)
        )
    );
  }

  function useNext({ limit = 6 } = {}) {
    const rows = snapshot().items
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        ...item,
        score:
          item.ageDays * 10 +
          (item.storageLocation === "refrigerator" ? 100 : 0) +
          (item.readyToEat ? 20 : 0),
      }))
      .sort(
        (a, b) =>
          b.score - a.score ||
          b.ageDays - a.ageDays ||
          a.name.localeCompare(b.name)
      )
      .slice(0, Math.max(0, limit))
      .map((item) =>
        freeze({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          storageLocation: item.storageLocation,
          itemType: item.itemType,
          ageDays: item.ageDays,
          reason:
            item.storageLocation === "refrigerator"
              ? "Use refrigerated food first"
              : item.ageDays >= 30
              ? "Older freezer item"
              : item.readyToEat
              ? "Ready to eat"
              : "Available component",
        })
      );

    return freeze(rows);
  }

  function dashboard() {
    const snap = snapshot();
    return freeze({
      summary: {
        totalLots: snap.totalLots,
        totalUnits: snap.totalUnits,
        readyMealUnits: snap.readyMealUnits,
        componentUnits: snap.componentUnits,
      },
      freezer: byLocation("freezer"),
      refrigerator: byLocation("refrigerator"),
      pantry: byLocation("pantry"),
      readyToEat: readyToEat(),
      components: components(),
      useNext: useNext(),
      suggestions: assistant.suggestions({ limit: 6 }),
      workflowCounts: workflow.counts(),
    });
  }

  return Object.freeze({
    snapshot,
    byLocation,
    readyToEat,
    components,
    useNext,
    dashboard,
  });
}

export default createInventoryIntelligenceService;
