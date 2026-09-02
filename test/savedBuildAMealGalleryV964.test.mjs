import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const component = fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.jsx"), "utf8");
const styles = fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.css"), "utf8");

assert.match(component, /Your Saved Build-A-Meals/, "Build A Meal should include the saved-meal gallery heading");
assert.match(component, /savedMealsForGallery\.map/, "the gallery should render every saved BAM record");
assert.match(component, /openSavedMealFromGallery\(savedMeal\)/, "selecting a gallery image should reopen the saved BAM record");
assert.match(component, /<MealBuilderTrayPreview[\s\S]*className="mealBuilderSavedGalleryTray"/, "saved meal cards should display the assembled BAM tray");
assert.match(component, /onToggleSavedMealFavorite\(savedMeal\.id\)/, "gallery hearts should use the existing saved-meal favorite behavior");
assert.match(component, /scrollIntoView\(\{ behavior: "smooth", block: "start" \}\)/, "opening a saved card should return the user to the builder workspace");
assert.match(styles, /\.mealBuilderSavedGalleryGrid\s*\{[^}]*grid-template-columns:\s*repeat\(6/, "desktop should display six compact saved-meal cards per row");
assert.match(styles, /@media \(max-width: 900px\)[\s\S]*\.mealBuilderSavedGalleryGrid\s*\{[^}]*repeat\(3/, "tablet should reflow saved meals to three columns");
assert.match(styles, /@media \(max-width: 650px\)[\s\S]*\.mealBuilderSavedGalleryGrid\s*\{[^}]*repeat\(2/, "mobile should reflow saved meals to two columns");

console.log("v96.4 saved Build-A-Meal visual gallery contracts passed.");
