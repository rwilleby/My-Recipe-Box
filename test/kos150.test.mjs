import assert from "node:assert/strict";
import { createKosPlatform, createMemoryStorage } from "../src/kos/index.js";

let tick = 0;
const clock = () => new Date(`2026-08-${String(1 + tick++).padStart(2, "0")}T12:00:00.000Z`);
const kos = createKosPlatform({ storage: createMemoryStorage(), clock });

kos.actions.cook({ title: "Beef Stew", totalYield: 8, eatenNow: 2, savedQuantity: 6, savedAs: "finished-meal" });
kos.actions.cook({ title: "Mac & Cheese", totalYield: 10, savedQuantity: 10, savedAs: "component" });

const entries = kos.timeline.entries();
assert.ok(entries.length >= 2);
assert.equal(kos.timeline.days().length >= 2, true);
assert.equal(kos.timeline.summary().productionCount, 2);
console.log("KOS-150 Timeline contracts passed");
