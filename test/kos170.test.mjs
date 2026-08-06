import assert from "node:assert/strict";
import { createKosPlatform, createMemoryStorage } from "../src/kos/index.js";
const kos = createKosPlatform({ storage: createMemoryStorage() });
const template = kos.templates.save({
  title: "Weekend Smoke",
  tags: ["smoker", "batch"],
  steps: [
    { action: "cook", title: "Smoke Brisket", defaults: { savedAs: "component" } },
    { action: "cook", title: "Smoke Chicken", defaults: { savedAs: "component" } },
  ],
});
assert.equal(kos.templates.all().length, 1);
assert.equal(kos.templates.instantiate(template.id).steps.length, 2);
assert.equal(kos.templates.remove(template.id).id, template.id);
assert.equal(kos.templates.all().length, 0);
console.log("KOS-170 Production Template contracts passed");
