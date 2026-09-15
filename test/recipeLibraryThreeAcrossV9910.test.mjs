import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const releaseCss = css.slice(css.indexOf("/* v99.9 — Browse Recipe Library cards"));

assert.match(releaseCss, /\.browseCompactRecipeGrid\s*\{[\s\S]*?grid-template-columns: repeat\(3, minmax\(0, 1fr\)\) !important/);
assert.match(releaseCss, /@media \(max-width: 860px\)[\s\S]*?repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(releaseCss, /@media \(max-width: 620px\)[\s\S]*?grid-template-columns: 1fr !important/);

console.log("v99.10 Recipe Library remains three across through desktop and iPad landscape widths.");
