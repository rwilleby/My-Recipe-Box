import { fullCardImageCandidates } from "../features/recipe-viewer/recipeAssets.js";

function escapePrintText(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function printRecipeCards(recipeIds, recipeCatalog, browserWindow = window) {
  const recipeMap = new Map(recipeCatalog.map((recipe) => [recipe.id, recipe]));
  const printable = [...new Set(recipeIds)].map((id) => recipeMap.get(id)).filter(Boolean).map((recipe) => ({ recipe, imagePath: fullCardImageCandidates(recipe)[0] })).filter((item) => item.imagePath);
  if (!printable.length) return null;
  const printWindow = browserWindow.open("", "rrbRecipePrint", "popup=yes,width=1000,height=760,resizable=yes,scrollbars=yes");
  if (!printWindow) { browserWindow.alert("Please allow pop-up windows to print recipe cards."); return null; }
  const cards = printable.map(({ recipe, imagePath }) => `<section><img src="${new URL(`${import.meta.env.BASE_URL}${imagePath}`, browserWindow.location.origin).href}" alt="${escapePrintText(`${recipe.id} ${recipe.title} recipe card`)}"></section>`).join("");
  printWindow.document.write(`<!doctype html><html><head><title>Recipe Cards</title><style>@page{size:landscape;margin:.25in}*{box-sizing:border-box}body{margin:0;background:#fff}section{height:7.5in;display:grid;place-items:center;break-after:page;page-break-after:always}section:last-child{break-after:auto;page-break-after:auto}img{display:block;width:100%;max-width:10.5in;max-height:7.5in;object-fit:contain}</style></head><body>${cards}<script>Promise.all([...document.images].map(image=>image.complete?Promise.resolve():new Promise(resolve=>{image.onload=resolve;image.onerror=resolve}))).then(()=>{window.focus();window.print()})</script></body></html>`);
  printWindow.document.close();
  return printWindow;
}
