// Lightweight browser/workbench entry.
//
// The deterministic case, policy, receipt, claim, and settlement surfaces stay
// free of Ethers. Signed-meter cryptographic verification is loaded only when
// inspectSignedEvidence is explicitly invoked by the legacy protocol lab.
export * from './stable.js';
export * from './csv.js';
export {
  deriveEligibleSurplus,
  normalizeGenericCsv,
  normalizeGreenButtonCsv,
  normalizeCumulativePair,
  normalizeFroniusPair,
} from './adapters.js';
export * from './portableEvidence.js';
export * from './provenance.js';
export * from './policies.js';
export * from './casePolicies.js';
export * from './case.js';
export * from './context.js';
export * from './constraints.js';
export * from './decision.js';
export * from './receipt.js';
export * from './claim.js';
export * from './decisionClaim.js';
export * from './settlementConstraint.js';
export * from './capsuleVerify.js';
export * from './operatorIntake.js';

export async function inspectSignedEvidence(...args) {
  const module = await import('./attestation.js');
  return module.inspectSignedEvidence(...args);
}

export function attestationInspectionAsEvidence(inspection) {
  const acceptedRecords = Number(inspection.summary.accepted_records || 0);
  const rejectedRecords = Number(inspection.summary.rejected_records || 0);

  return {
    schema: 'solarpunk.constraint.evidence_envelope.v1',
    adapter: { id: 'signed-meter-attestation-inspector', version: '1.0.1' },
    source: { kind: 'signed_meter_readings', cryptographically_verified: true },
    intervals: inspection.accepted_attestations.map((row) => ({
      meter_id: row.meter_id,
      site_id: row.site_id,
      window_start: row.window_start,
      window_end: row.window_end,
      generation_kwh: null,
      site_load_kwh: null,
      export_kwh: null,
      curtailed_kwh: null,
      eligible_surplus_kwh: row.surplus_kwh,
      surplus_basis: 'verified_signed_meter_surplus',
      quality_score: row.quality_score,
      source: row.source,
      record_hash: row.record_hash,
      attestor: row.attestor,
    })),
    diagnostics: inspection.row_checks.flatMap((row) => row.checks.map((item) => ({
      ...item,
      scope: 'record',
      row_index: row.index,
      meter_id: row.meter_id,
      record_accepted: row.accepted,
    }))),
    capabilities: {
      identity: true,
      signed: true,
      cryptographically_verified: true,
      signature_verification: true,
      replay_checks: true,
      capacity_sanity: true,
      energy_balance: true,
    },
    summary: {
      interval_count: acceptedRecords,
      total_eligible_surplus_kwh: inspection.summary.total_surplus_kwh,
      blocker_count: acceptedRecords > 0 ? 0 : rejectedRecords,
      rejected_input_records: rejectedRecords,
      warning_count: rejectedRecords,
    },
    evidence_hash: inspection.evidence_hash,
    hash_algorithm: 'SHA-256',
  };
}
