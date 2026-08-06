function deepFreeze(value) {
  if (Array.isArray(value)) return Object.freeze(value.map(deepFreeze));
  if (value && typeof value === "object") {
    return Object.freeze(
      Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, deepFreeze(item)])
      )
    );
  }
  return value;
}

const READY_TYPES = new Set([
  "finished-meal",
  "lunch",
  "snack",
  "dessert",
  "family-meal",
]);

const RECOVERY_RULES = Object.freeze([
  {
    id: "older-bread",
    terms: ["bread", "roll", "bun"],
    suggestions: ["Bread Pudding", "Croutons", "Breadcrumbs", "French Toast Casserole"],
  },
  {
    id: "cooked-rice",
    terms: ["rice"],
    suggestions: ["Fried Rice", "Rice Pudding", "Stuffed Peppers"],
  },
  {
    id: "cooked-ham",
    terms: ["ham"],
    suggestions: ["Ham and Bean Soup", "Breakfast Casserole", "Ham Salad"],
  },
  {
    id: "cooked-turkey",
    terms: ["turkey"],
    suggestions: ["Turkey Pot Pie", "Turkey Soup", "Turkey Sandwich Packs"],
  },
  {
    id: "mashed-potatoes",
    terms: ["mashed potato"],
    suggestions: ["Potato Cakes", "Shepherd’s Pie Topping", "Loaded Potato Bowls"],
  },
]);

function suggestion({ id, kind, title, detail, priority, action = null, sourceIds = [], metadata = {} }) {
  return deepFreeze({
    id,
    kind,
    title,
    detail,
    priority,
    tone: "optional",
    language: "could",
    action,
    sourceIds,
    metadata,
  });
}

