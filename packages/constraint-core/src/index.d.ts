export type DiagnosticStatus = 'PASS' | 'WARNING' | 'BLOCK';
export type ProvenanceLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
export type PolicyDecisionStatus = 'ADMIT_WITH_LIMIT' | 'BLOCKED';
export type ClaimState =
  | 'RAW'
  | 'NORMALIZED'
  | 'VERIFIED'
  | 'ADMITTED'
  | 'ISSUABLE'
  | 'ISSUED'
  | 'ACTIVE'
  | 'SETTLEMENT_DUE'
  | 'SETTLED'
  | 'PARTIAL'
  | 'SHORTFALL'
  | 'DISPUTED'
  | 'REVOKED'
  | 'EXPIRED'
  | 'BLOCKED';

export interface Diagnostic {
  code: string;
  status: DiagnosticStatus;
  detail: string;
  [key: string]: unknown;
}

export interface CanonicalInterval {
  meter_id: string | null;
  site_id: string | null;
  window_start: string;
  window_end: string;
  generation_kwh: number | null;
  site_load_kwh: number | null;
  export_kwh: number | null;
  curtailed_kwh: number | null;
  cumulative_kwh?: number | null;
  quality_score: number | null;
  source: string;
  source_kind?: string;
  eligible_surplus_kwh: number;
  surplus_basis: string;
  surplus_basis_ok?: boolean;
  record_hash?: string;
  attestor?: string;
  [key: string]: unknown;
}

export interface EvidenceSummary {
  interval_count: number;
  total_eligible_surplus_kwh: number;
  blocker_count: number;
  warning_count: number;
  rejected_input_records?: number;
}

export interface EvidenceEnvelope {
  schema: 'solarpunk.constraint.evidence_envelope.v1';
  adapter: { id: string; version: string };
  source: Record<string, unknown>;
  intervals: CanonicalInterval[];
  diagnostics?: Diagnostic[];
  capabilities: Record<string, boolean>;
  summary: EvidenceSummary;
  evidence_hash: string;
  hash_algorithm: 'SHA-256';
}

export interface NormalizedEvidence {
  schema: 'solarpunk.constraint.normalized_evidence.v1';
  adapter: { id: string; version: string };
  source: Record<string, unknown>;
  intervals: CanonicalInterval[];
  diagnostics: Diagnostic[];
  capabilities: Record<string, boolean>;
  summary: EvidenceSummary;
}

export interface ProvenanceDecision {
  schema: 'solarpunk.constraint.provenance_decision.v1';
  level: ProvenanceLevel;
  rank: number;
  label: string;
  stage: string;
  default_haircut_pct: number;
  default_cap_kwh_day: number;
  closed_pilot_candidate: boolean;
  paid_launch_hardware_candidate: boolean;
  cryptographically_verified: boolean;
  trusted_operator_context: boolean;
  reasons: string[];
  missing_for_next_level: string[];
  explicit_boundary: string;
}

export interface PolicyDefinition {
  id: string;
  version: string;
  name: string;
  description: string;
  min_provenance_level: ProvenanceLevel;
  admission: {
    require_positive_surplus: boolean;
    require_zero_blockers: boolean;
    require_signed_evidence: boolean;
    require_external_corroboration: boolean;
  };
  issuance: {
    unit: string;
    decimals: number;
    rate_per_surplus_kwh: number;
    haircut_pct: number;
    absolute_cap: number;
  };
  settlement: {
    explicit_capacity_required: boolean;
    legal_redemption_not_implied: boolean;
  };
  governance: {
    authority: string | null;
    mutable_by: string | null;
  };
}

export interface PolicyManifest extends PolicyDefinition {
  schema: 'solarpunk.constraint.policy_manifest.v1';
}

export interface PolicyDecision {
  schema: 'solarpunk.constraint.policy_decision.v1';
  policy_id: string;
  policy_version: string;
  policy_name: string;
  policy_manifest: PolicyManifest;
  decision: PolicyDecisionStatus;
  admitted: boolean;
  evidence_hash: string | null;
  provenance_level: ProvenanceLevel;
  input_surplus_kwh: number;
  issuance_unit: string;
  issuance_decimals: number;
  issuance_rate_per_surplus_kwh: number;
  haircut_pct: number;
  gross_claim_quantity: number;
  risk_adjusted_claim_quantity: number;
  maximum_claim_quantity: number;
  blockers: string[];
  warnings: string[];
  rejected_input_records: number;
  settlement_capacity_required: boolean;
  governance_authority: string | null;
}

export interface ClaimHistoryEvent {
  sequence: number;
  from: string;
  to: ClaimState;
  reason: string | null;
  actor: string;
}

