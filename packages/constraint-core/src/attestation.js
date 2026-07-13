import { getBytes, keccak256, toUtf8Bytes, verifyMessage } from 'ethers';
import { round, sha256Hex, stableStringify, unixSeconds } from './stable.js';

export function readingPayload(reading) {
  return {
    curtailed_kwh: reading.curtailed_kwh,
    export_kwh: reading.export_kwh,
    generation_kwh: reading.generation_kwh,
    meter_id: reading.meter_id,
    nonce: reading.nonce,
    quality_score: reading.quality_score,
    site_id: reading.site_id,
    site_load_kwh: reading.site_load_kwh,
    source: reading.source,
    window_end: reading.window_end,
    window_start: reading.window_start,
  };
}

export function payloadHash(reading) {
  return keccak256(toUtf8Bytes(stableStringify(readingPayload(reading))));
}

function registryByMeter(registry) {
  return new Map((registry?.meters || []).map((meter) => [String(meter.meter_id), meter]));
}

function check(code, status, detail) {
  return { code, status, detail };
}

function failure(code, detail, checks) {
  checks.push(check(code, 'BLOCK', detail));
  return { accepted: false, reason: detail, checks };
}

async function inspectReading(reading, meter, ctx) {
  const checks = [];
  if (!meter) return failure('meter_registered', 'meter not registered', checks);
  checks.push(check('meter_registered', 'PASS', `Meter ${reading.meter_id} exists in the supplied registry.`));

  if (String(reading.site_id) !== String(meter.site_id)) {
    return failure('site_identity', 'site_id does not match meter registry', checks);
  }
  checks.push(check('site_identity', 'PASS', `Reading site ${reading.site_id} matches the registered meter site.`));

  const windowStart = unixSeconds(reading.window_start, 'window_start');
  const windowEnd = unixSeconds(reading.window_end, 'window_end');
  if (windowStart >= windowEnd) return failure('measurement_window', 'invalid measurement window', checks);
  if (windowEnd > ctx.now) return failure('measurement_window', 'measurement window has not closed', checks);
  if (meter.active_after && windowStart < unixSeconds(meter.active_after)) return failure('meter_activation', 'reading before meter activation', checks);
  if (meter.active_until && windowEnd > unixSeconds(meter.active_until)) return failure('meter_activation', 'reading after meter deactivation', checks);
  checks.push(check('measurement_window', 'PASS', 'Measurement window is closed and falls within meter activation bounds.'));

  const nonceKey = `${reading.meter_id}:${reading.nonce}`;
  if (ctx.seenNonces.has(nonceKey)) return failure('nonce_unique', 'duplicate meter nonce', checks);
  checks.push(check('nonce_unique', 'PASS', 'Meter nonce is unique within this evidence bundle.'));

  const windowKey = `${reading.meter_id}:${reading.window_start}:${reading.window_end}`;
  if (ctx.seenWindows.has(windowKey)) return failure('window_unique', 'duplicate meter window', checks);
  checks.push(check('window_unique', 'PASS', 'Meter measurement window is unique within this evidence bundle.'));

  const expectedHash = payloadHash(reading);
  if (String(reading.payload_hash || '').toLowerCase() !== expectedHash.toLowerCase()) {
    return failure('payload_hash', 'payload_hash mismatch', checks);
  }
  checks.push(check('payload_hash', 'PASS', 'Payload hash matches the canonical signed reading fields.'));

  let recovered;
  try {
    recovered = verifyMessage(getBytes(expectedHash), String(reading.signature || ''));
  } catch {
    return failure('signature_valid', 'invalid meter signature', checks);
  }
  checks.push(check('signature_valid', 'PASS', `Signature recovers ${recovered}.`));

  if (recovered.toLowerCase() !== String(meter.device_address).toLowerCase()) {
    return failure('registered_signer', 'signature does not match registered meter', checks);
  }
  checks.push(check('registered_signer', 'PASS', 'Recovered signer matches the registered meter device address.'));

  const generation = Number(reading.generation_kwh);
  const siteLoad = Number(reading.site_load_kwh);
  const exported = Number(reading.export_kwh);
  const curtailed = Number(reading.curtailed_kwh);
  const quality = Number(reading.quality_score);
  if (![generation, siteLoad, exported, curtailed, quality].every(Number.isFinite)) {
    return failure('numeric_fields', 'energy and quality fields must be numeric', checks);
  }
  if (generation < 0 || siteLoad < 0 || exported < 0 || curtailed < 0) {
    return failure('non_negative_energy', 'energy fields must be non-negative', checks);
  }
  checks.push(check('non_negative_energy', 'PASS', 'Energy fields are non-negative numbers.'));

  if (quality < ctx.minQuality) return failure('quality_threshold', `quality_score below threshold (${ctx.minQuality})`, checks);
  if (quality > 1) return failure('quality_threshold', 'quality_score must be <= 1', checks);
  checks.push(check('quality_threshold', 'PASS', `Quality ${quality} meets threshold ${ctx.minQuality}.`));

  const measuredHours = (windowEnd - windowStart) / 3600;
  const maxGeneration = Number(meter.capacity_kw) * measuredHours * 1.05;
  if (!Number.isFinite(maxGeneration)) return failure('capacity_bound', 'meter capacity_kw must be numeric', checks);
  if (generation > maxGeneration) return failure('capacity_bound', 'generation exceeds capacity sanity bound', checks);
  checks.push(check('capacity_bound', 'PASS', `Generation ${generation} kWh is within the ${round(maxGeneration)} kWh capacity sanity bound.`));

  const surplus = exported + curtailed;
  if (surplus <= 0) return failure('positive_surplus', 'derived surplus must be > 0', checks);
  if (surplus - generation > 1e-9) return failure('positive_surplus', 'surplus cannot exceed generation', checks);
  checks.push(check('positive_surplus', 'PASS', `Derived surplus is ${round(surplus)} kWh.`));

  const drift = Math.abs(generation - siteLoad - exported - curtailed);
  const tolerance = Math.max(0.001, generation * 0.02);
  if (drift > tolerance) return failure('energy_balance', 'energy balance drift exceeds 2%', checks);
  checks.push(check('energy_balance', 'PASS', `Energy balance drift ${round(drift)} kWh is within ${round(tolerance)} kWh tolerance.`));

  ctx.seenNonces.add(nonceKey);
  ctx.seenWindows.add(windowKey);

  const canonical = {
    meter_id: String(reading.meter_id),
    site_id: String(reading.site_id),
    window_start: new Date(reading.window_start).toISOString().replace('.000Z', 'Z'),
    window_end: new Date(reading.window_end).toISOString().replace('.000Z', 'Z'),
    surplus_kwh: round(surplus),
    quality_score: round(quality),
    source: String(reading.source),
    attestor: String(meter.device_address),
    device_address: String(meter.device_address),
    payload_hash: expectedHash,
    signature: String(reading.signature),
    location_country: String(meter.location_country || 'TW'),
    grid_zone: String(meter.grid_zone || 'unknown'),
    energy_vintage: String(meter.energy_vintage || new Date(reading.window_end).toISOString().slice(0, 7)),
  };
  canonical.record_hash = await sha256Hex(canonical);
  return { accepted: true, checks, canonical };
}

