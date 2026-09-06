import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, css, utility] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
  readFile(new URL("../src/utils/onlineGroceryShopping.js", import.meta.url), "utf8"),
]);

for (const store of ["Walmart", "Kroger", "H-E-B", "Randall's"]) {
  assert.match(utility, new RegExp(store.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}
assert.match(app, /PREFERRED_GROCERY_STORE_KEY/);
assert.match(utility, /rrb_preferredGroceryStore/);
assert.match(utility, /ONLINE_SHOPPING_WINDOW_NAME/);
assert.match(utility, /popup=yes,width=\$\{popupWidth\},height=\$\{popupHeight\}/);
assert.match(utility, /browserWindow\.open\(url, ONLINE_SHOPPING_WINDOW_NAME/);
assert.match(app, /openOnlineShoppingWindow\(item\.name\)/);
assert.match(utility, /encodeURIComponent\(query\)/);
assert.match(app, /aria-label="Preferred online grocery store"/);
assert.match(css, /\.shoppingStoreChooser/);
assert.match(css, /\.shoppingListOnlineButton/);

console.log("v97.2 reusable online grocery shopping window contracts passed.");