export interface ClaimManifest {
  schema: 'solarpunk.constraint.claim_manifest.v1';
  claim_id: string;
  subject: string;
  evidence_hash: string;
  policy_id: string;
  policy_version: string;
  policy_manifest_hash: string;
  provenance_level: ProvenanceLevel;
  quantity: number;
  quantity_base_units: string;
  quantity_decimals: number;
  unit: string;
  decision: PolicyDecisionStatus;
  state: ClaimState;
  blockers: string[];
  warnings: string[];
  settlement_capacity_required: boolean;
  history: ClaimHistoryEvent[];
  issued_quantity?: number;
  issued_quantity_base_units?: string;
}

export interface SettlementResult {
  schema: 'solarpunk.constraint.settlement_result.v1';
  claim_id: string;
  unit: string;
  quantity_decimals: number;
  outstanding_claim_quantity: number;
  outstanding_claim_base_units: string;
  settlement_capacity: number;
  settlement_capacity_base_units: string;
  covered_quantity: number;
  covered_base_units: string;
  shortfall_quantity: number;
  shortfall_base_units: string;
  result: 'SETTLED' | 'PARTIAL' | 'SHORTFALL';
  constraint_status: {
    data: 'PASS' | 'BLOCKED';
    issuance: 'PASS' | 'BLOCKED';
    risk: 'PASS' | 'WARNING';
    settlement: 'PASS' | 'BLOCKED';
    governance: 'PASS';
  };
  boundary: string;
}

export interface ProvenanceContext {
  sample_fixture?: boolean;
  cryptographically_verified?: boolean;
  trusted_operator_context?: boolean;
  real_operator_source?: boolean;
  operator_signed?: boolean;
  signed?: boolean;
  live_gateway?: boolean;
  revenue_grade?: boolean;
  gateway_custody?: boolean;
  external_corroboration?: boolean;
}

export const BUILTIN_POLICIES: PolicyDefinition[];
export const CLAIM_STATES: ClaimState[];
export const PROVENANCE_LEVELS: Array<Record<string, unknown>>;
export const GENERIC_FIELD_ALIASES: Record<string, string[]>;

export function stableStringify(value: unknown): string;
export function sha256Hex(value: unknown): Promise<string>;
export function canonicalTimestamp(value: unknown, field?: string): string;
export function parseCsv(text: string): { headers: string[]; rows: Array<Record<string, string>> };
export function autoMapColumns(headers: string[], aliases?: Record<string, string[]>): Record<string, string>;

export function normalizeGenericCsv(csvText: string, mapping?: Record<string, string> | null): NormalizedEvidence;
export function normalizeGreenButtonCsv(csvText: string): NormalizedEvidence;
export function normalizeCumulativePair(startRaw: Record<string, unknown>, endRaw: Record<string, unknown>, options?: Record<string, unknown>): NormalizedEvidence;
export function normalizeFroniusPair(startRaw: Record<string, unknown>, endRaw: Record<string, unknown>, options?: Record<string, unknown>): NormalizedEvidence;
export function buildEvidenceEnvelope(normalized: NormalizedEvidence, meta?: Record<string, unknown>): Promise<EvidenceEnvelope>;

export function inspectSignedEvidence(payload: Record<string, unknown>, registry: Record<string, unknown>, options?: Record<string, unknown>): Promise<Record<string, any>>;
export function attestationInspectionAsEvidence(inspection: Record<string, any>): EvidenceEnvelope;

export function provenanceById(id: ProvenanceLevel | string): Record<string, any>;
export function provenanceRank(id: ProvenanceLevel | string): number;
export function classifyProvenance(evidence: EvidenceEnvelope | NormalizedEvidence, context?: ProvenanceContext): ProvenanceDecision;

export function policyById(id: string): PolicyDefinition | null;
export function policyManifestBody(policy: PolicyDefinition | PolicyManifest | Record<string, any>): PolicyManifest;
export function hashPolicyManifest(policy: PolicyDefinition | PolicyManifest | Record<string, any>): Promise<string>;
export function policyVersionCode(version: string): number;
export function evaluatePolicy(args: { evidence: EvidenceEnvelope; provenance: ProvenanceDecision; policy: PolicyDefinition | PolicyManifest }): PolicyDecision;
export function comparePolicies(args: { evidence: EvidenceEnvelope; provenance: ProvenanceDecision; policies?: Array<PolicyDefinition | PolicyManifest> }): PolicyDecision[];

export function quantityToBaseUnits(value: string | number, decimals?: number): bigint;
export function baseUnitsToQuantityString(value: string | number | bigint, decimals?: number): string;
export function canTransition(from: ClaimState, to: ClaimState): boolean;
export function transitionClaim(claim: ClaimManifest, to: ClaimState, event?: { reason?: string; actor?: string }): ClaimManifest;
export function createClaimManifest(args: { evidence: EvidenceEnvelope; provenance: ProvenanceDecision; policyDecision: PolicyDecision; subject?: string }): Promise<ClaimManifest>;
export function makeIssuedClaim(claim: ClaimManifest, amount?: number | null): ClaimManifest;
export function evaluateSettlement(args: { claim: ClaimManifest; settlement_capacity: number }): SettlementResult;
export function applySettlementResult(claim: ClaimManifest, settlementResult: SettlementResult): ClaimManifest;
