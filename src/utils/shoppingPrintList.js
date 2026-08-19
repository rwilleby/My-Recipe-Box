import { normalizeIngredientForShopping } from "./ingredientNormalization.js";

export function shoppingItemKey(item) {
  const normalized = normalizeIngredientForShopping(item);
  return `${normalized.name}-${normalized.unit}-${normalized.aisle}`;
}

export function shoppingNeedItemKey(group, item, itemIndex) {
  return `need-${group.id}-${item.id || itemIndex}`;
}

export function collectPrintableGroceryItems(groups = [], checked = {}) {
  return groups.flatMap((group) =>
    (group.items || []).filter((item, itemIndex) => {
      if (item.kind === "component") return false;
      const needKey = shoppingNeedItemKey(group, item, itemIndex);
      return !checked[needKey] && !checked[shoppingItemKey(item)];
    })
  );
}

export function collectPrintablePreparedRequirements(requirements = [], groups = [], checked = {}) {
  return requirements.map((requirement) => {
    const packagesRequired = groups.reduce((total, group) => {
      return total + (group.items || []).reduce((groupTotal, item, itemIndex) => {
        if (item.kind !== "component" || item.componentId !== requirement.componentId) return groupTotal;
        const needKey = shoppingNeedItemKey(group, item, itemIndex);
        const consolidatedKey = `prepared-${requirement.componentId}`;
        return checked[needKey] || checked[consolidatedKey]
          ? groupTotal
          : groupTotal + Number(item.qty || 0);
      }, 0);
    }, 0);
    return { ...requirement, packagesRequired };
  }).filter((requirement) => requirement.packagesRequired > 0);
}
