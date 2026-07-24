import { useEffect, useMemo, useRef, useState } from "react";
import {
  downloadRecipeBoxBackup,
  estimateRecipeBoxBackupSize,
  formatByteEstimate,
  getBackupReminderSettings,
  getBackupStatus,
  getRecipeBoxBackupSummary,
  readRecipeBoxBackupFile,
  recipeBoxBackupInfo,
  restoreRecipeBoxBackup,
  updateBackupReminderInterval,
} from "../utils/recipeBoxBackup";

const REMINDER_OPTIONS = [
  { value: 0, label: "Never" },
  { value: 7, label: "Every 7 days" },
  { value: 14, label: "Every 14 days" },
  { value: 30, label: "Every 30 days" },
  { value: 60, label: "Every 60 days" },
  { value: 90, label: "Every 90 days" },
];

function formatDateTime(value) {
  if (!value) return "No backup has been created from this browser yet.";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value) {
  if (!value) return "Backup reminders are turned off.";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function reminderLabel(days) {
  return REMINDER_OPTIONS.find((option) => option.value === days)?.label || "Every 30 days";
}

export default function UserDataBackupSection({ onRestored, onLearnMore }) {
  const fileInputRef = useRef(null);
  const dialogRef = useRef(null);
  const restoreTriggerRef = useRef(null);
  const [pendingBackup, setPendingBackup] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("status");
  const [status, setStatus] = useState(() => getBackupStatus());
  const [summary, setSummary] = useState(() => getRecipeBoxBackupSummary());
  const [estimatedSize, setEstimatedSize] = useState(() => formatByteEstimate(estimateRecipeBoxBackupSize()));

  const visibleCategories = useMemo(
    () => summary.categories.filter((category) => category.present || category.count === null || category.count > 0),
    [summary]
  );

  function refreshStatus() {
    setStatus(getBackupStatus());
    setSummary(getRecipeBoxBackupSummary());
    setEstimatedSize(formatByteEstimate(estimateRecipeBoxBackupSize()));
  }

  useEffect(() => {
    function handleStatusChange() {
      refreshStatus();
    }
    window.addEventListener("rrb:backup-status-changed", handleStatusChange);
    window.addEventListener("rrb:backup-completed", handleStatusChange);
    window.addEventListener("rrb:user-data-restored", handleStatusChange);
    return () => {
      window.removeEventListener("rrb:backup-status-changed", handleStatusChange);
      window.removeEventListener("rrb:backup-completed", handleStatusChange);
      window.removeEventListener("rrb:user-data-restored", handleStatusChange);
    };
  }, []);

  function announce(text, type = "status") {
    setMessage(text);
    setMessageType(type);
  }

  function backup() {
    try {
      downloadRecipeBoxBackup();
      refreshStatus();
      announce(
        "Your Recipe Box backup has been downloaded. Keep this file somewhere safe so you can restore your information later or move it to another device.",
        "success"
      );
    } catch {
      announce(
        "We could not create your backup. Your saved Recipe Box information has not been changed. Please try again.",
        "error"
      );
    }
  }

  function openRestorePicker(event) {
    restoreTriggerRef.current = event.currentTarget;
    fileInputRef.current?.click();
  }

  async function selectFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const validated = await readRecipeBoxBackupFile(file);
      setPendingBackup(validated);
      announce("Backup file verified. Choose how you want to restore it.", "warning");
      dialogRef.current?.showModal();
    } catch {
      setPendingBackup(null);
      announce("We could not restore this file. Please select a valid Robert’s Recipe Box backup file.", "error");
    }
  }

  function closeDialog() {
    dialogRef.current?.close();
    setPendingBackup(null);
    window.setTimeout(() => restoreTriggerRef.current?.focus(), 0);
  }

  function restore(mode) {
    try {
      const result = restoreRecipeBoxBackup(pendingBackup, mode);
      closeDialog();
      refreshStatus();
      announce("Your Recipe Box information has been restored successfully.", "success");
      onRestored?.(result);
    } catch {
      closeDialog();
      announce("We could not restore this file. Please select a valid Robert’s Recipe Box backup file.", "error");
    }
  }

  function changeReminder(event) {
    try {
      const next = updateBackupReminderInterval(Number(event.target.value));
      setStatus(getBackupStatus());
      announce(
        next.reminderIntervalDays === 0
          ? "Backup reminders have been turned off. You can turn them back on at any time in the Backup Center."
          : "Your backup reminder has been updated.",
        "success"
      );
    } catch {
      announce(
        "Your browser is not currently allowing Robert’s Recipe Box to save backup reminder settings. You may still create a manual backup.",
        "error"
      );
    }
  }

  return (
    <section id="your-recipe-box-data" className="userDataSection" aria-labelledby="user-recipe-box-data-title">
      <div className="userDataSectionHeader">
        <div className="aiBadge">PRIVATE · LOCAL · PORTABLE</div>
        <h2 id="user-recipe-box-data-title">Your Recipe Box Data</h2>
        <h3>Backup Center</h3>
      </div>

      <p className="userDataPrivacyText">
        Your information stays in your browser and is not stored in a Robert’s Recipe Box visitor account. Use Backup My Recipe Box to download a copy of your favorites, notes, lists, meal plans, pantry information, and preferences. You can restore that file on this or another device at any time.
      </p>

      <div className="backupCenterGrid">
        <section className="backupCenterCard" aria-labelledby="backup-status-heading">
          <h3 id="backup-status-heading">Backup Status</h3>
          <dl className="backupStatusList">
            <div>
              <dt>Last Backup</dt>
              <dd>{formatDateTime(status.lastSuccessfulBackupAt)}</dd>
            </div>
            <div>
              <dt>Backup Reminder</dt>
              <dd>{reminderLabel(status.reminderIntervalDays)}</dd>
            </div>
            <div>
              <dt>Next Reminder</dt>
              <dd>{status.remindersEnabled ? formatDate(status.nextReminderAt) : "Backup reminders are turned off."}</dd>
            </div>
            <div>
              <dt>Current Status</dt>
              <dd><span className={status.due ? "backupStatusBadge recommended" : "backupStatusBadge"}>{status.statusText}</span></dd>
            </div>
            <div>
              <dt>Estimated Backup Size</dt>
              <dd>{estimatedSize} <small>(estimate)</small></dd>
            </div>
            {status.lastRestoredBackupExportedAt && (
              <div>
                <dt>Restored Backup History</dt>
                <dd>Last restored file was originally exported {formatDateTime(status.lastRestoredBackupExportedAt)}.</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="backupCenterCard" aria-labelledby="backup-items-heading">
          <h3 id="backup-items-heading">Items Included</h3>
          <ul className="backupIncludedList">
            {visibleCategories.map((category) => (
              <li key={category.key}>
                <span>{category.label}</span>
                <strong>{category.count === null ? "Included" : category.count}</strong>
              </li>
            ))}
            {summary.additionalCount > 0 && (
              <li>
                <span>Other supported Recipe Box settings</span>
                <strong>{summary.additionalCount}</strong>
              </li>
            )}
          </ul>
        </section>
      </div>

      <section className="backupReminderSettings" aria-labelledby="backup-reminder-settings-heading">
        <div>
          <h3 id="backup-reminder-settings-heading">Remind Me to Back Up</h3>
          <p>Backups are never downloaded automatically. This private reminder appears only when you return after the selected interval.</p>
        </div>
        <label htmlFor="backup-reminder-interval">Backup reminder interval</label>
        <select
          id="backup-reminder-interval"
          value={status.reminderIntervalDays}
          onChange={changeReminder}
        >
          {REMINDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </section>

      <div className="userDataActions" aria-label="Recipe Box backup actions">
        <button type="button" className="primary" onClick={backup}>Backup My Recipe Box</button>
        <button type="button" className="secondary" onClick={openRestorePicker}>Restore My Recipe Box</button>
        <input
          ref={fileInputRef}
          className="visuallyHiddenFileInput"
          type="file"
          accept=".json,application/json"
          onChange={selectFile}
          aria-label="Select a Robert's Recipe Box backup file"
        />
      </div>

      <p className="userDataReminder">
        Keep your backup file somewhere safe, such as your Documents folder, a USB drive, iCloud Drive, Google Drive, Dropbox, or OneDrive. New changes made after a backup will not be included unless you create another backup.
      </p>

      {onLearnMore && (
        <button type="button" className="userDataLearnMore" onClick={onLearnMore}>
          Learn more about privacy and how your Recipe Box data is handled.
        </button>
      )}

      <div className={`userDataMessage userDataMessage-${messageType}`} role={messageType === "error" ? "alert" : "status"} aria-live="polite" aria-atomic="true">
        {message}
      </div>

      <dialog ref={dialogRef} className="userDataDialog" aria-labelledby="restore-recipe-box-title" onCancel={closeDialog}>
        <form method="dialog" onSubmit={(event) => event.preventDefault()}>
          <h2 id="restore-recipe-box-title">Restore Your Recipe Box?</h2>
          <p>
            Restoring may replace information currently saved in this browser. Merge keeps existing information where practical. Replace removes current Robert’s Recipe Box browser data before restoring this backup.
          </p>
          <div className="userDataDialogActions">
            <button type="button" className="primary" onClick={() => restore("merge")}>Merge With Existing Data</button>
            <button type="button" className="secondary dangerOutline" onClick={() => restore("replace")}>Replace Existing Data</button>
            <button type="button" className="secondary" onClick={closeDialog}>Cancel</button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
