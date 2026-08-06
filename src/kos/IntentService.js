const SLOT_KEYS = Object.freeze([
  "start",
  "workspace",
  "assistant",
  "suggestions",
  "progress",
  "wisdom",
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

const INTENTS = freeze([
  {
    id: "dinner",
    title: "I Just Need Dinner",
    description: "Find a practical dinner without making it complicated.",
    primaryAction: "find-dinner",
    slots: {
      start: { title: "Start Here", dataSource: "search.quickDinner" },
      workspace: { title: "Dinner Ideas", dataSource: "search.dinners" },
      assistant: { title: "Narrow It Down", dataSource: "filters.dinner" },
      suggestions: { title: "Quick Suggestions", dataSource: "recommendations.quick" },
      progress: { title: "Recently Viewed", dataSource: "history.recipes" },
      wisdom: { title: "Kitchen Tip", dataSource: "content.quickDinnerTip" },
    },
  },
  {
    id: "plan-week",
    title: "Help Me Plan My Week",
    description: "Build a useful week of dinners and one organized shopping list.",
    primaryAction: "open-planner",
    slots: {
      start: { title: "Choose a Week", dataSource: "planner.start" },
      workspace: { title: "This Week", dataSource: "planner.week" },
      assistant: { title: "Weekly Balance", dataSource: "planner.analysis" },
      suggestions: { title: "Suggested Dinners", dataSource: "recommendations.week" },
      progress: { title: "Planning Progress", dataSource: "planner.progress" },
      wisdom: { title: "Planning Tip", dataSource: "content.planningTip" },
    },
  },
  {
    id: "cook",
    title: "I'm Cooking Today",
    description: "Record what you make and decide what happens to the extra food.",
    primaryAction: "start-production",
    slots: {
      start: { title: "What Are You Cooking?", dataSource: "production.start" },
      workspace: { title: "Today's Cooking", dataSource: "production.active" },
      assistant: { title: "Recipe Help", dataSource: "recipe.cookingMode" },
      suggestions: { title: "What Can This Become?", dataSource: "workflow.suggestedActions" },
      progress: { title: "Today's Kitchen", dataSource: "workflow.recentActivity" },
      wisdom: { title: "Cooking Tip", dataSource: "content.productionTip" },
    },
  },
  {
    id: "freezer-meals",
    title: "I'm Building Freezer Meals",
    description: "Combine cooked components into meals for later.",
    primaryAction: "start-assembly",
    slots: {
      start: { title: "Choose Components", dataSource: "workflow.components" },
      workspace: { title: "Build Complete Dinners", dataSource: "assembly.workspace" },
      assistant: { title: "Available Quantities", dataSource: "assembly.capacity" },
      suggestions: { title: "Suggested Builds", dataSource: "recommendations.assembly" },
      progress: { title: "Meals Created", dataSource: "assembly.progress" },
      wisdom: { title: "Freezer Tip", dataSource: "content.freezerTip" },
    },
  },
  {
    id: "available",
    title: "Show Me What's Available",
    description: "See meals and components already ready to use.",
    primaryAction: "open-available",
    slots: {
      start: { title: "Choose a Location", dataSource: "inventory.locations" },
      workspace: { title: "Ready to Eat", dataSource: "workflow.available" },
      assistant: { title: "Available Components", dataSource: "workflow.components" },
      suggestions: { title: "Best Next Uses", dataSource: "workflow.suggestedActions" },
      progress: { title: "Kitchen Totals", dataSource: "workflow.counts" },
      wisdom: { title: "Storage Tip", dataSource: "content.storageTip" },
    },
  },
  {
    id: "shopping",
    title: "Build My Shopping List",
    description: "Create one practical list from recipes, meals, or the weekly plan.",
    primaryAction: "open-shopping",
    slots: {
      start: { title: "Build From", dataSource: "shopping.sources" },
      workspace: { title: "Shopping List", dataSource: "shopping.list" },
      assistant: { title: "Already Have", dataSource: "inventory.ingredients" },
      suggestions: { title: "Combine Purchases", dataSource: "shopping.overlap" },
      progress: { title: "List Progress", dataSource: "shopping.progress" },
      wisdom: { title: "Shopping Tip", dataSource: "content.shoppingTip" },
    },
  },
  {
    id: "recipes",
    title: "Browse Recipes",
    description: "Explore the recipe library by category, ingredient, or cooking method.",
    primaryAction: "open-recipes",
    slots: {
      start: { title: "Browse By", dataSource: "recipes.categories" },
      workspace: { title: "Recipe Library", dataSource: "recipes.results" },
      assistant: { title: "Filters", dataSource: "recipes.filters" },
      suggestions: { title: "Recommended Recipes", dataSource: "recommendations.recipes" },
      progress: { title: "Favorites & Recent", dataSource: "history.recipes" },
      wisdom: { title: "Recipe Tip", dataSource: "content.recipeTip" },
    },
  },
  {
    id: "learn",
    title: "Teach Me Something New",
    description: "Learn a practical cooking, storage, planning, or food-safety skill.",
    primaryAction: "open-learning",
    slots: {
      start: { title: "Choose a Topic", dataSource: "learning.topics" },
      workspace: { title: "Today's Lesson", dataSource: "learning.lesson" },
      assistant: { title: "Reference Guide", dataSource: "learning.reference" },
      suggestions: { title: "Try This Next", dataSource: "learning.related" },
      progress: { title: "Recently Learned", dataSource: "learning.history" },
      wisdom: { title: "Kitchen Wisdom", dataSource: "content.seasonalTip" },
    },
  },
]);

export function createIntentService() {
  const byId = new Map(INTENTS.map((intent) => [intent.id, intent]));

  function list() {
    return INTENTS;
  }

  function get(identifier) {
    return byId.get(String(identifier || "").trim()) || null;
  }

  function defaultIntent() {
    return get("dinner");
  }

  function slots(identifier) {
    const intent = get(identifier);
    if (!intent) return null;
    return SLOT_KEYS.map((key) =>
      freeze({
        key,
        ...intent.slots[key],
      })
    );
  }

  function contract(identifier) {
    const intent = get(identifier);
    if (!intent) return null;
    return freeze({
      id: intent.id,
      title: intent.title,
      description: intent.description,
      primaryAction: intent.primaryAction,
      slots: slots(intent.id),
    });
  }

  function validate() {
    const errors = [];
    for (const intent of INTENTS) {
      for (const key of SLOT_KEYS) {
        if (!intent.slots[key]) {
          errors.push(`${intent.id} is missing slot ${key}`);
        }
      }
    }
    return freeze({
      ok: errors.length === 0,
      intentCount: INTENTS.length,
      slotCountPerIntent: SLOT_KEYS.length,
      errors,
    });
  }

  return Object.freeze({
    list,
    get,
    defaultIntent,
    slots,
    contract,
    validate,
    slotKeys: SLOT_KEYS,
  });
}

export default createIntentService;
