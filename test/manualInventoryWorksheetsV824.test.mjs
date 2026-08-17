import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildManualInventoryWorksheetHtml } from "../src/utils/manualInventoryWorksheets.js";

const html = buildManualInventoryWorksheetHtml({
  title: "Pantry & Freezer <Worksheet>",
  instructions: "Check items, then transfer the results.",
  printedDate: "8/17/2026",
  groups: [{
    title: "Sauces & Condiments",
    items: [{ name: "BBQ sauce", detail: "Pantry Level 1" }],
  }],
  columns: [
    { label: "In Stock", kind: "checkbox" },
    { label: "Qty", kind: "line" },
    { label: "Notes", kind: "line" },
  ],
});

assert.match(html, /Pantry &amp; Freezer &lt;Worksheet&gt;/);
assert.match(html, /Sauces &amp; Condiments/);
assert.match(html, /BBQ sauce/);
assert.match(html, /Pantry Level 1/);
assert.match(html, /In Stock/);
assert.match(html, /class="paperBox"/);
assert.match(html, /class="writeLine"/);
assert.match(html, /transfer the results/i);
assert.match(html, /window\.print\(\)/);

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const digitalPanel = await readFile(new URL("../src/components/DigitalStockCheckPanel.jsx", import.meta.url), "utf8");
const digitalStyles = await readFile(new URL("../src/components/DigitalStockCheckPanel.css", import.meta.url), "utf8");
const backup = await readFile(new URL("../src/utils/recipeBoxBackup.js", import.meta.url), "utf8");
assert.match(app, /Pantry Staples Stock-Check Worksheet/);
assert.match(app, /Freezer Inventory Stock-Check Worksheet/);
assert.match(app, /Master Shopping List Stock-Check Worksheet/);
assert.match(app, /Print Stock-Check Worksheet/g);
assert.match(app, /Print Current Inventory/);
assert.match(app, /Pantry Level \$\{item\.level\}/);
assert.match(app, /preparedToBuy\.map/);
assert.equal((app.match(/Open Digital Stock Check/g) || []).length, 3);
assert.match(app, /worksheetId="pantry-staples"/);
assert.match(app, /worksheetId="freezer-inventory"/);
assert.match(app, /worksheetId="master-shopping-list"/);
assert.match(digitalPanel, /rrb_manualStockChecks_v1/);
assert.match(digitalPanel, /IPAD-FRIENDLY LIVE WORKSHEET/);
assert.match(digitalPanel, /included in Backup &amp; Restore/);
assert.match(digitalPanel, /inputMode="decimal"/);
assert.match(digitalPanel, /localStorage\.setItem/);
assert.match(digitalStyles, /width: 22px; height: 22px/);
assert.match(digitalStyles, /@media \(max-width: 800px\)/);
assert.match(backup, /rrb_manualStockChecks_v1/);
assert.match(backup, /Manual Stock Checks/);

console.log("Manual and digital stock-check worksheets v82.4 tests passed.");
