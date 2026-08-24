// Machine-observed public evidence checkpoint.
// Source: successful GitHub Actions run 31899863661, job 95048791757.
// This module intentionally records CI output rather than reconstructing state from Markdown.

export const PUBLIC_EVIDENCE_CHECKPOINT = Object.freeze({
  schema: 'solarpunk.policy_lab.public_evidence_checkpoint.v1',
  case_id: 'PUB-AUSGRID-001P',
  source: Object.freeze({
    publisher: 'Ausgrid',
    dataset: 'Solar Home Electricity Data',
    mirror_commit: 'ddb96f511059a410bfb3ea61c32e7def0d9c88f0',
    archive_sha256: '6949ffee7ef8e2260f229f8a7e3b992390187facaaf023bb933b811a11cd1a11',
    archive_bytes: 14973763,
    interval_count: 336,
    selected_window: Object.freeze(['2012-07-01', '2012-07-07']),
  }),
  evidence: Object.freeze({
    evidence_hash: 'ac0bc483f3da8d90c4b9281b46abdbc81177a9338525039bd0e346be12a1d93b',
    assurance: 'L0',
    total_eligible_surplus_kwh: 33.066,
    warning_count: 2,
  }),
  decisions: Object.freeze({
    pilot: Object.freeze({
      policy_id: 'ENERGY-CASE-PILOT-005',
      result: 'BLOCKED',
      decision_id: '96bc8edae69b3f27e6261ffcfb6f5a347b3b0a1a750abc81ec414e66b5a6e7d2',
      blocking_rules: Object.freeze(['SIGNED_EVIDENCE', 'MIN_PROVENANCE']),
    }),
    open: Object.freeze({
      policy_id: 'LAB-CASE-OPEN-004',
      result: 'ADMIT_WITH_LIMIT',
      decision_id: '913bde9848571e905873510ae2e11bd7b8ed4489d828e2605dca038dc3002a1a',
      admitted_maximum: 33.066,
      binding_constraints: Object.freeze(['EVIDENCE_BACKED_CAPACITY']),
    }),
  }),
  settlement: Object.freeze({
    declared_capacity_fraction: 0.4,
    result: 'PARTIAL',
    covered_quantity: 13.2264,
    shortfall_quantity: 19.8396,
  }),
  verification: Object.freeze({
    capsule_id: '79b0b87b7c1af8cb3ea243f19740bb6ef47694f97618e2fc5451d0e30c5c4256',
    integrity: 'PASS',
    schema_validation: 'PASS',
    decision_reproduction: 'PASS',
    assessment_id: '088067800c192a0d6854cc4a70f068f3590d4fc658df3622370bfcc7974e56dc',
  }),
  boundaries: Object.freeze({
    R1: 'NOT_ASSESSED',
    R2: 'PARTIAL',
    R3: 'PARTIAL',
    R4: 'UNTESTED',
  }),
  provenance: Object.freeze({
    workflow_run_id: 31899863661,
    job_id: 95048791757,
    artifact_id: 9250779743,
    evaluated_revision: 'adf268e43876a583692b6b69bc6efe6f1fe0e006',
    generated_at: '2026-08-15T18:00:05.747Z',
    artifact_digest: 'sha256:2d1b97313de42ea3fbe3ece12c7846f532ed88865472776a077ffd1ca5d03ef1',
  }),
  non_claims: Object.freeze([
    'source-holder confirmation',
    'physical meter certification',
    'legal issuance authority',
    'enforceable settlement or redemption',
    'production readiness',
    'monetary performance',
  ]),
});
