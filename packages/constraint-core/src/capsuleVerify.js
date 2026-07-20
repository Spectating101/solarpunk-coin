import { caseManifestBody, hashCaseManifest } from './case.js';
import { casePolicyManifestBody, hashCasePolicyManifest } from './casePolicies.js';
import { contextManifestBody, hashContextManifest } from './context.js';
import {
  decisionResultBody,
  evaluateCaseDecision,
  hashDecisionResultBody,
} from './decision.js';
import { verifyEvidenceEnvelopeHash } from './portableEvidence.js';
import { classifyProvenance } from './provenance.js';
import { receiptSummary } from './receipt.js';
import { sha256Hex, stableStringify } from './stable.js';

export const RESEARCH_CAPSULE_BUNDLE_SCHEMA = 'solarpunk.constraint.research_capsule_bundle.v1';
export const RESEARCH_CAPSULE_SCHEMA = 'solarpunk.constraint.research_capsule.v1';

/** The 12 hashed portable files. capsule.json is the un-hashed manifest copy. */
export const REQUIRED_CAPSULE_FILES = Object.freeze([
  'case.json',
  'policy-manifest.json',
  'evidence-metadata.json',
  'context-manifest.json',
  'decision-result.json',
  'decision-receipt.json',
  'lineage.json',
  'reproduction.json',
  'decision-memo.md',
  'CITATION.cff',
  'ro-crate-metadata.json',
  'prov.jsonld',
]);

const REQUIRED_JSON_FILES = Object.freeze([
  'case.json',
  'policy-manifest.json',
  'evidence-metadata.json',
  'context-manifest.json',
  'decision-result.json',
  'decision-receipt.json',
  'lineage.json',
  'reproduction.json',
  'ro-crate-metadata.json',
  'prov.jsonld',
]);

function check(ok, code, message, extra = {}) {
  return { ok: Boolean(ok), code, message, ...extra };
}

function same(a, b) {
  return stableStringify(a) === stableStringify(b);
}

function sorted(values) {
  return [...values].sort((a, b) => stableStringify(a).localeCompare(stableStringify(b)));
}

function parseJson(raw, label) {
  if (typeof raw !== 'string') throw new Error(`${label} must be UTF-8 JSON text`);
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

function parseJsonFile(files, path) {
  if (files[path] == null) throw new Error(`missing file ${path}`);
  return parseJson(files[path], path);
}

function hasRawEvidenceRows(value) {
  if (Array.isArray(value)) return value.some(hasRawEvidenceRows);
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value.intervals)) return true;
  const rowKeys = ['generation_kwh', 'site_load_kwh', 'export_kwh', 'curtailed_kwh'];
  if (rowKeys.some((key) => Object.hasOwn(value, key))) return true;
  return Object.values(value).some(hasRawEvidenceRows);
}

function manifestBody(manifest) {
  const { capsule_id: ignored, ...body } = manifest;
  return body;
}

function normalizedContextRefs(contexts) {
  return sorted(contexts.map((context) => ({
    context_id: context.context_id,
    context_hash: context.context_hash,
  })));
}

function receiptContextRefs(receipt) {
  return sorted((receipt.contexts || []).map((context) => ({
    context_id: context.id,
    context_hash: context.hash,
  })));
}

function failResult(code, message, warnings) {
  return finalize(false, {
    checks: [check(false, code, message)],
    warnings,
  });
}

/**
 * Verify a portable research capsule bundle using a closed-world v1 file model.
 *
 * Integrity and schema checks never require raw evidence rows. Optional
 * packReplay enables deterministic decision reproduction when the referenced
 * evidence and contexts can be resolved from a committed case pack.
 */
