import assert from "node:assert/strict";
import {
  createKosPlatform,
  createMemoryStorage,
} from "../src/kos/index.js";
import { createRfisPlatform } from "../src/services/createRfisPlatform.js";

const recipes = [
  {
    id: "AM-001",
    title: "Grilled Chicken Breast",
    category: "American",
    cookingMethods: ["grill"],
  },
  {
    id: "SD-001",
    title: "Mac & Cheese",
    category: "Side Dish",
    cookingMethods: ["slow cooker"],
  },
  {
    id: "SD-002",
    title: "Green Beans",
    category: "Side Dish",
  },
];

const dinners = [
  {
    id: "CD-0001",
    legacyId: "meal-001",
    number: 1,
    title: "Chicken Mac & Green Beans",
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
  collections: {
    "Freezer Friendly": ["CD-0001"],
  },
});

const kos = createKosPlatform({
  storage: createMemoryStorage(),
  clock: () => new Date("2026-08-06T12:00:00.000Z"),
  rfisPlatform,
});

assert.ok(kos.rfis);
assert.equal(kos.rfis.recipe("AM-001").name, "Grilled Chicken Breast");
assert.equal(kos.rfis.dinner("meal-001").id, "CD-0001");

const chicken = kos.rfis.cookRecipe({
  recipeId: "AM-001",
  totalYield: 8,
  eatenNow: 2,
  savedQuantity: 6,
  savedAs: "component",
  storageLocation: "refrigerator",
}).outputLots[0];

const mac = kos.rfis.cookRecipe({
  recipeId: "SD-001",
  totalYield: 10,
  savedQuantity: 10,
  savedAs: "component",
  storageLocation: "refrigerator",
}).outputLots[0];

const beans = kos.rfis.cookRecipe({
  recipeId: "SD-002",
  totalYield: 8,
  savedQuantity: 8,
  savedAs: "component",
  storageLocation: "refrigerator",
}).outputLots[0];

const availability = kos.rfis.availabilityForRecipe("AM-001");
assert.equal(availability.quantityAvailable, 6);

const plan = kos.rfis.assemblyPlan("CD-0001", {
  quantity: 6,
});
assert.equal(plan.canBuild, true);
assert.equal(plan.components.length, 3);

const built = kos.rfis.buildCompleteDinner({
  dinnerId: "meal-001",
  quantity: 6,
  componentLots: [
    {
      lotId: chicken.id,
      recipeId: "AM-001",
      quantityPerMeal: 1,
    },
    {
      lotId: mac.id,
      recipeId: "SD-001",
      quantityPerMeal: 1,
    },
    {
      lotId: beans.id,
      recipeId: "SD-002",
      quantityPerMeal: 1,
    },
  ],
});
assert.equal(built.rfisDinner.id, "CD-0001");
assert.equal(built.outputLots[0].quantityAvailable, 6);
assert.equal(built.outputLots[0].completeDinnerId, "CD-0001");

const emptyKos = createKosPlatform({
  storage: createMemoryStorage(),
});
assert.equal(emptyKos.rfis, null);

console.log("KOS-130 RFIS Bridge contracts passed");
