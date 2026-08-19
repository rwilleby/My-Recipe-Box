import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";
import {
  collectPrintableGroceryItems,
  collectPrintablePreparedRequirements,
  shoppingItemKey,
  shoppingNeedItemKey,
} from "../src/utils/shoppingPrintList.js";

const chickenOne = {
  id: "chicken-one",
  name: "Boneless skinless chicken breast, diced",
  qty: 2,
  unit: "lb",
  aisle: "Meat",
  kind: "grocery",
};
const chickenTwo = {
  id: "chicken-two",
  name: "Chicken breast, sliced",
  qty: 3,
  unit: "lb",
  aisle: "Meat",
  kind: "grocery",
};
const componentOne = {
  id: "component-one",
  name: "Cooked Chicken Package",
  qty: 2,
  unit: "package(s)",
  aisle: "Prepared Component",
  kind: "component",
  componentId: "cooked-chicken",
};
const componentTwo = { ...componentOne, id: "component-two", qty: 1 };
const groups = [
  { id: "meal-one", items: [chickenOne, componentOne] },
  { id: "meal-two", items: [chickenTwo, componentTwo] },
];

const oneChecked = {
  [shoppingNeedItemKey(groups[0], chickenOne, 0)]: true,
  [shoppingNeedItemKey(groups[0], componentOne, 1)]: true,
};
const remainingChicken = consolidateShoppingItems(
  collectPrintableGroceryItems(groups, oneChecked),
);
assert.equal(remainingChicken.length, 1);
assert.equal(remainingChicken[0].name, "Boneless skinless chicken breasts (raw)");
assert.equal(remainingChicken[0].qty, 3);

const consolidatedChecked = { [shoppingItemKey(chickenOne)]: true };
assert.deepEqual(collectPrintableGroceryItems(groups, consolidatedChecked), []);

const remainingComponents = collectPrintablePreparedRequirements(
  [{ componentId: "cooked-chicken", packagesRequired: 3 }],
  groups,
  oneChecked,
);
assert.equal(remainingComponents.length, 1);
assert.equal(remainingComponents[0].packagesRequired, 1);

assert.deepEqual(
  collectPrintablePreparedRequirements(
    [{ componentId: "cooked-chicken", packagesRequired: 3 }],
    groups,
    { "prepared-cooked-chicken": true },
  ),
  [],
);

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
assert.match(app, /function previewShoppingList\(\)/);
assert.match(app, /openShoppingListPrintout\(false\)/);
assert.match(app, />\s*Preview\s*</);
assert.match(app, /Shopping List Print Preview/);
assert.match(app, /Print This List/);
assert.match(app, /@media print \{ \.previewToolbar \{ display: none !important; \} \}/);

console.log("v84.20 shopping-list checked-item printing and preview contracts passed.");
