import { canonicalTimestamp, round, sha256Hex, stableStringify, sum } from './stable.js';
import { deriveEligibleSurplus } from './adapters.js';
import { overlappingIntervalIndexes } from './intervalIntegrity.js';

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

export function assertEvidenceEnvelopeConsistency(value) {
  const body = evidenceEnvelopeIdentityBody(value);
  for (const field of ['interval_count', 'blocker_count', 'warning_count']) {
    if (!Number.isInteger(body.summary[field]) || body.summary[field] < 0) {
      throw new Error(`evidence summary.${field} must be a non-negative integer`);
    }
  }
  if (body.summary.interval_count !== body.intervals.length) {
    throw new Error('evidence summary interval_count must match supplied intervals');
  }
  const calculatedAdapters = new Set(['generic-interval-csv', 'green-button-utility',
    'cumulative-meter-pair', 'fronius-powerflow-pair', 'controlled-case-fixture']);
  for (const row of body.intervals) {
    const start = Date.parse(canonicalTimestamp(row.window_start, 'window_start'));
    const end = Date.parse(canonicalTimestamp(row.window_end, 'window_end'));
    if (end < start) throw new Error('evidence interval end precedes start');
    for (const field of ['generation_kwh', 'site_load_kwh', 'export_kwh', 'curtailed_kwh', 'eligible_surplus_kwh']) {
      if ((field === 'eligible_surplus_kwh' || row[field] != null)
        && (typeof row[field] !== 'number' || !Number.isFinite(row[field]) || row[field] < 0)) {
        throw new Error(`evidence interval ${field} must be a non-negative finite number`);
      }
    }
    if (row.quality_score != null && (typeof row.quality_score !== 'number'
      || !Number.isFinite(row.quality_score) || row.quality_score < 0 || row.quality_score > 1)) {
      throw new Error('evidence interval quality_score must be between 0 and 1');
    }
    if (calculatedAdapters.has(body.adapter.id)
      && round(row.eligible_surplus_kwh) !== deriveEligibleSurplus(row).eligible_surplus_kwh) {
      throw new Error('evidence interval eligible surplus disagrees with energy readings');
    }
  }
  const total = body.summary.total_eligible_surplus_kwh;
  if (typeof total !== 'number' || !Number.isFinite(total) || total < 0
    || round(total) !== sum(body.intervals.map((row) => row.eligible_surplus_kwh))) {
    throw new Error('evidence summary total_eligible_surplus_kwh must match supplied intervals');
  }
  if (overlappingIntervalIndexes(body.intervals).length && body.summary.blocker_count === 0) {
    throw new Error('overlapping evidence intervals require a blocking diagnostic');
  }
  // Diagnostics are presentation data, but must not erase a supplied blocking condition.
  if (Array.isArray(value.diagnostics) && body.summary.blocker_count
    < value.diagnostics.filter((item) => item.status === 'BLOCK' && item.scope !== 'record').length) {
    throw new Error('evidence summary understates blocking diagnostics');
  }
  return true;
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
  assertEvidenceEnvelopeConsistency(value);
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
  assertEvidenceEnvelopeConsistency({ ...evidenceBody, diagnostics: normalized.diagnostics });

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
