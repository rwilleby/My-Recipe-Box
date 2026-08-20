import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");

const start = source.indexOf("function YourDataSecurityPage");
const end = source.indexOf("function ", start + 9);
const page = source.slice(start, end);

assert.ok(start >= 0, "Your Data & Security page should exist");
assert.doesNotMatch(page, /YOUR INFORMATION/);
assert.match(page, /<SectionIntro/);
assert.match(page, /className="yourDataSecurityIntro"/);
assert.match(page, /title="Your recipe-box information stays in your browser\."/);
assert.match(page, /Robert's Recipe Box does not require a user account/);
assert.match(css, /\.yourDataSecurityIntro \{margin: 0 auto var\(--rrb-section-intro-bottom-gap, 18px\) !important;\}/);

console.log("Your Data & Security uses the centered established section-intro style.");
