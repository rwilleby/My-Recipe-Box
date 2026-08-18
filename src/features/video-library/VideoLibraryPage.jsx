import { useRef } from "react";
import "./VideoLibraryPage.css";

export const VIDEO_LIBRARY_ITEMS = [
  {
    phase: "Getting Started",
    title: "Welcome to Robert’s Recipe Box",
    description: "A short introduction to the site and the practical meal-planning tools available here.",
    video: "videos/welcome-video.mp4",
    poster: "images/video-posters/library/welcome-video.webp",
    page: "Home",
    pageLabel: "Open Home Page",
  },
  {
    phase: "Getting Started",
    title: "Welcome to Our Site",
    description: "Robert’s welcome and an overview of what visitors can find throughout the site.",
    video: "videos/welcome-to-our-site.mp4",
    poster: "images/video-posters/library/welcome-to-our-site.webp",
    page: "About",
    pageLabel: "Open Welcome Page",
  },
  {
    phase: "Getting Started",
    title: "Easy or Detailed",
    description: "See how to choose the simpler Easy experience or the fuller Detailed experience.",
    video: "videos/easy-or-detailed.mp4",
    poster: "images/video-posters/library/easy-or-detailed.webp",
    page: "Home",
    pageLabel: "Open Home Page",
  },
  {
    phase: "Getting Started",
    title: "Choose Your Level",
    description: "A guide to choosing what you want to do and revealing the tools that fit that task.",
    video: "videos/choose-your-level.mp4",
    poster: "images/video-posters/library/choose-your-level.webp",
    page: "Home",
    pageLabel: "Open Home Page",
  },
  {
    phase: "Find & Plan Meals",
    title: "Browse Our Quick Links",
    description: "See how the category icons provide a quick route into the recipe library.",
    video: "videos/browse-our-quick-links.mp4",
    poster: "images/video-posters/library/browse-our-quick-links.webp",
    page: "Home",
    pageLabel: "Open Home Page",
  },
  {
    phase: "Find & Plan Meals",
    title: "Browse Our Recipe Library",
    description: "A quick tour of searching, filtering, and opening recipes in the main library.",
    video: "videos/browse-our-recipe-library.mp4",
    poster: "images/video-posters/library/browse-our-recipe-library.webp",
    page: "Recipes",
    pageLabel: "Open Recipe Library",
  },
  {
    phase: "Find & Plan Meals",
    title: "Quick Dinner Ideas",
    description: "Learn how the rotating dinner ideas help you find a complete meal and open its recipe cards.",
    video: "videos/dinner-ideas.mp4",
    poster: "images/video-posters/library/dinner-ideas.webp",
    page: "Home",
    pageLabel: "Open Home Page",
  },
  {
    phase: "Find & Plan Meals",
    title: "Diet Meals",
    description: "Explore the lighter Diet Meals rotation and the related Healthy Dinners recipe collection.",
    video: "videos/diet-meals.mp4",
    poster: "images/video-posters/library/diet-meals.webp",
    page: "Healthy Dinners",
    pageLabel: "Open Healthy Dinners",
  },
  {
    phase: "Find & Plan Meals",
    title: "Salad Jar Lunches",
    description: "Explore the Salad Jar Lunches collection and its recipe-finding controls.",
    video: "videos/salad-jars.mp4",
    poster: "images/video-posters/library/salad-jars.webp",
    page: "Salad Jars",
    pageLabel: "Open Salad Jar Lunches",
  },
  {
    phase: "Find & Plan Meals",
    title: "Slow Cooker Meals",
    description: "Explore the Crock Pot recipe collection and practical slow-cooker meal ideas.",
    video: "videos/crock-pot-meals.mp4",
    poster: "images/video-posters/library/crock-pot-meals.webp",
    page: "Slow Cooker Favorites",
    pageLabel: "Open Slow Cooker Meals",
  },
  {
    phase: "Understand the Site",
    title: "About Our Recipes",
    description: "An explanation of how the AI-assisted recipes are directed, reviewed, and organized.",
    video: "videos/about-our-recipes.mp4",
    poster: "images/video-posters/library/about-our-recipes.webp",
    page: "About Recipes",
    pageLabel: "Open About Our Recipes",
  },
  {
    phase: "Understand the Site",
    title: "Our Nutrition Standards",
    description: "Review how recipe nutrition is estimated and why actual results can vary.",
    video: "videos/nutrition-standards.mp4",
    poster: "images/video-posters/library/nutrition-standards.webp",
    page: "Nutrition Standards",
    pageLabel: "Open Nutrition Standards",
  },
  {
    phase: "Understand the Site",
    title: "Understanding MealBalance",
    description: "Learn how the 1–10 MealBalance guide helps compare lighter, moderate, rich, and indulgent meals.",
    video: "videos/understanding-mealbalance.mp4",
    poster: "images/video-posters/library/understanding-mealbalance.webp",
    page: "MealBalance Guide",
    pageLabel: "Open MealBalance Guide",
  },
  {
    phase: "Protect Your Recipe Box",
    title: "Your Data & Security",
    description: "Learn how favorites, plans, notes, inventories, and preferences stay in your browser.",
    video: "videos/your-data-and-security.mp4",
    poster: "images/video-posters/library/your-data-and-security.webp",
    page: "Your Data & Security",
    pageLabel: "Open Data & Security",
  },
  {
    phase: "Protect Your Recipe Box",
    title: "Backup & Restore",
    description: "Learn how to protect locally saved Recipe Box information with a downloadable backup file.",
    video: "videos/backup-and-restore.mp4",
    poster: "images/video-posters/library/backup-and-restore.webp",
    page: "User Backup",
    pageLabel: "Open Backup & Restore",
  },
  {
    phase: "Support the Free Site",
    title: "Affiliate Marketing",
    description: "See how qualifying product links may help support the free site without changing the shopper’s price.",
    video: "videos/affiliate-marketing.mp4",
    poster: "images/video-posters/library/affiliate-marketing.webp",
    page: "Affiliate Marketing",
    pageLabel: "Open Affiliate Information",
  },
];

