import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

const section = app.slice(app.indexOf("function HomePhotoFeatureSection"), app.indexOf("function TransparencyLine"));
assert.match(section, /homeActionDropdown/);
assert.match(section, /activeAction\.features\.slice\(0, 3\)/);
assert.match(section, /setActivePage\(destination\)/);
assert.doesNotMatch(section, /homePhotoFeatureTile/);
assert.doesNotMatch(section, /HomePhotoFeatureModal/);
assert.match(styles, /--rrb-segmented-height: 32px/);
assert.match(styles, /margin-left: calc\(\(20% \* var\(--home-action-index\)\) \+ 4px\)/);

console.log("v98.1 compact homepage action dropdown contracts passed.");
