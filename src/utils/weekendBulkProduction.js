function wholeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : fallback;
}

function stableSlug(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function earlierDate(first = "", second = "") {
  if (!first) return second;
  if (!second) return first;
  return first <= second ? first : second;
}

export function weekendBulkTotalYield(item = {}) {
  return wholeNumber(item.portions, 1) * Math.max(1, wholeNumber(item.batches, 1));
}

export function weekendBulkDisposition(item = {}) {
  const totalYield = weekendBulkTotalYield(item);
  const serveToday = wholeNumber(item.serveTodayPortions);
  const refrigerator = wholeNumber(item.refrigeratorPortions);
  const freezer = wholeNumber(item.freezerPortions);
  const allocated = serveToday + refrigerator + freezer;

  return {
    totalYield,
    serveToday,
    refrigerator,
    freezer,
    allocated,
    unallocated: totalYield - allocated,
    valid: allocated === totalYield,
  };
}

export function migrateWeekendBulkItem(item = {}) {
  const totalYield = weekendBulkTotalYield(item);
  const hasNewDisposition = [
    item.serveTodayPortions,
    item.freezerPortions,
  ].some((value) => value !== undefined && value !== null);

  let serveTodayPortions = wholeNumber(item.serveTodayPortions);
  let refrigeratorPortions = wholeNumber(item.refrigeratorPortions);
  let freezerPortions = wholeNumber(item.freezerPortions);

  if (!hasNewDisposition) {
    if (item.destination === "refrigerator") {
      refrigeratorPortions = totalYield;
      freezerPortions = 0;
    } else if (item.destination === "both") {
      refrigeratorPortions = Math.min(wholeNumber(item.refrigeratorPortions), totalYield);
      freezerPortions = Math.max(0, totalYield - refrigeratorPortions);
    } else {
      refrigeratorPortions = 0;
      freezerPortions = totalYield;
    }
    serveTodayPortions = 0;
  }

  const storedPackages = refrigeratorPortions + freezerPortions;

  return {
    ...item,
    outputType: item.outputType === "complete-meal" || item.sourceType === "complete-meal"
      ? "complete-meal"
      : "individual-recipe",
    serveTodayPortions,
    refrigeratorPortions,
    freezerPortions,
    labelQuantity: Math.max(0, wholeNumber(item.labelQuantity, storedPackages)),
    inventoryRecorded: Boolean(item.inventoryRecorded),
  };
}

export function completeMealDisplayTitle(meal = {}) {
  const main = String(meal.title || meal.mainDish || "Complete Meal").replace(/\s+Complete Dinner$/i, "");
  const sideNames = Array.isArray(meal.sides)
    ? meal.sides.map((side) => side?.name).filter(Boolean)
    : [];
  if (!sideNames.length) return main;
  return `${main} & ${sideNames.join(" & ")}`;
}

export function buildWeekendBulkProductionPayload(item = {}) {
  const disposition = weekendBulkDisposition(item);
  if (!disposition.valid) {
    throw new Error(`Allocate all ${disposition.totalYield} portions before marking this item done.`);
  }

  const completeMeal = item.outputType === "complete-meal" || item.sourceType === "complete-meal";
  const recipeId = completeMeal ? null : item.id || null;
  const completeDinnerId = completeMeal ? (item.rfisId || item.id || null) : null;
  const itemType = completeMeal ? "finished-meal" : "component";
  const unit = completeMeal ? "meals" : "portions";
  const metadata = {
    source: "weekend-bulk-plan",
    outputType: completeMeal ? "complete-meal" : "individual-recipe",
    package: item.package || "",
    finish: item.finish || "Whole",
    createdDate: item.createdDate || "",
    refrigeratorUseBy: item.refrigeratorUseBy || "",
    freezeUseBy: item.freezeUseBy || "",
    labelQuantity: wholeNumber(item.labelQuantity),
    componentRecipeIds: Array.isArray(item.componentRecipeIds) ? [...item.componentRecipeIds] : [],
    legacyMealId: completeMeal ? item.id || null : null,
  };

  const output = (quantity, storageLocation) => ({
    name: item.title || item.id || "Weekend bulk item",
    itemType,
    quantity,
    unit,
    recipeId,
    completeDinnerId,
    storageLocation,
    notes: item.labelNote || "",
    metadata,
  });

  return {
    sessionType: completeMeal ? "assemble" : "produce",
    title: item.title || item.id || "Weekend bulk production",
    method: "weekend bulk cooking",
    recipeId,
    totalYield: disposition.totalYield,
    eatenNow: disposition.serveToday,
    outputs: [
      disposition.refrigerator > 0 ? output(disposition.refrigerator, "refrigerator") : null,
      disposition.freezer > 0 ? output(disposition.freezer, "freezer") : null,
    ].filter(Boolean),
    notes: item.labelNote || "",
    occurredAt: item.createdDate ? `${item.createdDate}T12:00:00.000` : undefined,
  };
}

export function addWeekendBulkFreezerInventory(inventory = {}, item = {}) {
  const quantity = weekendBulkDisposition(item).freezer;
  if (quantity <= 0) return inventory;

  const safe = inventory && typeof inventory === "object" ? inventory : {};
  const managedItems = Array.isArray(safe.managedItems) ? safe.managedItems : [];
  const completeMeal = item.outputType === "complete-meal" || item.sourceType === "complete-meal";
  const kind = completeMeal ? "completeMeal" : "mainCourse";
  const sourceId = String(item.id || "");
  const existing = managedItems.find((record) => record.kind === kind && record.sourceId === sourceId);
  const nextRecord = {
    ...(existing || {}),
    id: existing?.id || `fmi-bulk-${stableSlug(`${kind}-${sourceId}`)}`,
    kind,
    sourceId,
    packagesAvailable: wholeNumber(existing?.packagesAvailable) + quantity,
    servingsPerPackage: 1,
    datePrepared: earlierDate(existing?.datePrepared, item.createdDate || ""),
    useByDate: earlierDate(existing?.useByDate, item.freezeUseBy || ""),
    storageLocation: existing?.storageLocation || "Kitchen freezer",
    notes: [existing?.notes, item.labelNote].filter(Boolean).join(" | "),
    lastBulkPlanItemUid: item.uid || "",
  };

  return {
    ...safe,
    managedItems: existing
      ? managedItems.map((record) => record.id === existing.id ? nextRecord : record)
      : [...managedItems, nextRecord],
  };
}

export function addWeekendBulkRefrigeratorInventory(inventory = {}, item = {}) {
  const quantity = weekendBulkDisposition(item).refrigerator;
  if (quantity <= 0) return inventory;

  const safe = inventory && typeof inventory === "object" ? inventory : {};
  const customItems = Array.isArray(safe.customItems) ? safe.customItems : [];
  const items = safe.items && typeof safe.items === "object" && !Array.isArray(safe.items) ? safe.items : {};
  const outputType = item.outputType === "complete-meal" || item.sourceType === "complete-meal"
    ? "complete-meal"
    : "individual-recipe";
  const id = `bulk-refrigerator-${stableSlug(`${outputType}-${item.id || item.title}`)}`;
  const existingDefinition = customItems.find((record) => record.id === id);
  const existing = items[id] || {};

  return {
    ...safe,
    customItems: existingDefinition
      ? customItems
      : [...customItems, {
          id,
          name: item.title || item.id || "Prepared meal",
          categoryId: "leftovers",
          group: "Bulk Plan",
          custom: true,
        }],
    items: {
      ...items,
      [id]: {
        ...existing,
        inFridge: true,
        quantity: wholeNumber(existing.quantity) + quantity,
        unit: outputType === "complete-meal" ? "meals" : "portions",
        openedDate: earlierDate(existing.openedDate, item.createdDate || ""),
        useByDate: earlierDate(existing.useByDate, item.refrigeratorUseBy || ""),
        status: "Available",
        notes: [existing.notes, item.labelNote].filter(Boolean).join(" | "),
      },
    },
  };
}
