import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  buildEvidenceEnvelope,
  buildDecisionReceipt,
  casePolicyById,
  classifyProvenance,
  createDecisionClaimManifest,
  evaluateCaseDecision,
  evaluateSettlement,
  makeIssuedClaim,
  normalizeGenericCsv,
  verifyEvidenceEnvelopeHash,
} from '../src/workbench.js';

const PACK_ROOT = new URL('../../../protocol/cases/energy-v1/', import.meta.url);
const CSV_URL = new URL('../../../data/operator/sample_operator_export.csv', import.meta.url);

async function readJson(base, path) {
  return JSON.parse(await readFile(new URL(path, base), 'utf8'));
}

async function loadOps() {
  const caseManifest = await readJson(PACK_ROOT, 'cases/OPS-001.json');
  const evidence = await readJson(PACK_ROOT, 'evidence/ops-sample-evidence.json');
  const context = await readJson(PACK_ROOT, 'contexts/tyn-resource-context.json');
  const scenario = await readJson(PACK_ROOT, 'scenarios/provenance-L0.json');
  return {
    caseManifest,
    evidence,
    contextsById: { [context.context_id]: context },
    evidenceByHash: { [evidence.evidence_hash]: evidence },
    scenario,
  };
}

function normalizeOperatorFixture(csvText) {
  const normalized = normalizeGenericCsv(csvText);
  normalized.source = {
    ...normalized.source,
    case_id: 'OPS-001',
    operator_format_sample: true,
    sample_fixture: true,
    custody: 'synthetic_public_lab_operator_csv_fixture',
    signature_semantics: 'unsigned_generic_interval_csv',
  };
  normalized.capabilities = {
    ...normalized.capabilities,
    signed: false,
    cryptographically_verified: false,
    signature_verification: false,
    external_corroboration: false,
    browser_local: true,
    operator_signed: false,
  };
  normalized.diagnostics = [
    ...(normalized.diagnostics || []),
    {
      code: 'operator_format_sample',
      status: 'WARNING',
      detail: 'Synthetic operator-shaped CSV normalized through generic-interval-csv. Not signed, not source-truth evidence, not mint authority, and not a named operator custody archive.',
    },
  ];
  normalized.summary = {
    ...normalized.summary,
    warning_count: normalized.diagnostics.filter((item) => item.status === 'WARNING').length,
    blocker_count: normalized.diagnostics.filter((item) => item.status === 'BLOCK').length,
  };
  return normalized;
}

test('Gate 1A: operator-format fixture re-normalizes to the committed OPS-001 evidence hash', async () => {
  const csvText = await readFile(CSV_URL, 'utf8');
  const committed = await readJson(PACK_ROOT, 'evidence/ops-sample-evidence.json');
  const envelope = await buildEvidenceEnvelope(normalizeOperatorFixture(csvText), {
    source_label: 'OPS-001 synthetic operator-format CSV fixture',
    browser_local: true,
  });

  assert.equal(envelope.evidence_hash, committed.evidence_hash);
  assert.equal(await verifyEvidenceEnvelopeHash(committed), true);
  assert.equal(committed.source.sample_fixture, true);
  assert.equal(committed.source.operator_format_sample, true);
  assert.equal(committed.capabilities.signed, false);
  assert.equal(committed.capabilities.cryptographically_verified, false);
  assert.match(committed.diagnostics.map((d) => d.code).join(','), /operator_format_sample/);
});

test('Gate 1A: OPS-001 is BLOCKED under pilot policy at honest L0', async () => {
  const loaded = await loadOps();
  assert.deepEqual(loaded.caseManifest.evidence_refs, [loaded.evidence.evidence_hash]);
  const provenance = classifyProvenance(loaded.evidence, loaded.scenario.provenance_context);
  assert.equal(provenance.level, 'L0');

  const decision = await evaluateCaseDecision({
    caseManifest: loaded.caseManifest,
    evidenceByHash: loaded.evidenceByHash,
    contextsById: loaded.contextsById,
    provenance,
    policy: casePolicyById('ENERGY-CASE-PILOT-005'),
  });

  assert.equal(decision.decision, 'BLOCKED');
  assert.ok(decision.admission.blocking_rules.includes('SIGNED_EVIDENCE'));
  assert.ok(decision.admission.blocking_rules.includes('MIN_PROVENANCE'));
  assert.equal(decision.capacity.evaluated, false);
});

test('Gate 1A: open policy admits; settlement stress works; receipt excludes raw rows', async () => {
  const loaded = await loadOps();
  const provenance = classifyProvenance(loaded.evidence, loaded.scenario.provenance_context);
  const decision = await evaluateCaseDecision({
    caseManifest: loaded.caseManifest,
    evidenceByHash: loaded.evidenceByHash,
    contextsById: loaded.contextsById,
    provenance,
    policy: casePolicyById('LAB-CASE-OPEN-004'),
  });

  assert.equal(decision.decision, 'ADMIT_WITH_LIMIT');
  assert.equal(decision.capacity.admitted_maximum, 103.8);
  assert.deepEqual(decision.capacity.binding_constraints, ['EVIDENCE_BACKED_CAPACITY']);

  const claim = await createDecisionClaimManifest({
    decision,
    subject: 'OPS-001 bounded research claim',
  });
  const issued = makeIssuedClaim(claim);
  const settlement = evaluateSettlement({
    claim: issued,
    settlement_capacity: Number((decision.capacity.admitted_maximum * 0.4).toFixed(6)),
  });
  assert.equal(settlement.result, 'PARTIAL');
  assert.ok(settlement.shortfall_quantity > 0);

  const receipt = buildDecisionReceipt({
    decision,
    runtime: { package: '@solarpunk/constraint-core', package_version: '0.1.0-alpha.1', source_revision: 'gate1a-test' },
    data_boundary: 'Synthetic operator-format fixture summarized by identity only; raw rows excluded.',
    raw_evidence_included: false,
  });
  assert.ok(receipt.evidence.every((item) => item.raw_included === false));
  assert.ok(Array.isArray(loaded.evidence.intervals));
  assert.doesNotMatch(JSON.stringify(receipt), /"generation_kwh"\s*:/);
});
