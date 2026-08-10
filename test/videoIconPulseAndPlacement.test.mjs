import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

assert.ok(app.includes('import VideoIcon from "./components/VideoIcon";'));

for (const phrase of [
  "Looking for quick dinner ideas?",
  "What do you want to do today?",
]) {
  assert.ok(app.includes(phrase), `Missing heading: ${phrase}`);
}

const supplementalUses =
  (app.match(/<VideoIcon role="supplemental" alt="" \/>/g) || []).length;
assert.equal(supplementalUses, 2, "Expected two gray supplemental video icons");

const marker =
  "/* v72.4 — video icon pulse + supplemental section-title icons */";
const index = css.lastIndexOf(marker);
assert.ok(index >= 0);

const finalCss = css.slice(index);

for (const token of [
  "@keyframes rrbVideoPulseMain",
  "@keyframes rrbVideoPulseSupplemental",
  "animation: rrbVideoPulseMain 4.6s ease-in-out infinite !important;",
  "animation: rrbVideoPulseSupplemental 5.4s ease-in-out infinite !important;",
  ".homeVideoTitle",
  ".supplementalVideoIcon",
  "@media (prefers-reduced-motion: reduce)",
]) {
  assert.ok(finalCss.includes(token), `Missing pulse/placement token: ${token}`);
}

console.log("Video icon pulse and supplemental placement contracts passed");
