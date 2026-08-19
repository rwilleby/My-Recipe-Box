import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const styles = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const releaseStyles = styles.slice(styles.indexOf("v84.29 — FULL-WIDTH, ALPHABETIZED INVENTORY VIEWS"));

assert.match(releaseStyles, /\.inventoryHubControlStrip,[\s\S]*\.inventoryHubContent \{[\s\S]*width: 100% !important;[\s\S]*max-width: 100% !important;/);
assert.match(styles, /grid-template-columns: minmax\(0, 3fr\) repeat\(4, minmax\(0, 1fr\)\) !important;/);

console.log("v84.28/v84.29 full-width master inventory command strip contracts passed.");
