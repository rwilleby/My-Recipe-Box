import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HOW_IT_WORKS_CATEGORIES,
  HOW_IT_WORKS_GOALS,
  HOW_IT_WORKS_GUIDES,
  HOW_IT_WORKS_QUICK_PATH,
  getHowItWorksGuide,
  getHowItWorksGuideForPage,
  howItWorksSearchText,
} from "../data/howItWorksGuides.js";

const OPEN_EVENT = "rrb:open-how-it-works";
const WELCOME_VIDEO_EVENT = "rrb:open-welcome-tour";
const HERO_VIDEO_EVENT = "rrb:open-large-hero-video";

export function openHowItWorksGuide(pageId) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { pageId } }));
}

function Roadmap({ guide, compact = false }) {
  if (!guide?.roadmap?.length) return null;
  return (
    <div className={`howItWorksRoadmap${compact ? " isCompact" : ""}`} aria-label={`${guide.title} roadmap`}>
      {guide.roadmap.map((step, index) => (
        <div className="howItWorksRoadmapStep" key={step}>
          <span>{index + 1}</span>
          <strong>{step}</strong>
          {index < guide.roadmap.length - 1 && <i aria-hidden="true">↓</i>}
        </div>
      ))}
    </div>
  );
}

function GuideActions({ guide, setActivePage, onWatchVideo, onRoadmap, includeComplete = false, onComplete }) {
  return (
    <div className="howItWorksGuideActions">
      <button type="button" onClick={() => setActivePage(guide.page)}>Open Page</button>
      {guide.video && <button type="button" onClick={() => onWatchVideo(guide)}>Watch Video</button>}
      {guide.roadmap && <button type="button" onClick={onRoadmap}>View Roadmap</button>}
      {includeComplete && <button type="button" onClick={onComplete}>View Complete How It Works</button>}
    </div>
  );
}

