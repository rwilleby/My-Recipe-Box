// v83 compatibility adapter. Backup and Restore now has one authoritative
// implementation in recipeBoxBackup.js. These names remain available so an
// older component or test cannot silently fall back to the incomplete v1
// category list.
import {
  createRecipeBoxBackup,
  downloadRecipeBoxBackup,
  readRecipeBoxBackupFile,
  recipeBoxBackupInfo,
  restoreRecipeBoxBackup,
  validateRecipeBoxBackup,
} from "./recipeBoxBackup.js";

export function collectUserData(storage) {
  return createRecipeBoxBackup(storage).data.storage;
}

export function createBackupDocument(storage, now = new Date()) {
  return createRecipeBoxBackup(storage, now);
}

export function downloadBackup(storage) {
  return downloadRecipeBoxBackup(storage);
}

export function readBackupFile(file) {
  return readRecipeBoxBackupFile(file);
}

export function validateBackupDocument(document) {
  return validateRecipeBoxBackup(document);
}

export function restoreBackupDocument(document, mode = "merge", storage) {
  return restoreRecipeBoxBackup(document, mode, storage);
}

export const backupServiceConstants = Object.freeze({
  applicationName: recipeBoxBackupInfo.application,
  backupVersion: recipeBoxBackupInfo.backupVersion,
  maxBackupBytes: recipeBoxBackupInfo.maxFileSize,
});