export async function verifyResearchCapsuleBundle(bundle, options = {}) {
  const checks = [];
  const warnings = [
    'Source-truth certification is never claimed. Integrity/reproduction does not establish physical meter truth, operator identity, legal authority, or redemption rights.',
  ];

  if (!bundle || typeof bundle !== 'object' || Array.isArray(bundle)) {
    return failResult('bundle_missing', 'Capsule bundle is required', warnings);
  }

  checks.push(check(
    bundle.schema === RESEARCH_CAPSULE_BUNDLE_SCHEMA,
    'bundle_schema',
    bundle.schema === RESEARCH_CAPSULE_BUNDLE_SCHEMA
      ? 'Capsule bundle schema accepted'
      : `Unexpected bundle schema: ${bundle.schema || 'missing'}`,
  ));

  const files = bundle.files && typeof bundle.files === 'object' && !Array.isArray(bundle.files)
    ? { ...bundle.files }
    : {};

  let manifest = bundle.manifest || null;
  let manifestCopy = null;
  if (files['capsule.json'] != null) {
    try {
      manifestCopy = parseJson(files['capsule.json'], 'capsule.json');
      checks.push(check(true, 'manifest_copy_parse', 'capsule.json parsed'));
    } catch (error) {
      checks.push(check(false, 'manifest_copy_parse', error.message));
    }
  } else {
    checks.push(check(false, 'manifest_copy_parse', 'capsule.json is missing'));
  }

  if (!manifest && manifestCopy) manifest = manifestCopy;
  checks.push(check(
    Boolean(manifest && typeof manifest === 'object' && !Array.isArray(manifest)),
    'manifest_presence',
    manifest ? 'Capsule manifest present' : 'Capsule manifest missing',
  ));

  if (manifest && manifestCopy) {
    checks.push(check(
      same(manifest, manifestCopy),
      'manifest_copy_match',
      same(manifest, manifestCopy)
        ? 'bundle.manifest matches capsule.json'
        : 'bundle.manifest differs from capsule.json',
    ));
  } else {
    checks.push(check(false, 'manifest_copy_match', 'Manifest copy comparison unavailable'));
  }

  if (manifest) {
    checks.push(check(
      manifest.schema === RESEARCH_CAPSULE_SCHEMA,
      'manifest_schema',
      manifest.schema === RESEARCH_CAPSULE_SCHEMA
        ? 'Capsule manifest schema accepted'
        : `Unexpected capsule schema: ${manifest.schema || 'missing'}`,
    ));
    try {
      const computedCapsuleId = await sha256Hex(JSON.stringify(manifestBody(manifest)));
      checks.push(check(
        manifest.capsule_id === computedCapsuleId,
        'capsule_identity',
        manifest.capsule_id === computedCapsuleId
          ? 'capsule_id matches the canonical manifest body'
          : 'capsule_id does not match the canonical manifest body',
        { expected: manifest.capsule_id, produced: computedCapsuleId },
      ));
    } catch (error) {
      checks.push(check(false, 'capsule_identity', error.message));
    }
  } else {
    checks.push(check(false, 'manifest_schema', 'Capsule manifest unavailable'));
    checks.push(check(false, 'capsule_identity', 'Capsule manifest unavailable'));
  }

  const missingFiles = REQUIRED_CAPSULE_FILES.filter((path) => files[path] == null);
  checks.push(check(
    missingFiles.length === 0,
    'files_present',
    missingFiles.length
      ? `Missing required files: ${missingFiles.join(', ')}`
      : `All ${REQUIRED_CAPSULE_FILES.length} required capsule files present`,
    { missing: missingFiles },
  ));

  const bundleFileSet = Object.keys(files).sort();
  const allowedBundleFileSet = [...REQUIRED_CAPSULE_FILES, 'capsule.json'].sort();
  const undeclaredBundleFiles = bundleFileSet.filter((path) => !allowedBundleFileSet.includes(path));
  checks.push(check(
    same(bundleFileSet, allowedBundleFileSet),
    'bundle_file_set',
    same(bundleFileSet, allowedBundleFileSet)
      ? 'Bundle contains exactly capsule.json and the 12 v1 portable files'
      : `Bundle file set differs from the closed-world v1 model${undeclaredBundleFiles.length ? `; undeclared: ${undeclaredBundleFiles.join(', ')}` : ''}`,
    { actual: bundleFileSet, expected: allowedBundleFileSet, undeclared: undeclaredBundleFiles },
  ));

  const declared = Array.isArray(manifest?.files) ? manifest.files : [];
  const declaredPaths = declared.map((entry) => entry?.path).filter(Boolean);
  const duplicateDeclared = declaredPaths.filter((path, index) => declaredPaths.indexOf(path) !== index);
  checks.push(check(
    duplicateDeclared.length === 0 && same([...new Set(declaredPaths)].sort(), [...REQUIRED_CAPSULE_FILES].sort()),
    'manifest_file_set',
    duplicateDeclared.length
      ? `Manifest contains duplicate file declarations: ${[...new Set(duplicateDeclared)].join(', ')}`
      : 'Manifest must declare each of the 12 v1 portable files exactly once',
    { declared: declaredPaths, duplicates: [...new Set(duplicateDeclared)] },
  ));

  const hashFailures = [];
  const sizeFailures = [];
  for (const entry of declared) {
    const path = entry?.path;
    if (!path || files[path] == null) {
      hashFailures.push({ path, reason: 'missing_content' });
      continue;
    }
    const content = String(files[path]);
    const digest = await sha256Hex(content);
    if (String(entry.sha256 || '').toLowerCase() !== digest) {
      hashFailures.push({
        path,
        reason: 'sha256_mismatch',
        expected: entry.sha256,
        actual: digest,
      });
    }
    const actualBytes = new TextEncoder().encode(content).byteLength;
    if (Number(entry.bytes) !== actualBytes) {
      sizeFailures.push({ path, expected: entry.bytes, actual: actualBytes });
    }
  }
  checks.push(check(
    declared.length > 0 && hashFailures.length === 0,
    'file_hashes',
    !declared.length
      ? 'Manifest does not declare file digests'
      : hashFailures.length
        ? `${hashFailures.length} file digest mismatch(es)`
        : `Verified SHA-256 for ${declared.length} declared files`,
    { hashFailures },
  ));
  checks.push(check(
    declared.length > 0 && sizeFailures.length === 0,
    'file_sizes',
    !declared.length
      ? 'Manifest does not declare file sizes'
      : sizeFailures.length
        ? `${sizeFailures.length} file size mismatch(es)`
        : `Verified byte length for ${declared.length} declared files`,
    { sizeFailures },
  ));

  const parsed = {};
  const parseFailures = [];
  for (const path of REQUIRED_JSON_FILES) {
    try {
      parsed[path] = parseJsonFile(files, path);
    } catch (error) {
      parseFailures.push({ path, error: error.message });
    }
  }
  checks.push(check(
    parseFailures.length === 0,
    'json_parse',
    parseFailures.length
      ? `${parseFailures.length} required JSON file(s) failed to parse`
      : 'All required JSON files parsed',
    { failures: parseFailures },
  ));

  let expectedDecisionId = parsed['decision-result.json']?.decision_id || manifest?.decision_id || null;
  let producedDecisionId = null;
  let caseManifest = null;
  let policy = null;
  let contexts = [];
  let decision = null;
  let receipt = null;
  let reproductionFile = null;
  let evidenceMeta = null;

  try {
    caseManifest = caseManifestBody(parsed['case.json']);
    const caseHash = await hashCaseManifest(caseManifest);
    policy = casePolicyManifestBody(parsed['policy-manifest.json']);
    const policyHash = await hashCasePolicyManifest(policy);
    contexts = (Array.isArray(parsed['context-manifest.json'])
      ? parsed['context-manifest.json']
      : [parsed['context-manifest.json']]).map(contextManifestBody);
    for (const context of contexts) {
      const computed = await hashContextManifest(context);
      if (computed !== context.context_hash) {
        throw new Error(`context hash mismatch for ${context.context_id}`);
      }
    }
    decision = decisionResultBody(parsed['decision-result.json']);
    producedDecisionId = await hashDecisionResultBody(decision);
    receipt = parsed['decision-receipt.json'];
    receiptSummary(receipt);
    reproductionFile = parsed['reproduction.json'];
    evidenceMeta = parsed['evidence-metadata.json'];

    if (evidenceMeta?.schema !== 'solarpunk.constraint.evidence_metadata.v1') {
      throw new Error(`evidence metadata schema mismatch: ${evidenceMeta?.schema || 'missing'}`);
    }
    if (parsed['lineage.json']?.schema !== 'solarpunk.constraint.lineage_snapshot.v1') {
      throw new Error(`lineage schema mismatch: ${parsed['lineage.json']?.schema || 'missing'}`);
    }
    if (reproductionFile?.schema !== 'solarpunk.constraint.reproduction.v1') {
      throw new Error(`reproduction schema mismatch: ${reproductionFile?.schema || 'missing'}`);
    }
    if (!Array.isArray(parsed['ro-crate-metadata.json']?.['@graph'])) {
      throw new Error('ro-crate-metadata.json requires an @graph array');
    }
    if (!Array.isArray(parsed['prov.jsonld']?.['@graph'])) {
      throw new Error('prov.jsonld requires an @graph array');
    }
    if (!String(files['decision-memo.md'] || '').trim()) {
      throw new Error('decision-memo.md is empty');
    }
    if (!/^cff-version:\s*1\.2\.0/m.test(String(files['CITATION.cff'] || ''))) {
      throw new Error('CITATION.cff must declare cff-version 1.2.0');
    }

    checks.push(check(true, 'core_schemas', 'Core case, policy, context, decision, receipt, evidence, lineage, reproduction, RO-Crate, PROV, memo, and citation structures validated', {
      case_hash: caseHash,
      policy_hash: policyHash,
    }));
  } catch (error) {
    checks.push(check(false, 'core_schemas', error.message));
  }

  if (decision) {
    checks.push(check(
      decision.decision_id === producedDecisionId,
      'decision_identity',
      decision.decision_id === producedDecisionId
        ? 'decision_id matches canonical DecisionResult body hash'
        : 'decision_id does not match canonical DecisionResult body hash',
      { expected: decision.decision_id, produced: producedDecisionId },
    ));
  } else {
    checks.push(check(false, 'decision_identity', 'DecisionResult unavailable'));
  }

  if (caseManifest && policy && contexts.length && decision && receipt && reproductionFile && evidenceMeta && manifest) {
    const policyHash = await hashCasePolicyManifest(policy);
    const contextRefs = normalizedContextRefs(contexts);
    const decisionEvidence = sorted(decision.evidence_hashes || []);
    const caseEvidence = sorted(caseManifest.evidence_refs || []);
    const reproductionEvidence = sorted(reproductionFile.evidence_hashes || []);
    const receiptEvidence = sorted((receipt.evidence || []).map((item) => item.hash));
    const decisionContexts = sorted(decision.context_refs || []);
    const reproductionContexts = sorted(reproductionFile.context_refs || []);
    const caseContextIds = sorted(caseManifest.context_refs || []);
    const contextIds = sorted(contexts.map((context) => context.context_id));

    const identityAssertions = [
      manifest.case_id === caseManifest.case_id,
      decision.case_id === caseManifest.case_id,
      receipt.case_id === caseManifest.case_id,
      reproductionFile.case_id === caseManifest.case_id,
      manifest.decision_id === decision.decision_id,
      receipt.decision_id === decision.decision_id,
      reproductionFile.expected_decision_id === decision.decision_id,
      parsed['lineage.json'].decision_id === decision.decision_id,
      reproductionFile.expected_result === decision.decision,
      manifest.policy?.id === policy.id,
      manifest.policy?.version === policy.version,
      manifest.policy?.manifest_hash === policyHash,
      decision.policy_id === policy.id,
      decision.policy_version === policy.version,
      decision.policy_manifest_hash === policyHash,
      receipt.policy?.id === policy.id,
      receipt.policy?.version === policy.version,
      receipt.policy?.manifest_hash === policyHash,
      reproductionFile.policy?.id === policy.id,
      reproductionFile.policy?.version === policy.version,
      reproductionFile.policy?.manifest_hash === policyHash,
      same(caseEvidence, decisionEvidence),
      same(caseEvidence, reproductionEvidence),
      same(caseEvidence, receiptEvidence),
      caseEvidence.length === 1 && evidenceMeta.evidence_hash === caseEvidence[0],
      same(caseContextIds, contextIds),
      same(contextRefs, decisionContexts),
      same(contextRefs, reproductionContexts),
      same(contextRefs, receiptContextRefs(receipt)),
      manifest.assurance_scenario === reproductionFile.assurance_scenario,
      manifest.source_revision === receipt.runtime?.source_revision,
      manifest.source_revision === reproductionFile.runtime?.source_revision,
      receipt.result === decision.decision,
      (receipt.evidence || []).every((item) => item.raw_included === false),
    ];

    checks.push(check(
      identityAssertions.every(Boolean),
      'cross_object_identity',
      identityAssertions.every(Boolean)
        ? 'Case, policy, evidence, context, decision, receipt, lineage, reproduction, assurance, and runtime identities agree'
        : 'One or more capsule objects disagree on declared identity',
    ));
  } else {
    checks.push(check(false, 'cross_object_identity', 'Cross-object identity comparison unavailable'));
  }

  const rawEvidenceObjects = REQUIRED_JSON_FILES
    .map((path) => parsed[path])
    .filter(Boolean);
  const rawRowsPresent = rawEvidenceObjects.some(hasRawEvidenceRows);
  const privacyOk = manifest?.raw_evidence_included === false
    && evidenceMeta?.raw_data_included === false
    && !rawRowsPresent
    && undeclaredBundleFiles.length === 0;
  checks.push(check(
    privacyOk,
    'privacy_boundary',
    privacyOk
      ? 'Capsule declares raw evidence excluded and no raw interval rows or undeclared files were found'
      : 'Capsule privacy boundary failed: raw evidence declaration, raw interval rows, or undeclared files detected',
    { raw_rows_present: rawRowsPresent, undeclared_files: undeclaredBundleFiles },
  ));

  let reproduction = {
    status: 'NOT_RUN',
    detail: 'No packReplay provided; integrity-only verification.',
  };

  if (options.packReplay) {
    try {
      reproduction = await replayDecisionFromPack(files, options.packReplay);
      checks.push(check(
        reproduction.status === 'PASS',
        'decision_reproduction',
        reproduction.detail,
        {
          expected: reproduction.expected_decision_id,
          produced: reproduction.produced_decision_id,
        },
      ));
      if (reproduction.produced_decision_id) producedDecisionId = reproduction.produced_decision_id;
    } catch (error) {
      reproduction = { status: 'FAIL', detail: error.message };
      checks.push(check(false, 'decision_reproduction', error.message));
    }
  }

  expectedDecisionId = decision?.decision_id || expectedDecisionId;
  return finalize(checks.every((item) => item.ok), {
    checks,
    warnings,
    reproduction,
    expectedDecisionId,
    producedDecisionId,
  });
}

