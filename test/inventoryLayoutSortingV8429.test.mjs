import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles, kitchenPage] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
  readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8"),
]);

const kitchenDetailsStart = app.indexOf('label: "KITCHEN DETAILS"');
const recipesStart = app.indexOf('label: "OUR RECIPES"', kitchenDetailsStart);
const kitchenDetails = app.slice(kitchenDetailsStart, recipesStart);
const yourKitchenStart = app.indexOf('label: "YOUR KITCHEN"');
const shoppingStart = app.indexOf('label: "SHOPPING"', yourKitchenStart);
const yourKitchen = app.slice(yourKitchenStart, shoppingStart);
assert.match(kitchenDetails, /MASTER KITCHEN INVENTORY[\s\S]*FREEZING & REHEATING/);
assert.doesNotMatch(yourKitchen, /FREEZING & REHEATING/);

assert.match(kitchenPage, /\.sort\(\(a, b\) => String\(a\.title\)\.localeCompare\(String\(b\.title\)/);
assert.match(kitchenPage, /\.sort\(\(a, b\) => String\(a\.family\)\.localeCompare\(String\(b\.family\)/);
assert.match(app, /String\(a\.group\)\.localeCompare\(String\(b\.group\)/);
assert.match(app, /String\(a\.name\)\.localeCompare\(String\(b\.name\)/);
assert.match(app, /String\(a\.cuisine\)\.localeCompare\(String\(b\.cuisine\)/);
assert.match(app, /<span>Servings<\/span>/);
assert.doesNotMatch(app.slice(app.indexOf('className="freezerManagementServings"'), app.indexOf('className="freezerManagementServings"') + 250), /Servings \/ Package/);

const releaseStyles = styles.slice(styles.indexOf("v84.29 — FULL-WIDTH, ALPHABETIZED INVENTORY VIEWS"));
assert.match(releaseStyles, /\.inventoryHubControlStrip,[\s\S]*width: 100% !important;[\s\S]*max-width: 100% !important;/);
assert.match(releaseStyles, /\.masterInventoryAccordions,[\s\S]*\.freezerCuisineAccordions,[\s\S]*\.pantryInventoryAccordions,[\s\S]*\.freezerAccordionList,[\s\S]*width: 100% !important;/);
assert.match(releaseStyles, /\.pantryItem select \{[\s\S]*width: 110px !important;[\s\S]*min-width: 110px !important;/);
assert.match(releaseStyles, /\.freezerManagementQuantity,[\s\S]*\.freezerManagementServings \{[\s\S]*grid-template-rows: 14px 38px !important;/);

console.log("v84.29 inventory layout and alphabetical sorting contracts passed.");
