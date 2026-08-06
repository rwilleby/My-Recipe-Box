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

export function createOpportunityService({ assistant, memory, timeline, templates } = {}) {
  if (!assistant || !memory || !timeline || !templates) {
    throw new Error("OpportunityService requires assistant, memory, timeline, and templates");
  }

  function list({ limit = 10 } = {}) {
    const rows = [...assistant.suggestions({ limit: Math.max(limit, 10) })];

    for (const pattern of memory.productionPatterns({ minimumOccurrences: 2 })) {
      rows.push({
        id: `repeat-${pattern.key}`,
        kind: "repeat",
        title: `You could repeat ${pattern.title}`,
        detail: `You have made it ${pattern.occurrences} times. Your average yield is ${pattern.averageYield}.`,
        priority: 55 + Math.min(pattern.occurrences, 10),
        tone: "optional",
        language: "could",
        action: "repeat-production",
        metadata: { recipeId: pattern.recipeId, suggestedYield: pattern.averageYield },
      });
    }

    if (templates.all().length) {
      rows.push({
        id: "use-production-template",
        kind: "template",
        title: "You could reuse a saved cooking plan",
        detail: `${templates.all().length} production template${templates.all().length === 1 ? " is" : "s are"} available.`,
        priority: 50,
        tone: "optional",
        language: "could",
        action: "open-templates",
      });
    }

    const deduped = new Map();
    for (const row of rows) if (!deduped.has(row.id)) deduped.set(row.id, row);
    return freeze(
      [...deduped.values()]
        .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0) || a.title.localeCompare(b.title))
        .slice(0, Math.max(0, limit))
    );
  }

  function dashboard() {
    return freeze({
      opportunities: list(),
      timeline: timeline.days({ limit: 7 }),
      memoryPatterns: memory.productionPatterns(),
      templates: templates.all(),
    });
  }

  return Object.freeze({ list, dashboard });
}

export default createOpportunityService;
