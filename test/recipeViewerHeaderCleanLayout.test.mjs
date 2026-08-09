import assert from "node:assert/strict";
import fs from "node:fs";
const css=fs.readFileSync("src/App.css","utf8");
const app=fs.readFileSync("src/App.jsx","utf8");
const marker="/* v71.5 — clean recipe viewer header matching approved reference */";
const i=css.lastIndexOf(marker); assert.ok(i>=0); const c=css.slice(i);
for(const t of [
  "grid-template-columns: minmax(300px, 1fr) auto !important;",
  'grid-template-areas: "identity tools" !important;',
  ".cardViewerHeaderIdentity",
  "border: 0 !important;",
  ".cardViewerQuickNutrition",
  "background: transparent !important;",
  ".cardViewerQuickNutritionItem",
  "border-radius: 15px !important;",
  ".cardViewerHeaderActions.compact",
  "right: 14px !important;"
]) assert.ok(c.includes(t),t);
for(const t of [
  'className="cardViewerHeaderIdentity"',
  'className={`cardViewerQuickNutrition ${',
  'className="cardViewerHeaderActions compact"'
]) assert.ok(app.includes(t),t);
console.log("Clean recipe viewer header contracts passed");
