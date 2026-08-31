import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const release = readJson("release.json");
const packageJson = readJson("package.json");
const packageLock = readJson("package-lock.json");
const sourcePackage = readJson("src/package.json");
const changelog = readFileSync("CHANGELOG.md", "utf8");
const viteConfig = readFileSync("vite.config.js", "utf8");

assert.equal(release.version, "95.9.0");
assert.equal(release.label, "v95.9");
assert.equal(release.archive, "My-Recipe-Box-v95.9.zip");
assert.equal(packageJson.version, release.version);
assert.equal(packageLock.version, release.version);
assert.equal(packageLock.packages[""].version, release.version);
assert.equal(sourcePackage.version, release.version);
assert.ok(changelog.startsWith(`# ${release.label} `));
assert.match(viteConfig, /import release from "\.\/release\.json"/);
assert.match(viteConfig, /__APP_VERSION__/);

console.log("Current release version and changelog contracts passed.");
