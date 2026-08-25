import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const audit = fs.readFileSync(path.join(root, "src/components/AdminMealBuilderImageAudit.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/components/AdminMealBuilderImageAudit.css"), "utf8");
const builder = fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.jsx"), "utf8");
const routes = fs.readFileSync(path.join(root, "src/routing/seoRoutes.js"), "utf8");

assert.match(app, /setActivePage\("Admin Build-A-Meal Image Audit"\)/, "Unlocked Admin controls must open the image audit");
assert.match(app, /activePage === "Admin Build-A-Meal Image Audit"[\s\S]*?<AdminMealBuilderImageAudit/, "App must render the dedicated audit page");
assert.match(routes, /"Admin Build-A-Meal Image Audit"/, "The audit must have a refresh-safe private route");
assert.match(audit, /sessionStorage\.getItem\("rrb-admin-unlocked"\)/, "Direct audit access must require the existing Admin unlock");
assert.match(audit, /rrb_mealBuilderImageAudit_v1/, "Audit decisions must use local-only browser storage");
assert.match(audit, /Main Dishes[\s\S]*Side 1 — Middle[\s\S]*Side 2 — Right/, "Audit must separate all three asset positions");
assert.match(audit, /<MealBuilderTrayPreview/, "Every audit image must render through the public tray component");
assert.match(audit, /Export Correction List/, "The audit must export its correction list");
assert.match(audit, /build-a-meal-image-corrections\.csv/, "The correction export must be a portable CSV");
assert.match(audit, /PAGE_SIZE = 24/, "The audit must limit simultaneous large-image previews");
assert.match(audit, /IMAGE FAILED TO LOAD/, "The audit must expose missing or invalid assets");
assert.match(builder, /export const MEAL_BUILDER_MAIN_IDS/, "The public builder and audit must share one main registry");
assert.match(builder, /export const MEAL_BUILDER_SIDE_IDS/, "The public builder and audit must share one side registry");
assert.match(builder, /export const MEAL_BUILDER_MAIN_LAYOUTS/, "The public builder and audit must share one layout registry");
assert.match(css, /grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/, "Desktop audit must use a compact four-card row");
assert.match(css, /@media\(max-width:760px\)[\s\S]*repeat\(2,minmax\(0,1fr\)\)/, "Tablet audit must use two cards per row");
assert.match(css, /@media\(max-width:520px\)[\s\S]*grid-template-columns:1fr/, "Mobile audit must use one card per row");

console.log("v94.5 admin Build-A-Meal image audit contracts passed");
