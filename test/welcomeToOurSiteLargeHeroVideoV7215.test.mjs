import assert from "node:assert/strict";
import fs from "node:fs";
const app=fs.readFileSync("src/App.jsx","utf8");
for(const t of[
'const WELCOME_TO_SITE_VIDEO_URL = "videos/welcome-to-our-site.mp4";',
'const WELCOME_TO_SITE_VIDEO_POSTER = "images/video-posters/welcome-to-our-site-poster.webp";',
'videoSrc={WELCOME_TO_SITE_VIDEO_URL}',
'videoPoster={WELCOME_TO_SITE_VIDEO_POSTER}',
'videoSrc={videoSrc}',
'posterSrc={videoPoster}'
]) assert.ok(app.includes(t),t);
console.log("v72.15 Welcome to Our Site large hero video contracts passed");
