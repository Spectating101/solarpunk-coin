import { describe, it, expect } from 'vitest';
import {
  autoMapColumns,
  buildEvidenceReceipt,
  parseCsv,
  sha256Hex,
  stableStringify,
  validateMeterRows,
} from '../lib/evidenceLab';
import {
  createSimulation,
  issueSpk,
  paySpk,
  runScenario,
  attemptGovernanceOverride,
} from '../lib/currencyLab';

const SAMPLE = `timestamp,generation_kwh,consumption_kwh,export_kwh,meter_id
2026-01-15T08:00:00Z,3.2,0.6,2.5,SAMPLE-01
2026-01-15T09:00:00Z,4.1,0.7,3.3,SAMPLE-01
`;

describe('evidenceLab', () => {
  it('validates a sample CSV and builds a deterministic evidence hash', async () => {
    const { headers, rows } = parseCsv(SAMPLE);
    const mapping = autoMapColumns(headers);
    expect(mapping.timestamp).toBe('timestamp');
    expect(mapping.generation_kwh).toBe('generation_kwh');

    const result = validateMeterRows(rows, mapping);
    expect(result.ok).toBe(true);
    expect(result.totals.accepted_rows).toBe(2);
    expect(result.totals.rejected_rows).toBe(0);
    expect(result.totals.issuance_cap_spk).toBeGreaterThan(0);

    const receiptA = await buildEvidenceReceipt(result.accepted, result.totals, {
      filename: 'sample.csv',
      source: 'test',
      created_at: '2026-01-01T00:00:00.000Z',
    });
    const receiptB = await buildEvidenceReceipt(result.accepted, result.totals, {
      filename: 'other.csv',
      source: 'test',
      created_at: '2026-12-31T00:00:00.000Z',
    });
    expect(receiptA.evidence_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(receiptA.evidence_hash).toBe(receiptB.evidence_hash);
    expect(receiptA.status.accepted_for_live_minting).toBe(false);
    expect(receiptA.schema).toBe('solarpunk.public_lab.evidence_receipt.v1');
  });

  it('rejects malformed CSV', () => {
    expect(() => parseCsv('only_header\n')).toThrow(/at least one data row/i);
  });

  it('flags missing required columns', () => {
    const { rows } = parseCsv('foo,bar\n1,2\n');
    const result = validateMeterRows(rows, { foo: 'foo' });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Missing required columns/i);
  });

  it('rejects duplicate timestamps and negative readings', () => {
    const csv = `timestamp,generation_kwh
2026-01-15T08:00:00Z,1
2026-01-15T08:00:00Z,2
2026-01-15T09:00:00Z,-1
`;
    const { headers, rows } = parseCsv(csv);
    const result = validateMeterRows(rows, autoMapColumns(headers));
    expect(result.rejected.some((r) => r.issues.includes('duplicate_timestamp'))).toBe(true);
    expect(result.rejected.some((r) => r.issues.includes('negative_generation'))).toBe(true);
  });

  it('rejects non-monotonic cumulative readings', () => {
    const csv = `timestamp,generation_kwh,cumulative_kwh
2026-01-15T08:00:00Z,1,10
2026-01-15T09:00:00Z,1,9
`;
    const { headers, rows } = parseCsv(csv);
    const result = validateMeterRows(rows, autoMapColumns(headers));
    expect(result.rejected.some((r) => r.issues.includes('non_monotonic_cumulative'))).toBe(true);
  });

  it('stableStringify + sha256 are deterministic', async () => {
    const a = await sha256Hex(stableStringify({ b: 1, a: 2 }));
    const b = await sha256Hex(stableStringify({ a: 2, b: 1 }));
    expect(a).toBe(b);
  });
});

describe('currencyLab', () => {
  async function seededSim() {
    const { headers, rows } = parseCsv(SAMPLE);
    const validation = validateMeterRows(rows, autoMapColumns(headers));
    const receipt = await buildEvidenceReceipt(validation.accepted, validation.totals, {
      created_at: '2026-01-01T00:00:00.000Z',
    });
    return createSimulation({
      evidenceHash: receipt.evidence_hash,
      issuanceCapSpk: validation.totals.issuance_cap_spk,
      surplusKwh: validation.totals.eligible_surplus_kwh,
    });
  }

  it('blocks issuance above the evidence cap', async () => {
    const sim = await seededSim();
    const over = issueSpk(sim, sim.evidence.issuance_cap_spk + 1);
    expect(over.ok).toBe(false);
    expect(over.error).toMatch(/exceeds evidence cap/i);
  });

  it('blocks duplicate / replay evidence after issuance', async () => {
    let sim = await seededSim();
    const first = issueSpk(sim, Math.min(1, sim.evidence.issuance_cap_spk));
    expect(first.ok).toBe(true);
    sim = first.sim;
    const replay = issueSpk(sim, 0.5);
    expect(replay.ok).toBe(false);
    expect(replay.error).toMatch(/duplicate evidence/i);
  });

  it('surfaces settlement shortfall', async () => {
    let sim = await seededSim();
    sim = issueSpk(sim, Math.min(2, sim.evidence.issuance_cap_spk)).sim;
    const short = runScenario(sim, 'shortfall');
    expect(short.ok).toBe(true);
    expect(short.obligation.shortfall_spk).toBeGreaterThan(0);
    expect(short.sim.events.some((e) => e.type === 'SETTLEMENT_SHORTFALL')).toBe(true);
  });

  it('blocks governance override by default', async () => {
    const sim = await seededSim();
    const blocked = attemptGovernanceOverride(sim, { allow: false });
    expect(blocked.ok).toBe(false);
    expect(blocked.error).toMatch(/governance override blocked/i);
  });

  it('records typed payments against remaining balance', async () => {
    let sim = await seededSim();
    sim = issueSpk(sim, Math.min(10, sim.evidence.issuance_cap_spk)).sim;
    const paid = paySpk(sim, { type: 'LABOR', amount: 1 });
    expect(paid.ok).toBe(true);
    expect(paid.sim.balances.paid_spk).toBe(1);
    expect(paid.sim.payments[0].type).toBe('LABOR');
  });
});
