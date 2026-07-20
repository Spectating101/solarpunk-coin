import casePack from '../../../protocol/cases/energy-v1/case-pack.json';
import tynCase from '../../../protocol/cases/energy-v1/cases/TYN-001.json';
import ausCase from '../../../protocol/cases/energy-v1/cases/AUS-001.json';
import phxCase from '../../../protocol/cases/energy-v1/cases/PHX-001.json';
import opsCase from '../../../protocol/cases/energy-v1/cases/OPS-001.json';
import tynEvidence from '../../../protocol/cases/energy-v1/evidence/tyn-sample-evidence.json';
import ausEvidence from '../../../protocol/cases/energy-v1/evidence/aus-sample-evidence.json';
import phxEvidence from '../../../protocol/cases/energy-v1/evidence/phx-sample-evidence.json';
import opsEvidence from '../../../protocol/cases/energy-v1/evidence/ops-sample-evidence.json';
import tynContext from '../../../protocol/cases/energy-v1/contexts/tyn-resource-context.json';
import ausContext from '../../../protocol/cases/energy-v1/contexts/aus-resource-context.json';
import phxContext from '../../../protocol/cases/energy-v1/contexts/phx-resource-context.json';
import provenanceL0 from '../../../protocol/cases/energy-v1/scenarios/provenance-L0.json';
import provenanceL1 from '../../../protocol/cases/energy-v1/scenarios/provenance-L1.json';
import provenanceL2 from '../../../protocol/cases/energy-v1/scenarios/provenance-L2.json';
import provenanceL4 from '../../../protocol/cases/energy-v1/scenarios/provenance-L4.json';
import openPolicy from '../../../protocol/policies-v2/LAB-CASE-OPEN-004.json';
import pilotPolicy from '../../../protocol/policies-v2/ENERGY-CASE-PILOT-005.json';
import strictPolicy from '../../../protocol/policies-v2/ENERGY-CASE-STRICT-006.json';

const cases = [tynCase, ausCase, phxCase, opsCase];
const evidence = [tynEvidence, ausEvidence, phxEvidence, opsEvidence];
const contexts = [tynContext, ausContext, phxContext];
const scenarios = [provenanceL0, provenanceL1, provenanceL2, provenanceL4];
const policies = [openPolicy, pilotPolicy, strictPolicy];

function indexBy(items, key, label) {
  const result = {};
  for (const item of items) {
    const id = item?.[key];
    if (!id) throw new Error(`${label} is missing ${key}`);
    if (result[id]) throw new Error(`duplicate ${label} ${key}: ${id}`);
    result[id] = item;
  }
  return Object.freeze(result);
}

export const ENERGY_CASE_PACK = Object.freeze({
  manifest: casePack,
  cases: Object.freeze(cases),
  evidence: Object.freeze(evidence),
  contexts: Object.freeze(contexts),
  scenarios: Object.freeze(scenarios),
  policies: Object.freeze(policies),
  casesById: indexBy(cases, 'case_id', 'case'),
  evidenceByHash: indexBy(evidence, 'evidence_hash', 'evidence'),
  contextsById: indexBy(contexts, 'context_id', 'context'),
  scenariosById: indexBy(scenarios, 'scenario_id', 'scenario'),
  policiesById: indexBy(policies, 'id', 'policy'),
});

export const DEFAULT_CASE_ID = 'TYN-001';
export const DEFAULT_POLICY_ID = 'ENERGY-CASE-PILOT-005';
export const DEFAULT_SCENARIO_ID = 'PROVENANCE-L0-BASE';

export function caseDecisionKey(caseId, policyId, scenarioId) {
  return `${caseId}::${policyId}::${scenarioId}`;
}
