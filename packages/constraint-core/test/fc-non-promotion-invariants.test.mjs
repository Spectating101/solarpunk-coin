import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  casePolicyById,
  classifyProvenance,
  createDecisionClaimManifest,
  evaluateCaseDecision,
  verifyEvidenceEnvelopeHash,
} from '../src/index.js';

const PACK_ROOT = new URL('../../../protocol/cases/energy-v1/', import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, PACK_ROOT), 'utf8'));

async function taoyuanL2Decision() {
  const [caseManifest, evidence, context, scenario] = await Promise.all([
    readJson('cases/TYN-001.json'),
    readJson('evidence/tyn-sample-evidence.json'),
    readJson('contexts/tyn-resource-context.json'),
    readJson('scenarios/provenance-L2.json'),
  ]);
  return evaluateCaseDecision({
    caseManifest,
    evidenceByHash: { [evidence.evidence_hash]: evidence },
    contextsById: { [context.context_id]: context },
    provenance: classifyProvenance(evidence, scenario.provenance_context),
    policy: casePolicyById('ENERGY-CASE-PILOT-005'),
  });
}

test('FC invariant: source assurance capabilities cannot be promoted under a stale evidence identity', async () => {
  // OPS-001 is the committed operator-shaped fixture whose source capabilities are
  // explicitly unsigned/unverified. Promoting those source semantics without
  // rebuilding the evidence envelope must invalidate its existing identity.
  const evidence = await readJson('evidence/ops-sample-evidence.json');
  assert.equal(await verifyEvidenceEnvelopeHash(evidence), true);
  assert.equal(evidence.capabilities.signed, false);
  assert.equal(evidence.capabilities.operator_signed, false);
  assert.equal(evidence.capabilities.cryptographically_verified, false);

  const promoted = structuredClone(evidence);
  promoted.capabilities.signed = true;
  promoted.capabilities.operator_signed = true;
  promoted.capabilities.cryptographically_verified = true;

  await assert.rejects(
    verifyEvidenceEnvelopeHash(promoted),
    /evidence hash mismatch/,
  );

  assert.equal(promoted.evidence_hash, evidence.evidence_hash);
});

test('FC invariant: caller-supplied quantity cannot override the decision-bound admitted maximum', async () => {
  const decision = await taoyuanL2Decision();
  assert.equal(decision.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(decision.capacity.admitted_maximum, 126);

  const claim = await createDecisionClaimManifest({
    decision,
    subject: 'FC non-promotion evaluation claim',
    // Intentionally not part of the accepted API. The manifest must derive quantity
    // from the deterministic DecisionResult instead of accepting caller authority.
    quantity: 999999,
  });

  assert.equal(claim.quantity, 126);
  assert.notEqual(claim.quantity, 999999);
  assert.equal(claim.decision_id, decision.decision_id);
});
