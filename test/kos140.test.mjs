import assert from "node:assert/strict";
import {
  createKosPlatform,
  createMemoryStorage,
} from "../src/kos/index.js";
import { createRfisPlatform } from "../src/services/createRfisPlatform.js";

const recipes = [
  { id: "AM-001", title: "Grilled Chicken Breast", category: "American" },
  { id: "SD-001", title: "Mac & Cheese", category: "Side Dish" },
  { id: "SD-002", title: "Green Beans", category: "Side Dish" },
  { id: "LF-001", title: "White Bread", category: "Bread" },
];

const dinners = [
  {
    id: "CD-0001",
    legacyId: "meal-001",
    number: 1,
    title: "Chicken, Mac & Green Beans",
    status: "approved",
    cuisine: "American",
    entreeRecipeId: "AM-001",
    sideRecipeIds: ["SD-001", "SD-002"],
    collections: ["Freezer Friendly"],
    hero: {
      status: "approved",
      image: "images/dinner-combinations/meal-001.webp",
      layout: "Entrée + two sides",
    },
  },
];

const rfisPlatform = createRfisPlatform({
  recipes,
  dinners,
  collections: { "Freezer Friendly": ["CD-0001"] },
});

const kos = createKosPlatform({
  storage: createMemoryStorage(),
  clock: () => new Date("2026-08-06T12:00:00.000Z"),
  rfisPlatform,
});

assert.equal(kos.assistant.suggestions()[0].id, "record-cooking");

kos.rfis.cookRecipe({
  recipeId: "AM-001",
  totalYield: 6,
  savedQuantity: 6,
  savedAs: "component",
  storageLocation: "refrigerator",
});
kos.rfis.cookRecipe({
  recipeId: "SD-001",
  totalYield: 8,
  savedQuantity: 8,
  savedAs: "component",
  storageLocation: "refrigerator",
});
kos.rfis.cookRecipe({
  recipeId: "SD-002",
  totalYield: 6,
  savedQuantity: 6,
  savedAs: "component",
  storageLocation: "refrigerator",
});
kos.rfis.cookRecipe({
  recipeId: "LF-001",
  totalYield: 4,
  savedQuantity: 4,
  savedAs: "component",
  savedName: "Older White Bread",
  storageLocation: "pantry",
});

const suggestions = kos.assistant.suggestions({ limit: 20 });
const dinnerSuggestion = suggestions.find((item) => item.id === "build-CD-0001");
assert.ok(dinnerSuggestion);
assert.equal(dinnerSuggestion.metadata.capacity, 6);
assert.match(dinnerSuggestion.title, /could build/);

const recovery = suggestions.find((item) => item.kind === "recover");
assert.ok(recovery);
assert.ok(recovery.metadata.ideas.includes("Bread Pudding"));

const packaging = suggestions.find((item) => item.id === "packaging-opportunity");
assert.ok(packaging);

const languageCheck = kos.assistant.validateLanguage();
assert.equal(languageCheck.ok, true);
assert.equal(languageCheck.violations.length, 0);

const summary = kos.assistant.summary();
assert.ok(summary.headline.length > 0);
assert.ok(summary.counts.components >= 24);
assert.ok(Object.isFrozen(summary));
assert.ok(Object.isFrozen(summary.suggestions));

console.log("KOS-140 Kitchen Assistant Engine contracts passed");
