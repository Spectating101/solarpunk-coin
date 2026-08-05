import { useEffect } from 'react';
import { parseHashRoute } from './routes';

const FULL_ONLY_SECTIONS = new Set([
  'case',
  'cases',
  'compare',
  'analysis',
  'verify',
  'receipt',
  'receipts',
  'study',
  'studies',
  'reference',
  'legacy-protocol',
  'evidence',
  'currency',
]);

function writeFullAnalysisSearch() {
  const route = parseHashRoute(window.location.hash);
  if (!FULL_ONLY_SECTIONS.has(route.section)) return;

  const url = new URL(window.location.href);
  if (url.searchParams.get('view') === 'full') return;

  url.searchParams.set('view', 'full');
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function FullAnalysisRouteGuard() {
  useEffect(() => {
    writeFullAnalysisSearch();
    window.addEventListener('hashchange', writeFullAnalysisSearch);
    return () => window.removeEventListener('hashchange', writeFullAnalysisSearch);
  }, []);

  return null;
}
