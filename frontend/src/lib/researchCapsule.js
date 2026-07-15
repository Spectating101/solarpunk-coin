import { sha256Hex } from '@solarpunk/constraint-core';
import { decisionMemo, WORKBENCH_RUNTIME } from './caseWorkbenchRuntime';

function jsonText(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function lineageFor(run) {
  const evaluations = [
    ...run.decision.admission.evaluations,
    ...run.decision.capacity.evaluations,
  ];
  return {
    schema: 'solarpunk.constraint.lineage_snapshot.v1',
    decision_id: run.decision.decision_id,
    entities: [
      {
        id: run.evidence.evidence_hash,
        type: 'CONTROLLED_EVIDENCE_FIXTURE',
        schema: run.evidence.schema,
      },
      ...run.contexts.map((context) => ({
        id: context.context_hash,
        type: 'MODELED_CONTEXT',
        schema: context.schema,
        context_id: context.context_id,
      })),
      {
        id: run.decision.policy_manifest_hash,
        type: 'DECLARED_POLICY',
        schema: run.policy.schema,
      },
      {
        id: run.decision.decision_id,
        type: 'DERIVED_DECISION',
        schema: run.decision.schema,
      },
    ],
    activities: evaluations.map((evaluation) => ({
      id: evaluation.evaluation_id,
      calculator_id: evaluation.calculator_id,
      calculator_version: evaluation.calculator_version,
      constraint_class: evaluation.constraint_class,
      input_refs: evaluation.input_refs,
      status: evaluation.status,
    })),
    boundary: 'Lineage records declared object and calculator identity. It does not certify physical source truth or legal claim authority.',
  };
}

function reproductionFor(run) {
  return {
    schema: 'solarpunk.constraint.reproduction.v1',
    runtime: WORKBENCH_RUNTIME,
    case_id: run.caseManifest.case_id,
    evidence_hashes: run.decision.evidence_hashes,
    context_refs: run.decision.context_refs,
    policy: {
      id: run.policy.id,
      version: run.policy.version,
      manifest_hash: run.decision.policy_manifest_hash,
    },
    assurance_scenario: run.scenario.scenario_id,
    expected_decision_id: run.decision.decision_id,
    expected_result: run.decision.decision,
    boundary: 'Reproduction verifies deterministic evaluation of the declared portable objects. It does not prove source truth.',
  };
}

function citationFor(run) {
  return [
    'cff-version: 1.2.0',
    `title: "Decision research capsule — ${run.caseManifest.case_id}"`,
    'message: "Use the decision receipt and source identities when citing this research artifact."',
    'type: dataset',
    'authors:',
    '  - family-names: Ongko',
    '    given-names: Christopher',
    `identifiers:`,
    `  - type: other`,
    `    value: "${run.decision.decision_id}"`,
    `    description: "Deterministic DecisionResult identity"`,
    '',
  ].join('\n');
}

export async function buildResearchCapsule(run, receipt = run.receipt) {
  if (!run?.decision?.decision_id) throw new Error('research capsule requires a completed case run');
  const evidenceMetadata = {
    schema: 'solarpunk.constraint.evidence_metadata.v1',
    evidence_hash: run.evidence.evidence_hash,
    source_kind: run.evidence.source.kind,
    adapter: run.evidence.adapter,
    interval_count: run.evidence.summary.interval_count,
    total_eligible_surplus_kwh: run.evidence.summary.total_eligible_surplus_kwh,
    raw_data_included: false,
    boundary: 'Controlled case-pack evidence is summarized by identity and metadata in the capsule. Raw evidence rows are excluded from the capsule export.',
  };
  const files = {
    'case.json': jsonText(run.caseManifest),
    'decision-result.json': jsonText(run.decision),
    'decision-receipt.json': jsonText(receipt),
    'policy-manifest.json': jsonText(run.policy),
    'evidence-metadata.json': jsonText(evidenceMetadata),
    'context-manifest.json': jsonText(run.contexts),
    'lineage.json': jsonText(lineageFor(run)),
    'reproduction.json': jsonText(reproductionFor(run)),
    'decision-memo.md': decisionMemo(run),
    'CITATION.cff': citationFor(run),
  };

  const fileEntries = [];
  for (const [path, content] of Object.entries(files)) {
    fileEntries.push({
      path,
      sha256: await sha256Hex(content),
      bytes: new TextEncoder().encode(content).byteLength,
    });
  }

  const manifestBody = {
    schema: 'solarpunk.constraint.research_capsule.v1',
    case_id: run.caseManifest.case_id,
    decision_id: run.decision.decision_id,
    files: fileEntries,
    raw_evidence_included: false,
    data_boundary: 'Capsule contains declared case/policy/context objects, derived decision artifacts, and evidence metadata. Raw evidence rows are excluded.',
  };
  const manifest = {
    ...manifestBody,
    capsule_id: await sha256Hex(JSON.stringify(manifestBody)),
  };

  return {
    manifest,
    files: {
      'capsule.json': jsonText(manifest),
      ...files,
    },
  };
}

export function downloadCapsuleFile(filename, content, type = 'application/octet-stream') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadCapsuleBundle(capsule) {
  const bundle = {
    schema: 'solarpunk.constraint.research_capsule_bundle.v1',
    manifest: capsule.manifest,
    files: capsule.files,
    boundary: 'Portable JSON bundle for static-host export. It is not a ZIP archive or legal certificate.',
  };
  downloadCapsuleFile(
    `research-capsule-${capsule.manifest.case_id.toLowerCase()}.json`,
    jsonText(bundle),
    'application/json',
  );
}
