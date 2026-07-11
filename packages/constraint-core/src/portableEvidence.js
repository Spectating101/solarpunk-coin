import { sha256Hex, stableStringify } from './stable.js';

/**
 * Build the portable evidence envelope used by policy and claim evaluation.
 *
 * Evidence identity intentionally excludes presentation metadata and derived diagnostic prose.
 * The hash binds adapter id/version, source semantics, canonical intervals, summary, and capabilities.
 * Diagnostics remain attached to the envelope and can be deterministically recomputed by the bound
 * adapter version; source_label and other caller presentation metadata must not create a new evidence ID.
 */
export async function buildEvidenceEnvelope(normalized, meta = {}) {
  if (!normalized?.adapter?.id || !normalized?.adapter?.version) {
    throw new Error('normalized evidence requires adapter id and version');
  }
  if (!Array.isArray(normalized.intervals)) {
    throw new Error('normalized evidence requires intervals');
  }

  const intervals = normalized.intervals.map((row) => ({
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

  const evidenceBody = {
    schema: 'solarpunk.constraint.evidence_envelope.v1',
    adapter: normalized.adapter,
    source: normalized.source,
    intervals,
    summary: normalized.summary,
    capabilities: normalized.capabilities,
  };

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
