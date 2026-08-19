import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const styles = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const releaseStyles = styles.slice(styles.indexOf("v84.28 — FULL-WIDTH MASTER INVENTORY COMMAND STRIP"));

assert.match(releaseStyles, /\.inventoryHubControlStrip \{[\s\S]*width: 90% !important;[\s\S]*max-width: 90% !important;/);
assert.match(releaseStyles, /grid-template-columns: minmax\(0, 3fr\) repeat\(4, minmax\(0, 1fr\)\) !important;/);
assert.match(releaseStyles, /margin-left: auto !important;[\s\S]*margin-right: auto !important;/);
assert.match(releaseStyles, /@media \(max-width: 900px\)[\s\S]*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\) !important;/);
assert.match(releaseStyles, /@media \(max-width: 700px\)[\s\S]*width: 96% !important;/);

console.log("v84.28 full-width master inventory command strip contracts passed.");
