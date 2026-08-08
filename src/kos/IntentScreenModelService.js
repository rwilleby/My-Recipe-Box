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

const SLOT_ORDER = Object.freeze([
  "start",
  "workspace",
  "assistant",
  "suggestions",
  "progress",
  "wisdom",
]);

export function createIntentScreenModelService({
  kitchen,
  intents,
  inventoryIntelligence,
  mealPlanner,
  shopping,
  pantry,
  productionCenter,
  companion,
  assistant,
  opportunities,
} = {}) {
  if (
    !kitchen ||
    !intents ||
    !inventoryIntelligence ||
    !mealPlanner ||
    !shopping ||
    !pantry ||
    !productionCenter ||
    !companion ||
    !assistant ||
    !opportunities
  ) {
    throw new Error(
      "IntentScreenModelService requires the consolidated KOS presentation services"
    );
  }

  function slot(key, title, data, action = null) {
    return freeze({
      key,
      title,
      data,
      action,
    });
  }

  function dinner() {
    const ready = inventoryIntelligence.readyToEat();
    return freeze({
      start: slot(
        "start",
        "Find Dinner",
        {
          readyNow: ready.slice(0, 6),
          hasReadyMeals: ready.length > 0,
        },
        "find-dinner"
      ),
      workspace: slot(
        "workspace",
        "Dinner Ideas",
        {
          source: "rfis-search",
          readyNow: ready,
        }
      ),
      assistant: slot(
        "assistant",
        "Narrow It Down",
        {
          filters: ["time", "protein", "cuisine", "mealBalance"],
        }
      ),
      suggestions: slot(
        "suggestions",
        "Quick Suggestions",
        assistant.suggestions({ limit: 6 })
      ),
      progress: slot(
        "progress",
        "Recently Available",
        ready.slice(0, 6)
      ),
      wisdom: slot(
        "wisdom",
        "Kitchen Tip",
        {
          message:
            "Start with what is already ready, then fill the gap with a simple recipe.",
        }
      ),
    });
  }

  function planWeek() {
    const dashboard = mealPlanner.dashboard();
    return freeze({
      start: slot(
        "start",
        "Choose Your Week",
        {
          weekOf: dashboard.plan.weekOf,
          mode: dashboard.plan.mode,
        },
        "open-planner"
      ),
      workspace: slot(
        "workspace",
        "This Week",
        dashboard.rows
      ),
      assistant: slot(
        "assistant",
        "Weekly Balance",
        dashboard.analysis
      ),
      suggestions: slot(
        "suggestions",
        "Suggested Adjustments",
        dashboard.suggestions
      ),
      progress: slot(
        "progress",
        "Planning Progress",
        {
          plannedCount: dashboard.analysis.plannedCount,
          openDays: dashboard.analysis.openDays,
        }
      ),
      wisdom: slot(
        "wisdom",
        "Planning Tip",
        {
          message:
            "Mix fresh cooking with meals you already have ready to reduce work during the week.",
        }
      ),
    });
  }

  function cook() {
    const home = productionCenter.home();
    return freeze({
      start: slot(
        "start",
        "What Are You Cooking?",
        {
          active: productionCenter.active(),
        },
        "start-production"
      ),
      workspace: slot(
        "workspace",
        "Today's Cooking",
        {
          active: productionCenter.active(),
          companion: companion.cooking(),
        }
      ),
      assistant: slot(
        "assistant",
        "Recipe Help",
        {
          activeRecipe: companion.recipeCard(),
        }
      ),
      suggestions: slot(
        "suggestions",
        "What Could This Become?",
        home.suggestions
      ),
      progress: slot(
        "progress",
        "Today's Kitchen",
        home.recent
      ),
      wisdom: slot(
        "wisdom",
        "Cooking Tip",
        {
          message:
            "Record the finished yield once, then decide what was eaten, frozen, or saved as a component.",
        }
      ),
    });
  }

  function freezerMeals() {
    const components = inventoryIntelligence.components();
    return freeze({
      start: slot(
        "start",
        "Choose Components",
        components,
        "start-assembly"
      ),
      workspace: slot(
        "workspace",
        "Build Complete Dinners",
        {
          components,
          opportunities: opportunities.list({ limit: 8 }),
        }
      ),
      assistant: slot(
        "assistant",
        "Available Quantities",
        {
          componentUnits:
            inventoryIntelligence.snapshot().componentUnits,
        }
      ),
      suggestions: slot(
        "suggestions",
        "Suggested Builds",
        opportunities.list({ limit: 8 })
      ),
      progress: slot(
        "progress",
        "Meals Created",
        kitchen.home().inventory.summary
      ),
      wisdom: slot(
        "wisdom",
        "Freezer Tip",
        {
          message:
            "Build only what your available component quantities support; KOS will guard against overuse.",
        }
      ),
    });
  }

  function available() {
    const dashboard = inventoryIntelligence.dashboard();
    return freeze({
      start: slot(
        "start",
        "Choose a Location",
        {
          locations: Object.keys(
            inventoryIntelligence.snapshot().byLocation
          ),
        }
      ),
      workspace: slot(
        "workspace",
        "Ready to Eat",
        dashboard.readyToEat
      ),
      assistant: slot(
        "assistant",
        "Available Components",
        dashboard.components
      ),
      suggestions: slot(
        "suggestions",
        "Best Next Uses",
        dashboard.useNext
      ),
      progress: slot(
        "progress",
        "Kitchen Totals",
        dashboard.summary
      ),
      wisdom: slot(
        "wisdom",
        "Storage Tip",
        {
          message:
            "Use refrigerated items first, then older freezer items.",
        }
      ),
    });
  }

  function shoppingModel() {
    const dashboard = shopping.dashboard();
    return freeze({
      start: slot(
        "start",
        "Build From",
        {
          options: ["planner", "recipe", "manual"],
        },
        "open-shopping"
      ),
      workspace: slot(
        "workspace",
        "Shopping List",
        dashboard.items
      ),
      assistant: slot(
        "assistant",
        "Already Have",
        {
          pantrySummary: pantry.summary(),
        }
      ),
      suggestions: slot(
        "suggestions",
        "Combine Purchases",
        dashboard.overlaps
      ),
      progress: slot(
        "progress",
        "List Progress",
        dashboard.summary
      ),
      wisdom: slot(
        "wisdom",
        "Shopping Tip",
        {
          message:
            "Check what is already on hand before buying duplicate ingredients.",
        }
      ),
    });
  }

  function recipes() {
    return freeze({
      start: slot(
        "start",
        "Browse By",
        {
          options: ["category", "ingredient", "method", "favorites"],
        },
        "open-recipes"
      ),
      workspace: slot(
        "workspace",
        "Recipe Library",
        {
          source: "rfis-recipes",
        }
      ),
      assistant: slot(
        "assistant",
        "Filters",
        {
          options: ["nutrition", "mealBalance", "glp1", "time"],
        }
      ),
      suggestions: slot(
        "suggestions",
        "Recommended Recipes",
        assistant.suggestions({ limit: 6 })
      ),
      progress: slot(
        "progress",
        "Favorites & Recent",
        {
          source: "recipe-history",
        }
      ),
      wisdom: slot(
        "wisdom",
        "Recipe Tip",
        {
          message:
            "Use filters only when they help; browsing should stay simple by default.",
        }
      ),
    });
  }

  function learn() {
    return freeze({
      start: slot(
        "start",
        "Choose a Topic",
        {
          topics: [
            "cooking methods",
            "food safety",
            "freezer storage",
            "planning",
            "equipment tips",
          ],
        },
        "open-learning"
      ),
      workspace: slot(
        "workspace",
        "Today's Lesson",
        {
          source: "reference-guides",
        }
      ),
      assistant: slot(
        "assistant",
        "Reference Guide",
        {
          source: "supporting-pages",
        }
      ),
      suggestions: slot(
        "suggestions",
        "Try This Next",
        {
          source: "related-guides",
        }
      ),
      progress: slot(
        "progress",
        "Recently Learned",
        {
          source: "learning-history",
        }
      ),
      wisdom: slot(
        "wisdom",
        "Kitchen Wisdom",
        {
          message:
            "Learn only as much as you need for the task in front of you.",
        }
      ),
    });
  }

  const builders = Object.freeze({
    dinner,
    "plan-week": planWeek,
    cook,
    "freezer-meals": freezerMeals,
    available,
    shopping: shoppingModel,
    recipes,
    learn,
  });

  function screen(intentId) {
    const contract = intents.contract(intentId);
    const build = builders[intentId];
    if (!contract || !build) return null;

    const built = build();
    return freeze({
      id: contract.id,
      title: contract.title,
      description: contract.description,
      primaryAction: contract.primaryAction,
      slots: SLOT_ORDER.map((key) => built[key]),
    });
  }

  function all() {
    return freeze(
      intents.list().map((intent) => screen(intent.id))
    );
  }

  return Object.freeze({
    slotOrder: SLOT_ORDER,
    screen,
    all,
  });
}

export default createIntentScreenModelService;
