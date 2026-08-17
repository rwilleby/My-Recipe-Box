import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildKitchenReminders } from "../src/utils/kitchenReminderEngine.js";

const now = new Date(2026, 7, 17, 12, 0, 0).getTime();
const reminders = buildKitchenReminders({
  now,
  backup: { due: true, lastBackupAt: "2026-08-01T12:00:00.000Z" },
  plan: {},
  weekendPlan: { items: [{ uid: "one", completed: false }, { uid: "two", completed: true }] },
  refrigerator: {
    items: {
      milk: { inFridge: true, useByDate: "2026-08-19" },
      unused: { inFridge: false, useByDate: "2026-08-18" },
    },
  },
  freezer: {
    items: { fajitas: { onHand: true, useByDate: "2026-09-10" } },
  },
  preparedInventory: {
    managedItems: [{ id: "meal-029", packagesAvailable: 8, useByDate: "2026-09-12" }],
    records: [{ id: "empty", packagesAvailable: 0, useByDate: "2026-08-20" }],
  },
});

assert.equal(reminders[0].id, "backup-due", "backup should be the highest priority reminder");
assert.match(reminders.find((item) => item.id === "refrigerator-use-soon").message, /^1 refrigerator item is/);
assert.match(reminders.find((item) => item.id === "freezer-use-soon").message, /^2 frozen items have/);
assert.match(reminders.find((item) => item.id === "weekend-bulk-unfinished").message, /^1 planned batch is/);
assert.equal(reminders.find((item) => item.id === "meal-plan-empty").page, "Meal Planner");

const component = await readFile(new URL("../src/components/KitchenReminderRibbon.jsx", import.meta.url), "utf8");
const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const bulkPlanner = await readFile(new URL("../src/components/WeekendBulkMealPlanner.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/components/KitchenReminderRibbon.css", import.meta.url), "utf8");

assert.match(component, /aria-live="polite"/);
assert.match(component, /onMouseEnter/);
assert.match(component, /onFocus/);
assert.match(component, /kitchenReminderTextAction/);
assert.match(component, /aria-hidden="true">›/);
assert.match(component, /setFading\(true\)/);
assert.match(component, /setFading\(false\)/);
assert.doesNotMatch(component, /Pause reminders|Previous reminder|Next reminder/);
assert.doesNotMatch(component, /Remind Me Tomorrow|Hide for This Visit/);
assert.ok(app.indexOf("<KitchenReminderRibbon") > app.indexOf("<Header"));
assert.ok(app.indexOf("<KitchenReminderRibbon") < app.indexOf("<HomeMealJourneyAccordion"));
assert.match(bulkPlanner, /rrb:weekend-bulk-plan-updated/);
assert.match(css, /height: \.25in/);
assert.match(css, /width: 90%/);
assert.match(css, /width: 96%/);
assert.match(css, /background: #f1eadd/);
assert.match(css, /font-style: italic/);
assert.match(css, /text-align: center/);
assert.match(css, /white-space: nowrap/);
assert.match(css, /font-size: \.92em/);
assert.match(css, /transition: opacity 325ms ease-in-out/);
assert.match(css, /\.kitchenReminderMessage\.isFading \{ opacity: 0/);
assert.doesNotMatch(css, /flex-direction: column|flex-wrap: wrap/);
assert.match(css, /@media \(max-width: 640px\)/);
assert.match(css, /@media print/);

console.log("Kitchen Reminder Ribbon v82.2 tests passed.");
