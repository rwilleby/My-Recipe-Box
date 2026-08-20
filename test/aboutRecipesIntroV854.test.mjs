import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");

const start = source.indexOf("function AboutRecipesPage");
const end = source.indexOf("function ", start + 9);
const page = source.slice(start, end);

assert.ok(start >= 0, "About Our Recipes page should exist");
assert.match(page, /<SectionIntro/);
assert.match(page, /className="aboutRecipesSectionIntro"/);
assert.match(page, /title="AI-assisted, directed by me"/);
assert.match(page, /text="The recipes are generated with the assistance of artificial intelligence/);
assert.doesNotMatch(page, /<article className="aboutRecipesCard">\s*<h2>AI-assisted, directed by me<\/h2>/);
assert.match(css, /\.aboutRecipesSectionIntro \{margin: 0 auto var\(--rrb-section-intro-bottom-gap, 18px\) !important;\}/);

console.log("About Our Recipes uses the centered established section-intro style.");
