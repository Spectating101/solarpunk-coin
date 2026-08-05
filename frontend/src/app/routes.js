const STATIC_SECTIONS = new Set([
  'lab',
  'investigate',
  'research',
  'field',
  'programme',
  'analysis',
  'verify',
  'cases',
  'compare',
  'studies',
  'receipts',
  'reference',
  'legacy-protocol',
  'evidence',
  'currency',
]);

const LEGACY_ROUTES = Object.freeze({
  runs: { section: 'study', id: 'market-capacity-v1', view: 'brief', legacy: 'runs' },
  study: { section: 'study', id: 'market-capacity-v1', view: 'detail', legacy: 'study' },
  reproduce: { section: 'study', id: 'market-capacity-v1', view: 'reproduce', legacy: 'reproduce' },
  protocol: { section: 'legacy-protocol', id: null, legacy: 'protocol' },
  overview: { section: 'reference', id: 'solarpunk', legacy: 'overview' },
  sepolia: { section: 'reference', id: 'sepolia', legacy: 'sepolia' },
  evidence: { section: 'evidence', id: null, legacy: 'evidence' },
  currency: { section: 'currency', id: null, legacy: 'currency' },
});

export const PRIMARY_NAV = Object.freeze([
  { section: 'lab', label: 'Overview' },
  { section: 'investigate', label: 'Investigate' },
  { section: 'research', label: 'Research' },
  { section: 'field', label: 'Field Use' },
  { section: 'programme', label: 'Programme' },
]);

export const FULL_ANALYSIS_NAV = Object.freeze([
  { section: 'analysis', label: 'Analysis Lab' },
  { section: 'verify', label: 'Verification Hub' },
]);

function queryValue(params, name) {
  return params.get(name) || null;
}

function routeQuery(route, names) {
  const params = new URLSearchParams();
  for (const [queryName, routeName] of names) {
    const value = route?.[routeName];
    if (value) params.set(queryName, value);
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function parseHashRoute(hash = '') {
  const raw = String(hash).replace(/^#/, '').trim();
  if (!raw) return { section: 'lab', id: null };

  const [rawPath, rawQuery = ''] = raw.split('?');
  const legacy = LEGACY_ROUTES[rawPath.toLowerCase()];
  if (legacy) return { ...legacy };

  const params = new URLSearchParams(rawQuery);
  const [rawSection, ...rest] = rawPath.split('/').filter(Boolean);
  const section = String(rawSection || 'lab').toLowerCase();
  const id = rest.length ? decodeURIComponent(rest.join('/')) : null;
  const policyId = queryValue(params, 'policy');
  const scenarioId = queryValue(params, 'scenario');
  const caseId = queryValue(params, 'case');
  const lens = queryValue(params, 'lens');
  const baselinePolicyId = queryValue(params, 'baseline');
  const comparisonPolicyId = queryValue(params, 'comparison');
  const tool = queryValue(params, 'tool');

  if (section === 'case') return { section: 'case', id, policyId, scenarioId, lens };
  if (section === 'compare') {
    return {
      section: 'compare',
      id: null,
      scenarioId,
      baselinePolicyId,
      comparisonPolicyId,
    };
  }
  if (section === 'analysis' || section === 'verify') return { section, id: null, tool };
  if (section === 'study') return { section: 'study', id, view: 'detail' };
  if (section === 'receipt') return { section: 'receipt', id, caseId, policyId, scenarioId };
  if (section === 'reference') return { section: 'reference', id };
  if (STATIC_SECTIONS.has(section)) return { section, id: null };
  return { section: 'lab', id: null, invalid: raw };
}

export function routeToHash(route) {
  const section = route?.section || 'lab';
  if (section === 'case') {
    const query = routeQuery(route, [
      ['policy', 'policyId'],
      ['scenario', 'scenarioId'],
      ['lens', 'lens'],
    ]);
    return `#case/${encodeURIComponent(route.id)}${query}`;
  }
  if (section === 'compare') {
    return `#compare${routeQuery(route, [
      ['scenario', 'scenarioId'],
      ['baseline', 'baselinePolicyId'],
      ['comparison', 'comparisonPolicyId'],
    ])}`;
  }
  if (section === 'analysis' || section === 'verify') {
    return `#${section}${routeQuery(route, [['tool', 'tool']])}`;
  }
  if (section === 'study') {
    if (route.view === 'brief') return '#runs';
    if (route.view === 'reproduce') return '#reproduce';
    return route.id === 'market-capacity-v1' ? '#study' : `#study/${encodeURIComponent(route.id)}`;
  }
  if (section === 'receipt') {
    const query = routeQuery(route, [
      ['case', 'caseId'],
      ['policy', 'policyId'],
      ['scenario', 'scenarioId'],
    ]);
    return `#receipt/${encodeURIComponent(route.id)}${query}`;
  }
  if (section === 'reference') {
    if (route.id === 'solarpunk') return '#overview';
    if (route.id === 'sepolia') return '#sepolia';
    return route.id ? `#reference/${encodeURIComponent(route.id)}` : '#reference';
  }
  if (section === 'legacy-protocol') return '#protocol';
  return `#${section}`;
}

export function primarySection(route) {
  if (['case', 'cases', 'compare', 'analysis', 'investigate'].includes(route.section)) return 'investigate';
  if (['study', 'studies', 'research'].includes(route.section)) return 'research';
  if (['field', 'evidence', 'currency'].includes(route.section)) return 'field';
  if (['programme', 'receipts', 'receipt', 'verify', 'reference', 'legacy-protocol'].includes(route.section)) return 'programme';
  return 'lab';
}

export function isSepoliaRoute(route) {
  return route.section === 'reference' && route.id === 'sepolia';
}
