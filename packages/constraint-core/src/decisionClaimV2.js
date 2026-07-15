import {
  decisionResultBody,
  hashDecisionResultBody,
} from './decision.js';
import { quantityToBaseUnits } from './claim.js';
import { sha256Hex, stableStringify } from './stable.js';

export const DECISION_CLAIM_MANIFEST_SCHEMA = 'solarpunk.constraint.claim_manifest.v2';

function requiredText(value, field) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(`${field} is required`);
  return text;
}

/**
 * Bind a validated, deterministic DecisionResult into a bounded research claim.
 *
 * DecisionResult semantic validation owns the BLOCKED versus ADMIT_WITH_LIMIT
 * cross-field contract. Claim creation therefore verifies decision identity and
 * requires an evaluated, positive admitted maximum rather than duplicating a
 * second string-level decision state machine.
 */
export async function createDecisionClaimManifest({
  decision: decisionInput,
  subject = 'browser-local-case-subject',
}) {
  const decision = decisionResultBody(decisionInput);
  const expectedDecisionId = await hashDecisionResultBody(decision);
  if (decision.decision_id !== expectedDecisionId) {
    throw new Error(
      `DecisionResult identity mismatch: declared ${decision.decision_id}; computed ${expectedDecisionId}`,
    );
  }
  if (!decision.capacity.evaluated) {
    throw new Error('DecisionResult capacity must be evaluated before claim creation');
  }

  const quantity = Number(decision.capacity.admitted_maximum);
  const decimals = Number(decision.capacity.quantity_decimals);
  const unit = requiredText(decision.capacity.unit, 'decision.capacity.unit');
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error(
      `DecisionResult must admit a positive quantity before claim creation; received ${quantity}`,
    );
  }
  const quantityBaseUnits = quantityToBaseUnits(quantity, decimals).toString();
  const normalizedSubject = requiredText(subject, 'subject');

  const identity = {
    decision_id: decision.decision_id,
    case_id: decision.case_id,
    subject: normalizedSubject,
    policy_id: decision.policy_id,
    policy_version: decision.policy_version,
    policy_manifest_hash: decision.policy_manifest_hash,
    evidence_hashes: decision.evidence_hashes,
    quantity_base_units: quantityBaseUnits,
    quantity_decimals: decimals,
    unit,
  };
  const claimId = await sha256Hex(stableStringify(identity));

  return {
    schema: DECISION_CLAIM_MANIFEST_SCHEMA,
    claim_id: claimId,
    decision_id: decision.decision_id,
    case_id: decision.case_id,
    subject: normalizedSubject,
    evidence_hashes: [...decision.evidence_hashes],
    policy_id: decision.policy_id,
    policy_version: decision.policy_version,
    policy_manifest_hash: decision.policy_manifest_hash,
    quantity,
    quantity_base_units: quantityBaseUnits,
    quantity_decimals: decimals,
    unit,
    decision: decision.decision,
    state: 'ADMITTED',
    blockers: [],
    warnings: [...decision.warnings],
    settlement_capacity_required: true,
    history: [
      {
        sequence: 0,
        from: 'VERIFIED',
        to: 'ADMITTED',
        reason: `decision ${decision.decision_id} admitted bounded case quantity`,
        actor: 'case-decision-engine',
      },
    ],
  };
}
