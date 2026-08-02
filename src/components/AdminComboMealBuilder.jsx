import { useEffect, useMemo, useRef, useState } from "react";
import "./AdminComboMealBuilder.css";
import HelpTooltip from "./HelpTooltip";
import {
  DINNER_PROTEIN_FILTERS,
  DINNER_SIDE_FILTERS,
  dinnerCombinations,
} from "../data/dinnerCombinations";

const STORAGE_KEY = "rrb_adminComboMealLibrary";
const RECIPE_HERO_OVERRIDE_KEY = "rrb_recipeHeroOverrides_v1";
const SCHEMA_VERSION = 1;

const STATUSES = [
  "Draft",
  "Ready for Processing",
  "Request Exported",
  "Processed — Needs Approval",
  "Approved",
  "Published",
  "Needs Revision",
];

const SLOT_DEFINITIONS = [
  { key: "main", label: "MAIN", required: true, group: "main" },
  { key: "dish1", label: "DISH 1", required: false, group: "supporting" },
  { key: "dish2", label: "DISH 2", required: false, group: "supporting" },
  { key: "dish3", label: "DISH 3", required: false, group: "supporting" },
  { key: "dish4", label: "DISH 4", required: false, group: "supporting" },
];

const PORTIONS = [
  { value: "0.25", label: "¼ serving" },
  { value: "0.5", label: "½ serving" },
  { value: "0.75", label: "¾ serving" },
  { value: "1", label: "1 serving" },
  { value: "1.5", label: "1½ servings" },
  { value: "2", label: "2 servings" },
  { value: "custom", label: "Custom amount" },
];

const NUTRIENTS = [
  ["calories", "Calories", ""],
  ["totalFat", "Total fat", "g"],
  ["saturatedFat", "Saturated fat", "g"],
  ["cholesterol", "Cholesterol", "mg"],
  ["sodium", "Sodium", "mg"],
  ["totalCarbohydrate", "Total carbohydrate", "g"],
  ["dietaryFiber", "Dietary fiber", "g"],
  ["totalSugars", "Total sugars", "g"],
  ["addedSugars", "Added sugars", "g"],
  ["protein", "Protein", "g"],
];


function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadLibrary() {
  if (typeof window === "undefined") return [];
  const value = safeParse(window.localStorage.getItem(STORAGE_KEY), []);
  return Array.isArray(value) ? value : [];
}

function saveLibrary(records) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function padCode(value) {
  return `CM-${String(value).padStart(3, "0")}`;
}

function nextComboCode(records) {
  const highest = records.reduce((max, item) => {
    const number = Number(String(item?.comboCode || "").match(/CM-(\d+)/i)?.[1] || 0);
    return Math.max(max, number);
  }, 0);
  return padCode(highest + 1);
}

function emptySelections() {
  return { main: null, dish1: null, dish2: null, dish3: null, dish4: null };
}

function createDraft(records) {
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    comboCode: nextComboCode(records),
    revision: 1,
    mealName: "",
    description: "",
    notes: "",
    publicMealId: null,
    heroImage: "",
    freezerLife: "",
    ovenInstructions: "",
    microwaveInstructions: "",
    groceryNotes: "",
    status: "Draft",
    selections: emptySelections(),
    nutritionSummary: null,
    nutritionNeedsRecalculation: false,
    heroPossiblyOutdated: false,
    activeProcessed: null,
    pendingImport: null,
    importHistory: [],
    createdAt: now,
    updatedAt: now,
  };
}

function mealNumberFromCode(value) {
  const match = String(value || "").trim().match(/^(?:meal|cm)[-\s]?(\d+)$/i);
  return match ? Number(match[1]) : null;
}

function publicMealId(number) {
  return `meal-${String(number).padStart(3, "0")}`;
}

function comboCodeFromNumber(number) {
  return `CM-${String(number).padStart(3, "0")}`;
}

function recipeById(recipes, recipeId) {
  return recipes.find((recipe) => String(recipe.id).toUpperCase() === String(recipeId).toUpperCase());
}

function selectionFromPublishedItem(recipes, recipeId, fallbackName, servingText, position) {
  if (!recipeId && !fallbackName) return null;
  const recipe = recipeId ? recipeById(recipes, recipeId) : null;
  if (recipe) {
    return {
      ...makeSelection(recipe),
      position,
      servingText: servingText || "",
    };
  }
  return {
    recipeId: recipeId || "UNLINKED",
    recipeName: fallbackName || "Unlinked published item",
    categoryCode: recipeId ? String(recipeId).split("-")[0].toUpperCase() : "",
    category: "Published text — select a recipe to link",
    heroImage: "",
    portion: "1",
    customMultiplier: "",
    servingText: servingText || "",
    nutrition: null,
    position,
    sourceSnapshot: null,
  };
}

function recordFromPublishedMeal(meal, recipes) {
  const number = Number(meal.number || mealNumberFromCode(meal.id));
  const selections = emptySelections();
  selections.main = selectionFromPublishedItem(
    recipes,
    meal.mainRecipeId,
    meal.mainDish || meal.title,
    meal.mainServing,
    "main",
  );
  (meal.sides || []).slice(0, 4).forEach((side, index) => {
    const key = `dish${index + 1}`;
    selections[key] = selectionFromPublishedItem(
      recipes,
      side.recipeId,
      side.name,
      side.serving,
      key,
    );
  });
  const now = new Date().toISOString();
  return {
    schemaVersion: SCHEMA_VERSION,
    comboCode: comboCodeFromNumber(number),
    publicMealId: meal.id || publicMealId(number),
    revision: 1,
    mealName: meal.title || "",
    description: meal.subtitle || "",
    notes: "",
    heroImage: meal.image || "",
    freezerLife: meal.freezerLife || "",
    ovenInstructions: meal.ovenInstructions || "",
    microwaveInstructions: meal.microwaveInstructions || "",
    groceryNotes: meal.groceryNotes || "",
    status: "Published",
    selections,
    nutritionSummary: null,
    nutritionNeedsRecalculation: false,
    heroPossiblyOutdated: false,
    activeProcessed: null,
    pendingImport: null,
    importHistory: [],
    sourcePublishedSnapshot: meal,
    createdAt: now,
    updatedAt: now,
  };
}

function publishedMealFromRecord(record) {
  const source = record.sourcePublishedSnapshot || {};
  const number = mealNumberFromCode(record.publicMealId || record.comboCode);
  const main = record.selections?.main;
  const sides = ["dish1", "dish2", "dish3", "dish4"]
    .map((key) => record.selections?.[key])
    .filter(Boolean)
    .map((item) => ({
      name: item.recipeName,
      serving: item.servingText || "1 serving",
      recipeId: item.recipeId === "UNLINKED" ? undefined : item.recipeId,
    }));
  const values = record.nutritionSummary?.values || {};
  return {
    ...source,
    id: record.publicMealId || publicMealId(number),
    image: record.heroImage || source.image || `images/dinner-combinations/${publicMealId(number)}.webp`,
    number,
    title: record.mealName,
    subtitle: record.description,
    mainDish: main?.recipeName || record.mealName,
    mainServing: main?.servingText || source.mainServing || "1 serving",
    mainRecipeId: main?.recipeId === "UNLINKED" ? undefined : main?.recipeId,
    sides,
    calories: Number.isFinite(values.calories) ? values.calories : source.calories,
    protein: Number.isFinite(values.protein) ? values.protein : source.protein,
    carbs: Number.isFinite(values.totalCarbohydrate) ? values.totalCarbohydrate : source.carbs,
    fat: Number.isFinite(values.totalFat) ? values.totalFat : source.fat,
    fiber: Number.isFinite(values.dietaryFiber) ? values.dietaryFiber : source.fiber,
    freezerLife: record.freezerLife || "",
    ovenInstructions: record.ovenInstructions || "",
    microwaveInstructions: record.microwaveInstructions || "",
    groceryNotes: record.groceryNotes || undefined,
  };
}

