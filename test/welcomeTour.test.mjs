import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

for (const token of [
  "https://app.heygen.com/embeds/bb3981cd39304a75a7eec52bf223755c",
  "rrb-welcome-tour-dismissed",
  "rrb-welcome-tour-shown-this-session",
  "Watch the Tour",
  "Maybe Later",
  "Don’t Show Again",
  "Watch Website Tour",
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
assert.ok(css.includes("@media (max-width: 760px)"), "The tour must include a tablet/mobile layout");
assert.ok(css.includes(".homeWelcomeTourReopen:focus-visible"), "The reopen control must have a visible keyboard focus state");

console.log("v70e welcome tour contracts passed");
