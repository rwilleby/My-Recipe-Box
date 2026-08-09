import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

for (const token of [
  "https://app.heygen.com/embeds/bb3981cd39304a75a7eec52bf223755c",
  "rrb-welcome-tour-dismissed",
  "rrb-welcome-tour-shown-this-session",
  "Play Now",
  "Maybe Later",
  "Hide This",
  "images/icons/VIDEO.webp",
  "homeWelcomeTourIconButton",
  "rrb:open-welcome-tour",
  "allowFullScreen",
  "WelcomeTour",
]) {
  assert.ok(app.includes(token), `Missing welcome-tour contract token: ${token}`);
}

assert.ok(app.includes('event.key !== "Escape"'), "The welcome tour must close with Escape");
assert.ok(app.includes("window.localStorage.setItem(WELCOME_TOUR_DISMISSED_KEY"), "Don't Show Again must persist locally");
assert.ok(app.includes("window.sessionStorage.setItem(WELCOME_TOUR_SESSION_KEY"), "Automatic display must be limited to once per browsing session");
assert.ok(!app.includes('allow="autoplay;'), "The embedded tour must not request autoplay permission");
assert.ok(css.includes("aspect-ratio: 16 / 9"), "The video must preserve a 16:9 aspect ratio");
assert.ok(css.includes("scale(1.18)"), "The embedded video must use the approved centered crop");
assert.ok(css.includes("@media (max-width: 760px)"), "The tour must include a tablet/mobile layout");
assert.ok(css.includes("#4e279b"), "The welcome-video controls must use the video icon purple");
assert.ok(css.includes(".homeWelcomeTourIconButton:focus-visible"), "The video icon control must have a visible keyboard focus state");
assert.ok(!app.includes("Watch Welcome Video"), "The old text reopen button must be removed");

console.log("v70g welcome tour icon contracts passed");
