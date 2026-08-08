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

function normalize(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function createShoppingReconciliationService({
  pantry,
  shopping,
} = {}) {
  if (!pantry || !shopping) {
    throw new Error(
      "ShoppingReconciliationService requires pantry and shopping"
    );
  }

  function reconcile() {
    const pantryMap = new Map();
    for (const item of pantry.all()) {
      const key = normalize(item.name);
      pantryMap.set(key, (pantryMap.get(key) || 0) + Number(item.quantity || 0));
    }

    return freeze(
      shopping.all().map((item) => {
        const available = pantryMap.get(normalize(item.name)) || 0;
        const needed = Math.max(0, Number(item.quantity || 0) - available);

        return {
          ...item,
          pantryAvailable: available,
          quantityStillNeeded: needed,
          alreadyHaveEnough: needed === 0,
        };
      })
    );
  }

  function summary() {
    const rows = reconcile();
    return freeze({
      totalShoppingItems: rows.length,
      alreadyHaveEnough: rows.filter((row) => row.alreadyHaveEnough).length,
      stillNeed: rows.filter((row) => !row.alreadyHaveEnough).length,
    });
  }

  return Object.freeze({
    reconcile,
    summary,
  });
}

export default createShoppingReconciliationService;
