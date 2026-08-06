import { assertPositive, createId, isoNow } from "./kosCore.js";

export function createPackagingService({ repository, clock } = {}) {
  if (!repository) throw new Error("PackagingService requires repository");

  function record({ lotId, packageType, packageCount, portionSize = 1, unit = "servings", label = "", storageLocation = "freezer", notes = "" }) {
    if (!lotId) throw new Error("lotId is required");
    if (!packageType?.trim()) throw new Error("packageType is required");
    const entry = { id: createId("PKG", clock?.()), lotId, packageType: packageType.trim(), packageCount: assertPositive(packageCount, "packageCount"), portionSize: assertPositive(portionSize, "portionSize"), unit, label, storageLocation, notes, createdAt: isoNow(clock) };
    repository.update((state) => { state.packages.push(entry); return state; });
    return entry;
  }

  function forLot(lotId) { return repository.load().packages.filter((item) => item.lotId === lotId); }
  return Object.freeze({ record, forLot });
}

export default createPackagingService;
