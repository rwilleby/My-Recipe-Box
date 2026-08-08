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
} = {}) {
  if (!productionCenter || !availableMeals || !workflow || !intents || !assistant) {
    throw new Error("KitchenCompanionService requires KOS presentation services");
  }

  function home() {
    return freeze({
      activeCooking: productionCenter.resumeCard(),
      readyMeals: availableMeals.summary(),
      quickActions: intents.list().map((intent) => ({
        id: intent.id,
        title: intent.title,
        description: intent.description,
      })),
      suggestions: assistant.suggestions({ limit: 4 }),
      kitchenCounts: workflow.counts(),
    });
  }

  function cooking() {
    return freeze({
      active: productionCenter.active(),
      resume: productionCenter.resumeCard(),
      suggestions: assistant.suggestions({ limit: 4 }),
    });
  }

  return Object.freeze({
    home,
    cooking,
  });
}

export default createKitchenCompanionService;
