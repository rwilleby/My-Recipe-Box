import assert from "node:assert/strict";
import {
  createKosPlatform,
  createMemoryStorage,
} from "../src/kos/index.js";

const storage = createMemoryStorage();
const kos = createKosPlatform({
  storage,
  clock: () => new Date("2026-08-08T12:00:00.000Z"),
});

kos.mealPlanner.start({
  weekOf: "2026-08-10",
  mode: "balanced",
});

kos.mealPlanner.assign("monday", {
  title: "Chicken Dinner",
  cuisine: "American",
  protein: "Chicken",
  mealBalance: 4,
});

kos.mealPlanner.assign("tuesday", {
  title: "Beef Tacos",
  cuisine: "Mexican",
  protein: "Beef",
  mealBalance: 5,
});

kos.mealPlanner.assign("wednesday", {
  title: "Shrimp Dinner",
  cuisine: "Seafood",
  protein: "Seafood",
  mealBalance: 3,
  freezer: true,
});

let analysis = kos.mealPlanner.analysis();
assert.equal(analysis.plannedCount, 3);
assert.equal(analysis.openDays, 4);
assert.equal(analysis.freezerMeals, 1);
assert.equal(analysis.uniqueCuisines, 3);
assert.equal(analysis.uniqueProteins, 3);
assert.equal(analysis.averageMealBalance, 4);

kos.mealPlanner.assign("thursday", {
  title: "Chicken Dinner",
  cuisine: "American",
  protein: "Chicken",
});
analysis = kos.mealPlanner.analysis();
assert.equal(analysis.duplicateTitles.length, 1);
assert.equal(analysis.duplicateTitles[0].title, "Chicken Dinner");

const suggestions = kos.mealPlanner.suggestions();
assert.ok(suggestions.some((row) => row.id === "fill-open-days"));
assert.ok(suggestions.some((row) => row.id === "reduce-repeat-meals"));
assert.ok(suggestions.every((row) => row.language === "could"));

const secondKos = createKosPlatform({
  storage,
});
assert.equal(secondKos.mealPlanner.current().weekOf, "2026-08-10");
assert.equal(secondKos.mealPlanner.rows()[0].meal.title, "Chicken Dinner");

secondKos.mealPlanner.remove("monday");
assert.equal(secondKos.mealPlanner.rows()[0].meal, null);

console.log("KOS-400 Meal Planning Intelligence contracts passed");
