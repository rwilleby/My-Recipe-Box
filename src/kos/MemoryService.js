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

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

export function createMemoryService({ repository, inventory } = {}) {
  if (!repository || !inventory) {
    throw new Error("MemoryService requires repository and inventory");
  }

  function productionPatterns({ minimumOccurrences = 2 } = {}) {
    const sessions = repository.load().sessions || [];
    const groups = new Map();

    for (const session of sessions) {
      const key = session.recipeId || normalize(session.title);
      if (!key) continue;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(session);
    }

    return freeze(
      [...groups.entries()]
        .filter(([, rows]) => rows.length >= minimumOccurrences)
        .map(([key, rows]) => {
          const latest = [...rows].sort((a, b) => String(b.occurredAt).localeCompare(String(a.occurredAt)))[0];
          const averageYield = rows.reduce((sum, row) => sum + Number(row.totalYield || 0), 0) / rows.length;
          const averageEaten = rows.reduce((sum, row) => sum + Number(row.eatenNow || 0), 0) / rows.length;
          const outputNames = rows.flatMap((row) =>
            (row.outputLotIds || []).map((id) => inventory.get(id)?.name).filter(Boolean)
          );
          const outputFrequency = new Map();
          for (const name of outputNames) outputFrequency.set(name, (outputFrequency.get(name) || 0) + 1);
          return {
            key,
            recipeId: latest.recipeId || null,
            title: latest.title,
            occurrences: rows.length,
            averageYield: Number(averageYield.toFixed(1)),
            averageEaten: Number(averageEaten.toFixed(1)),
            commonOutputs: [...outputFrequency.entries()]
              .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
              .slice(0, 5)
              .map(([name, count]) => ({ name, count })),
            lastMadeAt: latest.occurredAt,
          };
        })
        .sort((a, b) => b.occurrences - a.occurrences || a.title.localeCompare(b.title))
    );
  }

  function recentForRecipe(recipeId, { limit = 5 } = {}) {
    return freeze(
      (repository.load().sessions || [])
        .filter((session) => session.recipeId === recipeId)
        .sort((a, b) => String(b.occurredAt).localeCompare(String(a.occurredAt)))
        .slice(0, Math.max(0, limit))
        .map((session) => ({
          id: session.id,
          title: session.title,
          totalYield: session.totalYield,
          eatenNow: session.eatenNow,
          unallocated: session.unallocated,
          occurredAt: session.occurredAt,
          notes: session.notes || "",
        }))
    );
  }

  function repeatSuggestion(identifier) {
    const key = normalize(identifier);
    const pattern = productionPatterns({ minimumOccurrences: 1 }).find(
      (item) => item.recipeId === identifier || normalize(item.title) === key
    );
    if (!pattern) return null;
    return freeze({
      title: `Last time you made ${pattern.title}`,
      detail: `${pattern.averageYield} total portions on average, with ${pattern.averageEaten} eaten fresh.`,
      recipeId: pattern.recipeId,
      suggestedYield: pattern.averageYield,
      commonOutputs: pattern.commonOutputs,
      lastMadeAt: pattern.lastMadeAt,
    });
  }

  return Object.freeze({ productionPatterns, recentForRecipe, repeatSuggestion });
}

export default createMemoryService;