function siteAsset(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export default function VideoLibraryPage({ setActivePage }) {
  const videoRefs = useRef([]);

  function handlePlay(activeIndex) {
    videoRefs.current.forEach((player, index) => {
      if (player && index !== activeIndex && !player.paused) player.pause();
    });
  }

  function openAssociatedPage(page) {
    setActivePage(page);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  return (
    <main className="pageShell videoLibraryPage">
      <header className="videoLibraryIntro">
        <span className="videoLibraryEyebrow">WATCH & LEARN</span>
        <h2>Video Library</h2>
        <p>
          Follow the story of Robert’s Recipe Box from getting started, to finding meals,
          understanding the recipe standards, and protecting your saved information.
          Each video is listed once and includes a link to the section it explains.
        </p>
      </header>

      <div className="videoLibraryGrid" aria-label="Robert’s Recipe Box video timeline">
        {VIDEO_LIBRARY_ITEMS.map((item, index) => (
          <article className="videoLibraryCard" key={item.video}>
                <div className="videoLibraryPlayerFrame">
                  <video
                    ref={(node) => {
                      videoRefs.current[index] = node;
                    }}
                    controls
                    playsInline
                    preload="metadata"
                    poster={siteAsset(item.poster)}
                    onPlay={() => handlePlay(index)}
                    aria-label={`Watch ${item.title}`}
                  >
                    <source src={siteAsset(item.video)} type="video/mp4" />
                    Your browser does not support HTML5 video.
                  </video>
                </div>
                <div className="videoLibraryCardCopy">
                  <span className="videoLibraryPhase">{item.phase}</span>
                  <span className="videoLibraryNumber">VIDEO {String(index + 1).padStart(2, "0")}</span>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <button type="button" onClick={() => openAssociatedPage(item.page)}>
                    {item.pageLabel}
                  </button>
                </div>
          </article>
        ))}
      </div>
    </main>
  );
}
