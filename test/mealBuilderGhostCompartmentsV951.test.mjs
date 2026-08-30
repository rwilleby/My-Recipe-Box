import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const component = fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.jsx"), "utf8");
const styles = fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.css"), "utf8");

assert.match(component, /mainTrayLayout === "standard" && <MealBuilderFoodImage recipe=\{sideOneRecipe\} position="side-one" \/>/, "Side 1 ghost/content must render only for the three-compartment tray");
assert.match(component, /const sideOneDisabled = mainTrayLayout === "two-thirds" \|\| mainTrayLayout === "full-tray";/, "Side 1 selector must be disabled for two-thirds and full-tray mains");
assert.match(styles, /\.mealBuilderTrayFood-side-one\.is-empty\s*\{[^}]*left:\s*46\.5470%;[^}]*width:\s*19\.1989%;/, "Side 1 ghost must stay inside the middle compartment");
assert.match(styles, /\.mealBuilderTrayFood-side-two\.is-empty\s*\{[^}]*left:\s*65\.8150%;[^}]*width:\s*19\.8204%;/, "Side 2 ghost must stay inside the right compartment");
assert.match(styles, /\.mealBuilderTrayInterior\.is-two-thirds \.mealBuilderTrayFood-side-one\s*\{[^}]*display:\s*none;/, "Two-thirds tray must defensively hide Side 1");

console.log("BAM ghost compartments and TWO-tray Side 1 lock passed");
