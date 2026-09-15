import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const readJson = async (relative) => JSON.parse(await fs.readFile(path.join(root, relative), 'utf8'));

const gauntlet = await readJson('benchmark/gauntlet/policy-lab-specialized.v1.json');
const protocol = await readJson('benchmark/gauntlet/policy-lab-external-validation-protocol.v1.json');

const requiredExternal = gauntlet.challenges
  .filter((item) => item.state === 'OPEN_EXTERNAL')
  .map((item) => item.id)
  .sort();
const definedExternal = protocol.protocols.map((item) => item.challenge_id).sort();
const missing = requiredExternal.filter((id) => !definedExternal.includes(id));
const extra = definedExternal.filter((id) => !requiredExternal.includes(id));

const malformed = protocol.protocols.filter((item) => (
  item.gate_state !== 'OPEN_EXTERNAL'
  || !item.minimum_evidence
  || typeof item.minimum_evidence !== 'object'
  || !String(item.pass_rule || '').trim()
  || !String(item.publication_boundary || '').trim()
));

const globalNonEvidence = Array.isArray(protocol.global_non_evidence) ? protocol.global_non_evidence : [];
const antiGamingPresent = [
  /CI success/i,
  /stars|page views|clones/i,
  /controlled fixture/i,
  /AI model/i,
].every((pattern) => globalNonEvidence.some((item) => pattern.test(item)));

const comprehension = protocol.protocols.find((item) => item.challenge_id === 'PLG-12');
const comprehensionFrozen = Number(comprehension?.minimum_evidence?.uncoached_evaluators) >= 5
  && Array.isArray(comprehension?.required_questions)
  && comprehension.required_questions.length >= 6
  && /80%/.test(String(comprehension?.pass_rule || ''));

const reproduction = protocol.protocols.find((item) => item.challenge_id === 'PLG-09');
const reproductionFrozen = reproduction?.minimum_evidence?.environment_record === true
  && reproduction?.minimum_evidence?.manual_interventions_recorded === true
  && reproduction?.minimum_evidence?.expected_and_observed_decision_ids === true
  && reproduction?.minimum_evidence?.expected_and_observed_package_ids === true;

const pass = missing.length === 0
  && extra.length === 0
  && malformed.length === 0
  && antiGamingPresent
  && comprehensionFrozen
  && reproductionFrozen;

const result = {
  schema: 'policylab.external_gauntlet_protocol_check.v1',
  status: pass ? 'PASS' : 'FAIL',
  required_external_challenges: requiredExternal,
  defined_protocols: definedExternal,
  missing,
  extra,
  malformed: malformed.map((item) => item.challenge_id),
  anti_gaming_non_evidence_frozen: antiGamingPresent,
  blind_comprehension_rule_frozen: comprehensionFrozen,
  independent_reproduction_rule_frozen: reproductionFrozen,
  boundary: 'Defining a closure protocol does not close the external gate. Each gate remains OPEN_EXTERNAL until qualifying outside evidence is recorded.',
};

console.log(JSON.stringify(result, null, 2));
if (!pass) process.exitCode = 1;
