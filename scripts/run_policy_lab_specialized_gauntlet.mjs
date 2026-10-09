import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  casePolicyById,
  classifyProvenance,
  createDecisionClaimManifest,
  evaluateCaseDecision,
  evaluateSettlement,
  makeIssuedClaim,
  verifyEvidenceEnvelopeHash,
} from '../packages/constraint-core/src/workbench.js';
import { PUBLIC_EVIDENCE_CHECKPOINT } from '../frontend/src/data/publicEvidenceCheckpoint.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const packRoot = path.join(root, 'protocol', 'cases', 'energy-v1');

const arg = (name) => {
  const prefix = `--${name}=`;
  const item = process.argv.find((value) => value.startsWith(prefix));
  return item ? item.slice(prefix.length) : null;
};

const outDir = path.resolve(arg('out') || path.join(root, '_policy_lab_specialized_gauntlet'));
const readJson = async (...parts) => JSON.parse(await fs.readFile(path.join(...parts), 'utf8'));
const round = (value, digits = 6) => Number(Number(value).toFixed(digits));
const sameArray = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const manifest = await readJson(root, 'benchmark', 'gauntlet', 'policy-lab-specialized.v1.json');
const assumptions = await readJson(root, 'benchmark', 'gauntlet', 'policy-assumptions.v1.json');
const c3c4 = await readJson(root, 'benchmark', 'gauntlet', 'policy-lab-c3-c4-map.v1.json');

const [caseManifest, evidence, context, scenarioL0, scenarioL2] = await Promise.all([
  readJson(packRoot, 'cases', 'TYN-001.json'),
  readJson(packRoot, 'evidence', 'tyn-sample-evidence.json'),
  readJson(packRoot, 'contexts', 'tyn-resource-context.json'),
  readJson(packRoot, 'scenarios', 'provenance-L0.json'),
  readJson(packRoot, 'scenarios', 'provenance-L2.json'),
]);

const evidenceByHash = { [evidence.evidence_hash]: evidence };
const contextsById = { [context.context_id]: context };

async function decide(policy, scenario) {
  const provenance = classifyProvenance(evidence, scenario.provenance_context);
  const decision = await evaluateCaseDecision({
    caseManifest,
    evidenceByHash,
    contextsById,
    provenance,
    policy,
  });
  return { provenance, decision };
}

const openPolicy = casePolicyById('LAB-CASE-OPEN-004');
const pilotPolicy = casePolicyById('ENERGY-CASE-PILOT-005');

const [openL0, openL2, pilotL0, pilotL2] = await Promise.all([
  decide(openPolicy, scenarioL0),
  decide(openPolicy, scenarioL2),
  decide(pilotPolicy, scenarioL0),
  decide(pilotPolicy, scenarioL2),
]);

const checks = [];
function check(id, title, pass, details = {}) {
  checks.push({ id, title, status: pass ? 'PASS' : 'FAIL', details });
}

// PLG-01 — a stale evidence identity cannot survive capability promotion.
let tamperError = null;
const promotedEvidence = structuredClone(evidence);
promotedEvidence.capabilities.signed = true;
promotedEvidence.capabilities.cryptographically_verified = true;
promotedEvidence.capabilities.operator_signed = true;
try {
  await verifyEvidenceEnvelopeHash(promotedEvidence);
} catch (error) {
  tamperError = String(error?.message || error);
}
check(
  'PLG-01',
  'Evidence capability non-promotion',
  (await verifyEvidenceEnvelopeHash(evidence)) === true && /evidence hash mismatch/i.test(tamperError || ''),
  {
    evidence_hash: evidence.evidence_hash,
    promoted_hash_retained: promotedEvidence.evidence_hash === evidence.evidence_hash,
    rejection: tamperError,
  },
);

// PLG-02 — same evidence, different policy => distinct policy/decision identity.
check(
  'PLG-02',
  'Policy identity integrity',
  sameArray(openL0.decision.evidence_hashes, pilotL0.decision.evidence_hashes)
    && openL0.decision.policy_manifest_hash !== pilotL0.decision.policy_manifest_hash
    && openL0.decision.decision_id !== pilotL0.decision.decision_id,
  {
    evidence_hashes: openL0.decision.evidence_hashes,
    open_policy_hash: openL0.decision.policy_manifest_hash,
    pilot_policy_hash: pilotL0.decision.policy_manifest_hash,
    open_decision_id: openL0.decision.decision_id,
    pilot_decision_id: pilotL0.decision.decision_id,
  },
);

