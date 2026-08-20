import assert from "node:assert/strict";
import fs from "node:fs";

const styles = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");
const finalStyles = styles.slice(styles.lastIndexOf("v84.33 — LOCKED COUNTED INVENTORY STRIP STANDARD"));

assert.match(finalStyles, /\.freezerInventoryManagementPage > \.freezerManagementKindTabs,[\s\S]*\.pantryPage > \.pantryLevelTabs \{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\) !important;[\s\S]*height: 48px !important;/);
assert.match(finalStyles, /\.pantryLevelTabs button\.active \{[\s\S]*background: var\(--rrb-segmented-active-bg, #9a938f\) !important;[\s\S]*color: #fff !important;/);
assert.match(finalStyles, /\.pantryLevelTabs \.inventorySegmentLabel \{[\s\S]*overflow: visible !important;[\s\S]*font-size: 14px !important;[\s\S]*text-overflow: clip !important;/);
assert.match(finalStyles, /\.pantryLevelTabs \.inventorySegmentCount \{[\s\S]*right: 22px !important;/);
assert.match(finalStyles, /\.pantryActions\.inventoryControlStrip \{[\s\S]*grid-template-columns: 1\.35fr 1\.2fr \.75fr \.85fr 1fr !important;[\s\S]*flex-wrap: nowrap !important;/);

console.log("v84.33 standardized Freezer and Pantry strip contracts passed.");
