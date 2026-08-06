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

function localDay(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toISOString().slice(0, 10);
}

export function createTimelineService({ repository, inventory } = {}) {
  if (!repository || !inventory) {
    throw new Error("TimelineService requires repository and inventory");
  }

  function entries({ limit = 100, type = "all" } = {}) {
    const state = repository.load();
    const rows = [];

    for (const session of state.sessions || []) {
      rows.push({
        id: session.id,
        type: session.sessionType,
        occurredAt: session.occurredAt || session.createdAt,
        title: session.title,
        summary: `${session.totalYield} total · ${session.eatenNow || 0} eaten · ${session.unallocated || 0} unallocated`,
        recipeId: session.recipeId || null,
        outputLotIds: [...(session.outputLotIds || [])],
        sourceLotIds: (session.sourceLotUses || []).map((use) => use.lotId),
      });
    }

    for (const record of state.packages || []) {
      const lot = inventory.get(record.lotId);
      rows.push({
        id: record.id,
        type: "package",
        occurredAt: record.createdAt,
        title: record.label || `Packaged ${lot?.name || "food"}`,
        summary: `${record.packageCount} ${record.packageType}`,
        lotId: record.lotId,
      });
    }

    for (const record of state.consumptionEvents || []) {
      const lot = record.lotId ? inventory.get(record.lotId) : null;
      rows.push({
        id: record.id,
        type: "consume",
        occurredAt: record.consumedAt,
        title: lot ? `Ate ${lot.name}` : "Food consumed",
        summary: `${record.quantity} ${record.unit || lot?.unit || "servings"}`,
        lotId: record.lotId || null,
        sessionId: record.sessionId || null,
      });
    }

    return freeze(
      rows
        .filter((row) => type === "all" || row.type === type)
        .sort((a, b) => String(b.occurredAt || "").localeCompare(String(a.occurredAt || "")))
        .slice(0, Math.max(0, limit))
    );
  }

  function days({ limit = 30 } = {}) {
    const groups = new Map();
    for (const entry of entries({ limit: 1000 })) {
      const day = localDay(entry.occurredAt);
      if (!groups.has(day)) groups.set(day, []);
      groups.get(day).push(entry);
    }

    return freeze(
      [...groups.entries()]
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, Math.max(0, limit))
        .map(([date, dayEntries]) => ({
          date,
          entries: dayEntries,
          produced: dayEntries.filter((item) => ["produce", "transform", "recover", "assemble"].includes(item.type)).length,
          packaged: dayEntries.filter((item) => item.type === "package").length,
          consumed: dayEntries.filter((item) => item.type === "consume").length,
        }))
    );
  }

  function summary() {
    const allEntries = entries({ limit: 10000 });
    return freeze({
      entryCount: allEntries.length,
      activeDays: new Set(allEntries.map((item) => localDay(item.occurredAt))).size,
      productionCount: allEntries.filter((item) => item.type === "produce").length,
      transformationCount: allEntries.filter((item) => item.type === "transform").length,
      recoveryCount: allEntries.filter((item) => item.type === "recover").length,
      assemblyCount: allEntries.filter((item) => item.type === "assemble").length,
      packagingCount: allEntries.filter((item) => item.type === "package").length,
      consumptionCount: allEntries.filter((item) => item.type === "consume").length,
      latest: allEntries[0] || null,
    });
  }

  return Object.freeze({ entries, days, summary });
}

export default createTimelineService;
