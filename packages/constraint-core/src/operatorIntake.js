import { canonicalTimestamp, numeric, sha256Hex, stableStringify } from './stable.js';

export const OPERATOR_SOURCE_MANIFEST_SCHEMA = 'solarpunk.operator_source_manifest.v1';
export const OPERATOR_SOURCE_RECEIPT_SCHEMA = 'solarpunk.operator_source_receipt.v1';

const SOURCE_KINDS = new Set([
  'inverter_export',
  'meter_export',
  'utility_export',
  'gateway_api_snapshot',
  'operator_csv',
  'other',
]);

const CUSTODIAN_RELATIONSHIPS = new Set([
  'owner',
  'operator',
  'authorized_researcher',
  'data_processor',
  'unknown',
]);

const DISCLOSURE_LEVELS = new Set(['public', 'private', 'not_provided']);
const ACQUISITION_METHODS = new Set([
  'owner_export',
  'operator_export',
  'api_snapshot',
  'utility_download',
  'research_transfer',
  'other',
]);
const PERMISSION_SCOPES = new Set([
  'private_validation',
  'public_metadata_only',
  'public_anonymized_aggregate',
  'public_raw',
]);

function requiredString(value, field) {
  const normalized = String(value ?? '').trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

function optionalString(value) {
  const normalized = String(value ?? '').trim();
  return normalized || null;
}

function enumValue(value, allowed, field) {
  const normalized = requiredString(value, field);
  if (!allowed.has(normalized)) {
    throw new Error(`${field} must be one of: ${[...allowed].join(', ')}`);
  }
  return normalized;
}

function booleanValue(value, field) {
  if (typeof value !== 'boolean') throw new Error(`${field} must be boolean`);
  return value;
}

function canonicalBoundaries(boundaries) {
  if (boundaries == null) return [];
  if (!Array.isArray(boundaries)) throw new Error('boundaries must be an array');
  return boundaries.map((item, index) => requiredString(item, `boundaries[${index}]`));
}

function canonicalArtifacts(artifacts = {}) {
  if (!artifacts || typeof artifacts !== 'object' || Array.isArray(artifacts)) {
    throw new Error('artifacts must be an object');
  }
  return {
    source_signature_file: optionalString(artifacts.source_signature_file),
    device_registry_file: optionalString(artifacts.device_registry_file),
    utility_corroboration_file: optionalString(artifacts.utility_corroboration_file),
    api_snapshot_receipt_file: optionalString(artifacts.api_snapshot_receipt_file),
  };
}

function canonicalAssertions(assertions = {}) {
  if (!assertions || typeof assertions !== 'object' || Array.isArray(assertions)) {
    throw new Error('assertions must be an object');
  }
  return {
    source_owner_confirmed: booleanValue(assertions.source_owner_confirmed ?? false, 'assertions.source_owner_confirmed'),
    live_api: booleanValue(assertions.live_api ?? false, 'assertions.live_api'),
    revenue_grade: booleanValue(assertions.revenue_grade ?? false, 'assertions.revenue_grade'),
    utility_corroborated: booleanValue(assertions.utility_corroborated ?? false, 'assertions.utility_corroborated'),
    device_signature_present: booleanValue(assertions.device_signature_present ?? false, 'assertions.device_signature_present'),
  };
}

function canonicalDevice(device = {}) {
  if (!device || typeof device !== 'object' || Array.isArray(device)) {
    throw new Error('device must be an object');
  }
  const capacity = device.capacity_kw == null ? null : numeric(device.capacity_kw, 'device.capacity_kw');
  if (capacity != null && capacity <= 0) throw new Error('device.capacity_kw must be greater than zero');
  return {
    manufacturer: optionalString(device.manufacturer),
    model: optionalString(device.model),
    serial_hash: optionalString(device.serial_hash),
    capacity_kw: capacity,
    accuracy_basis: optionalString(device.accuracy_basis),
  };
}

function canonicalSignConvention(signConvention) {
  if (!signConvention || typeof signConvention !== 'object' || Array.isArray(signConvention)) {
    throw new Error('measurement.sign_convention is required');
  }
  return {
    generation: requiredString(signConvention.generation, 'measurement.sign_convention.generation'),
    site_load: requiredString(signConvention.site_load, 'measurement.sign_convention.site_load'),
    export: requiredString(signConvention.export, 'measurement.sign_convention.export'),
    curtailed: optionalString(signConvention.curtailed),
  };
}

export function canonicalOperatorSourceManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    throw new Error('operator source manifest must be an object');
  }
  if (manifest.schema !== OPERATOR_SOURCE_MANIFEST_SCHEMA) {
    throw new Error(`manifest.schema must be ${OPERATOR_SOURCE_MANIFEST_SCHEMA}`);
  }

  const acquiredAt = canonicalTimestamp(manifest.acquisition?.acquired_at, 'acquisition.acquired_at');
  const windowStart = canonicalTimestamp(manifest.measurement?.window_start, 'measurement.window_start');
  const windowEnd = canonicalTimestamp(manifest.measurement?.window_end, 'measurement.window_end');
  if (Date.parse(windowStart) >= Date.parse(windowEnd)) {
    throw new Error('measurement.window_start must be before measurement.window_end');
  }

  const relationship = enumValue(
    manifest.custodian?.relationship,
    CUSTODIAN_RELATIONSHIPS,
    'custodian.relationship',
  );
  const syntheticFixture = booleanValue(manifest.synthetic_fixture ?? false, 'synthetic_fixture');
  if (!syntheticFixture && relationship === 'unknown') {
    throw new Error('non-synthetic sources require a declared custodian relationship');
  }

  const custodyStatement = requiredString(
    manifest.acquisition?.custody_statement,
    'acquisition.custody_statement',
  );
  if (custodyStatement.length < 20) {
    throw new Error('acquisition.custody_statement must describe the transfer or acquisition path');
  }

  return {
    schema: OPERATOR_SOURCE_MANIFEST_SCHEMA,
    source_id: requiredString(manifest.source_id, 'source_id'),
    source_kind: enumValue(manifest.source_kind, SOURCE_KINDS, 'source_kind'),
    synthetic_fixture: syntheticFixture,
    custodian: {
      relationship,
      identifier: requiredString(manifest.custodian?.identifier, 'custodian.identifier'),
      contact_disclosure: enumValue(
        manifest.custodian?.contact_disclosure,
        DISCLOSURE_LEVELS,
        'custodian.contact_disclosure',
      ),
    },
    acquisition: {
      method: enumValue(manifest.acquisition?.method, ACQUISITION_METHODS, 'acquisition.method'),
      acquired_at: acquiredAt,
      custody_statement: custodyStatement,
      permission_scope: enumValue(
        manifest.acquisition?.permission_scope,
        PERMISSION_SCOPES,
        'acquisition.permission_scope',
      ),
    },
    measurement: {
      window_start: windowStart,
      window_end: windowEnd,
      timezone: requiredString(manifest.measurement?.timezone, 'measurement.timezone'),
      sign_convention: canonicalSignConvention(manifest.measurement?.sign_convention),
    },
    device: canonicalDevice(manifest.device),
    assertions: canonicalAssertions(manifest.assertions),
    artifacts: canonicalArtifacts(manifest.artifacts),
    boundaries: canonicalBoundaries(manifest.boundaries),
  };
}

