import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [app, journey, categoryGrid, rotations] = await Promise.all([
  read("../src/App.jsx"),
  read("../src/features/home/HomeMealJourney.jsx"),
  read("../src/features/home/HomeCategoryGrid.jsx"),
  read("../src/features/home/HomeMealRotations.jsx"),
]);

assert.match(app, /import HomeMealJourneyAccordion, \{ MealJourneyContent \} from "\.\/features\/home\/HomeMealJourney\.jsx";/);
assert.match(app, /import HomeCategoryGrid, \{/);
assert.match(app, /import \{ createHomeMealRotations \} from "\.\/features\/home\/HomeMealRotations\.jsx";/);
assert.match(app, /const \{ HomeComboMealStrip, HomeDietMealStrip \} = createHomeMealRotations\(\{/);

assert.doesNotMatch(app, /function HomeMealJourneyAccordion\(/);
assert.doesNotMatch(app, /function CategoryGrid\(/);
assert.doesNotMatch(app, /function HomeComboMealStrip\(/);
assert.doesNotMatch(app, /function HomeDietMealStrip\(/);

assert.match(journey, /export const MEAL_JOURNEY_STEPS = \[/);
assert.match(journey, /export function MealJourneyContent\(/);
assert.match(journey, /export default function HomeMealJourneyAccordion\(/);
assert.match(journey, /className="homeMealJourneyToggle"/);

assert.match(categoryGrid, /export const HOME_CATEGORY_CODES = \[/);
assert.match(categoryGrid, /export default function HomeCategoryGrid\(/);
assert.match(categoryGrid, /className="categoryGrid homeCategoryGrid"/);
assert.match(categoryGrid, /HOME_CATEGORY_CODES\.slice\(0, 13\)/);

assert.match(rotations, /export function createHomeMealRotations\(/);
assert.match(rotations, /function HomeComboMealStrip\(/);
assert.match(rotations, /function HomeDietMealStrip\(/);
assert.match(rotations, /return \{ HomeComboMealStrip, HomeDietMealStrip \};/);
assert.match(rotations, /HOME_COMBO_ROTATION_MS = 60 \* 1000/);
assert.match(rotations, /homeComboMealFullCrossfadeStage/);

assert.ok(app.split("\n").length < 19000, "v83.2 should keep App.jsx below 19,000 lines");

console.log("v83.2 Home feature structure and runtime wiring contracts passed.");
