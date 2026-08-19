import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

const finalCenteringStart = styles.lastIndexOf(
  "v83.10 — FINAL MAIN NAVIGATION HORIZONTAL CENTERING",
);
const earlierNavigationLayout = styles.lastIndexOf(
  "v83.6 — fit the expanded six-section navigation beneath the logo",
);

assert.ok(finalCenteringStart > earlierNavigationLayout);
const centering = styles.slice(finalCenteringStart);

assert.match(centering, /@media \(min-width: 721px\)/);
assert.match(centering, /\.simpleHeaderNav \{[\s\S]*justify-content: center !important/);
assert.match(centering, /margin-left: auto !important/);
assert.match(centering, /margin-right: auto !important/);

const navStart = app.indexOf('<nav ref={mainNavigationRef} className="navLinks simpleHeaderNav"');
const navEnd = app.indexOf("</nav>", navStart);
const nav = app.slice(navStart, navEnd);

assert.ok(navStart >= 0 && navEnd > navStart);
assert.match(nav, /headerGroups\.map/);
assert.match(nav, /simpleHeaderFavoriteButton/);
assert.match(nav, /setOpenNavMenu/);
assert.match(nav, /aria-expanded=\{isMenuOpen\}/);

const headerGroupsStart = app.indexOf("const headerGroups = [");
const headerGroupsEnd = app.indexOf("return (", headerGroupsStart);
const headerGroups = app.slice(headerGroupsStart, headerGroupsEnd);
const expectedOrder = [
  "ABOUT US",
  "RECIPES & MEALS",
  "KITCHEN INVENTORY",
  "MEAL PLANNING",
  "SHOPPING",
  "RESOURCES",
];
let priorIndex = -1;
for (const label of expectedOrder) {
  const index = headerGroups.indexOf(`label: "${label}"`);
  assert.ok(index > priorIndex, `${label} should follow the requested centered menu order`);
  priorIndex = index;
}

console.log("v83.10 main-navigation horizontal-centering contracts passed.");
