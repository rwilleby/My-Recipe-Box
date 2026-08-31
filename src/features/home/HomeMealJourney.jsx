import { useRef, useState } from "react";

export const MEAL_JOURNEY_STEPS = [
  {
    number: 1,
    id: "choose",
    title: "Choose",
    description: "Browse recipes and find meals that match your tastes, serving size and cooking style.",
    image: "images/about/meal-journey-choose.webp",
    imageAlt: "Laptop or tablet displaying recipes in a bright home kitchen",
    features: ["Search and filters", "Recipe photos", "MealBalance ratings", "Save favorites"],
    buttonLabel: "Browse Recipes",
    page: "Recipes",
  },
  {
    number: 2,
    id: "plan",
    title: "Plan",
    description: "Arrange recipes into a practical weekly or two-week meal plan.",
    image: "images/about/meal-journey-plan.webp",
    imageAlt: "Weekly meal planner with recipes arranged by day",
    features: ["Weekly planning", "Serving adjustments", "Combination meals", "Leftover planning"],
    buttonLabel: "Open Meal Planner",
    page: "Meal Planner",
  },
  {
    number: 3,
    id: "shop",
    title: "Shop",
    description: "Turn selected meals into one organized grocery list.",
    image: "images/about/meal-journey-shop.webp",
    imageAlt: "Grocery shopping with an organized list and fresh ingredients",
    features: ["Combined ingredients", "Pantry check", "Grocery categories", "Printable or mobile list"],
    buttonLabel: "Build a Shopping List",
    page: "Shopping Lists",
  },
  {
    number: 4,
    id: "prepare",
    title: "Prepare",
    description: "Prepare ingredients efficiently before cooking.",
    image: "images/about/meal-journey-prepare.webp",
    imageAlt: "Fresh ingredients being prepared on a clean kitchen counter",
    features: ["Step-by-step directions", "Preparation tips", "Equipment guidance", "Make-ahead options"],
    buttonLabel: "Explore Preparation Guides",
    page: "Reference Guides",
  },
  {
    number: 5,
    id: "portion",
    title: "Portion",
    description: "Divide meals into practical serving sizes.",
    image: "images/about/meal-journey-portion.webp",
    imageAlt: "Cooked meals being divided into practical storage containers",
    features: ["Serving guidance", "Container suggestions", "Two-person portions", "Batch preparation"],
    buttonLabel: "View Portion Guides",
    page: "Storage Organization",
  },
  {
    number: 6,
    id: "freeze",
    title: "Freeze",
    description: "Package and freeze meals for later.",
    image: "images/about/meal-journey-freeze.webp",
    imageAlt: "Labeled meal containers being placed into a freezer",
    features: ["Freezer-safe packaging", "Label & date guidance", "Best-by information", "Freezing instructions"],
    buttonLabel: "View Freezing Guides",
    page: "Freezer Tips",
  },
  {
    number: 7,
    id: "store",
    title: "Store",
    description: "Keep meals organized and easy to locate.",
    image: "images/about/meal-journey-store.webp",
    imageAlt: "Neatly organized freezer with labeled meal containers",
    features: ["Freezer organization", "Meal inventory", "Storage recommendations", "Use-first guidance"],
    buttonLabel: "Explore Storage Guides",
    page: "Storage Organization",
  },
  {
    number: 8,
    id: "reheat",
    title: "Reheat",
    description: "Use the best reheating method for each meal.",
    image: "images/about/meal-journey-reheat.webp",
    imageAlt: "A prepared meal being reheated in a home kitchen",
    features: ["Microwave guidance", "Oven instructions", "Air fryer options", "Safe thawing guidance"],
    buttonLabel: "View Reheating Guides",
    page: "Freezer Tips",
  },
  {
    number: 9,
    id: "enjoy",
    title: "Enjoy",
    description: "Serve homemade meals with less work and less waste.",
    image: "images/about/meal-journey-enjoy.webp",
    imageAlt: "Finished homemade dinner served on a plate at the table",
    features: ["Serving suggestions", "Side-dish pairings", "Complete dinners", "More time together"],
    buttonLabel: "Find Your Next Meal",
    page: "Recipes",
  },
];

