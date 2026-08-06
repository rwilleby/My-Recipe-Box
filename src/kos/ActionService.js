function requireText(value, label) {
  const text = String(value || "").trim();
  if (!text) throw new Error(`${label} is required`);
  return text;
}

export function createActionService({
  inventory,
  production,
  assembly,
  packaging,
  workflow,
} = {}) {
  if (!inventory || !production || !assembly || !packaging || !workflow) {
    throw new Error("ActionService requires KOS workflow services");
  }

  function cook({
    title,
    totalYield,
    eatenNow = 0,
    savedQuantity = 0,
    savedAs = "finished-meal",
    savedName,
    method = "other",
    storageLocation = "freezer",
    unit = "servings",
    recipeId = null,
  }) {
    return production.quickRecord({
      title: requireText(title, "title"),
      totalYield,
      eatenNow,
      savedQuantity,
      savedAs,
      savedName: savedName || title,
      method,
      storageLocation,
      unit,
      recipeId,
    });
  }

  function transform({
    title,
    sourceLotId,
    sourceQuantity,
    totalYield,
    eatenNow = 0,
    outputs = [],
    notes = "",
  }) {
    requireText(title, "title");
    requireText(sourceLotId, "sourceLotId");
    return production.record({
      sessionType: "transform",
      title,
      sourceLotUses: [
        {
          lotId: sourceLotId,
          quantity: sourceQuantity,
        },
      ],
      totalYield,
      eatenNow,
      outputs,
      notes,
    });
  }

  function recover({
    title,
    sourceLotId,
    sourceQuantity,
    totalYield,
    eatenNow = 0,
    outputs = [],
    notes = "",
  }) {
    requireText(title, "title");
    requireText(sourceLotId, "sourceLotId");
    return production.record({
      sessionType: "recover",
      title,
      sourceLotUses: [
        {
          lotId: sourceLotId,
          quantity: sourceQuantity,
        },
      ],
      totalYield,
      eatenNow,
      outputs,
      notes,
    });
  }

  function buildMeals({
    title,
    completeDinnerId = null,
    components,
    quantity,
    itemType = "finished-meal",
    storageLocation = "freezer",
    packageType = null,
    notes = "",
  }) {
    return assembly.assemble({
      title: requireText(title, "title"),
      completeDinnerId,
      components,
      quantity,
      itemType,
      storageLocation,
      packageType,
      notes,
    });
  }

  function packageFood({
    lotId,
    packageType,
    packageCount,
    portionSize = 1,
    unit = "servings",
    label = "",
    storageLocation = "freezer",
    notes = "",
  }) {
    if (!inventory.get(lotId)) {
      throw new Error(`Inventory lot not found: ${lotId}`);
    }
    return packaging.record({
      lotId,
      packageType: requireText(packageType, "packageType"),
      packageCount,
      portionSize,
      unit,
      label,
      storageLocation,
      notes,
    });
  }

  function consume({
    lotId,
    quantity,
    notes = "",
  }) {
    return inventory.consume(lotId, quantity, {
      reason: "consumed",
      notes,
    });
  }

  function previewBuild({ components = [] } = {}) {
    return Object.freeze({
      capacity: assembly.capacity(components),
      components: Object.freeze(
        components.map((component) => {
          const lot = inventory.get(component.lotId);
          return Object.freeze({
            lotId: component.lotId,
            name: lot?.name || component.lotId,
            available: lot?.quantityAvailable || 0,
            quantityPerMeal: component.quantityPerMeal,
            unit: lot?.unit || "",
          });
        })
      ),
    });
  }

  function status() {
    return workflow.dashboard();
  }

  return Object.freeze({
    cook,
    transform,
    recover,
    buildMeals,
    packageFood,
    consume,
    previewBuild,
    status,
  });
}

export default createActionService;
