import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

test("main menu hides the Weekly Meal Planner prototype", () => {
  const menuStart = app.indexOf("const NAV_GROUPS");
  const menuEnd = app.indexOf("function Header", menuStart);
  const menu = app.slice(menuStart, menuEnd);

  assert.doesNotMatch(menu, /WEEKLY MEAL PLANNER — TEST/);
  assert.doesNotMatch(menu, /page:\s*"Weekly Meal Planner Prototype"/);
  assert.match(menu, /YOUR WEEKLY MEAL PLANNER/);
});
