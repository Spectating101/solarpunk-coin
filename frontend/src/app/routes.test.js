import { describe, expect, it } from 'vitest';
import {
  isSepoliaRoute,
  parseHashRoute,
  primarySection,
  routeToHash,
} from './routes';

describe('case workbench route model', () => {
  it('uses cases as the default task route', () => {
    expect(parseHashRoute('')).toEqual({ section: 'cases', id: null });
    expect(parseHashRoute('#')).toEqual({ section: 'cases', id: null });
  });

  it('parses dynamic case and receipt identities', () => {
    expect(parseHashRoute('#case/TYN-001')).toEqual({ section: 'case', id: 'TYN-001' });
    expect(parseHashRoute('#receipt/abc123')).toEqual({ section: 'receipt', id: 'abc123' });
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

  it('round-trips canonical workbench task hashes', () => {
    const routes = [
      { section: 'cases' },
      { section: 'case', id: 'AUS-001' },
      { section: 'compare' },
      { section: 'receipts' },
      { section: 'receipt', id: 'abc123' },
      { section: 'reference', id: 'derivatives' },
    ];
    for (const route of routes) {
      const parsed = parseHashRoute(routeToHash(route));
      expect(parsed.section).toBe(route.section);
      expect(parsed.id ?? null).toBe(route.id ?? null);
    }
  });

  it('fails an unknown hash back to the case index with invalid-route context', () => {
    expect(parseHashRoute('#definitely-not-a-route')).toEqual({
      section: 'cases',
      id: null,
      invalid: 'definitely-not-a-route',
    });
  });
});
