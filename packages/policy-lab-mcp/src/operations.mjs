import { readFile } from 'node:fs/promises';
import {
  BUILTIN_CALCULATORS,
  BUILTIN_CASE_POLICIES,
  PROVENANCE_LEVELS,
  buildDecisionReceipt,
  caseManifestBody,
  casePolicyById,
  casePolicyManifestBody,
  classifyProvenance,
  evaluateCaseDecision,
  verifyEvidenceEnvelopeHash,
  verifyResearchCapsuleBundle,
} from '../../constraint-core/src/workbench.js';

const REGISTERED_ASSURANCE_SCENARIOS = Object.freeze({
  'PROVENANCE-L0-BASE': 'provenance-L0.json',
  'PROVENANCE-L1-COUNTERFACTUAL': 'provenance-L1.json',
  'PROVENANCE-L2-COUNTERFACTUAL': 'provenance-L2.json',
  'PROVENANCE-L4-COUNTERFACTUAL': 'provenance-L4.json',
});

const SUPPORTED_CASE_TYPES = new Set(['energy_site']);

export class PolicyLabMcpError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'PolicyLabMcpError';
    this.code = code;
    this.details = details;
  }
}

function fail(code, message, details = {}) {
  throw new PolicyLabMcpError(code, message, details);
}

function requiredObject(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail('INVALID_INPUT', `${field} must be an object`, { field });
  }
  return value;
}

function requiredArray(value, field) {
  if (!Array.isArray(value) || value.length === 0) {
    fail('INVALID_INPUT', `${field} must be a non-empty array`, { field });
  }
  return value;
}

function mapEvidence(evidence) {
  const list = requiredArray(evidence, 'evidence');
  return Object.fromEntries(list.map((item, index) => {
    requiredObject(item, `evidence[${index}]`);
    const hash = String(item.evidence_hash || '').trim();
    if (!hash) fail('INVALID_INPUT', `evidence[${index}].evidence_hash is required`, { field: `evidence[${index}].evidence_hash` });
    return [hash, item];
  }));
}

function mapContexts(contexts = []) {
  if (!Array.isArray(contexts)) fail('INVALID_INPUT', 'contexts must be an array', { field: 'contexts' });
  return Object.fromEntries(contexts.map((item, index) => {
    requiredObject(item, `contexts[${index}]`);
    const id = String(item.context_id || '').trim();
    if (!id) fail('INVALID_INPUT', `contexts[${index}].context_id is required`, { field: `contexts[${index}].context_id` });
    return [id, item];
  }));
}

function resolvePolicy(policyId) {
  const id = String(policyId || '').trim();
  if (!id) fail('INVALID_INPUT', 'policy_id is required', { field: 'policy_id' });
  const builtin = casePolicyById(id);
  if (!builtin) fail('UNKNOWN_POLICY', `unknown registered policy: ${id}`, { policy_id: id });
  return builtin;
}

function resolvePolicies(policyIds) {
  const ids = requiredArray(policyIds, 'policy_ids').map((id) => String(id || '').trim());
  return ids.map(resolvePolicy);
}

async function loadAssuranceScenario(scenarioId) {
  const id = String(scenarioId || '').trim();
  const filename = REGISTERED_ASSURANCE_SCENARIOS[id];
  if (!filename) {
    fail('UNKNOWN_ASSURANCE_SCENARIO', `unknown registered assurance scenario: ${id}`, { scenario_id: id });
  }
  const url = new URL(`../../../protocol/cases/energy-v1/scenarios/${filename}`, import.meta.url);
  const scenario = JSON.parse(await readFile(url, 'utf8'));
  if (scenario.scenario_id !== id || scenario.observed_evidence_changed !== false) {
    fail('INVALID_REGISTERED_SCENARIO', `registered assurance scenario ${id} failed integrity preflight`, { scenario_id: id });
  }
  return scenario;
}

async function resolveDecisionAssurance({ evidence, assuranceScenarioId = null }) {
  const list = requiredArray(evidence, 'evidence');
  if (list.length !== 1) {
    fail(
      'AMBIGUOUS_ASSURANCE',
      'Policy Lab v0 decision tools require exactly one evidence envelope for assurance classification',
      { evidence_count: list.length },
    );
  }

  if (!assuranceScenarioId) {
    return {
      provenance: classifyProvenance(list[0], {}),
      basis: {
        mode: 'EVIDENCE_ONLY',
        scenario_id: null,
        boundary: 'No caller-supplied assurance assertions are trusted by decision tools. Without a registered scenario, assurance is derived from evidence with no trusted-operator context.',
      },
    };
  }

  const scenario = await loadAssuranceScenario(assuranceScenarioId);
  return {
    provenance: classifyProvenance(list[0], scenario.provenance_context),
    basis: {
      mode: 'REGISTERED_COUNTERFACTUAL',
      scenario_id: scenario.scenario_id,
      boundary: scenario.boundary,
    },
  };
}