function MealJourneyImage({ step }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="mealJourneyImagePlaceholder" role="img" aria-label={step.imageAlt}>
        <span>{String(step.number).padStart(2, "0")}</span>
        <strong>{step.title}</strong>
        <small>{step.image.split("/").pop()}</small>
      </div>
    );
  }

  return (
    <img
      className="mealJourneyImage"
      src={`${import.meta.env.BASE_URL}${step.image}`}
      alt={step.imageAlt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export function MealJourneyContent({ setActivePage, compact = false }) {
  function openPage(page) {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={compact ? "mealJourneyContent compact" : "mealJourneyContent"}>
      <header className="mealJourneyHeader">
        <h2>{compact ? "Use this as your quick guide to the site" : "Your Complete Meal Journey"}</h2>
        {compact ? (
          <>
            <p>Robert’s Recipe Box can be used as simply or as completely as you choose.</p>
            <p>
              Browse recipes, build complete meals and create a grocery list—or use the entire
              system to plan, prepare, portion, freeze, organize, store, and reheat meals.
            </p>
            <strong>Use the parts that work best for you.</strong>
          </>
        ) : (
          <>
            <p>
              Robert’s Recipe Box helps with the entire meal process—not just the recipe.
              Choose what to make, plan your week, shop efficiently, prepare and portion meals,
              freeze them properly, keep them organized, and reheat them with confidence.
            </p>
            <strong>Cook once. Eat better all week.</strong>
          </>
        )}
      </header>

      <div className="mealJourneyRows">
        {MEAL_JOURNEY_STEPS.map((step, index) => (
          <div className={`mealJourneyStepGroup${compact ? " compactGroup" : ""}`} key={step.id}>
            <article className={`mealJourneyRow${compact ? " compactRow" : index % 2 ? " reverse" : ""}`}>
              <div className="mealJourneyVisual">
                <MealJourneyImage step={step} />
              </div>
              <div className="mealJourneyCopy">
                <div className="mealJourneyTitleRow">
                  <span className="mealJourneyNumber">{step.number}</span>
                  <h3>{step.title}</h3>
                </div>
                <p className="mealJourneyDescription">{step.description}</p>
                <ul className="mealJourneyFeatureList">
                  {step.features.map((feature) => <li key={`${step.id}-${feature}`}>{feature}</li>)}
                </ul>
                {!compact && (
                  <button type="button" className="secondary mealJourneyAction" onClick={() => openPage(step.page)}>
                    {step.buttonLabel}
                  </button>
                )}
              </div>
            </article>
            {compact && index < MEAL_JOURNEY_STEPS.length - 1 && (
              <div className="mealJourneyFlowArrow" aria-hidden="true">↓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomeMealJourneyAccordion({ setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef(null);
  const summaryRef = useRef(null);
  const panelId = "home-meal-journey-panel";

  function closeJourney() {
    if (detailsRef.current) detailsRef.current.open = false;
    setIsOpen(false);
    window.requestAnimationFrame(() => {
      summaryRef.current?.focus();
      summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  return (
    <section className="homeMealJourneySection" aria-label="Quick guide to Robert’s Recipe Box">
      <details ref={detailsRef} className="homeMealJourneyDetails" onToggle={(event) => setIsOpen(event.currentTarget.open)}>
        <summary ref={summaryRef} className="homeMealJourneyToggle" aria-expanded={isOpen} aria-controls={panelId}>
          <span className="homeMealJourneyToggleText">
            <strong>New to our page? Start here:</strong>
            {!isOpen && <small>A quick guide recipes, planning, cooking, &amp; saving your favorite meals...</small>}
          </span>
          <span className="homeMealJourneyChevron" aria-hidden="true">{isOpen ? "⌃" : "⌄"}</span>
        </summary>
        <div id={panelId} className="homeMealJourneyPanel">
          <MealJourneyContent setActivePage={setActivePage} compact />
          <button type="button" className="homeMealJourneyClose" onClick={closeJourney}>
            <span>Close and Continue Browsing</span>
            <span aria-hidden="true">⌃</span>
          </button>
        </div>
      </details>
      <noscript>
        <p className="homeMealJourneyNoScript">
          Learn more about the complete meal journey on the About Robert’s Recipe Box page.
        </p>
      </noscript>
    </section>
  );
}
