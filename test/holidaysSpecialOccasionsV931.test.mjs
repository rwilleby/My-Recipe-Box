import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { HOLIDAY_OCCASION_MENUS } from "../src/data/holidayOccasionMenus.js";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const routes = await readFile(new URL("../src/routing/seoRoutes.js", import.meta.url), "utf8");
const guides = await readFile(new URL("../src/data/howItWorksGuides.js", import.meta.url), "utf8");

assert.match(app, /SLOW COOKER MEALS[\s\S]*HOLIDAYS AND SPECIAL OCCASIONS/);
assert.match(app, /title="Holidays and Special Occasions"/);
assert.match(app, /Make holidays and special occasions easier to plan with complete menus/);
assert.match(app, /src="images\/heroes\/holidays-special-occasions-hero-1440x464\.webp"/);
assert.doesNotMatch(app, /"Holidays and Special Occasions",\s*\n\s*\n\s*"Summer Cookouts"/);
assert.match(guides, /\["Holidays and Special Occasions", "holidays-special-occasions"\]/);

const occasions = [
  "New Year’s Day", "Valentine’s Day", "Mardi Gras", "St. Patrick’s Day", "Passover",
  "Easter", "Cinco de Mayo", "Mother’s Day", "Memorial Day", "Father’s Day",
  "Independence Day", "Labor Day", "Rosh Hashanah", "Halloween", "Thanksgiving",
  "Hanukkah", "Christmas Eve", "Christmas Day", "New Year’s Eve",
];
assert.deepEqual(HOLIDAY_OCCASION_MENUS.map(({ occasion }) => occasion), occasions);

assert.equal((app.match(/data-recipe-status=/g) || []).length, 1);
assert.match(app, /data-recipe-status=\{dish\.recipeId \? "available" : "awaiting-recipe"\}/);
assert.match(app, /Add Menu to Meal Planner/);
assert.match(app, /Add Menu Ingredients to Grocery List/);
assert.doesNotMatch(app, /id="holidayOccasionSelect"/);
assert.match(app, /className="holidayOccasionsSectionIntro"/);
assert.match(app, /className="holidayOccasionCalendar"/);
assert.match(app, /className="holidayOccasionCarousel"/);
assert.match(app, /occasionTrackRef/);
assert.match(app, /track\.scrollBy\(\{ left: direction \* Math\.max\(260, track\.clientWidth \* 0\.78\), behavior: "smooth" \}\)/);
assert.match(app, /aria-label="See earlier occasions"/);
assert.match(app, /aria-label="See later occasions"/);
assert.match(app, /className=\{`holidayOccasionTile\$\{isSelected \? " isSelected" : ""\}`\}/);
assert.match(app, /aria-pressed=\{isSelected\}/);
assert.doesNotMatch(app, /featuredMenuRef\.current\?\.scrollIntoView/);
assert.match(app, /window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\)/);
assert.match(routes, /"Holidays and Special Occasions": "\/holidays-and-special-occasions\/"/);
assert.match(css, /\.holidayMenuDishes[\s\S]*grid-template-columns: repeat\(3/);
assert.match(css, /@media \(max-width: 680px\)[\s\S]*\.holidayMenuDishes[\s\S]*grid-template-columns: 1fr/);
assert.match(css, /\.holidayOccasionCalendar[\s\S]*display: flex[\s\S]*overflow-x: auto[\s\S]*scroll-snap-type: x proximity/);
assert.match(css, /\.holidayOccasionTile[\s\S]*flex: 0 0 148px/);
assert.match(css, /@media \(max-width: 680px\)[\s\S]*\.holidayOccasionTile[\s\S]*flex-basis: 126px/);
assert.equal(HOLIDAY_OCCASION_MENUS.find(({ occasion }) => occasion === "St. Patrick’s Day").dishes[0].recipeId, "CP-042");
assert.equal(HOLIDAY_OCCASION_MENUS.find(({ occasion }) => occasion === "Easter").dishes[0].recipeId, "AM-013");

const imageFiles = [
  "new-years-day.webp", "valentines-day.webp", "mardi-gras.webp", "st-patricks-day.webp",
  "passover.webp", "easter.webp", "cinco-de-mayo.webp", "mothers-day.webp", "memorial-day.webp",
  "fathers-day.webp", "independence-day.webp", "labor-day.webp", "rosh-hashanah.webp", "halloween.webp",
  "thanksgiving.webp", "hanukkah.webp", "christmas-eve.webp", "christmas-day.webp", "new-years-eve.webp",
];
for (const file of imageFiles) {
  const image = new URL(`../public/images/holiday-occasions/${file}`, import.meta.url);
  await access(image);
  assert.ok((await stat(image)).size > 0, `${file} must not be empty`);
}

console.log("Holidays and Special Occasions v93.1 tests passed.");
