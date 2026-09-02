import assert from "node:assert/strict";
import fs from "node:fs";
import { parseStoreProductUrl } from "../src/utils/storeProductImport.js";
import { createRecipeBoxBackup, restoreRecipeBoxBackup } from "../src/utils/recipeBoxBackup.js";

const walmart = "https://www.walmart.com/ip/Great-Value-Donut-Shop-100-Arabica-Medium-Roast-Ground-Coffee-Pods-38-4oz-100-Count/5375582628?athAsset=tracking&athena=true&athbdg=L1100";
assert.deepEqual(parseStoreProductUrl(walmart), {
  productName: "Great Value Donut Shop Coffee Pods", brand: "Great Value", variety: "100% Arabica Medium Roast",
  packageSize: "38.4 oz", packageCount: "100", quantityOwned: "1", unit: "Pods", categoryId: "beverages",
  family: "Coffee", storage: "Pantry", expirationDate: "", lowStockLevel: "1", retailer: "Walmart",
  cleanUrl: "https://www.walmart.com/ip/Great-Value-Donut-Shop-100-Arabica-Medium-Roast-Ground-Coffee-Pods-38-4oz-100-Count/5375582628",
  price: "", priceRecordedAt: "", retailerItemId: "5375582628",
});
assert.equal(parseStoreProductUrl("https://www.heb.com/product-detail/test-item/123?utm_source=x").retailer, "H-E-B");
assert.equal(parseStoreProductUrl("https://www.kroger.com/p/test-item/000123?cid=tracking").cleanUrl, "https://www.kroger.com/p/test-item/000123");
assert.equal(parseStoreProductUrl("https://www.amazon.com/Test-Item/dp/B012345678?tag=test").retailerItemId, "B012345678");
assert.throws(() => parseStoreProductUrl("https://example.com/item"), /Walmart, H-E-B, Kroger or Amazon/);

class MemoryStorage {
  constructor(seed = {}) { this.map = new Map(Object.entries(seed)); }
  get length() { return this.map.size; }
  key(index) { return [...this.map.keys()][index] ?? null; }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}
const inventory = { customItems: [{ id: "custom-store-1", productName: "Coffee Pods", retailer: "Walmart", productUrl: "https://www.walmart.com/ip/x/1", imageKey: "custom-store-1" }], records: { "custom-store-1": { have: "1", lowStockLevel: "1", expirationDate: "2027-01-01", price: "24.98" } } };
const source = new MemoryStorage({ rrb_masterKitchenInventory_v1: JSON.stringify(inventory) });
const backup = createRecipeBoxBackup(source);
const target = new MemoryStorage();
restoreRecipeBoxBackup(backup, "replace", target);
assert.deepEqual(JSON.parse(target.getItem("rrb_masterKitchenInventory_v1")), inventory);

const component = fs.readFileSync(new URL("../src/components/StoreInventoryImport.jsx", import.meta.url), "utf8");
for (const phrase of ["ADD TO MY KITCHEN", "Enter Manually", "Add From Store", "Scan Barcode", "Coming Soon", "Drag a product image or product link here", "Add to Inventory", "Cancel", "aria-selected"]) assert.match(component, new RegExp(phrase));
const page = fs.readFileSync(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
assert.match(page, /target="_blank" rel="noopener noreferrer"/);
assert.match(page, /saveInventoryProductThumbnail/);
const css = fs.readFileSync(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");
assert.match(css, /button\[aria-selected="true"\]\s*\{[^}]*background:\s*#77716b;[^}]*color:\s*#fff;/s);
assert.match(css, /@media \(max-width: 700px\)/);

console.log("v96.4 store inventory import, privacy, persistence, backup and responsive contracts passed.");
