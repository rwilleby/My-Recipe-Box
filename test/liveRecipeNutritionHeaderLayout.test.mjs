import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

const headerIndex = app.indexOf('<div className="cardViewerHeader">');
const nutritionIndex = app.indexOf('className={`cardViewerQuickNutrition ${', headerIndex);
const stageIndex = app.indexOf('<div className="cardViewerStage">', headerIndex);

assert.ok(headerIndex >= 0);
assert.ok(nutritionIndex > headerIndex);
assert.ok(nutritionIndex < stageIndex, "Quick nutrition must sit inside the header before the card stage");

assert.ok(css.includes("grid-template-columns: minmax(280px, auto) minmax(430px, 1fr) auto !important;"));
assert.ok(css.includes("border-radius: 999px;"));
assert.ok(css.includes("font-size: 11px;"));
assert.ok(css.includes("font-size: 8px;"));

console.log("Compact header nutrition layout contracts passed");
