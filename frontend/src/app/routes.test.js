import { describe, expect, it } from 'vitest';
import {
  FULL_ANALYSIS_NAV,
  PRIMARY_NAV,
  isSepoliaRoute,
  parseHashRoute,
  primarySection,
  routeToHash,
} from './routes';

describe('paired platform route model', () => {
  it('uses the executable overview as the default public route', () => {
    expect(parseHashRoute('')).toEqual({ section: 'lab', id: null });
    expect(parseHashRoute('#')).toEqual({ section: 'lab', id: null });
    expect(PRIMARY_NAV.map((item) => item.section)).toEqual(['lab', 'investigate', 'research', 'field', 'programme']);
    expect(FULL_ANALYSIS_NAV.map((item) => item.section)).toEqual(['analysis', 'verify']);
  });

  it('parses durable case, comparison, receipt, and shared-workspace identities', () => {
    expect(parseHashRoute('#case/TYN-001?policy=ENERGY-CASE-PILOT-005&scenario=PROVENANCE-L2-COUNTERFACTUAL&lens=lineage')).toEqual({
      section: 'case',
      id: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
      lens: 'lineage',
    });
    expect(parseHashRoute('#compare?scenario=PROVENANCE-L2-COUNTERFACTUAL&baseline=LAB-CASE-OPEN-004&comparison=ENERGY-CASE-PILOT-005')).toEqual({
      section: 'compare',
      id: null,
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
      baselinePolicyId: 'LAB-CASE-OPEN-004',
      comparisonPolicyId: 'ENERGY-CASE-PILOT-005',
    });
    expect(parseHashRoute('#receipt/abc123?case=TYN-001&policy=ENERGY-CASE-PILOT-005&scenario=PROVENANCE-L2-COUNTERFACTUAL')).toEqual({
      section: 'receipt',
      id: 'abc123',
      caseId: 'TYN-001',
      policyId: 'ENERGY-CASE-PILOT-005',
      scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
    });
    expect(parseHashRoute('#analysis?tool=stress')).toEqual({ section: 'analysis', id: null, tool: 'stress' });
    expect(parseHashRoute('#verify?tool=capsule')).toEqual({ section: 'verify', id: null, tool: 'capsule' });
  });

  it('maps specialist and legacy routes back to their paired primary page', () => {
    expect(primarySection(parseHashRoute('#case/TYN-001'))).toBe('investigate');
    expect(primarySection(parseHashRoute('#compare'))).toBe('investigate');
    expect(primarySection(parseHashRoute('#analysis'))).toBe('investigate');
    expect(primarySection(parseHashRoute('#study'))).toBe('research');
    expect(primarySection(parseHashRoute('#evidence'))).toBe('field');
    expect(primarySection(parseHashRoute('#receipt/abc123'))).toBe('programme');
    expect(primarySection(parseHashRoute('#verify'))).toBe('programme');
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
    expect(isSepoliaRoute(parseHashRoute('#investigate'))).toBe(false);
    expect(isSepoliaRoute(parseHashRoute('#programme'))).toBe(false);
  });

  it('round-trips paired and specialist task hashes including state', () => {
    const routes = [
      { section: 'lab' },
      { section: 'investigate' },
      { section: 'research' },
      { section: 'field' },
      { section: 'programme' },
      { section: 'analysis', tool: 'compare' },
      { section: 'verify', tool: 'objects' },
      {
        section: 'case',
        id: 'AUS-001',
        policyId: 'ENERGY-CASE-STRICT-006',
        scenarioId: 'PROVENANCE-L2-COUNTERFACTUAL',
        lens: 'stress',
      },
      {
        section: 'compare',
        scenarioId: 'PROVENANCE-L1-COUNTERFACTUAL',
        baselinePolicyId: 'LAB-CASE-OPEN-004',
        comparisonPolicyId: 'ENERGY-CASE-STRICT-006',
      },
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
      if (route.tool) expect(parsed.tool).toBe(route.tool);
      if (route.policyId) expect(parsed.policyId).toBe(route.policyId);
      if (route.scenarioId) expect(parsed.scenarioId).toBe(route.scenarioId);
      if (route.caseId) expect(parsed.caseId).toBe(route.caseId);
      if (route.lens) expect(parsed.lens).toBe(route.lens);
      if (route.baselinePolicyId) expect(parsed.baselinePolicyId).toBe(route.baselinePolicyId);
      if (route.comparisonPolicyId) expect(parsed.comparisonPolicyId).toBe(route.comparisonPolicyId);
    }
  });

  it('fails an unknown hash back to the overview with invalid-route context', () => {
    expect(parseHashRoute('#definitely-not-a-route')).toEqual({
      section: 'lab',
      id: null,
      invalid: 'definitely-not-a-route',
    });
  });
});
