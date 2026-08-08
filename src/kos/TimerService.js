import { createId, isoNow } from "./kosCore.js";

const TIMER_KEY = "kos.kitchenCompanion.timers.v1";

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

function asMillis(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Timer duration must be greater than zero");
  }
  return Math.round(value * 1000);
}

export function createTimerService({
  storage,
  clock = () => new Date(),
} = {}) {
  if (!storage) throw new Error("TimerService requires storage");

  function nowMs() {
    return clock().getTime();
  }

  function load() {
    try {
      const raw = storage.getItem(TIMER_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function save(rows) {
    storage.setItem(TIMER_KEY, JSON.stringify(rows));
    return rows;
  }

  function hydrate(timer) {
    const current = nowMs();
    const elapsed =
      timer.status === "running"
        ? Math.max(0, current - timer.startedAtMs)
        : timer.elapsedMs || 0;
    const remainingMs = Math.max(
      0,
      timer.durationMs - elapsed
    );
    return deepFreeze({
      ...timer,
      elapsedMs: Math.min(elapsed, timer.durationMs),
      remainingMs,
      remainingSeconds: Math.ceil(remainingMs / 1000),
      expired: remainingMs <= 0,
    });
  }

  function all({ includeCompleted = false } = {}) {
    return deepFreeze(
      load()
        .map(hydrate)
        .filter(
          (timer) =>
            includeCompleted ||
            !["cancelled", "completed"].includes(timer.status)
        )
    );
  }

  function get(id) {
    const timer = load().find((row) => row.id === id);
    return timer ? hydrate(timer) : null;
  }

  function start({
    label = "Kitchen Timer",
    seconds,
    sessionId = null,
    stepIndex = null,
  } = {}) {
    const durationMs = asMillis(seconds);
    const now = clock();
    const timer = {
      id: createId("TMR", now),
      label: String(label || "Kitchen Timer").trim(),
      sessionId,
      stepIndex:
        Number.isInteger(stepIndex) ? stepIndex : null,
      durationMs,
      elapsedMs: 0,
      startedAtMs: now.getTime(),
      startedAt: isoNow(() => now),
      status: "running",
      createdAt: isoNow(() => now),
      updatedAt: isoNow(() => now),
    };
    const rows = load();
    rows.push(timer);
    save(rows);
    return hydrate(timer);
  }

  function pause(id) {
    const rows = load();
    const timer = rows.find((row) => row.id === id);
    if (!timer) throw new Error(`Timer not found: ${id}`);
    if (timer.status !== "running") return hydrate(timer);

    const elapsed = Math.min(
      timer.durationMs,
      Math.max(0, nowMs() - timer.startedAtMs)
    );
    timer.elapsedMs = elapsed;
    timer.status = elapsed >= timer.durationMs ? "completed" : "paused";
    timer.updatedAt = isoNow(clock);
    save(rows);
    return hydrate(timer);
  }

  function resume(id) {
    const rows = load();
    const timer = rows.find((row) => row.id === id);
    if (!timer) throw new Error(`Timer not found: ${id}`);
    if (timer.status === "running") return hydrate(timer);
    if (timer.status === "cancelled") {
      throw new Error("Cancelled timer cannot be resumed");
    }
    if (timer.elapsedMs >= timer.durationMs) {
      timer.status = "completed";
      save(rows);
      return hydrate(timer);
    }

    timer.startedAtMs = nowMs() - (timer.elapsedMs || 0);
    timer.status = "running";
    timer.updatedAt = isoNow(clock);
    save(rows);
    return hydrate(timer);
  }

  function cancel(id) {
    const rows = load();
    const timer = rows.find((row) => row.id === id);
    if (!timer) throw new Error(`Timer not found: ${id}`);
    timer.status = "cancelled";
    timer.updatedAt = isoNow(clock);
    save(rows);
    return hydrate(timer);
  }

  function complete(id) {
    const rows = load();
    const timer = rows.find((row) => row.id === id);
    if (!timer) throw new Error(`Timer not found: ${id}`);
    timer.elapsedMs = timer.durationMs;
    timer.status = "completed";
    timer.updatedAt = isoNow(clock);
    save(rows);
    return hydrate(timer);
  }

  function clearCompleted() {
    const rows = load().filter(
      (timer) =>
        !["cancelled", "completed"].includes(timer.status)
    );
    save(rows);
    return deepFreeze(rows.map(hydrate));
  }

  return Object.freeze({
    all,
    get,
    start,
    pause,
    resume,
    cancel,
    complete,
    clearCompleted,
  });
}

export default createTimerService;
