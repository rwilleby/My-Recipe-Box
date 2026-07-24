import { useEffect, useRef, useState } from "react";
import {
  dismissBackupReminderForSession,
  downloadRecipeBoxBackup,
  getBackupStatus,
  isBackupReminderDismissedForSession,
  recipeBoxBackupInfo,
  snoozeBackupReminder,
  updateBackupReminderInterval,
} from "../utils/recipeBoxBackup";

export default function BackupReminderNotice({ onOpenBackupCenter }) {
  const panelRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState(() => getBackupStatus());
  const [message, setMessage] = useState("");

  useEffect(() => {
    function evaluateReminder() {
      const nextStatus = getBackupStatus();
      setStatus(nextStatus);
      setVisible(nextStatus.due && !isBackupReminderDismissedForSession());
    }

    const timer = window.setTimeout(evaluateReminder, 1200);
    window.addEventListener("rrb:backup-status-changed", evaluateReminder);
    window.addEventListener("rrb:backup-completed", evaluateReminder);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("rrb:backup-status-changed", evaluateReminder);
      window.removeEventListener("rrb:backup-completed", evaluateReminder);
    };
  }, []);

  useEffect(() => {
    if (visible) panelRef.current?.focus();
  }, [visible]);

  function backupNow() {
    try {
      downloadRecipeBoxBackup();
      setVisible(false);
      setMessage("Your Recipe Box backup has been downloaded.");
    } catch {
      setMessage("We could not create your backup. Your saved Recipe Box information has not been changed. Please try again.");
    }
  }

  function remindLater() {
    snoozeBackupReminder(recipeBoxBackupInfo.snoozeDays);
    dismissBackupReminderForSession();
    setVisible(false);
    setMessage(`We’ll remind you again in ${recipeBoxBackupInfo.snoozeDays} days.`);
  }

  function turnOff() {
    updateBackupReminderInterval(0);
    dismissBackupReminderForSession();
    setVisible(false);
    setMessage("Backup reminders have been turned off. You can turn them back on at any time in the Backup Center.");
  }

  if (!visible && !message) return null;

  return (
    <aside className={visible ? "backupReminderNotice" : "backupReminderNotice confirmation"} aria-labelledby={visible ? "backup-reminder-title" : undefined}>
      {visible ? (
        <div ref={panelRef} tabIndex="-1">
          <div className="backupReminderNoticeHeader">
            <div>
              <span>BACKUP RECOMMENDED</span>
              <h2 id="backup-reminder-title">It May Be Time for a New Backup</h2>
            </div>
            <button
              type="button"
              className="backupReminderClose"
              onClick={() => {
                dismissBackupReminderForSession();
                setVisible(false);
              }}
              aria-label="Dismiss backup reminder for this browsing session"
            >
              ×
            </button>
          </div>
          <p>
            {status.lastSuccessfulBackupAt
              ? `Your last Recipe Box backup was created more than ${status.reminderIntervalDays} days ago. `
              : "You have not created a Recipe Box backup from this browser yet. "}
            Creating a new backup helps protect recent favorites, personal notes, grocery lists, meal plans, pantry information, and preferences.
          </p>
          <div className="backupReminderActions">
            <button type="button" className="primary" onClick={backupNow}>Backup Now</button>
            <button type="button" className="secondary" onClick={remindLater}>Remind Me Later</button>
            <button type="button" className="backupReminderTextButton" onClick={turnOff}>Turn Off Reminders</button>
          </div>
          {onOpenBackupCenter && (
            <button type="button" className="backupReminderCenterLink" onClick={onOpenBackupCenter}>
              Open Backup Center
            </button>
          )}
        </div>
      ) : (
        <div className="backupReminderConfirmation" role="status" aria-live="polite">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage("")} aria-label="Dismiss backup status message">×</button>
        </div>
      )}
    </aside>
  );
}
