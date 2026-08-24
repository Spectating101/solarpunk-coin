import { describe, expect, it } from 'vitest';
import { PUBLIC_EVIDENCE_CHECKPOINT as checkpoint } from './publicEvidenceCheckpoint';

describe('public evidence checkpoint', () => {
  it('locks the audited outside-data result and its non-claims', () => {
    expect(checkpoint.case_id).toBe('PUB-AUSGRID-001P');
    expect(checkpoint.evidence.assurance).toBe('L0');
    expect(checkpoint.source.interval_count).toBe(336);
    expect(checkpoint.evidence.total_eligible_surplus_kwh).toBe(33.066);
    expect(checkpoint.decisions.open.result).toBe('ADMIT_WITH_LIMIT');
    expect(checkpoint.decisions.open.binding_constraints).toEqual(['EVIDENCE_BACKED_CAPACITY']);
    expect(checkpoint.decisions.pilot.result).toBe('BLOCKED');
    expect(checkpoint.decisions.pilot.blocking_rules).toEqual(['SIGNED_EVIDENCE', 'MIN_PROVENANCE']);
    expect(checkpoint.settlement).toMatchObject({
      result: 'PARTIAL',
      covered_quantity: 13.2264,
      shortfall_quantity: 19.8396,
    });
    expect(checkpoint.verification.decision_reproduction).toBe('PASS');
    expect(checkpoint.boundaries).toEqual({
      R1: 'NOT_ASSESSED',
      R2: 'PARTIAL',
      R3: 'PARTIAL',
      R4: 'UNTESTED',
    });
    expect(checkpoint.non_claims).toContain('source-holder confirmation');
    expect(checkpoint.non_claims).toContain('monetary performance');
  });
});