function getCode(recipe) {
  return String(recipe?.categoryCode || recipe?.id?.split("-")[0] || "").toUpperCase();
}

const SUPPORTING_CATEGORY_CODES = new Set([
  "SD", "SB", "SL", "DS", "CC", "CO", "CR", "DN", "JJ", "LF",
  "MR", "RS", "QP", "PM", "SO", "AP", "DR", "SA", "CN",
]);

const MAIN_EXCLUDED_CODES = new Set([
  ...SUPPORTING_CATEGORY_CODES,
]);

function categoryLabel(recipe) {
  return String(recipe?.category || recipe?.categoryCode || getCode(recipe) || "Other");
}

function groupForRecipe(recipe) {
  const code = getCode(recipe);
  if (SUPPORTING_CATEGORY_CODES.has(code)) return "supporting";
  if (!MAIN_EXCLUDED_CODES.has(code)) return "main";
  return "supporting";
}

function isAllowed(recipe, slotKey) {
  const slot = SLOT_DEFINITIONS.find((item) => item.key === slotKey);
  if (!slot) return false;
  return slot.key === "main"
    ? groupForRecipe(recipe) === "main"
    : groupForRecipe(recipe) === "supporting";
}

function heroPath(recipe) {
  let overrides = {};
  if (typeof window !== "undefined") {
    try { overrides = JSON.parse(window.localStorage.getItem(RECIPE_HERO_OVERRIDE_KEY) || "{}"); } catch {}
  }
  const recipeCode = String(recipe?.id || recipe?.recipeId || "").toUpperCase();
  return overrides[recipeCode] || recipe?.heroImage || recipe?.image || recipe?.cardImage || "";
}

