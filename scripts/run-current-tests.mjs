import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const packageJson = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
const currentScriptNames = [
  "test:rfis", "test:kos", "test:welcome-tour", "test:weekend-bulk-production",
  "test:admin-classifier-layout", "test:quick-dinner-hero-only",
  "test:kitchen-reminder-ribbon", "test:manual-inventory-worksheets",
  "test:master-kitchen-inventory", "test:master-kitchen-inventory-matrix",
  "test:master-kitchen-inventory-density", "test:master-kitchen-inventory-four-column",
  "test:master-kitchen-inventory-ledger", "test:master-kitchen-inventory-columns",
  "test:master-kitchen-inventory-repeated-headers", "test:master-kitchen-inventory-header-band",
  "test:master-kitchen-inventory-storage-locations", "test:main-navigation-ipad",
  "test:diet-meals-category", "test:diet-meals-nutrition",
  "test:category-quick-links-v8217", "test:sg-recipes-v8218",
  "test:healthy-dinners-v8219", "test:recipe-menu-order-v8220",
  "test:healthy-dinners-video-v8221", "test:collection-home-updates-v8222",
  "test:homepage-refinements-v8223", "test:backup-v830", "test:structure-v831",
  "test:runtime-v8311", "test:structure-v832", "test:responsive-v833",
  "test:video-library-v834", "test:navigation-v836", "test:category-centering-v838",
  "test:hero-browse-v839", "test:navigation-centering-v8310",
  "test:planning-shopping-v8311", "test:ingredient-data-v841",
  "test:ingredient-data-v842", "test:ingredient-data-v843",
  "test:ingredient-data-v844", "test:ingredient-data-v845",
  "test:ingredient-data-v846", "test:shopping-normalization-v847",
  "test:ingredient-data-v848", "test:ingredient-data-v849",
  "test:ingredient-data-v8410", "test:ingredient-data-v8411",
  "test:ingredient-data-v8412", "test:ingredient-data-v8413",
  "test:master-freezer-v8414", "test:ingredient-data-v8415",
  "test:kitchen-details-v8416", "test:seo-routing", "test:release-integrity",
];

const files = [];
const visitedScripts = new Set();

function collectScript(scriptName) {
  if (visitedScripts.has(scriptName)) return;
  visitedScripts.add(scriptName);
  const command = packageJson.scripts[scriptName];
  if (!command) throw new Error(`Missing package script: ${scriptName}`);

  for (const step of command.split(/\s*&&\s*/)) {
    const nested = step.match(/^npm run ([\w:-]+)$/);
    const nodeTest = step.match(/^node (test\/[^\s]+\.test\.mjs)$/);
    if (nested) collectScript(nested[1]);
    else if (nodeTest) files.push(nodeTest[1]);
    else throw new Error(`Unsupported test command in ${scriptName}: ${step}`);
  }
}

for (const scriptName of currentScriptNames) collectScript(scriptName);

// These exact-source contracts were superseded by later approved releases.
// Their replacement v84/v85/v88 contracts are added below.
const supersededContracts = new Set([
  "test/manualInventoryWorksheetsV824.test.mjs",
  "test/masterKitchenInventoryV825.test.mjs",
  "test/masterKitchenInventoryColumnsV8210.test.mjs",
  "test/masterKitchenInventoryRepeatedHeadersV8211.test.mjs",
  "test/masterKitchenInventoryStorageLocationsV8213.test.mjs",
  "test/collectionHomeUpdatesV8222.test.mjs",
  "test/homeStructureV832.test.mjs",
  "test/navigationReorganizationV836.test.mjs",
  "test/categoryIconCenteringV838.test.mjs",
  "test/categoryQuickLinksV8217.test.mjs",
  "test/heroAndBrowseCategoriesV839.test.mjs",
  "test/masterFreezerInventoryV8414.test.mjs",
  "test/kitchenDetailsInventoryV8416.test.mjs",
  "test/inventoryCountedStripsV8431.test.mjs",
]);

const recentReleaseTests = readdirSync(resolve("test"))
  .filter((file) =>
    /V84(?:1[8-9]|2\d|3[0-7])\.test\.mjs$|V85\d*\.test\.mjs$|V88\d*\.test\.mjs$|V89\d*\.test\.mjs$|V9[2-5]\d*\.test\.mjs$|releaseIntegrityV881\.test\.mjs$/.test(file),
  )
  .filter((file) => file !== "homeMainPageEditsV850.test.mjs")
  .map((file) => `test/${file}`);
files.push(...recentReleaseTests);
// v95.2 is the consolidated Build-A-Meal contract and intentionally uses a
// stable "Current" filename so later asset refreshes do not duplicate a 400+
// image integrity test.
files.push("test/mealBuilderCurrent.test.mjs");

const uniqueFiles = [...new Set(files)].filter(
  (file) => !supersededContracts.has(file),
);
const failures = [];
for (const [index, file] of uniqueFiles.entries()) {
  process.stdout.write(`\n[${index + 1}/${uniqueFiles.length}] ${file}\n`);
  const result = spawnSync(process.execPath, [resolve(file)], { stdio: "inherit" });
  if (result.status !== 0) failures.push(file);
}

if (failures.length) {
  process.stderr.write(`\nFailed current tests:\n- ${failures.join("\n- ")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`\nAll ${uniqueFiles.length} current test files passed.\n`);
}
