import { provenanceRank } from './provenance.js';
import { round, sha256Hex, stableStringify } from './stable.js';

export const BUILTIN_POLICIES = [
  {
    id: 'LAB-OPEN-001',
    version: '1.0.0',
    name: 'Public Lab Open Demonstration',
    description: 'Admits deterministic local evidence for illustrative claim and settlement simulation. It never authorizes live minting or real-value issuance.',
    min_provenance_level: 'L0',
    admission: {
      require_positive_surplus: true,
      require_zero_blockers: true,
      require_signed_evidence: false,
      require_external_corroboration: false,
    },
    issuance: {
      unit: 'CLAIM_UNIT',
      decimals: 6,
      rate_per_surplus_kwh: 1,
      haircut_pct: 0,
      absolute_cap: 10000,
    },
    settlement: {
      explicit_capacity_required: true,
      legal_redemption_not_implied: true,
    },
    governance: {
      authority: 'browser-local demonstration policy',
      mutable_by: 'policy publisher in future protocol deployment',
    },
  },
  {
    id: 'ENERGY-PILOT-002',
    version: '1.0.0',
    name: 'Risk-boxed Energy Pilot',
    description: 'Closed-pilot candidate policy for signed live inverter or gateway counters with a provenance haircut and bounded claim size.',
    min_provenance_level: 'L2',
    admission: {
      require_positive_surplus: true,
      require_zero_blockers: true,
      require_signed_evidence: true,
      require_external_corroboration: false,
    },
    issuance: {
      unit: 'ENERGY_CLAIM_UNIT',
      decimals: 6,
      rate_per_surplus_kwh: 1,
      haircut_pct: 30,
      absolute_cap: 2500,
    },
    settlement: {
      explicit_capacity_required: true,
      legal_redemption_not_implied: true,
    },
    governance: {
      authority: 'named pilot policy authority',
      mutable_by: 'governed policy registry',
    },
  },
  {
    id: 'ENERGY-STRICT-003',
    version: '1.0.0',
    name: 'Externally Corroborated Energy Claim',
    description: 'Strict policy requiring utility or settlement corroboration and applying the L4 evidence haircut before claim issuance.',
    min_provenance_level: 'L4',
    admission: {
      require_positive_surplus: true,
      require_zero_blockers: true,
      require_signed_evidence: true,
      require_external_corroboration: true,
    },
    issuance: {
      unit: 'CORROBORATED_ENERGY_CLAIM',
      decimals: 6,
      rate_per_surplus_kwh: 1,
      haircut_pct: 5,
      absolute_cap: 50000,
    },
    settlement: {
      explicit_capacity_required: true,
      legal_redemption_not_implied: true,
    },
    governance: {
      authority: 'production candidate policy authority',
      mutable_by: 'governed policy registry after audit',
    },
  },
  {
    id: 'SPK-ENERGY-001',
    version: '1.0.0',
    name: 'SPK Reference Application',
    description: 'Reference application policy retaining SPK as one bounded-issuance experiment rather than the protocol itself.',
    min_provenance_level: 'L1',
    admission: {
      require_positive_surplus: true,
      require_zero_blockers: true,
      require_signed_evidence: true,
      require_external_corroboration: false,
    },
    issuance: {
      unit: 'SPK',
      decimals: 6,
      rate_per_surplus_kwh: 1,
      haircut_pct: 60,
      absolute_cap: 250,
    },
    settlement: {
      explicit_capacity_required: true,
      legal_redemption_not_implied: true,
    },
    governance: {
      authority: 'SPK reference policy',
      mutable_by: 'governed policy registry',
    },
  },
];

export function policyById(id) {
  return BUILTIN_POLICIES.find((policy) => policy.id === id) || null;
}

export function policyManifestBody(policy) {
  if (!policy?.id || !policy?.version) throw new Error('policy id and version are required');
  const decimals = Number(policy.issuance?.decimals ?? 6);
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18) {
    throw new Error('policy issuance decimals must be an integer between 0 and 18');
  }
  return {
    schema: 'solarpunk.constraint.policy_manifest.v1',
    id: policy.id,
    version: policy.version,
    name: policy.name,
    description: policy.description,
    min_provenance_level: policy.min_provenance_level,
    admission: {
      require_positive_surplus: Boolean(policy.admission?.require_positive_surplus),
      require_zero_blockers: Boolean(policy.admission?.require_zero_blockers),
      require_signed_evidence: Boolean(policy.admission?.require_signed_evidence),
      require_external_corroboration: Boolean(policy.admission?.require_external_corroboration),
    },
    issuance: {
      unit: policy.issuance?.unit,
      decimals,
      rate_per_surplus_kwh: Number(policy.issuance?.rate_per_surplus_kwh || 0),
      haircut_pct: Number(policy.issuance?.haircut_pct || 0),
      absolute_cap: Number(policy.issuance?.absolute_cap ?? Number.MAX_SAFE_INTEGER),
    },
    settlement: {
      explicit_capacity_required: Boolean(policy.settlement?.explicit_capacity_required),
      legal_redemption_not_implied: Boolean(policy.settlement?.legal_redemption_not_implied),
    },
    governance: {
      authority: policy.governance?.authority || null,
      mutable_by: policy.governance?.mutable_by || null,
    },
  };
}

