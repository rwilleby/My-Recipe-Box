import assert from "node:assert/strict";
import {
  createKosPlatform,
  createMemoryStorage,
} from "../src/kos/index.js";

let now = new Date("2026-08-08T12:00:00.000Z");
const clock = () => new Date(now);
const storage = createMemoryStorage();

const kos = createKosPlatform({
  storage,
  clock,
});

const recipe = {
  id: "AM-900",
  title: "Test Chicken",
  instructions: [
    "Season the chicken.",
    "Cook until browned.",
    "Rest five minutes.",
  ],
};

const session = kos.cookingSessions.start({ recipe });
assert.equal(session.title, "Test Chicken");
assert.equal(session.steps.length, 3);
assert.equal(session.currentStep.text, "Season the chicken.");

const afterStep = kos.cookingSessions.completeStep();
assert.equal(afterStep.completedStepIds.length, 1);
assert.equal(afterStep.currentStepIndex, 1);

kos.cookingSessions.addNote("Use less salt next time.");
assert.equal(kos.cookingSessions.current().notes.length, 1);

const timer = kos.cookingSessions.startTimer({
  seconds: 300,
  label: "Rest chicken",
});
assert.equal(timer.remainingSeconds, 300);
assert.equal(timer.status, "running");

now = new Date("2026-08-08T12:02:00.000Z");
assert.equal(kos.timers.get(timer.id).remainingSeconds, 180);

const paused = kos.timers.pause(timer.id);
assert.equal(paused.status, "paused");
assert.equal(paused.remainingSeconds, 180);

now = new Date("2026-08-08T12:10:00.000Z");
assert.equal(kos.timers.get(timer.id).remainingSeconds, 180);

kos.timers.resume(timer.id);
now = new Date("2026-08-08T12:13:00.000Z");
assert.equal(kos.timers.get(timer.id).expired, true);

const recipeCard = kos.companion.recipeCard();
assert.equal(recipeCard.title, "Test Chicken");
assert.equal(recipeCard.stepCount, 3);
assert.equal(recipeCard.completedStepCount, 1);

const secondKos = createKosPlatform({
  storage,
  clock,
});
assert.equal(
  secondKos.cookingSessions.current().title,
  "Test Chicken"
);
assert.equal(secondKos.companion.home().activeRecipe.title, "Test Chicken");

const completed = secondKos.cookingSessions.finish();
assert.equal(completed.status, "completed");
assert.equal(secondKos.cookingSessions.current(), null);

console.log("KOS-240 Kitchen Companion contracts passed");
