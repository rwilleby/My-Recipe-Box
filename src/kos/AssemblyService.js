import { assertPositive } from "./kosCore.js";

export function createAssemblyService({ production, inventory } = {}) {
  if (!production || !inventory) throw new Error("AssemblyService requires production and inventory");

  function assemble({ title, completeDinnerId = null, components = [], quantity, itemType = "finished-meal", storageLocation = "freezer", packageType = null, notes = "" }) {
    const meals = assertPositive(quantity, "quantity");
    if (!components.length) throw new Error("At least one component is required");
    const sourceLotUses = components.map((component) => ({ lotId: component.lotId, quantity: assertPositive(component.quantityPerMeal, "quantityPerMeal") * meals }));
    return production.record({
      sessionType: "assemble", title, totalYield: meals, sourceLotUses, notes,
      outputs: [{ name: title, itemType, quantity: meals, unit: "meals", completeDinnerId, storageLocation, metadata: { packageType, components: components.map((item) => ({ ...item })) } }],
    });
  }

  function capacity(components = []) {
    if (!components.length) return 0;
    return Math.floor(Math.min(...components.map((component) => {
      const lot = inventory.get(component.lotId);
      if (!lot) return 0;
      const perMeal = assertPositive(component.quantityPerMeal, "quantityPerMeal");
      return lot.quantityAvailable / perMeal;
    })));
  }

  return Object.freeze({ assemble, capacity });
}

export default createAssemblyService;
