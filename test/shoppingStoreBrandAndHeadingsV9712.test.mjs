import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { ONLINE_GROCERY_STORES, openOnlineGroceryWindow } from "../src/utils/onlineGroceryShopping.js";

const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");

const expectedBrands = {
  walmart: "Great Value",
  kroger: "Kroger",
  heb: "H-E-B",
  randalls: "Signature Select",
};

for (const [storeId, brand] of Object.entries(expectedBrands)) {
  assert.equal(ONLINE_GROCERY_STORES[storeId].storeBrand, brand);
  let openedUrl = "";
  const browserWindow = {
    screen: { availWidth: 1440, availHeight: 900 },
    open(url) {
      openedUrl = url;
      return { focus() {} };
    },
  };
  openOnlineGroceryWindow(storeId, "whole milk", browserWindow);
  assert.match(decodeURIComponent(openedUrl), new RegExp(`${brand} whole milk`));
}

assert.match(css, /\.shoppingListIntroActions > \.shoppingControlPrintButton\s*\{[\s\S]*?background:\s*#fff !important;[\s\S]*?color:\s*#14532d !important;/);
assert.match(css, /\.shoppingFlatListTitle h2\s*\{[\s\S]*?font:\s*700 17px\/1\.2 Georgia/);

console.log("v97.12 store-brand shopping and compact heading contracts passed.");
