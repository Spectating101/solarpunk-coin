import { sha256Hex, stableStringify } from './stable.js';

export const CONTEXT_MANIFEST_SCHEMA = 'solarpunk.constraint.context_manifest.v1';

function requiredText(value, field) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(`${field} is required`);
  return text;
}

function plainObject(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${field} must be an object`);
  }
  return value;
}

function normalizeSpatialIdentity(value) {
  if (value == null) return null;
  plainObject(value, 'spatial_identity');
  const latitude = Number(value.latitude);
  const longitude = Number(value.longitude);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error('spatial_identity.latitude must be between -90 and 90');
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error('spatial_identity.longitude must be between -180 and 180');
  }
  return {
    latitude,
    longitude,
    spatial_reference: value.spatial_reference == null
      ? 'WGS84'
      : requiredText(value.spatial_reference, 'spatial_identity.spatial_reference'),
  };
}

function contextBodyWithoutHash(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('context manifest is required');
  }
  if (value.schema != null && value.schema !== CONTEXT_MANIFEST_SCHEMA) {
    throw new Error(`context manifest schema must be ${CONTEXT_MANIFEST_SCHEMA}`);
  }
  return {
    schema: CONTEXT_MANIFEST_SCHEMA,
    context_id: requiredText(value.context_id, 'context_id'),
    context_type: requiredText(value.context_type, 'context_type'),
    label: requiredText(value.label, 'label'),
    source: { ...plainObject(value.source, 'source') },
    spatial_identity: normalizeSpatialIdentity(value.spatial_identity),
    temporal_semantics: value.temporal_semantics == null
      ? null
      : { ...plainObject(value.temporal_semantics, 'temporal_semantics') },
    values: { ...plainObject(value.values, 'values') },
    hash_algorithm: 'SHA-256',
    boundary: requiredText(value.boundary, 'boundary'),
  };
}

export async function hashContextManifest(value) {
  return sha256Hex(stableStringify(contextBodyWithoutHash(value)));
}

export async function buildContextManifest(value) {
  const body = contextBodyWithoutHash(value);
  return {
    ...body,
    context_hash: await sha256Hex(stableStringify(body)),
  };
}

export function contextManifestBody(value) {
  const body = contextBodyWithoutHash(value);
  const contextHash = requiredText(value.context_hash, 'context_hash');
  if (!/^[a-f0-9]{64}$/.test(contextHash)) {
    throw new Error('context_hash must be a lowercase SHA-256 hex string');
  }
  return {
    ...body,
    context_hash: contextHash,
  };
}
