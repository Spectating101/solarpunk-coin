import { describe, expect, it } from 'vitest';
import {
  attestationInspectionAsEvidence,
  buildEvidenceEnvelope,
  classifyProvenance,
  comparePolicies,
  inspectSignedEvidence,
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

const SIGNED_READING = {
  schema: 'SPK_RAW_METER_READINGS_V1',
  min_quality_threshold: 0.9,
  batch_id: 'frontend-fixture',
  readings: [],
};

const EMPTY_REGISTRY = { schema: 'SPK_METER_REGISTRY_V2', meters: [] };

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

  it('does not upgrade browser-supplied signed evidence to operator provenance by assertion alone', async () => {
    const inspection = await inspectSignedEvidence(SIGNED_READING, EMPTY_REGISTRY);
    const evidence = attestationInspectionAsEvidence(inspection);
    const provenance = classifyProvenance(evidence, { operator_signed: true });

    expect(provenance.level).toBe('L0');
    expect(provenance.trusted_operator_context).toBe(false);
    expect(provenance.reasons.join(' ')).toMatch(/self-asserted operator context/i);
  });
});
