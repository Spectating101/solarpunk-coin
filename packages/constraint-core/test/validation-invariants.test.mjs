import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  buildConstraintEvaluation, buildDecisionResult, buildEvidenceEnvelope, casePolicyById,
  classifyProvenance, createDecisionClaimManifest, evaluateCaseDecision,
  hashEvidenceEnvelope, normalizeGenericCsv, normalizeGreenButtonCsv, verifyEvidenceEnvelopeHash,
} from '../src/workbench.js';

const json = async (name) => JSON.parse(await readFile(new URL(`../../../protocol/cases/energy-v1/${name}`, import.meta.url), 'utf8'));
async function inputs() {
  const caseManifest = await json('cases/TYN-001.json');
  const evidence = await json('evidence/tyn-sample-evidence.json');
  const context = await json('contexts/tyn-resource-context.json');
  return { caseManifest, evidenceByHash: { [evidence.evidence_hash]: evidence },
    contextsById: { [context.context_id]: context }, evidence,
    provenance: classifyProvenance(evidence, { sample_fixture: true }),
    policy: casePolicyById('LAB-CASE-OPEN-004') };
}

test('decision and claim acceptance reject quantities above their own ceilings', async () => {
  const decision = await evaluateCaseDecision(await inputs());
  assert.equal((await createDecisionClaimManifest({ decision })).quantity, 180);
  const changed = structuredClone(decision);
  changed.capacity.admitted_maximum = 1_000_000;
  await assert.rejects(buildDecisionResult(changed), /minimum applicable quantity ceiling/);
  await assert.rejects(createDecisionClaimManifest({ decision: changed }), /minimum applicable quantity ceiling/);
});

test('decision acceptance rejects blocked gates hidden by passing summaries', async () => {
  const changed = structuredClone(await evaluateCaseDecision(await inputs()));
  changed.admission.evaluations[0] = await buildConstraintEvaluation({
    ...changed.admission.evaluations[0], status: 'BLOCK',
  });
  await assert.rejects(buildDecisionResult(changed), /admission summary must agree/);
});

test('all minimum ceilings and evaluation identities are enforced', async () => {
  const original = await evaluateCaseDecision(await inputs());
  const wrongBinding = structuredClone(original);
  wrongBinding.capacity.binding_constraints = ['ABSOLUTE_POLICY_CAP'];
  await assert.rejects(buildDecisionResult(wrongBinding), /identify all minimum/);
  const wrongEvaluation = structuredClone(original);
  wrongEvaluation.capacity.evaluations[0].explanation = 'Different author assertion';
  await assert.rejects(buildDecisionResult(wrongEvaluation), /evaluation identity mismatch/);
  const tied = structuredClone(original);
  tied.capacity.evaluations[1] = await buildConstraintEvaluation({
    ...tied.capacity.evaluations[1], capacity: 180,
  });
  await assert.rejects(buildDecisionResult(tied), /identify all minimum/);
  tied.capacity.binding_constraints.push(tied.capacity.evaluations[1].calculator_id);
  assert.equal((await buildDecisionResult(tied)).capacity.admitted_maximum, 180);
});

test('rehashing an empty or inflated evidence summary cannot establish backing', async () => {
  const runtime = await inputs();
  for (const mutate of [
    (e) => { e.intervals = []; e.summary.interval_count = 0; },
    (e) => { e.summary.total_eligible_surplus_kwh = 1_000_000; },
    (e) => { e.intervals[0].eligible_surplus_kwh += 100; e.summary.total_eligible_surplus_kwh += 100; },
  ]) {
    const evidence = structuredClone(runtime.evidence);
    mutate(evidence);
    evidence.evidence_hash = await hashEvidenceEnvelope(evidence);
    await assert.rejects(verifyEvidenceEnvelopeHash(evidence), /must match supplied intervals|disagrees with energy readings/);
    await assert.rejects(evaluateCaseDecision({ ...runtime,
      caseManifest: { ...runtime.caseManifest, evidence_refs: [evidence.evidence_hash] },
      evidenceByHash: { [evidence.evidence_hash]: evidence },
    }), /must match supplied intervals|disagrees with energy readings/);
  }
});

const csv = (rows) => 'window_start,window_end,export_kwh,meter_id,site_id\n' + rows.join('\n');
test('partial overlaps block, while adjacent windows and distinct meters remain valid', async () => {
  const first = '2026-01-01T00:00:00Z,2026-01-01T02:00:00Z,10,M1,S1';
  const overlaps = normalizeGenericCsv(csv([first,
    '2026-01-01T01:00:00Z,2026-01-01T03:00:00Z,10,M1,S1']));
  assert.ok(overlaps.diagnostics.some((item) => item.code === 'overlapping_window' && item.status === 'BLOCK'));
  const envelope = await buildEvidenceEnvelope(overlaps);
  const erased = structuredClone(envelope);
  erased.summary.blocker_count = 0;
  erased.diagnostics = [];
  erased.evidence_hash = await hashEvidenceEnvelope(erased);
  await assert.rejects(verifyEvidenceEnvelopeHash(erased), /overlapping evidence intervals/);
  for (const next of [
    '2026-01-01T02:00:00Z,2026-01-01T04:00:00Z,10,M1,S1',
    '2026-01-01T01:00:00Z,2026-01-01T03:00:00Z,10,M2,S1',
  ]) assert.equal(normalizeGenericCsv(csv([first, next])).summary.blocker_count, 0);
});


test('utility aggregation retains blockers for overlapping and duplicate channel windows', async () => {
  const header = 'interval_start,interval_end,usage,flow_direction,meter_id,site_id\n';
  const first = '2026-01-01T00:00:00Z,2026-01-01T02:00:00Z,10,export,M1,S1';
  for (const next of [first, '2026-01-01T01:00:00Z,2026-01-01T03:00:00Z,10,export,M1,S1']) {
    const normalized = normalizeGreenButtonCsv(header + first + '\n' + next);
    assert(normalized.summary.blocker_count > 0);
    assert.equal((await buildEvidenceEnvelope(normalized)).summary.blocker_count, normalized.summary.blocker_count);
  }
  const mixed = normalizeGreenButtonCsv(header + first + '\n' + first.replace('export', 'import'));
  assert.equal(mixed.summary.blocker_count, 0, 'opposing utility channels can cover the same period');
  const meters = normalizeGreenButtonCsv(header + first + '\n' + first.replace('M1', 'M2'));
  assert.equal(meters.intervals.length, 2, 'different meters remain independent');
  assert.equal(meters.summary.blocker_count, 0);
  const point = normalizeGenericCsv(csv([
    '2026-01-01T00:00:00Z,2026-01-01T00:00:00Z,10,M1,S1',
    '2026-01-01T00:00:00Z,2026-01-01T00:00:00Z,10,M1,S1',
  ]));
  const evidence = await buildEvidenceEnvelope(point);
  evidence.summary.blocker_count = 0; evidence.diagnostics = [];
  evidence.evidence_hash = await hashEvidenceEnvelope(evidence);
  await assert.rejects(verifyEvidenceEnvelopeHash(evidence), /overlapping evidence intervals/);
});