export async function hashPolicyManifest(policy) {
  return sha256Hex(stableStringify(policyManifestBody(policy)));
}

export function policyVersionCode(version) {
  const parts = String(version || '').split('.').map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 999)) {
    throw new Error(`policy version must be semantic major.minor.patch with each part 0-999: ${version}`);
  }
  return (parts[0] * 1_000_000) + (parts[1] * 1_000) + parts[2];
}

export function evaluatePolicy({ evidence, provenance, policy }) {
  if (!evidence) throw new Error('evidence is required');
  if (!provenance) throw new Error('provenance is required');
  if (!policy) throw new Error('policy is required');

  const manifest = policyManifestBody(policy);
  const blockers = [];
  const warnings = [];
  const totalSurplus = Number(evidence.summary?.total_eligible_surplus_kwh || 0);
  const blockerCount = Number(evidence.summary?.blocker_count || 0);
  const rejectedInputRecords = Number(evidence.summary?.rejected_input_records || 0);
  const provenancePass = provenanceRank(provenance.level) >= provenanceRank(manifest.min_provenance_level);

  if (!provenancePass) blockers.push(`requires provenance ${manifest.min_provenance_level} or better; received ${provenance.level}`);
  if (manifest.admission.require_positive_surplus && totalSurplus <= 0) blockers.push('requires positive admitted surplus');
  if (manifest.admission.require_zero_blockers && blockerCount > 0) blockers.push(`evidence contains ${blockerCount} envelope-level blocking diagnostic(s)`);
  if (manifest.admission.require_signed_evidence && !evidence.capabilities?.signed) blockers.push('requires signed evidence');
  if (manifest.admission.require_external_corroboration && !evidence.capabilities?.external_corroboration && provenance.level !== 'L4') {
    blockers.push('requires external utility/settlement corroboration');
  }

  if (rejectedInputRecords > 0) {
    warnings.push(`${rejectedInputRecords} input record(s) were rejected and excluded from the accepted evidence subset.`);
  }
  if (manifest.settlement.legal_redemption_not_implied) {
    warnings.push('Policy evaluation does not create legal redemption rights or prove named settlement capacity.');
  }
  if (provenance.level === 'L0') {
    warnings.push('L0 evidence is public-lab only; any claim quantity is illustrative and should remain non-live.');
  }

  const rate = manifest.issuance.rate_per_surplus_kwh;
  const haircut = manifest.issuance.haircut_pct / 100;
  const gross = totalSurplus * rate;
  const riskAdjusted = gross * Math.max(0, 1 - haircut);
  const maximum = Math.min(riskAdjusted, manifest.issuance.absolute_cap);
  const admitted = blockers.length === 0;

  return {
    schema: 'solarpunk.constraint.policy_decision.v1',
    policy_id: manifest.id,
    policy_version: manifest.version,
    policy_name: manifest.name,
    policy_manifest: manifest,
    decision: admitted ? 'ADMIT_WITH_LIMIT' : 'BLOCKED',
    admitted,
    evidence_hash: evidence.evidence_hash || null,
    provenance_level: provenance.level,
    input_surplus_kwh: round(totalSurplus),
    issuance_unit: manifest.issuance.unit,
    issuance_decimals: manifest.issuance.decimals,
    issuance_rate_per_surplus_kwh: rate,
    haircut_pct: manifest.issuance.haircut_pct,
    gross_claim_quantity: round(gross),
    risk_adjusted_claim_quantity: round(riskAdjusted),
    maximum_claim_quantity: admitted ? round(maximum) : 0,
    blockers,
    warnings,
    rejected_input_records: rejectedInputRecords,
    settlement_capacity_required: Boolean(manifest.settlement.explicit_capacity_required),
    governance_authority: manifest.governance.authority,
  };
}

export function comparePolicies({ evidence, provenance, policies = BUILTIN_POLICIES }) {
  return policies.map((policy) => evaluatePolicy({ evidence, provenance, policy }));
}
