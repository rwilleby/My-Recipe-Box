import assert from "node:assert/strict";
import {
  createKosPlatform,
  createMemoryStorage,
} from "../src/kos/index.js";

let minute = 0;
const clock = () => new Date(`2026-08-06T12:${String(minute++).padStart(2, "0")}:00.000Z`);
const storage = createMemoryStorage();
const kos = createKosPlatform({ storage, clock });

kos.actions.cook({
  title: "Crock Pot Beef Stew",
  totalYield: 8,
  eatenNow: 2,
  savedQuantity: 6,
  savedAs: "finished-meal",
});

kos.actions.cook({
  title: "Crock Pot Mac & Cheese",
  totalYield: 12,
  eatenNow: 2,
  savedQuantity: 10,
  savedAs: "component",
});

const recoveryPoints = kos.repository.listRecoveryPoints();
assert.ok(recoveryPoints.length >= 2);
assert.equal(kos.protection.recoveryStatus().automaticRecoveryEnabled, true);

const backup = kos.protection.createExternalBackup();
const verification = kos.protection.verifyExternalBackup(backup);
assert.equal(verification.ok, true);
assert.ok(kos.repository.lastExternalBackupAt());

const tampered = JSON.parse(backup);
tampered.data.inventoryLots[0].quantityAvailable = 999;
assert.equal(
  kos.protection.verifyExternalBackup(JSON.stringify(tampered)).ok,
  false
);

const beforeRestoreCount = kos.inventory.all().length;
kos.repository.reset();
assert.equal(kos.inventory.all().length, 0);
kos.protection.restoreExternalBackup(backup);
assert.equal(kos.inventory.all().length, beforeRestoreCount);

const latest = kos.repository.listRecoveryPoints()[0];
assert.ok(latest);
kos.actions.consume({
  lotId: kos.inventory.all()[0].id,
  quantity: 1,
});
kos.protection.restoreRecoveryPoint(latest.id);
assert.equal(kos.inventory.all().length, beforeRestoreCount);

const unsupported = createKosPlatform({
  storage: createMemoryStorage(),
}).protection;
const unsupportedStatus = await unsupported.storageStatus();
assert.equal(unsupportedStatus.supported, false);

const persistentPlatform = createKosPlatform({
  storage: createMemoryStorage(),
});
const fakeManager = {
  async persisted() { return false; },
  async persist() { return true; },
  async estimate() { return { usage: 1000, quota: 5000 }; },
};
const { createDataProtectionService } = await import("../src/kos/DataProtectionService.js");
const protection = createDataProtectionService({
  repository: persistentPlatform.repository,
  storageManager: fakeManager,
});
assert.equal((await protection.storageStatus()).quota, 5000);
assert.equal((await protection.requestPersistentStorage()).granted, true);

console.log("KOS-135 Data Protection and Recovery contracts passed");
