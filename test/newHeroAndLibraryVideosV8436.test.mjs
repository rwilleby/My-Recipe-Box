import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const items = fs.readFileSync(new URL("../src/features/video-library/videoLibraryItems.js", import.meta.url), "utf8");
const root = new URL("..", import.meta.url);

assert.match(app, /const MASTER_KITCHEN_INVENTORY_VIDEO_URL = "videos\/master-kitchen-inventory\.mp4";/);
assert.match(app, /title="Your Kitchen Inventory"[\s\S]*videoSrc=\{MASTER_KITCHEN_INVENTORY_VIDEO_URL\}[\s\S]*videoPoster=\{MASTER_KITCHEN_INVENTORY_VIDEO_POSTER\}/);
assert.match(app, /title="Your Grocery List"[\s\S]*videoSrc=\{SHOPPING_LIST_VIDEO_URL\}[\s\S]*videoPoster=\{SHOPPING_LIST_VIDEO_POSTER\}/);

const welcomeIndex = items.indexOf('availableVideo("welcome-recipe-box"');
const startingIndex = items.indexOf('availableVideo("starting-fast-or-slow"');
const easyIndex = items.indexOf('availableVideo("easy-detailed"');
assert.ok(welcomeIndex >= 0 && startingIndex > welcomeIndex && easyIndex > startingIndex, "Starting Fast or Slow must be Video 02");
assert.match(items, /availableVideo\("master-inventory"[\s\S]*"master-kitchen-inventory"/);
assert.match(items, /availableVideo\("grocery-list"[\s\S]*"shopping-list"/);

for (const relative of [
  "public/videos/master-kitchen-inventory.mp4",
  "public/videos/shopping-list.mp4",
  "public/videos/starting-fast-or-slow.mp4",
  "public/images/video-posters/library/master-kitchen-inventory.webp",
  "public/images/video-posters/library/shopping-list.webp",
  "public/images/video-posters/library/starting-fast-or-slow.webp",
]) {
  const file = new URL(relative, root);
  assert.ok(fs.existsSync(file), `Missing media asset: ${relative}`);
  assert.ok(fs.statSync(file).size > 1000, `Media asset is unexpectedly small: ${relative}`);
}

console.log("v84.36 new hero and Video Library video contracts passed.");
