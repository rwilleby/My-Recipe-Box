const READY_TYPES = new Set([
  "finished-meal",
  "lunch",
  "snack",
  "dessert",
  "family-meal",
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

export function createAvailableMealsService({
  inventory,
  actions,
} = {}) {
  if (!inventory || !actions) {
    throw new Error("AvailableMealsService requires inventory and actions");
  }

  function list({
    type = "all",
    location = "all",
    query = "",
  } = {}) {
    const term = String(query || "").trim().toLowerCase();
    return freeze(
      inventory
        .all()
        .filter((lot) => READY_TYPES.has(lot.itemType))
        .filter((lot) => type === "all" || lot.itemType === type)
        .filter(
          (lot) =>
            location === "all" ||
            lot.storageLocation === location
        )
        .filter(
          (lot) =>
            !term ||
            lot.name.toLowerCase().includes(term) ||
            String(lot.recipeId || "").toLowerCase().includes(term) ||
            String(lot.completeDinnerId || "").toLowerCase().includes(term)
        )
        .map((lot) => ({
          id: lot.id,
          name: lot.name,
          type: lot.itemType,
          quantity: lot.quantityAvailable,
          unit: lot.unit,
          location: lot.storageLocation,
          recipeId: lot.recipeId,
          completeDinnerId: lot.completeDinnerId,
          createdAt: lot.createdAt,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  }

  function summary() {
    const rows = list();
    const byType = {};
    const byLocation = {};
    for (const row of rows) {
      byType[row.type] = (byType[row.type] || 0) + row.quantity;
      byLocation[row.location] =
        (byLocation[row.location] || 0) + row.quantity;
    }
    return freeze({
      portions: rows.reduce((sum, row) => sum + row.quantity, 0),
      lots: rows.length,
      byType,
      byLocation,
    });
  }

  function consume(lotId, quantity = 1, notes = "") {
    return actions.consume({ lotId, quantity, notes });
  }

  return Object.freeze({
    list,
    summary,
    consume,
  });
}

export default createAvailableMealsService;
