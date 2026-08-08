import assert from "node:assert/strict";
import fs from "node:fs";
const required = [
  "KosRepository", "InventoryService", "ProductionService", "AssemblyService", "PackagingService",
  "FoodLineageService", "WorkflowService", "IntentService", "ActionService", "RfisBridgeService",
  "DataProtectionService", "AssistantService", "TimelineService", "MemoryService", "TemplateService",
  "OpportunityService", "ProductionCenterService", "AvailableMealsService", "KitchenCompanionService", "createKosPlatform"
];
for (const name of required) assert.equal(fs.existsSync(`src/kos/${name}.js`), true, `Missing ${name}`);
const platform = fs.readFileSync("src/kos/createKosPlatform.js", "utf8");
for (const prop of ["repository", "inventory", "production", "assembly", "packaging", "lineage", "workflow", "intents", "actions", "protection", "assistant", "timeline", "memory", "templates", "opportunities", "productionCenter", "availableMeals", "companion"]) {
  assert.match(platform, new RegExp(`\\b${prop}\\b`), `Platform missing ${prop}`);
}
console.log("KOS architecture contracts passed");
