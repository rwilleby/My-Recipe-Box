import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const source = fs.readFileSync(path.join(root, "src", "App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src", "App.css"), "utf8");

test("Affiliate Marketing page uses the supplied disclosure copy and established layout", () => {
  assert.match(source, /title="Affiliate Marketing & Product Links"/);
  assert.match(source, /As an Amazon Associate I earn from qualifying purchases\./);
  assert.match(source, /How Affiliate Marketing Works/);
  assert.match(source, /Benefits for You/);
  assert.match(source, /Things to Keep in Mind/);
  assert.match(source, /Our Commitment to You/);
  assert.doesNotMatch(source, /This page will explain affiliate links/);
  assert.match(source, /className="foodSafetyAccordion affiliateMarketingAccordion"/);
  assert.match(css, /\.affiliateAmazonDisclosure\s*\{[\s\S]*?width:\s*90%\s*!important/);
  assert.match(css, /\.affiliateMarketingAccordionContent \.affiliatePrimaryList li::before\s*\{[\s\S]*?color:\s*#7a9a3d\s*!important/);
});