// PLG-03 — caller quantity never overrides the deterministic DecisionResult.
const boundedClaim = await createDecisionClaimManifest({
  decision: pilotL2.decision,
  subject: 'Policy Lab specialized Gauntlet quantity challenge',
  quantity: 999999,
});
check(
  'PLG-03',
  'Quantity inflation resistance',
  pilotL2.decision.decision === 'ADMIT_WITH_LIMIT'
    && boundedClaim.quantity === pilotL2.decision.capacity.admitted_maximum
    && boundedClaim.quantity !== 999999,
  {
    caller_quantity: 999999,
    admitted_maximum: pilotL2.decision.capacity.admitted_maximum,
    claim_quantity: boundedClaim.quantity,
    decision_id: boundedClaim.decision_id,
  },
);

// PLG-04 — settlement changes consequences, not the upstream decision.
const openClaim = await createDecisionClaimManifest({
  decision: openL0.decision,
  subject: 'Policy Lab specialized Gauntlet settlement challenge',
});
const issuedOpenClaim = makeIssuedClaim(openClaim);
const admitted = Number(openL0.decision.capacity.admitted_maximum);
const settlementFull = evaluateSettlement({ claim: issuedOpenClaim, settlement_capacity: admitted });
const settlementPartial = evaluateSettlement({ claim: issuedOpenClaim, settlement_capacity: round(admitted * 0.4) });
const settlementZero = evaluateSettlement({ claim: issuedOpenClaim, settlement_capacity: 0 });
check(
  'PLG-04',
  'Settlement separation',
  settlementFull.result === 'SETTLED'
    && settlementPartial.result === 'PARTIAL'
    && settlementZero.result === 'SHORTFALL'
    && openClaim.decision_id === openL0.decision.decision_id,
  {
    decision_id: openL0.decision.decision_id,
    admitted_maximum: admitted,
    full: settlementFull,
    partial_40pct: settlementPartial,
    zero: settlementZero,
  },
);

// PLG-05 — assurance counterfactual changes declared context, not evidence identity.
check(
  'PLG-05',
  'Counterfactual isolation',
  scenarioL2.kind === 'ASSURANCE_COUNTERFACTUAL'
    && scenarioL2.observed_evidence_changed === false
    && pilotL0.provenance.level === 'L0'
    && pilotL2.provenance.level === 'L2'
    && sameArray(pilotL0.decision.evidence_hashes, pilotL2.decision.evidence_hashes)
    && pilotL0.decision.decision === 'BLOCKED'
    && pilotL2.decision.decision === 'ADMIT_WITH_LIMIT',
  {
    evidence_hashes: pilotL0.decision.evidence_hashes,
    actual_provenance: pilotL0.provenance.level,
    counterfactual_provenance: pilotL2.provenance.level,
    actual_decision: pilotL0.decision.decision,
    counterfactual_decision: pilotL2.decision.decision,
    observed_evidence_changed: scenarioL2.observed_evidence_changed,
  },
);

function pilotMultiplierVariant(multiplier) {
  const policy = structuredClone(pilotPolicy);
  const suffix = String(multiplier).replace('.', '_');
  policy.id = `GAUNTLET-PILOT-L2-MULTIPLIER-${suffix}`;
  policy.version = '0.1.0-sensitivity';
  policy.name = `Gauntlet L2 multiplier sensitivity ${multiplier}`;
  policy.description = 'Non-authoritative sensitivity fork of ENERGY-CASE-PILOT-005. Changes only the declared L2 provenance quantity multiplier for adversarial analysis.';
  policy.governance = {
    authority: 'Policy Lab specialized Gauntlet sensitivity fork',
    mutable_by: 'ephemeral evaluator only',
  };
  const rule = policy.quantity_rules.find((item) => item.calculator_id === 'PROVENANCE_POLICY_CAPACITY');
  if (!rule) throw new Error('pilot policy missing PROVENANCE_POLICY_CAPACITY');
  rule.parameters.capacity_multiplier_by_level.L2 = multiplier;
  return policy;
}

