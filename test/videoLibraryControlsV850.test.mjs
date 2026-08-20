import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const page = fs.readFileSync(new URL("../src/features/video-library/VideoLibraryPage.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/features/video-library/VideoLibraryPage.css", import.meta.url), "utf8");

test("Video Library hides native controls and keeps clean play/pause interaction", () => {
  assert.doesNotMatch(page, /\scontrols(?:\s|=)/);
  assert.match(page, /function toggleVideo\(index\)/);
  assert.match(page, /onClick=\{\(\) => toggleVideo\(index\)\}/);
  assert.match(page, /onKeyDown=/);
  assert.match(page, /className="videoLibraryPausedOverlay"/);
  assert.match(css, /\.videoLibraryPausedOverlay\s*\{[\s\S]*?pointer-events:\s*none/);
});
