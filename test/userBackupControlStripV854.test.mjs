import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const component = fs.readFileSync(
  path.join(root, "src/components/UserDataBackupSection.jsx"),
  "utf8"
);
const css = fs.readFileSync(
  path.join(root, "src/components/UserDataBackupSection.css"),
  "utf8"
);
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");

const orderedLabels = [
  "BACKUP MY RECIPE BOX",
  "RESTORE MY RECIPE BOX",
  "EXTERNAL BACKUP",
  "RECOVERY POINTS",
  "AUTOMATIC RECOVERY",
  "REMINDER",
];

let previous = -1;
for (const label of orderedLabels) {
  const index = component.indexOf(label);
  assert.ok(index > previous, `${label} should appear in the requested control-strip order`);
  previous = index;
}

assert.match(component, /Your Recipe Box Data Is/);
assert.doesNotMatch(component, /YOUR RECIPE BOX DATA IS/);
assert.equal((component.match(/userDataTitleHeart/g) || []).length, 3);
assert.match(component, /rrbSectionIntroComponent isCentered/);
assert.match(component, /className="userDataControlStrip"/);
assert.match(css, /grid-template-columns: repeat\(6, minmax\(0, 1fr\)\)/);
assert.doesNotMatch(app.slice(app.indexOf('activePage === "User Backup"'), app.indexOf('activePage === "Storage Organization"')), /preparedInventorySummary/);
assert.match(app, /backupStatus=\{kosUi\.backupStatus\(\)\}/);

console.log("Backup & Restore uses the centered intro and ordered six-part control strip.");
