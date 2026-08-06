export function createFoodLineageService({ repository } = {}) {
  if (!repository) throw new Error("FoodLineageService requires repository");

  function lot(identifier) {
    return repository.load().inventoryLots.find((item) => item.id === identifier) || null;
  }

  function ancestors(identifier) {
    const state = repository.load();
    const byId = new Map(state.inventoryLots.map((item) => [item.id, item]));
    const result = [];
    const visited = new Set();
    const queue = [...(byId.get(identifier)?.sourceLotIds || [])];
    while (queue.length) {
      const id = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      const item = byId.get(id);
      if (!item) continue;
      result.push(item);
      queue.push(...(item.sourceLotIds || []));
    }
    return result;
  }

  function descendants(identifier) {
    const state = repository.load();
    const result = [];
    const visited = new Set();
    const queue = [identifier];
    while (queue.length) {
      const current = queue.shift();
      for (const item of state.inventoryLots) {
        if ((item.sourceLotIds || []).includes(current) && !visited.has(item.id)) {
          visited.add(item.id);
          result.push(item);
          queue.push(item.id);
        }
      }
    }
    return result;
  }

  function chain(identifier) {
    const current = lot(identifier);
    return current ? { ancestors: ancestors(identifier), current, descendants: descendants(identifier) } : null;
  }

  return Object.freeze({ lot, ancestors, descendants, chain });
}

export default createFoodLineageService;
