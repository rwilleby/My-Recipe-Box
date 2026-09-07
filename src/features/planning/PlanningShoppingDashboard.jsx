import "./PlanningShoppingDashboard.css";

const STEPS = [
  { id: "plan", label: "Plan Meals", title: "Weekly Meal Planner", text: "Choose dinners and organize the week.", page: "Meal Planner", image: "images/heroes/hero-weekly-dinner-planner.webp" },
  { id: "bulk", label: "Bulk Plans", title: "Weekend Bulk Plan", text: "Choose freezer meals and prepare ahead.", page: "Weekend Bulk Meal Planner", image: "images/heroes/hero-page-freezer-meals.webp" },
  { id: "review", label: "Review List", title: "Shopping List", text: "Review what you have and what you need.", page: "Shopping Lists", image: "images/heroes/hero-page-grocery-list.webp" },
  { id: "shop", label: "Shop Online", title: "Online Shopping", text: "Open your store with the movable list.", page: "Shopping Lists", image: "images/heroes/hero-page-grocery-list.webp" },
  { id: "away", label: "Put Away", title: "Update Inventory", text: "Confirm purchases and update your inventory.", page: "Master Kitchen Inventory", image: "images/heroes/hero-page-your-pantry.webp" },
];

export default function PlanningShoppingDashboard({ activeStep = "review", compact = false, setActivePage }) {
  function openStep(step) {
    if (step.id === "shop" && typeof window !== "undefined") {
      window.sessionStorage.setItem("rrb-planning-dashboard-focus", "shop");
    }
    setActivePage(step.page);
    if (step.id === "shop" && step.page === "Shopping Lists") {
      window.setTimeout(() => document.getElementById("online-shopping")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    }
  }

  return (
    <section className={compact ? "planningShoppingDashboard isCompact" : "planningShoppingDashboard"} aria-label="Meal planning and shopping progress">
      {!compact && <header><h2>Plan, Shop &amp; Keep Track</h2><p>Move from weekly meal planning to stocked shelves—all in one place.</p></header>}
      <nav className="planningShoppingSegments" aria-label="Planning and shopping steps">
        {STEPS.map((step) => <button key={step.id} type="button" className={activeStep === step.id ? "isActive" : ""} aria-current={activeStep === step.id ? "step" : undefined} onClick={() => openStep(step)}>{activeStep === step.id && <span className="planningShoppingYouAreHere">You Are Here<span aria-hidden="true">▼</span></span>}<span>{step.label}</span></button>)}
      </nav>
      {!compact && <div className="planningShoppingCards">{STEPS.map((step) => <article key={step.id} className={activeStep === step.id ? "isActive" : ""}><button type="button" onClick={() => openStep(step)} aria-label={`Open ${step.title}`}><img src={`${import.meta.env.BASE_URL}${step.image}`} alt="" /><span><strong>{step.title}</strong><small>{step.text}</small><b aria-hidden="true">›</b></span></button></article>)}</div>}
    </section>
  );
}
