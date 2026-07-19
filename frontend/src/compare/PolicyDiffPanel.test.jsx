import { describe, expect, it } from 'vitest';
import { ENERGY_CASE_PACK } from '../lib/energyCasePack';
import { diffPolicyManifests } from './PolicyDiffPanel';

describe('policy manifest diff', () => {
  it('explains how the pilot policy changes the open demonstration policy', () => {
    const baseline = ENERGY_CASE_PACK.policiesById['LAB-CASE-OPEN-004'];
    const comparison = ENERGY_CASE_PACK.policiesById['ENERGY-CASE-PILOT-005'];
    const diff = diffPolicyManifests(baseline, comparison);

    expect(diff.summary).toEqual({
      added: 3,
      removed: 0,
      changed: 1,
      unchanged: 4,
      metadataChanged: 2,
    });
    expect(diff.admission).toEqual(expect.arrayContaining([
      expect.objectContaining({ calculatorId: 'SIGNED_EVIDENCE', status: 'ADDED' }),
      expect.objectContaining({ calculatorId: 'MIN_PROVENANCE', status: 'ADDED' }),
    ]));
    expect(diff.quantity).toEqual(expect.arrayContaining([
      expect.objectContaining({ calculatorId: 'PROVENANCE_POLICY_CAPACITY', status: 'ADDED' }),
      expect.objectContaining({
        calculatorId: 'ABSOLUTE_POLICY_CAP',
        status: 'CHANGED',
        parameterChanges: [expect.objectContaining({ key: 'maximum', before: 10000, after: 2500 })],
      }),
    ]));
  });

  it('isolates the strict policy additions and parameter changes', () => {
    const baseline = ENERGY_CASE_PACK.policiesById['ENERGY-CASE-PILOT-005'];
    const comparison = ENERGY_CASE_PACK.policiesById['ENERGY-CASE-STRICT-006'];
    const diff = diffPolicyManifests(baseline, comparison);

    expect(diff.summary).toEqual({
      added: 1,
      removed: 0,
      changed: 2,
      unchanged: 6,
      metadataChanged: 2,
    });
    expect(diff.admission).toEqual(expect.arrayContaining([
      expect.objectContaining({ calculatorId: 'EXTERNAL_CORROBORATION', status: 'ADDED' }),
      expect.objectContaining({
        calculatorId: 'MIN_PROVENANCE',
        status: 'CHANGED',
        parameterChanges: [expect.objectContaining({ key: 'minimum', before: 'L2', after: 'L4' })],
      }),
    ]));
    expect(diff.quantity).toEqual(expect.arrayContaining([
      expect.objectContaining({
        calculatorId: 'ABSOLUTE_POLICY_CAP',
        status: 'CHANGED',
        parameterChanges: [expect.objectContaining({ key: 'maximum', before: 2500, after: 50000 })],
      }),
    ]));
  });
});
