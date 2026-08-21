export default function PlaceholderInfoPage({
  eyebrow,
  title,
  text,
  setActivePage,
}) {
  return (
    <main className="pageShell aboutRecipesPage placeholderInfoPage">
      <section className="aboutRecipesHero">
        <div>
          <div className="aiBadge">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </section>

      <div className="aboutRecipesActions">
        <button className="primary" onClick={() => setActivePage("Recipes")}>
          Browse Our Recipe Library
        </button>
        <button
          className="secondary"
          onClick={() => setActivePage("How To Use")}
        >
          How to Use This Site
        </button>
      </div>
    </main>
  );
}
