import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  BUILTIN_POLICIES,
  applySettlementResult,
  attestationInspectionAsEvidence,
  buildEvidenceEnvelope,
  classifyProvenance,
  comparePolicies,
  createClaimManifest,
  evaluatePolicy,
  evaluateSettlement,
  hashPolicyManifest,
  inspectSignedEvidence,
  makeIssuedClaim,
  normalizeCumulativePair,
  normalizeFroniusPair,
  normalizeGreenButtonCsv,
  policyById,
} from '../src/index.js';

const repoJson = async (path) => JSON.parse(await readFile(new URL(`../../../${path}`, import.meta.url), 'utf8'));
const repoText = async (path) => readFile(new URL(`../../../${path}`, import.meta.url), 'utf8');

const vectors = await repoJson('protocol/conformance/alpha-v1.json');
const fixture = vectors.fixtures;
const expected = vectors.expected;

test('alpha-v1 cumulative evidence identity vector', async () => {
  const normalized = normalizeCumulativePair(
    await repoJson(fixture.cumulative_start),
    await repoJson(fixture.cumulative_end),
  );
  const evidence = await buildEvidenceEnvelope(normalized, { source_label: 'arbitrary presentation label' });

  assert.equal(evidence.adapter.id, expected.cumulative_evidence.adapter_id);
  assert.equal(evidence.summary.interval_count, expected.cumulative_evidence.interval_count);
  assert.equal(evidence.summary.total_eligible_surplus_kwh, expected.cumulative_evidence.eligible_surplus_kwh);
  assert.equal(evidence.evidence_hash, expected.cumulative_evidence.evidence_hash);
});

test('alpha-v1 policy hash and L0 decision vectors', async () => {
  const normalized = normalizeCumulativePair(
    await repoJson(fixture.cumulative_start),
    await repoJson(fixture.cumulative_end),
  );
  const evidence = await buildEvidenceEnvelope(normalized);
  const provenance = classifyProvenance(evidence, { sample_fixture: true });
  const decisions = comparePolicies({ evidence, provenance });

  for (const policy of BUILTIN_POLICIES) {
    assert.equal(
      await hashPolicyManifest(policy),
      expected.policy_manifest_hashes[policy.id],
      `${policy.id} manifest hash drifted`,
    );
    const decision = decisions.find((item) => item.policy_id === policy.id);
    assert.equal(decision.decision, expected.policy_decisions_l0[policy.id].decision);
    assert.equal(decision.maximum_claim_quantity, expected.policy_decisions_l0[policy.id].maximum_claim_quantity);
  }
});

test('alpha-v1 demo claim and settlement vectors', async () => {
  const evidence = await buildEvidenceEnvelope(normalizeCumulativePair(
    await repoJson(fixture.cumulative_start),
    await repoJson(fixture.cumulative_end),
  ));
  const provenance = classifyProvenance(evidence, { sample_fixture: true });
  const decision = evaluatePolicy({ evidence, provenance, policy: policyById(expected.demo_claim.policy_id) });
  const claim = await createClaimManifest({
    evidence,
    provenance,
    policyDecision: decision,
    subject: expected.demo_claim.subject,
  });

  assert.equal(claim.policy_manifest_hash, expected.demo_claim.policy_manifest_hash);
  assert.equal(claim.quantity, expected.demo_claim.quantity);
  assert.equal(claim.quantity_decimals, expected.demo_claim.quantity_decimals);
  assert.equal(claim.quantity_base_units, expected.demo_claim.quantity_base_units);
  assert.equal(claim.claim_id, expected.demo_claim.claim_id);

  const active = makeIssuedClaim(claim, expected.settlement.issued_quantity);
  const settlement = evaluateSettlement({
    claim: active,
    settlement_capacity: expected.settlement.settlement_capacity,
  });
  const finalClaim = applySettlementResult(active, settlement);

  assert.equal(active.issued_quantity_base_units, expected.settlement.issued_quantity_base_units);
  assert.equal(settlement.covered_quantity, expected.settlement.covered_quantity);
  assert.equal(settlement.covered_base_units, expected.settlement.covered_base_units);
  assert.equal(settlement.shortfall_quantity, expected.settlement.shortfall_quantity);
  assert.equal(settlement.shortfall_base_units, expected.settlement.shortfall_base_units);
  assert.equal(settlement.result, expected.settlement.result);
  assert.equal(finalClaim.state, expected.settlement.result);
});

test('alpha-v1 utility and Fronius adapter vectors', async () => {
  const utility = normalizeGreenButtonCsv(await repoText(fixture.green_button));
  assert.equal(utility.summary.interval_count, expected.green_button.interval_count);
  assert.equal(utility.summary.total_eligible_surplus_kwh, expected.green_button.eligible_surplus_kwh);
  assert.equal(utility.intervals[0].generation_kwh, expected.green_button.generation_kwh_first_interval);
  assert.ok(utility.diagnostics.some((item) => item.code === expected.green_button.diagnostic_code));

  const fronius = normalizeFroniusPair(
    await repoJson(fixture.fronius_start),
    await repoJson(fixture.fronius_end),
  );
  assert.equal(fronius.intervals[0].generation_kwh, expected.fronius.generation_kwh);
  assert.equal(fronius.intervals[0].site_load_kwh, expected.fronius.site_load_kwh);
  assert.equal(fronius.intervals[0].export_kwh, expected.fronius.export_kwh);
  assert.ok(fronius.diagnostics.some((item) => item.code === expected.fronius.diagnostic_code));
});

test('alpha-v1 signed evidence accepted-subset and provenance vectors', async () => {
  const inspection = await inspectSignedEvidence(
    await repoJson(fixture.signed_readings),
    await repoJson(fixture.meter_registry),
    { now: Math.floor(Date.parse('2026-07-10T00:00:00Z') / 1000) },
  );
  const evidence = attestationInspectionAsEvidence(inspection);
  const provenance = classifyProvenance(evidence, { operator_signed: true });

  assert.equal(inspection.summary.accepted_records, expected.signed_evidence.accepted_records);
  assert.equal(inspection.summary.rejected_records, expected.signed_evidence.rejected_records);
  assert.equal(inspection.summary.verified_signatures, expected.signed_evidence.verified_signatures);
  assert.equal(inspection.summary.total_surplus_kwh, expected.signed_evidence.accepted_surplus_kwh);
  assert.equal(evidence.summary.blocker_count, expected.signed_evidence.envelope_blocker_count);
  assert.equal(evidence.summary.rejected_input_records, expected.signed_evidence.rejected_input_records);
  assert.equal(provenance.level, expected.signed_evidence.provenance_level_without_trusted_operator);
});
