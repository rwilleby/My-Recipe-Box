import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { uniqueRecordsByPermanentId } from "../src/utils/records.js";

const records = [
  { id: "SG-001", name: "First" },
  { code: "SG-001", name: "Duplicate" },
  { code: "DM-001", name: "Second" },
  { name: "No permanent ID" },
];

assert.deepEqual(
  uniqueRecordsByPermanentId(records).map((record) => record.name),
  ["First", "Second"],
  "the shared record utility should retain the first unique permanent ID"
);

const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const countersSource = await readFile(
  new URL("../src/features/home/HomeRecipeCounters.jsx", import.meta.url),
  "utf8"
);

assert.match(
  appSource,
  /import \{ uniqueRecordsByPermanentId \} from "\.\/utils\/records\.js";/,
  "App must import the shared helper before using it at runtime"
);
assert.equal(
  (appSource.match(/uniqueRecordsByPermanentId\(/g) || []).length,
  2,
  "App should retain both deduplicated dinner-combination call sites"
);
assert.match(
  countersSource,
  /import \{ uniqueRecordsByPermanentId \} from "\.\.\/\.\.\/utils\/records\.js";/,
  "Home counters must use the same shared helper"
);

console.log("v83.1.1 shared runtime binding contracts passed.");
