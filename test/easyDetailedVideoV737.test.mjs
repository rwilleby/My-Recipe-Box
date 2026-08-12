import assert from "node:assert/strict";
import fs from "node:fs";
const a=fs.readFileSync("src/App.jsx","utf8");

for(const token of[
  'const EASY_DETAILED_VIDEO_URL = "videos/easy-or-detailed.mp4";',
  'const EASY_DETAILED_VIDEO_POSTER = "images/video-posters/easy-or-detailed-poster.webp";',
  'src={EASY_DETAILED_VIDEO_URL}',
  'poster={EASY_DETAILED_VIDEO_POSTER}',
  'title="Easy or Detailed overview video"'
]) assert.ok(a.includes(token), token);

assert.ok(!a.includes('src=""\n          poster=""\n          title="Easy and Detailed overview video"'));
console.log("v73.7 Easy/Detailed video assignment passed");
