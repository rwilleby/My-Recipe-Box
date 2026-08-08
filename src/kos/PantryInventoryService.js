import { createId, isoNow } from "./kosCore.js";

const PANTRY_KEY = "kos.pantry.inventory.v1";

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

function normalizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function itemKey(name, unit = "") {
  return `${normalizeName(name).toLowerCase()}::${String(unit || "").trim().toLowerCase()}`;
}

function daysUntil(dateText, now) {
  if (!dateText) return null;
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return null;
  return Math.ceil((date.getTime() - now.getTime()) / 86400000);
}

export function createPantryInventoryService({
  storage,
  clock = () => new Date(),
} = {}) {
  if (!storage) {
    throw new Error("PantryInventoryService requires storage");
  }

  function load() {
    try {
      const raw = storage.getItem(PANTRY_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && typeof parsed === "object"
        ? {
            items: Array.isArray(parsed.items) ? parsed.items : [],
            updatedAt: parsed.updatedAt || null,
          }
        : { items: [], updatedAt: null };
    } catch {
      return { items: [], updatedAt: null };
    }
  }

  function save(state) {
    state.updatedAt = isoNow(clock);
    storage.setItem(PANTRY_KEY, JSON.stringify(state));
    return state;
  }

  function all({
    location = null,
    query = "",
    includeZero = false,
  } = {}) {
    const term = String(query || "").trim().toLowerCase();
    const now = clock();
    return freeze(
      load().items
        .filter((item) => includeZero || Number(item.quantity || 0) > 0)
        .filter((item) => !location || item.location === location)
        .filter(
          (item) =>
            !term ||
            item.name.toLowerCase().includes(term) ||
            String(item.upc || "").includes(term)
        )
        .map((item) => ({
          ...item,
          daysUntilExpiration: daysUntil(item.expiresAt, now),
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  }

  function get(id) {
    return all({ includeZero: true }).find((item) => item.id === id) || null;
  }

  function upsert({
    name,
    quantity = 1,
    unit = "each",
    location = "pantry",
    expiresAt = null,
    openedAt = null,
    upc = null,
    notes = "",
  } = {}) {
    const cleanName = normalizeName(name);
    if (!cleanName) throw new Error("Pantry item name is required");

    const amount = Number(quantity);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Pantry quantity must be zero or greater");
    }

    const state = load();
    const key = itemKey(cleanName, unit);
    const existing = state.items.find((item) => item.key === key);

    if (existing) {
      existing.quantity = amount;
      existing.location = String(location || existing.location || "pantry");
      existing.expiresAt = expiresAt ?? existing.expiresAt ?? null;
      existing.openedAt = openedAt ?? existing.openedAt ?? null;
      existing.upc = upc ?? existing.upc ?? null;
      existing.notes = String(notes || existing.notes || "");
      existing.updatedAt = isoNow(clock);
      save(state);
      return freeze(existing);
    }

    const item = {
      id: createId("PAN", clock()),
      key,
      name: cleanName,
      quantity: amount,
      unit: String(unit || "each"),
      location: String(location || "pantry"),
      expiresAt,
      openedAt,
      upc,
      notes: String(notes || ""),
      createdAt: isoNow(clock),
      updatedAt: isoNow(clock),
    };

    state.items.push(item);
    save(state);
    return freeze(item);
  }

  function adjust(id, quantity) {
    const state = load();
    const item = state.items.find((row) => row.id === id);
    if (!item) throw new Error(`Pantry item not found: ${id}`);

    const amount = Number(quantity);
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Pantry quantity must be zero or greater");
    }

    item.quantity = amount;
    item.updatedAt = isoNow(clock);
    save(state);
    return freeze(item);
  }

  function consume(id, quantity = 1) {
    const state = load();
    const item = state.items.find((row) => row.id === id);
    if (!item) throw new Error(`Pantry item not found: ${id}`);

    const amount = Number(quantity);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Pantry consumption must be greater than zero");
    }
    if (amount > item.quantity) {
      throw new Error(
        `Cannot use ${amount} ${item.unit}; only ${item.quantity} available`
      );
    }

    item.quantity -= amount;
    item.updatedAt = isoNow(clock);
    save(state);
    return freeze(item);
  }

  function remove(id) {
    const state = load();
    const before = state.items.length;
    state.items = state.items.filter((item) => item.id !== id);
    if (state.items.length === before) {
      throw new Error(`Pantry item not found: ${id}`);
    }
    save(state);
    return all();
  }

  function expiring({ withinDays = 7 } = {}) {
    return freeze(
      all()
        .filter(
          (item) =>
            item.daysUntilExpiration !== null &&
            item.daysUntilExpiration <= withinDays
        )
        .sort(
          (a, b) =>
            a.daysUntilExpiration - b.daysUntilExpiration ||
            a.name.localeCompare(b.name)
        )
    );
  }

  function summary() {
    const rows = all();
    const byLocation = {};
    for (const item of rows) {
      byLocation[item.location] =
        (byLocation[item.location] || 0) + item.quantity;
    }

    return freeze({
      itemCount: rows.length,
      totalUnits: rows.reduce((sum, item) => sum + item.quantity, 0),
      byLocation,
      expiringSoon: expiring({ withinDays: 7 }).length,
    });
  }

  return Object.freeze({
    all,
    get,
    upsert,
    adjust,
    consume,
    remove,
    expiring,
    summary,
  });
}

export default createPantryInventoryService;
