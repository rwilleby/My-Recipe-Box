import assert from "node:assert/strict";
import { createRecipeService } from "../src/services/RecipeService.js";
import { createCompleteDinnerService } from "../src/services/CompleteDinnerService.js";
import { createCollectionService } from "../src/services/CollectionService.js";
import { createRecommendationService } from "../src/services/RecommendationService.js";
import { createSearchService } from "../src/services/SearchService.js";
import { createHeroService } from "../src/services/HeroService.js";
import { createValidationService } from "../src/services/ValidationService.js";

const recipes = [
  { id: "AM-001", title: "Salisbury Steak", category: "AM" },
  { id: "SD-003", title: "Mashed Potatoes", category: "SD" },
  { id: "SD-004", title: "Green Beans", category: "SD" },
  { id: "AM-007", title: "Meatloaf", category: "AM" },
];
const dinners = [
  { id: "CD-0001", legacyId: "meal-001", number: 1, title: "Salisbury Steak Complete Dinner", entreeRecipeId: "AM-001", sideRecipeIds: ["SD-003", "SD-004"], cuisine: "American", collections: ["Comfort"], status: "approved", hero: { status: "not-started", large: "MEAL-001.webp" } },
  { id: "CD-0002", legacyId: "meal-002", number: 2, title: "Meatloaf Complete Dinner", entreeRecipeId: "AM-007", sideRecipeIds: ["SD-003", "SD-004"], cuisine: "American", collections: ["Comfort"], status: "approved", hero: { status: "approved", large: "MEAL-002.webp", thumbnail: "MEAL-002-thumb.webp" } },
];
const collections = { Comfort: ["CD-0001", "CD-0002"] };

const recipeService = createRecipeService({ recipes });
const completeDinnerService = createCompleteDinnerService({ dinners, recipeService });
const collectionService = createCollectionService({ collections, completeDinnerService });
const recommendationService = createRecommendationService({ completeDinnerService });
const searchService = createSearchService({ recipeService, completeDinnerService, collectionService });
const heroService = createHeroService({ placeholder: "placeholder.webp" });
const validationService = createValidationService({ recipeService, completeDinnerService, collectionService, heroService });

assert.equal(recipeService.get("AM-001").title, "Salisbury Steak");
assert.equal(recipeService.search("mashed")[0].id, "SD-003");
assert.equal(completeDinnerService.get("MEAL-001").id, "CD-0001");
assert.equal(completeDinnerService.resolve("CD-0001").referencesValid, true);
assert.equal(completeDinnerService.byRecipe("SD-003", { role: "side" }).length, 2);
assert.equal(collectionService.get("comfort").dinners.length, 2);
assert.equal(searchService.dinners("salisbury")[0].id, "CD-0001");
assert.equal(recommendationService.relatedDinners("CD-0001")[0].dinner.id, "CD-0002");
assert.equal(heroService.large(dinners[0]), "placeholder.webp");
assert.equal(heroService.large(dinners[1]), "images/dinner-combinations/MEAL-002.webp");
assert.equal(validationService.references().ok, true);
assert.equal(validationService.sideCounts().ok, true);
assert.equal(validationService.collections().ok, true);
assert.equal(validationService.duplicateCompositions().ok, true);
assert.equal(completeDinnerService.listEntrees().length, 2);
assert.equal(completeDinnerService.sideRecommendations("AM-001").length, 2);

console.log("RFIS Platform v1.0 service tests passed");

const canonicalDinner = {
  id: "CD-0003",
  legacyId: "meal-003",
  number: 3,
  hero: {
    status: "approved",
    image: "images/dinner-combinations/meal-003.webp",
    thumbnail: "images/dinner-combinations/meal-003-thumb.webp",
  },
};
const legacyApprovedMeal = {
  id: "meal-004",
  number: 4,
  heroStatus: "approved",
  image: "images/dinner-combinations/meal-004.webp",
  thumbnail: "images/dinner-combinations/meal-004-thumb.webp",
};
const legacyPendingMeal = {
  id: "meal-005",
  number: 5,
  heroStatus: "not-started",
  image: "images/dinner-combinations/meal-005.webp",
};

assert.equal(heroService.approved(canonicalDinner), true);
assert.deepEqual(
  heroService.candidates(canonicalDinner),
  ["images/dinner-combinations/meal-003.webp"]
);
assert.deepEqual(
  heroService.candidates(canonicalDinner, { variant: "thumbnail" }),
  [
    "images/dinner-combinations/meal-003-thumb.webp",
    "images/dinner-combinations/meal-003.webp",
  ]
);
assert.equal(heroService.large(legacyApprovedMeal), "images/dinner-combinations/meal-004.webp");
assert.deepEqual(
  heroService.candidates(legacyPendingMeal),
  [],
  "Pending heroes must never expose legacy image candidates"
);
assert.equal(heroService.fallback(legacyPendingMeal).label, "Meal #5");
assert.equal(heroService.view(legacyPendingMeal).approved, false);

console.log("Hero Service consolidation contracts passed");

const validationSummary = validationService.summary();
assert.equal(validationSummary.dinnerCount, 2);
assert.equal(validationSummary.recipeCount, 4);
assert.equal(validationSummary.results.references.ok, true);
assert.equal(validationSummary.results.duplicateIds.ok, true);
assert.equal(validationSummary.results.sideCounts.ok, true);
assert.equal(validationSummary.results.collections.ok, true);
assert.equal(validationSummary.results.heroes.approved, 1);
assert.equal(validationSummary.results.heroes.pending, 1);
assert.equal(validationSummary.results.heroes.missingCanonicalPath.length, 0);

const invalidDinners = [
  {
    id: "CD-0001",
    legacyId: "meal-001",
    number: 1,
    entreeRecipeId: "AM-001",
    sideRecipeIds: [],
    hero: { status: "approved", layout: "Entrée + two sides" },
  },
  {
    id: "CD-0001",
    legacyId: "meal-001",
    number: 1,
    entreeRecipeId: "MISSING",
    sideRecipeIds: ["SD-003"],
    hero: { status: "approved", layout: "Entrée + two sides" },
  },
];
const invalidDinnerService = createCompleteDinnerService({
  dinners: invalidDinners,
  recipeService,
});
const invalidCollectionService = createCollectionService({
  collections: { Broken: ["CD-0001", "CD-9999"] },
  completeDinnerService: invalidDinnerService,
});
const invalidValidation = createValidationService({
  recipeService,
  completeDinnerService: invalidDinnerService,
  collectionService: invalidCollectionService,
  heroService,
});
const invalidSummary = invalidValidation.summary();
assert.equal(invalidSummary.ok, false);
assert.ok(invalidSummary.issueCount > 0);
assert.equal(invalidSummary.results.duplicateIds.ok, false);
assert.equal(invalidSummary.results.sideCounts.ok, false);
assert.equal(invalidSummary.results.references.ok, false);

console.log("Validation Service consolidation contracts passed");
