import { normalize } from "./rfisCore.js";

const DEFAULT_PLACEHOLDER = "images/heroes/hero-in-production.webp";
const APPROVED_STATUSES = new Set(["approved", "published"]);

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeAssetPath(value, fallbackDirectory = "images/dinner-combinations") {
  const text = String(value ?? "").trim();
  if (!text) return null;
  if (
    text.startsWith("/") ||
    text.startsWith("http://") ||
    text.startsWith("https://") ||
    text.startsWith("data:") ||
    text.includes("/")
  ) {
    return text.replace(/^\/+/, "");
  }
  return `${fallbackDirectory}/${text}`;
}

function mealNumber(record) {
  const direct = Number(record?.number);
  if (Number.isFinite(direct) && direct > 0) return direct;

  const raw = record?.legacyId || record?.id || "";
  const match = String(raw).match(/(?:meal|cd)-0*(\d+)/i);
  return match ? Number(match[1]) : null;
}

export function createHeroService({
  placeholder = DEFAULT_PLACEHOLDER,
  dinnerDirectory = "images/dinner-combinations",
} = {}) {
  function status(record) {
    return normalize(record?.hero?.status || record?.heroStatus || "not-started");
  }

  function approved(record) {
    return APPROVED_STATUSES.has(status(record));
  }

  function canonicalLarge(record) {
    return normalizeAssetPath(
      record?.hero?.image ||
      record?.hero?.large ||
      record?.heroFilename ||
      record?.image,
      dinnerDirectory
    );
  }

  function canonicalThumbnail(record) {
    return normalizeAssetPath(
      record?.hero?.thumbnail ||
      record?.thumbnail,
      dinnerDirectory
    );
  }

  function large(record) {
    return approved(record) ? canonicalLarge(record) : placeholder;
  }

  function thumbnail(record) {
    if (!approved(record)) return placeholder;
    return canonicalThumbnail(record) || canonicalLarge(record) || placeholder;
  }

  function candidates(record, { variant = "large" } = {}) {
    if (!approved(record)) return [];
    if (variant === "thumbnail") {
      return unique([canonicalThumbnail(record), canonicalLarge(record)]);
    }
    return unique([canonicalLarge(record)]);
  }

  function fallback(record, { message = "New hero in production" } = {}) {
    const number = mealNumber(record);
    return {
      status: status(record),
      approved: approved(record),
      label: number ? `Meal #${number}` : "Complete Dinner",
      message,
      placeholder,
    };
  }

  function view(record) {
    return Object.freeze({
      status: status(record),
      approved: approved(record),
      large: large(record),
      thumbnail: thumbnail(record),
      largeCandidates: candidates(record, { variant: "large" }),
      thumbnailCandidates: candidates(record, { variant: "thumbnail" }),
      fallback: fallback(record),
    });
  }

  return Object.freeze({
    status,
    approved,
    large,
    thumbnail,
    candidates,
    fallback,
    view,
    placeholder,
  });
}

export default createHeroService;