export function createAssistantService({
  repository,
  inventory,
  workflow,
  packaging,
  rfisPlatform = null,
  rfisBridge = null,
} = {}) {
  if (!repository || !inventory || !workflow || !packaging) {
    throw new Error("AssistantService requires repository, inventory, workflow, and packaging");
  }

  function readyMealSuggestions() {
    const ready = inventory
      .all()
      .filter((lot) => READY_TYPES.has(lot.itemType) && lot.quantityAvailable > 0);

    if (!ready.length) return [];

    const total = ready.reduce((sum, lot) => sum + lot.quantityAvailable, 0);
    return [
      suggestion({
        id: "ready-to-eat",
        kind: "consume",
        title: "You have food ready to eat",
        detail: `${total} portion${total === 1 ? " is" : "s are"} available now.`,
        priority: 80,
        action: "open-available",
        sourceIds: ready.map((lot) => lot.id),
      }),
    ];
  }

  function packagingSuggestions() {
    const state = repository.load();
    const packagedLotIds = new Set((state.packages || []).map((entry) => entry.lotId));
    const unpackaged = inventory
      .all()
      .filter((lot) => lot.quantityAvailable > 0 && !packagedLotIds.has(lot.id));

    if (!unpackaged.length) return [];

    return [
      suggestion({
        id: "packaging-opportunity",
        kind: "package",
        title: "You could add packaging details",
        detail: `${unpackaged.length} available item${unpackaged.length === 1 ? " has" : "s have"} not been assigned a container yet.`,
        priority: 45,
        action: "open-packaging",
        sourceIds: unpackaged.map((lot) => lot.id),
      }),
    ];
  }

  function genericAssemblySuggestions() {
    const components = inventory
      .all()
      .filter((lot) => lot.itemType === "component" && lot.quantityAvailable > 0);

    if (components.length < 2) return [];

    return [
      suggestion({
        id: "component-assembly",
        kind: "assemble",
        title: "You could build meals from what is already cooked",
        detail: `${components.length} component lots are available for meal assembly.`,
        priority: 70,
        action: "start-assembly",
        sourceIds: components.map((lot) => lot.id),
      }),
    ];
  }

  function exactDinnerSuggestions({ limit = 6 } = {}) {
    if (!rfisPlatform || !rfisBridge) return [];

    return rfisPlatform.completeDinners
      .all()
      .map((dinner) => {
        const plan = rfisBridge.assemblyPlan(dinner.id, { quantity: 1 });
        if (!plan.canBuild) return null;
        const capacity = Math.min(
          ...plan.components.map((component) => Math.floor(component.available))
        );
        if (!Number.isFinite(capacity) || capacity < 1) return null;

        return suggestion({
          id: `build-${dinner.id}`,
          kind: "assemble-complete-dinner",
          title: `You could build ${plan.dinner.title}`,
          detail: `Enough matching components are available for up to ${capacity} meal${capacity === 1 ? "" : "s"}.`,
          priority: 95 + Math.min(capacity, 20),
          action: "start-complete-dinner-assembly",
          sourceIds: plan.components.flatMap((component) => component.lotIds),
          metadata: {
            dinnerId: plan.dinner.id,
            legacyId: plan.dinner.legacyId,
            capacity,
          },
        });
      })
      .filter(Boolean)
      .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title))
      .slice(0, Math.max(0, limit));
  }

  function recoverySuggestions({ limit = 4 } = {}) {
    const componentLots = inventory
      .all()
      .filter((lot) => lot.itemType === "component" && lot.quantityAvailable > 0);
    const matches = [];

    for (const lot of componentLots) {
      const normalized = lot.name.toLowerCase();
      const rule = RECOVERY_RULES.find((item) =>
        item.terms.some((term) => normalized.includes(term))
      );
      if (!rule) continue;

      matches.push(
        suggestion({
          id: `recover-${rule.id}-${lot.id}`,
          kind: "recover",
          title: `You could give ${lot.name} a new use`,
          detail: `Ideas include ${rule.suggestions.slice(0, 3).join(", ")}.`,
          priority: 60,
          action: "start-recovery",
          sourceIds: [lot.id],
          metadata: {
            lotId: lot.id,
            ruleId: rule.id,
            ideas: rule.suggestions,
          },
        })
      );
    }

    return matches.slice(0, Math.max(0, limit));
  }

  function suggestions({ limit = 8, includePackaging = true } = {}) {
    const rows = [
      ...exactDinnerSuggestions({ limit }),
      ...genericAssemblySuggestions(),
      ...recoverySuggestions({ limit }),
      ...readyMealSuggestions(),
      ...(includePackaging ? packagingSuggestions() : []),
    ];

    if (!rows.length) {
      rows.push(
        suggestion({
          id: "record-cooking",
          kind: "production",
          title: "You could record what you are cooking",
          detail: "A quick cooking record is enough to begin building kitchen memory.",
          priority: 50,
          action: "start-production",
        })
      );
    }

    const deduped = new Map();
    for (const row of rows) {
      if (!deduped.has(row.id)) deduped.set(row.id, row);
    }

    return Object.freeze(
      [...deduped.values()]
        .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title))
        .slice(0, Math.max(0, limit))
    );
  }

  function summary() {
    const dashboard = workflow.dashboard();
    const assistantSuggestions = suggestions();
    return deepFreeze({
      counts: dashboard.counts,
      headline:
        assistantSuggestions[0]?.title || "Your kitchen is ready when you are",
      suggestions: assistantSuggestions,
      available: dashboard.available,
      recentActivity: dashboard.recentActivity,
    });
  }

  function validateLanguage() {
    const prohibited = ["must", "should", "failed", "bad", "wrong", "overdue"];
    const rows = suggestions({ limit: 100 });
    const violations = [];

    for (const row of rows) {
      const text = `${row.title} ${row.detail}`.toLowerCase();
      for (const word of prohibited) {
        if (new RegExp(`\\b${word}\\b`).test(text)) {
          violations.push({ suggestionId: row.id, word });
        }
      }
    }

    return deepFreeze({
      ok: violations.length === 0,
      checked: rows.length,
      violations,
    });
  }

  return Object.freeze({
    suggestions,
    summary,
    readyMealSuggestions,
    packagingSuggestions,
    genericAssemblySuggestions,
    exactDinnerSuggestions,
    recoverySuggestions,
    validateLanguage,
    recoveryRules: RECOVERY_RULES,
  });
}

export default createAssistantService;
