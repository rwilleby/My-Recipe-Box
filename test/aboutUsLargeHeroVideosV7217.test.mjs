import assert from "node:assert/strict";
import fs from "node:fs";
const app=fs.readFileSync("src/App.jsx","utf8");
const specs=[
["BACKUP_RESTORE_VIDEO_URL","videos/backup-and-restore.mp4","BACKUP_RESTORE_VIDEO_POSTER"],
["MEALBALANCE_VIDEO_URL","videos/understanding-mealbalance.mp4","MEALBALANCE_VIDEO_POSTER"],
["DATA_SECURITY_VIDEO_URL","videos/your-data-and-security.mp4","DATA_SECURITY_VIDEO_POSTER"],
["AFFILIATE_MARKETING_VIDEO_URL","videos/affiliate-marketing.mp4","AFFILIATE_MARKETING_VIDEO_POSTER"],
["ABOUT_RECIPES_VIDEO_URL","videos/about-our-recipes.mp4","ABOUT_RECIPES_VIDEO_POSTER"],
];
for(const [c,a,p] of specs){
 assert.ok(app.includes(`const ${c} = "${a}";`),c);
 assert.ok(app.includes(`videoSrc={${c}}`),`${c} assignment`);
 assert.ok(app.includes(`videoPoster={${p}}`),`${p} assignment`);
}
console.log("v72.17 About Us Large Hero video assignments passed");
