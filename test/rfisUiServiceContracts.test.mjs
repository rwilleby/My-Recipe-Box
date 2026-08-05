import assert from "node:assert/strict";
import { createRfisPlatform } from "../src/services/createRfisPlatform.js";

const recipes = [
  { id: "AM-001", title: "Salisbury Steak" },
  { id: "SD-003", title: "Mashed Potatoes" },
  { id: "SD-004", title: "Green Beans" },
  { id: "AM-002", title: "Beef Tips" },
];
const dinners = [
  { id: "CD-0001", legacyId: "meal-001", number: 1, title: "Salisbury Steak Complete Dinner", entreeRecipeId: "AM-001", sideRecipeIds: ["SD-003", "SD-004"], cuisine: "American", collections: ["Comfort"], hero: { status: "not-started" }, status: "approved" },
  { id: "CD-0002", legacyId: "meal-002", number: 2, title: "Beef Tips Complete Dinner", entreeRecipeId: "AM-002", sideRecipeIds: ["SD-003"], cuisine: "American", collections: ["Comfort"], hero: { status: "approved" }, status: "approved" },
];
const collections = { Comfort: ["CD-0001", "CD-0002"] };
const rfis = createRfisPlatform({ recipes, dinners, collections });

assert.equal(rfis.completeDinners.all().length, 2);
assert.equal(rfis.completeDinners.byRecipe("SD-003").length, 2);
assert.equal(rfis.completeDinners.resolve("MEAL-001").entree.name, "Salisbury Steak");
assert.equal(rfis.collections.get("Comfort").dinners.length, 2);
assert.equal(rfis.search.dinners("green beans")[0].id, "CD-0001");
assert.equal(rfis.recommendations.relatedDinners("CD-0001")[0].dinner.id, "CD-0002");
assert.equal(rfis.heroes.approved(dinners[1]), true);
assert.equal(rfis.validation.all().ok, true);
assert.ok(rfis.completeDinners.listEntrees().length > 0);
assert.ok(rfis.completeDinners.sideRecommendations("AM-001").length === 2);

console.log("RFIS UI service contracts passed");
