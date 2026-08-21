import VideoIcon from "../../components/VideoIcon";
import { categories } from "../../data/recipes";

export const CATEGORY_ICON_IMAGES = {
  AM: "images/categories/AM.webp",
  AS: "images/categories/AS.webp",
  CC: "images/categories/CC.webp",
  CO: "images/categories/CO.webp",
  CP: "images/icons/CP-bulk.webp",
  CR: "images/categories/CR.webp",
  DN: "images/categories/DN.webp",
  DM: "images/categories/DM.webp",
  DS: "images/categories/DS.webp",
  HB: "images/categories/HB.webp",
  IT: "images/categories/IT.webp",
  JJ: "images/categories/JJ.webp",
  KR: "images/categories/KR.webp",
  LF: "images/categories/LF.webp",
  MX: "images/categories/MX.webp",
  PM: "images/categories/PM.webp",
  QP: "images/categories/QP.webp",
  CS: "images/categories/CS.webp",
  SB: "images/categories/SB.webp",
  SD: "images/categories/SD.webp",
  SF: "images/categories/SF.webp",
  SG: "images/categories/SG.webp",
  SW: "images/categories/SW.webp",
};

export const HOME_CATEGORY_CODES = [
  "AM", "AS", "IT", "MX", "SF", "DM", "QP", "CS", "CP", "SB", "SG", "SD", "DS",
  "HB", "SW", "LF", "PM", "KR", "CC", "CO", "CR", "DN", "JJ",
];

export const HOME_CATEGORY_LABELS = {
  AM: "American",
  AS: "Asian",
  CC: "Cheesecakes",
  CO: "Cobblers",
  CP: "Crock Pot",
  CR: "Cinnamon Rolls",
  DN: "Donuts",
  DM: "Diet Meals",
  DS: "Desserts",
  HB: "Hamburgers",
  IT: "Italian",
  JJ: "Jams & Jellies",
  KR: "Kolaches",
  LF: "Loafs & Rolls",
  MX: "Mexican",
  PM: "Protein Muffins",
  QP: "Quiche & Pies",
  CS: "Casseroles",
  SB: "Salads",
  SD: "Side Dishes",
  SF: "Seafood",
  SG: "Meats",
  SW: "Sandwiches",
};

export const HOME_CATEGORY_FALLBACKS = {
  AM: { id: "AM", name: "American Cuisine", count: 0, icon: "plate" },
  AS: { id: "AS", name: "Asian Cuisine", count: 0, icon: "🍜" },
  CC: { id: "CC", name: "Cheesecakes", count: 0, icon: "🍰" },
  CO: { id: "CO", name: "Cobblers", count: 0, icon: "🥧" },
  CP: { id: "CP", name: "Crock Pot Meals", count: 0, icon: "🍲" },
  CR: { id: "CR", name: "Cinnamon Rolls", count: 0, icon: "🌀" },
  DN: { id: "DN", name: "Donuts", count: 0, icon: "🍩" },
  DM: { id: "DM", name: "Diet Meals", count: 0, icon: "🥗" },
  DS: { id: "DS", name: "Desserts", count: 0, icon: "🍰" },
  HB: { id: "HB", name: "Hamburgers", count: 0, icon: "🍔" },
  IT: { id: "IT", name: "Italian Cuisine", count: 0, icon: "🍝" },
  JJ: { id: "JJ", name: "Jams & Jellies", count: 0, icon: "🍓" },
  KR: { id: "KR", name: "Kolaches", count: 0, icon: "🥐" },
  LF: { id: "LF", name: "Loafs & Rolls", count: 0, icon: "🍞" },
  MX: { id: "MX", name: "Mexican Cuisine", count: 0, icon: "🌮" },
  PM: { id: "PM", name: "Protein Muffins", count: 0, icon: "🧁" },
  QP: { id: "QP", name: "Quiche & Pies", count: 0, icon: "🥧" },
  CS: { id: "CS", name: "Casseroles", count: 0, icon: "pan" },
  SB: { id: "SB", name: "Salads & Bowls", count: 0, icon: "🥗" },
  SD: { id: "SD", name: "Side Dishes", count: 0, icon: "pot" },
  SF: { id: "SF", name: "Seafood Dishes", count: 0, icon: "🐟" },
  SG: { id: "SG", name: "Smoked & Grilled Meats", count: 0, icon: "🔥" },
  SW: { id: "SW", name: "Sandwiches", count: 0, icon: "🥪" },
};

