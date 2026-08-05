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
const validationService = createValidationService({ recipeService, completeDinnerService, collectionService });

assert.equal(recipeService.get("AM-001").title, "Salisbury Steak");
assert.equal(recipeService.search("mashed")[0].id, "SD-003");
assert.equal(completeDinnerService.get("MEAL-001").id, "CD-0001");
assert.equal(completeDinnerService.resolve("CD-0001").referencesValid, true);
assert.equal(completeDinnerService.byRecipe("SD-003", { role: "side" }).length, 2);
assert.equal(collectionService.get("comfort").dinners.length, 2);
assert.equal(searchService.dinners("salisbury")[0].id, "CD-0001");
assert.equal(recommendationService.relatedDinners("CD-0001")[0].dinner.id, "CD-0002");
assert.equal(heroService.large(dinners[0]), "placeholder.webp");
assert.equal(heroService.large(dinners[1]), "MEAL-002.webp");
assert.equal(validationService.references().ok, true);
assert.equal(validationService.sideCounts().ok, true);
assert.equal(validationService.collections().ok, true);
assert.equal(validationService.duplicateCompositions().ok, true);
assert.equal(completeDinnerService.listEntrees().length, 2);
assert.equal(completeDinnerService.sideRecommendations("AM-001").length, 2);

console.log("RFIS Platform v1.0 service tests passed");

const unifiedSearch = searchService.all("Comfort", { recipeLimit: 50, dinnerLimit: 50 });
assert.ok(Array.isArray(unifiedSearch.recipes));
assert.ok(Array.isArray(unifiedSearch.dinners));
assert.ok(Array.isArray(unifiedSearch.collections));
assert.ok(unifiedSearch.collections.some((collection) => collection.name === "Comfort"));

const codeSearch = searchService.all("MEAL-001");
assert.ok(codeSearch.dinners.some((dinner) => dinner.legacyId === "meal-001"));

const sideSearch = searchService.all("Green Beans");
assert.ok(sideSearch.recipes.some((recipe) => recipe.id === "SD-004"));
assert.ok(sideSearch.dinners.length > 0);

console.log("Unified search contracts passed");
