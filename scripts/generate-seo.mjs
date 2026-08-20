import { readFile, writeFile, mkdir, cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  INDEXABLE_PAGE_IDS,
  ROUTABLE_PAGE_IDS,
  SITE_NAME,
  SITE_ORIGIN,
  absoluteSiteUrl,
  isPrivatePage,
  pageDescription,
  pageTitle,
  routeForCompleteDinner,
  routeForPage,
  routeForRecipe,
} from "../src/routing/seoRoutes.js";

const projectRoot = process.cwd();
const distRoot = join(projectRoot, "dist");
const shell = await readFile(join(distRoot, "index.html"), "utf8");
const recipeSource = await readFile(join(projectRoot, "src/data/recipes.js"), "utf8");
const dinnerSource = await readFile(join(projectRoot, "src/data/completeDinners.js"), "utf8");

const recipes = [];
for (const match of recipeSource.matchAll(/^\s*\["([A-Z]{2,4}-\d+)",\s*"([^"]+)"/gm)) {
  recipes.push({ id: match[1], title: match[2] });
}

const dinners = [];
for (const match of dinnerSource.matchAll(/"id":\s*"(CD-\d+)"[\s\S]{0,240}?"title":\s*"([^"]+)"/g)) {
  dinners.push({ id: match[1], title: match[2] });
}

function escapeHtml(value = "") {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function replaceMeta(html, selector, value) {
  const escaped = escapeHtml(value);
  const pattern = selector.startsWith("property:")
    ? new RegExp(`<meta\\s+property=["']${selector.slice(9)}["'][^>]*>`, "i")
    : new RegExp(`<meta\\s+name=["']${selector}["'][^>]*>`, "i");
  const attribute = selector.startsWith("property:") ? `property="${selector.slice(9)}"` : `name="${selector}"`;
  const tag = `<meta ${attribute} content="${escaped}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `  ${tag}\n  </head>`);
}

function routeHtml({ title, description, path, image = "/images/ui/rrb-recipe-box-mark.webp", type = "website", noindex = false }) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonical = absoluteSiteUrl(path);
  const socialImage = absoluteSiteUrl(image);
  let html = shell.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`);
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  html = replaceMeta(html, "description", description);
  html = replaceMeta(html, "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
  html = replaceMeta(html, "property:og:title", fullTitle);
  html = replaceMeta(html, "property:og:description", description);
  html = replaceMeta(html, "property:og:type", type);
  html = replaceMeta(html, "property:og:url", canonical);
  html = replaceMeta(html, "property:og:image", socialImage);
  html = replaceMeta(html, "twitter:card", "summary_large_image");
  html = replaceMeta(html, "twitter:title", fullTitle);
  html = replaceMeta(html, "twitter:description", description);
  html = replaceMeta(html, "twitter:image", socialImage);
  return html;
}

async function writeRoute(path, html) {
  if (path === "/") {
    await writeFile(join(distRoot, "index.html"), html);
    return;
  }
  const output = join(distRoot, path.replace(/^\/+|\/+$/g, ""), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
}

for (const pageId of ROUTABLE_PAGE_IDS) {
  await writeRoute(routeForPage(pageId), routeHtml({
    title: pageTitle(pageId),
    description: pageDescription(pageId),
    path: routeForPage(pageId),
    noindex: isPrivatePage(pageId),
  }));
}

for (const recipe of recipes) {
  const path = routeForRecipe(recipe.id);
  await writeRoute(path, routeHtml({
    title: `${recipe.title} (${recipe.id})`,
    description: `${recipe.title} recipe with ingredients, serving information, nutrition estimates, and practical cooking details.`,
    path,
    type: "article",
  }));
}

for (const dinner of dinners) {
  const path = routeForCompleteDinner(dinner.id);
  await writeRoute(path, routeHtml({
    title: `${dinner.title} (${dinner.id})`,
    description: `${dinner.title}, a complete dinner combination with a main dish, practical sides, estimated nutrition, and planning guidance.`,
    path,
    type: "article",
  }));
}

const sitemapPaths = [
  ...INDEXABLE_PAGE_IDS.map(routeForPage),
  ...recipes.map((recipe) => routeForRecipe(recipe.id)),
  ...dinners.map((dinner) => routeForCompleteDinner(dinner.id)),
];
const uniquePaths = [...new Set(sitemapPaths)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniquePaths
  .map((path) => `  <url><loc>${escapeHtml(absoluteSiteUrl(path))}</loc><lastmod>2026-08-20</lastmod></url>`)
  .join("\n")}\n</urlset>\n`;
await writeFile(join(distRoot, "sitemap.xml"), sitemap);
await cp(join(projectRoot, "public/404.html"), join(distRoot, "404.html"));

console.log(`SEO routes generated: ${ROUTABLE_PAGE_IDS.length} pages, ${recipes.length} recipes, ${dinners.length} Complete Dinners.`);
