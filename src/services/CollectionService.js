import { normalize } from "./rfisCore.js";

export function createCollectionService({ collections = {}, completeDinnerService } = {}) {
  if (!completeDinnerService) throw new Error("CollectionService requires completeDinnerService");
  const map = new Map(Object.entries(collections).map(([name, ids]) => [normalize(name), { name, ids: [...ids] }]));

  function get(name) {
    const entry = map.get(normalize(name));
    if (!entry) return null;
    return { name: entry.name, dinnerIds: [...entry.ids], dinners: entry.ids.map(completeDinnerService.get).filter(Boolean) };
  }

  return Object.freeze({
    get,
    list: () => [...map.values()].map((entry) => ({ name: entry.name, count: entry.ids.length, dinnerIds: [...entry.ids] })).sort((a, b) => a.name.localeCompare(b.name)),
    has: (name) => map.has(normalize(name)),
  });
}

export default createCollectionService;