const sensitivityValues = [0.5, 0.7, 0.9];
const sensitivity = [];
for (const multiplier of sensitivityValues) {
  const policy = multiplier === 0.7 ? pilotPolicy : pilotMultiplierVariant(multiplier);
  const result = await decide(policy, scenarioL2);
  sensitivity.push({
    multiplier,
    policy_id: result.decision.policy_id,
    policy_manifest_hash: result.decision.policy_manifest_hash,
    decision_id: result.decision.decision_id,
    decision: result.decision.decision,
    admitted_maximum: result.decision.capacity.admitted_maximum,
    binding_constraints: result.decision.capacity.binding_constraints,
    evidence_hashes: result.decision.evidence_hashes,
  });
}
const sensitivityQuantities = sensitivity.map((item) => Number(item.admitted_maximum));
check(
  'PLG-06',
  'Policy sensitivity disclosure',
  sensitivity.every((item) => item.decision === 'ADMIT_WITH_LIMIT')
    && sensitivity.every((item) => sameArray(item.evidence_hashes, pilotL2.decision.evidence_hashes))
    && sensitivityQuantities[0] < sensitivityQuantities[1]
    && sensitivityQuantities[1] < sensitivityQuantities[2]
    && sensitivity.every((item) => item.binding_constraints.includes('PROVENANCE_POLICY_CAPACITY')),
  {
    changed_parameter: 'ENERGY-CASE-PILOT-005.PROVENANCE_POLICY_CAPACITY.capacity_multiplier_by_level.L2',
    variants: sensitivity,
    boundary: 'Sensitivity forks are not registered policies and do not change current project authority.',
  },
);

function getNested(value, dottedPath) {
  if (dottedPath == null) return value;
  return dottedPath.split('.').reduce((current, key) => current?.[key], value);
}

function currentAssumptionValue(item) {
  if (item.id === 'demo.settlement_fraction') {
    return PUBLIC_EVIDENCE_CHECKPOINT.settlement.declared_capacity_fraction;
  }
  const policy = casePolicyById(item.policy_id);
  if (!policy) throw new Error(`unknown policy in assumption register: ${item.policy_id}`);
  const allRules = [...policy.admission_rules, ...policy.quantity_rules];
  const rule = allRules.find((candidate) => candidate.calculator_id === item.calculator_id);
  if (!rule) throw new Error(`missing ${item.calculator_id} in ${item.policy_id}`);
  if (item.parameter_path == null) return true;
  return getNested(rule.parameters, item.parameter_path);
}

const allowedClasses = new Set(assumptions.allowed_classes || []);
const assumptionResults = assumptions.assumptions.map((item) => {
  const actual = currentAssumptionValue(item);
  return {
    id: item.id,
    class: item.class,
    class_allowed: allowedClasses.has(item.class),
    expected: item.expected_current_value,
    actual,
    matches: JSON.stringify(actual) === JSON.stringify(item.expected_current_value),
    boundary: item.boundary,
  };
});
const assumptionsValid = assumptionResults.every((item) => item.class_allowed && item.matches);

const standardsPath = path.join(root, 'docs', 'submission', 'POLICY_LAB_STANDARDS_DIFFERENTIATION.md');
let standardsDocumented = true;
try {
  await fs.access(standardsPath);
} catch {
  standardsDocumented = false;
}

const machineIds = new Set(manifest.challenges.filter((item) => item.state === 'MACHINE_REQUIRED').map((item) => item.id));
const machineResults = checks.filter((item) => machineIds.has(item.id));
const machineCoverageComplete = machineResults.length === machineIds.size;
const machinePassed = machineCoverageComplete && machineResults.every((item) => item.status === 'PASS');

const openChallenges = manifest.challenges.filter((item) => String(item.state).startsWith('OPEN'));
const c3Requirements = c3c4.levels.C3.requirements;
const c4Requirements = c3c4.levels.C4.requirements;
const countStates = (items) => Object.fromEntries(
  [...new Set(items.map((item) => item.state))].sort().map((state) => [state, items.filter((item) => item.state === state).length]),
);

const causalMatrix = {
  case_id: caseManifest.case_id,
  evidence_hash: evidence.evidence_hash,
  rows: [
    {
      assurance: pilotL0.provenance.level,
      scenario_id: scenarioL0.scenario_id,
      open_policy: {
        result: openL0.decision.decision,
        admitted_maximum: openL0.decision.capacity.admitted_maximum,
        binding_constraints: openL0.decision.capacity.binding_constraints,
      },
      pilot_policy: {
        result: pilotL0.decision.decision,
        admitted_maximum: pilotL0.decision.capacity.admitted_maximum,
        blocking_rules: pilotL0.decision.admission.blocking_rules,
      },
    },
    {
      assurance: pilotL2.provenance.level,
      scenario_id: scenarioL2.scenario_id,
      open_policy: {
        result: openL2.decision.decision,
        admitted_maximum: openL2.decision.capacity.admitted_maximum,
        binding_constraints: openL2.decision.capacity.binding_constraints,
      },
      pilot_policy: {
        result: pilotL2.decision.decision,
        admitted_maximum: pilotL2.decision.capacity.admitted_maximum,
        binding_constraints: pilotL2.decision.capacity.binding_constraints,
      },
    },
  ],
  boundary: 'The L2 row is a declared assurance counterfactual over the same controlled evidence identity, not new observed evidence.',
};

