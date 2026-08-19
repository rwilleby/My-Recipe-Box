import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

assert.match(app, /function freezerManagementCuisine\(recipe = \{\}\)/);
assert.match(app, /cuisine: freezerManagementCuisine\(mainRecipe \|\| \{ id: meal\.mainRecipeId \}\)/);
assert.match(app, /cuisine: freezerManagementCuisine\(recipe\)/);
assert.match(app, /expandedCuisineGroups, setExpandedCuisineGroups\] = useState\(\(\) => new Set\(\)\)/);
assert.match(app, /const visibleCuisineGroups = \[\.\.\.visibleItems\.reduce/);
assert.match(app, /className="masterInventoryCategory freezerCuisineAccordion"/);
assert.match(app, /\{stocked\} stocked \/ \{group\.items\.length\} \{activeKind === "completeMeal" \? "meals" : "recipes"\}/);
assert.match(app, /Boolean\(effectiveManagementSearch\) \|\| expandedCuisineGroups\.has\(group\.cuisine\)/);

assert.match(app, /expandedPantryGroups, setExpandedPantryGroups\] = useState\(\(\) => new Set\(\)\)/);
assert.match(app, /className="masterInventoryAccordions pantryInventoryAccordions"/);
assert.match(app, /className="masterInventoryCategory pantryGroup"/);
assert.match(app, /Boolean\(normalizedExternalSearch\) \|\| expandedPantryGroups\.has\(group\.group\)/);
assert.match(app, /\{stocked\} stocked \/ \{group\.items\.length\} items/);

const accordionStyles = styles.slice(styles.lastIndexOf("v84.26 — MATCHED INVENTORY ACCORDION TREATMENT"));
assert.match(accordionStyles, /\.freezerCuisineAccordions,[\s\S]*\.pantryInventoryAccordions,[\s\S]*\.freezerAccordionList/);
assert.match(accordionStyles, /\.pantryInventoryAccordions \.pantryGroup \{[\s\S]*border: 1px solid #d5cdbf;[\s\S]*border-radius: 12px/);
assert.match(accordionStyles, /\.freezerInventoryEmbedded \.freezerAccordionButton \{[\s\S]*background: #eee8dd;/);
assert.match(accordionStyles, /\.freezerInventoryEmbedded \.freezerAccordionButton strong \{[\s\S]*font-family: Georgia, serif;[\s\S]*font-size: 18px;/);

console.log("v84.26 matching Freezer and Pantry accordion contracts passed.");
