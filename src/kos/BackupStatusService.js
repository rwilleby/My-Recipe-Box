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

function daysBetween(a, b) {
  const start = new Date(a);
  const end = new Date(b);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return Math.floor((end.getTime() - start.getTime()) / 86400000);
}

export function createBackupStatusService({
  protection,
  repository,
  clock = () => new Date(),
  reminderDays = 14,
} = {}) {
  if (!protection || !repository) {
    throw new Error(
      "BackupStatusService requires protection and repository"
    );
  }

  function reminderThreshold() {
    const value = Number(reminderDays);
    return Number.isFinite(value) && value > 0 ? value : 14;
  }

  function recovery() {
    const state = protection.recoveryStatus();
    return freeze({
      automaticRecoveryEnabled:
        Boolean(state.automaticRecoveryEnabled),
      recoveryPointCount:
        Number(state.recoveryPointCount || 0),
      latestRecoveryPoint:
        state.latestRecoveryPoint || null,
      distinction: state.distinction,
    });
  }

  function external() {
    const lastExternalBackupAt =
      repository.lastExternalBackupAt();
    const threshold = reminderThreshold();
    const now = clock();

    const daysSince =
      lastExternalBackupAt
        ? daysBetween(lastExternalBackupAt, now)
        : null;

    const due =
      !lastExternalBackupAt ||
      (daysSince !== null && daysSince >= threshold);

    const overdueBy =
      due && daysSince !== null
        ? Math.max(0, daysSince - threshold)
        : null;

    return freeze({
      lastExternalBackupAt,
      reminderDays: threshold,
      daysSinceLastBackup: daysSince,
      due,
      overdueByDays: overdueBy,
      status:
        !lastExternalBackupAt
          ? "never-backed-up"
          : due
          ? "backup-due"
          : "current",
    });
  }

  function summary() {
    const recoveryState = recovery();
    const externalState = external();

    return freeze({
      recovery: recoveryState,
      external: externalState,
      headline:
        externalState.status === "never-backed-up"
          ? "Create your first external backup"
          : externalState.status === "backup-due"
          ? "External backup is due"
          : "Backup status is current",
      explanation:
        "Automatic recovery stays in this browser. External backups can survive loss of the browser or device.",
    });
  }

  function restorePoints({ limit = 10 } = {}) {
    const points = repository.listRecoveryPoints();
    return freeze(
      points
        .slice(0, Math.max(0, limit))
        .map((point) => ({
          id: point.id,
          reason: point.reason,
          createdAt: point.createdAt,
          schemaVersion: point.schemaVersion,
        }))
    );
  }

  function verifyBackup(backup) {
    return freeze(
      protection.verifyExternalBackup(backup)
    );
  }

  return Object.freeze({
    recovery,
    external,
    summary,
    restorePoints,
    verifyBackup,
  });
}

export default createBackupStatusService;
