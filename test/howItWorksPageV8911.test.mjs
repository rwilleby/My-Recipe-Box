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
assert.match(app, /useState\("easy"\)/);
assert.match(app, /current === section \? "" : section/);
assert.match(app, /Easy: Your Simple User Path/);
assert.match(app, /Detailed: Use More Site Features When You're Ready/);
assert.match(app, /aria-expanded=\{openSection === "easy"\}/);
assert.match(app, /aria-expanded=\{openSection === "detailed"\}/);
assert.match(app, /title="How Your Recipe Box Works"/);
assert.match(app, /src="images\/heroes\/hero-page-how-it-works\.webp"/);
assert.match(app, /No account\. No setup\./);
assert.match(app, /activePage === "How It Works"/);

assert.match(styles, /\.howItWorksIconButton/);
assert.match(styles, /\.howItWorksAccordionList/);
assert.match(styles, /\.howItWorksAccordionSummary/);
assert.match(styles, /\.howItWorksAccordion\.isOpen \.howItWorksAccordionArrow/);
assert.match(styles, /\.howItWorksDetailedStage/);
assert.match(styles, /\.howItWorksHero \.pageHeroTextOverlay h1[\s\S]*?white-space:\s*nowrap/);

assert.equal(routeForPage("How It Works"), "/how-it-works/");
assert.deepEqual(parseRoute("/how-it-works/"), {
  type: "page",
  pageId: "How It Works",
  code: "",
  path: "/how-it-works/",
});

await access(new URL("../public/images/icons/how-it-works-green.webp", import.meta.url));
await access(new URL("../public/images/heroes/hero-page-how-it-works.webp", import.meta.url));

console.log("How Your Recipe Box Works accordion page, route, icon, and hero passed");
