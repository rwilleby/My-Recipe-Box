import { useRef, useState } from "react";
import {
  downloadRecipeBoxBackup,
  readRecipeBoxBackupFile,
  restoreRecipeBoxBackup,
} from "../utils/recipeBoxBackup";

export default function UserDataBackupSection({ onRestored, onLearnMore }) {
  const fileInputRef = useRef(null);
  const dialogRef = useRef(null);
  const [pendingBackup, setPendingBackup] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("status");

  function announce(text, type = "status") {
    setMessage(text);
    setMessageType(type);
  }

  function backup() {
    try {
      downloadRecipeBoxBackup();
      announce(
        "Your Recipe Box backup has been downloaded. Keep this file somewhere safe so you can restore your information later or move it to another device.",
        "success"
      );
    } catch {
      announce("We could not create your backup. Please try again.", "error");
    }
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
  }

  function restore(mode) {
    try {
      const result = restoreRecipeBoxBackup(pendingBackup, mode);
      closeDialog();
      announce("Your Recipe Box information has been restored successfully.", "success");
      onRestored?.(result);
    } catch {
      closeDialog();
      announce("We could not restore this file. Please select a valid Robert’s Recipe Box backup file.", "error");
    }
  }

  return (
    <section id="your-recipe-box-data" className="userDataSection" aria-labelledby="user-recipe-box-data-title">
      <div className="userDataSectionHeader">
        <div className="aiBadge">PRIVATE · LOCAL · PORTABLE</div>
        <h2 id="user-recipe-box-data-title">Your Recipe Box Data</h2>
      </div>

      <p className="userDataPrivacyText">
        Your information stays in your browser and is not stored on our servers. Use Backup My Recipe Box to download a copy of your favorites, notes, lists, meal plans, and preferences. You can restore that file on this or another device at any time.
      </p>

      <div className="userDataActions">
        <button type="button" className="primary" onClick={backup}>Backup My Recipe Box</button>
        <button type="button" className="secondary" onClick={() => fileInputRef.current?.click()}>Restore My Recipe Box</button>
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

      <dialog ref={dialogRef} className="userDataDialog" aria-labelledby="restore-recipe-box-title">
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
