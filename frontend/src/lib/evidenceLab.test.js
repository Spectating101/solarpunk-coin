import { describe, it, expect } from 'vitest';
import {
  autoMapColumns,
  buildEvidenceReceipt,
  computeEligibleSurplus,
  parseCsv,
  parseQualifiedTimestamp,
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
    const result = validateMeterRows(rows, mapping);
    expect(result.ok).toBe(true);
    expect(result.totals.issuance_eligible).toBe(true);
    expect(result.totals.issuance_cap_spk).toBeGreaterThan(0);

    const receiptA = await buildEvidenceReceipt(result.accepted, result.totals, {
      filename: 'sample.csv',
      source: 'test',
      created_at: '2026-01-01T00:00:00.000Z',
      rejected: result.rejected,
      gap_warnings: result.gap_warnings,
    });
    const receiptB = await buildEvidenceReceipt(result.accepted, result.totals, {
      filename: 'other.csv',
      source: 'test',
      created_at: '2026-12-31T00:00:00.000Z',
      rejected: result.rejected,
      gap_warnings: result.gap_warnings,
    });
    expect(receiptA.evidence_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(receiptA.evidence_hash).toBe(receiptB.evidence_hash);
    expect(receiptA.status.accepted_for_live_minting).toBe(false);
    expect(receiptA.diagnostics.issuance_eligible).toBe(true);
    expect(receiptA.diagnostics.rejections).toEqual([]);
  });

  it('rejects malformed CSV', () => {
    expect(() => parseCsv('only_header\n')).toThrow(/at least one data row/i);
  });

  it('flags missing timestamp column', () => {
    const { rows } = parseCsv('foo,bar\n1,2\n');
    const result = validateMeterRows(rows, { foo: 'foo' });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/timestamp/i);
  });

  it('rejects ambiguous timezone timestamps', () => {
    const csv = `timestamp,generation_kwh,consumption_kwh
2026-01-15 08:00,1,0.2
`;
    const { headers, rows } = parseCsv(csv);
    const result = validateMeterRows(rows, autoMapColumns(headers));
    expect(result.rejected.some((r) => r.issues.includes('ambiguous_timezone'))).toBe(true);
    expect(parseQualifiedTimestamp('2026-01-15T08:00:00').issue).toBe('ambiguous_timezone');
    expect(parseQualifiedTimestamp('2026-01-15T08:00:00Z').issue).toBeNull();
    expect(parseQualifiedTimestamp('2026-01-15T08:00:00+08:00').issue).toBeNull();
  });

  it('rejects duplicate timestamps and negative readings', () => {
    const csv = `timestamp,generation_kwh,consumption_kwh
2026-01-15T08:00:00Z,1,0
2026-01-15T08:00:00Z,2,0
2026-01-15T09:00:00Z,-1,0
`;
    const { headers, rows } = parseCsv(csv);
    const result = validateMeterRows(rows, autoMapColumns(headers));
    expect(result.rejected.some((r) => r.issues.includes('duplicate_timestamp'))).toBe(true);
    expect(result.rejected.some((r) => r.issues.includes('negative_generation'))).toBe(true);
  });

  it('allows the same timestamp on different meters', () => {
    const csv = `timestamp,generation_kwh,consumption_kwh,meter_id
2026-01-15T08:00:00Z,1,0.1,A
2026-01-15T08:00:00Z,2,0.2,B
`;
    const { headers, rows } = parseCsv(csv);
    const result = validateMeterRows(rows, autoMapColumns(headers));
    expect(result.accepted).toHaveLength(2);
    expect(result.rejected).toHaveLength(0);
  });

  it('tracks cumulative monotonicity per meter', () => {
    const csv = `timestamp,generation_kwh,consumption_kwh,cumulative_kwh,meter_id
2026-01-15T08:00:00Z,1,0,1000,A
2026-01-15T08:00:00Z,1,0,200,B
2026-01-15T09:00:00Z,1,0,1001,A
2026-01-15T09:00:00Z,1,0,150,B
`;
    const { headers, rows } = parseCsv(csv);
    const result = validateMeterRows(rows, autoMapColumns(headers));
    expect(result.accepted.some((r) => r.meter_id === 'A')).toBe(true);
    expect(result.rejected.some((r) => r.meter_id === 'B' && r.issues.includes('non_monotonic_cumulative'))).toBe(true);
  });

  it('does not treat generation-only data as eligible surplus', async () => {
    const csv = `timestamp,generation_kwh
2026-01-15T08:00:00Z,10
2026-01-15T09:00:00Z,12
`;
    const { headers, rows } = parseCsv(csv);
    const result = validateMeterRows(rows, autoMapColumns(headers));
    expect(result.ok).toBe(true);
    expect(result.totals.issuance_eligible).toBe(false);
    expect(result.totals.issuance_cap_spk).toBe(0);
    expect(result.totals.issuance_reason).toBe('insufficient_surplus_basis');
    expect(computeEligibleSurplus({ generation: 10, consumption: null, exportKwh: null }).surplus_basis_ok).toBe(false);

    const receipt = await buildEvidenceReceipt(result.accepted, result.totals, {
      rejected: result.rejected,
      gap_warnings: result.gap_warnings,
    });
    expect(receipt.diagnostics.issuance_eligible).toBe(false);
  });

  it('allows export-only surplus basis', () => {
    const csv = `timestamp,export_kwh
2026-01-15T08:00:00Z,2.5
2026-01-15T09:00:00Z,3.0
`;
    const { headers, rows } = parseCsv(csv);
    const result = validateMeterRows(rows, autoMapColumns(headers));
    expect(result.totals.issuance_eligible).toBe(true);
    expect(result.totals.issuance_cap_spk).toBe(5.5);
    expect(result.totals.generation_kwh).toBeNull();
    expect(result.totals.consumption_kwh).toBeNull();
  });

  it('emits interval gap warnings without rejecting rows', () => {
    const csv = `timestamp,generation_kwh,consumption_kwh,meter_id
2026-01-15T08:00:00Z,1,0,A
2026-01-15T09:00:00Z,1,0,A
2026-01-15T10:00:00Z,1,0,A
2026-01-15T18:00:00Z,1,0,A
`;
    const { headers, rows } = parseCsv(csv);
    const result = validateMeterRows(rows, autoMapColumns(headers));
    expect(result.accepted).toHaveLength(4);
    expect(result.gap_warnings.length).toBeGreaterThan(0);
    expect(result.gap_warnings[0].code).toBe('interval_gap');
  });

  it('includes cumulative_kwh in receipt hash payload when present', async () => {
    const csv = `timestamp,generation_kwh,consumption_kwh,cumulative_kwh
2026-01-15T08:00:00Z,1,0,10
2026-01-15T09:00:00Z,1,0,11
`;
    const { headers, rows } = parseCsv(csv);
    const result = validateMeterRows(rows, autoMapColumns(headers));
    const receipt = await buildEvidenceReceipt(result.accepted, result.totals, {
      rejected: [],
      gap_warnings: [],
    });
    expect(receipt.rows[0].cumulative_kwh).toBe(10);
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
      rejected: [],
      gap_warnings: [],
    });
    return createSimulation({
      evidenceHash: receipt.evidence_hash,
      issuanceCapSpk: validation.totals.issuance_cap_spk,
      surplusKwh: validation.totals.eligible_surplus_kwh,
      issuanceEligible: validation.totals.issuance_eligible,
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

  it('does not reduce settlement capacity when paying SPK', async () => {
    let sim = await seededSim();
    sim = issueSpk(sim, Math.min(10, sim.evidence.issuance_cap_spk)).sim;
    const capacityBefore = sim.balances.settlement_capacity_spk;
    const paid = paySpk(sim, { type: 'LABOR', amount: 3 });
    expect(paid.ok).toBe(true);
    expect(paid.sim.balances.settlement_capacity_spk).toBe(capacityBefore);
    expect(paid.sim.balances.remaining_spk).toBe(capacityBefore - 3);
  });

  it('surfaces settlement shortfall from capacity stress, not payer spend', async () => {
    let sim = await seededSim();
    sim = issueSpk(sim, Math.min(20, sim.evidence.issuance_cap_spk)).sim;
    sim = paySpk(sim, { type: 'SERVICE', amount: 5 }).sim;
    const walletBefore = sim.balances.remaining_spk;
    const short = runScenario(sim, 'shortfall');
    expect(short.obligation.shortfall_spk).toBeGreaterThan(0);
    expect(short.severity).toBe('warning');
    expect(short.sim.events.some((e) => e.type === 'SETTLEMENT_CAPACITY_STRESS')).toBe(true);
    expect(short.sim.events.some((e) => e.type === 'SETTLEMENT_SHORTFALL' && e.severity === 'warning')).toBe(true);
    // Payer still had wallet funds; shortfall is capacity-driven
    expect(walletBefore).toBeGreaterThan(0);
  });

  it('covers a normal settlement from capacity', async () => {
    let sim = await seededSim();
    sim = issueSpk(sim, Math.min(10, sim.evidence.issuance_cap_spk)).sim;
    const normal = runScenario(sim, 'normal');
    expect(normal.ok).toBe(true);
    expect(normal.obligation.shortfall_spk).toBe(0);
    expect(normal.severity).toBe('success');
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

describe('stale receipt invalidation contract', () => {
  it('valid then generation-only replacement yields no usable issuance receipt', async () => {
    const good = validateMeterRows(...(() => {
      const { headers, rows } = parseCsv(SAMPLE);
      return [rows, autoMapColumns(headers)];
    })());
    expect(good.totals.issuance_eligible).toBe(true);
    const goodReceipt = await buildEvidenceReceipt(good.accepted, good.totals, {
      rejected: [],
      gap_warnings: [],
    });
    expect(goodReceipt).toBeTruthy();

    const badCsv = `timestamp,generation_kwh
2026-01-15T08:00:00Z,10
`;
    const { headers, rows } = parseCsv(badCsv);
    const bad = validateMeterRows(rows, autoMapColumns(headers));
    expect(bad.totals.issuance_eligible).toBe(false);
    // App must clear parent receipt on any new ingestion; Currency Lab then has no active receipt.
    // Here we assert the replacement evidence cannot mint.
    const sim = createSimulation({
      evidenceHash: 'deadbeef',
      issuanceCapSpk: bad.totals.issuance_cap_spk,
      surplusKwh: 0,
      issuanceEligible: bad.totals.issuance_eligible,
    });
    const issued = issueSpk(sim, 1);
    expect(issued.ok).toBe(false);
  });
});
