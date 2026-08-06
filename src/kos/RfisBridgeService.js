function requireService(value, name) {
  if (!value) throw new Error(`RfisBridgeService requires ${name}`);
  return value;
}

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

export function createRfisBridgeService({
  rfisPlatform,
  actions,
  inventory,
} = {}) {
  requireService(rfisPlatform, "rfisPlatform");
  requireService(actions, "actions");
  requireService(inventory, "inventory");

  function recipe(identifier) {
    const profile = rfisPlatform.recipes.profile(identifier);
    if (!profile) return null;

    return freeze({
      id: profile.id,
      name: profile.name,
      category: profile.category,
      attributes: profile.attributes,
      collections: profile.collections,
      cookingMethods: profile.cookingMethods,
      hasNutritionRecord: profile.hasNutritionRecord,
    });
  }

  function dinner(identifier) {
    const view = rfisPlatform.completeDinners.present(identifier);
    if (!view) return null;

    return freeze({
      id: view.id,
      legacyId: view.legacyId,
      number: view.number,
      title: view.title,
      cuisine: view.cuisine,
      entreeRecipeId: view.entreeRecipeId,
      entreeName: view.entreeName,
      sideRecipeIds: view.sideRecipeIds,
      sideNames: view.sideNames,
      collections: view.collections,
      freshCompanion: view.freshCompanion,
      optionalBread: view.optionalBread,
      heroStatus: view.heroStatus,
      referencesValid: view.referencesValid,
    });
  }

  function cookRecipe({
    recipeId,
    totalYield,
    eatenNow = 0,
    savedQuantity = 0,
    savedAs = "finished-meal",
    savedName,
    storageLocation = "freezer",
    unit = "servings",
    method,
  }) {
    const profile = recipe(recipeId);
    if (!profile) {
      throw new Error(`RFIS recipe not found: ${recipeId}`);
    }

    const result = actions.cook({
      title: profile.name,
      recipeId: profile.id,
      totalYield,
      eatenNow,
      savedQuantity,
      savedAs,
      savedName: savedName || profile.name,
      storageLocation,
      unit,
      method:
        method ||
        profile.cookingMethods[0] ||
        "other",
    });

    return freeze({
      ...result,
      rfisRecipe: profile,
    });
  }

  function assemblyPlan(identifier, { quantity = 1 } = {}) {
    const dinnerView = dinner(identifier);
    if (!dinnerView) {
      throw new Error(`RFIS Complete Dinner not found: ${identifier}`);
    }

    const requiredRecipeIds = [
      dinnerView.entreeRecipeId,
      ...dinnerView.sideRecipeIds,
    ];

    const availableLots = inventory.all().filter(
      (lot) =>
        lot.quantityAvailable > 0 &&
        (
          requiredRecipeIds.includes(lot.recipeId) ||
          requiredRecipeIds.includes(lot.metadata?.recipeId)
        )
    );

    const componentRows = requiredRecipeIds.map((recipeId) => {
      const matchingLots = availableLots.filter(
        (lot) =>
          lot.recipeId === recipeId ||
          lot.metadata?.recipeId === recipeId
      );
      const available = matchingLots.reduce(
        (sum, lot) => sum + lot.quantityAvailable,
        0
      );

      return freeze({
        recipeId,
        name: rfisPlatform.recipes.name(recipeId),
        requested: quantity,
        available,
        sufficient: available >= quantity,
        lotIds: matchingLots.map((lot) => lot.id),
      });
    });

    return freeze({
      dinner: dinnerView,
      requestedMeals: quantity,
      components: componentRows,
      canBuild: componentRows.every((row) => row.sufficient),
      missing: componentRows
        .filter((row) => !row.sufficient)
        .map((row) => ({
          recipeId: row.recipeId,
          name: row.name,
          shortfall: Math.max(0, row.requested - row.available),
        })),
    });
  }

  function buildCompleteDinner({
    dinnerId,
    quantity,
    componentLots,
    storageLocation = "freezer",
    packageType = null,
    notes = "",
  }) {
    const dinnerView = dinner(dinnerId);
    if (!dinnerView) {
      throw new Error(`RFIS Complete Dinner not found: ${dinnerId}`);
    }

    if (!Array.isArray(componentLots) || componentLots.length === 0) {
      throw new Error("componentLots are required");
    }

    const expectedRecipeIds = new Set([
      dinnerView.entreeRecipeId,
      ...dinnerView.sideRecipeIds,
    ]);

    for (const component of componentLots) {
      const lot = inventory.get(component.lotId);
      if (!lot) {
        throw new Error(`Inventory lot not found: ${component.lotId}`);
      }

      const recipeId =
        lot.recipeId ||
        lot.metadata?.recipeId ||
        component.recipeId;

      if (!expectedRecipeIds.has(recipeId)) {
        throw new Error(
          `${lot.name} is not part of ${dinnerView.title}`
        );
      }
    }

    const result = actions.buildMeals({
      title: dinnerView.title,
      completeDinnerId: dinnerView.id,
      quantity,
      components: componentLots.map((item) => ({
        lotId: item.lotId,
        quantityPerMeal: item.quantityPerMeal || 1,
      })),
      storageLocation,
      packageType,
      notes,
    });

    return freeze({
      ...result,
      rfisDinner: dinnerView,
    });
  }

  function availabilityForRecipe(recipeId) {
    const profile = recipe(recipeId);
    if (!profile) return null;

    const lots = inventory.all().filter(
      (lot) =>
        lot.quantityAvailable > 0 &&
        (
          lot.recipeId === recipeId ||
          lot.metadata?.recipeId === recipeId
        )
    );

    return freeze({
      recipe: profile,
      quantityAvailable: lots.reduce(
        (sum, lot) => sum + lot.quantityAvailable,
        0
      ),
      lots: lots.map((lot) => ({
        id: lot.id,
        name: lot.name,
        quantityAvailable: lot.quantityAvailable,
        unit: lot.unit,
        storageLocation: lot.storageLocation,
      })),
    });
  }

  return Object.freeze({
    recipe,
    dinner,
    cookRecipe,
    assemblyPlan,
    buildCompleteDinner,
    availabilityForRecipe,
  });
}

export default createRfisBridgeService;
