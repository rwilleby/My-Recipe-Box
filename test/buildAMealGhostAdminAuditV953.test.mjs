import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const builder = fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.jsx"), "utf8");
const styles = fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.css"), "utf8");
const audit = fs.readFileSync(path.join(root, "src/components/AdminMealBuilderImageAudit.jsx"), "utf8");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");

assert.match(styles, /\.mealBuilderTrayInterior\.is-standard \.mealBuilderTrayFood-main\.is-empty[^}]*left:\s*21\.5%[^}]*width:\s*23\.9497%/, "Main ghost must remain inside the approved standard main safe area");
assert.match(styles, /\.mealBuilderTrayFood-side-one\.is-empty[^}]*left:\s*48\.5%[^}]*width:\s*14\.5%/, "Side 1 ghost must remain inside the middle compartment");
assert.match(styles, /\.mealBuilderTrayFood-side-two\.is-empty[^}]*left:\s*64%[^}]*width:\s*14\.5%/, "Side 2 ghost must use the same compact geometry for standard and two-thirds trays");
assert.doesNotMatch(styles, /\.mealBuilderTrayInterior\.is-two-thirds \.mealBuilderTrayFood-side-two\.is-empty/, "Two-thirds trays must not enlarge or displace the Side 2 ghost");
assert.match(styles, /\.mealBuilderTrayFood\.is-empty span[^}]*width:\s*100%[^}]*text-align:\s*center/, "Ghost labels must be horizontally centered");
assert.match(builder, /mainTrayLayout === "standard" && <MealBuilderFoodImage recipe=\{sideOneRecipe\}/, "Side 1 must be omitted when a two-thirds main owns the middle compartment");
assert.match(audit, /<MealBuilderTrayPreview[\s\S]*?suppressEmptySlots/, "The admin audit must use the public tray renderer without unrelated ghost overlays");
assert.match(audit, /MEAL_BUILDER_MAIN_IDS[\s\S]*MEAL_BUILDER_MAIN_LAYOUTS[\s\S]*MEAL_BUILDER_SIDE_IDS/, "The admin audit must consume the public Build-A-Meal registries");
assert.match(audit, /rrb_mealBuilderImageAudit_v1/, "Audit decisions must persist locally");
assert.match(audit, /Export Correction List/, "The connected audit must provide a correction export");
assert.match(app, /Build-A-Meal Image Audit/, "The existing Admin controls must expose the connected audit");

console.log("v95.3 Build-A-Meal ghost geometry and connected Admin audit contracts passed");
