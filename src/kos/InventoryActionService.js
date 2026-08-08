function requireLot(inventory, lotId) {
  const lot = inventory.get(lotId);
  if (!lot) throw new Error(`Inventory lot not found: ${lotId}`);
  return lot;
}

export function createInventoryActionService({
  inventory,
  packaging,
} = {}) {
  if (!inventory || !packaging) {
    throw new Error(
      "InventoryActionService requires inventory and packaging"
    );
  }

  function consume({
    lotId,
    quantity = 1,
    notes = "",
  } = {}) {
    requireLot(inventory, lotId);
    return inventory.consume(lotId, quantity, {
      reason: "consumed",
      notes,
    });
  }

  function adjust({
    lotId,
    quantityAvailable,
    notes = "Manual quantity adjustment",
  } = {}) {
    requireLot(inventory, lotId);
    return inventory.adjust(
      lotId,
      quantityAvailable,
      notes
    );
  }

  function packageLot({
    lotId,
    packageType,
    packageCount,
    portionSize = 1,
    unit = "servings",
    label = "",
    storageLocation = "freezer",
    notes = "",
  } = {}) {
    requireLot(inventory, lotId);
    return packaging.record({
      lotId,
      packageType,
      packageCount,
      portionSize,
      unit,
      label,
      storageLocation,
      notes,
    });
  }

  return Object.freeze({
    consume,
    adjust,
    packageLot,
  });
}

export default createInventoryActionService;
