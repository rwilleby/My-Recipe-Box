import { createId, isoNow } from "./kosCore.js";

const SESSION_KEY = "kos.kitchenCompanion.cooking.v1";

function deepFreeze(value) {
  if (Array.isArray(value)) return Object.freeze(value.map(deepFreeze));
  if (value && typeof value === "object") {
    return Object.freeze(
      Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, deepFreeze(item)])
      )
    );
  }
  return value;
}

function normalizeSteps(recipe) {
  const candidates = [
    recipe?.instructions,
    recipe?.directions,
    recipe?.steps,
    recipe?.method,
  ];

  const raw = candidates.find((value) => Array.isArray(value));
  if (raw) {
    return raw
      .map((step, index) => {
        if (typeof step === "string") {
          return { id: `step-${index + 1}`, text: step.trim() };
        }
        if (step && typeof step === "object") {
          return {
            id: step.id || `step-${index + 1}`,
            text: String(
              step.text ||
              step.instruction ||
              step.direction ||
              step.description ||
              ""
            ).trim(),
          };
        }
        return null;
      })
      .filter((step) => step?.text);
  }

  const textCandidate = candidates.find(
    (value) => typeof value === "string" && value.trim()
  );
  if (textCandidate) {
    return textCandidate
      .split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9])/)
      .map((text) => text.trim())
      .filter(Boolean)
      .map((text, index) => ({
        id: `step-${index + 1}`,
        text,
      }));
  }

  return [];
}

function recipeName(recipe, fallback = "Recipe") {
  return (
    recipe?.name ||
    recipe?.title ||
    recipe?.recipeName ||
    fallback
  );
}

export function createCookingSessionService({
  storage,
  clock = () => new Date(),
  rfisPlatform = null,
  timers,
} = {}) {
  if (!storage || !timers) {
    throw new Error(
      "CookingSessionService requires storage and timers"
    );
  }

  function load() {
    try {
      const raw = storage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function save(session) {
    if (session) {
      storage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      storage.removeItem(SESSION_KEY);
    }
    return session;
  }

  function current() {
    const session = load();
    if (!session) return null;
    const activeTimers = timers
      .all({ includeCompleted: true })
      .filter((timer) => timer.sessionId === session.id);
    return deepFreeze({
      ...session,
      activeTimers,
      currentStep:
        session.steps[session.currentStepIndex] || null,
      progress:
        session.steps.length > 0
          ? (session.completedStepIds.length /
              session.steps.length)
          : 0,
    });
  }

  function start({
    recipeId = null,
    recipe = null,
    title = null,
  } = {}) {
    if (load()) {
      throw new Error("A cooking session is already active");
    }

    let resolvedRecipe = recipe;
    if (!resolvedRecipe && recipeId && rfisPlatform) {
      resolvedRecipe =
        rfisPlatform.recipes.get(recipeId) || null;
    }

    if (!resolvedRecipe && !title) {
      throw new Error(
        "recipe, recipeId, or title is required"
      );
    }

    const steps = normalizeSteps(resolvedRecipe);
    const now = clock();
    const session = {
      id: createId("COOK", now),
      recipeId:
        recipeId || resolvedRecipe?.id || null,
      title:
        String(
          title ||
          recipeName(resolvedRecipe, recipeId || "Recipe")
        ).trim(),
      steps,
      currentStepIndex: 0,
      completedStepIds: [],
      notes: [],
      status: "cooking",
      startedAt: isoNow(() => now),
      updatedAt: isoNow(() => now),
    };
    save(session);
    return current();
  }

  function goToStep(index) {
    const session = load();
    if (!session) throw new Error("No active cooking session");
    const target = Number(index);
    if (
      !Number.isInteger(target) ||
      target < 0 ||
      target >= session.steps.length
    ) {
      throw new Error("Invalid cooking step");
    }
    session.currentStepIndex = target;
    session.updatedAt = isoNow(clock);
    save(session);
    return current();
  }

  function nextStep() {
    const session = load();
    if (!session) throw new Error("No active cooking session");
    if (session.steps.length === 0) return current();
    return goToStep(
      Math.min(
        session.steps.length - 1,
        session.currentStepIndex + 1
      )
    );
  }

  function previousStep() {
    const session = load();
    if (!session) throw new Error("No active cooking session");
    if (session.steps.length === 0) return current();
    return goToStep(
      Math.max(0, session.currentStepIndex - 1)
    );
  }

  function completeStep(index = null) {
    const session = load();
    if (!session) throw new Error("No active cooking session");
    const target =
      index === null ? session.currentStepIndex : Number(index);
    const step = session.steps[target];
    if (!step) throw new Error("Invalid cooking step");
    if (!session.completedStepIds.includes(step.id)) {
      session.completedStepIds.push(step.id);
    }
    if (
      target === session.currentStepIndex &&
      target < session.steps.length - 1
    ) {
      session.currentStepIndex += 1;
    }
    session.updatedAt = isoNow(clock);
    save(session);
    return current();
  }

  function addNote(text) {
    const session = load();
    if (!session) throw new Error("No active cooking session");
    const note = String(text || "").trim();
    if (!note) throw new Error("Note cannot be empty");
    session.notes.push({
      id: createId("NOTE", clock()),
      text: note,
      stepIndex: session.currentStepIndex,
      createdAt: isoNow(clock),
    });
    session.updatedAt = isoNow(clock);
    save(session);
    return current();
  }

  function startTimer({
    seconds,
    label = null,
    stepIndex = null,
  } = {}) {
    const session = load();
    if (!session) throw new Error("No active cooking session");
    const index =
      Number.isInteger(stepIndex)
        ? stepIndex
        : session.currentStepIndex;
    const step = session.steps[index];
    return timers.start({
      seconds,
      label:
        label ||
        (step ? `${session.title} — Step ${index + 1}` : session.title),
      sessionId: session.id,
      stepIndex: index,
    });
  }

  function finish() {
    const session = load();
    if (!session) throw new Error("No active cooking session");
    const completed = {
      ...session,
      status: "completed",
      completedAt: isoNow(clock),
      updatedAt: isoNow(clock),
    };
    save(null);
    return deepFreeze(completed);
  }

  function cancel() {
    const session = load();
    save(null);
    return session
      ? deepFreeze({
          ...session,
          status: "cancelled",
          cancelledAt: isoNow(clock),
        })
      : null;
  }

  return Object.freeze({
    current,
    start,
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    addNote,
    startTimer,
    finish,
    cancel,
  });
}

export default createCookingSessionService;
