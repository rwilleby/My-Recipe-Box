import assert from "node:assert/strict";
import { createKosPlatform, createMemoryStorage } from "../src/kos/index.js";
const kos = createKosPlatform({ storage: createMemoryStorage() });
for (let i = 0; i < 3; i += 1) {
  kos.actions.cook({ title: "Beef Stew", recipeId: "CP-001", totalYield: 8, eatenNow: 2, savedQuantity: 6, savedAs: "finished-meal" });
}
const patterns = kos.memory.productionPatterns();
assert.equal(patterns.length, 1);
assert.equal(patterns[0].occurrences, 3);
assert.equal(patterns[0].averageYield, 8);
assert.equal(kos.memory.repeatSuggestion("CP-001").suggestedYield, 8);
console.log("KOS-160 Kitchen Memory contracts passed");
