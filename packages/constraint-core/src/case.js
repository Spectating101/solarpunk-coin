import { canonicalTimestamp, sha256Hex, stableStringify } from './stable.js';

export const CASE_MANIFEST_SCHEMA = 'solarpunk.constraint.case_manifest.v1';

function requiredText(value, field) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(`${field} is required`);
  return text;
}

function normalizeSpatialIdentity(value) {
  if (value == null) return null;
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('spatial_identity must be an object or null');
  }
  const latitude = Number(value.latitude);
  const longitude = Number(value.longitude);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error('spatial_identity.latitude must be between -90 and 90');
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error('spatial_identity.longitude must be between -180 and 180');
  }
  return {
    site_id: value.site_id == null ? null : requiredText(value.site_id, 'spatial_identity.site_id'),
    latitude,
    longitude,
    spatial_reference: value.spatial_reference == null
      ? 'WGS84'
      : requiredText(value.spatial_reference, 'spatial_identity.spatial_reference'),
  };
}

function normalizeMeasurementWindow(value) {
  if (value == null) return null;
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('measurement_window must be an object or null');
  }
  const start = canonicalTimestamp(value.start, 'measurement_window.start');
  const end = canonicalTimestamp(value.end, 'measurement_window.end');
  if (Date.parse(end) < Date.parse(start)) {
    throw new Error('measurement_window.end must not precede measurement_window.start');
  }
  return { start, end };
}

function normalizeRefs(value, field) {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  return [...new Set(value.map((item) => requiredText(item, `${field} item`)))].sort();
}

function normalizePolicyRef(value) {
  if (value == null) return null;
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('default_policy_ref must be an object or null');
  }
  return {
    id: requiredText(value.id, 'default_policy_ref.id'),
    version: requiredText(value.version, 'default_policy_ref.version'),
  };
}

export function caseManifestBody(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('case manifest is required');
  }
  if (value.schema != null && value.schema !== CASE_MANIFEST_SCHEMA) {
    throw new Error(`case manifest schema must be ${CASE_MANIFEST_SCHEMA}`);
  }
  const boundaries = value.boundaries ?? [];
  if (!Array.isArray(boundaries)) throw new Error('boundaries must be an array');

  return {
    schema: CASE_MANIFEST_SCHEMA,
    case_id: requiredText(value.case_id, 'case_id'),
    subject: requiredText(value.subject, 'subject'),
    case_type: requiredText(value.case_type, 'case_type'),
    spatial_identity: normalizeSpatialIdentity(value.spatial_identity),
    measurement_window: normalizeMeasurementWindow(value.measurement_window),
    evidence_refs: normalizeRefs(value.evidence_refs ?? [], 'evidence_refs'),
    context_refs: normalizeRefs(value.context_refs ?? [], 'context_refs'),
    default_policy_ref: normalizePolicyRef(value.default_policy_ref),
    boundaries: boundaries.map((item) => requiredText(item, 'boundaries item')),
  };
}

export async function hashCaseManifest(value) {
  return sha256Hex(stableStringify(caseManifestBody(value)));
}
