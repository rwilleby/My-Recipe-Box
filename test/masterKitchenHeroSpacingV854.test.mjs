import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("Master Kitchen Inventory starts closer to the hero", () => {
  const marker = "/* v85.4 minor edit — tighten Master Kitchen Inventory hero spacing. */";
  const markerIndex = css.lastIndexOf(marker);
  const legacyIndex = css.indexOf(".inventoryHubPage {\n  width: 100% !important;\n  padding-top: 18px !important;");

  assert.ok(markerIndex > legacyIndex, "the tighter spacing override should follow the legacy inventory spacing");
  assert.match(css.slice(markerIndex), /\.inventoryHubPage\s*\{[^}]*padding-top:\s*0\s*!important;/s);
});