const QUICK_LINKS_VIDEO_URL = "videos/browse-our-quick-links.mp4";
const QUICK_LINKS_VIDEO_POSTER = "images/video-posters/browse-our-quick-links-poster.webp";

export default function HomeCategoryGrid({
  setFilter,
  setActivePage,
  SectionIntro,
  SupplementalHoverVideo,
}) {
  const categoryLookup = new Map(categories.map((category) => [category.id, category]));
  const homeCategories = HOME_CATEGORY_CODES.slice(0, 13).map((code) => ({
    ...HOME_CATEGORY_FALLBACKS[code],
    ...(categoryLookup.get(code) || {}),
    displayName: code === "QP"
      ? "Quiche"
      : code === "SD"
        ? "Sides"
        : HOME_CATEGORY_LABELS[code],
    iconImage: CATEGORY_ICON_IMAGES[code],
  }));

  function openCategory(category) {
    if (category.id === "CP") {
      setActivePage("Slow Cooker Favorites");
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }));
      return;
    }

    const matchingCategory = categories.find((item) => item.id === category.id);
    setFilter(matchingCategory?.name || category.name);
    setActivePage("Recipes");
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }));
  }

  return (
    <section className="section homeCategorySection">
      <SectionIntro
        title="Cuisine Quick Links"
        text="Jump directly to the cuisines and recipe groups you use most often."
        className="cuisineQuickLinksSectionIntro"
        video={
          <SupplementalHoverVideo
            src={QUICK_LINKS_VIDEO_URL}
            poster={QUICK_LINKS_VIDEO_POSTER}
            title="Browse Our Quick Links overview video"
            className="homeQuickLinksVideoTrigger"
          >
            <span className="supplementalVideoIcon">
              <VideoIcon role="supplemental" alt="" className="supplementalVideoIconGray" />
              <VideoIcon role="main" alt="" className="supplementalVideoIconRed" />
            </span>
          </SupplementalHoverVideo>
        }
      />

      <nav
        className="categoryGrid homeCategoryGrid libraryCategorySelectorRow homeCuisineSelectorRow"
        aria-label="Cuisine Quick Links"
      >
        <button
          type="button"
          className="categoryTile homeCategoryTile homeFavoritesCategoryTile libraryCategorySelectorItem"
          onClick={() => {
            setActivePage("Favorites");
            window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
              window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            }));
          }}
          aria-label="View favorite recipes and combo meals"
        >
          <img
            className="categoryIconImage homeFavoritesCategoryIcon"
            src={`${import.meta.env.BASE_URL}images/category-icons/favorites.webp`}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
          />
          <span className="categoryIcon categoryIconFallback" aria-hidden="true">♥</span>
          <strong>Favorites</strong>
        </button>

        {homeCategories.map((category) => (
          <button
            key={category.id}
            className={`categoryTile homeCategoryTile libraryCategorySelectorItem${category.id === "CP" ? " category-cp" : ""}`}
            onClick={() => openCategory(category)}
            aria-label={`View ${category.displayName} recipes`}
          >
            <img
              className={`categoryIconImage${category.id === "CP" ? " crockPotCategoryIcon" : ""}`}
              src={`${import.meta.env.BASE_URL}${category.iconImage}`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                const fallback = event.currentTarget.nextElementSibling;
                if (fallback) fallback.style.display = "grid";
              }}
            />
            <span className="categoryIcon categoryIconFallback" aria-hidden="true">{category.icon}</span>
            <strong>{category.displayName}</strong>
          </button>
        ))}
      </nav>
    </section>
  );
}
