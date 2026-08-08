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

export function createKosUiController(kos) {
  if (!kos?.kitchen) {
    throw new Error("KosUiController requires a complete KOS platform");
  }

  const listeners = new Set();

  function snapshot() {
    return freeze({
      home: kos.kitchen.home(),
      health: kos.kitchen.health(),
      activeProduction: kos.productionCenter.active(),
      activeCooking: kos.cookingSessions.current(),
      timers: kos.timers.all(),
      inventory: kos.inventoryIntelligence.dashboard(),
      planner: kos.mealPlanner.dashboard(),
      shopping: kos.shopping.dashboard(),
      pantry: {
        summary: kos.pantry.summary(),
        items: kos.pantry.all(),
        expiringSoon: kos.pantry.expiring({ withinDays: 7 }),
      },
      backup: kos.backupStatus.summary(),
    });
  }

  function emit() {
    const state = snapshot();
    for (const listener of listeners) listener(state);
    return state;
  }

  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error("listener must be a function");
    }
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function viewIntent(id) {
    return kos.kitchen.intent(id);
  }

  function backupStatus() {
    return kos.backupStatus.summary();
  }

  function screenModel(id) {
    return kos.screenModels.screen(id);
  }

  function command(type, payload = {}) {
    let result;

    switch (type) {
      case "production.start":
        result = kos.productionCenter.start(payload);
        break;
      case "production.update":
        result = kos.productionCenter.update(payload);
        break;
      case "production.finish":
        result = kos.productionCenter.finish(payload);
        break;
      case "production.cancel":
        result = kos.productionCenter.cancel();
        break;
      case "cooking.start":
        result = kos.cookingSessions.start(payload);
        break;
      case "cooking.next":
        result = kos.cookingSessions.nextStep();
        break;
      case "cooking.previous":
        result = kos.cookingSessions.previousStep();
        break;
      case "cooking.completeStep":
        result = kos.cookingSessions.completeStep(payload.index ?? null);
        break;
      case "cooking.note":
        result = kos.cookingSessions.addNote(payload.text);
        break;
      case "cooking.finish":
        result = kos.cookingSessions.finish();
        break;
      case "cooking.cancel":
        result = kos.cookingSessions.cancel();
        break;
      case "timer.start":
        result = kos.timers.start(payload);
        break;
      case "timer.pause":
        result = kos.timers.pause(payload.id);
        break;
      case "timer.resume":
        result = kos.timers.resume(payload.id);
        break;
      case "timer.cancel":
        result = kos.timers.cancel(payload.id);
        break;
      case "timer.complete":
        result = kos.timers.complete(payload.id);
        break;
      case "inventory.consume":
        result = kos.inventoryActions.consume(payload);
        break;
      case "inventory.adjust":
        result = kos.inventoryActions.adjust(payload);
        break;
      case "inventory.package":
        result = kos.inventoryActions.packageLot(payload);
        break;
      case "planner.start":
        result = kos.mealPlanner.start(payload);
        break;
      case "planner.assign":
        result = kos.mealPlanner.assign(payload.day, payload.meal);
        break;
      case "planner.remove":
        result = kos.mealPlanner.remove(payload.day);
        break;
      case "planner.clear":
        result = kos.mealPlanner.clear();
        break;
      case "planner.mode":
        result = kos.mealPlanner.setMode(payload.mode);
        break;
      case "shopping.add":
        result = kos.shopping.upsert(payload);
        break;
      case "shopping.check":
        result = kos.shopping.check(payload.id, payload.checked ?? true);
        break;
      case "shopping.remove":
        result = kos.shopping.remove(payload.id);
        break;
      case "shopping.clearChecked":
        result = kos.shopping.clearChecked();
        break;
      case "shopping.rebuildFromPlanner":
        result = kos.shopping.rebuildFromPlanner(payload);
        break;
      case "pantry.add":
      case "pantry.upsert":
        result = kos.pantry.upsert(payload);
        break;
      case "pantry.adjust":
        result = kos.pantry.adjust(payload.id, payload.quantity);
        break;
      case "pantry.consume":
        result = kos.pantry.consume(payload.id, payload.quantity ?? 1);
        break;
      case "pantry.remove":
        result = kos.pantry.remove(payload.id);
        break;
      case "backup.recoveryPoint":
        result = kos.protection.createRecoveryPoint(payload.reason || "manual");
        break;
      case "backup.export":
        result = kos.protection.createExternalBackup();
        break;
      case "backup.restore":
        result = kos.protection.restoreExternalBackup(payload.backup);
        break;
      default:
        throw new Error(`Unsupported KOS UI command: ${type}`);
    }

    emit();
    return result;
  }

  const execute = command;

  return Object.freeze({
    snapshot,
    subscribe,
    emit,
    viewIntent,
    screenModel,
    backupStatus,
    command,
    execute,
  });
}

export default createKosUiController;
