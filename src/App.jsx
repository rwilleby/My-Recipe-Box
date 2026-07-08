import { useMemo, useState, useEffect } from "react";
import { categories, collections, recipes } from "./data/recipes";
import { loadJSON, saveJSON } from "./utils/storage";
import {
  DAYS,
  emptyPlan,
  buildShoppingList,
  planCost,
  scaleCost,
  formatQty,
} from "./utils/planning";
import "./App.css";

const STORAGE_KEYS = {
  favorites: "rrb_favorites",
  plan: "rrb_weeklyPlan",
  servings: "rrb_servingSize",
  checked: "rrb_checkedShoppingItems",
};

const CATEGORY_ICON_IMAGES = {
  AS: "images/icons/icon-asian.png",
  AM: "images/icons/icon-american.png",
  IT: "images/icons/icon-italian.png",
  MX: "images/icons/icon-mexican.png",
  SB: "images/icons/icon-salads-bowls.png",
  SF: "images/icons/icon-seafood.png",
  SG: "images/icons/icon-smoked-grilled.png",
  SD: "images/icons/icon-side-dishes.png",
};

const AUTO_IMAGE_PREFIXES = new Set(["AS", "CC", "CO", "CR", "DN", "HB", "HBP", "IT"]);

function recipeCodePrefix(recipeId = "") {
  const match = recipeId.match(/^[A-Z]+/);
  return match ? match[0] : "";
}

