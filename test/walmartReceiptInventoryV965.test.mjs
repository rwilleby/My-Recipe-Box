import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createReceiptFingerprint, extractPdfTextFromBuffer, matchReceiptItems, parseGroceryDocumentText, parseWalmartReceiptText } from "../src/utils/walmartReceiptImport.js";
import { createRecipeBoxBackup, restoreRecipeBoxBackup } from "../src/utils/recipeBoxBackup.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const page = fs.readFileSync(path.join(root, "src/components/MasterKitchenInventoryPage.jsx"), "utf8");
const store = fs.readFileSync(path.join(root, "src/components/StoreInventoryImport.jsx"), "utf8");
const receipt = fs.readFileSync(path.join(root, "src/components/ReceiptInventoryImport.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/components/MasterKitchenInventoryPage.css"), "utf8");

for (const label of ["Choose Products", "Add From Store", "Import Receipt or List", "Enter Manually"]) assert.match(store, new RegExp(label));
for (const text of ["Drag a grocery receipt or shopping list here", "Upload Receipt or List", "Read Receipt or List", "Review Imported Items", "Add Selected Items", "Add to existing quantity", "Replace current quantity", "Create separate entry", "Skip this item"]) assert.match(receipt, new RegExp(text));
assert.match(receipt, /accept="application\/pdf,\.pdf,image\/jpeg,image\/png,image\/webp,image\/heic,image\/heif"/);
assert.match(receipt, /role="tabpanel"/);
assert.match(receipt, /not saved/);
assert.match(page, /receiptAliases/);
assert.match(page, /receiptFingerprints/);
assert.match(css, /grid-template-columns:\s*repeat\(4/);

const parsed = parseWalmartReceiptText(`WALMART\n09/01/2026\n2 X GREAT VALUE WHOLE MILK 3.48\nPAPER TOWELS 9.97\nSUBTOTAL 16.93\nTAX 1.02\nVISA 17.95`);
assert.equal(parsed.retailer, "Walmart");
assert.equal(parsed.items.length, 1);
assert.equal(parsed.items[0].quantity, 2);
assert.match(parsed.items[0].description, /GREAT VALUE WHOLE MILK/);
assert.throws(() => parseWalmartReceiptText("KROGER\nMILK 3.48"), /Walmart receipt/);
const groceryList = parseGroceryDocumentText("GROCERY LIST\nMilk\nEggs\n2 x Chicken broth");
assert.equal(groceryList.retailer, "Unknown store");
assert.deepEqual(groceryList.items.map((item) => [item.description, item.quantity]), [["Milk", 1], ["Eggs", 1], ["Chicken broth", 2]]);
assert.equal(parseGroceryDocumentText("H-E-B\nWHOLE MILK 4.29\nTAX 0.00").retailer, "H-E-B");

const catalog = [{ id: "dairy-eggs", title: "Dairy & Eggs", items: [{ id: "milk-whole", family: "Milk", variation: "Whole milk", unit: "gallons" }] }];
const matched = matchReceiptItems(parsed.items, catalog, {});
assert.equal(matched[0].matchedItemId, "milk-whole");
assert.equal(matched[0].selected, true);
const fingerprintA = await createReceiptFingerprint(parsed.purchaseDate, parsed.items);
const fingerprintB = await createReceiptFingerprint(parsed.purchaseDate, parsed.items);
assert.equal(fingerprintA, fingerprintB);
const tinyPdf = new TextEncoder().encode("%PDF-1.4\n1 0 obj <<>> endobj\nBT (WALMART) Tj (MILK 3.48) Tj ET\n%%EOF");
assert.match(await extractPdfTextFromBuffer(tinyPdf.buffer), /WALMART[\s\S]*MILK/);
await assert.rejects(() => extractPdfTextFromBuffer(new TextEncoder().encode("not pdf").buffer), /valid PDF/);

class MemoryStorage {
  constructor(seed = {}) { this.map = new Map(Object.entries(seed)); }
  get length() { return this.map.size; }
  key(index) { return [...this.map.keys()][index] ?? null; }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}
const inventory = { records: {}, customItems: [], receiptAliases: { "great value milk": "milk-whole" }, receiptFingerprints: [fingerprintA] };
const restored = new MemoryStorage();
restoreRecipeBoxBackup(createRecipeBoxBackup(new MemoryStorage({ rrb_masterKitchenInventory_v1: JSON.stringify(inventory) })), "replace", restored);
assert.deepEqual(JSON.parse(restored.getItem("rrb_masterKitchenInventory_v1")), inventory);

console.log("Walmart receipt inventory import contract passed.");
