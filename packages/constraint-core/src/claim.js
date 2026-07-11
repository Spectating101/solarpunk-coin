import { round, sha256Hex, stableStringify } from './stable.js';

export const CLAIM_STATES = [
  'RAW',
  'NORMALIZED',
  'VERIFIED',
  'ADMITTED',
  'ISSUABLE',
  'ISSUED',
  'ACTIVE',
  'SETTLEMENT_DUE',
  'SETTLED',
  'PARTIAL',
  'SHORTFALL',
  'DISPUTED',
  'REVOKED',
  'EXPIRED',
  'BLOCKED',
];

const ALLOWED_TRANSITIONS = {
  RAW: ['NORMALIZED', 'BLOCKED'],
  NORMALIZED: ['VERIFIED', 'BLOCKED'],
  VERIFIED: ['ADMITTED', 'BLOCKED'],
  ADMITTED: ['ISSUABLE', 'REVOKED', 'EXPIRED'],
  ISSUABLE: ['ISSUED', 'REVOKED', 'EXPIRED'],
  ISSUED: ['ACTIVE', 'REVOKED'],
  ACTIVE: ['SETTLEMENT_DUE', 'DISPUTED', 'REVOKED', 'EXPIRED'],
  SETTLEMENT_DUE: ['SETTLED', 'PARTIAL', 'SHORTFALL', 'DISPUTED'],
  PARTIAL: ['SETTLEMENT_DUE', 'SETTLED', 'SHORTFALL', 'DISPUTED'],
  SHORTFALL: ['SETTLEMENT_DUE', 'SETTLED', 'DISPUTED'],
  DISPUTED: ['ACTIVE', 'REVOKED', 'EXPIRED'],
  BLOCKED: [],
  SETTLED: [],
  REVOKED: [],
  EXPIRED: [],
};

export function canTransition(from, to) {
  return Boolean(ALLOWED_TRANSITIONS[from]?.includes(to));
}

export function quantityToBaseUnits(value, decimals = 6) {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18) {
    throw new Error('quantity decimals must be an integer between 0 and 18');
  }
  const raw = String(value ?? '').trim();
  if (!/^\d+(?:\.\d+)?$/.test(raw)) throw new Error(`invalid non-negative quantity: ${value}`);
  const [whole, fraction = ''] = raw.split('.');
  const discarded = fraction.slice(decimals);
  if (discarded && /[1-9]/.test(discarded)) {
    throw new Error(`quantity ${value} exceeds ${decimals} decimal places`);
  }
  const paddedFraction = fraction.slice(0, decimals).padEnd(decimals, '0');
  const wholeUnits = BigInt(whole) * (10n ** BigInt(decimals));
  const fractionUnits = paddedFraction ? BigInt(paddedFraction) : 0n;
  return wholeUnits + fractionUnits;
}

export function baseUnitsToQuantityString(value, decimals = 6) {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 18) {
    throw new Error('quantity decimals must be an integer between 0 and 18');
  }
  const units = BigInt(value);
  if (units < 0n) throw new Error('quantity base units cannot be negative');
  if (decimals === 0) return units.toString();
  const factor = 10n ** BigInt(decimals);
  const whole = units / factor;
  const fraction = (units % factor).toString().padStart(decimals, '0').replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

export function transitionClaim(claim, to, event = {}) {
  if (!claim) throw new Error('claim is required');
  if (!CLAIM_STATES.includes(to)) throw new Error(`unknown claim state: ${to}`);
  if (!canTransition(claim.state, to)) throw new Error(`invalid claim transition ${claim.state} -> ${to}`);
  return {
    ...claim,
    state: to,
    history: [
      ...(claim.history || []),
      {
        sequence: (claim.history || []).length,
        from: claim.state,
        to,
        reason: event.reason || null,
        actor: event.actor || 'local-protocol-simulation',
      },
    ],
  };
}

