export const RESEARCH_CAPSULE_BUNDLE_SCHEMA: 'solarpunk.constraint.research_capsule_bundle.v1';
export const RESEARCH_CAPSULE_SCHEMA: 'solarpunk.constraint.research_capsule.v1';
export const REQUIRED_CAPSULE_FILES: readonly string[];

export interface ResearchCapsuleManifestFile {
  path: string;
  sha256: string;
  bytes: number;
}

export interface ResearchCapsuleManifest {
  schema: 'solarpunk.constraint.research_capsule.v1';
  case_id: string;
  policy: { id: string; version: string; manifest_hash: string };
  assurance_scenario: string;
  decision_id: string;
  source_revision: string;
  files: ResearchCapsuleManifestFile[];
  raw_evidence_included: boolean;
  data_boundary: string;
  capsule_id: string;
  [key: string]: unknown;
}

export interface ResearchCapsuleBundle {
  schema: 'solarpunk.constraint.research_capsule_bundle.v1';
  manifest: ResearchCapsuleManifest;
  files: Record<string, string>;
  [key: string]: unknown;
}

export interface CapsuleVerificationCheck {
  ok: boolean;
  code: string;
  message: string;
  [key: string]: unknown;
}

export interface CapsuleVerificationResult {
  ok: boolean;
  summary: {
    capsule_integrity: 'PASS' | 'FAIL';
    schema_validation: 'PASS' | 'FAIL';
    decision_reproduction: 'PASS' | 'FAIL' | 'NOT_RUN';
    source_truth_certification: 'NOT_CLAIMED';
    expected_decision_id: string | null;
    produced_decision_id: string | null;
  };
  checks: CapsuleVerificationCheck[];
  warnings: string[];
  reproduction: {
    status: 'PASS' | 'FAIL' | 'NOT_RUN';
    detail?: string;
    expected_decision_id?: string;
    produced_decision_id?: string;
  };
}

export interface CapsulePackReplay {
  casesById?: Record<string, Record<string, unknown>>;
  evidenceByHash: Record<string, Record<string, unknown>>;
  contextsById: Record<string, Record<string, unknown>>;
  scenariosById: Record<string, Record<string, unknown>>;
}

export function verifyResearchCapsuleBundle(
  bundle: ResearchCapsuleBundle,
  options?: { packReplay?: CapsulePackReplay },
): Promise<CapsuleVerificationResult>;
export function formatCapsuleVerificationReport(result: CapsuleVerificationResult): string;
