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
  evaluateSettlement,
  inspectSignedEvidence,
  makeIssuedClaim,
  normalizeCumulativePair,
  normalizeFroniusPair,
  normalizeGreenButtonCsv,
  policyById,
  evaluatePolicy,
} from '../src/index.js';

const repoJson = async (path) => JSON.parse(await readFile(new URL(`../../../${path}`, import.meta.url), 'utf8'));
const repoText = async (path) => readFile(new URL(`../../../${path}`, import.meta.url), 'utf8');

test('cumulative snapshot pair becomes deterministic normalized evidence', async () => {
  const start = await repoJson('data/inverter/sample_cumulative_start.json');
  const end = await repoJson('data/inverter/sample_cumulative_end.json');
  const normalized = normalizeCumulativePair(start, end);
  const evidence = await buildEvidenceEnvelope(normalized);

  assert.equal(normalized.summary.interval_count, 1);
  assert.equal(normalized.intervals[0].generation_kwh, 1388.6);
  assert.equal(normalized.intervals[0].eligible_surplus_kwh, 996.2);
  assert.match(evidence.evidence_hash, /^[a-f0-9]{64}$/);
  assert.equal((await buildEvidenceEnvelope(normalized)).evidence_hash, evidence.evidence_hash);
});

test('Green Button adapter treats export as evidence and keeps generation unknown', async () => {
  const text = await repoText('data/meter/green_button_sample.csv');
  const normalized = normalizeGreenButtonCsv(text);

  assert.equal(normalized.summary.interval_count, 2);
  assert.equal(normalized.intervals[0].generation_kwh, null);
  assert.equal(normalized.summary.total_eligible_surplus_kwh, 10.2);
  assert.ok(normalized.diagnostics.some((item) => item.code === 'utility_generation_unknown'));
});

test('Fronius pair exposes estimate warnings rather than claiming revenue-grade finality', async () => {
  const start = await repoJson('data/inverter/fronius_powerflow_start.json');
  const end = await repoJson('data/inverter/fronius_powerflow_end.json');
  const normalized = normalizeFroniusPair(start, end);

  assert.equal(normalized.intervals[0].generation_kwh, 5.2);
  assert.equal(normalized.intervals[0].site_load_kwh, 2.8);
  assert.equal(normalized.intervals[0].export_kwh, 2.4);
  assert.ok(normalized.diagnostics.some((item) => item.code === 'grid_sign_convention' && item.status === 'WARNING'));
});

test('signed attestation inspector accepts the valid subset and reports rejected input records separately', async () => {
  const payload = await repoJson('data/attestations/raw_meter_readings.json');
  const registry = await repoJson('data/attestations/meter_registry.json');
  const inspection = await inspectSignedEvidence(payload, registry, { now: Math.floor(Date.parse('2026-07-10T00:00:00Z') / 1000) });
  const evidence = attestationInspectionAsEvidence(inspection);

  assert.equal(inspection.summary.accepted_records, 2);
  assert.equal(inspection.summary.rejected_records, 2);
  assert.equal(inspection.summary.verified_signatures, 2);
  assert.equal(inspection.summary.total_surplus_kwh, 2606.7);
  assert.equal(evidence.capabilities.signed, true);
  assert.equal(evidence.summary.blocker_count, 0);
  assert.equal(evidence.summary.rejected_input_records, 2);
  assert.equal(evidence.summary.warning_count, 2);
  assert.ok(inspection.rejected_attestations.some((row) => row.reason === 'duplicate meter nonce'));
  assert.ok(inspection.rejected_attestations.some((row) => row.reason.includes('quality_score below threshold')));
});

test('browser-supplied signed evidence remains L0 without trusted operator context', async () => {
  const payload = await repoJson('data/attestations/raw_meter_readings.json');
  const registry = await repoJson('data/attestations/meter_registry.json');
  const inspection = await inspectSignedEvidence(payload, registry, { now: Math.floor(Date.parse('2026-07-10T00:00:00Z') / 1000) });
  const evidence = attestationInspectionAsEvidence(inspection);
  const provenance = classifyProvenance(evidence, { operator_signed: true });
  const decisions = comparePolicies({ evidence, provenance });

  assert.equal(provenance.level, 'L0');
  assert.equal(provenance.cryptographically_verified, true);
  assert.equal(provenance.trusted_operator_context, false);
  assert.ok(provenance.reasons.some((reason) => reason.includes('self-asserted operator context')));
  assert.equal(decisions.find((item) => item.policy_id === 'LAB-OPEN-001').decision, 'ADMIT_WITH_LIMIT');
  assert.equal(decisions.find((item) => item.policy_id === 'LAB-OPEN-001').rejected_input_records, 2);
  assert.ok(decisions.find((item) => item.policy_id === 'LAB-OPEN-001').warnings.some((warning) => warning.includes('2 input record')));
  assert.equal(decisions.find((item) => item.policy_id === 'ENERGY-PILOT-002').decision, 'BLOCKED');
});

test('same evidence yields different decisions under first-class policies', async () => {
  const start = await repoJson('data/inverter/sample_cumulative_start.json');
  const end = await repoJson('data/inverter/sample_cumulative_end.json');
  const evidence = await buildEvidenceEnvelope(normalizeCumulativePair(start, end));
  const provenance = classifyProvenance(evidence, { sample_fixture: true });
  const decisions = comparePolicies({ evidence, provenance, policies: BUILTIN_POLICIES });

  assert.equal(decisions.find((item) => item.policy_id === 'LAB-OPEN-001').decision, 'ADMIT_WITH_LIMIT');
  assert.equal(decisions.find((item) => item.policy_id === 'ENERGY-PILOT-002').decision, 'BLOCKED');
  assert.equal(decisions.find((item) => item.policy_id === 'ENERGY-STRICT-003').decision, 'BLOCKED');
});

test('claim state and settlement make shortfall explicit', async () => {
  const start = await repoJson('data/inverter/sample_cumulative_start.json');
  const end = await repoJson('data/inverter/sample_cumulative_end.json');
  const evidence = await buildEvidenceEnvelope(normalizeCumulativePair(start, end));
  const provenance = classifyProvenance(evidence, { sample_fixture: true });
  const policyDecision = evaluatePolicy({ evidence, provenance, policy: policyById('LAB-OPEN-001') });
  const admitted = await createClaimManifest({ evidence, provenance, policyDecision });
  const active = makeIssuedClaim(admitted, 20);
  const settlement = evaluateSettlement({ claim: active, settlement_capacity: 8 });
  const finalClaim = applySettlementResult(active, settlement);

  assert.equal(settlement.result, 'PARTIAL');
  assert.equal(settlement.covered_quantity, 8);
  assert.equal(settlement.shortfall_quantity, 12);
  assert.equal(settlement.constraint_status.settlement, 'BLOCKED');
  assert.equal(finalClaim.state, 'PARTIAL');
});
