import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

assert.doesNotMatch(app, /className="freezerManagementSummary" aria-label="Frozen meal inventory summary"/);
assert.doesNotMatch(app, /className="freezerManagementSummary pantryInventorySummary"/);

assert.match(app, /inventorySegmentLabel">Complete Meals<[\s\S]*inventorySegmentCount">\{totalComplete\}/);
assert.match(app, /inventorySegmentLabel">Individual Recipes<[\s\S]*inventorySegmentCount">\{totalIndividuals\}/);
assert.match(app, /inventorySegmentLabel">Component Items<[\s\S]*inventorySegmentCount">\{totalComponents\}/);
assert.match(app, /inventorySegmentLabel">\{level\.label\}<[\s\S]*inventorySegmentCount">\{pantryLevelCounts\[level\.id\]\}/);
assert.match(app, /item\.level <= level\.id && pantryItemStatus\(pantry, item\.name\) === "in-stock"/);

const finalStyles = styles.slice(styles.lastIndexOf("v84.31 final cascade"));
assert.match(finalStyles, /\.inventoryHubControlStrip \{[\s\S]*width: 100% !important;[\s\S]*grid-template-columns: minmax\(0, 3fr\) repeat\(4, minmax\(0, 1fr\)\) !important;[\s\S]*grid-auto-flow: column !important;/);
assert.match(finalStyles, /\.inventoryHubTabs \{[\s\S]*grid-column: auto !important;/);

const releaseStyles = styles.slice(styles.indexOf("v84.31 — ONE-ROW MASTER AND COUNTED SECONDARY CONTROL STRIPS"));
assert.match(releaseStyles, /\.freezerInventoryManagementPage > \.freezerManagementKindTabs,[\s\S]*\.pantryPage > \.pantryLevelTabs \{[\s\S]*width: 90% !important;[\s\S]*repeat\(3, minmax\(0, 1fr\)\) !important;[\s\S]*grid-auto-flow: column !important;/);
assert.match(releaseStyles, /\.inventorySegmentCount \{[\s\S]*border-radius: 14px !important;/);

console.log("v84.31 one-row counted inventory control-strip contracts passed.");