function publicationPolicy(permissionScope) {
  const policies = {
    private_validation: {
      public_receipt_allowed: false,
      public_aggregates_allowed: false,
      public_raw_allowed: false,
    },
    public_metadata_only: {
      public_receipt_allowed: true,
      public_aggregates_allowed: false,
      public_raw_allowed: false,
    },
    public_anonymized_aggregate: {
      public_receipt_allowed: true,
      public_aggregates_allowed: true,
      public_raw_allowed: false,
    },
    public_raw: {
      public_receipt_allowed: true,
      public_aggregates_allowed: true,
      public_raw_allowed: true,
    },
  };
  return policies[permissionScope];
}

function promotionRequirements(manifest) {
  const requirements = [
    'Normalize the source through a registered adapter while preserving this source-file hash.',
    'Keep the V2 assurance scenario at PROVENANCE-L0-BASE until referenced artifacts are independently verified.',
  ];

  if (manifest.assertions.device_signature_present) {
    requirements.push('Verify the source signature against a custody-documented device registry; a filename declaration alone is insufficient.');
  } else {
    requirements.push('Obtain a verifiable operator/device signature or retain L0 assurance.');
  }
  if (manifest.assertions.live_api) {
    requirements.push('Verify API endpoint identity and bind an immutable snapshot receipt to the measurement window.');
  }
  if (manifest.assertions.revenue_grade) {
    requirements.push('Verify the declared revenue-grade accuracy basis and device identity.');
  }
  if (manifest.assertions.utility_corroborated) {
    requirements.push('Verify the utility corroboration artifact against the same site identity and measurement window.');
  }
  if (!manifest.assertions.source_owner_confirmed) {
    requirements.push('Obtain owner/operator confirmation of source custody before treating the source as externally supplied.');
  }
  return requirements;
}

function safeFilename(filename) {
  const normalized = requiredString(filename, 'filename').replaceAll('\\', '/');
  return normalized.split('/').pop();
}

function receiptBody(receipt) {
  const { receipt_id: ignored, ...body } = receipt;
  return body;
}

