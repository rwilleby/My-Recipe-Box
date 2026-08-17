import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildKitchenReminders,
  KITCHEN_REMINDER_SNOOZE_KEY,
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

function IconButton({ label, children, ...props }) {
  return <button type="button" className="kitchenReminderIconButton" aria-label={label} title={label} {...props}>{children}</button>;
}

export default function KitchenReminderRibbon({
  plan,
  refrigerator,
  freezer,
  preparedInventory,
  kosUi,
  setActivePage,
}) {
  const [clock, setClock] = useState(() => Date.now());
  const [weekendPlan, setWeekendPlan] = useState(() => readJson(WEEKEND_BULK_PLAN_KEY, {}));
  const [backup, setBackup] = useState(() => readBackup(kosUi));
  const [snoozes, setSnoozes] = useState(() => readJson(KITCHEN_REMINDER_SNOOZE_KEY, {}));
  const [hiddenThisVisit, setHiddenThisVisit] = useState(() => new Set());
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const ribbonRef = useRef(null);

  useEffect(() => {
    function refresh() {
      setClock(Date.now());
      setWeekendPlan(readJson(WEEKEND_BULK_PLAN_KEY, {}));
      setSnoozes(readJson(KITCHEN_REMINDER_SNOOZE_KEY, {}));
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
    backup,
    plan,
    weekendPlan,
    refrigerator,
    freezer,
    preparedInventory,
  }).filter((reminder) => {
    if (hiddenThisVisit.has(reminder.id)) return false;
    return Number(snoozes[reminder.id] || 0) <= clock;
  }), [backup, clock, freezer, hiddenThisVisit, plan, preparedInventory, refrigerator, snoozes, weekendPlan]);

  useEffect(() => {
    setIndex((current) => reminders.length ? Math.min(current, reminders.length - 1) : 0);
  }, [reminders.length]);

  useEffect(() => {
    if (paused || hovered || focusWithin || reminders.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % reminders.length);
    }, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [focusWithin, hovered, paused, reminders.length]);

  if (!reminders.length) return null;
  const reminder = reminders[index] || reminders[0];

  function move(direction) {
    setIndex((current) => (current + direction + reminders.length) % reminders.length);
  }

  function snoozeTomorrow() {
    const next = { ...snoozes, [reminder.id]: Date.now() + ONE_DAY_MS };
    window.localStorage.setItem(KITCHEN_REMINDER_SNOOZE_KEY, JSON.stringify(next));
    setSnoozes(next);
  }

  function hideForVisit() {
    setHiddenThisVisit((current) => new Set([...current, reminder.id]));
  }

  return (
    <aside
      ref={ribbonRef}
      className={`kitchenReminderRibbon kitchenReminderRibbon--${reminder.tone}`}
      aria-label="Kitchen reminders"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
      }}
    >
      <div className="kitchenReminderInner">
        <div className="kitchenReminderMessage" aria-live="polite" aria-atomic="true">
          <span className="kitchenReminderDot" aria-hidden="true" />
          <span className="kitchenReminderEyebrow">{reminder.eyebrow}</span>
          <span className="kitchenReminderText">{reminder.message}</span>
        </div>
        <div className="kitchenReminderActions">
          <button type="button" className="kitchenReminderPrimary" onClick={() => setActivePage(reminder.page)}>
            {reminder.actionLabel}
          </button>
          <button type="button" className="kitchenReminderQuiet" onClick={snoozeTomorrow}>Remind Me Tomorrow</button>
          <button type="button" className="kitchenReminderQuiet" onClick={hideForVisit}>Hide for This Visit</button>
          {reminders.length > 1 && (
            <div className="kitchenReminderControls" aria-label="Reminder rotation controls">
              <IconButton label="Previous reminder" onClick={() => move(-1)}>‹</IconButton>
              <span aria-label={`Reminder ${index + 1} of ${reminders.length}`}>{index + 1} of {reminders.length}</span>
              <IconButton label="Next reminder" onClick={() => move(1)}>›</IconButton>
              <IconButton label={paused ? "Resume reminders" : "Pause reminders"} onClick={() => setPaused((current) => !current)}>
                {paused ? "▶" : "Ⅱ"}
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
