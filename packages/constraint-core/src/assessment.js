import { sha256Hex } from './stable.js';

export const CONSTRAINED_CLAIM_ASSESSMENT_SCHEMA = 'solarpunk.constraint.constrained_claim_assessment.v1';
export const RESEARCH_BOUNDARY_STATUSES = Object.freeze([
  'NOT_ASSESSED',
  'OPEN',
  'SUPPORTED',
  'BLOCKED',
  'PARTIAL',
  'UNTESTED',
]);

function requiredObject(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${field} is required`);
  }
  return value;
}

function requiredText(value, field) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(`${field} is required`);
  return text;
}

function status(value, field) {
  const text = requiredText(value, field);
  if (!RESEARCH_BOUNDARY_STATUSES.includes(text)) {
    throw new Error(`${field} must be one of ${RESEARCH_BOUNDARY_STATUSES.join(', ')}`);
  }
  return text;
}

function refs(values = []) {
  return [...new Set((Array.isArray(values) ? values : [values])
    .map((value) => String(value ?? '').trim())
    .filter(Boolean))].sort();
}

function explicitBoundaryOverride(value, field) {
  if (!value) return null;
  requiredObject(value, field);
  const normalized = {
    status: status(value.status, `${field}.status`),
    rationale: Array.isArray(value.rationale) ? value.rationale.map(String) : [],
    basis_refs: refs(value.basis_refs),
    next_evidence_required: Array.isArray(value.next_evidence_required)
      ? value.next_evidence_required.map(String)
      : [],
  };
  if (!['NOT_ASSESSED', 'OPEN', 'UNTESTED'].includes(normalized.status) && normalized.basis_refs.length === 0) {
    throw new Error(`${field}.basis_refs are required for ${normalized.status}`);
  }
  return normalized;
}

function evidenceStatus(evidence, provenance) {
  if (!evidence) {
    return {
      status: 'NOT_ASSESSED',
      rationale: ['No claim-level evidence envelope was supplied to the assessment builder.'],
      basis_refs: [],
      next_evidence_required: ['Provide a claim-specific EvidenceEnvelope with explicit source and measurement semantics.'],
    };
  }
  const blockers = Number(evidence.summary?.blocker_count || 0);
  const warnings = Number(evidence.summary?.warning_count || 0);
  const evidenceHash = requiredText(evidence.evidence_hash, 'evidence.evidence_hash');
  const provenanceLevel = provenance?.level ? String(provenance.level) : null;
  if (blockers > 0) {
    return {
      status: 'BLOCKED',
      rationale: [
        `The evidence envelope contains ${blockers} blocking diagnostic${blockers === 1 ? '' : 's'}.`,
        'A blocked evidence result is preserved rather than promoted by later policy or settlement artifacts.',
      ],
      basis_refs: refs([evidenceHash, provenanceLevel ? `assurance:${provenanceLevel}` : null]),
      next_evidence_required: ['Resolve the blocking evidence diagnostics without changing the source meaning.'],
    };
  }

  const trustedOperator = Boolean(provenance?.trusted_operator_context);
  const sourceHolderConfirmed = Boolean(evidence.source?.source_holder_confirmed || evidence.source?.owner_confirmed);
  const supported = trustedOperator && sourceHolderConfirmed;
  return {
    status: supported ? 'SUPPORTED' : 'PARTIAL',
    rationale: [
      `The evidence envelope is internally admissible with zero blocking diagnostics${warnings ? ` and ${warnings} declared warning${warnings === 1 ? '' : 's'}` : ''}.`,
      supported
        ? 'A trusted operator context and source-holder confirmation are present for this bounded claim-level evidence object.'
        : 'The available runtime artifacts do not establish trusted source-holder/operator attribution strongly enough to mark Boundary 2 fully supported.',
      'Source-assurance L0–L4 is recorded as basis information only; it is not converted into a research-boundary score.',
    ],
    basis_refs: refs([evidenceHash, provenanceLevel ? `assurance:${provenanceLevel}` : null]),
    next_evidence_required: supported
      ? ['Preserve claim-specific source attribution and semantics for each new measurement window.']
      : ['Add independently checkable source-holder/operator attribution or authentication for the exact evidence object/window.'],
  };
}

function runtimeDecisionRefs(decisions = {}) {
  return refs(Object.entries(decisions)
    .map(([name, value]) => value?.decision_id ? `decision:${name}:${value.decision_id}` : null));
}

async function settlementRef(settlement) {
  if (!settlement) return null;
  return `settlement:sha256:${await sha256Hex(settlement)}`;
}

function bindingConstraintStatus(decisions, settlement, overrides = {}) {
  const decisionValues = Object.values(decisions || {}).filter((value) => value?.decision_id);
  if (decisionValues.length === 0) {
    return {
      status: 'NOT_ASSESSED',
      components: {
        issuance: { status: 'NOT_ASSESSED', basis_refs: [], rationale: ['No policy DecisionResult was supplied.'] },
        pricing: { status: 'NOT_ASSESSED', basis_refs: [], rationale: ['No pricing evidence was supplied.'] },
        settlement: { status: 'NOT_ASSESSED', basis_refs: [], rationale: ['No settlement artifact was supplied.'] },
        governance: { status: 'NOT_ASSESSED', basis_refs: [], rationale: ['No governance evidence was supplied.'] },
      },
      rationale: ['No Boundary-3 runtime decision artifacts were supplied.'],
      basis_refs: [],
      next_evidence_required: ['Supply a versioned policy DecisionResult before assessing binding constraint behavior.'],
    };
  }

  const decisionRefs = runtimeDecisionRefs(decisions);
  const issuance = {
    status: 'SUPPORTED',
    basis_refs: decisionRefs,
    rationale: [
      'At least one versioned deterministic policy DecisionResult exists for the bounded case.',
      'SUPPORTED here means the rule-bound issuance/admission mechanism is evidenced; it does not mean the policy is economically optimal or legally authoritative.',
    ],
  };

  const pricing = explicitBoundaryOverride(overrides.pricing, 'research_overrides.r3.pricing') || {
    status: 'OPEN',
    basis_refs: [],
    rationale: ['The case runtime does not establish resource-appropriate uncertainty pricing from the supplied decision artifacts.'],
    next_evidence_required: ['Provide a separately justified resource-risk/pricing artifact if pricing is to advance beyond OPEN.'],
  };

  const settlementComponent = settlement ? {
    status: 'PARTIAL',
    basis_refs: [],
    rationale: [
      'A deterministic settlement/shortfall scenario is present.',
      'Scenario replay demonstrates accounting mechanics only; it does not establish enforceable delivery, reserve custody, or legal redemption.',
    ],
    next_evidence_required: ['Provide real enforceable delivery/custody evidence if settlement is to advance beyond a modeled mechanism.'],
  } : {
    status: 'OPEN',
    basis_refs: [],
    rationale: ['No settlement result was supplied for an admitted quantity.'],
    next_evidence_required: ['Run a declared settlement/shortfall scenario for admitted quantity, or preserve why settlement is inapplicable.'],
  };

  const governance = explicitBoundaryOverride(overrides.governance, 'research_overrides.r3.governance') || {
    status: 'NOT_ASSESSED',
    basis_refs: [],
    rationale: ['The case artifacts do not demonstrate bounded governance.'],
    next_evidence_required: ['Provide evidence of authority limits, change control, dispute/correction procedures, and governance constraints.'],
  };

  return {
    status: 'PARTIAL',
    components: { issuance, pricing, settlement: settlementComponent, governance },
    rationale: [
      'Boundary 3 is necessarily PARTIAL because rule-bound issuance is represented while pricing, settlement enforceability, and/or bounded governance remain open or only mechanically demonstrated.',
    ],
    basis_refs: decisionRefs,
    next_evidence_required: [
      'Justify resource-appropriate uncertainty pricing.',
      'Demonstrate settlement/delivery enforceability beyond scenario replay.',
      'Demonstrate bounded governance and correction authority.',
    ],
  };
}

export async function buildConstrainedClaimAssessment({
  caseManifest,
  evidence = null,
  provenance = null,
  decisions = {},
  settlement = null,
  receipt = null,
  capsule = null,
  capsuleVerification = null,
  research_overrides = {},
}) {
  requiredObject(caseManifest, 'caseManifest');
  const caseId = requiredText(caseManifest.case_id, 'caseManifest.case_id');
  const subject = requiredText(caseManifest.subject || caseId, 'caseManifest.subject');

  const r1 = explicitBoundaryOverride(research_overrides.r1, 'research_overrides.r1') || {
    status: 'NOT_ASSESSED',
    rationale: [
      'This case runtime evaluates a bounded claim-evidence object, not whether an energy-adjacent series is economically informative for a defined economy/sector purpose.',
    ],
    basis_refs: [],
    next_evidence_required: ['Attach a separately scoped Boundary-1 empirical/admissibility result for a defined economic-information purpose.'],
  };
  const r2 = evidenceStatus(evidence, provenance);
  const r3 = bindingConstraintStatus(decisions, settlement, research_overrides.r3 || {});
  const r4 = explicitBoundaryOverride(research_overrides.r4, 'research_overrides.r4') || {
    status: 'UNTESTED',
    rationale: [
      'No circulation, liquidity, general acceptability, medium-of-exchange, or unit-of-account evidence is evaluated by this case runtime.',
    ],
    basis_refs: [],
    next_evidence_required: ['Provide real monetary-performance evidence before advancing Boundary 4.'],
  };

  const settlementHashRef = await settlementRef(settlement);
  if (settlementHashRef && r3.components?.settlement) {
    r3.components.settlement.basis_refs = refs([...(r3.components.settlement.basis_refs || []), settlementHashRef]);
    r3.basis_refs = refs([...(r3.basis_refs || []), settlementHashRef]);
  }

  const capsuleId = capsule?.manifest?.capsule_id || capsule?.capsule_id || null;
  const verificationOk = capsuleVerification?.ok === true;
  const basis_refs = {
    case: [`case:${caseId}`],
    evidence: refs(evidence?.evidence_hash ? [`evidence:${evidence.evidence_hash}`] : []),
    decisions: runtimeDecisionRefs(decisions),
    settlement: refs(settlementHashRef),
    receipt: refs(receipt?.decision_id ? [`receipt:decision:${receipt.decision_id}`] : []),
    capsule: refs(capsuleId ? [`capsule:${capsuleId}`] : []),
    verification: verificationOk ? ['capsule-verification:PASS'] : refs(capsuleVerification ? ['capsule-verification:NOT_PASS'] : []),
  };

  const body = {
    schema: CONSTRAINED_CLAIM_ASSESSMENT_SCHEMA,
    subject: { case_id: caseId, label: subject },
    research_boundaries: {
      R1: { id: 'R1', name: 'economic_information', ...r1 },
      R2: { id: 'R2', name: 'claim_level_evidence', ...r2 },
      R3: { id: 'R3', name: 'binding_constraint', ...r3 },
      R4: { id: 'R4', name: 'monetary_performance', ...r4 },
    },
    basis_refs,
    explicit_non_claims: [
      'The assessment does not certify physical source truth.',
      'The assessment does not convert L0–L4 assurance into a research-boundary score.',
      'A deterministic policy decision does not establish economically optimal issuance rules or legal issuance authority.',
      'A settlement replay does not establish enforceable delivery, reserve custody, or legal redemption.',
      'A constrained financial claim is not money without separate Boundary-4 evidence.',
      ...(Array.isArray(caseManifest.boundaries) ? caseManifest.boundaries.map(String) : []),
    ],
    next_evidence_required: {
      R1: r1.next_evidence_required || [],
      R2: r2.next_evidence_required || [],
      R3: r3.next_evidence_required || [],
      R4: r4.next_evidence_required || [],
    },
  };

  return {
    ...body,
    assessment_id: await sha256Hex(body),
  };
}