function finalize(ok, {
  checks,
  warnings,
  reproduction = { status: 'NOT_RUN' },
  expectedDecisionId = null,
  producedDecisionId = null,
}) {
  const byCode = Object.fromEntries(checks.map((item) => [item.code, item]));
  const integrityCodes = [
    'bundle_schema',
    'manifest_copy_parse',
    'manifest_presence',
    'manifest_copy_match',
    'manifest_schema',
    'capsule_identity',
    'files_present',
    'bundle_file_set',
    'manifest_file_set',
    'file_hashes',
    'file_sizes',
    'decision_identity',
    'cross_object_identity',
    'privacy_boundary',
  ];
  const schemaCodes = ['bundle_schema', 'manifest_schema', 'json_parse', 'core_schemas'];
  const allRequiredPass = (codes) => codes.every((code) => byCode[code]?.ok === true);

  return {
    ok: Boolean(ok),
    summary: {
      capsule_integrity: allRequiredPass(integrityCodes) ? 'PASS' : 'FAIL',
      schema_validation: allRequiredPass(schemaCodes) ? 'PASS' : 'FAIL',
      decision_reproduction: reproduction.status || 'NOT_RUN',
      source_truth_certification: 'NOT_CLAIMED',
      expected_decision_id: expectedDecisionId,
      produced_decision_id: producedDecisionId,
    },
    checks,
    warnings,
    reproduction,
  };
}

