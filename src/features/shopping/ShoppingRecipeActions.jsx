export default function ShoppingRecipeActions({ recipeLinks = [], onView, onPrint }) {
  const links = recipeLinks.filter((link) => link?.recipeId);
  if (!links.length) return null;
  function runAndClose(event, action) {
    event.currentTarget.closest("details")?.removeAttribute("open");
    action();
  }
  return (
    <details className="shoppingRecipeActions shoppingRecipeActionsMenu">
      <summary>Recipe Cards</summary>
      <div>
        <button type="button" className="shoppingRecipeMenuClose" aria-label="Close Recipe Cards" onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>×</button>
        {links.map((link) => <section key={link.recipeId}><span><strong>{link.label}</strong><small>{link.title}</small></span><button type="button" onClick={(event) => runAndClose(event, () => onView(link.recipeId))}>View</button><button type="button" onClick={(event) => runAndClose(event, () => onPrint([link.recipeId]))}>Print</button></section>)}
        <button type="button" className="shoppingPrintAllRecipes" onClick={(event) => runAndClose(event, () => onPrint(links.map((link) => link.recipeId)))}>{links.length === 1 ? "Print Recipe" : `Print All ${links.length} Recipes`}</button>
      </div>
    </details>
  );
}
