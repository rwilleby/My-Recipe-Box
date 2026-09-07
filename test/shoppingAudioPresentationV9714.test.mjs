import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const [app, css, audio, icon] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
  readFile(new URL("../src/features/shopping/ShoppingAudioButton.jsx", import.meta.url), "utf8"),
  stat(new URL("../public/images/icons/AUDIO.webp", import.meta.url)),
]);

assert.doesNotMatch(app, /shoppingWindowControls|Bring List Forward|Bring Store Forward|Restore Shopping Layout/);
assert.match(audio, /src="\/images\/icons\/AUDIO\.webp"/);
assert.match(css, /\.shoppingAudioButton\s*\{[\s\S]*?width:\s*26px !important;[\s\S]*?border:\s*0 !important;[\s\S]*?background:\s*transparent !important;/);
assert.match(css, /\.shoppingStoreChooser > \.shoppingAudioControlPair \{ flex: 0 1 330px; \}/);
assert.ok(icon.size < 30_000);

console.log("v97.14 borderless audio icon and simplified Shopping controls passed.");
