import { caseManifestBody, hashCaseManifest } from './case.js';
import { casePolicyManifestBody, hashCasePolicyManifest } from './casePolicies.js';
import { contextManifestBody, hashContextManifest } from './context.js';
import {
  evaluateCaseDecision,
  hashDecisionResultBody,
} from './decision.js';
import { verifyEvidenceEnvelopeHash } from './portableEvidence.js';
import { classifyProvenance } from './provenance.js';
import { sha256Hex } from './stable.js';

export const RESEARCH_CAPSULE_BUNDLE_SCHEMA = 'solarpunk.constraint.research_capsule_bundle.v1';
export const RESEARCH_CAPSULE_SCHEMA = 'solarpunk.constraint.research_capsule.v1';

/** The 12 hashed portable files (capsule.json is the wrapping manifest copy). */
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

function check(ok, code, message, extra = {}) {
  return { ok, code, message, ...extra };
}

function parseJsonFile(files, path) {
  const raw = files[path];
  if (raw == null) throw new Error(`missing file ${path}`);
  return JSON.parse(raw);
}

/**
 * Verify a portable research capsule bundle.
 *
 * Integrity/schema checks never require raw evidence rows.
 * Optional packReplay enables deterministic decision reproduction when evidence
 * envelopes can be resolved from a case pack (capsule exports exclude raw rows).
 */
