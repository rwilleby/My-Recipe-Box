export function uniqueRecordsByPermanentId(records = []) {
  const uniqueRecords = new Map();

  records.forEach((record) => {
    const permanentId = String(record?.id || record?.code || "").trim();
    if (permanentId && !uniqueRecords.has(permanentId)) uniqueRecords.set(permanentId, record);
  });

  return [...uniqueRecords.values()];
}
