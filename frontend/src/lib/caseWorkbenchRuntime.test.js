import { describe, expect, it } from 'vitest';
import {
  decisionArtifactStem,
  evaluateCaseRun,
  runSettlementStress,
} from './caseWorkbenchRuntime';
import { buildResearchCapsule } from './researchCapsule';

describe('browser case workbench runtime', () => {
  it('blocks Taoyuan L0 at provenance before quantity evaluation', async () => {
    const run = await evaluateCaseRun({
      caseId: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L0-BASE',
    });
    expect(run.decision.decision).toBe('BLOCKED');
    expect(run.decision.admission.blocking_rules).toEqual(['MIN_PROVENANCE']);
    expect(run.decision.capacity.evaluated).toBe(false);
    expect(run.decision.capacity.evaluations).toHaveLength(0);
  });

  it('admits the Taoyuan L2 counterfactual at the policy assurance ceiling without changing evidence identity', async () => {
    const base = await evaluateCaseRun({
      caseId: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L0-BASE',
    });
    const counterfactual = await evaluateCaseRun({
      caseId: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    });
    expect(counterfactual.decision.decision).toBe('ADMIT_WITH_LIMIT');
    expect(counterfactual.decision.capacity.admitted_maximum).toBe(126);
    expect(counterfactual.decision.capacity.binding_constraints).toEqual(['PROVENANCE_POLICY_CAPACITY']);
    expect(counterfactual.decision.evidence_hashes).toEqual(base.decision.evidence_hashes);
    expect(counterfactual.decision.decision_id).not.toBe(base.decision.decision_id);
  });

  it('attributes resource and evidence ceilings from the same deterministic engine', async () => {
    const austin = await evaluateCaseRun({
      caseId: 'AUS-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    });
    const phoenix = await evaluateCaseRun({
      caseId: 'PHX-001',
      policyId: 'LAB-CASE-OPEN-004',
      scenarioId: 'PROVENANCE-L0-BASE',
    });

    expect(austin.decision.capacity.admitted_maximum).toBe(283.09811);
    expect(austin.decision.capacity.binding_constraints).toEqual(['RESOURCE_CONTEXT_CAPACITY']);
    expect(phoenix.decision.capacity.admitted_maximum).toBe(320);
    expect(phoenix.decision.capacity.binding_constraints).toEqual(['EVIDENCE_BACKED_CAPACITY']);
  });

  it('keeps settlement as a separate stage and exposes partial and full shortfall states', async () => {
    const run = await evaluateCaseRun({
      caseId: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    });
    const settled = await runSettlementStress({ decision: run.decision, multiplier: 1 });
    const partial = await runSettlementStress({ decision: run.decision, multiplier: 0.4 });
    const shortfall = await runSettlementStress({ decision: run.decision, multiplier: 0 });

    expect(settled.settlement.result).toBe('SETTLED');
    expect(partial.settlement.result).toBe('PARTIAL');
    expect(partial.settlement.covered_quantity).toBe(50.4);
    expect(partial.settlement.shortfall_quantity).toBe(75.6);
    expect(shortfall.settlement.result).toBe('SHORTFALL');
    expect(shortfall.settlement.shortfall_quantity).toBe(126);
  });

  it('builds collision-resistant artifact names from the complete decision identity', async () => {
    const run = await evaluateCaseRun({
      caseId: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    });
    const stem = decisionArtifactStem(run);
    expect(stem).toContain('tyn-001');
    expect(stem).toContain('energy-case-pilot-005');
    expect(stem).toContain('provenance-l2-counterfactual');
    expect(stem).toContain(run.decision.decision_id.slice(0, 12));
  });

  it('builds a portable capsule manifest with raw evidence excluded', async () => {
    const run = await evaluateCaseRun({
      caseId: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    });
    const capsule = await buildResearchCapsule(run, run.receipt);

    expect(capsule.manifest.schema).toBe('solarpunk.constraint.research_capsule.v1');
    expect(capsule.manifest.raw_evidence_included).toBe(false);
    expect(capsule.manifest.policy.id).toBe('ENERGY-CASE-PILOT-005');
    expect(capsule.manifest.assurance_scenario).toBe('PROVENANCE-L2-COUNTERFACTUAL');
    expect(capsule.manifest.source_revision).toBeTruthy();
    expect(capsule.manifest.files).toHaveLength(10);
    expect(capsule.manifest.files.map((file) => file.path)).toEqual(expect.arrayContaining([
      'decision-result.json',
      'decision-receipt.json',
      'lineage.json',
      'reproduction.json',
      'decision-memo.md',
      'CITATION.cff',
    ]));
    expect(capsule.files['evidence-metadata.json']).toContain('"raw_data_included": false');
  });
});
