import { normalize } from "./rfisCore.js";

export function createHeroService({ placeholder = "images/heroes/hero-in-production.webp" } = {}) {
  function status(record) { return normalize(record?.hero?.status || record?.heroStatus || "not-started"); }
  function approved(record) { return ["approved", "published"].includes(status(record)); }
  function large(record) { return approved(record) ? (record?.hero?.large || record?.heroFilename || null) : placeholder; }
  function thumbnail(record) { return approved(record) ? (record?.hero?.thumbnail || null) : placeholder; }

  return Object.freeze({ status, approved, large, thumbnail, placeholder });
}

export default createHeroService;
