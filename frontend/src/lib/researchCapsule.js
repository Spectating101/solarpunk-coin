import { sha256Hex } from '@solarpunk/constraint-core';
import {
  decisionArtifactStem,
  decisionMemo,
  WORKBENCH_RUNTIME,
} from './caseWorkbenchRuntime';

const RO_CRATE_CONTEXT = 'https://w3id.org/ro/crate/1.3/context';
const RO_CRATE_PROFILE = 'https://w3id.org/ro/crate/1.3';
const PROV_JSONLD_CONTEXT = 'https://openprovenance.org/prov-jsonld/context.jsonld';

function jsonText(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function byteLength(value) {
  return new TextEncoder().encode(value).byteLength;
}

function encodingFormat(path) {
  if (path.endsWith('.jsonld')) return 'application/ld+json';
  if (path.endsWith('.json')) return 'application/json';
  if (path.endsWith('.md')) return 'text/markdown';
  if (path.endsWith('.cff')) return 'text/yaml';
  return 'application/octet-stream';
}

function provId(kind, value) {
  return `spk:${kind}-${String(value).replace(/[^a-zA-Z0-9_-]/g, '-')}`;
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

function provJsonLdFor(run, receipt) {
  const evidenceId = provId('evidence', run.evidence.evidence_hash);
  const policyId = provId('policy', run.decision.policy_manifest_hash);
  const scenarioId = provId('scenario', run.scenario.scenario_id);
  const decisionId = provId('decision', run.decision.decision_id);
  const receiptId = provId('receipt', run.decision.decision_id);
  const decisionActivityId = provId('activity', `evaluate-${run.decision.decision_id}`);
  const receiptActivityId = provId('activity', `package-${run.decision.decision_id}`);
  const runtimeAgentId = provId('agent', WORKBENCH_RUNTIME.package);
  const contextIds = run.contexts.map((context) => provId('context', context.context_hash));

  const entities = [
    {
      '@type': 'Entity',
      '@id': evidenceId,
      type: ['spk:ControlledEvidenceFixture'],
      label: [{ '@value': `${run.caseManifest.case_id} evidence envelope` }],
      'spk:sha256': [run.evidence.evidence_hash],
      'spk:boundary': ['Evidence identity does not certify physical source truth.'],
    },
    ...run.contexts.map((context, index) => ({
      '@type': 'Entity',
      '@id': contextIds[index],
      type: ['spk:ModeledContext'],
      label: [{ '@value': context.label }],
      'spk:sha256': [context.context_hash],
      'spk:temporalSemantics': [context.temporal_semantics.kind],
    })),
    {
      '@type': 'Entity',
      '@id': policyId,
      type: ['spk:DeclaredPolicy'],
      label: [{ '@value': `${run.policy.id}@${run.policy.version}` }],
      'spk:sha256': [run.decision.policy_manifest_hash],
    },
    {
      '@type': 'Entity',
      '@id': scenarioId,
      type: ['spk:DeclaredAssuranceScenario'],
      label: [{ '@value': run.scenario.name }],
      'spk:boundary': [run.scenario.boundary],
    },
    {
      '@type': 'Entity',
      '@id': decisionId,
      type: ['spk:DecisionResult'],
      label: [{ '@value': `${run.caseManifest.case_id} ${run.decision.decision}` }],
      'spk:decisionId': [run.decision.decision_id],
      'spk:result': [run.decision.decision],
    },
    {
      '@type': 'Entity',
      '@id': receiptId,
      type: ['spk:DecisionReceipt'],
      label: [{ '@value': `Decision receipt ${run.decision.decision_id}` }],
    },
  ];

  const decisionInputs = [evidenceId, ...contextIds, policyId, scenarioId];
  return {
    '@context': [
      {
        spk: 'https://spectating101.github.io/solarpunk-coin/ns/constraint#',
        prov: 'http://www.w3.org/ns/prov#',
      },
      PROV_JSONLD_CONTEXT,
    ],
    '@graph': [
      ...entities,
      {
        '@type': 'Agent',
        '@id': runtimeAgentId,
        type: ['prov:SoftwareAgent'],
        label: [{ '@value': `${WORKBENCH_RUNTIME.package}@${WORKBENCH_RUNTIME.package_version}` }],
        'spk:sourceRevision': [WORKBENCH_RUNTIME.source_revision],
      },
      {
        '@type': 'Activity',
        '@id': decisionActivityId,
        endTime: receipt.evaluated_at,
        type: ['spk:DeterministicDecisionEvaluation'],
        label: [{ '@value': 'Evaluate case under declared policy and assurance scenario' }],
      },
      ...decisionInputs.map((entity) => ({
        '@type': 'Usage',
        activity: decisionActivityId,
        entity,
      })),
      {
        '@type': 'Association',
        activity: decisionActivityId,
        agent: runtimeAgentId,
      },
      {
        '@type': 'Generation',
        entity: decisionId,
        activity: decisionActivityId,
        time: receipt.evaluated_at,
      },
      ...decisionInputs.map((usedEntity) => ({
        '@type': 'Derivation',
        generatedEntity: decisionId,
        usedEntity,
      })),
      {
        '@type': 'Activity',
        '@id': receiptActivityId,
        endTime: receipt.evaluated_at,
        type: ['spk:ReceiptPackaging'],
        label: [{ '@value': 'Package deterministic decision receipt' }],
      },
      {
        '@type': 'Usage',
        activity: receiptActivityId,
        entity: decisionId,
      },
      {
        '@type': 'Association',
        activity: receiptActivityId,
        agent: runtimeAgentId,
      },
      {
        '@type': 'Generation',
        entity: receiptId,
        activity: receiptActivityId,
        time: receipt.evaluated_at,
      },
      {
        '@type': 'Derivation',
        generatedEntity: receiptId,
        usedEntity: decisionId,
      },
    ],
  };
}

function roCrateFor(run, receipt, payloadFiles) {
  const payloadEntities = Object.entries(payloadFiles).map(([path, content]) => ({
    '@id': path,
    '@type': 'File',
    name: path,
    encodingFormat: encodingFormat(path),
    contentSize: String(byteLength(content)),
  }));

  return {
    '@context': RO_CRATE_CONTEXT,
    '@graph': [
      {
        '@id': 'ro-crate-metadata.json',
        '@type': 'CreativeWork',
        about: { '@id': './' },
        conformsTo: { '@id': RO_CRATE_PROFILE },
      },
      {
        '@id': './',
        '@type': 'Dataset',
        name: `Policy Lab decision research capsule — ${run.caseManifest.case_id}`,
        description: 'Portable case, evidence metadata, modeled context, versioned policy, deterministic decision, receipt, lineage, and reproduction metadata. Raw evidence rows are excluded.',
        identifier: run.decision.decision_id,
        dateCreated: receipt.evaluated_at,
        creator: { '@id': '#creator' },
        license: { '@id': 'https://spdx.org/licenses/MIT.html' },
        hasPart: payloadEntities.map((entity) => ({ '@id': entity['@id'] })),
        subjectOf: { '@id': 'decision-memo.md' },
        mentions: [
          { '@id': '#constraint-core' },
          { '@id': '#policy' },
          { '@id': '#assurance-scenario' },
        ],
      },
      {
        '@id': '#creator',
        '@type': 'Person',
        name: 'Christopher Ongko',
      },
      {
        '@id': '#constraint-core',
        '@type': 'SoftwareApplication',
        name: WORKBENCH_RUNTIME.package,
        softwareVersion: WORKBENCH_RUNTIME.package_version,
        identifier: WORKBENCH_RUNTIME.source_revision,
      },
      {
        '@id': '#policy',
        '@type': 'CreativeWork',
        name: `${run.policy.id}@${run.policy.version}`,
        identifier: run.decision.policy_manifest_hash,
      },
      {
        '@id': '#assurance-scenario',
        '@type': 'CreativeWork',
        name: run.scenario.name,
        identifier: run.scenario.scenario_id,
        description: run.scenario.boundary,
      },
      ...payloadEntities,
    ],
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
    'identifiers:',
    '  - type: other',
    `    value: "${run.decision.decision_id}"`,
    '    description: "Deterministic DecisionResult identity"',
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
  files['prov.jsonld'] = jsonText(provJsonLdFor(run, receipt));
  files['ro-crate-metadata.json'] = jsonText(roCrateFor(run, receipt, files));

  const fileEntries = [];
  for (const [path, content] of Object.entries(files)) {
    fileEntries.push({
      path,
      sha256: await sha256Hex(content),
      bytes: byteLength(content),
    });
  }

  const manifestBody = {
    schema: 'solarpunk.constraint.research_capsule.v1',
    case_id: run.caseManifest.case_id,
    policy: {
      id: run.policy.id,
      version: run.policy.version,
      manifest_hash: run.decision.policy_manifest_hash,
    },
    assurance_scenario: run.scenario.scenario_id,
    decision_id: run.decision.decision_id,
    source_revision: WORKBENCH_RUNTIME.source_revision,
    interoperability: {
      ro_crate_profile: RO_CRATE_PROFILE,
      prov_jsonld_context: PROV_JSONLD_CONTEXT,
    },
    files: fileEntries,
    raw_evidence_included: false,
    data_boundary: 'Capsule contains declared case/policy/context objects, derived decision artifacts, standards-mapped provenance, and evidence metadata. Raw evidence rows are excluded.',
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

export function downloadCapsuleBundle(capsule, run) {
  const bundle = {
    schema: 'solarpunk.constraint.research_capsule_bundle.v1',
    manifest: capsule.manifest,
    files: capsule.files,
    boundary: 'Portable JSON bundle for static-host export. It is not a ZIP archive or legal certificate.',
  };
  downloadCapsuleFile(
    `research-capsule-${decisionArtifactStem(run)}.json`,
    jsonText(bundle),
    'application/json',
  );
}