async function replayDecisionFromPack(files, packReplay) {
  const {
    casesById,
    evidenceByHash,
    contextsById,
    scenariosById,
  } = packReplay;

  const caseManifest = caseManifestBody(parseJsonFile(files, 'case.json'));
  const policy = casePolicyManifestBody(parseJsonFile(files, 'policy-manifest.json'));
  const decision = decisionResultBody(parseJsonFile(files, 'decision-result.json'));
  const reproduction = parseJsonFile(files, 'reproduction.json');

  if (casesById) {
    const committedCase = casesById[caseManifest.case_id];
    if (!committedCase) {
      return {
        status: 'FAIL',
        detail: `Case ${caseManifest.case_id} is not present in packReplay`,
        expected_decision_id: decision.decision_id,
      };
    }
    if (!same(caseManifestBody(committedCase), caseManifest)) {
      return {
        status: 'FAIL',
        detail: `Capsule case ${caseManifest.case_id} differs from the committed pack case`,
        expected_decision_id: decision.decision_id,
      };
    }
  }

  const scenarioId = reproduction.assurance_scenario;
  const scenario = scenariosById?.[scenarioId];
  if (!scenario) {
    return {
      status: 'FAIL',
      detail: `Unknown assurance scenario for replay: ${scenarioId}`,
      expected_decision_id: decision.decision_id,
    };
  }

  for (const hash of caseManifest.evidence_refs) {
    const evidence = evidenceByHash?.[hash];
    if (!evidence) {
      return {
        status: 'FAIL',
        detail: `Evidence ${hash} not in packReplay (capsule excludes raw rows by design)`,
        expected_decision_id: decision.decision_id,
      };
    }
    await verifyEvidenceEnvelopeHash(evidence);
  }

  const evidence = evidenceByHash[caseManifest.evidence_refs[0]];
  const provenance = classifyProvenance(evidence, scenario.provenance_context);
  const replayed = await evaluateCaseDecision({
    caseManifest,
    evidenceByHash,
    contextsById,
    provenance,
    policy,
  });

  if (replayed.decision_id !== decision.decision_id) {
    return {
      status: 'FAIL',
      detail: 'Replayed decision_id differs from capsule decision-result.json',
      expected_decision_id: decision.decision_id,
      produced_decision_id: replayed.decision_id,
    };
  }

  return {
    status: 'PASS',
    detail: 'Committed-pack replay reproduced the capsule decision_id',
    expected_decision_id: decision.decision_id,
    produced_decision_id: replayed.decision_id,
  };
}

export function formatCapsuleVerificationReport(result) {
  const lines = [
    `Capsule integrity: ${result.summary.capsule_integrity}`,
    `Schema validation: ${result.summary.schema_validation}`,
    `Decision reproduction: ${result.summary.decision_reproduction}`,
    `Expected decision ID: ${result.summary.expected_decision_id || '—'}`,
    `Produced decision ID: ${result.summary.produced_decision_id || '—'}`,
    'Source-truth certification: NOT CLAIMED',
    '',
    'Checks:',
    ...result.checks.map((item) => `- [${item.ok ? 'PASS' : 'FAIL'}] ${item.code}: ${item.message}`),
    '',
    ...result.warnings.map((warning) => `Warning: ${warning}`),
  ];
  return `${lines.join('\n')}\n`;
}
