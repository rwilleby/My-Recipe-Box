function freeze(value) {
  if (Array.isArray(value)) return Object.freeze(value.map(freeze));
  if (value && typeof value === "object") {
    return Object.freeze(
      Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, freeze(item)])
      )
    );
  }
  return value;
}

export function createDataProtectionService({
  repository,
  storageManager = globalThis.navigator?.storage,
} = {}) {
  if (!repository) {
    throw new Error("DataProtectionService requires repository");
  }

  async function storageStatus() {
    if (!storageManager) {
      return freeze({
        supported: false,
        persistent: false,
        quota: null,
        usage: null,
      });
    }

    const persistent = typeof storageManager.persisted === "function"
      ? Boolean(await storageManager.persisted())
      : false;
    const estimate = typeof storageManager.estimate === "function"
      ? await storageManager.estimate()
      : {};

    return freeze({
      supported: true,
      persistent,
      quota: Number.isFinite(estimate.quota) ? estimate.quota : null,
      usage: Number.isFinite(estimate.usage) ? estimate.usage : null,
    });
  }

  async function requestPersistentStorage() {
    if (!storageManager || typeof storageManager.persist !== "function") {
      return freeze({ supported: false, granted: false });
    }

    const granted = Boolean(await storageManager.persist());
    return freeze({ supported: true, granted });
  }

  function recoveryStatus() {
    const points = repository.listRecoveryPoints();
    return freeze({
      automaticRecoveryEnabled: true,
      recoveryPointCount: points.length,
      latestRecoveryPoint: points[0] || null,
      lastExternalBackupAt: repository.lastExternalBackupAt(),
      distinction:
        "Recovery points stay in this browser. External backups can survive loss of the browser or device.",
    });
  }

  function createRecoveryPoint(reason = "manual") {
    return repository.createRecoveryPoint(reason);
  }

  function restoreRecoveryPoint(id) {
    return repository.restoreRecoveryPoint(id);
  }

  function createExternalBackup() {
    return repository.exportBackup();
  }

  function restoreExternalBackup(backup) {
    return repository.importBackup(backup);
  }

  function verifyExternalBackup(backup) {
    return repository.verifyBackup(backup);
  }

  return Object.freeze({
    storageStatus,
    requestPersistentStorage,
    recoveryStatus,
    createRecoveryPoint,
    restoreRecoveryPoint,
    createExternalBackup,
    restoreExternalBackup,
    verifyExternalBackup,
  });
}

export default createDataProtectionService;