export async function verifyResearchCapsuleBundle(bundle, options = {}) {
  const checks = [];
  const warnings = [
    'Source-truth certification is never claimed. Integrity/reproduction ≠ physical meter truth.',
  ];

  if (!bundle || typeof bundle !== 'object') {
    return finalize(false, {
      checks: [check(false, 'bundle_missing', 'Capsule bundle is required')],
      warnings,
    });
  }

  const files = { ...(bundle.files || {}) };
  let manifest = bundle.manifest || null;
  if (!manifest && files['capsule.json']) {
    manifest = JSON.parse(files['capsule.json']);
  }

  if (!manifest) {
    checks.push(check(false, 'manifest_missing', 'Capsule manifest missing (manifest or capsule.json)'));
  } else if (manifest.schema !== RESEARCH_CAPSULE_SCHEMA) {
    checks.push(check(false, 'manifest_schema', `Unexpected capsule schema: ${manifest.schema}`));
  } else {
    checks.push(check(true, 'manifest_schema', 'Capsule manifest schema accepted'));
  }

  const missing = REQUIRED_CAPSULE_FILES.filter((path) => files[path] == null);
  if (missing.length) {
    checks.push(check(false, 'files_present', `Missing required files: ${missing.join(', ')}`, { missing }));
  } else {
    checks.push(check(true, 'files_present', `All ${REQUIRED_CAPSULE_FILES.length} required capsule files present`));
  }

  const declared = Array.isArray(manifest?.files) ? manifest.files : [];
  const hashFailures = [];
  for (const entry of declared) {
    const path = entry?.path;
    if (!path || files[path] == null) {
      hashFailures.push({ path, reason: 'missing_content' });
      continue;
    }
    const digest = await sha256Hex(String(files[path]));
    if (String(entry.sha256 || '').toLowerCase() !== digest) {
      hashFailures.push({
        path,
        reason: 'sha256_mismatch',
        expected: entry.sha256,
        actual: digest,
      });
    }
  }
  if (!declared.length) {
    checks.push(check(false, 'file_hashes', 'Manifest does not declare file digests'));
  } else if (hashFailures.length) {
    checks.push(check(false, 'file_hashes', `${hashFailures.length} file digest mismatch(es)`, { hashFailures }));
  } else {
    checks.push(check(true, 'file_hashes', `Verified SHA-256 for ${declared.length} declared files`));
  }

  if (manifest) {
    checks.push(check(
      !manifest.raw_evidence_included,
      'privacy_boundary',
      manifest.raw_evidence_included
        ? 'Capsule claims raw_evidence_included=true'
        : 'Capsule declares raw evidence excluded',
    ));
  }

  let expectedDecisionId = null;
  let producedDecisionId = null;

  try {
    const decision = parseJsonFile(files, 'decision-result.json');
    expectedDecisionId = decision.decision_id;
    const identityHash = await hashDecisionResultBody(decision);
    producedDecisionId = identityHash;
    checks.push(check(
      String(decision.decision_id).toLowerCase() === identityHash.toLowerCase(),
      'decision_identity',
      String(decision.decision_id).toLowerCase() === identityHash.toLowerCase()
        ? 'decision_id matches canonical DecisionResult body hash'
        : 'decision_id does not match canonical DecisionResult body hash',
      { expected: decision.decision_id, produced: identityHash },
    ));

    const reproduction = parseJsonFile(files, 'reproduction.json');
    checks.push(check(
      !reproduction.expected_decision_id || reproduction.expected_decision_id === decision.decision_id,
      'reproduction_pointer',
      reproduction.expected_decision_id === decision.decision_id
        ? 'reproduction.json points at the same decision_id'
        : 'reproduction.expected_decision_id disagrees with decision-result.json',
    ));
  } catch (error) {
    checks.push(check(false, 'decision_parse', error.message));
  }

  try {
    const caseManifest = caseManifestBody(parseJsonFile(files, 'case.json'));
    await hashCaseManifest(caseManifest);
    const policy = casePolicyManifestBody(parseJsonFile(files, 'policy-manifest.json'));
    await hashCasePolicyManifest(policy);
    const contexts = parseJsonFile(files, 'context-manifest.json');
    const contextList = Array.isArray(contexts) ? contexts : [contexts];
    for (const ctx of contextList) {
      const body = contextManifestBody(ctx);
      if (body.context_hash) {
        const expected = await hashContextManifest(body);
        if (expected !== body.context_hash) {
          throw new Error(`context hash mismatch for ${body.context_id}`);
        }
      }
    }
    const evidenceMeta = parseJsonFile(files, 'evidence-metadata.json');
    if (evidenceMeta.raw_data_included) {
      throw new Error('evidence-metadata.json claims raw_data_included=true');
    }
    checks.push(check(true, 'core_schemas', 'case/policy/context/evidence-metadata parse and hash-check'));
  } catch (error) {
    checks.push(check(false, 'core_schemas', error.message));
  }

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
      if (reproduction.produced_decision_id) {
        producedDecisionId = reproduction.produced_decision_id;
      }
    } catch (error) {
      reproduction = { status: 'FAIL', detail: error.message };
      checks.push(check(false, 'decision_reproduction', error.message));
    }
  }

  return finalize(checks.every((c) => c.ok), {
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
  const byCode = Object.fromEntries(checks.map((c) => [c.code, c]));
  const integrityOk = ['files_present', 'file_hashes', 'manifest_schema', 'decision_identity']
    .every((code) => !byCode[code] || byCode[code].ok);
  const schemaOk = ['core_schemas', 'manifest_schema']
    .every((code) => !byCode[code] || byCode[code].ok);

  return {
    ok,
    summary: {
      capsule_integrity: integrityOk ? 'PASS' : 'FAIL',
      schema_validation: schemaOk ? 'PASS' : 'FAIL',
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
    evidenceByHash,
    contextsById,
    scenariosById,
  } = packReplay;

  const caseManifest = caseManifestBody(parseJsonFile(files, 'case.json'));
  const policy = casePolicyManifestBody(parseJsonFile(files, 'policy-manifest.json'));
  const decision = parseJsonFile(files, 'decision-result.json');
  const reproduction = parseJsonFile(files, 'reproduction.json');
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
    const evidence = evidenceByHash[hash];
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
    detail: 'Pack replay reproduced the capsule decision_id',
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
    ...result.checks.map((c) => `- [${c.ok ? 'PASS' : 'FAIL'}] ${c.code}: ${c.message}`),
    '',
    ...result.warnings.map((w) => `Warning: ${w}`),
  ];
  return `${lines.join('\n')}\n`;
}
