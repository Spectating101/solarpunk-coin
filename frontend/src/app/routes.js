const STATIC_SECTIONS = new Set([
  'lab',
  'cases',
  'compare',
  'studies',
  'receipts',
  'reference',
  'legacy-protocol',
  'evidence',
  'currency',
  'research',
]);

const LEGACY_ROUTES = Object.freeze({
  runs: { section: 'study', id: 'market-capacity-v1', view: 'brief', legacy: 'runs' },
  study: { section: 'study', id: 'market-capacity-v1', view: 'detail', legacy: 'study' },
  reproduce: { section: 'study', id: 'market-capacity-v1', view: 'reproduce', legacy: 'reproduce' },
  protocol: { section: 'legacy-protocol', id: null, legacy: 'protocol' },
  overview: { section: 'reference', id: 'solarpunk', legacy: 'overview' },
  sepolia: { section: 'reference', id: 'sepolia', legacy: 'sepolia' },
  research: { section: 'research', id: null, legacy: 'research' },
  evidence: { section: 'evidence', id: null, legacy: 'evidence' },
  currency: { section: 'currency', id: null, legacy: 'currency' },
});

export const PRIMARY_NAV = Object.freeze([
  { section: 'lab', label: 'Overview' },
  { section: 'cases', label: 'Cases' },
  { section: 'compare', label: 'Compare' },
  { section: 'studies', label: 'Studies' },
  { section: 'receipts', label: 'Receipts' },
  { section: 'reference', label: 'Reference' },
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

  if (section === 'case') return { section: 'case', id, policyId, scenarioId, lens };
  if (section === 'compare') return { section: 'compare', id: null, scenarioId };
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
    return `#compare${routeQuery(route, [['scenario', 'scenarioId']])}`;
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
  if (route.section === 'case') return 'cases';
  if (route.section === 'study') return 'studies';
  if (route.section === 'receipt') return 'receipts';
  if (route.section === 'legacy-protocol') return 'cases';
  return route.section;
}

export function isSepoliaRoute(route) {
  return route.section === 'reference' && route.id === 'sepolia';
}
