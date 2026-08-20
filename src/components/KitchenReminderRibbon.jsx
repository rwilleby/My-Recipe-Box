import { useEffect, useMemo, useState } from "react";
import {
  buildKitchenReminders,
  WEEKEND_BULK_PLAN_KEY,
} from "../utils/kitchenReminderEngine.js";
import "./KitchenReminderRibbon.css";

const ROTATION_MS = 9000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function readJson(key, fallback) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key));
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function readBackup(kosUi) {
  const status = kosUi?.backupStatus?.();
  const external = status?.external || {};
  const lastBackupAt = window.localStorage.getItem("rrb_backup_last_completed_at") || "";
  const intervalDays = Number(window.localStorage.getItem("rrb_backup_reminder_interval_days")) || 7;
  const snoozedUntil = window.localStorage.getItem("rrb_backup_reminder_snoozed_until") || "";
  const scheduledAt = lastBackupAt
    ? new Date(lastBackupAt).getTime() + intervalDays * ONE_DAY_MS
    : 0;
  const dueAt = Math.max(scheduledAt, new Date(snoozedUntil).getTime() || 0);

  return {
    due: external.status ? external.status !== "current" : !lastBackupAt || Date.now() >= dueAt,
    lastBackupAt: external.lastCompletedAt || lastBackupAt,
  };
}

export default function KitchenReminderRibbon({
  plan,
  refrigerator,
  freezer,
  preparedInventory,
  kosUi,
  setActivePage,
  enableBackupWarnings = false,
}) {
  const [clock, setClock] = useState(() => Date.now());
  const [weekendPlan, setWeekendPlan] = useState(() => readJson(WEEKEND_BULK_PLAN_KEY, {}));
  const [backup, setBackup] = useState(() => readBackup(kosUi));
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [reducedMotion] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  useEffect(() => {
    function refresh() {
      setClock(Date.now());
      setWeekendPlan(readJson(WEEKEND_BULK_PLAN_KEY, {}));
      setBackup(readBackup(kosUi));
    }

    const timer = window.setInterval(refresh, 60000);
    window.addEventListener("storage", refresh);
    window.addEventListener("rrb:backup-completed", refresh);
    window.addEventListener("rrb:weekend-bulk-plan-updated", refresh);
    const unsubscribe = kosUi?.subscribe?.(refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("rrb:backup-completed", refresh);
      window.removeEventListener("rrb:weekend-bulk-plan-updated", refresh);
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [kosUi]);

  const reminders = useMemo(() => buildKitchenReminders({
    now: clock,
    backup: enableBackupWarnings ? backup : { ...backup, due: false, isDue: false },
    plan,
    weekendPlan,
    refrigerator,
    freezer,
    preparedInventory,
  }), [backup, clock, enableBackupWarnings, freezer, plan, preparedInventory, refrigerator, weekendPlan]);

  useEffect(() => {
    setIndex((current) => reminders.length ? Math.min(current, reminders.length - 1) : 0);
  }, [reminders.length]);

  useEffect(() => {
    let fadeTimer;
    setFading(false);
    if (reducedMotion || hovered || focusWithin || reminders.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setFading(true);
      fadeTimer = window.setTimeout(() => {
        setIndex((current) => (current + 1) % reminders.length);
        setFading(false);
      }, 325);
    }, ROTATION_MS);
    return () => {
      window.clearInterval(timer);
      if (fadeTimer) window.clearTimeout(fadeTimer);
    };
  }, [focusWithin, hovered, reducedMotion, reminders.length]);

  if (!reminders.length) return null;
  const reminder = reminders[index] || reminders[0];

  return (
    <aside
      className="kitchenReminderRibbon"
      aria-label="Kitchen reminders"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
      }}
    >
      <div className="kitchenReminderInner">
        <div className={`kitchenReminderMessage${fading ? " isFading" : ""}`} aria-live="polite" aria-atomic="true">
          <span className="kitchenReminderText">{reminder.message}</span>
          {" "}
          <button type="button" className="kitchenReminderTextAction" onClick={() => setActivePage(reminder.page)}>
            {reminder.actionLabel} <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
