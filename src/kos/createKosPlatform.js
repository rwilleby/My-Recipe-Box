import { createKosRepository } from "./KosRepository.js";
import { createInventoryService } from "./InventoryService.js";
import { createProductionService } from "./ProductionService.js";
import { createAssemblyService } from "./AssemblyService.js";
import { createPackagingService } from "./PackagingService.js";
import { createFoodLineageService } from "./FoodLineageService.js";
import { createWorkflowService } from "./WorkflowService.js";
import { createIntentService } from "./IntentService.js";
import { createActionService } from "./ActionService.js";
import { createRfisBridgeService } from "./RfisBridgeService.js";
import { createDataProtectionService } from "./DataProtectionService.js";
import { createAssistantService } from "./AssistantService.js";
import { createOpportunityService } from "./OpportunityService.js";
import { createTemplateService } from "./TemplateService.js";
import { createMemoryService } from "./MemoryService.js";
import { createTimelineService } from "./TimelineService.js";
import { createProductionCenterService } from "./ProductionCenterService.js";
import { createAvailableMealsService } from "./AvailableMealsService.js";
import { createKitchenCompanionService } from "./KitchenCompanionService.js";

export function createKosPlatform({
  storage,
  storageKey,
  clock,
  rfisPlatform = null,
} = {}) {
  const repository = createKosRepository({
    storage,
    storageKey,
  });

  const inventory = createInventoryService({
    repository,
    clock,
  });

  const production = createProductionService({
    repository,
    inventory,
    clock,
  });

  const assembly = createAssemblyService({
    production,
    inventory,
  });

  const packaging = createPackagingService({
    repository,
    clock,
  });

  const lineage = createFoodLineageService({
    repository,
  });

  const workflow = createWorkflowService({
    repository,
    inventory,
    production,
    assembly,
    packaging,
    lineage,
  });

  const intents = createIntentService();

  const actions = createActionService({
    inventory,
    production,
    assembly,
    packaging,
    workflow,
  });

  const protection = createDataProtectionService({
    repository,
  });

  const rfis = rfisPlatform
    ? createRfisBridgeService({
        rfisPlatform,
        actions,
        inventory,
      })
    : null;

  const assistant = createAssistantService({
    repository,
    inventory,
    workflow,
    packaging,
    rfisPlatform,
    rfisBridge: rfis,
  });

  const timeline = createTimelineService({ repository, inventory });

  const memory = createMemoryService({ repository, inventory });

  const templates = createTemplateService({ repository, clock });

  const opportunities = createOpportunityService({
    assistant,
    memory,
    timeline,
    templates,
  });

  const productionCenter = createProductionCenterService({
    storage: repository.storage,
    clock,
    actions,
    rfisBridge: rfis,
    workflow,
    assistant,
    opportunities,
    memory,
    templates,
    timeline,
  });

  const availableMeals = createAvailableMealsService({
    inventory,
    actions,
  });

  const companion = createKitchenCompanionService({
    productionCenter,
    availableMeals,
    workflow,
    intents,
    assistant,
  });

  return Object.freeze({
    repository,
    inventory,
    production,
    assembly,
    packaging,
    lineage,
    workflow,
    intents,
    actions,
    rfis,
    protection,
    assistant,
    timeline,
    memory,
    templates,
    opportunities,
    productionCenter,
    availableMeals,
    companion,
  });
}

export default createKosPlatform;
