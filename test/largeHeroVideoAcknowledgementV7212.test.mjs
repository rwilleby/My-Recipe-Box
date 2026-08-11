import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

for (const token of [
  'const LARGE_HERO_VIDEO_ACKNOWLEDGED_PREFIX = "rrb-large-hero-video-acknowledged:";',
  "window.localStorage.getItem(acknowledgedKey)",
  "if (!isAcknowledged)",
  'window.localStorage.setItem(acknowledgedKey, "true")',
  "function acknowledgeVideo()",
  "function closeWindow({ acknowledge = true } = {})",
  "acknowledgeVideo();",
  "closeWindow({ acknowledge: false })",
  "onClick={() => closeWindow({ acknowledge: true })}",
  "window.setTimeout(() => {",
  "}, 800);",
]) {
  assert.ok(app.includes(token), `Missing v72.12 acknowledgement token: ${token}`);
}

assert.ok(
  !app.includes('window.localStorage.setItem(seenKey, "true")'),
  "Opening the video must no longer mark it as completed/seen"
);

assert.ok(
  !app.includes("LARGE_HERO_VIDEO_SEEN_PREFIX"),
  "Old shown-once storage model must be removed"
);

console.log("v72.12 Large Hero acknowledgement contracts passed");
