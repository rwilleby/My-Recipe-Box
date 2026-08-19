function normalizeLookupText(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const VOLUME_TO_CUPS = {
  tsp: 1 / 48,
  teaspoon: 1 / 48,
  teaspoons: 1 / 48,
  tbsp: 1 / 16,
  tablespoon: 1 / 16,
  tablespoons: 1 / 16,
  cup: 1,
  cups: 1,
};

const WEIGHT_TO_POUNDS = {
  oz: 1 / 16,
  ounce: 1 / 16,
  ounces: 1 / 16,
  lb: 1,
  lbs: 1,
  pound: 1,
  pounds: 1,
};

const NORMALIZATION_RULES = [
  {
    id: "raw-chicken-breast",
    shoppingName: "Boneless skinless chicken breasts (raw)",
    aisle: "Meat",
    targetUnit: "lb",
    matches: (name) => name.startsWith("boneless skinless chicken breast"),
  },
  {
    id: "cooked-chicken-breast",
    shoppingName: "Cooked chicken breast",
    aisle: "Meat",
    targetUnit: "oz",
    matches: (name) => name.startsWith("cooked chicken breast"),
  },
  {
    id: "low-fat-milk",
    shoppingName: "Low-fat milk",
    aisle: "Dairy",
    targetUnit: "cups",
    matches: (name) => name === "low fat milk" || name === "reduced fat milk",
  },
  {
    id: "prepared-mashed-potatoes",
    shoppingName: "Prepared mashed potatoes",
    aisle: "Prepared Sides",
    targetUnit: "cups",
    matches: (name) => name === "prepared mashed potatoes" || name === "cooked mashed potatoes",
  },
  {
    id: "grated-parmesan",
    shoppingName: "Grated Parmesan",
    aisle: "Dairy",
    targetUnit: "cups",
    matches: (name) => name === "grated parmesan" || name === "grated parmesan cheese",
  },
  {
    id: "large-egg-white",
    shoppingName: "Large egg white",
    aisle: "Dairy",
    matches: (name) => name === "large egg white" || name === "large egg white beaten",
  },
];

function findRule(name) {
  const normalizedName = normalizeLookupText(name);
  return NORMALIZATION_RULES.find((rule) => rule.matches(normalizedName));
}

function preparationNote(name, rule) {
  const source = String(name).trim();
  const commaIndex = source.indexOf(",");
  if (commaIndex >= 0) return source.slice(commaIndex + 1).trim();
  if (rule?.id === "raw-chicken-breast" && /\bcutlets?\b/i.test(source)) return "cutlets";
  return "";
}

function convertQuantity(qty, unit, targetUnit) {
  const number = Number(qty);
  if (!Number.isFinite(number)) return { qty, unit: unit || targetUnit || "item" };
  const normalizedUnit = normalizeLookupText(unit);

  if (targetUnit === "cups" && VOLUME_TO_CUPS[normalizedUnit]) {
    return { qty: number * VOLUME_TO_CUPS[normalizedUnit], unit: "cups" };
  }
  if (targetUnit === "lb" && WEIGHT_TO_POUNDS[normalizedUnit]) {
    return { qty: number * WEIGHT_TO_POUNDS[normalizedUnit], unit: "lb" };
  }
  if (targetUnit === "oz" && WEIGHT_TO_POUNDS[normalizedUnit]) {
    return { qty: number * WEIGHT_TO_POUNDS[normalizedUnit] * 16, unit: "oz" };
  }
  return { qty: number, unit: unit || targetUnit || "item" };
}

export function canonicalShoppingName(name = "") {
  return findRule(name)?.shoppingName || String(name).trim();
}

export function normalizeIngredientForShopping(item = {}) {
  if (!item?.name) return item;
  if (item.normalizationKey) {
    return { ...item, unit: item.unit || "item", aisle: item.aisle || "Grocery List" };
  }
  const rule = findRule(item.name);
  if (!rule) return { ...item, unit: item.unit || "item", aisle: item.aisle || "Grocery List" };

  const converted = convertQuantity(item.qty, item.unit, rule.targetUnit);
  const note = preparationNote(item.name, rule);
  return {
    ...item,
    name: rule.shoppingName,
    qty: converted.qty,
    unit: converted.unit,
    aisle: rule.aisle,
    normalizationKey: rule.id,
    sourceNames: [String(item.name).trim()],
    preparationNotes: note ? [note] : [],
  };
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

export function consolidateShoppingItems(items = []) {
  const merged = new Map();

  items.forEach((sourceItem) => {
    if (!sourceItem?.name) return;
    const item = normalizeIngredientForShopping(sourceItem);
    const unit = item.unit || "item";
    const aisle = item.aisle || "Grocery List";
    const identity = item.normalizationKey || normalizeLookupText(item.name);
    const key = `${identity}|${normalizeLookupText(unit)}`;
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, { ...item, unit, aisle });
      return;
    }

    const currentQty = Number(existing.qty);
    const nextQty = Number(item.qty);
    merged.set(key, {
      ...existing,
      qty: Number.isFinite(currentQty) && Number.isFinite(nextQty)
        ? currentQty + nextQty
        : existing.qty || item.qty || 1,
      cost: (Number(existing.cost) || 0) + (Number(item.cost) || 0),
      aisle: existing.aisle === aisle ? aisle : `${existing.aisle} / ${aisle}`,
      sourceNames: unique([...(existing.sourceNames || []), ...(item.sourceNames || [])]),
      preparationNotes: unique([...(existing.preparationNotes || []), ...(item.preparationNotes || [])]),
    });
  });

  return [...merged.values()];
}

export const INGREDIENT_NORMALIZATION_RULES = NORMALIZATION_RULES.map(({ matches, ...rule }) => rule);
