import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

const releaseStart = styles.lastIndexOf(
  "v84.19 — FINAL HORIZONTAL CENTERING FOR THE HEADER LOGO",
);
const navigationCenteringStart = styles.lastIndexOf(
  "v83.10 — FINAL MAIN NAVIGATION HORIZONTAL CENTERING",
);

assert.ok(releaseStart > navigationCenteringStart);

const releaseStyles = styles.slice(releaseStart);
assert.match(
  releaseStyles,
  /\.compactTopbar > \.brandLogoButton \{[\s\S]*?justify-self: center !important;[\s\S]*?\}/,
);

assert.match(app, /<header className="topbar compactTopbar">/);
assert.match(app, /className="brand brandLogoButton"/);
assert.match(app, /<strong>Robert's Recipe Box<\/strong>/);
assert.match(app, /aria-label="Go home"/);

const navigationCentering = styles.slice(navigationCenteringStart, releaseStart);
assert.match(
  navigationCentering,
  /\.simpleHeaderNav \{[\s\S]*?justify-content: center !important;/,
);

console.log("v84.19 header-logo horizontal-centering contracts passed.");
