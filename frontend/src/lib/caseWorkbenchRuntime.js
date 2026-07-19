import {
  buildDecisionReceipt,
  casePolicyManifestBody,
  classifyProvenance,
  createDecisionClaimManifest,
  evaluateCaseDecision,
  evaluateSettlement,
  evaluateSettlementConstraint,
  makeIssuedClaim,
} from '@solarpunk/constraint-core/workbench';
import {
  ENERGY_CASE_PACK,
  caseDecisionKey,
} from './energyCasePack';

export const WORKBENCH_RUNTIME = Object.freeze({
  package: '@solarpunk/constraint-core',
  package_version: '0.1.0-alpha.1',
  source_revision: import.meta.env.VITE_SOURCE_REVISION || 'unversioned-local-build',
});

function requireIndexed(index, id, label) {
  const value = index[id];
  if (!value) throw new Error(`unknown ${label}: ${id}`);
  return value;
}

function artifactPart(value) {
  return String(value || 'unknown')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export function decisionArtifactStem(run) {
  if (!run?.decision?.decision_id) return 'decision-artifact';
  return [
    run.caseManifest.case_id,
    run.policy.id,
    run.scenario.scenario_id,
    run.decision.decision_id.slice(0, 12),
  ].map(artifactPart).join('-');
}

export async function evaluateCaseRun({ caseId, policyId, scenarioId }) {
  const caseManifest = requireIndexed(ENERGY_CASE_PACK.casesById, caseId, 'case');
  const policy = casePolicyManifestBody(
    requireIndexed(ENERGY_CASE_PACK.policiesById, policyId, 'policy'),
  );
  const scenario = requireIndexed(ENERGY_CASE_PACK.scenariosById, scenarioId, 'assurance scenario');
  const evidenceHash = caseManifest.evidence_refs[0];
  const evidence = requireIndexed(ENERGY_CASE_PACK.evidenceByHash, evidenceHash, 'evidence');
  const provenance = classifyProvenance(evidence, scenario.provenance_context);
  const decision = await evaluateCaseDecision({
    caseManifest,
    evidenceByHash: ENERGY_CASE_PACK.evidenceByHash,
    contextsById: ENERGY_CASE_PACK.contextsById,
    provenance,
    policy,
  });
  const receipt = buildDecisionReceipt({
    decision,
    runtime: WORKBENCH_RUNTIME,
    data_boundary: 'Controlled case-pack evidence is bundled for public research mechanics. Imported local evidence remains browser-local and is excluded from receipts by default.',
    raw_evidence_included: false,
  });

  return {
    key: caseDecisionKey(caseId, policyId, scenarioId),
    caseManifest,
    evidence,
    contexts: caseManifest.context_refs.map((id) => ENERGY_CASE_PACK.contextsById[id]),
    policy,
    scenario,
    provenance,
    decision,
    receipt,
  };
}

export async function evaluateCaseSet({ caseIds, policyId, scenarioId }) {
  return Promise.all(caseIds.map((caseId) => evaluateCaseRun({
    caseId,
    policyId,
    scenarioId,
  })));
}

export async function evaluateComparisonMatrix({ caseIds, policyIds, scenarioId }) {
  const rows = [];
  for (const caseId of caseIds) {
    const runs = await Promise.all(policyIds.map((policyId) => evaluateCaseRun({
      caseId,
      policyId,
      scenarioId,
    })));
    rows.push({ caseId, runs });
  }
  return rows;
}

export async function runSettlementStress({ decision, multiplier = 1 }) {
  const normalizedMultiplier = Number(multiplier);
  if (!Number.isFinite(normalizedMultiplier) || normalizedMultiplier < 0) {
    throw new Error('settlement stress multiplier must be a non-negative finite number');
  }
  if (decision.decision !== 'ADMIT_WITH_LIMIT') {
    return {
      available: false,
      reason: 'Settlement stress requires an admitted DecisionResult.',
      decision,
    };
  }

  const claim = await createDecisionClaimManifest({
    decision,
    subject: `${decision.case_id} bounded research claim`,
  });
  const issuedClaim = makeIssuedClaim(claim);
  const baseCapacity = Number(decision.capacity.admitted_maximum);
  const settlementCapacity = Number((baseCapacity * normalizedMultiplier).toFixed(6));
  const settlement = evaluateSettlement({
    claim: issuedClaim,
    settlement_capacity: settlementCapacity,
  });
  const constraint = await evaluateSettlementConstraint({
    claim: issuedClaim,
    settlement_capacity: settlementCapacity,
  });

  return {
    available: true,
    multiplier: normalizedMultiplier,
    changed: {
      settlement_capacity: settlementCapacity,
    },
    unchanged: {
      decision_id: decision.decision_id,
      policy_id: decision.policy_id,
      policy_version: decision.policy_version,
      policy_manifest_hash: decision.policy_manifest_hash,
      evidence_hashes: decision.evidence_hashes,
      context_refs: decision.context_refs,
    },
    claim,
    issuedClaim,
    settlement,
    constraint,
  };
}

export function decisionHeadline(decision) {
  if (decision.decision === 'BLOCKED') {
    const blocking = decision.admission.blocking_rules[0] || 'ADMISSION';
    return `Blocked by ${blocking.replaceAll('_', ' ').toLowerCase()}`;
  }
  const binding = decision.capacity.binding_constraints[0] || 'quantity ceiling';
  return `${binding.replaceAll('_', ' ').toLowerCase()} binds at ${decision.capacity.admitted_maximum}`;
}

export function downloadJson(filename, value) {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function decisionMemo(run) {
  const { caseManifest, policy, scenario, provenance, decision } = run;
  const lines = [
    `# Decision memo — ${caseManifest.case_id}`,
    '',
    `- Case: ${caseManifest.subject}`,
    `- Policy: ${policy.id}@${policy.version}`,
    `- Assurance scenario: ${scenario.name}`,
    `- Classified provenance: ${provenance.level}`,
    `- Decision ID: ${decision.decision_id}`,
    `- Result: ${decision.decision}`,
    '',
    '## Admission',
    '',
    '| Rule | Status | Explanation |',
    '|---|---|---|',
    ...decision.admission.evaluations.map((item) => (
      `| ${item.calculator_id} | ${item.status} | ${item.explanation.replaceAll('|', '\\|')} |`
    )),
  ];

  if (decision.capacity.evaluated) {
    lines.push(
      '',
      '## Quantity ceilings',
      '',
      '| Ceiling | Capacity | Unit |',
      '|---|---:|---|',
      ...decision.capacity.evaluations.map((item) => (
        `| ${item.calculator_id} | ${item.capacity} | ${item.unit} |`
      )),
      '',
      `**Admitted maximum:** ${decision.capacity.admitted_maximum} ${decision.capacity.unit}`,
      '',
      `**Binding constraint:** ${decision.capacity.binding_constraints.join(', ')}`,
    );
  } else {
    lines.push('', 'Quantity evaluation was not executed because admission failed.');
  }

  lines.push(
    '',
    '## Boundary',
    '',
    decision.boundary,
    '',
    ...caseManifest.boundaries.map((item) => `- ${item}`),
  );

  return `${lines.join('\n')}\n`;
}

export function downloadText(filename, text, type = 'text/markdown') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