async function preflightCase({ caseManifest, evidenceByHash, contextsById }) {
  let normalizedCase;
  try {
    normalizedCase = caseManifestBody(requiredObject(caseManifest, 'case_manifest'));
  } catch (error) {
    if (error instanceof PolicyLabMcpError) throw error;
    fail('INVALID_CASE', error instanceof Error ? error.message : String(error));
  }

  if (!SUPPORTED_CASE_TYPES.has(normalizedCase.case_type)) {
    fail(
      'UNSUPPORTED_DOMAIN',
      `unsupported case_type for Policy Lab MCP v0: ${normalizedCase.case_type}`,
      { case_type: normalizedCase.case_type, supported_case_types: [...SUPPORTED_CASE_TYPES] },
    );
  }

  if (!normalizedCase.evidence_refs.length) {
    fail('MISSING_EVIDENCE', 'case requires at least one evidence_ref', { case_id: normalizedCase.case_id });
  }

  for (const evidenceHash of normalizedCase.evidence_refs) {
    const evidence = evidenceByHash[evidenceHash];
    if (!evidence) {
      fail('MISSING_EVIDENCE', `missing required evidence: ${evidenceHash}`, {
        case_id: normalizedCase.case_id,
        evidence_hash: evidenceHash,
      });
    }
    try {
      await verifyEvidenceEnvelopeHash(evidence);
    } catch (error) {
      fail('EVIDENCE_INTEGRITY_ERROR', error instanceof Error ? error.message : String(error), {
        case_id: normalizedCase.case_id,
        evidence_hash: evidenceHash,
      });
    }
  }

  for (const contextId of normalizedCase.context_refs) {
    if (!contextsById[contextId]) {
      fail('MISSING_CONTEXT', `missing required context: ${contextId}`, {
        case_id: normalizedCase.case_id,
        context_id: contextId,
      });
    }
  }

  return normalizedCase;
}

export async function assessCase({
  caseManifest,
  evidence,
  contexts = [],
  assuranceScenarioId = null,
  policyId,
}) {
  const evidenceByHash = mapEvidence(evidence);
  const contextsById = mapContexts(contexts);
  const normalizedCase = await preflightCase({ caseManifest, evidenceByHash, contextsById });
  const assurance = await resolveDecisionAssurance({ evidence, assuranceScenarioId });
  const decision = await evaluateCaseDecision({
    caseManifest: normalizedCase,
    evidenceByHash,
    contextsById,
    provenance: assurance.provenance,
    policy: resolvePolicy(policyId),
  });
  return {
    ...decision,
    assurance_basis: assurance.basis,
  };
}

export async function comparePolicies({
  caseManifest,
  evidence,
  contexts = [],
  assuranceScenarioId = null,
  policyIds,
}) {
  const evidenceByHash = mapEvidence(evidence);
  const contextsById = mapContexts(contexts);
  const normalizedCase = await preflightCase({ caseManifest, evidenceByHash, contextsById });
  const assurance = await resolveDecisionAssurance({ evidence, assuranceScenarioId });
  const resolvedPolicies = resolvePolicies(policyIds);
  const results = [];
  for (const policy of resolvedPolicies) {
    results.push(await evaluateCaseDecision({
      caseManifest: normalizedCase,
      evidenceByHash,
      contextsById,
      provenance: assurance.provenance,
      policy,
    }));
  }
  return {
    case_id: normalizedCase.case_id,
    assurance_basis: assurance.basis,
    results,
  };
}

export async function verifyEvidence({ evidence }) {
  requiredObject(evidence, 'evidence');
  try {
    await verifyEvidenceEnvelopeHash(evidence);
  } catch (error) {
    fail('EVIDENCE_INTEGRITY_ERROR', error instanceof Error ? error.message : String(error), {
      evidence_hash: evidence?.evidence_hash ?? null,
    });
  }
  return {
    ok: true,
    evidence_hash: evidence.evidence_hash,
    hash_algorithm: evidence.hash_algorithm ?? 'SHA-256',
  };
}

export function classifyAssurance({ evidence, provenanceContext }) {
  return {
    classification: classifyProvenance(
      requiredObject(evidence, 'evidence'),
      requiredObject(provenanceContext, 'provenance_context'),
    ),
    authority: 'DECLARED_CONTEXT_ONLY',
    boundary: 'This explanatory classifier accepts caller-declared assurance context. Its output is not accepted as decision authority by assess_case or compare_policies.',
  };
}

export function buildReceipt({
  decision,
  evaluatedAt,
  runtime,
  dataBoundary,
  rawEvidenceIncluded = false,
}) {
  const timestamp = String(evaluatedAt || '').trim();
  if (!timestamp) fail('INVALID_INPUT', 'evaluated_at is required; MCP does not inject the current time', { field: 'evaluated_at' });
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

export async function assuranceScenarioCatalog() {
  const entries = [];
  for (const scenarioId of Object.keys(REGISTERED_ASSURANCE_SCENARIOS)) {
    const scenario = await loadAssuranceScenario(scenarioId);
    entries.push({
      scenario_id: scenario.scenario_id,
      name: scenario.name,
      kind: scenario.kind,
      observed_evidence_changed: scenario.observed_evidence_changed,
      boundary: scenario.boundary,
    });
  }
  return entries;
}

export function catalogSnapshot() {
  return {
    policies: BUILTIN_CASE_POLICIES.map((policy) => casePolicyManifestBody(policy)),
    calculators: BUILTIN_CALCULATORS.map(({ evaluate: _evaluate, ...calculator }) => calculator),
    provenance_levels: PROVENANCE_LEVELS,
    supported_case_types: [...SUPPORTED_CASE_TYPES],
  };
}