function recipeImageCandidates(recipe) {
  const candidates = [];

  if (recipe.heroImage) {
    candidates.push(recipe.heroImage);
  }

  if (recipe.image) {
    candidates.push(recipe.image);
  }

  const prefix = recipeCodePrefix(recipe.id);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/heroes/${recipe.id}.png`);
    candidates.push(`images/recipes/${recipe.id}.png`);
  }

  return [...new Set(candidates)];
}

function Header({ activePage, setActivePage }) {
  const nav = [
    "Recipes",
    "Collections",
    "Meal Planner",
    "Shopping Lists",
    "Cost Estimator",
    "Favorites",
    "About",
  ];

  return (
    <header className="topbar">
      <button
        className="brand"
        onClick={() => setActivePage("Home")}
        aria-label="Go home"
      >
        <span className="brandIcon">♨</span>
        <span>
          <strong>Robert&apos;s</strong>
          <br />
          <strong>Recipe Box</strong>
        </span>
      </button>

      <nav className="navLinks">
        {nav.map((item) => (
          <button
            key={item}
            className={activePage === item ? "active" : ""}
            onClick={() => setActivePage(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="topActions">
        <span>⌕</span>
        <span>♡</span>
        <span className="avatar">◉ Robert⌄</span>
      </div>
    </header>
  );
}

function Hero({ setActivePage }) {
  return (
    <section className="hero">
      <div className="heroCopy">
        <div className="aiBadge">✧ AI-POWERED RECIPE PLANNING ✧</div>

        <h1>
          Helping to organize your cooking, kitchen, & shopping - all in one place...
        </h1>

        <p>
          Browse AI-generated recipes, save your favorites,
          <br />
          build weekly meal plans, create smart shopping lists,
          <br />
          and estimate food costs.
        </p>

        <div className="heroButtons">
          <button className="primary" onClick={() => setActivePage("Recipes")}>
            ▣ Browse Recipes
          </button>
          <button
            className="secondary"
            onClick={() => setActivePage("Meal Planner")}
          >
            ▣ Start Meal Planning
          </button>
        </div>
      </div>

      <div className="heroPhoto">
        <img
          className="heroImage"
          src={`${import.meta.env.BASE_URL}images/heroes/hero-pasta.png`}
          alt="Creamy pasta with basil and tomatoes"
        />

        <div className="statsCard">
          <div>
            <span>👨‍🍳</span>
            <strong>400+</strong>
            <small>AI Recipes</small>
          </div>
          <div>
            <span>♡</span>
            <strong>50+</strong>
            <small>Favorites</small>
          </div>
          <div>
            <span>▣</span>
            <strong>AI Meal</strong>
            <small>Planner</small>
          </div>
          <div>
            <span>🛒</span>
            <strong>Smart Lists</strong>
            <small>& Cost Estimator</small>
          </div>
        </div>

      </div>
    </section>
  );
}

function TransparencyLine() {
  return (
    <div className="transparencyLine">
      <strong>Transparency first:</strong> All recipes & collections in Robert’s Recipe Box are AI-generated planning tools — not private family recipes.
    </div>
  );
}

function CategoryGrid({ setFilter, setActivePage }) {
  function openCategory(categoryName) {
    setFilter(categoryName);
    setActivePage("Recipes");
  }

  return (
    <section className="section">
      <div className="sectionTitle">
        <h2>Browse by Category</h2>
        <button onClick={() => setActivePage("Recipes")}>
          View all categories ›
        </button>
      </div>

      <div className="categoryGrid">
        {categories.map((cat) => {
          const iconPath = cat.iconImage || CATEGORY_ICON_IMAGES[cat.id];

          return (
            <button
              key={cat.id}
              className="categoryTile"
              onClick={() => openCategory(cat.name)}
              aria-label={`View ${cat.name} recipes`}
            >
              {iconPath ? (
                <img
                  className="categoryIconImage"
                  src={`${import.meta.env.BASE_URL}${iconPath}`}
                  alt={`${cat.name} icon`}
                />
              ) : (
                <span className="categoryIcon">{cat.icon}</span>
              )}

              <strong>{cat.name}</strong>
              <small>{cat.count} recipes</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function RecipeImage({ recipe }) {
  const candidates = recipeImageCandidates(recipe);
  const [imageIndex, setImageIndex] = useState(0);
  const imagePath = candidates[imageIndex];

  useEffect(() => {
    setImageIndex(0);
  }, [recipe.id]);

  if (imagePath) {
    return (
      <div className="recipeImage recipePhoto">
        <img
          src={`${import.meta.env.BASE_URL}${imagePath}`}
          alt={recipe.title}
          onError={() => setImageIndex((current) => current + 1)}
        />
      </div>
    );
  }

  return (
    <div className="recipeImage" style={{ background: recipe.imageStyle }}>
      <span>{recipe.emoji}</span>
    </div>
  );
}

function RecipeCard({ recipe, favorites, toggleFavorite, addToPlan }) {
  return (
    <article className="recipeCard">
      <RecipeImage recipe={recipe} />

      <button
        className={`heart ${favorites.includes(recipe.id) ? "saved" : ""}`}
        onClick={() => toggleFavorite(recipe.id)}
        aria-label="Save favorite"
      >
        ♡
      </button>

      <div className="recipeBody">
        <span className={`tag tag-${recipe.categoryCode}`}>
          {recipe.category}
        </span>

        <h3>{recipe.title}</h3>

        <div className="meta">
          <span>◷ {recipe.time} min</span>
          <span>♙ {recipe.servings}</span>
          <span>{recipe.price}</span>
        </div>

        <button className="addPlan" onClick={() => addToPlan(recipe.id)}>
          Add to planner
        </button>
      </div>
    </article>
  );
}

function CollectionStrip() {
  return (
    <section className="section">
      <div className="sectionTitle">
        <h2>
          AI-Generated Collections for Every Plan{" "}
          <span className="miniAi">AI</span>
        </h2>
        <button>View all collections ›</button>
      </div>

      <div className="collectionGrid">
        {collections.map((c) => (
          <div
            className="collectionTile"
            key={c.id}
            style={{ background: c.tint }}
          >
            <span>{c.icon}</span>
            <strong>{c.title}</strong>
            <small>{c.count} recipes</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function Home({
  favorites,
  toggleFavorite,
  addToPlan,
  setActivePage,
  setFilter,
}) {
  return (
    <>
      <Hero setActivePage={setActivePage} />
      <TransparencyLine />
      <FeatureStrip />
      <CategoryGrid setFilter={setFilter} setActivePage={setActivePage} />

      <section className="section">
        <div className="sectionTitle">
          <h2>Recently Added</h2>
          <button onClick={() => setActivePage("Recipes")}>
            View all recipes ›
          </button>
        </div>

        <div className="recipeRow">
          {recipes.slice(0, 6).map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              addToPlan={addToPlan}
            />
          ))}
        </div>
      </section>

      <CollectionStrip />
    </>
  );
}

function RecipesPage({
  favorites,
  toggleFavorite,
  addToPlan,
  filter,
  setFilter,
}) {
  const [query, setQuery] = useState("");

  const filtered = recipes.filter((r) => {
    const matchesCategory = !filter || r.category === filter;
    const matchesQuery = `${r.title} ${r.category}`
      .toLowerCase()
      .includes(query.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">AI-GENERATED RECIPE LIBRARY</div>
          <h1>Browse recipes</h1>
          <p>
            Search AI-generated recipe collections, save favorites, and add
            dinners to your weekly plan.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes, ingredients, cuisines..."
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="recipeGrid">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            addToPlan={addToPlan}
          />
        ))}
      </div>
    </main>
  );
}

function PlannerPage({ plan, setPlan, servings, setServings }) {
  const [selectedDay, setSelectedDay] = useState("Mon");

  function addRecipe(recipeId) {
    if (!recipeId) return;

    setPlan((current) => ({
      ...current,
      [selectedDay]: [...(current[selectedDay] || []), recipeId],
    }));
  }

  function removeRecipe(day, index) {
    setPlan((current) => ({
      ...current,
      [day]: current[day].filter((_, i) => i !== index),
    }));
  }

  function clearPlan() {
    setPlan(emptyPlan());
  }

  return (
    <main className="pageShell plannerLayout">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">BROWSER-BASED PLANNER</div>
          <h1>Weekly dinner planner</h1>
          <p>
            Build a simple dinner plan. Your plan is saved in this browser only.
          </p>
        </div>

        <ServingSelector servings={servings} setServings={setServings} />
      </div>

      <div className="plannerGrid">
        {DAYS.map((day) => (
          <div className="dayCard" key={day}>
            <h3>{day}</h3>

            {(plan[day] || []).length === 0 && (
              <p className="empty">No dinner selected.</p>
            )}

            {(plan[day] || []).map((id, index) => {
              const recipe = recipes.find((r) => r.id === id);

              return recipe ? (
                <div className="planItem" key={`${id}-${index}`}>
                  <span>{recipe.emoji}</span>

                  <div>
                    <strong>{recipe.title}</strong>
                    <small>
                      {recipe.time} min • est. $
                      {scaleCost(recipe, servings).toFixed(2)}
                    </small>
                  </div>

                  <button onClick={() => removeRecipe(day, index)}>×</button>
                </div>
              ) : null;
            })}
          </div>
        ))}
      </div>

      <div className="plannerControls">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          {DAYS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <select onChange={(e) => addRecipe(e.target.value)} value="">
          <option value="">Add recipe to {selectedDay}</option>
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>

        <button className="secondary" onClick={clearPlan}>
          Clear plan
        </button>
      </div>
    </main>
  );
}

function ServingSelector({ servings, setServings }) {
  return (
    <div className="servingSelector">
      <span>Servings:</span>
      {[2, 4, 6].map((n) => (
        <button
          key={n}
          className={servings === n ? "selected" : ""}
          onClick={() => setServings(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function ShoppingListPage({ plan, checked, setChecked, servings }) {
  const list = useMemo(
    () => buildShoppingList(plan, recipes, servings),
    [plan, servings]
  );

  const grouped = list.reduce((acc, item) => {
    return {
      ...acc,
      [item.aisle]: [...(acc[item.aisle] || []), item],
    };
  }, {});

  const total = list.reduce((sum, item) => sum + item.cost, 0);

  function toggleItem(key) {
    setChecked((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">SMART SHOPPING LIST</div>
          <h1>Shopping list</h1>
          <p>
            Auto-generated from your weekly dinner plan and selected serving
            size.
          </p>
        </div>

        <div className="totalBox">
          <small>Estimated Total</small>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Your shopping list is empty"
          text="Add recipes to your weekly planner to generate a grocery list."
        />
      ) : (
        <div className="shoppingGrid">
          {Object.entries(grouped).map(([aisle, items]) => (
            <section className="shoppingGroup" key={aisle}>
              <h2>{aisle}</h2>

              {items.map((item) => {
                const key = `${item.name}-${item.unit}-${item.aisle}`;

                return (
                  <label
                    key={key}
                    className={
                      checked[key] ? "checked shoppingItem" : "shoppingItem"
                    }
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[key]}
                      onChange={() => toggleItem(key)}
                    />

                    <span>{item.name}</span>
                    <small>
                      {formatQty(item.qty)} {item.unit}
                    </small>
                    <em>${item.cost.toFixed(2)}</em>
                  </label>
                );
              })}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

function CostEstimatorPage({ plan, servings, setServings }) {
  const selected = Object.entries(plan)
    .flatMap(([day, ids]) =>
      ids.map((id) => ({
        day,
        recipe: recipes.find((r) => r.id === id),
      }))
    )
    .filter((x) => x.recipe);

  const totals = [2, 4, 6].map((n) => ({
    servings: n,
    total: planCost(plan, recipes, n),
  }));

  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">COST ESTIMATOR</div>
          <h1>Estimated food costs</h1>
          <p>
            Compare approximate totals for servings of 2, 4, and 6. Actual
            grocery prices may vary.
          </p>
        </div>

        <ServingSelector servings={servings} setServings={setServings} />
      </div>

      <div className="costCards">
        {totals.map((t) => (
          <div
            className={
              servings === t.servings ? "costCard selected" : "costCard"
            }
            key={t.servings}
          >
            <small>{t.servings} servings</small>
            <strong>${t.total.toFixed(2)}</strong>
            <span>{selected.length || 0} planned meals</span>
          </div>
        ))}
      </div>

      <section className="costTable">
        <h2>Meal cost details</h2>

        {selected.length === 0 ? (
          <EmptyState
            title="No meals selected"
            text="Add recipes to your meal planner to estimate costs."
          />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Recipe</th>
                <th>2 servings</th>
                <th>4 servings</th>
                <th>6 servings</th>
              </tr>
            </thead>

            <tbody>
              {selected.map(({ day, recipe }, i) => (
                <tr key={`${day}-${recipe.id}-${i}`}>
                  <td>{day}</td>
                  <td>{recipe.title}</td>
                  <td>${scaleCost(recipe, 2).toFixed(2)}</td>
                  <td>${scaleCost(recipe, 4).toFixed(2)}</td>
                  <td>${scaleCost(recipe, 6).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

function FavoritesPage({ favorites, toggleFavorite, addToPlan }) {
  const saved = recipes.filter((r) => favorites.includes(r.id));

  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">SAVED IN THIS BROWSER</div>
          <h1>Favorites</h1>
          <p>Recipes you saved on this device. No login or sync required.</p>
        </div>
      </div>

      {saved.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          text="Tap the heart on any recipe card to save it here."
        />
      ) : (
        <div className="recipeGrid">
          {saved.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              addToPlan={addToPlan}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function CollectionsPage() {
  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">CURATED BY AI</div>
          <h1>Collections</h1>
          <p>
            AI-generated collections designed for real-life planning, shopping,
            and cost estimating.
          </p>
        </div>
      </div>

      <CollectionStrip />
      <FeatureStrip />
    </main>
  );
}

function AboutPage() {
  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">ABOUT THE PROJECT</div>
          <h1>AI-generated planning tools, not private recipes</h1>
          <p>
            Robert’s Recipe Box is a practical recipe planning library. Recipes
            and collections are AI-generated to help users browse ideas, plan
            meals, build shopping lists, and estimate costs.
          </p>
        </div>
      </div>

      <div className="aboutCard">
        <h2>Browser-based first version</h2>
        <p>
          Favorites, weekly plans, shopping list checks, and serving size are
          saved using your browser’s local storage. They stay on this browser
          and are not synced across devices.
        </p>
        <p>
          This keeps the first GitHub Pages version simple, fast, and easy to
          maintain. A login-based version can be added later.
        </p>
      </div>
    </main>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="emptyState">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function FeatureStrip() {
  const features = [
    {
      title: "AI-Powered Recipes",
      text: "Thoughtful recipes selected & inspired by popular dishes.",
    },
    {
      title: "Easy Meal Planning",
      text: "Build your own weekly meal plans, adjust servings for 2-6 people.",
    },
    {
      title: "Smart Shopping List",
      text: "Auto-generate your shopping list from your weekly meal plan.",
    },
    {
      title: "Grocery Store List",
      text: "Estimate your food cost based on your weekly menu items.",
    },
    {
      title: "Recommendations",
      text: "Cool kitchen tools, and food organizers to make cooking fun.",
    },
  ];

  return (
    <section className="featureStrip">
      {features.map((feature) => (
        <div className="featureCard" key={feature.title}>
          <div className="featureCardHeader">
            <strong>{feature.title}</strong>
          </div>
          <small>{feature.text}</small>
        </div>
      ))}
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("Home");
  const [favorites, setFavorites] = useState(() =>
    loadJSON(STORAGE_KEYS.favorites, [])
  );
  const [plan, setPlan] = useState(() =>
    loadJSON(STORAGE_KEYS.plan, emptyPlan())
  );
  const [servings, setServings] = useState(() =>
    loadJSON(STORAGE_KEYS.servings, 4)
  );
  const [checked, setChecked] = useState(() =>
    loadJSON(STORAGE_KEYS.checked, {})
  );
  const [filter, setFilter] = useState("");

  useEffect(() => saveJSON(STORAGE_KEYS.favorites, favorites), [favorites]);
  useEffect(() => saveJSON(STORAGE_KEYS.plan, plan), [plan]);
  useEffect(() => saveJSON(STORAGE_KEYS.servings, servings), [servings]);
  useEffect(() => saveJSON(STORAGE_KEYS.checked, checked), [checked]);

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function addToPlan(recipeId) {
    setPlan((current) => {
      const day = DAYS.find((d) => (current[d] || []).length === 0) || "Mon";

      return {
        ...current,
        [day]: [...(current[day] || []), recipeId],
      };
    });

    setActivePage("Meal Planner");
  }

  const pageProps = {
    favorites,
    toggleFavorite,
    addToPlan,
    setActivePage,
    setFilter,
    filter,
    plan,
    setPlan,
    servings,
    setServings,
    checked,
    setChecked,
  };

  return (
    <div className="app">
      <Header activePage={activePage} setActivePage={setActivePage} />

      {activePage === "Home" && <Home {...pageProps} />}
      {activePage === "Recipes" && <RecipesPage {...pageProps} />}
      {activePage === "Collections" && <CollectionsPage />}
      {activePage === "Meal Planner" && <PlannerPage {...pageProps} />}
      {activePage === "Shopping Lists" && <ShoppingListPage {...pageProps} />}
      {activePage === "Cost Estimator" && <CostEstimatorPage {...pageProps} />}
      {activePage === "Favorites" && <FavoritesPage {...pageProps} />}
      {activePage === "About" && <AboutPage />}

      <footer className="footer">
        Robert’s Recipe Box uses AI-generated recipe collections as practical
        planning tools. Favorites and plans are saved in this browser only.
      </footer>
    </div>
  );
}
