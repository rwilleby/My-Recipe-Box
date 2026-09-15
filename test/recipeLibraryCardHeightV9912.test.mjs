import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const compactCss = css.slice(
  css.indexOf("/* v99.9 — Browse Recipe Library cards"),
  css.indexOf("/* v99.11 — final Browse Library column lock"),
);

assert.match(compactCss, /\.compactBrowseRecipeCard \{\s*min-height: 178px/);
assert.match(compactCss, /\.compactDinnerCardMedia \{\s*min-height: 178px/);
assert.doesNotMatch(compactCss, /194px/);

console.log("v99.12 Recipe Library cards use the approved 178px Complete Dinner box depth.");
