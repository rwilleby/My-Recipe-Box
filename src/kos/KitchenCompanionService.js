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

export function createKitchenCompanionService({
  productionCenter,
  availableMeals,
  workflow,
  intents,
  assistant,
  cookingSessions,
  timers,
  inventoryIntelligence,
} = {}) {
  if (
    !productionCenter ||
    !availableMeals ||
    !workflow ||
    !intents ||
    !assistant ||
    !cookingSessions ||
    !timers ||
    !inventoryIntelligence
  ) {
    throw new Error(
      "KitchenCompanionService requires KOS presentation services"
    );
  }

  function home() {
    return freeze({
      activeProduction: productionCenter.resumeCard(),
      activeRecipe: cookingSessions.current(),
      timers: timers.all(),
      readyMeals: availableMeals.summary(),
      quickActions: intents.list().map((intent) => ({
        id: intent.id,
        title: intent.title,
        description: intent.description,
      })),
      suggestions: assistant.suggestions({ limit: 4 }),
      kitchenCounts: workflow.counts(),
      inventory: inventoryIntelligence.dashboard(),
    });
  }

  function cooking() {
    return freeze({
      production: productionCenter.active(),
      recipe: cookingSessions.current(),
      timers: timers.all(),
      suggestions: assistant.suggestions({ limit: 4 }),
    });
  }

  function recipeCard() {
    const session = cookingSessions.current();
    if (!session) return null;
    return freeze({
      id: session.id,
      recipeId: session.recipeId,
      title: session.title,
      currentStep: session.currentStep,
      currentStepIndex: session.currentStepIndex,
      stepCount: session.steps.length,
      completedStepCount: session.completedStepIds.length,
      progress: session.progress,
      notes: session.notes,
      timers: session.activeTimers,
      canGoBack: session.currentStepIndex > 0,
      canGoForward:
        session.currentStepIndex < session.steps.length - 1,
    });
  }

  function available() {
    return inventoryIntelligence.dashboard();
  }

  return Object.freeze({
    home,
    cooking,
    recipeCard,
    available,
  });
}

export default createKitchenCompanionService;
