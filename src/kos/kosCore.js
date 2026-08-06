export const KOS_SCHEMA_VERSION = 1;

export function createId(prefix = "KOS", now = new Date()) {
  const stamp = now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${stamp}-${random}`;
}

export function isoNow(clock = () => new Date()) {
  return clock().toISOString();
}

export function normalizeQuantity(value, field = "quantity") {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${field} must be a non-negative number`);
  }
  return number;
}

export function assertPositive(value, field = "quantity") {
  const number = normalizeQuantity(value, field);
  if (number <= 0) throw new Error(`${field} must be greater than zero`);
  return number;
}

export function freezeRecord(record) {
  return Object.freeze({ ...record });
}

export function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function sum(values = []) {
  return values.reduce((total, value) => total + Number(value || 0), 0);
}
