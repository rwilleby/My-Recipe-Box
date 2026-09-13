import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

assert.match(app, /<DinnerCombinationImage meal=\{meal\} className="weeklyPlannerPickerDinnerImage" \/>/, "Complete Dinner picker heroes need their dedicated sizing class");
assert.match(css, /\.weeklyPlannerPickerImageWrap\{[^}]*overflow:hidden!important/, "Picker image frames must clip oversized content");
assert.match(css, /\.weeklyPlannerPickerDinnerImage[^}]*width:100%!important[^}]*height:100%!important[^}]*max-width:100%!important[^}]*max-height:100%!important/, "Complete Dinner heroes must stay inside the picker card");
assert.match(css, /\.weeklyPlannerPickerDinnerImage[^}]*object-fit:cover!important/, "Complete Dinner heroes must retain the approved card crop");

console.log("v98.5.1 Weekly Planner Complete Dinner picker image sizing passed.");
