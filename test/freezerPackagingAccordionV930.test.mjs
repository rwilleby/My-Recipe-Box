import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const packagingData = await readFile(new URL("../src/data/freezerPackagingAccordions.js", import.meta.url), "utf8");

const pageStart = app.indexOf("function FreezerTipsPage");
const pageEnd = app.indexOf("function AboutRecipesPage", pageStart);
const page = app.slice(pageStart, pageEnd);

assert.ok(pageStart >= 0 && pageEnd > pageStart, "Freezer Meals & Storage page must remain present");
assert.match(page, /useState\(null\)/, "All packaging accordions must load closed");
assert.match(page, /aria-expanded=\{isOpen\}/);
assert.match(page, /aria-controls=\{panelId\}/);
for (const title of [
  "How I Package My Individual Freezer Meals",
  "How I Package My Freezer Dinners For Two",
  "How I Package My Freezer Meal Components",
]) {
  assert.match(packagingData, new RegExp(title));
}
assert.match(packagingData, /See the complete process—from portioning one prepared meal to storing it in the freezer\./);
assert.match(packagingData, /Prepare, package, label, and protect each individual meal before placing it in the freezer\./);
assert.match(page, /setOpenPackagingAccordion\(\(current\) => current === accordion\.id \? null : accordion\.id\)/);
assert.ok(page.indexOf("freezerPackagingAccordion") > page.indexOf("freezerMealsStorageSectionIntro"));
assert.ok(page.indexOf("freezerPackagingAccordion") < page.indexOf("freezerMealsStorageIntroActions"));

const imageNames = [
  "01-select-and-portion.webp",
  "02-add-meal-pieces.webp",
  "03-secure-the-lid.webp",
  "04-apply-the-label.webp",
  "05-vacuum-seal.webp",
  "06-store-in-freezer.webp",
];

let previousPosition = -1;
for (const imageName of imageNames) {
  const position = packagingData.indexOf(imageName);
  assert.ok(position > previousPosition, `${imageName} must appear in the approved order`);
  previousPosition = position;
  await access(new URL(`../public/images/freezer-packaging/${imageName}`, import.meta.url));
}

for (const title of ["SELECT & PORTION", "ADD THE MEAL PIECES", "SECURE THE LID", "LABEL THE MEAL", "VACUUM SEAL", "STORE IN THE FREEZER"]) {
  assert.ok(packagingData.includes(title), `Missing step title: ${title}`);
}

assert.match(page, /loading="lazy"/);
assert.match(page, /decoding="async"/);
assert.match(page, /width="1200"/);
assert.match(page, /height="900"/);
assert.match(css, /\.freezerPackagingSteps\s*\{[\s\S]*grid-template-columns:\s*repeat\(6,/);
assert.match(css, /\.freezerPackagingAccordion\s*\{[\s\S]*width:\s*100%/);
assert.match(css, /\.freezerPackagingAccordionList\s*\{[\s\S]*width:\s*100%/);
assert.match(css, /\.freezerPackagingTextStep\s*\{/);
assert.match(css, /@media \(max-width: 1100px\)[\s\S]*\.freezerPackagingSteps\s*\{grid-template-columns:\s*repeat\(3,/);
assert.match(css, /@media \(max-width: 650px\)[\s\S]*\.freezerPackagingSteps\s*\{grid-template-columns:\s*1fr/);
assert.match(css, /\.freezerPackagingStep img\s*\{[\s\S]*aspect-ratio:\s*4 \/ 3[\s\S]*object-fit:\s*cover/);
assert.match(css, /@media \(max-width: 1100px\)[\s\S]*\.freezerPackagingArrow\s*\{display:\s*none/);

console.log("Freezer Meals & Storage packaging accordion contracts passed");