const report = {
  schema: 'policylab.specialized_gauntlet_report.v1',
  version: manifest.version,
  status: machinePassed && assumptionsValid && standardsDocumented ? 'PASS_WITH_OPEN_EXTERNAL_GATES' : 'FAIL',
  reference_case: manifest.reference_case,
  machine_checks: checks,
  causal_matrix: causalMatrix,
  policy_sensitivity: sensitivity,
  policy_assumptions: {
    valid: assumptionsValid,
    results: assumptionResults,
  },
  standards_differentiation: {
    documented: standardsDocumented,
    path: path.relative(root, standardsPath),
  },
  c3_c4_readiness: {
    C3: { state: c3c4.levels.C3.state, counts: countStates(c3Requirements) },
    C4: { state: c3c4.levels.C4.state, counts: countStates(c4Requirements) },
  },
  open_challenges: openChallenges.map(({ id, title, state, pass_condition, gap }) => ({ id, title, state, pass_condition, gap: gap || null })),
  summary: {
    machine_required: machineIds.size,
    machine_reported: machineResults.length,
    machine_passed: machineResults.filter((item) => item.status === 'PASS').length,
    assumptions_registered: assumptionResults.length,
    assumptions_valid: assumptionsValid,
    open_external_or_release_gates: openChallenges.length,
  },
  claim_boundary: manifest.claim_boundary,
};

const matrixCell = (item) => item.result === 'BLOCKED'
  ? `BLOCKED (${(item.blocking_rules || []).join(' + ')})`
  : `${item.result} (${item.admitted_maximum})`;

const markdown = `# Policy Lab Specialized Gauntlet v${manifest.version}\n\n` +
  `**Result:** ${report.status}\n\n` +
  `This report attacks the reference implementation's evidence-to-authority boundaries. It is not an award forecast, external validation, legal certification, or evidence of adoption.\n\n` +
  `## Machine challenges\n\n` +
  `| Challenge | Result |\n|---|---|\n` +
  checks.map((item) => `| ${item.id} — ${item.title} | **${item.status}** |`).join('\n') +
  `\n\n## Causal matrix — same evidence identity\n\n` +
  `Evidence hash: \`${evidence.evidence_hash}\`\n\n` +
  `| Assurance context | Open policy | Pilot policy |\n|---|---|---|\n` +
  causalMatrix.rows.map((row) => `| ${row.assurance} (${row.scenario_id}) | ${matrixCell(row.open_policy)} | ${matrixCell(row.pilot_policy)} |`).join('\n') +
  `\n\nThe L2 row is a declared counterfactual; observed evidence does not change.\n\n` +
  `## L2 multiplier sensitivity\n\n` +
  `| L2 multiplier | Admitted maximum | Binding rule |\n|---:|---:|---|\n` +
  sensitivity.map((item) => `| ${item.multiplier} | ${item.admitted_maximum} | ${(item.binding_constraints || []).join(', ')} |`).join('\n') +
  `\n\nThese multiplier values are research-policy assumptions, not empirical calibration.\n\n` +
  `## Assumption register\n\n` +
  `Registered: ${assumptionResults.length}; valid against executable policy objects: **${assumptionsValid ? 'PASS' : 'FAIL'}**.\n\n` +
  `## C3 / C4 readiness\n\n` +
  `- C3: **${c3c4.levels.C3.state}** — ${JSON.stringify(report.c3_c4_readiness.C3.counts)}\n` +
  `- C4: **${c3c4.levels.C4.state}** — ${JSON.stringify(report.c3_c4_readiness.C4.counts)}\n\n` +
  `Open lifecycle, independent reproduction, release-provenance, heterogeneous-source, comprehension, and practical-validation gates remain open.\n`;

await fs.rm(outDir, { recursive: true, force: true });
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, 'policy-lab-specialized-gauntlet.v1.json'), `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(path.join(outDir, 'policy-lab-specialized-gauntlet.v1.md'), markdown);

console.log(markdown);

if (!machinePassed) {
  throw new Error(`Policy Lab specialized Gauntlet machine challenges failed or were incomplete: ${machineResults.filter((item) => item.status !== 'PASS').map((item) => item.id).join(', ') || 'coverage mismatch'}`);
}
if (!assumptionsValid) {
  throw new Error(`Policy assumption register drift: ${assumptionResults.filter((item) => !item.matches || !item.class_allowed).map((item) => item.id).join(', ')}`);
}
if (!standardsDocumented) {
  throw new Error('standards differentiation document is missing');
}