export async function createClaimManifest({ evidence, provenance, policyDecision, subject = 'browser-local-subject' }) {
  if (!evidence?.evidence_hash) throw new Error('evidence hash is required');
  if (!provenance?.level) throw new Error('provenance decision is required');
  if (!policyDecision?.policy_id) throw new Error('policy decision is required');
  if (!policyDecision.policy_manifest) throw new Error('policy decision must carry the canonical policy manifest');

  const admitted = Boolean(policyDecision.admitted);
  const decimals = Number(policyDecision.issuance_decimals ?? policyDecision.policy_manifest?.issuance?.decimals ?? 6);
  const quantity = admitted ? Number(policyDecision.maximum_claim_quantity || 0) : 0;
  const policyManifestHash = await sha256Hex(stableStringify(policyDecision.policy_manifest));
  const quantityBaseUnits = quantityToBaseUnits(quantity, decimals).toString();
  const base = {
    schema: 'solarpunk.constraint.claim_manifest.v1',
    subject,
    evidence_hash: evidence.evidence_hash,
    policy_id: policyDecision.policy_id,
    policy_version: policyDecision.policy_version,
    policy_manifest_hash: policyManifestHash,
    provenance_level: provenance.level,
    quantity,
    quantity_base_units: quantityBaseUnits,
    quantity_decimals: decimals,
    unit: policyDecision.issuance_unit,
    decision: policyDecision.decision,
    state: admitted ? 'ADMITTED' : 'BLOCKED',
    blockers: policyDecision.blockers || [],
    warnings: policyDecision.warnings || [],
    settlement_capacity_required: Boolean(policyDecision.settlement_capacity_required),
  };
  const claimId = await sha256Hex(stableStringify({
    evidence_hash: base.evidence_hash,
    policy_id: base.policy_id,
    policy_version: base.policy_version,
    policy_manifest_hash: base.policy_manifest_hash,
    subject: base.subject,
    quantity_base_units: base.quantity_base_units,
    quantity_decimals: base.quantity_decimals,
    unit: base.unit,
  }));
  return {
    ...base,
    claim_id: claimId,
    history: admitted
      ? [{ sequence: 0, from: 'VERIFIED', to: 'ADMITTED', reason: `policy ${base.policy_id} admitted evidence`, actor: 'policy-engine' }]
      : [{ sequence: 0, from: 'VERIFIED', to: 'BLOCKED', reason: base.blockers.join('; '), actor: 'policy-engine' }],
  };
}

export function makeIssuedClaim(claim, amount = null) {
  if (claim.state !== 'ADMITTED') throw new Error('claim must be ADMITTED before issuance');
  const quantity = Number(amount ?? claim.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) throw new Error('issuance amount must be positive');
  if (quantity > Number(claim.quantity)) throw new Error('issuance amount exceeds admitted claim quantity');
  const issuedBaseUnits = quantityToBaseUnits(quantity, Number(claim.quantity_decimals ?? 6)).toString();
  let next = transitionClaim(claim, 'ISSUABLE', { reason: 'admitted claim is eligible for bounded issuance' });
  next = transitionClaim(next, 'ISSUED', { reason: `issued ${round(quantity)} ${claim.unit}` });
  next = transitionClaim(next, 'ACTIVE', { reason: 'issued claim activated for settlement simulation' });
  return {
    ...next,
    issued_quantity: round(quantity),
    issued_quantity_base_units: issuedBaseUnits,
  };
}

export function evaluateSettlement({ claim, settlement_capacity }) {
  if (!claim) throw new Error('claim is required');
  if (!['ACTIVE', 'SETTLEMENT_DUE', 'PARTIAL', 'SHORTFALL'].includes(claim.state)) {
    throw new Error(`claim state ${claim.state} cannot enter settlement evaluation`);
  }
  const owed = Number(claim.issued_quantity ?? claim.quantity ?? 0);
  const capacity = Number(settlement_capacity);
  if (!Number.isFinite(capacity) || capacity < 0) throw new Error('settlement_capacity must be a non-negative number');
  const covered = Math.min(owed, capacity);
  const shortfall = Math.max(0, owed - covered);
  let result = 'SETTLED';
  if (covered === 0 && shortfall > 0) result = 'SHORTFALL';
  else if (shortfall > 0) result = 'PARTIAL';
  const decimals = Number(claim.quantity_decimals ?? 6);
  return {
    schema: 'solarpunk.constraint.settlement_result.v1',
    claim_id: claim.claim_id,
    unit: claim.unit,
    quantity_decimals: decimals,
    outstanding_claim_quantity: round(owed),
    outstanding_claim_base_units: quantityToBaseUnits(round(owed), decimals).toString(),
    settlement_capacity: round(capacity),
    settlement_capacity_base_units: quantityToBaseUnits(round(capacity), decimals).toString(),
    covered_quantity: round(covered),
    covered_base_units: quantityToBaseUnits(round(covered), decimals).toString(),
    shortfall_quantity: round(shortfall),
    shortfall_base_units: quantityToBaseUnits(round(shortfall), decimals).toString(),
    result,
    constraint_status: {
      data: claim.decision === 'ADMIT_WITH_LIMIT' ? 'PASS' : 'BLOCKED',
      issuance: Number(claim.issued_quantity || 0) > 0 ? 'PASS' : 'BLOCKED',
      risk: shortfall > 0 ? 'WARNING' : 'PASS',
      settlement: shortfall > 0 ? 'BLOCKED' : 'PASS',
      governance: 'PASS',
    },
    boundary:
      'Settlement capacity is an explicit modeled input. This result does not create legal redemption rights or prove reserve custody.',
  };
}

export function applySettlementResult(claim, settlementResult) {
  let next = claim;
  if (next.state !== 'SETTLEMENT_DUE') {
    next = transitionClaim(next, 'SETTLEMENT_DUE', { reason: 'settlement obligation became due' });
  }
  return transitionClaim(next, settlementResult.result, {
    reason: `${settlementResult.covered_quantity} covered; ${settlementResult.shortfall_quantity} shortfall`,
    actor: 'settlement-engine',
  });
}
