import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const rotations = fs.readFileSync(new URL("../src/features/home/HomeMealRotations.jsx", import.meta.url), "utf8");
const ribbon = fs.readFileSync(new URL("../src/components/KitchenReminderRibbon.jsx", import.meta.url), "utf8");

test("homepage uses the requested content order and homepage-only navigation cleanup", () => {
  const home = app.slice(app.indexOf("function Home({"), app.indexOf("const RFIS_ADMIN_SECTIONS"));
  assert.ok(home.indexOf("<HomePhotoFeatureSection") < home.indexOf("<HomeComboMealStrip"));
  assert.ok(home.indexOf("<HomeComboMealStrip") < home.indexOf("<HomeDietMealStrip"));
  assert.doesNotMatch(app.slice(app.indexOf("function Hero("), app.indexOf("const HOME_PHOTO_FEATURES")), /homeUnderConstructionStamp/);
  assert.match(rotations, /title="Or maybe a Diet Meal\?"/);
  assert.match(app, /const showSequenceButtons = activePage !== "Home"/);
  assert.match(app, /\{showSequenceButtons && \(\s*<button[\s\S]*?pageSequencePrev/);
  assert.match(app, /\{showSequenceButtons && \(\s*<button[\s\S]*?pageSequenceNext/);
});

test("backup warnings wait for custom user information", () => {
  assert.match(app, /CUSTOM_USER_INFORMATION_MARKER_KEY/);
  assert.match(app, /backupWarningsEnabled && \(backupReminderStatus\.hasNeverBackedUp \|\| backupReminderStatus\.isDue\)/);
  assert.match(app, /\{hasCustomUserData && \(\s*<BackupReminderPanel/);
  assert.match(app, /enableBackupWarnings=\{hasCustomUserData\}/);
  assert.match(ribbon, /enableBackupWarnings = false/);
  assert.match(ribbon, /backup: enableBackupWarnings \? backup : \{ \.\.\.backup, due: false, isDue: false \}/);
});
