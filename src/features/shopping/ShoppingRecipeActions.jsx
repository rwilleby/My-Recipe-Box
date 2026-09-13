export default function ShoppingRecipeActions({ recipeLinks = [], onView, onPrint, viewLabel = "View Recipe Card" }) {
  const links = recipeLinks.filter((link) => link?.recipeId);
  if (!links.length) return null;
  if (links.length === 1) return <div className="shoppingRecipeActions shoppingRecipeActionsSingle"><button type="button" onClick={() => onView(links[0].recipeId)}>{viewLabel}</button><button type="button" onClick={() => onPrint([links[0].recipeId])}>Print Recipe</button></div>;
  return (
    <details className="shoppingRecipeActions shoppingRecipeActionsMenu">
      <summary>Recipe Cards</summary>
      <div>
        {links.map((link) => <section key={link.recipeId}><span><strong>{link.label}</strong><small>{link.title}</small></span><button type="button" onClick={() => onView(link.recipeId)}>View</button><button type="button" onClick={() => onPrint([link.recipeId])}>Print</button></section>)}
        <button type="button" className="shoppingPrintAllRecipes" onClick={() => onPrint(links.map((link) => link.recipeId))}>Print All Three Recipes</button>
      </div>
    </details>
  );
}
