import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const [app, css, grocery, companion, audioComponent, audioStat] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
  readFile(new URL("../src/utils/onlineGroceryShopping.js", import.meta.url), "utf8"),
  readFile(new URL("../src/features/shopping/ShoppingCompanionWindow.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/features/shopping/ShoppingAudioButton.jsx", import.meta.url), "utf8"),
  stat(new URL("../public/images/icons/AUDIO.webp", import.meta.url)),
]);

assert.ok(audioStat.size < 30_000, "optimized audio icon should remain below 30 KB");
assert.match(audioComponent, /speechSynthesis\.speak/);
assert.match(audioComponent, /images\/icons\/AUDIO\.webp/);
assert.match(app, /ShoppingCountAudio count=\{preparedOnHand\.length\}/);
assert.match(app, /ShoppingCountAudio count=\{preparedMissing\.length\}/);
assert.match(app, /ShoppingCountAudio count=\{preparedToBatch\.length\}/);
assert.match(app, /ShoppingCountAudio count=\{needed\.length\}/);
assert.match(app, /ShoppingCountAudio count=\{pantryItems\.length\}/);
assert.match(grocery, /focusOnlineGroceryWindow/);
assert.match(grocery, /restoreOnlineGroceryWindow/);
assert.match(grocery, /availableWidth \* 0\.44/);
assert.match(companion, /focusShoppingCompanionWindow/);
assert.match(companion, /restoreShoppingCompanionWindow/);
assert.match(companion, /availableWidth \* 0\.31/);
assert.match(companion, /availableWidth \* 0\.25/);
assert.match(css, /\.shoppingAudioButton/);

console.log("v97.13 shopping-window layout, focus controls, and audio guidance contracts passed.");
