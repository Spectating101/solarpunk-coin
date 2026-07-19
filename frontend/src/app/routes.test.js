import { describe, expect, it } from 'vitest';
import {
  isSepoliaRoute,
  parseHashRoute,
  primarySection,
  routeToHash,
} from './routes';

describe('case workbench route model', () => {
  it('uses the lab overview as the default public route', () => {
    expect(parseHashRoute('')).toEqual({ section: 'lab', id: null });
    expect(parseHashRoute('#')).toEqual({ section: 'lab', id: null });
  });

  it('parses durable case and receipt identities', () => {
    expect(parseHashRoute('#case/TYN-001?policy=ENERGY-CASE-PILOT-005&scenario=PROVENANCE-L2-COUNTERFACTUAL&lens=lineage')).toEqual({
      section: 'case',
      id: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
      lens: 'lineage',
    });
    expect(parseHashRoute('#receipt/abc123?case=TYN-001&policy=ENERGY-CASE-PILOT-005&scenario=PROVENANCE-L2-COUNTERFACTUAL')).toEqual({
      section: 'receipt',
      id: 'abc123',
      caseId: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    });
    expect(primarySection(parseHashRoute('#case/TYN-001'))).toBe('cases');
    expect(primarySection(parseHashRoute('#receipt/abc123'))).toBe('receipts');
  });

  it('preserves the V1 shared route aliases', () => {
    expect(parseHashRoute('#runs')).toMatchObject({ section: 'study', id: 'market-capacity-v1', view: 'brief' });
    expect(parseHashRoute('#study')).toMatchObject({ section: 'study', id: 'market-capacity-v1', view: 'detail' });
    expect(parseHashRoute('#reproduce')).toMatchObject({ section: 'study', id: 'market-capacity-v1', view: 'reproduce' });
    expect(parseHashRoute('#protocol')).toMatchObject({ section: 'legacy-protocol' });
    expect(parseHashRoute('#overview')).toMatchObject({ section: 'reference', id: 'solarpunk' });
    expect(parseHashRoute('#sepolia')).toMatchObject({ section: 'reference', id: 'sepolia' });
  });

  it('isolates the wallet route to the Sepolia reference surface', () => {
    expect(isSepoliaRoute(parseHashRoute('#sepolia'))).toBe(true);
    expect(isSepoliaRoute(parseHashRoute('#cases'))).toBe(false);
    expect(isSepoliaRoute(parseHashRoute('#reference'))).toBe(false);
  });

  it('round-trips canonical workbench task hashes including state', () => {
    const routes = [
      { section: 'lab' },
      { section: 'cases' },
      {
        section: 'case',
        id: 'AUS-001',
        policyId: 'ENERGY-CASE-STRICT-006',
        scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
        lens: 'stress',
      },
      { section: 'compare', scenarioId: 'PROVENANCE-L1-COUNTERFACTUAL' },
      { section: 'receipts' },
      {
        section: 'receipt',
        id: 'abc123',
        caseId: 'AUS-001',
        policyId: 'ENERGY-CASE-STRICT-006',
        scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
      },
      { section: 'reference', id: 'derivatives' },
    ];
    for (const route of routes) {
      const parsed = parseHashRoute(routeToHash(route));
      expect(parsed.section).toBe(route.section);
      expect(parsed.id ?? null).toBe(route.id ?? null);
      if (route.policyId) expect(parsed.policyId).toBe(route.policyId);
      if (route.scenarioId) expect(parsed.scenarioId).toBe(route.scenarioId);
      if (route.caseId) expect(parsed.caseId).toBe(route.caseId);
      if (route.lens) expect(parsed.lens).toBe(route.lens);
    }
  });

  it('fails an unknown hash back to the lab overview with invalid-route context', () => {
    expect(parseHashRoute('#definitely-not-a-route')).toEqual({
      section: 'lab',
      id: null,
      invalid: 'definitely-not-a-route',
    });
  });
});
