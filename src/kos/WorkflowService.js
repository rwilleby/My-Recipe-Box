function freezeObject(value) {
  return Object.freeze({ ...value });
}

export function createWorkflowService({
  repository,
  inventory,
  production,
  assembly,
  packaging,
  lineage,
} = {}) {
  if (!repository || !inventory || !production || !assembly || !packaging || !lineage) {
    throw new Error("WorkflowService requires all KOS foundation services");
  }

  function available({ type = "all", includeEmpty = false } = {}) {
    return inventory
      .all({ includeEmpty })
      .filter((lot) => type === "all" || lot.itemType === type)
      .map((lot) =>
        freezeObject({
          id: lot.id,
          name: lot.name,
          type: lot.itemType,
          quantity: lot.quantityAvailable,
          unit: lot.unit,
          location: lot.storageLocation,
          packageType: lot.metadata?.packageType || "",
          sourceSessionId: lot.sourceSessionId,
          sourceLotIds: Object.freeze([...(lot.sourceLotIds || [])]),
          readyToEat: ["finished-meal", "lunch", "snack", "dessert", "family-meal"].includes(lot.itemType),
        })
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function counts() {
    const items = available();
    const readyTypes = new Set(["finished-meal", "lunch", "snack", "dessert", "family-meal"]);
    return freezeObject({
      components: items
        .filter((item) => item.type === "component")
        .reduce((sum, item) => sum + item.quantity, 0),
      readyMeals: items
        .filter((item) => readyTypes.has(item.type))
        .reduce((sum, item) => sum + item.quantity, 0),
      totalUnits: items.reduce((sum, item) => sum + item.quantity, 0),
      lotCount: items.length,
    });
  }

  function recentActivity({ limit = 8 } = {}) {
    const state = repository.load();
    const rows = [];

    for (const session of state.sessions || []) {
      rows.push({
        id: session.id,
        type: session.sessionType,
        occurredAt: session.occurredAt || session.createdAt,
        title: session.title,
        detail: `${session.totalYield} total · ${session.eatenNow || 0} eaten`,
      });
    }

    for (const entry of state.packages || []) {
      rows.push({
        id: entry.id,
        type: "packaging",
        occurredAt: entry.createdAt,
        title: entry.label || entry.packageType,
        detail: `${entry.packageCount} ${entry.packageType}`,
      });
    }

    for (const entry of state.consumptionEvents || []) {
      rows.push({
        id: entry.id,
        type: "consumption",
        occurredAt: entry.consumedAt,
        title: "Food consumed",
        detail: `${entry.quantity} ${entry.unit}`,
      });
    }

    return rows
      .sort((a, b) => String(b.occurredAt || "").localeCompare(String(a.occurredAt || "")))
      .slice(0, Math.max(0, limit))
      .map(freezeObject);
  }

  function suggestedActions({ limit = 6 } = {}) {
    const items = available();
    const actions = [];
    const components = items.filter((item) => item.type === "component");
    const ready = items.filter((item) => item.readyToEat);

    if (components.length) {
      actions.push({
        id: "assemble-components",
        kind: "assemble",
        title: "Build meals from available components",
        detail: `${components.length} component lot${components.length === 1 ? "" : "s"} available`,
        priority: 100,
      });
    }

    if (ready.length) {
      actions.push({
        id: "choose-ready-meal",
        kind: "consume",
        title: "Choose something ready to eat",
        detail: `${ready.reduce((sum, item) => sum + item.quantity, 0)} portions available`,
        priority: 90,
      });
    }

    const packagedLotIds = new Set((repository.load().packages || []).map((entry) => entry.lotId));
    const unpackaged = items.filter((item) => !packagedLotIds.has(item.id));
    if (unpackaged.length) {
      actions.push({
        id: "package-food",
        kind: "package",
        title: "Add packaging details",
        detail: `${unpackaged.length} available lot${unpackaged.length === 1 ? "" : "s"} not yet packaged`,
        priority: 70,
      });
    }

    if (!items.length) {
      actions.push({
        id: "start-cooking",
        kind: "production",
        title: "Record what you’re cooking",
        detail: "Start with a recipe or cooked item",
        priority: 100,
      });
    }

    return actions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, Math.max(0, limit))
      .map(freezeObject);
  }

  function quickStartOptions() {
    return Object.freeze([
      freezeObject({
        id: "cook",
        title: "I’m cooking today",
        description: "Record what you make and where it goes.",
      }),
      freezeObject({
        id: "package",
        title: "I’m packaging food",
        description: "Save meals, components, lunches, or desserts.",
      }),
      freezeObject({
        id: "assemble",
        title: "I’m building freezer meals",
        description: "Combine available components into finished meals.",
      }),
      freezeObject({
        id: "available",
        title: "Show me what’s available",
        description: "See components and meals ready to use.",
      }),
    ]);
  }

  function dashboard() {
    return freezeObject({
      counts: counts(),
      available: Object.freeze(available()),
      recentActivity: Object.freeze(recentActivity()),
      suggestedActions: Object.freeze(suggestedActions()),
      quickStartOptions: quickStartOptions(),
    });
  }

  function describeLineage(lotId) {
    const chain = lineage.chain(lotId);
    if (!chain) return null;
    return freezeObject({
      lotId,
      ancestors: Object.freeze(
        chain.ancestors.map((item) =>
          freezeObject({
            id: item.id,
            name: item.name,
            type: item.itemType,
          })
        )
      ),
      current: freezeObject({
        id: chain.current.id,
        name: chain.current.name,
        type: chain.current.itemType,
      }),
      descendants: Object.freeze(
        chain.descendants.map((item) =>
          freezeObject({
            id: item.id,
            name: item.name,
            type: item.itemType,
          })
        )
      ),
    });
  }

  return Object.freeze({
    available,
    counts,
    recentActivity,
    suggestedActions,
    quickStartOptions,
    dashboard,
    describeLineage,
  });
}

export default createWorkflowService;
