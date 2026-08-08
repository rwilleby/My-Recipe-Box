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

export function createKitchenOperationsFacade(platform) {
  if (!platform) throw new Error("KitchenOperationsFacade requires KOS platform");

  const required = [
    "productionCenter",
    "availableMeals",
    "inventoryIntelligence",
    "mealPlanner",
    "shopping",
    "pantry",
    "useWhatIHave",
    "shoppingReconciliation",
    "companion",
    "protection",
  ];
  for (const name of required) {
    if (!platform[name]) {
      throw new Error(`KitchenOperationsFacade missing service: ${name}`);
    }
  }

  function home() {
    return freeze({
      companion: platform.companion.home(),
      production: platform.productionCenter.home(),
      inventory: platform.inventoryIntelligence.dashboard(),
      planner: platform.mealPlanner.dashboard(),
      shopping: platform.shopping.dashboard(),
      pantry: {
        summary: platform.pantry.summary(),
        expiringSoon: platform.pantry.expiring({ withinDays: 7 }),
      },
      backup: platform.protection.recoveryStatus(),
    });
  }

  function intent(intentId) {
    const contract = platform.intents.contract(intentId);
    if (!contract) return null;

    const payload = { contract };

    switch (intentId) {
      case "cook":
        payload.data = platform.productionCenter.home();
        break;
      case "freezer-meals":
        payload.data = {
          components: platform.inventoryIntelligence.components(),
          opportunities: platform.opportunities.list({ limit: 8 }),
        };
        break;
      case "available":
        payload.data = platform.inventoryIntelligence.dashboard();
        break;
      case "plan-week":
        payload.data = platform.mealPlanner.dashboard();
        break;
      case "shopping":
        payload.data = {
          shopping: platform.shopping.dashboard(),
          reconciliation: platform.shoppingReconciliation.reconcile(),
        };
        break;
      case "dinner":
        payload.data = {
          readyMeals: platform.availableMeals.list(),
          useNext: platform.inventoryIntelligence.useNext({ limit: 6 }),
        };
        break;
      case "recipes":
        payload.data = { status: "rfis" };
        break;
      case "learn":
        payload.data = { status: "content" };
        break;
      default:
        payload.data = {};
    }

    return freeze(payload);
  }

  function health() {
    const checks = {
      repository: Boolean(platform.repository),
      rfisBridge: platform.rfis !== undefined,
      production: Boolean(platform.productionCenter),
      inventory: Boolean(platform.inventoryIntelligence),
      planner: Boolean(platform.mealPlanner),
      shopping: Boolean(platform.shopping),
      pantry: Boolean(platform.pantry),
      companion: Boolean(platform.companion),
      backup: Boolean(platform.protection),
    };

    return freeze({
      ok: Object.values(checks).every(Boolean),
      checks,
    });
  }

  return Object.freeze({
    home,
    intent,
    health,
  });
}

export default createKitchenOperationsFacade;