export async function inspectSignedEvidence(payload, registry, options = {}) {
  const meters = registryByMeter(registry);
  const minQuality = Number(options.min_quality ?? payload?.min_quality_threshold ?? 0.9);
  const ctx = {
    minQuality,
    now: Number(options.now ?? Math.floor(Date.now() / 1000)),
    seenNonces: new Set(),
    seenWindows: new Set(),
  };
  const rows = [];
  for (const [index, reading] of (payload?.readings || []).entries()) {
    const result = await inspectReading(reading, meters.get(String(reading?.meter_id)), ctx);
    rows.push({ index, meter_id: reading?.meter_id || null, ...result });
  }
  const accepted = rows.filter((row) => row.accepted).map((row) => row.canonical);
  const rejected = rows.filter((row) => !row.accepted).map((row) => ({
    index: row.index,
    meter_id: row.meter_id,
    reason: row.reason,
    checks: row.checks,
  }));
  const totalSurplus = round(accepted.reduce((total, row) => total + row.surplus_kwh, 0));
  const bundle = {
    schema: 'solarpunk.constraint.attestation_inspection.v1',
    source_schema: payload?.schema || 'unknown',
    registry_schema: registry?.schema || 'unknown',
    batch_id: String(payload?.batch_id || 'unknown_batch'),
    min_quality_threshold: minQuality,
    summary: {
      input_records: Array.isArray(payload?.readings) ? payload.readings.length : 0,
      accepted_records: accepted.length,
      rejected_records: rejected.length,
      verified_signatures: accepted.length,
      registered_meters: meters.size,
      total_surplus_kwh: totalSurplus,
    },
    accepted_attestations: accepted,
    rejected_attestations: rejected,
    row_checks: rows.map((row) => ({
      index: row.index,
      meter_id: row.meter_id,
      accepted: row.accepted,
      reason: row.reason || null,
      checks: row.checks,
    })),
  };
  bundle.evidence_hash = await sha256Hex({
    source_schema: bundle.source_schema,
    registry_schema: bundle.registry_schema,
    batch_id: bundle.batch_id,
    accepted_attestations: bundle.accepted_attestations,
    rejected_attestations: bundle.rejected_attestations.map(({ checks, ...row }) => row),
  });
  return bundle;
}

export function attestationInspectionAsEvidence(inspection) {
  const acceptedRecords = Number(inspection.summary.accepted_records || 0);
  const rejectedRecords = Number(inspection.summary.rejected_records || 0);

  return {
    schema: 'solarpunk.constraint.evidence_envelope.v1',
    adapter: { id: 'signed-meter-attestation-inspector', version: '1.0.1' },
    source: { kind: 'signed_meter_readings', cryptographically_verified: true },
    intervals: inspection.accepted_attestations.map((row) => ({
      meter_id: row.meter_id,
      site_id: row.site_id,
      window_start: row.window_start,
      window_end: row.window_end,
      generation_kwh: null,
      site_load_kwh: null,
      export_kwh: null,
      curtailed_kwh: null,
      eligible_surplus_kwh: row.surplus_kwh,
      surplus_basis: 'verified_signed_meter_surplus',
      quality_score: row.quality_score,
      source: row.source,
      record_hash: row.record_hash,
      attestor: row.attestor,
    })),
    diagnostics: inspection.row_checks.flatMap((row) => row.checks.map((item) => ({
      ...item,
      scope: 'record',
      row_index: row.index,
      meter_id: row.meter_id,
      record_accepted: row.accepted,
    }))),
    capabilities: {
      identity: true,
      signed: true,
      cryptographically_verified: true,
      signature_verification: true,
      replay_checks: true,
      capacity_sanity: true,
      energy_balance: true,
    },
    summary: {
      interval_count: acceptedRecords,
      total_eligible_surplus_kwh: inspection.summary.total_surplus_kwh,
      // Rejected records are excluded from the accepted evidence subset. They do not invalidate
      // valid accepted records unless the entire bundle has no accepted evidence.
      blocker_count: acceptedRecords > 0 ? 0 : rejectedRecords,
      rejected_input_records: rejectedRecords,
      warning_count: rejectedRecords,
    },
    evidence_hash: inspection.evidence_hash,
    hash_algorithm: 'SHA-256',
  };
}
