import {
  BUILTIN_CALCULATORS,
  BUILTIN_CASE_POLICIES,
  PROVENANCE_LEVELS,
  buildDecisionReceipt,
  casePolicyById,
  casePolicyManifestBody,
  classifyProvenance,
  evaluateCaseDecision,
  verifyEvidenceEnvelopeHash,
  verifyResearchCapsuleBundle,
} from '../../constraint-core/src/workbench.js';

function requiredObject(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${field} must be an object`);
  }
  return value;
}

function requiredArray(value, field) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${field} must be a non-empty array`);
  }
  return value;
}

function mapEvidence(evidence) {
  const list = requiredArray(evidence, 'evidence');
  return Object.fromEntries(list.map((item, index) => {
    requiredObject(item, `evidence[${index}]`);
    const hash = String(item.evidence_hash || '').trim();
    if (!hash) throw new Error(`evidence[${index}].evidence_hash is required`);
    return [hash, item];
  }));
}

function mapContexts(contexts = []) {
  if (!Array.isArray(contexts)) throw new Error('contexts must be an array');
  return Object.fromEntries(contexts.map((item, index) => {
    requiredObject(item, `contexts[${index}]`);
    const id = String(item.context_id || '').trim();
    if (!id) throw new Error(`contexts[${index}].context_id is required`);
    return [id, item];
  }));
}

function resolvePolicy(policyId) {
  const id = String(policyId || '').trim();
  if (!id) throw new Error('policy_id is required');
  const builtin = casePolicyById(id);
  if (!builtin) throw new Error(`unknown registered policy: ${id}`);
  return builtin;
}

function resolvePolicies(policyIds) {
  const ids = requiredArray(policyIds, 'policy_ids').map((id) => String(id || '').trim());
  return ids.map(resolvePolicy);
}

function resolveProvenance({ evidence, provenance = null, provenanceContext = null }) {
  if (provenance) return requiredObject(provenance, 'provenance');
  if (!provenanceContext) return null;
  const list = requiredArray(evidence, 'evidence');
  if (list.length !== 1) {
    throw new Error('provenance_context convenience classification requires exactly one evidence envelope');
  }
  return classifyProvenance(list[0], requiredObject(provenanceContext, 'provenance_context'));
}

export async function assessCase({
  caseManifest,
  evidence,
  contexts = [],
  provenance = null,
  provenanceContext = null,
  policyId,
}) {
  requiredObject(caseManifest, 'case_manifest');
  const resolvedProvenance = resolveProvenance({ evidence, provenance, provenanceContext });
  return evaluateCaseDecision({
    caseManifest,
    evidenceByHash: mapEvidence(evidence),
    contextsById: mapContexts(contexts),
    provenance: resolvedProvenance,
    policy: resolvePolicy(policyId),
  });
}

export async function comparePolicies({
  caseManifest,
  evidence,
  contexts = [],
  provenance = null,
  provenanceContext = null,
  policyIds,
}) {
  requiredObject(caseManifest, 'case_manifest');
  const resolvedProvenance = resolveProvenance({ evidence, provenance, provenanceContext });
  const evidenceByHash = mapEvidence(evidence);
  const contextsById = mapContexts(contexts);
  const resolvedPolicies = resolvePolicies(policyIds);
  const results = [];
  for (const policy of resolvedPolicies) {
    results.push(await evaluateCaseDecision({
      caseManifest,
      evidenceByHash,
      contextsById,
      provenance: resolvedProvenance,
      policy,
    }));
  }
  return {
    case_id: caseManifest.case_id ?? null,
    results,
  };
}

export async function verifyEvidence({ evidence }) {
  requiredObject(evidence, 'evidence');
  await verifyEvidenceEnvelopeHash(evidence);
  return {
    ok: true,
    evidence_hash: evidence.evidence_hash,
    hash_algorithm: evidence.hash_algorithm ?? 'SHA-256',
  };
}

export function classifyAssurance({ evidence, provenanceContext }) {
  return classifyProvenance(
    requiredObject(evidence, 'evidence'),
    requiredObject(provenanceContext, 'provenance_context'),
  );
}

export function buildReceipt({
  decision,
  evaluatedAt,
  runtime,
  dataBoundary,
  rawEvidenceIncluded = false,
}) {
  const timestamp = String(evaluatedAt || '').trim();
  if (!timestamp) throw new Error('evaluated_at is required; MCP does not inject the current time');
  return buildDecisionReceipt({
    decision: requiredObject(decision, 'decision'),
    evaluated_at: timestamp,
    runtime: requiredObject(runtime, 'runtime'),
    data_boundary: String(dataBoundary || '').trim(),
    raw_evidence_included: Boolean(rawEvidenceIncluded),
  });
}

export async function verifyCapsule({ bundle, packReplay = null }) {
  return verifyResearchCapsuleBundle(requiredObject(bundle, 'bundle'), {
    ...(packReplay ? { packReplay: requiredObject(packReplay, 'pack_replay') } : {}),
  });
}

export function catalogSnapshot() {
  return {
    policies: BUILTIN_CASE_POLICIES.map((policy) => casePolicyManifestBody(policy)),
    calculators: BUILTIN_CALCULATORS.map(({ evaluate: _evaluate, ...calculator }) => calculator),
    provenance_levels: PROVENANCE_LEVELS,
  };
}
