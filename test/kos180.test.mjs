import assert from "node:assert/strict";
import { createKosPlatform, createMemoryStorage } from "../src/kos/index.js";
const kos = createKosPlatform({ storage: createMemoryStorage() });
for (let i = 0; i < 2; i += 1) {
  kos.actions.cook({ title: "Chili", totalYield: 8, eatenNow: 2, savedQuantity: 6, savedAs: "finished-meal" });
}
kos.templates.save({ title: "Soup Day", steps: [{ action: "cook", title: "Chili" }] });
const opportunities = kos.opportunities.list({ limit: 20 });
assert.ok(opportunities.some((item) => item.kind === "repeat"));
assert.ok(opportunities.some((item) => item.kind === "template"));
assert.ok(kos.opportunities.dashboard().timeline.length > 0);
console.log("KOS-180 Opportunity contracts passed");
