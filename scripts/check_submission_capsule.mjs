import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PUBLIC_EVIDENCE_CHECKPOINT } from '../frontend/src/data/publicEvidenceCheckpoint.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CAPSULE_DIR = path.join(ROOT, 'docs/submission/opportunities-2026/global-ai-finance-2026');

const manifest = JSON.parse(await readFile(path.join(CAPSULE_DIR, 'SUBMISSION_MANIFEST.json'), 'utf8'));
const abstract = await readFile(path.join(CAPSULE_DIR, manifest.external_submission.artifact), 'utf8');

assert.equal(manifest.schema, 'policy_lab.submission_capsule.v1');
assert.equal(manifest.capsule_id, 'global-ai-finance-2026-poster');
assert.equal(manifest.research_positioning_version, 'RC5');
assert.ok(
  ['SURPRISE_PROOFED', 'PORTAL_READY', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'].includes(manifest.status),
  `unsupported capsule status ${manifest.status}`,
);

for (const artifact of manifest.capsule_artifacts) await access(path.join(CAPSULE_DIR, artifact));

const cp = PUBLIC_EVIDENCE_CHECKPOINT;
const frozen = manifest.evidence_checkpoint;
assert.equal(frozen.case_id, cp.case_id);
assert.equal(frozen.archive_sha256, cp.source.archive_sha256);
assert.equal(frozen.evidence_hash, cp.evidence.evidence_hash);
assert.equal(frozen.assurance, cp.evidence.assurance);
assert.equal(frozen.interval_count, cp.source.interval_count);
assert.equal(frozen.eligible_surplus_kwh, cp.evidence.total_eligible_surplus_kwh);
assert.equal(frozen.open_policy.policy_id, cp.decisions.open.policy_id);
assert.equal(frozen.open_policy.decision_id, cp.decisions.open.decision_id);
assert.equal(frozen.open_policy.result, cp.decisions.open.result);
assert.equal(frozen.open_policy.admitted_maximum, cp.decisions.open.admitted_maximum);
assert.equal(frozen.open_policy.binding_constraint, cp.decisions.open.binding_constraints[0]);
assert.equal(frozen.pilot_policy.policy_id, cp.decisions.pilot.policy_id);
assert.equal(frozen.pilot_policy.decision_id, cp.decisions.pilot.decision_id);
assert.equal(frozen.pilot_policy.result, cp.decisions.pilot.result);
assert.deepEqual(frozen.pilot_policy.blocking_rules, [...cp.decisions.pilot.blocking_rules]);
assert.equal(frozen.settlement.capacity_fraction, cp.settlement.declared_capacity_fraction);
assert.equal(frozen.settlement.result, cp.settlement.result);
assert.equal(frozen.settlement.covered_quantity, cp.settlement.covered_quantity);
assert.equal(frozen.settlement.shortfall_quantity, cp.settlement.shortfall_quantity);
assert.deepEqual(frozen.research_boundaries, { ...cp.boundaries });

const requiredAbstractPatterns = [
  new RegExp(manifest.external_submission.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
  /Oracle systems/i,
  /verifiable credentials/i,
  /proof-of-solvency/i,
  /policy engines/i,
  /336 half-hour intervals/i,
  /lowest assurance tier.*L0/i,
  /max\(PV generation - general load - controlled load, 0\)/i,
  /derived surplus quantity, not a directly metered export channel/i,
  /33\.066 kWh/i,
  /no monetary price or legal entitlement is implied/i,
  /research configurations used for sensitivity analysis/i,
  /not calibrated, institutionally endorsed, or claimed to be optimal/i,
  /same evidence is blocked/i,
  /evidence itself is unchanged/i,
  /40%/i,
  /13\.2264 kWh/i,
  /19\.8396 kWh/i,
  /one public case establish general external validity/i,
  /github\.com\/Spectating101\/solarpunk-coin/i,
  /Dagher/i,
  /Ratnam/i,
];
for (const pattern of requiredAbstractPatterns) {
  assert.match(abstract, pattern, `RC5 abstract missing required research statement: ${pattern}`);
}

const antiSlopPatterns = [
  /rapidly evolving (?:fintech|financial|technology) landscape/i,
  /groundbreaking/i,
  /cutting[- ]edge/i,
  /revolutionary/i,
  /game[- ]changing/i,
  /innovative solution/i,
  /paradigm shift/i,
  /unprecedented/i,
  /transformative platform/i,
  /unlock(?:s|ing) (?:new|the) potential/i,
  /seamless(?:ly)?/i,
];
for (const pattern of antiSlopPatterns) assert.doesNotMatch(abstract, pattern, `anti-slop violation: ${pattern}`);

const implementationLeakPatterns = [
  /ADMIT_WITH_LIMIT/,
  /EVIDENCE_BACKED_CAPACITY/,
  /SIGNED_EVIDENCE/,
  /MIN_PROVENANCE/,
  /DecisionResult/,
  /cross-object lineage/i,
  /non-promotion semantics/i,
  /LAB-CASE-OPEN-004/,
  /ENERGY-CASE-PILOT-005/,
];
for (const pattern of implementationLeakPatterns) assert.doesNotMatch(abstract, pattern, `implementation jargon leaked into outward abstract: ${pattern}`);

const dangerousClaimPatterns = [
  /Ausgrid (?:validated|verified|approved|endorsed) (?:Policy Lab|the system|this work)/i,
  /validated by Ausgrid/i,
  /authenticated operator (?:pilot|deployment|case)/i,
  /verified physical (?:meter|energy|production)/i,
  /(?:we|Policy Lab) (?:has|have|runs?|operates?) (?:a )?(?:customer|commercial|institutional) pilot/i,
  /(?:is|constitutes) (?:a )?(?:currency|stablecoin|legal tender)/i,
  /proves? (?:legal issuance|enforceable redemption|market adoption)/i,
  /production[- ]ready/i,
  /33\.066(?:\s*kWh)?\s+(?:is|equals|represents)\s+(?:the\s+)?(?:market value|fair value|price)/i,
  /33\.066(?:\s*kWh)?\s+(?:of\s+)?(?:metered|measured)\s+export/i,
  /(?:validated|correct|optimal) (?:open|pilot|research) policy/i,
  /institutionally endorsed (?:open|pilot|research) policy/i,
];
for (const pattern of dangerousClaimPatterns) assert.doesNotMatch(abstract, pattern, `dangerous outward claim: ${pattern}`);

assert.equal(manifest.status, 'PORTAL_READY');
assert.equal(manifest.external_submission.author, 'Christopher Ongko');
assert.match(manifest.external_submission.affiliation, /MS Program in Finance.*Yuan Ze University/i);
assert.equal(manifest.external_submission.primary_topic, 'Green FinTech');
assert.match(manifest.external_submission.reproducibility_url, /github\.com\/Spectating101\/solarpunk-coin/);
assert.match(manifest.research_positioning.quantity_interpretation, /not a monetary price|not a monetary/i);
assert.match(manifest.research_positioning.surplus_derivation, /not directly metered export/i);
assert.match(manifest.research_positioning.policy_status, /not calibrated/i);
assert.ok(Array.isArray(manifest.references) && manifest.references.length >= 5);
assert.ok(Array.isArray(manifest.owner_only_fields) && manifest.owner_only_fields.length >= 5);
assert.ok(Array.isArray(manifest.known_obligations) && manifest.known_obligations.length >= 3);
assert.ok(Array.isArray(manifest.non_claims) && manifest.non_claims.length >= 10);
assert.match(manifest.parallel_route_guard.rule, /Financial Cryptography|FC|simultaneous|overlap/i);

const wordCount = abstract
  .replace(/[#*_`>\[\]()]/g, ' ')
  .trim()
  .split(/\s+/)
  .filter(Boolean).length;
assert.ok(wordCount >= 550, `RC5 extended abstract unexpectedly thin: ${wordCount} words`);
assert.ok(wordCount <= 1000, `RC5 extended abstract too long for a focused poster submission: ${wordCount} words`);

console.log('Global AI Finance RC5 submission pack: PASS');
console.log(`status=${manifest.status}`);
console.log(`title=${manifest.external_submission.title}`);
console.log(`author=${manifest.external_submission.author}`);
console.log(`case=${frozen.case_id} assurance=${frozen.assurance}`);
console.log(`derived_surplus=${frozen.eligible_surplus_kwh} kWh`);
console.log(`open=${frozen.open_policy.result}/${frozen.open_policy.admitted_maximum}`);
console.log(`pilot=${frozen.pilot_policy.result}`);
console.log(`settlement=${frozen.settlement.result}/${frozen.settlement.shortfall_quantity} shortfall`);
console.log(`abstract_words=${wordCount}`);
