import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

assert.match(app, /const source = parseMealSourceMarker\(planItems\[4\]\)/, "Shopping Overview must retain the saved meal source");
assert.match(app, /source\?\.type === "diet" \? getDietMealComponents\(source\.id\)/, "Diet Meals must expose their saved components");
assert.match(app, /completeDinner\.sides \|\| \[\]/, "Complete Dinners must expose their side dishes");
assert.match(app, /className="shoppingPlannedComponents"/, "Planned-meal cards must render their condensed component list");
assert.match(app, /<dt>\{component\.label\}<\/dt><dd>\{component\.title\}<\/dd>/, "Component rows must show compact M and S labels with names");
assert.match(css, /\.shoppingPlannedComponents\{[^}]*display:grid[^}]*gap:3px/, "Component listings must remain condensed");
assert.match(css, /\.shoppingPlannedComponents>div\{[^}]*grid-template-columns:24px minmax\(0,1fr\)/, "Component labels must use the compact two-column row");

console.log("v100.2 Shopping Overview planned-meal component contracts passed.");
