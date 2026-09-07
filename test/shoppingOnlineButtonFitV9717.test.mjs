import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const mobileShopping = css.match(/@media \(max-width: 900px\) \{[\s\S]*?\/\* v85\.4 minor edit/);

assert.ok(mobileShopping, "mobile Shopping List rules should exist");
assert.match(mobileShopping[0], /padding:\s*11px 10px 11px 2px/);
assert.match(mobileShopping[0], /\.shoppingListOnlineButton\s*\{[\s\S]*?box-sizing:\s*border-box;[\s\S]*?max-width:\s*100%;[\s\S]*?min-width:\s*0;[\s\S]*?white-space:\s*nowrap;/);

console.log("v97.17 narrow Shopping List online-button fit passed.");
