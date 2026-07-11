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
  const admitted = Boolean(policyDecision.admitted);
  const base = {
    schema: 'solarpunk.constraint.claim_manifest.v1',
    subject,
    evidence_hash: evidence.evidence_hash,
    policy_id: policyDecision.policy_id,
    policy_version: policyDecision.policy_version,
    provenance_level: provenance.level,
    quantity: admitted ? Number(policyDecision.maximum_claim_quantity || 0) : 0,
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
    subject: base.subject,
    quantity: base.quantity,
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
  let next = transitionClaim(claim, 'ISSUABLE', { reason: 'admitted claim is eligible for bounded issuance' });
  next = transitionClaim(next, 'ISSUED', { reason: `issued ${round(quantity)} ${claim.unit}` });
  next = transitionClaim(next, 'ACTIVE', { reason: 'issued claim activated for settlement simulation' });
  return { ...next, issued_quantity: round(quantity) };
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
  return {
    schema: 'solarpunk.constraint.settlement_result.v1',
    claim_id: claim.claim_id,
    outstanding_claim_quantity: round(owed),
    settlement_capacity: round(capacity),
    covered_quantity: round(covered),
    shortfall_quantity: round(shortfall),
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
