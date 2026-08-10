import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

assert.ok(app.includes('const WELCOME_TOUR_VIDEO_URL = "videos/welcome-video.mp4";'));
assert.ok(!app.includes("app.heygen.com/embeds/"));
assert.ok(app.includes("<video"));
assert.ok(app.includes("controls"));
assert.ok(app.includes("autoPlay"));
assert.ok(app.includes("playsInline"));
assert.ok(app.includes('preload="metadata"'));
assert.ok(css.includes(".homeWelcomeTourVideo video {"));

console.log("Local GitHub Welcome video contracts passed");
