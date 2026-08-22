import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { parseRoute, routeForPage } from "../src/routing/seoRoutes.js";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/App.css", import.meta.url), "utf8");

assert.match(app, /const HOW_IT_WORKS_ICON = "images\/icons\/how-it-works-green\.webp"/);
assert.match(app, /\{ label: "HOW IT WORKS", page: "How It Works" \}/);
assert.match(app, /className="pageSequenceButton howItWorksIconButton"/);
assert.match(app, /onClick=\{\(\) => setActivePage\("How It Works"\)\}/);
assert.match(app, /function HowItWorksPage/);
assert.match(app, /A Simple User Path/);
assert.match(app, /Use More of the Site When You Are Ready/);
assert.match(app, /No account\. No setup\./);
assert.match(app, /activePage === "How It Works"/);

assert.match(styles, /\.howItWorksIconButton/);
assert.match(styles, /\.howItWorksSimpleFlow/);
assert.match(styles, /\.howItWorksDetailedStage/);

assert.equal(routeForPage("How It Works"), "/how-it-works/");
assert.deepEqual(parseRoute("/how-it-works/"), {
  type: "page",
  pageId: "How It Works",
  code: "",
  path: "/how-it-works/",
});

await access(new URL("../public/images/icons/how-it-works-green.webp", import.meta.url));

console.log("v89.11 How It Works page, route, and hero icon passed");
