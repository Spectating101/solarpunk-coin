export type OperatorSourceKind =
  | 'inverter_export'
  | 'meter_export'
  | 'utility_export'
  | 'gateway_api_snapshot'
  | 'operator_csv'
  | 'other';

export type CustodianRelationship =
  | 'owner'
  | 'operator'
  | 'authorized_researcher'
  | 'data_processor'
  | 'unknown';

export type ContactDisclosure = 'public' | 'private' | 'not_provided';
export type AcquisitionMethod =
  | 'owner_export'
  | 'operator_export'
  | 'api_snapshot'
  | 'utility_download'
  | 'research_transfer'
  | 'other';
export type PermissionScope =
  | 'private_validation'
  | 'public_metadata_only'
  | 'public_anonymized_aggregate'
  | 'public_raw';

export interface OperatorSourceManifest {
  schema: 'solarpunk.operator_source_manifest.v1';
  source_id: string;
  source_kind: OperatorSourceKind;
  synthetic_fixture: boolean;
  custodian: {
    relationship: CustodianRelationship;
    identifier: string;
    contact_disclosure: ContactDisclosure;
  };
  acquisition: {
    method: AcquisitionMethod;
    acquired_at: string;
    custody_statement: string;
    permission_scope: PermissionScope;
  };
  measurement: {
    window_start: string;
    window_end: string;
    timezone: string;
    sign_convention: {
      generation: string;
      site_load: string;
      export: string;
      curtailed: string | null;
    };
  };
  device: {
    manufacturer: string | null;
    model: string | null;
    serial_hash: string | null;
    capacity_kw: number | null;
    accuracy_basis: string | null;
  };
  assertions: {
    source_owner_confirmed: boolean;
    live_api: boolean;
    revenue_grade: boolean;
    utility_corroborated: boolean;
    device_signature_present: boolean;
  };
  artifacts: {
    source_signature_file: string | null;
    device_registry_file: string | null;
    utility_corroboration_file: string | null;
    api_snapshot_receipt_file: string | null;
  };
  boundaries: string[];
}

export interface OperatorSourceReceipt {
  schema: 'solarpunk.operator_source_receipt.v1';
  generated_at: string;
  source_id: string;
  source_file: {
    filename: string;
    sha256: string;
    bytes: number;
    raw_included: false;
  };
  manifest: {
    sha256: string;
    source_kind: OperatorSourceKind;
    synthetic_fixture: boolean;
    measurement_window: { start: string; end: string };
  };
  custody: {
    relationship: CustodianRelationship;
    identifier: string;
    contact_disclosure: ContactDisclosure;
    acquisition_method: AcquisitionMethod;
    custody_statement: string;
    permission_scope: PermissionScope;
  };
  declared_assertions: OperatorSourceManifest['assertions'];
  referenced_artifacts: OperatorSourceManifest['artifacts'];
  verification: {
    source_signature_verified: false;
    device_registry_verified: false;
    utility_corroboration_verified: false;
    api_identity_verified: false;
    source_truth_certification: 'NOT_CLAIMED';
  };
  v2_admission: {
    default_assurance_scenario: 'PROVENANCE-L0-BASE';
    automatic_promotion_allowed: false;
    promotion_requirements: string[];
  };
  publication: {
    public_receipt_allowed: boolean;
    public_aggregates_allowed: boolean;
    public_raw_allowed: boolean;
  };
  boundaries: string[];
  receipt_id: string;
}

export interface OperatorSourceReceiptVerification {
  ok: boolean;
  checks: Array<{
    code: string;
    ok: boolean;
    expected?: string;
    produced?: string;
  }>;
  source_hash: string;
  manifest_hash: string;
  produced_receipt_id: string;
  canonical_manifest: OperatorSourceManifest;
}

export const OPERATOR_SOURCE_MANIFEST_SCHEMA: 'solarpunk.operator_source_manifest.v1';
export const OPERATOR_SOURCE_RECEIPT_SCHEMA: 'solarpunk.operator_source_receipt.v1';

export function canonicalOperatorSourceManifest(manifest: OperatorSourceManifest | Record<string, unknown>): OperatorSourceManifest;
export function buildOperatorSourceReceipt(args: {
  sourceText: string;
  filename: string;
  manifest: OperatorSourceManifest | Record<string, unknown>;
  generatedAt: string;
}): Promise<OperatorSourceReceipt>;
export function verifyOperatorSourceReceipt(args: {
  receipt: OperatorSourceReceipt;
  sourceText: string;
  manifest: OperatorSourceManifest | Record<string, unknown>;
}): Promise<OperatorSourceReceiptVerification>;
export function formatOperatorSourceReceipt(receipt: OperatorSourceReceipt): string;
export function operatorSourceManifestHashInput(manifest: OperatorSourceManifest | Record<string, unknown>): string;