export async function buildOperatorSourceReceipt({
  sourceText,
  filename,
  manifest,
  generatedAt,
}) {
  if (typeof sourceText !== 'string') throw new Error('sourceText must be a string');
  const canonicalManifest = canonicalOperatorSourceManifest(manifest);
  const generated = canonicalTimestamp(generatedAt, 'generatedAt');
  const sourceHash = await sha256Hex(sourceText);
  const manifestHash = await sha256Hex(canonicalManifest);
  const publication = publicationPolicy(canonicalManifest.acquisition.permission_scope);

  const body = {
    schema: OPERATOR_SOURCE_RECEIPT_SCHEMA,
    generated_at: generated,
    source_id: canonicalManifest.source_id,
    source_file: {
      filename: safeFilename(filename),
      sha256: sourceHash,
      bytes: new TextEncoder().encode(sourceText).byteLength,
      raw_included: false,
    },
    manifest: {
      sha256: manifestHash,
      source_kind: canonicalManifest.source_kind,
      synthetic_fixture: canonicalManifest.synthetic_fixture,
      measurement_window: {
        start: canonicalManifest.measurement.window_start,
        end: canonicalManifest.measurement.window_end,
      },
    },
    custody: {
      relationship: canonicalManifest.custodian.relationship,
      identifier: canonicalManifest.custodian.identifier,
      contact_disclosure: canonicalManifest.custodian.contact_disclosure,
      acquisition_method: canonicalManifest.acquisition.method,
      custody_statement: canonicalManifest.acquisition.custody_statement,
      permission_scope: canonicalManifest.acquisition.permission_scope,
    },
    declared_assertions: canonicalManifest.assertions,
    referenced_artifacts: canonicalManifest.artifacts,
    verification: {
      source_signature_verified: false,
      device_registry_verified: false,
      utility_corroboration_verified: false,
      api_identity_verified: false,
      source_truth_certification: 'NOT_CLAIMED',
    },
    v2_admission: {
      default_assurance_scenario: 'PROVENANCE-L0-BASE',
      automatic_promotion_allowed: false,
      promotion_requirements: promotionRequirements(canonicalManifest),
    },
    publication,
    boundaries: [
      'This receipt establishes file identity and declared custody metadata, not physical source truth.',
      'No assurance level above L0 is granted from self-authored manifest fields.',
      'Raw source bytes are excluded from the receipt.',
      ...canonicalManifest.boundaries,
    ],
  };

  return {
    ...body,
    receipt_id: await sha256Hex(body),
  };
}

export async function verifyOperatorSourceReceipt({ receipt, sourceText, manifest }) {
  const checks = [];
  const canonicalManifest = canonicalOperatorSourceManifest(manifest);
  const sourceHash = await sha256Hex(sourceText);
  const manifestHash = await sha256Hex(canonicalManifest);
  const producedReceiptId = await sha256Hex(receiptBody(receipt));

  checks.push({
    code: 'receipt_schema',
    ok: receipt?.schema === OPERATOR_SOURCE_RECEIPT_SCHEMA,
  });
  checks.push({
    code: 'source_hash',
    ok: receipt?.source_file?.sha256 === sourceHash,
    expected: receipt?.source_file?.sha256,
    produced: sourceHash,
  });
  checks.push({
    code: 'manifest_hash',
    ok: receipt?.manifest?.sha256 === manifestHash,
    expected: receipt?.manifest?.sha256,
    produced: manifestHash,
  });
  checks.push({
    code: 'receipt_identity',
    ok: receipt?.receipt_id === producedReceiptId,
    expected: receipt?.receipt_id,
    produced: producedReceiptId,
  });
  checks.push({
    code: 'privacy_boundary',
    ok: receipt?.source_file?.raw_included === false,
  });
  checks.push({
    code: 'no_automatic_promotion',
    ok: receipt?.v2_admission?.default_assurance_scenario === 'PROVENANCE-L0-BASE'
      && receipt?.v2_admission?.automatic_promotion_allowed === false,
  });
  checks.push({
    code: 'source_truth_boundary',
    ok: receipt?.verification?.source_truth_certification === 'NOT_CLAIMED',
  });

  return {
    ok: checks.every((item) => item.ok),
    checks,
    source_hash: sourceHash,
    manifest_hash: manifestHash,
    produced_receipt_id: producedReceiptId,
    canonical_manifest: canonicalManifest,
  };
}

export function formatOperatorSourceReceipt(receipt) {
  const lines = [
    `Source intake receipt: ${receipt.receipt_id}`,
    `Source ID: ${receipt.source_id}`,
    `File: ${receipt.source_file.filename}`,
    `SHA-256: ${receipt.source_file.sha256}`,
    `Bytes: ${receipt.source_file.bytes}`,
    `Permission: ${receipt.custody.permission_scope}`,
    `Default V2 assurance: ${receipt.v2_admission.default_assurance_scenario}`,
    `Automatic promotion: ${String(receipt.v2_admission.automatic_promotion_allowed)}`,
    'Source-truth certification: NOT CLAIMED',
    '',
    'Promotion requirements:',
    ...receipt.v2_admission.promotion_requirements.map((item) => `- ${item}`),
  ];
  return `${lines.join('\n')}\n`;
}

export function operatorSourceManifestHashInput(manifest) {
  return stableStringify(canonicalOperatorSourceManifest(manifest));
}
