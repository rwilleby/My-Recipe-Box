import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const styles = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const finalStyles = styles.slice(styles.lastIndexOf("v84.32 final cascade"));

assert.match(finalStyles, /\.freezerInventoryManagementPage > \.freezerManagementKindTabs,[\s\S]*\.pantryPage > \.pantryLevelTabs \{[\s\S]*width: 100% !important;[\s\S]*max-width: 100% !important;[\s\S]*margin: -30px auto 12px !important;/);
assert.match(finalStyles, /\.freezerManagementKindTabs button \{[\s\S]*position: relative !important;[\s\S]*padding-left: 52px !important;[\s\S]*padding-right: 52px !important;/);
assert.match(finalStyles, /\.inventorySegmentLabel \{[\s\S]*font-size: 14px !important;[\s\S]*font-weight: 850 !important;[\s\S]*text-align: center !important;/);
assert.match(finalStyles, /\.inventorySegmentCount \{[\s\S]*position: absolute !important;[\s\S]*right: clamp\(14px, 2vw, 36px\) !important;/);
assert.match(finalStyles, /@media \(max-width: 700px\)[\s\S]*margin-top: -20px !important;/);

console.log("v84.32 secondary inventory strip positioning contracts passed.");
