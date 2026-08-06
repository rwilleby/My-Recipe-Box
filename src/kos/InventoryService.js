import { assertPositive, createId, isoNow, normalizeQuantity } from "./kosCore.js";

export const KOS_ITEM_TYPES = Object.freeze([
  "component",
  "finished-meal",
  "lunch",
  "snack",
  "dessert",
  "family-meal",
  "ingredient-pack",
]);

export function createInventoryService({ repository, clock } = {}) {
  if (!repository) throw new Error("InventoryService requires repository");

  function all({ includeEmpty = false } = {}) {
    return repository.load().inventoryLots.filter((lot) => includeEmpty || lot.quantityAvailable > 0);
  }

  function get(id) {
    return repository.load().inventoryLots.find((lot) => lot.id === id) || null;
  }

  function addLot({
    name,
    itemType,
    quantity,
    unit = "servings",
    recipeId = null,
    completeDinnerId = null,
    sourceSessionId = null,
    sourceLotIds = [],
    storageLocation = "freezer",
    notes = "",
    metadata = {},
  }) {
    if (!name?.trim()) throw new Error("Inventory item name is required");
    if (!KOS_ITEM_TYPES.includes(itemType)) throw new Error(`Unsupported inventory item type: ${itemType}`);
    const amount = assertPositive(quantity);
    const timestamp = isoNow(clock);
    const lot = {
      id: createId("LOT", clock?.()),
      name: name.trim(), itemType, quantityProduced: amount, quantityAvailable: amount,
      unit, recipeId, completeDinnerId, sourceSessionId,
      sourceLotIds: [...sourceLotIds], storageLocation, notes, metadata,
      createdAt: timestamp, updatedAt: timestamp,
    };
    repository.update((state) => {
      state.inventoryLots.push(lot);
      state.inventoryEvents.push({ id: createId("EVT", clock?.()), lotId: lot.id, eventType: "added", quantity: amount, unit, createdAt: timestamp, sourceSessionId });
      return state;
    });
    return lot;
  }

  function consume(id, quantity, { reason = "consumed", sessionId = null, notes = "" } = {}) {
    const amount = assertPositive(quantity);
    let updated;
    repository.update((state) => {
      const lot = state.inventoryLots.find((item) => item.id === id);
      if (!lot) throw new Error(`Inventory lot not found: ${id}`);
      if (amount > lot.quantityAvailable) throw new Error(`Cannot use ${amount} ${lot.unit}; only ${lot.quantityAvailable} available`);
      lot.quantityAvailable = normalizeQuantity(lot.quantityAvailable - amount);
      lot.updatedAt = isoNow(clock);
      state.inventoryEvents.push({ id: createId("EVT", clock?.()), lotId: id, eventType: reason, quantity: -amount, unit: lot.unit, createdAt: lot.updatedAt, sourceSessionId: sessionId, notes });
      if (reason === "consumed") {
        state.consumptionEvents.push({ id: createId("CON", clock?.()), lotId: id, quantity: amount, unit: lot.unit, consumedAt: lot.updatedAt, notes });
      }
      updated = { ...lot };
      return state;
    });
    return updated;
  }

  function adjust(id, quantityAvailable, notes = "Manual adjustment") {
    const target = normalizeQuantity(quantityAvailable, "quantityAvailable");
    const current = get(id);
    if (!current) throw new Error(`Inventory lot not found: ${id}`);
    const delta = target - current.quantityAvailable;
    if (delta === 0) return current;
    if (delta < 0) return consume(id, Math.abs(delta), { reason: "adjusted", notes });
    let updated;
    repository.update((state) => {
      const lot = state.inventoryLots.find((item) => item.id === id);
      lot.quantityAvailable = target;
      lot.updatedAt = isoNow(clock);
      state.inventoryEvents.push({ id: createId("EVT", clock?.()), lotId: id, eventType: "adjusted", quantity: delta, unit: lot.unit, createdAt: lot.updatedAt, notes });
      updated = { ...lot };
      return state;
    });
    return updated;
  }

  function summary() {
    const lots = all();
    const byType = {};
    for (const lot of lots) byType[lot.itemType] = (byType[lot.itemType] || 0) + lot.quantityAvailable;
    return { lotCount: lots.length, totalAvailable: lots.reduce((sum, lot) => sum + lot.quantityAvailable, 0), byType };
  }

  return Object.freeze({ all, get, addLot, consume, adjust, summary });
}

export default createInventoryService;
