const SESSION_KEY = 'solarpunk.public_lab.receipt.v1';
const RECEIPT_SCHEMA = 'solarpunk.public_lab.evidence_receipt.v1';
const HASH_RE = /^[a-f0-9]{64}$/;

function resolveStorage(storage) {
  if (storage) return storage;
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function summarizeReceipt(receipt) {
  if (!receipt || receipt.schema !== RECEIPT_SCHEMA) return null;
  if (!HASH_RE.test(String(receipt.evidence_hash || ''))) return null;
  if (!receipt.totals || typeof receipt.totals !== 'object') return null;
  if (receipt.status?.accepted_for_live_minting !== false) return null;

  return {
    schema: receipt.schema,
    evidence_hash: receipt.evidence_hash,
    hash_algorithm: receipt.hash_algorithm || 'SHA-256',
    totals: receipt.totals,
    status: {
      validated_locally: Boolean(receipt.status?.validated_locally),
      evidence_receipt_generated: Boolean(receipt.status?.evidence_receipt_generated),
      accepted_for_live_minting: false,
      physical_truth_or_revenue_grade: false,
      unsigned_browser_receipt: true,
    },
    diagnostics: receipt.diagnostics
      ? {
          accepted_rows: receipt.diagnostics.accepted_rows ?? null,
          rejected_rows: receipt.diagnostics.rejected_rows ?? null,
          gap_warning_count: Array.isArray(receipt.diagnostics.gap_warnings)
            ? receipt.diagnostics.gap_warnings.length
            : receipt.totals?.gap_warning_count ?? 0,
          issuance_eligible: Boolean(receipt.diagnostics.issuance_eligible),
          issuance_reason: receipt.diagnostics.issuance_reason || null,
          surplus_basis_used: receipt.diagnostics.surplus_basis_used || [],
        }
      : null,
    disclaimer: receipt.disclaimer || null,
    session_summary: true,
  };
}

export function loadSessionReceipt(storage) {
  const target = resolveStorage(storage);
  if (!target) return null;
  try {
    const raw = target.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const summary = summarizeReceipt(parsed);
    if (!summary) target.removeItem(SESSION_KEY);
    return summary;
  } catch {
    try {
      target.removeItem(SESSION_KEY);
    } catch {
      // Storage may be unavailable; fail closed.
    }
    return null;
  }
}

export function saveSessionReceipt(receipt, storage) {
  const target = resolveStorage(storage);
  const summary = summarizeReceipt(receipt);
  if (!summary) return null;
  if (!target) return summary;
  try {
    target.setItem(SESSION_KEY, JSON.stringify(summary));
  } catch {
    // The workbench remains usable in-memory when session storage is unavailable.
  }
  return summary;
}

export function clearSessionReceipt(storage) {
  const target = resolveStorage(storage);
  if (!target) return;
  try {
    target.removeItem(SESSION_KEY);
  } catch {
    // Storage may be unavailable; caller still clears React state.
  }
}

export const SESSION_RECEIPT_KEY = SESSION_KEY;
