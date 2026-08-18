import { useRef } from "react";
import "./VideoLibraryPage.css";

export const VIDEO_LIBRARY_ITEMS = [
  {
    section: "Home Page",
    title: "Welcome to Robert’s Recipe Box",
    description: "A short introduction to the site and the practical meal-planning tools available here.",
    video: "videos/welcome-video.mp4",
    poster: "images/video-posters/welcome-video-poster.webp",
    page: "Home",
    pageLabel: "Open Home Page",
  },
  {
    section: "Home Page",
    title: "Easy or Detailed",
    description: "See how to choose the simpler Easy experience or the fuller Detailed experience.",
    video: "videos/easy-or-detailed.mp4",
    poster: "images/video-posters/easy-or-detailed-poster.webp",
    page: "Home",
    pageLabel: "Open Home Page",
  },
  {
    section: "Home Page",
    title: "Quick Dinner Ideas",
    description: "Learn how the rotating dinner ideas help you find a complete meal and open its recipe cards.",
    video: "videos/dinner-ideas.mp4",
    poster: "images/video-posters/dinner-ideas-poster.webp",
    page: "Home",
    pageLabel: "Open Home Page",
  },
  {
    section: "Home Page",
    title: "Diet Meals",
    description: "Explore the lighter Diet Meals rotation and the related Healthy Dinners recipe collection.",
    video: "videos/diet-meals.mp4",
    poster: "images/heroes/hero-page-healthy-dinners.webp",
    page: "Healthy Dinners",
    pageLabel: "Open Healthy Dinners",
  },
  {
    section: "Home Page",
    title: "Choose Your Level",
    description: "A guide to choosing what you want to do and revealing the tools that fit that task.",
    video: "videos/choose-your-level.mp4",
    poster: "images/video-posters/choose-your-level-poster.webp",
    page: "Home",
    pageLabel: "Open Home Page",
  },
  {
    section: "Home Page",
    title: "Browse Our Quick Links",
    description: "See how the category icons provide a quick route into the recipe library.",
    video: "videos/browse-our-quick-links.mp4",
    poster: "images/video-posters/browse-our-quick-links-poster.webp",
    page: "Home",
    pageLabel: "Open Home Page",
  },
  {
    section: "About Us",
    title: "Welcome to Our Site",
    description: "Robert’s welcome and an overview of what visitors can find throughout the site.",
    video: "videos/welcome-to-our-site.mp4",
    poster: "images/video-posters/welcome-to-our-site-poster.webp",
    page: "About",
    pageLabel: "Open Welcome Page",
  },
  {
    section: "About Us",
    title: "Your Data & Security",
    description: "Learn how favorites, plans, notes, inventories, and preferences stay in your browser.",
    video: "videos/your-data-and-security.mp4",
    poster: "images/video-posters/your-data-and-security-poster.webp",
    page: "Your Data & Security",
    pageLabel: "Open Data & Security",
  },
  {
    section: "About Us",
    title: "About Our Recipes",
    description: "An explanation of how the AI-assisted recipes are directed, reviewed, and organized.",
    video: "videos/about-our-recipes.mp4",
    poster: "images/video-posters/about-our-recipes-poster.webp",
    page: "About Recipes",
    pageLabel: "Open About Our Recipes",
  },
  {
    section: "About Us",
    title: "Our Nutrition Standards",
    description: "Review how recipe nutrition is estimated and why actual results can vary.",
    video: "videos/nutrition-standards.mp4",
    poster: "images/heroes/hero-page-healthy-substitutions.webp",
    page: "Nutrition Standards",
    pageLabel: "Open Nutrition Standards",
  },
  {
    section: "About Us",
    title: "Understanding MealBalance",
    description: "Learn how the 1–10 MealBalance guide helps compare lighter, moderate, rich, and indulgent meals.",
    video: "videos/understanding-mealbalance.mp4",
    poster: "images/video-posters/understanding-mealbalance-poster.webp",
    page: "MealBalance Guide",
    pageLabel: "Open MealBalance Guide",
  },
  {
    section: "About Us",
    title: "Affiliate Marketing",
    description: "See how qualifying product links may help support the free site without changing the shopper’s price.",
    video: "videos/affiliate-marketing.mp4",
    poster: "images/video-posters/affiliate-marketing-poster.webp",
    page: "Affiliate Marketing",
    pageLabel: "Open Affiliate Information",
  },
  {
    section: "About Us",
    title: "Backup & Restore",
    description: "Learn how to protect locally saved Recipe Box information with a downloadable backup file.",
    video: "videos/backup-and-restore.mp4",
    poster: "images/video-posters/backup-and-restore-poster.webp",
    page: "User Backup",
    pageLabel: "Open Backup & Restore",
  },
  {
    section: "Our Recipes",
    title: "Browse Our Recipe Library",
    description: "A quick tour of searching, filtering, and opening recipes in the main library.",
    video: "videos/browse-our-recipe-library.mp4",
    poster: "images/video-posters/browse-our-recipe-library-poster.webp",
    page: "Recipes",
    pageLabel: "Open Recipe Library",
  },
  {
    section: "Our Recipes",
    title: "Salad Jar Lunches",
    description: "Explore the Salad Jar Lunches collection and its recipe-finding controls.",
    video: "videos/salad-jars.mp4",
    poster: "images/heroes/hero-page-salad-jars.webp",
    page: "Salad Jars",
    pageLabel: "Open Salad Jar Lunches",
  },
  {
    section: "Our Recipes",
    title: "Slow Cooker Meals",
    description: "Explore the Crock Pot recipe collection and practical slow-cooker meal ideas.",
    video: "videos/crock-pot-meals.mp4",
    poster: "images/heroes/hero-page-crockpot.webp",
    page: "Slow Cooker Favorites",
    pageLabel: "Open Slow Cooker Meals",
  },
];

function siteAsset(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export default function VideoLibraryPage({ setActivePage }) {
  const videoRefs = useRef([]);
  const sections = VIDEO_LIBRARY_ITEMS.reduce((groups, item, index) => {
    const previousGroup = groups[groups.length - 1];
    if (!previousGroup || previousGroup.name !== item.section) {
      groups.push({ name: item.section, items: [{ item, index }] });
    } else {
      previousGroup.items.push({ item, index });
    }
    return groups;
  }, []);

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
          Watch the site’s short guides in the same order you encounter them while exploring
          Robert’s Recipe Box. Each video is listed once and includes a link to the section it explains.
        </p>
      </header>

      <div className="videoLibrarySections" aria-label="Robert’s Recipe Box video guides">
        {sections.map((section) => (
          <section className="videoLibrarySection" key={section.name}>
            <h3 className="videoLibrarySectionTitle">
              <span>{section.name}</span>
            </h3>
            <div className="videoLibraryGrid">
              {section.items.map(({ item, index }) => (
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
          </section>
        ))}
      </div>
    </main>
  );
}
