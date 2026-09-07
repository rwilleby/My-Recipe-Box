import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const responsiveShopping = css.match(/@media \(max-width: 900px\) \{[\s\S]*?\/\* v85\.4 minor edit/);

assert.ok(responsiveShopping, "Shopping List should switch layout before a narrowed desktop window clips controls");
assert.match(responsiveShopping[0], /\.shoppingListColumnHeader \{ display: none; \}/);
assert.match(responsiveShopping[0], /\.shoppingListDataRow\s*\{[\s\S]*?grid-template-columns:\s*36px minmax\(0, 1fr\) auto;/);
assert.match(responsiveShopping[0], /\.shoppingListOnlineButton\s*\{[\s\S]*?grid-column:\s*2 \/ -1;[\s\S]*?max-width:\s*100%;/);

console.log("v97.18 narrowed desktop Shopping List fit passed.");
