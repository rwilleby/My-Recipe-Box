import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const checkOnly = process.argv.includes("--check");
const release = JSON.parse(readFileSync(resolve("release.json"), "utf8"));
const targets = ["package.json", "package-lock.json", "src/package.json"];
const semverPattern = /^\d+\.\d+\.\d+$/;

if (!semverPattern.test(release.version)) {
  throw new Error(`release.json version must be semantic (x.y.z): ${release.version}`);
}
const expectedLabel = `v${release.version.replace(/\.0\.0$/, "").replace(/\.0$/, "")}`;
if (release.label !== expectedLabel) {
  throw new Error("release.json label must match its semantic version");
}
if (release.archive !== `My-Recipe-Box-${release.label}.zip`) {
  throw new Error("release.json archive must match its release label");
}

const mismatches = [];
for (const target of targets) {
  const path = resolve(target);
  const document = JSON.parse(readFileSync(path, "utf8"));
  const values = target === "package-lock.json"
    ? [document.version, document.packages?.[""]?.version]
    : [document.version];

  if (values.some((value) => value !== release.version)) mismatches.push(target);
  if (!checkOnly && mismatches.includes(target)) {
    document.version = release.version;
    if (target === "package-lock.json") document.packages[""].version = release.version;
    writeFileSync(path, `${JSON.stringify(document, null, 2)}\n`);
  }
}

if (checkOnly && mismatches.length) {
  throw new Error(`Version mirrors do not match release.json: ${mismatches.join(", ")}`);
}

const changelog = readFileSync(resolve("CHANGELOG.md"), "utf8");
if (!changelog.startsWith(`# ${release.label} `)) {
  throw new Error(`CHANGELOG.md must begin with the current release: ${release.label}`);
}

console.log(`${checkOnly ? "Verified" : "Synchronized"} ${release.label} release metadata.`);
