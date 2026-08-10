import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync("src/App.css", "utf8");

const marker =
  "/* v72.6 — locked B Double Heartbeat pulse for all video icons */";
const index = css.lastIndexOf(marker);

assert.ok(index >= 0, "v72.6 heartbeat standard CSS missing");

const finalCss = css.slice(index);

for (const token of [
  "@keyframes rrbVideoDoubleHeartbeat",
  "68% {",
  "transform: scale(1.13);",
  "73% {",
  "transform: scale(1.02);",
  "79% {",
  "transform: scale(1.12);",
  "85% {",
  "animation: rrbVideoDoubleHeartbeat 3.7s ease-in-out infinite !important;",
  ".homeWelcomeTourIconButton::before",
  "content: none !important;",
  ".supplementalVideoIcon",
  "@media (prefers-reduced-motion: reduce)",
]) {
  assert.ok(finalCss.includes(token), `Missing heartbeat token: ${token}`);
}

console.log("Locked B Double Heartbeat video icon standard passed");
