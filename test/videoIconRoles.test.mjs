import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const roles = fs.readFileSync("src/data/videoIconRoles.js", "utf8");
const component = fs.readFileSync("src/components/VideoIcon.jsx", "utf8");

assert.ok(app.includes('const VIDEO_ICON_MAIN = "images/icons/video-red.webp";'));
assert.ok(app.includes('const VIDEO_ICON_SUPPLEMENTAL = "images/icons/video-gray.webp";'));
assert.ok(app.includes('src={`${import.meta.env.BASE_URL}${VIDEO_ICON_MAIN}`}'));

assert.ok(roles.includes('asset: "images/icons/video-red.webp"'));
assert.ok(roles.includes('asset: "images/icons/video-gray.webp"'));

assert.ok(component.includes('main: "images/icons/video-red.webp"'));
assert.ok(component.includes('supplemental: "images/icons/video-gray.webp"'));
assert.ok(component.includes('role = "supplemental"'));

console.log("Video icon role contracts passed");
