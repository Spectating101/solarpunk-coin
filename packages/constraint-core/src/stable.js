export function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

export function numeric(value, field = 'value') {
  if (value === '' || value == null) throw new Error(`${field} is required`);
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${field} must be numeric`);
  return parsed;
}

export function optionalNumeric(value) {
  if (value === '' || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function round(value, digits = 6) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Number(parsed.toFixed(digits));
}

export function canonicalTimestamp(value, field = 'timestamp') {
  const raw = String(value ?? '').trim();
  const timezoneQualified = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw.replace(/\s+/g, ''));
  if (!timezoneQualified) throw new Error(`${field} requires Z or an explicit UTC offset`);
  const millis = Date.parse(raw);
  if (!Number.isFinite(millis)) throw new Error(`${field} must be a valid timestamp`);
  return new Date(millis).toISOString().replace('.000Z', 'Z');
}

export function unixSeconds(value, field = 'timestamp') {
  const millis = Date.parse(value);
  if (!Number.isFinite(millis)) throw new Error(`${field} must be a valid timestamp`);
  return Math.floor(millis / 1000);
}

export async function sha256Hex(value) {
  const text = typeof value === 'string' ? value : stableStringify(value);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto SHA-256 is unavailable in this runtime');
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function sum(values) {
  return round(values.reduce((total, value) => total + Number(value || 0), 0));
}
