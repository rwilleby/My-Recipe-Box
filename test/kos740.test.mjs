import assert from "node:assert/strict";
import {
  createKosPlatform,
  createKosUiController,
  createMemoryStorage,
} from "../src/kos/index.js";

let now = new Date("2026-08-08T12:00:00.000Z");
const clock = () => new Date(now);
const storage = createMemoryStorage();

const kos = createKosPlatform({
  storage,
  clock,
});

const initial = kos.backupStatus.summary();
assert.equal(initial.external.status, "never-backed-up");
assert.equal(initial.external.due, true);
assert.equal(initial.recovery.automaticRecoveryEnabled, true);

const backupText = kos.protection.createExternalBackup();
const verification = kos.backupStatus.verifyBackup(backupText);
assert.equal(verification.ok, true);

const current = kos.backupStatus.summary();
assert.equal(current.external.status, "current");
assert.equal(current.external.due, false);

now = new Date("2026-08-25T12:00:00.000Z");
const overdue = kos.backupStatus.summary();
assert.equal(overdue.external.status, "backup-due");
assert.equal(overdue.external.due, true);

kos.protection.createRecoveryPoint("manual-test");
const points = kos.backupStatus.restorePoints();
assert.ok(points.length >= 1);
assert.equal(points[0].reason, "manual-test");

const ui = createKosUiController(kos);
assert.equal(ui.backupStatus().external.status, "backup-due");
assert.equal(ui.snapshot().backup.external.status, "backup-due");

console.log("KOS-740 Backup Status contracts passed");
