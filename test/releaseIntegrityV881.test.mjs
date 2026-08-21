import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageJson = JSON.parse(read("package.json"));
const packageLock = JSON.parse(read("package-lock.json"));
const sourcePackage = JSON.parse(read("src/package.json"));
const manifest = JSON.parse(read("UPDATE-MANIFEST-v88.1.json"));
const workflow = read(".github/workflows/main.yml");
const appSource = read("src/App.jsx");

assert.equal(packageJson.version, "88.1.0");
assert.equal(packageLock.version, "88.1.0");
assert.equal(packageLock.packages[""].version, "88.1.0");
assert.equal(sourcePackage.version, "88.1.0");
assert.equal(manifest.version, "88.1");
assert.equal(manifest.baseline, "My-Recipe-Box-v88.1.zip");

const testStep = workflow.indexOf("npm run test:all");
const buildStep = workflow.indexOf("npm run build");
assert.ok(testStep >= 0, "CI must run the complete test suite");
assert.ok(buildStep > testStep, "CI tests must run before the production build");
assert.match(appSource, /features\/info-pages\/PlaceholderInfoPage\.jsx/);
assert.match(appSource, /data\/pagePopupCopy\.js/);
assert.doesNotMatch(appSource, /function PlaceholderInfoPage\s*\(/);
assert.doesNotMatch(appSource, /const PAGE_POPUP_COPY\s*=\s*\{/);

console.log("v88.1 release integrity contract passed.");
