import { assertPositive, createId, isoNow, normalizeQuantity, sum } from "./kosCore.js";

export const KOS_SESSION_TYPES = Object.freeze(["produce", "transform", "recover", "assemble"]);

export function createProductionService({ repository, inventory, clock } = {}) {
  if (!repository || !inventory) throw new Error("ProductionService requires repository and inventory");

  function record({
    sessionType = "produce",
    title,
    method = "other",
    recipeId = null,
    sourceLotUses = [],
    totalYield,
    eatenNow = 0,
    outputs = [],
    notes = "",
    occurredAt = isoNow(clock),
  }) {
    if (!KOS_SESSION_TYPES.includes(sessionType)) throw new Error(`Unsupported session type: ${sessionType}`);
    if (!title?.trim()) throw new Error("Session title is required");
    const yieldAmount = assertPositive(totalYield, "totalYield");
    const eaten = normalizeQuantity(eatenNow, "eatenNow");
    const outputTotal = sum(outputs.map((output) => output.quantity));
    if (eaten + outputTotal > yieldAmount) throw new Error("Eaten and saved quantities cannot exceed total yield");

    for (const use of sourceLotUses) {
      const source = inventory.get(use.lotId);
      if (!source) throw new Error(`Source lot not found: ${use.lotId}`);
      const amount = assertPositive(use.quantity, "source quantity");
      if (amount > source.quantityAvailable) throw new Error(`Cannot use ${amount} ${source.unit} of ${source.name}; only ${source.quantityAvailable} available`);
    }

    const session = {
      id: createId("KOS", clock?.()), sessionType, title: title.trim(), method, recipeId,
      totalYield: yieldAmount, eatenNow: eaten, unallocated: yieldAmount - eaten - outputTotal,
      sourceLotUses: sourceLotUses.map((item) => ({ ...item })), outputLotIds: [], notes,
      status: "completed", occurredAt, createdAt: isoNow(clock),
    };

    for (const use of sourceLotUses) inventory.consume(use.lotId, use.quantity, { reason: sessionType, sessionId: session.id });

    const outputLots = outputs.map((output) => inventory.addLot({
      ...output,
      sourceSessionId: session.id,
      sourceLotIds: sourceLotUses.map((use) => use.lotId),
    }));
    session.outputLotIds = outputLots.map((lot) => lot.id);

    repository.update((state) => {
      state.sessions.push(session);
      if (eaten > 0) state.consumptionEvents.push({ id: createId("CON", clock?.()), sessionId: session.id, quantity: eaten, unit: outputs[0]?.unit || "servings", consumedAt: occurredAt, notes: "Consumed during production session" });
      return state;
    });
    return { session, outputLots };
  }

  function quickRecord({ title, recipeId = null, method = "other", totalYield, eatenNow = 0, savedQuantity, savedAs = "finished-meal", savedName = title, storageLocation = "freezer", unit = "servings" }) {
    return record({
      sessionType: "produce", title, recipeId, method, totalYield, eatenNow,
      outputs: savedQuantity > 0 ? [{ name: savedName, itemType: savedAs, quantity: savedQuantity, unit, storageLocation, recipeId }] : [],
    });
  }

  function all() { return repository.load().sessions; }
  function get(id) { return all().find((session) => session.id === id) || null; }

  return Object.freeze({ record, quickRecord, all, get });
}

export default createProductionService;
