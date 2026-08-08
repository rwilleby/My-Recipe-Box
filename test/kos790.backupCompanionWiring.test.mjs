import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

for (const token of [
  "function KosCompanionStatusBand",
  'data-kos-ui="kitchen-companion-status"',
  '<KosCompanionStatusBand kosUi={kosUi} />',
  "kosUi?.backupStatus?.()",
  "automaticRecoveryEnabled",
  'data-kos-ui="backup-status"',
  "Automatic recovery stays in this browser",
  "external.status",
]) {
  assert.ok(app.includes(token), `Missing backup/companion KOS wiring: ${token}`);
}

console.log("KOS-790 Backup/Companion UI wiring contracts passed");
