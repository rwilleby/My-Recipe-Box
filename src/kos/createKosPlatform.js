import { createKosRepository } from "./KosRepository.js";
import { createInventoryService } from "./InventoryService.js";
import { createProductionService } from "./ProductionService.js";
import { createAssemblyService } from "./AssemblyService.js";
import { createPackagingService } from "./PackagingService.js";
import { createFoodLineageService } from "./FoodLineageService.js";

export function createKosPlatform({ storage, storageKey, clock } = {}) {
  const repository = createKosRepository({ storage, storageKey });
  const inventory = createInventoryService({ repository, clock });
  const production = createProductionService({ repository, inventory, clock });
  const assembly = createAssemblyService({ production, inventory });
  const packaging = createPackagingService({ repository, clock });
  const lineage = createFoodLineageService({ repository });
  return Object.freeze({ repository, inventory, production, assembly, packaging, lineage });
}

export default createKosPlatform;
