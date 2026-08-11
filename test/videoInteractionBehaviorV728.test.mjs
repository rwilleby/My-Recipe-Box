import assert from "node:assert/strict";
import fs from "node:fs";
const app=fs.readFileSync("src/App.jsx","utf8");
const css=fs.readFileSync("src/App.css","utf8");
for (const t of [
  'className="supplementalVideoTriggerButton"',
  'onClick={openVideo}',
  'onEnded={handleEnded}',
  '}, 800);',
  'className="supplementalHoverVideoClose"',
  'className="supplementalVideoIconGray"',
  'className="supplementalVideoIconRed"',
  'onMouseEnter={() => window.dispatchEvent(new Event(WELCOME_TOUR_OPEN_EVENT))}',
  'onFocus={() => window.dispatchEvent(new Event(WELCOME_TOUR_OPEN_EVENT))}'
]) assert.ok(app.includes(t),t);
assert.ok(!app.includes('onMouseEnter={openVideo}'));
const i=css.lastIndexOf('/* v72.8 — revised supplemental click behavior + enlarged video icons */');
assert.ok(i>=0);
const f=css.slice(i);
for (const t of ['width: 35px !important;','.supplementalVideoIconRed','.supplementalHoverVideoClose','width: 37px !important;']) assert.ok(f.includes(t),t);
console.log('v72.8 video interaction behavior contracts passed');
