import { describe, expect, it } from 'vitest';
import {
  buildEvidenceEnvelope,
  classifyProvenance,
  comparePolicies,
  normalizeCumulativePair,
} from '@solarpunk/constraint-core';

const START = {
  schema: 'SPK_CUMULATIVE_METER_SNAPSHOT_V1',
  provider: 'test_gateway',
  captured_at: '2026-02-14T00:00:00Z',
  meter_id: 'M-1',
  site_id: 'S-1',
  counters: {
    generation_kwh_total: 100,
    site_load_kwh_total: 40,
    export_kwh_total: 45,
    curtailed_kwh_total: 15,
  },
};

const END = {
  ...START,
  captured_at: '2026-02-15T00:00:00Z',
  counters: {
    generation_kwh_total: 130,
    site_load_kwh_total: 50,
    export_kwh_total: 60,
    curtailed_kwh_total: 20,
  },
};

describe('Constraint Protocol browser core', () => {
  it('normalizes evidence and compares policies in the frontend runtime', async () => {
    const normalized = normalizeCumulativePair(START, END);
    const evidence = await buildEvidenceEnvelope(normalized);
    const provenance = classifyProvenance(evidence, { sample_fixture: true });
    const decisions = comparePolicies({ evidence, provenance });

    expect(evidence.summary.total_eligible_surplus_kwh).toBe(20);
    expect(provenance.level).toBe('L0');
    expect(decisions.find((item) => item.policy_id === 'LAB-OPEN-001').admitted).toBe(true);
    expect(decisions.find((item) => item.policy_id === 'ENERGY-PILOT-002').admitted).toBe(false);
  });
});
