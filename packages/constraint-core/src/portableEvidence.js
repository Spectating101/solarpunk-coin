import { sha256Hex, stableStringify } from './stable.js';

export const EVIDENCE_ENVELOPE_SCHEMA = 'solarpunk.constraint.evidence_envelope.v1';

function canonicalIntervals(intervals) {
  if (!Array.isArray(intervals)) throw new Error('evidence envelope requires intervals');
  return intervals.map((row) => ({
    meter_id: row.meter_id,
    site_id: row.site_id,
    window_start: row.window_start,
    window_end: row.window_end,
    generation_kwh: row.generation_kwh,
    site_load_kwh: row.site_load_kwh,
    export_kwh: row.export_kwh,
    curtailed_kwh: row.curtailed_kwh,
    eligible_surplus_kwh: row.eligible_surplus_kwh,
    surplus_basis: row.surplus_basis,
    quality_score: row.quality_score,
    source: row.source,
  }));
}

/**
 * Return the canonical portable-evidence identity body.
 *
 * Presentation metadata and diagnostic prose are intentionally excluded. Evidence identity binds
 * adapter id/version, source semantics, canonical intervals, summary, and capabilities.
 */
export function evidenceEnvelopeIdentityBody(value) {
  if (!value?.adapter?.id || !value?.adapter?.version) {
    throw new Error('evidence envelope requires adapter id and version');
  }
  if (value.schema != null && value.schema !== EVIDENCE_ENVELOPE_SCHEMA) {
    throw new Error(`evidence envelope schema must be ${EVIDENCE_ENVELOPE_SCHEMA}`);
  }
  if (!value.source || typeof value.source !== 'object' || Array.isArray(value.source)) {
    throw new Error('evidence envelope requires source semantics');
  }
  if (!value.summary || typeof value.summary !== 'object' || Array.isArray(value.summary)) {
    throw new Error('evidence envelope requires summary');
  }
  if (!value.capabilities || typeof value.capabilities !== 'object' || Array.isArray(value.capabilities)) {
    throw new Error('evidence envelope requires capabilities');
  }
  return {
    schema: EVIDENCE_ENVELOPE_SCHEMA,
    adapter: {
      id: String(value.adapter.id),
      version: String(value.adapter.version),
    },
    source: value.source,
    intervals: canonicalIntervals(value.intervals),
    summary: value.summary,
    capabilities: value.capabilities,
  };
}

export async function hashEvidenceEnvelope(value) {
  return sha256Hex(stableStringify(evidenceEnvelopeIdentityBody(value)));
}

export async function verifyEvidenceEnvelopeHash(value) {
  const declared = String(value?.evidence_hash || '').toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(declared)) {
    throw new Error('evidence_hash must be a lowercase SHA-256 hex string');
  }
  const computed = await hashEvidenceEnvelope(value);
  if (declared !== computed) {
    throw new Error(`evidence hash mismatch: declared ${declared}; computed ${computed}`);
  }
  return true;
}

/**
 * Build the portable evidence envelope used by policy and claim evaluation.
 *
 * Evidence identity intentionally excludes presentation metadata and derived diagnostic prose.
 * The hash binds adapter id/version, source semantics, canonical intervals, summary, and capabilities.
 * Diagnostics remain attached to the envelope and can be deterministically recomputed by the bound
 * adapter version; source_label and other caller presentation metadata must not create a new evidence ID.
 */
export async function buildEvidenceEnvelope(normalized, meta = {}) {
  const evidenceBody = evidenceEnvelopeIdentityBody({
    schema: EVIDENCE_ENVELOPE_SCHEMA,
    adapter: normalized?.adapter,
    source: normalized?.source,
    intervals: normalized?.intervals,
    summary: normalized?.summary,
    capabilities: normalized?.capabilities,
  });

  return {
    ...evidenceBody,
    diagnostics: normalized.diagnostics || [],
    meta: {
      source_label: meta.source_label || normalized.source?.kind || normalized.adapter.id,
      browser_local: meta.browser_local ?? Boolean(normalized.capabilities?.browser_local),
    },
    evidence_hash: await sha256Hex(stableStringify(evidenceBody)),
    hash_algorithm: 'SHA-256',
  };
}
