import { useRef, useState } from "react";
import {
  downloadBackup,
  readBackupFile,
  restoreBackupDocument,
} from "../utils/backupService";

const SUCCESS_BACKUP =
  "Your Recipe Box backup has been downloaded. Keep this file somewhere safe so you can restore your information later or move it to another device.";
const SUCCESS_RESTORE = "Your Recipe Box information has been restored successfully.";
const ERROR_RESTORE =
  "We could not restore this file. Please select a valid Robert’s Recipe Box backup file.";

export default function UserDataBackupSection({ onRestored }) {
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const [pendingBackup, setPendingBackup] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("status");

  function announce(text, type = "status") {
    setMessage(text);
    setMessageType(type);
  }

  function handleBackup() {
    try {
      downloadBackup();
      announce(SUCCESS_BACKUP, "success");
    } catch {
      announce("We could not create your backup. Please try again.", "error");
    }
  }

  async function handleFileSelected(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const backup = await readBackupFile(file);
      setPendingBackup(backup);
      announce(
        "Backup file verified. Choose whether to merge it with or replace the information currently saved in this browser.",
        "warning"
      );
      dialogRef.current?.showModal();
    } catch {
      setPendingBackup(null);
      announce(ERROR_RESTORE, "error");
    }
  }

  function closeDialog() {
    dialogRef.current?.close();
    setPendingBackup(null);
  }

  function restore(mode) {
    if (!pendingBackup) return;
    try {
      const result = restoreBackupDocument(pendingBackup, mode);
      closeDialog();
      announce(SUCCESS_RESTORE, "success");
      onRestored?.(result);
    } catch {
      closeDialog();
      announce(ERROR_RESTORE, "error");
    }
  }

  return (
    <section id="your-recipe-box-data" className="userDataSection" aria-labelledby="user-data-heading">
      <div className="userDataSectionHeader">
        <div>
          <span className="userDataEyebrow">PRIVATE · LOCAL · PORTABLE</span>
          <h2 id="user-data-heading">Your Recipe Box Data</h2>
        </div>
      </div>

      <p className="userDataPrivacyText">
        Your information stays in your browser and is not stored on our servers. Use Backup My Recipe Box to download a copy of your favorites, notes, lists, meal plans, and preferences. You can restore that file on this or another device at any time.
      </p>

      <div className="userDataActions">
        <button type="button" className="primary" onClick={handleBackup}>
          Backup My Recipe Box
        </button>
        <button type="button" className="secondary" onClick={() => inputRef.current?.click()}>
          Restore My Recipe Box
        </button>
        <input
          ref={inputRef}
          className="visuallyHiddenFileInput"
          type="file"
          accept=".json,application/json"
          onChange={handleFileSelected}
          aria-label="Select a Robert's Recipe Box backup file"
        />
      </div>

      <p className="userDataReminder">
        Keep your backup file somewhere safe, such as your Documents folder, a USB drive, iCloud Drive, Google Drive, Dropbox, or OneDrive. New changes made after a backup will not be included unless you create another backup.
      </p>

      <div
        className={`userDataMessage userDataMessage-${messageType}`}
        role={messageType === "error" ? "alert" : "status"}
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>

      <dialog ref={dialogRef} className="userDataDialog" aria-labelledby="restore-dialog-title">
        <form method="dialog" onSubmit={(event) => event.preventDefault()}>
          <h2 id="restore-dialog-title">Restore Your Recipe Box?</h2>
          <p>
            Restoring may change or replace information currently saved in this browser.
            Merge keeps existing information where practical. Replace removes supported
            saved categories that are not present in the backup.
          </p>
          <div className="userDataDialogActions">
            <button type="button" className="primary" onClick={() => restore("merge")}>
              Merge With Existing Data
            </button>
            <button type="button" className="secondary dangerOutline" onClick={() => restore("replace")}>
              Replace Existing Data
            </button>
            <button type="button" className="secondary" onClick={closeDialog}>
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