function imageUrl(path) {
  if (!path) return "";
  if (/^(data:|blob:|https?:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;
}

function normalizeNutrition(recipe) {
  const source = recipe?.nutrition || recipe?.nutritionFacts || recipe?.perServingNutrition || null;
  const aliases = {
    calories: ["calories", "kcal"],
    totalFat: ["totalFat", "fat"],
    saturatedFat: ["saturatedFat", "satFat"],
    cholesterol: ["cholesterol"],
    sodium: ["sodium"],
    totalCarbohydrate: ["totalCarbohydrate", "carbohydrates", "carbs"],
    dietaryFiber: ["dietaryFiber", "fiber"],
    totalSugars: ["totalSugars", "sugars"],
    addedSugars: ["addedSugars"],
    protein: ["protein"],
  };

  const values = {};
  let found = false;
  Object.entries(aliases).forEach(([key, candidates]) => {
    const value = candidates
      .map((candidate) => source?.[candidate] ?? recipe?.[candidate])
      .find((candidate) => candidate !== undefined && candidate !== null && candidate !== "");
    const number = Number(value);
    values[key] = Number.isFinite(number) ? number : null;
    if (values[key] !== null) found = true;
  });

  if (!found) return null;
  return {
    basis: "per serving",
    verification:
      source?.verification ||
      source?.status ||
      recipe?.nutritionStatus ||
      (source?.verified === true ? "verified" : "provisional"),
    values,
  };
}

function portionMultiplier(selection) {
  if (!selection) return 0;
  if (selection.portion === "custom") {
    const value = Number(selection.customMultiplier);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }
  const value = Number(selection.portion);
  return Number.isFinite(value) ? value : 0;
}

function calculateNutrition(selections) {
  const selected = SLOT_DEFINITIONS
    .map((slot) => ({ slot, selection: selections[slot.key] }))
    .filter((item) => item.selection);

  const totals = Object.fromEntries(NUTRIENTS.map(([key]) => [key, 0]));
  const missing = [];
  const provisional = [];
  const sources = [];
  const availableCounts = Object.fromEntries(NUTRIENTS.map(([key]) => [key, 0]));

  selected.forEach(({ slot, selection }) => {
    const multiplier = portionMultiplier(selection);
    const nutrition = selection.nutrition;
    sources.push({
      slot: slot.key,
      recipeId: selection.recipeId,
      recipeName: selection.recipeName,
      portion: selection.portion,
      customMultiplier: selection.customMultiplier || null,
      multiplier,
      nutrition,
    });

    if (!nutrition || multiplier <= 0) {
      missing.push(selection.recipeId);
      return;
    }

    if (String(nutrition.verification || "").toLowerCase() !== "verified") {
      provisional.push(selection.recipeId);
    }

    NUTRIENTS.forEach(([key]) => {
      const value = nutrition.values?.[key];
      if (Number.isFinite(value)) {
        totals[key] += value * multiplier;
        availableCounts[key] += 1;
      }
    });
  });

  const totalSelected = selected.length;
  const values = {};
  NUTRIENTS.forEach(([key]) => {
    values[key] =
      totalSelected > 0 && availableCounts[key] === totalSelected
        ? Number(totals[key].toFixed(2))
        : null;
  });

  return {
    status:
      missing.length > 0
        ? "incomplete"
        : provisional.length > 0
          ? "estimated"
          : totalSelected > 0
            ? "complete"
            : "empty",
    values,
    missingRecipeIds: [...new Set(missing)],
    provisionalRecipeIds: [...new Set(provisional)],
    sources,
    calculatedAt: new Date().toISOString(),
  };
}

function makeSelection(recipe) {
  return {
    recipeId: recipe.id,
    recipeName: recipe.title,
    categoryCode: getCode(recipe),
    category: categoryLabel(recipe),
    heroImage: heroPath(recipe),
    portion: "1",
    customMultiplier: "",
    nutrition: normalizeNutrition(recipe),
    sourceSnapshot: {
      id: recipe.id,
      title: recipe.title,
      categoryCode: getCode(recipe),
      category: categoryLabel(recipe),
      heroImage: heroPath(recipe),
      image: recipe.image || "",
      cardImage: recipe.cardImage || "",
      servings: recipe.servings ?? null,
      nutrition: normalizeNutrition(recipe),
    },
  };
}

function componentSignature(record) {
  return SLOT_DEFINITIONS.map((slot) => {
    const item = record?.selections?.[slot.key];
    return {
      slot: slot.key,
      recipeId: item?.recipeId || null,
      multiplier: item ? portionMultiplier(item) : null,
    };
  });
}

function importedSelections(data) {
  if (data?.selections) return data.selections;
  const output = emptySelections();
  const components = Array.isArray(data?.components) ? data.components : [];
  components.forEach((item) => {
    const key = item.slot || item.type;
    if (key && key in output) {
      output[key] = {
        recipeId: item.recipeId || item.code,
        recipeName: item.recipeName || item.name || "",
        portion: String(item.portion ?? item.multiplier ?? "1"),
        customMultiplier: item.customMultiplier || "",
      };
    }
  });
  return output;
}

function compareImport(current, imported) {
  const errors = [];
  const warnings = [];
  if (!imported?.comboCode) errors.push("Imported JSON does not include comboCode.");
  if (imported?.comboCode && imported.comboCode !== current.comboCode) {
    errors.push(`Combo code mismatch: expected ${current.comboCode}, received ${imported.comboCode}.`);
  }
  if (Number(imported?.revision) !== Number(current.revision)) {
    errors.push(`Revision mismatch: expected ${current.revision}, received ${imported?.revision ?? "none"}.`);
  }

  const existing = componentSignature(current);
  const incoming = componentSignature({ selections: importedSelections(imported) });
  existing.forEach((item, index) => {
    const other = incoming[index];
    if (item.recipeId !== other.recipeId) {
      errors.push(
        `${SLOT_DEFINITIONS[index].label} mismatch: expected ${item.recipeId || "empty"}, received ${other.recipeId || "empty"}.`,
      );
    } else if (
      item.recipeId &&
      Number(item.multiplier || 0).toFixed(3) !== Number(other.multiplier || 0).toFixed(3)
    ) {
      errors.push(
        `${SLOT_DEFINITIONS[index].label} portion mismatch: expected ${item.multiplier}, received ${other.multiplier}.`,
      );
    }

    const existingCategory = current?.selections?.[item.slot]?.category || null;
    const incomingCategory =
      importedSelections(imported)?.[item.slot]?.category ||
      importedSelections(imported)?.[item.slot]?.recipeCategory ||
      null;

    if (item.recipeId && incomingCategory && existingCategory && incomingCategory !== existingCategory) {
      errors.push(
        `${SLOT_DEFINITIONS[index].label} category mismatch: expected ${existingCategory}, received ${incomingCategory}.`,
      );
    }
  });

  if (!imported?.nutrition && !imported?.processedNutrition) {
    warnings.push("The import does not contain processed nutrition.");
  }
  if (!imported?.mealBalance) warnings.push("The import does not contain MealBalance data.");
  return { errors, warnings, existing, incoming };
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadJson(data, filename) {
  downloadBlob(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    filename,
  );
}

function downloadText(text, filename, type = "text/plain") {
  downloadBlob(new Blob([text], { type }), filename);
}

function humanRequest(record) {
  const lines = [
    "COMBO-MEAL PROCESSING REQUEST",
    "",
    `Combo code: ${record.comboCode}`,
    `Revision: ${record.revision}`,
    `Meal name: ${record.mealName || "(not named)"}`,
    `Status: ${record.status}`,
    `Description: ${record.description || "(none)"}`,
    `Published meal ID: ${record.publicMealId || "(new combo)"}`,
    `Hero assignment: ${record.heroImage || "(none)"}`,
    "",
  ];

  SLOT_DEFINITIONS.forEach((slot) => {
    const item = record.selections[slot.key];
    lines.push(`${slot.label}:`);
    if (!item) {
      lines.push("(not selected)", "");
      return;
    }
    const portionLabel =
      item.portion === "custom"
        ? `${item.customMultiplier || "unspecified"} serving multiplier`
        : PORTIONS.find((portion) => portion.value === item.portion)?.label || item.portion;
    if (slot.key !== "main") lines.push(`Category: ${item.category || "Other"}`);
    lines.push(`${item.recipeId} — ${item.recipeName}`);
    lines.push(`Portion: ${portionLabel}`);
    lines.push(`Display serving: ${item.servingText || "(not specified)"}`);
    lines.push(`Hero: ${item.heroImage || "(none)"}`);
    lines.push("");
  });

  lines.push("Nutrition:");
  lines.push(
    record.nutritionSummary?.status === "complete"
      ? "All selected recipes contain verified usable per-serving nutrition."
      : "Nutrition is estimated or incomplete. Do not invent missing values.",
  );
  lines.push("");
  lines.push(`Notes: ${record.notes || "(none)"}`);
  lines.push(`Freezer life: ${record.freezerLife || "(none)"}`);
  lines.push(`Oven instructions: ${record.ovenInstructions || "(none)"}`);
  lines.push(`Microwave instructions: ${record.microwaveInstructions || "(none)"}`);
  lines.push(`Grocery / planner notes: ${record.groceryNotes || "(none)"}`);
  return lines.join("\n");
}

function processingPayload(record) {
  return {
    schemaVersion: SCHEMA_VERSION,
    requestType: "combo-meal-processing-request",
    comboCode: record.comboCode,
    revision: record.revision,
    mealName: record.mealName,
    description: record.description,
    notes: record.notes,
    publicMealId: record.publicMealId,
    heroImage: record.heroImage,
    freezerLife: record.freezerLife,
    ovenInstructions: record.ovenInstructions,
    microwaveInstructions: record.microwaveInstructions,
    groceryNotes: record.groceryNotes,
    status: record.status,
    requestedOutputs: [
      "overall combo-meal hero",
      "processed combined nutrition",
      "MealBalance and applicable GLP-1 information",
      "official Combo-Meal Card",
      "production notes",
    ],
    components: SLOT_DEFINITIONS.map((slot) => {
      const item = record.selections[slot.key];
      return {
        slot: slot.key,
        position: slot.key,
        label: slot.label,
        required: slot.required,
        recipeId: item?.recipeId || null,
        recipeName: item?.recipeName || null,
        recipeCategory: item?.category || null,
        portion: item?.portion || null,
        customMultiplier: item?.customMultiplier || null,
        multiplier: item ? portionMultiplier(item) : null,
        heroImage: item?.heroImage || null,
        sourceSnapshot: item?.sourceSnapshot || null,
        nutrition: item?.nutrition || null,
      };
    }),
    currentNutritionSummary: record.nutritionSummary,
    revisionFlags: {
      nutritionNeedsRecalculation: record.nutritionNeedsRecalculation,
      heroPossiblyOutdated: record.heroPossiblyOutdated,
    },
    exportedAt: new Date().toISOString(),
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file) {
  return file.text();
}

/* Minimal uncompressed ZIP writer for the browser-only website update package. */
function crc32(bytes) {
  let crc = -1;
  for (let i = 0; i < bytes.length; i += 1) {
    crc ^= bytes[i];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

function uint16(value) {
  return [value & 255, (value >>> 8) & 255];
}

function uint32(value) {
  return [value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255];
}

function dataUrlBytes(dataUrl) {
  const [, encoded = ""] = String(dataUrl || "").split(",");
  const binary = window.atob(encoded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function createStoreZip(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach((file) => {
    const name = encoder.encode(file.name);
    const data =
      file.data instanceof Uint8Array ? file.data : encoder.encode(String(file.data ?? ""));
    const checksum = crc32(data);
    const local = new Uint8Array([
      ...uint32(0x04034b50),
      ...uint16(20),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint32(checksum),
      ...uint32(data.length),
      ...uint32(data.length),
      ...uint16(name.length),
      ...uint16(0),
      ...name,
      ...data,
    ]);
    localParts.push(local);

    const central = new Uint8Array([
      ...uint32(0x02014b50),
      ...uint16(20),
      ...uint16(20),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint32(checksum),
      ...uint32(data.length),
      ...uint32(data.length),
      ...uint16(name.length),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint32(0),
      ...uint32(offset),
      ...name,
    ]);
    centralParts.push(central);
    offset += local.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array([
    ...uint32(0x06054b50),
    ...uint16(0),
    ...uint16(0),
    ...uint16(files.length),
    ...uint16(files.length),
    ...uint32(centralSize),
    ...uint32(offset),
    ...uint16(0),
  ]);

  return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
}

function RecipeThumb({ recipe, selected, onSelect, onDragStart }) {
  const [failed, setFailed] = useState(false);
  return (
    <button
      type="button"
      className={`comboBuilderRecipeThumb${selected ? " selected" : ""}`}
      onClick={() => onSelect(recipe)}
      draggable
      onDragStart={(event) => onDragStart(event, recipe)}
      aria-pressed={selected}
      title={`Select ${recipe.id} ${recipe.title}`}
    >
      <span className="comboBuilderThumbImage">
        {!failed && heroPath(recipe) ? (
          <img
            src={imageUrl(heroPath(recipe))}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <span aria-hidden="true">{recipe.emoji || "🍽️"}</span>
        )}
      </span>
      <strong>{recipe.id}</strong>
      <span>{recipe.title}</span>
      <em>{categoryLabel(recipe)}</em>
      {selected && <small>Selected</small>}
    </button>
  );
}

function SelectionBox({
  slot,
  selection,
  active,
  onActivate,
  onRemove,
  onPortion,
  onServingText,
  onDropRecipe,
}) {
  const [failed, setFailed] = useState(false);
  return (
    <section
      className={`comboBuilderSelectionBox${active ? " active" : ""}${selection ? " filled" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDropRecipe(slot.key, event.dataTransfer.getData("text/recipe-id"));
      }}
      aria-label={`${slot.label} selection`}
    >
      <button type="button" className="comboBuilderSlotHeader" onClick={() => onActivate(slot.key)}>
        {slot.label}
        {slot.required && <small>Required</small>}
      </button>

      {selection ? (
        <>
          <div className="comboBuilderSelectedHero">
            {!failed && heroPath({ id: selection.recipeId, heroImage: selection.heroImage }) ? (
              <img
                src={imageUrl(heroPath({ id: selection.recipeId, heroImage: selection.heroImage }))}
                alt={`${selection.recipeName} hero`}
                onError={() => setFailed(true)}
              />
            ) : (
              <span aria-hidden="true">🍽️</span>
            )}
          </div>
          <small className="comboBuilderSelectedCategory">{selection.category || "Other"}</small>
          <strong>{selection.recipeId}</strong>
          <p>{selection.recipeName}</p>
          <label>
            Portion
            <select
              value={selection.portion}
              onChange={(event) => onPortion(slot.key, event.target.value, selection.customMultiplier)}
            >
              {PORTIONS.map((portion) => (
                <option value={portion.value} key={portion.value}>{portion.label}</option>
              ))}
            </select>
          </label>
          {selection.portion === "custom" && (
            <label>
              Multiplier
              <input
                type="number"
                min="0.01"
                step="0.05"
                value={selection.customMultiplier}
                onChange={(event) => onPortion(slot.key, "custom", event.target.value)}
              />
            </label>
          )}
          <label>
            Display serving text
            <input
              type="text"
              value={selection.servingText || ""}
              onChange={(event) => onServingText(slot.key, event.target.value)}
              placeholder="Example: 1/2 cup"
            />
          </label>
          <div className="comboBuilderSlotActions">
            <button type="button" onClick={() => onActivate(slot.key)}>Replace</button>
            <button type="button" onClick={() => onRemove(slot.key)}>Remove</button>
          </div>
        </>
      ) : (
        <button type="button" className="comboBuilderEmptySlot" onClick={() => onActivate(slot.key)}>
          Click to select or drop a recipe here
        </button>
      )}
    </section>
  );
}

function RecipeCarousel({
  title,
  group,
  recipes,
  selections,
  activeSlot,
  onSelect,
  onDragStart,
}) {
  const scrollerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categoryOptions = useMemo(
    () => [...new Set(recipes.map((recipe) => getCode(recipe)))].sort(),
    [recipes],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesQuery =
        !normalized || `${recipe.id} ${recipe.title}`.toLowerCase().includes(normalized);
      const matchesCategory = category === "all" || getCode(recipe) === category;
      return matchesQuery && matchesCategory;
    });
  }, [recipes, query, category]);

  const selectedIds = new Set(
    Object.values(selections).filter(Boolean).map((item) => item.recipeId),
  );

  function scroll(direction) {
    scrollerRef.current?.scrollBy({ left: direction * 520, behavior: "smooth" });
  }

  return (
    <section className="comboBuilderCarouselSection">
      <div className="comboBuilderCarouselHeader">
        <div>
          <h2>{title}</h2>
          <p>{filtered.length} recipes available</p>
        </div>
        <div className="comboBuilderCarouselFilters">
          <label>
            Search
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Code or recipe name"
            />
          </label>
          {categoryOptions.length > 1 && (
            <label>
              Filter
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All</option>
                {categoryOptions.map((code) => <option key={code}>{code}</option>)}
              </select>
            </label>
          )}
        </div>
      </div>

      <div className="comboBuilderCarouselRow">
        <button type="button" className="comboBuilderArrow" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`}>‹</button>
        <div className="comboBuilderRecipeScroller" ref={scrollerRef}>
          {filtered.map((recipe) => (
            <RecipeThumb
              key={recipe.id}
              recipe={recipe}
              selected={selectedIds.has(recipe.id)}
              onSelect={(item) => onSelect(item, group, activeSlot)}
              onDragStart={onDragStart}
            />
          ))}
          {filtered.length === 0 && <p className="comboBuilderNoResults">No matching recipes.</p>}
        </div>
        <button type="button" className="comboBuilderArrow" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`}>›</button>
      </div>
    </section>
  );
}

export default function AdminComboMealBuilder({ recipes, onClose, onOpenHeroAudit }) {
  const [library, setLibrary] = useState(() => loadLibrary());
  const [record, setRecord] = useState(() => createDraft(loadLibrary()));
  const [activeSlot, setActiveSlot] = useState("main");
  const [message, setMessage] = useState("");
  const [importComparison, setImportComparison] = useState(null);
  const [showOfficialPreview, setShowOfficialPreview] = useState(false);
  const [allowDuplicateOverride, setAllowDuplicateOverride] = useState(false);
  const [managerCode, setManagerCode] = useState("");
  const libraryInputRef = useRef(null);
  const processedInputRef = useRef(null);

  const groupedRecipes = useMemo(
    () => ({
      main: recipes.filter((recipe) => groupForRecipe(recipe) === "main"),
      supporting: recipes.filter((recipe) => groupForRecipe(recipe) === "supporting"),
    }),
    [recipes],
  );

  const editableMeals = useMemo(() => {
    const savedByCode = new Map(library.map((item) => [String(item.comboCode).toUpperCase(), item]));
    const published = dinnerCombinations.map((meal) => {
      const number = Number(meal.number || mealNumberFromCode(meal.id));
      return savedByCode.get(comboCodeFromNumber(number)) || recordFromPublishedMeal(meal, recipes);
    });
    const publishedCodes = new Set(published.map((item) => String(item.comboCode).toUpperCase()));
    return [
      ...published,
      ...library.filter((item) => !publishedCodes.has(String(item.comboCode).toUpperCase())),
    ].sort((a, b) => a.comboCode.localeCompare(b.comboCode, undefined, { numeric: true }));
  }, [library, recipes]);

  const nutritionSummary = useMemo(
    () => calculateNutrition(record.selections),
    [record.selections],
  );

  useEffect(() => {
    setRecord((current) => ({ ...current, nutritionSummary }));
  }, [nutritionSummary.status, JSON.stringify(nutritionSummary.values)]);

  function persist(records) {
    setLibrary(records);
    saveLibrary(records);
  }

  function setChanged(updater) {
    setRecord((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      const processedState =
        Boolean(current.activeProcessed) ||
        ["Processed — Needs Approval", "Approved", "Published"].includes(current.status);
      const shouldBump = processedState && current.status !== "Needs Revision";
      return {
        ...next,
        revision: shouldBump ? current.revision + 1 : next.revision,
        status: processedState ? "Needs Revision" : next.status,
        nutritionNeedsRecalculation: processedState ? true : next.nutritionNeedsRecalculation,
        heroPossiblyOutdated: processedState ? true : next.heroPossiblyOutdated,
        updatedAt: new Date().toISOString(),
      };
    });
  }

  function selectRecipe(recipe, group, requestedSlot) {
    let target = requestedSlot;

    if (group === "supporting" && (!target || target === "main" || !isAllowed(recipe, target))) {
      const available = ["dish1", "dish2", "dish3", "dish4"].filter(
        (key) => !record.selections[key],
      );

      if (available.length === 0) {
        target = window.prompt(
          "All Dish boxes are filled. Enter dish1, dish2, dish3, or dish4 to replace one.",
          "dish1",
        );
      } else if (available.length === 1) {
        target = available[0];
      } else {
        target = window.prompt(
          `Choose a Dish box: ${available.join(", ")}`,
          available[0],
        );
      }
    }

    if (group === "main") target = "main";

    if (!target || !isAllowed(recipe, target)) {
      setMessage(`${recipe.title} cannot be placed in ${target || "that box"}.`);
      return;
    }

    const duplicateSlot = ["dish1", "dish2", "dish3", "dish4"].find(
      (key) => key !== target && record.selections[key]?.recipeId === recipe.id,
    );

    if (duplicateSlot && !allowDuplicateOverride) {
      setMessage(
        `${recipe.id} is already selected in ${duplicateSlot.toUpperCase()}. Enable the Admin duplicate override to use it again.`,
      );
      return;
    }

    if (duplicateSlot && allowDuplicateOverride) {
      const confirmed = window.confirm(
        `${recipe.id} is already selected in ${duplicateSlot.toUpperCase()}. Add the duplicate anyway?`,
      );
      if (!confirmed) return;
    }

    setChanged((current) => ({
      ...current,
      selections: {
        ...current.selections,
        [target]: {
          ...makeSelection(recipe),
          position: target,
        },
      },
    }));
    setActiveSlot(target);
    setMessage(`${recipe.id} added to ${SLOT_DEFINITIONS.find((slot) => slot.key === target)?.label}.`);
  }

  function handleDragStart(event, recipe) {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/recipe-id", recipe.id);
  }

  function dropRecipe(slotKey, recipeId) {
    const recipe = recipes.find((item) => item.id === recipeId);
    if (!recipe) return;
    if (!isAllowed(recipe, slotKey)) {
      setMessage(`${recipe.id} is not an appropriate recipe type for ${slotKey.toUpperCase()}.`);
      return;
    }
    selectRecipe(recipe, groupForRecipe(recipe), slotKey);
  }

  function removeSelection(slotKey) {
    if (slotKey === "main" && record.status === "Ready for Processing") {
      setMessage("MAIN cannot be removed while the meal is Ready for Processing. Replace it or return the meal to Draft.");
      return;
    }
    setChanged((current) => ({
      ...current,
      selections: { ...current.selections, [slotKey]: null },
    }));
  }

  function updatePortion(slotKey, portion, customMultiplier) {
    setChanged((current) => ({
      ...current,
      selections: {
        ...current.selections,
        [slotKey]: {
          ...current.selections[slotKey],
          portion,
          customMultiplier: portion === "custom" ? customMultiplier : "",
        },
      },
    }));
  }

  function updateServingText(slotKey, servingText) {
    setChanged((current) => ({
      ...current,
      selections: {
        ...current.selections,
        [slotKey]: { ...current.selections[slotKey], servingText },
      },
    }));
  }

  function saveDraft() {
    if (!record.selections.main) {
      setMessage("Select a Main recipe before saving the draft.");
      return;
    }
    const saved = { ...record, updatedAt: new Date().toISOString(), nutritionSummary };
    const exists = library.some((item) => item.comboCode === saved.comboCode);
    const next = exists
      ? library.map((item) => item.comboCode === saved.comboCode ? saved : item)
      : [...library, saved];
    persist(next);
    setRecord(saved);
    setMessage(`${saved.comboCode} saved.`);
  }

  function newMeal() {
    const draft = createDraft(editableMeals);
    setRecord(draft);
    setActiveSlot("main");
    setImportComparison(null);
    setMessage(`${draft.comboCode} created.`);
  }

  function loadMeal(comboCode) {
    const saved = editableMeals.find((item) => item.comboCode === comboCode);
    if (!saved) return;
    setRecord(saved);
    setActiveSlot("main");
    setManagerCode(saved.publicMealId || saved.comboCode);
    setImportComparison(null);
    setMessage(`${comboCode} loaded.`);
  }

  function loadManagerMeal() {
    const number = mealNumberFromCode(managerCode);
    if (!number) {
      setMessage("Enter a code such as meal-002 or CM-002.");
      return;
    }
    const comboCode = comboCodeFromNumber(number);
    const found = editableMeals.find((item) => String(item.comboCode).toUpperCase() === comboCode);
    if (!found) {
      setMessage(`${managerCode.trim()} was not found in the current Combo-Meal library.`);
      return;
    }
    setRecord(found);
    setActiveSlot("main");
    setImportComparison(null);
    setManagerCode(found.publicMealId || found.comboCode);
    setMessage(`${found.publicMealId || found.comboCode} loaded for editing.`);
  }

  function revertChanges() {
    const saved = library.find((item) => item.comboCode === record.comboCode);
    const number = mealNumberFromCode(record.publicMealId || record.comboCode);
    const published = dinnerCombinations.find((meal) => Number(meal.number) === number);
    const original = saved || (published ? recordFromPublishedMeal(published, recipes) : null);
    if (!original) {
      setMessage("No saved or published version is available to restore.");
      return;
    }
    setRecord(original);
    setImportComparison(null);
    setMessage(`${original.publicMealId || original.comboCode} restored.`);
  }

  function recalculateNutrition() {
    const updated = calculateNutrition(record.selections);
    setRecord((current) => ({
      ...current,
      nutritionSummary: updated,
      nutritionNeedsRecalculation: false,
      updatedAt: new Date().toISOString(),
    }));
    setMessage(`Nutrition refreshed: ${updated.status}.`);
  }

  function flagHeroForReprocessing() {
    setRecord((current) => ({
      ...current,
      heroPossiblyOutdated: true,
      status: current.status === "Draft" ? "Draft" : "Needs Revision",
      updatedAt: new Date().toISOString(),
    }));
    setMessage("The combo hero is flagged for reprocessing.");
  }

  function duplicateMeal() {
    const duplicate = {
      ...record,
      comboCode: nextComboCode(editableMeals),
      publicMealId: null,
      revision: 1,
      status: "Draft",
      activeProcessed: null,
      pendingImport: null,
      importHistory: [],
      nutritionNeedsRecalculation: false,
      heroPossiblyOutdated: false,
      sourcePublishedSnapshot: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecord(duplicate);
    setMessage(`${duplicate.comboCode} created as a duplicate.`);
  }

  function clearMeal() {
    setChanged((current) => ({
      ...current,
      mealName: "",
      description: "",
      notes: "",
      heroImage: "",
      freezerLife: "",
      ovenInstructions: "",
      microwaveInstructions: "",
      groceryNotes: "",
      selections: emptySelections(),
      status: "Draft",
      pendingImport: null,
    }));
    setImportComparison(null);
  }

  function deleteDraft() {
    const isPublishedMeal = Boolean(record.publicMealId);
    const prompt = isPublishedMeal
      ? `Remove the saved edits for ${record.publicMealId} and restore the published version?`
      : `Delete ${record.comboCode}? This cannot be undone.`;
    if (!window.confirm(prompt)) return;
    const next = library.filter((item) => item.comboCode !== record.comboCode);
    persist(next);
    if (isPublishedMeal) {
      const number = mealNumberFromCode(record.publicMealId);
      const published = dinnerCombinations.find((meal) => Number(meal.number) === number);
      setRecord(published ? recordFromPublishedMeal(published, recipes) : createDraft(editableMeals));
    } else {
      setRecord(createDraft([...editableMeals.filter((item) => item.comboCode !== record.comboCode)]));
    }
    setImportComparison(null);
    setMessage(isPublishedMeal ? "Saved edits removed; the published meal was restored." : "Draft deleted.");
  }

  async function copyRequest() {
    const text = humanRequest({ ...record, nutritionSummary });
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Chat request copied.");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setMessage("Chat request copied.");
    }
  }

  function downloadRequest() {
    const nextRecord = { ...record, status: "Request Exported", nutritionSummary };
    setRecord(nextRecord);
    downloadJson(processingPayload(nextRecord), `${record.comboCode}-processing-request.json`);
    setMessage("Processing request downloaded.");
  }

  function markReady() {
    if (!record.selections.main) {
      setMessage("Select a MAIN recipe before marking the meal Ready for Processing.");
      return;
    }
    setRecord((current) => ({ ...current, status: "Ready for Processing" }));
    setMessage("Marked Ready for Processing.");
  }

  function exportLibrary() {
    downloadJson(
      {
        application: "Robert's Recipe Box",
        type: "admin-combo-meal-library",
        schemaVersion: SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        records: library,
      },
      "rrb-admin-combo-meal-library.json",
    );
  }

  function exportUpdatedPublicLibrary() {
    const savedByCode = new Map(library.map((item) => [String(item.comboCode).toUpperCase(), item]));
    const mergedPublished = dinnerCombinations.map((meal) => {
      const code = comboCodeFromNumber(Number(meal.number || mealNumberFromCode(meal.id)));
      const override = savedByCode.get(code);
      return override ? publishedMealFromRecord(override) : meal;
    });
    const newPublished = library
      .filter((item) => !item.publicMealId && !dinnerCombinations.some(
        (meal) => comboCodeFromNumber(Number(meal.number)) === String(item.comboCode).toUpperCase(),
      ))
      .map((item) => publishedMealFromRecord(item));
    const output = [
      `export const DINNER_PROTEIN_FILTERS = ${JSON.stringify(DINNER_PROTEIN_FILTERS, null, 2)};`,
      "",
      `export const DINNER_SIDE_FILTERS = ${JSON.stringify(DINNER_SIDE_FILTERS, null, 2)};`,
      "",
      `export const dinnerCombinations = ${JSON.stringify([...mergedPublished, ...newPublished], null, 2)};`,
      "",
    ].join("\n");
    downloadText(output, "dinnerCombinations.updated.js", "text/javascript");
    setMessage("Updated public Combo-Meal library exported. Review it before replacing the website data file.");
  }

  async function importLibraryFile(file) {
    const parsed = safeParse(await readFileAsText(file), null);
    const records = Array.isArray(parsed) ? parsed : parsed?.records;
    if (!Array.isArray(records)) {
      setMessage("The selected file is not a valid Combo-Meal Library export.");
      return;
    }
    persist(records);
    setMessage(`${records.length} Combo-Meal records imported.`);
    if (records[0]) setRecord(records[0]);
  }

  async function importProcessedFiles(fileList) {
    const files = [...fileList];
    const jsonFile = files.find((file) => file.name.toLowerCase().endsWith(".json"));
    if (!jsonFile) {
      setMessage("Select a processed JSON file. An image may be selected with it.");
      return;
    }
    const imported = safeParse(await readFileAsText(jsonFile), null);
    if (!imported) {
      setMessage("The processed JSON could not be read.");
      return;
    }

    const comparison = compareImport(record, imported);
    if (comparison.errors.some((error) => error.startsWith("Combo code mismatch"))) {
      setImportComparison({ ...comparison, imported, blocking: true });
      setMessage("Import rejected because the combo code does not match.");
      return;
    }

    const imageFile = files.find((file) => file.type.startsWith("image/"));
    const notesFile = files.find((file) => file.name.toLowerCase().endsWith(".txt"));
    const heroDataUrl = imageFile ? await readFileAsDataUrl(imageFile) : imported.heroDataUrl || null;
    const productionNotes = notesFile
      ? await readFileAsText(notesFile)
      : imported.productionNotes || imported.notes || "";

    const pendingImport = {
      importedAt: new Date().toISOString(),
      sourceFiles: files.map((file) => file.name),
      data: imported,
      heroDataUrl,
      heroFilename: imageFile?.name || imported.heroFilename || null,
      productionNotes,
      comparison,
    };

    setRecord((current) => ({
      ...current,
      pendingImport,
      status: "Processed — Needs Approval",
    }));
    setImportComparison({ ...comparison, imported, blocking: comparison.errors.length > 0 });
    setMessage(
      comparison.errors.length
        ? "Processed package loaded with blocking mismatches. Review the comparison."
        : "Processed package validated and is ready for approval.",
    );
  }

  function approveImport() {
    if (!record.pendingImport) return;
    if (record.pendingImport.comparison?.errors?.length) {
      setMessage("Resolve the import mismatches before approval.");
      return;
    }
    const previous = record.activeProcessed
      ? [...(record.importHistory || []), record.activeProcessed]
      : record.importHistory || [];
    const activeProcessed = {
      ...record.pendingImport,
      approvedAt: new Date().toISOString(),
    };
    setRecord((current) => ({
      ...current,
      activeProcessed,
      pendingImport: null,
      importHistory: previous,
      status: "Approved",
      nutritionNeedsRecalculation: false,
      heroPossiblyOutdated: false,
    }));
    setImportComparison(null);
    setMessage("Processed meal approved. It has not been published.");
  }

  function rejectImport() {
    setRecord((current) => ({ ...current, pendingImport: null, status: "Draft" }));
    setImportComparison(null);
    setMessage("Import rejected.");
  }

  function returnToDraft() {
    setRecord((current) => ({ ...current, status: "Draft" }));
  }

  function markNeedsRevision() {
    setRecord((current) => ({
      ...current,
      revision: current.status === "Needs Revision" ? current.revision : current.revision + 1,
      status: "Needs Revision",
      nutritionNeedsRecalculation: true,
      heroPossiblyOutdated: true,
    }));
  }

  function exportWebsitePackage() {
    const approved = record.activeProcessed;
    if (!approved) {
      setMessage("Approve a processed meal before exporting a website update package.");
      return;
    }

    const packageRecord = {
      schemaVersion: SCHEMA_VERSION,
      comboCode: record.comboCode,
      revision: record.revision,
      mealName: record.mealName,
      description: record.description,
      publicMealId: record.publicMealId,
      heroImage: record.heroImage,
      freezerLife: record.freezerLife,
      ovenInstructions: record.ovenInstructions,
      microwaveInstructions: record.microwaveInstructions,
      groceryNotes: record.groceryNotes,
      status: record.status,
      selections: record.selections,
      processedNutrition:
        approved.data?.processedNutrition || approved.data?.nutrition || null,
      mealBalance: approved.data?.mealBalance || null,
      glp1: approved.data?.glp1 || null,
      productionNotes: approved.productionNotes || "",
      heroFilename:
        approved.heroFilename || `${record.comboCode}-hero.jpg`,
      approvedAt: approved.approvedAt,
    };

    const files = [
      {
        name: `src/data/admin-combo-meals/${record.comboCode}-data.json`,
        data: JSON.stringify(packageRecord, null, 2),
      },
      {
        name: `src/data/admin-combo-meals/README.txt`,
        data:
          "Prototype export. Review and merge this approved record into the production Combo-Meal data workflow before publishing.",
      },
    ];

    if (approved.heroDataUrl) {
      files.push({
        name: `public/images/combo-meals/${approved.heroFilename || `${record.comboCode}-hero.jpg`}`,
        data: dataUrlBytes(approved.heroDataUrl),
      });
    }

    downloadBlob(createStoreZip(files), `${record.comboCode}-website-update.zip`);
    setMessage("Website update package exported.");
  }

  const selectedIds = new Set(
    Object.values(record.selections).filter(Boolean).map((item) => item.recipeId),
  );

  const importedData = record.pendingImport?.data;
  const officialHero =
    record.pendingImport?.heroDataUrl ||
    record.activeProcessed?.heroDataUrl ||
    (record.heroImage ? imageUrl(record.heroImage) : null) ||
    null;
  const processedNutrition =
    importedData?.processedNutrition ||
    importedData?.nutrition ||
    record.activeProcessed?.data?.processedNutrition ||
    record.activeProcessed?.data?.nutrition ||
    null;
  const mealBalance =
    importedData?.mealBalance ||
    record.activeProcessed?.data?.mealBalance ||
    null;

  return (
    <main className="comboBuilderPage">
      <header className="comboBuilderPageHeader">
        <div>
          <span className="comboBuilderEyebrow">ADMIN ONLY</span>
          <h1>COMBO-MEAL BUILDER & MANAGER</h1>
          <p>
            Create a new Combo-Meal or load a current meal by its meal/CM code to revise its
            main, sides, portions, display text, storage notes, and hero assignment.
          </p>
        </div>
        <div className="comboBuilderHeaderActions">
          {onOpenHeroAudit && (
            <button type="button" className="secondary" onClick={onOpenHeroAudit}>
              Check / Correct Recipe Heroes
            </button>
          )}
          <button type="button" className="secondary" onClick={onClose}>Return Home</button>
        </div>
      </header>

      <section className="comboBuilderManagerLookup" aria-labelledby="combo-manager-title">
        <div>
          <span className="comboBuilderEyebrow">EDIT A CURRENT COMBO-MEAL</span>
          <h2 id="combo-manager-title">Combo-Meal Manager</h2>
          <p>Enter either format—for example, <strong>meal-002</strong> or <strong>CM-002</strong>.</p>
        </div>
        <label>
          Current combo-meal code
          <span className="comboBuilderLookupRow">
            <input
              type="text"
              value={managerCode}
              onChange={(event) => setManagerCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  loadManagerMeal();
                }
              }}
              placeholder="meal-002 or CM-002"
            />
            <button type="button" className="primary" onClick={loadManagerMeal}>Load Meal</button>
          </span>
        </label>
      </section>

      <section className="comboBuilderToolbar">
        <button type="button" className="primary" onClick={newMeal}>New Combo Meal</button>
        <label>
          Browse Existing Meals
          <select value="" onChange={(event) => loadMeal(event.target.value)}>
            <option value="">Choose saved meal</option>
            {editableMeals.map((item) => (
              <option key={item.comboCode} value={item.comboCode}>
                {item.publicMealId ? `${item.publicMealId} / ` : ""}{item.comboCode} — {item.mealName || "Unnamed"}
              </option>
            ))}
          </select>
        </label>
        <div className="comboBuilderCode">
          <span>{record.publicMealId ? "Published / permanent codes" : "Permanent combo code"}</span>
          {record.publicMealId && <small>{record.publicMealId}</small>}
          <strong>{record.comboCode}</strong>
          <small>Revision {record.revision}</small>
        </div>
        <label>
          Status
          <select
            value={record.status}
            onChange={(event) => setRecord((current) => ({ ...current, status: event.target.value }))}
          >
            {STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
      </section>

      <section className="comboBuilderIdentity">
        <label>
          Meal Name
          <input
            type="text"
            value={record.mealName}
            onChange={(event) => setChanged((current) => ({ ...current, mealName: event.target.value }))}
            placeholder="Sunday Chicken Dinner"
          />
        </label>
        <label>
          Optional short meal description
          <textarea
            rows="2"
            value={record.description}
            onChange={(event) => setChanged((current) => ({ ...current, description: event.target.value }))}
          />
        </label>
        <label>
          Production notes
          <textarea
            rows="2"
            value={record.notes}
            onChange={(event) => setChanged((current) => ({ ...current, notes: event.target.value }))}
          />
        </label>
        <label>
          Combo-meal hero assignment
          <input
            type="text"
            value={record.heroImage || ""}
            onChange={(event) => setChanged((current) => ({ ...current, heroImage: event.target.value }))}
            placeholder="images/dinner-combinations/meal-002.webp"
          />
        </label>
        <label>
          Freezer life
          <input
            type="text"
            value={record.freezerLife || ""}
            onChange={(event) => setChanged((current) => ({ ...current, freezerLife: event.target.value }))}
          />
        </label>
        <label>
          Oven instructions
          <textarea
            rows="2"
            value={record.ovenInstructions || ""}
            onChange={(event) => setChanged((current) => ({ ...current, ovenInstructions: event.target.value }))}
          />
        </label>
        <label>
          Microwave instructions
          <textarea
            rows="2"
            value={record.microwaveInstructions || ""}
            onChange={(event) => setChanged((current) => ({ ...current, microwaveInstructions: event.target.value }))}
          />
        </label>
        <label>
          Grocery / planner notes
          <textarea
            rows="2"
            value={record.groceryNotes || ""}
            onChange={(event) => setChanged((current) => ({ ...current, groceryNotes: event.target.value }))}
          />
        </label>
      </section>

      <div className="comboBuilderRecordActions">
        <button type="button" className="primary" onClick={saveDraft}>Save Changes</button>
        <span className="helpTooltipAction"><button type="button" onClick={duplicateMeal}>Save as New Combo</button><HelpTooltip text="Keeps the current meal and creates a separate combo with a new permanent CM code." /></span>
        <button type="button" onClick={() => setShowOfficialPreview(true)}>Preview Meal</button>
        <span className="helpTooltipAction"><button type="button" onClick={recalculateNutrition}>Recalculate Nutrition</button><HelpTooltip text="Refreshes the meal estimate from the currently selected main and side-dish nutrition records." /></span>
        <span className="helpTooltipAction"><button type="button" onClick={flagHeroForReprocessing}>Flag Hero for Reprocessing</button><HelpTooltip text="Marks the combined meal hero as outdated. It does not delete or replace the current image." /></span>
        <span className="helpTooltipAction"><button type="button" onClick={revertChanges}>Cancel / Revert Changes</button><HelpTooltip text="Discards unsaved edits and restores the last saved version of this combo meal." /></span>
        <button type="button" onClick={clearMeal}>Clear Meal</button>
        <button type="button" className="danger" onClick={deleteDraft}>
          {record.publicMealId ? "Remove Saved Edits" : "Delete Draft"}
        </button>
      </div>
      <label className="comboBuilderDuplicateOverride">
        <input
          type="checkbox"
          checked={allowDuplicateOverride}
          onChange={(event) => setAllowDuplicateOverride(event.target.checked)}
        />
        Admin override: allow the same supporting recipe in more than one Dish box
      </label>

      {message && <p className="comboBuilderMessage" role="status">{message}</p>}

      <section className="comboBuilderStickySelections" aria-label="Selected Combo-Meal components">
        <div className="comboBuilderSelectionGrid">
          {SLOT_DEFINITIONS.map((slot) => (
            <SelectionBox
              key={slot.key}
              slot={slot}
              selection={record.selections[slot.key]}
              active={activeSlot === slot.key}
              onActivate={setActiveSlot}
              onRemove={removeSelection}
              onPortion={updatePortion}
              onServingText={updateServingText}
              onDropRecipe={dropRecipe}
            />
          ))}
        </div>
      </section>

      <RecipeCarousel
        title="Main Dishes"
        group="main"
        recipes={groupedRecipes.main}
        selections={record.selections}
        activeSlot={activeSlot}
        onSelect={selectRecipe}
        onDragStart={handleDragStart}
      />
      <RecipeCarousel
        title="Supporting Dishes"
        group="supporting"
        recipes={groupedRecipes.supporting}
        selections={record.selections}
        activeSlot={activeSlot}
        onSelect={selectRecipe}
        onDragStart={handleDragStart}
      />

      <section className="comboBuilderPreview">
        <div className="comboBuilderSectionHeading">
          <div>
            <span>LIVE PREVIEW</span>
            <h2>{record.comboCode} — {record.mealName || "Unnamed Combo Meal"}</h2>
            <p>{record.description || "No description entered."}</p>
          </div>
          <strong className={`comboBuilderNutritionStatus ${nutritionSummary.status}`}>
            Nutrition: {nutritionSummary.status}
          </strong>
        </div>

        <div
          className={`comboBuilderPreviewStrip count-${Object.values(record.selections).filter(Boolean).length}`}
        >
          {SLOT_DEFINITIONS.filter((slot) => record.selections[slot.key]).map((slot) => {
            const item = record.selections[slot.key];
            return (
              <div key={slot.key}>
                <img src={imageUrl(heroPath({ id: item.recipeId, heroImage: item.heroImage }))} alt={`${item.recipeName} hero`} />
              </div>
            );
          })}
        </div>

        <div className="comboBuilderPreviewDetails">
          <section>
            <h3>Selected Components</h3>
            <dl>
              {SLOT_DEFINITIONS.map((slot) => {
                const item = record.selections[slot.key];
                return (
                  <div key={slot.key}>
                    <dt>{slot.label}</dt>
                    <dd>
                      {item
                        ? `${item.recipeId} — ${item.recipeName}${slot.key !== "main" ? ` (${item.category || "Other"})` : ""} × ${portionMultiplier(item)}`
                        : "Optional — not selected"}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>

          <section>
            <h3>Available Combined Nutrition</h3>
            <div className="comboBuilderNutritionGrid">
              {NUTRIENTS.map(([key, label, unit]) => (
                <div key={key}>
                  <span>{label}</span>
                  <strong>
                    {nutritionSummary.values[key] === null
                      ? "—"
                      : `${nutritionSummary.values[key]}${unit}`}
                  </strong>
                </div>
              ))}
            </div>
            {nutritionSummary.missingRecipeIds.length > 0 && (
              <p className="comboBuilderWarning">
                Missing usable nutrition: {nutritionSummary.missingRecipeIds.join(", ")}.
              </p>
            )}
            {nutritionSummary.provisionalRecipeIds.length > 0 && (
              <p className="comboBuilderWarning">
                Provisional nutrition: {nutritionSummary.provisionalRecipeIds.join(", ")}.
              </p>
            )}
          </section>
        </div>
      </section>

      <section className="comboBuilderProcessing">
        <div className="comboBuilderSectionHeading">
          <div>
            <span>PRODUCTION HANDOFF</span>
            <h2>Processing Request</h2>
          </div>
        </div>
        <div className="comboBuilderActionGrid">
          <button type="button" onClick={copyRequest}>Copy Chat Request</button>
          <button type="button" onClick={downloadRequest}>Download Processing Request</button>
          <button type="button" onClick={markReady}>Mark Ready for Processing</button>
        </div>
      </section>

      <section className="comboBuilderImport">
        <div className="comboBuilderSectionHeading">
          <div>
            <span>PROCESSED RETURN</span>
            <h2>IMPORT PROCESSED COMBO MEAL</h2>
            <p>Select the processed JSON and, when available, its hero image and notes file together.</p>
          </div>
        </div>
        <input
          ref={processedInputRef}
          type="file"
          multiple
          accept=".json,.jpg,.jpeg,.png,.webp,.txt"
          onChange={(event) => importProcessedFiles(event.target.files)}
        />

        {importComparison && (
          <div className="comboBuilderComparison">
            <h3>Existing versus Imported</h3>
            <div className="comboBuilderComparisonGrid">
              <div>
                <strong>Existing</strong>
                {importComparison.existing.map((item) => (
                  <p key={item.slot}>{item.slot}: {item.recipeId || "empty"} × {item.multiplier ?? "—"}</p>
                ))}
              </div>
              <div>
                <strong>Imported</strong>
                {importComparison.incoming.map((item) => (
                  <p key={item.slot}>{item.slot}: {item.recipeId || "empty"} × {item.multiplier ?? "—"}</p>
                ))}
              </div>
            </div>
            {importComparison.errors.map((error) => <p className="comboBuilderError" key={error}>{error}</p>)}
            {importComparison.warnings.map((warning) => <p className="comboBuilderWarning" key={warning}>{warning}</p>)}
          </div>
        )}

        <div className="comboBuilderActionGrid">
          <button type="button" className="primary" onClick={approveImport} disabled={!record.pendingImport || Boolean(record.pendingImport?.comparison?.errors?.length)}>
            Approve Processed Meal
          </button>
          <button type="button" onClick={rejectImport} disabled={!record.pendingImport}>Reject Import</button>
          <button type="button" onClick={returnToDraft}>Return to Draft</button>
          <button type="button" onClick={markNeedsRevision}>Mark Needs Revision</button>
          <button type="button" onClick={() => setShowOfficialPreview(true)}>Preview Official Combo-Meal Card</button>
        </div>
      </section>

      <section className="comboBuilderStorage">
        <div className="comboBuilderSectionHeading">
          <div>
            <span>ADMIN DATA</span>
            <h2>Storage and Export</h2>
          </div>
        </div>
        <div className="comboBuilderActionGrid">
          <span className="helpTooltipAction"><button type="button" className="primary" onClick={exportUpdatedPublicLibrary}>Export Updated Public Library</button><HelpTooltip text="Downloads the public combo-meal data file containing your approved edits for installation in the website." /></span>
          <span className="helpTooltipAction"><button type="button" onClick={exportLibrary}>Export Manager Backup</button><HelpTooltip text="Downloads a backup of Admin combo-meal records, including drafts and browser-saved revisions." /></span>
          <span className="helpTooltipAction"><button type="button" onClick={() => libraryInputRef.current?.click()}>Import Combo-Meal Library</button><HelpTooltip text="Loads a previously exported Combo-Meal Manager backup into this browser for review." /></span>
          <span className="helpTooltipAction"><button type="button" onClick={exportWebsitePackage}>Export Website Update Package</button><HelpTooltip text="Downloads the website-ready combo-meal update files as a package for the next site edit." /></span>
        </div>
        <input
          ref={libraryInputRef}
          type="file"
          accept=".json"
          hidden
          onChange={(event) => event.target.files?.[0] && importLibraryFile(event.target.files[0])}
        />
      </section>

      {showOfficialPreview && (
        <div className="comboBuilderModalBackdrop" role="presentation" onMouseDown={() => setShowOfficialPreview(false)}>
          <section className="comboBuilderOfficialCard" role="dialog" aria-modal="true" aria-labelledby="combo-official-preview-title" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="comboBuilderModalClose" onClick={() => setShowOfficialPreview(false)} aria-label="Close preview">×</button>
            <header>
              <span>{record.comboCode} · Revision {record.revision}</span>
              <h2 id="combo-official-preview-title">{record.mealName || "Unnamed Combo Meal"}</h2>
              <p>{record.description}</p>
            </header>
            <div className="comboBuilderOfficialHero">
              {officialHero ? (
                <img src={officialHero} alt={`${record.mealName} processed combo hero`} />
              ) : (
                <div className={`comboBuilderPreviewStrip count-${Object.values(record.selections).filter(Boolean).length}`}>
                  {SLOT_DEFINITIONS.filter((slot) => record.selections[slot.key]).map((slot) => {
                    const item = record.selections[slot.key];
                    return <div key={slot.key}><img src={imageUrl(heroPath({ id: item.recipeId, heroImage: item.heroImage }))} alt="" /></div>;
                  })}
                </div>
              )}
            </div>
            <div className="comboBuilderOfficialBody">
              <section>
                <h3>Components</h3>
                {SLOT_DEFINITIONS.map((slot) => {
                  const item = record.selections[slot.key];
                  return item ? <p key={slot.key}><strong>{slot.label}:</strong> {item.recipeId} — {item.recipeName} × {portionMultiplier(item)}</p> : null;
                })}
              </section>
              <section>
                <h3>Processed Information</h3>
                <p><strong>MealBalance:</strong> {mealBalance ? JSON.stringify(mealBalance) : "Not imported"}</p>
                <p><strong>Nutrition:</strong> {processedNutrition ? "Imported" : "Not imported"}</p>
                <p><strong>Status:</strong> {record.status}</p>
              </section>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
