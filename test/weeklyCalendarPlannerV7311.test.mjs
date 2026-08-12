import assert from "node:assert/strict";
import fs from "node:fs";

const app=fs.readFileSync("src/App.jsx","utf8");
const css=fs.readFileSync("src/App.css","utf8");

for(const token of[
  'const WEEKLY_PLANNER_ROWS = Object.freeze([',
  '{ id: "M", label: "M", name: "Main Course", index: 0, type: "main" }',
  '{ id: "S1", label: "S1", name: "Side 1", index: 1, type: "side" }',
  '{ id: "S2", label: "S2", name: "Side 2", index: 2, type: "side" }',
  '{ id: "S3", label: "S3", name: "Side 3", index: 3, type: "side" }',
  'rrb-weekly-planner-notes',
  'Search Side Dishes, Salads, Breads & Rolls, and Desserts.',
  'Green circle = MealBalance score',
  'Assign to {picker.day} — {picker.row.label}',
  'grid-template-columns: 92px repeat(7, minmax(0, 1fr))'
]) assert.ok(app.includes(token) || css.includes(token),token);

assert.ok(!app.includes("plannerCompactTables plannerCompactTablesFullWidth"));

console.log("v73.11 Weekly calendar planner passed");