export function HowItWorksPage({ setActivePage }) {
  const [openLevel, setOpenLevel] = useState("quick");
  const [query, setQuery] = useState("");
  const [roadmapId, setRoadmapId] = useState("home");

  const filteredGuides = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return HOW_IT_WORKS_GUIDES;
    return HOW_IT_WORKS_GUIDES.filter((guide) => howItWorksSearchText(guide).includes(normalized));
  }, [query]);

  useEffect(() => {
    const anchor = window.location.hash.replace(/^#/, "");
    if (!anchor) return;
    setOpenLevel("detailed");
    window.requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ block: "start" }));
  }, []);

  function openGuideFromGoal(guideId) {
    setOpenLevel("detailed");
    window.requestAnimationFrame(() => document.getElementById(`guide-${guideId}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function watchVideo(guide) {
    setActivePage(guide.page);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      if (guide.page === "Home") window.dispatchEvent(new Event(WELCOME_VIDEO_EVENT));
      else window.dispatchEvent(new CustomEvent(HERO_VIDEO_EVENT, { detail: { pageTitle: guide.video.pageTitle } }));
    }));
  }

  return (
    <main className="pageShell howItWorksPage unifiedHowItWorksPage">
      <div className="howItWorksAccordionList">
        <section className={`howItWorksAccordion${openLevel === "quick" ? " isOpen" : ""}`}>
          <button className="howItWorksAccordionSummary" type="button" aria-expanded={openLevel === "quick"} aria-controls="how-it-works-quick-panel" onClick={() => setOpenLevel((current) => current === "quick" ? "" : "quick")}>
            <span className="howItWorksAccordionArrow" aria-hidden="true">▶</span>
            <span><strong>Quick Overview</strong><small>See the primary user journey in six simple steps.</small></span>
            <em>{openLevel === "quick" ? "Close" : "Open"}</em>
          </button>
          {openLevel === "quick" && (
            <div className="howItWorksAccordionBody" id="how-it-works-quick-panel">
              <p className="howItWorksLevelIntro">Begin anywhere. Each tool works on its own, and the steps connect whenever you want the complete planning experience.</p>
              <div className="howItWorksQuickPath" aria-label="Primary Robert’s Recipe Box user journey">
                {HOW_IT_WORKS_QUICK_PATH.map((step, index) => (
                  <div className="howItWorksQuickStep" key={step}>
                    <span>{index + 1}</span><strong>{step}</strong>{index < HOW_IT_WORKS_QUICK_PATH.length - 1 && <i aria-hidden="true">→</i>}
                  </div>
                ))}
              </div>
              <button className="primary howItWorksContinueButton" type="button" onClick={() => setOpenLevel("detailed")}>See Detailed Help</button>
            </div>
          )}
        </section>

        <section className={`howItWorksAccordion${openLevel === "detailed" ? " isOpen" : ""}`}>
          <button className="howItWorksAccordionSummary" type="button" aria-expanded={openLevel === "detailed"} aria-controls="how-it-works-detailed-panel" onClick={() => setOpenLevel((current) => current === "detailed" ? "" : "detailed")}>
            <span className="howItWorksAccordionArrow" aria-hidden="true">▶</span>
            <span><strong>Detailed Help</strong><small>Choose a goal, search the guide, or explore every connected feature.</small></span>
            <em>{openLevel === "detailed" ? "Close" : "Open"}</em>
          </button>
          {openLevel === "detailed" && (
            <div className="howItWorksAccordionBody" id="how-it-works-detailed-panel">
              <section className="howItWorksGoalFinder" aria-labelledby="how-can-we-help-title">
                <h2 id="how-can-we-help-title">How Can We Help You?</h2>
                <div className="howItWorksGoalGrid">
                  {HOW_IT_WORKS_GOALS.map(([label, guideId]) => <button type="button" key={guideId} onClick={() => openGuideFromGoal(guideId)}>{label}</button>)}
                </div>
                <label className="howItWorksSearch"><span>Search How It Works</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by page, feature, or task" /></label>
              </section>

              {HOW_IT_WORKS_CATEGORIES.map((category) => {
                const categoryGuides = filteredGuides.filter((guide) => guide.category === category);
                if (!categoryGuides.length) return null;
                return (
                  <section className="howItWorksCategory" key={category} aria-labelledby={`how-it-works-${category.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>
                    <h2 id={`how-it-works-${category.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}>{category}</h2>
                    {categoryGuides.map((guide) => (
                      <details className="howItWorksGuideCard" id={guide.centralAnchor} key={guide.id} open={query.trim() ? true : undefined}>
                        <summary><strong>{guide.title}</strong><span>{guide.purpose}</span></summary>
                        <div className="howItWorksGuideBody">
                          <div><h3>What It Does</h3><p>{guide.purpose}</p></div>
                          <div><h3>How to Use It</h3><ol>{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
                          <div><h3>Features Included</h3><ul>{guide.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
                          <aside><strong>Helpful Tip</strong><p>{guide.tip}</p></aside>
                          {roadmapId === guide.id && <Roadmap guide={guide} />}
                          <GuideActions guide={guide} setActivePage={setActivePage} onWatchVideo={watchVideo} onRoadmap={() => setRoadmapId((current) => current === guide.id ? "" : guide.id)} />
                        </div>
                      </details>
                    ))}
                  </section>
                );
              })}
              {!filteredGuides.length && <p className="howItWorksNoResults">No instructions match that search. Try a page name such as “Meal Builder,” “Shopping,” or “Backup.”</p>}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export function HowItWorksModalHost({ setActivePage }) {
  const [guideId, setGuideId] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const guide = getHowItWorksGuide(guideId);

  useEffect(() => {
    function openGuide(event) {
      const nextGuide = getHowItWorksGuideForPage(event?.detail?.pageId) || getHowItWorksGuide(event?.detail?.guideId);
      if (!nextGuide) return;
      returnFocusRef.current = document.activeElement;
      setShowRoadmap(false);
      setGuideId(nextGuide.id);
    }
    window.addEventListener(OPEN_EVENT, openGuide);
    return () => window.removeEventListener(OPEN_EVENT, openGuide);
  }, []);

  useEffect(() => {
    if (!guide) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => dialogRef.current?.focus());
    return () => { document.body.style.overflow = previousOverflow; };
  }, [guide]);

  function close() {
    setGuideId("");
    setShowRoadmap(false);
    window.requestAnimationFrame(() => returnFocusRef.current?.focus?.());
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key !== "Tab") return;
    const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function openCompleteGuide() {
    const anchor = guide.centralAnchor;
    close();
    setActivePage("How It Works");
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      const node = document.getElementById(anchor);
      if (!node) return;
      window.history.replaceState(window.history.state, "", `${window.location.pathname}#${anchor}`);
      node.open = true;
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  }

  function openPage() {
    close();
    setActivePage(guide.page);
  }

  function watchVideo() {
    const target = guide;
    close();
    setActivePage(target.page);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      if (target.page === "Home") window.dispatchEvent(new Event(WELCOME_VIDEO_EVENT));
      else window.dispatchEvent(new CustomEvent(HERO_VIDEO_EVENT, { detail: { pageTitle: target.video.pageTitle } }));
    }));
  }

  if (!guide) return null;
  return createPortal(
    <div className="howItWorksModalBackdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section className="howItWorksModal" role="dialog" aria-modal="true" aria-labelledby="how-it-works-modal-title" tabIndex="-1" ref={dialogRef} onKeyDown={handleKeyDown}>
        <header><div><span>How It Works</span><h2 id="how-it-works-modal-title">{guide.title}</h2></div><button type="button" onClick={close} aria-label="Close How It Works">×</button></header>
        <div className="howItWorksModalBody">
          <section><h3>What This Page Does</h3><p>{guide.purpose}</p></section>
          <section><h3>How to Use It</h3><ol>{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol></section>
          <section><h3>Features Included</h3><ul>{guide.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
          <aside><strong>Helpful Tip</strong><p>{guide.tip}</p></aside>
          {showRoadmap && <Roadmap guide={guide} compact />}
        </div>
        <footer>
          <button type="button" onClick={openCompleteGuide}>View Complete How It Works</button>
          {guide.roadmap && <button type="button" onClick={() => setShowRoadmap((current) => !current)}>{showRoadmap ? "Close Roadmap" : "View Roadmap"}</button>}
          {guide.video && <button type="button" onClick={watchVideo}>Watch Video</button>}
          <button type="button" onClick={openPage}>Open Page</button>
          <button type="button" className="primary" onClick={close}>Close</button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
