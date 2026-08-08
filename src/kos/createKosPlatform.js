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
import { createTimerService } from "./TimerService.js";
import { createCookingSessionService } from "./CookingSessionService.js";
import { createInventoryIntelligenceService } from "./InventoryIntelligenceService.js";
import { createInventoryActionService } from "./InventoryActionService.js";
import { createMealPlanningService } from "./MealPlanningService.js";
import { createShoppingIntelligenceService } from "./ShoppingIntelligenceService.js";
import { createPantryInventoryService } from "./PantryInventoryService.js";
import { createUseWhatIHaveService } from "./UseWhatIHaveService.js";
import { createShoppingReconciliationService } from "./ShoppingReconciliationService.js";
import { createKitchenOperationsFacade } from "./KitchenOperationsFacade.js";

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

  const timers = createTimerService({
    storage: repository.storage,
    clock,
  });

  const cookingSessions = createCookingSessionService({
    storage: repository.storage,
    clock,
    rfisPlatform,
    timers,
  });

  const inventoryIntelligence = createInventoryIntelligenceService({
    inventory,
    workflow,
    assistant,
    clock,
  });

  const inventoryActions = createInventoryActionService({
    inventory,
    packaging,
  });

  const mealPlanner = createMealPlanningService({
    storage: repository.storage,
    clock,
    rfisPlatform,
    inventoryIntelligence,
  });

  const shopping = createShoppingIntelligenceService({
    storage: repository.storage,
    clock,
    mealPlanner,
    rfisPlatform,
  });

  const pantry = createPantryInventoryService({
    storage: repository.storage,
    clock,
  });

  const useWhatIHave = createUseWhatIHaveService({
    pantry,
    rfisPlatform,
  });

  const shoppingReconciliation = createShoppingReconciliationService({
    pantry,
    shopping,
  });

  const companion = createKitchenCompanionService({
    productionCenter,
    availableMeals,
    workflow,
    intents,
    assistant,
    cookingSessions,
    timers,
    inventoryIntelligence,
  });

  const services = {
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
    timers,
    cookingSessions,
    inventoryIntelligence,
    inventoryActions,
    mealPlanner,
    shopping,
    pantry,
    useWhatIHave,
    shoppingReconciliation,
    companion,
  };

  const kitchen = createKitchenOperationsFacade(services);

  return Object.freeze({
    ...services,
    kitchen,
  });
}

export default createKosPlatform;
