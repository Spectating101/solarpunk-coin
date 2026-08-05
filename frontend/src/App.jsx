import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  Github,
  Layers3,
  Menu,
  Wallet,
  X,
} from 'lucide-react';
import CaseExplorer from './cases/CaseExplorer';
import CaseWorkspace from './cases/CaseWorkspace';
import CompareWorkspace from './compare/CompareWorkspace';
import ReceiptsWorkspace from './receipts/ReceiptsWorkspace';
import DecisionBrief from './components/DecisionBrief';
import EmpiricalRunsLab from './components/EmpiricalRunsLab';
import EmpiricalReproductionLab from './components/EmpiricalReproductionLab';
import LabOverview from './components/LabOverview';
import LabSessionBar from './components/LabSessionBar';
import AnalysisLab from './components/platform/AnalysisLab';
import FieldUseSurface from './components/platform/FieldUseSurface';
import InvestigationSurface from './components/platform/InvestigationSurface';
import ProgrammeSurface from './components/platform/ProgrammeSurface';
import ResearchSurface from './components/platform/ResearchSurface';
import VerificationHub from './components/platform/VerificationHub';
import { useCaseWorkbench } from './app/CaseWorkbenchProvider';
import { GITHUB_REPO } from './constants/contracts';
import {
  clearSessionReceipt,
  loadSessionReceipt,
  saveSessionReceipt,
} from './lib/sessionReceipt';
import { ensureSepolia, readWalletChainId, SEPOLIA_CHAIN_ID } from './lib/wallet';
import {
  FULL_ANALYSIS_NAV,
  PRIMARY_NAV,
  isSepoliaRoute,
  parseHashRoute,
  primarySection,
  routeToHash,
} from './app/routes';
import './workbenchSession.css';
import './constraintProtocol.css';
import './decisionBrief.css';
import './empiricalRuns.css';
import './empiricalReproduction.css';
import './styles/caseWorkbench.css';
import './styles/labOverview.css';
import './styles/platformSurfaces.css';

const ConstraintProtocolLab = lazy(() => import('./components/ConstraintProtocolLab'));
const PublicLabLanding = lazy(() => import('./components/PublicLabLanding'));
const EvidenceLab = lazy(() => import('./components/EvidenceLab'));
const CurrencyLab = lazy(() => import('./components/CurrencyLab'));
const SpkV1Console = lazy(() => import('./components/SpkV1Console'));

function routeFromHash() {
  if (typeof window === 'undefined') return { section: 'lab', id: null };
  return parseHashRoute(window.location.hash);
}

function viewFromSearch() {
  if (typeof window === 'undefined') return 'overview';
  return new URLSearchParams(window.location.search).get('view') === 'full' ? 'full' : 'overview';
}

function pairedOverviewSection(route) {
  if (['case', 'cases', 'compare', 'analysis'].includes(route.section)) return 'investigate';
  if (['study', 'studies'].includes(route.section)) return 'research';
  if (['evidence', 'currency'].includes(route.section)) return 'field';
  if (['receipt', 'receipts', 'verify', 'reference', 'legacy-protocol'].includes(route.section)) return 'programme';
  return route.section;
}

function RouteFallback({ label = 'Loading research surface…' }) {
  return (
    <section className="reproduction-load" aria-live="polite" aria-busy="true">
      <strong>{label}</strong>
    </section>
  );
}

function App() {
  const [route, setRoute] = useState(routeFromHash);
  const [viewMode, setViewMode] = useState(viewFromSearch);
  const [receipt, setReceipt] = useState(loadSessionReceipt);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [connectError, setConnectError] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const {
    activeCaseId,
    activePolicyId,
    activeScenarioId,
  } = useCaseWorkbench();

  const navigate = useCallback((nextRoute) => {
    const resolved = typeof nextRoute === 'string'
      ? parseHashRoute(`#${nextRoute}`)
      : nextRoute;
    const nextHash = routeToHash(resolved);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    } else {
      setRoute(parseHashRoute(nextHash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const setPlatformView = useCallback((nextMode) => {
    setViewMode(nextMode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextMode === 'full') url.searchParams.set('view', 'full');
      else url.searchParams.delete('view');
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
    if (nextMode === 'overview') {
      const paired = pairedOverviewSection(route);
      if (paired !== route.section) navigate({ section: paired });
    }
  }, [navigate, route]);

  const acceptReceipt = useCallback((built) => {
    const summary = saveSessionReceipt(built);
    setReceipt(summary || built);
  }, []);

  const invalidateReceipt = useCallback(() => {
    clearSessionReceipt();
    setReceipt(null);
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}#lab`,
      );
    }

    const syncHash = () => {
      setRoute(routeFromHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const syncView = () => setViewMode(viewFromSearch());

    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncView);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncView);
    };
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [route.section, route.id]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileNavOpen]);

  const refreshChain = useCallback(async (p) => {
    if (!p) return;
    try {
      setChainId(await readWalletChainId(p));
    } catch {
      setChainId(null);
    }
  }, []);

  const sepRoute = isSepoliaRoute(route);

  useEffect(() => {
    if (!sepRoute || !window.ethereum) return undefined;

    let active = true;
    let browserProvider = null;
    let onAccountsChanged = null;
    let onChainChanged = null;

    const initializeWallet = async () => {
      const { BrowserProvider } = await import('ethers');
      if (!active) return;

      browserProvider = new BrowserProvider(window.ethereum);
      setProvider(browserProvider);
      setConnectError(null);

      const syncAccount = async (accounts) => {
        if (!active) return;
        if (accounts?.[0]) {
          setAccount(accounts[0]);
          setSigner(await browserProvider.getSigner());
        } else {
          setAccount(null);
          setSigner(null);
        }
        await refreshChain(browserProvider);
      };

      browserProvider.send('eth_accounts', [])
        .then((accounts) => syncAccount(accounts))
        .catch(() => {});

      onAccountsChanged = (accounts) => { syncAccount(accounts); };
      onChainChanged = () => { refreshChain(browserProvider); };

      window.ethereum.on('accountsChanged', onAccountsChanged);
      window.ethereum.on('chainChanged', onChainChanged);
    };

    initializeWallet().catch((error) => {
      if (!active) return;
      setProvider(null);
      setConnectError(error?.message || 'Wallet provider failed to initialize.');
    });

    return () => {
      active = false;
      if (onAccountsChanged) window.ethereum.removeListener('accountsChanged', onAccountsChanged);
      if (onChainChanged) window.ethereum.removeListener('chainChanged', onChainChanged);
    };
  }, [refreshChain, sepRoute]);

  const connectWallet = async () => {
    if (!provider) {
      setConnectError('MetaMask not detected or still loading. Install the extension and reload this page.');
      return;
    }
    setIsConnecting(true);
    setConnectError(null);
    try {
      await ensureSepolia(provider);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setSigner(await provider.getSigner());
      await refreshChain(provider);
    } catch (error) {
      const message = error?.shortMessage || error?.message || 'Wallet connection failed';
      setConnectError(message);
      console.error('Connection failed', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const wrongNetwork = account && chainId != null && chainId !== SEPOLIA_CHAIN_ID;
  const showSessionBar = ['evidence', 'currency'].includes(route.section) || sepRoute;
  const activePrimary = primarySection(route);
  const navigatePrimary = (section) => {
    setMobileNavOpen(false);
    navigate({ section });
  };
  const navigateFullTool = (section) => {
    setPlatformView('full');
    setMobileNavOpen(false);
    navigate({ section });
  };

  return (
    <div className={`app-minimal paired-platform-app ${viewMode === 'full' ? 'full-analysis-active' : ''}`}>
      <header className="app-minimal-top workbench-app-top paired-platform-top">
        <div className="brand-block">
          <div className="brand-mark">S</div>
          <div>
            <div className="brand-name">Solarpunk</div>
            <div className="brand-sub">Policy Lab · evidence-bounded financial claims</div>
          </div>
        </div>
        <div className="app-minimal-actions">
          <nav className="app-tab-nav desktop-primary-nav" aria-label="Solarpunk platform sections">
            {PRIMARY_NAV.map((item) => (
              <button
                key={item.section}
                type="button"
                className={activePrimary === item.section ? 'app-tab active' : 'app-tab'}
                onClick={() => navigatePrimary(item.section)}
                aria-current={activePrimary === item.section ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="global-view-switch" role="group" aria-label="Platform information depth">
            <button type="button" className={viewMode === 'overview' ? 'active' : ''} onClick={() => setPlatformView('overview')} aria-pressed={viewMode === 'overview'}>Overview</button>
            <button type="button" className={viewMode === 'full' ? 'active' : ''} onClick={() => setPlatformView('full')} aria-pressed={viewMode === 'full'}>Full analysis</button>
          </div>
          <a href={GITHUB_REPO} target="_blank" rel="noreferrer" className="ghost-link desktop-repo-link">
            <Github size={16} /> GitHub
          </a>
          {sepRoute && (
            account ? (
              <div className="wallet-pill"><span />{account.slice(0, 6)}…{account.slice(-4)}</div>
            ) : (
              <button className="wallet-button compact" onClick={connectWallet} disabled={isConnecting || !provider}>
                <Wallet size={16} />{isConnecting ? '…' : 'Connect'}
              </button>
            )
          )}
          <button
            type="button"
            className="mobile-nav-trigger"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-primary-menu"
            aria-label={mobileNavOpen ? 'Close primary navigation' : 'Open primary navigation'}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}<span>Menu</span>
          </button>
        </div>
        <div id="mobile-primary-menu" className={mobileNavOpen ? 'mobile-primary-menu open' : 'mobile-primary-menu'}>
          {PRIMARY_NAV.map((item) => (
            <button key={item.section} type="button" className={activePrimary === item.section ? 'active' : ''} onClick={() => navigatePrimary(item.section)}>
              <span>{item.label}</span><ChevronRight size={16} />
            </button>
          ))}
          <button type="button" onClick={() => setPlatformView(viewMode === 'full' ? 'overview' : 'full')}>
            <span><Layers3 size={16} /> Switch to {viewMode === 'full' ? 'Overview' : 'Full analysis'}</span><ChevronRight size={16} />
          </button>
          {viewMode === 'full' ? FULL_ANALYSIS_NAV.map((item) => (
            <button key={item.section} type="button" onClick={() => navigateFullTool(item.section)}>
              <span>{item.label}</span><ChevronRight size={16} />
            </button>
          )) : null}
          <a href={GITHUB_REPO} target="_blank" rel="noreferrer">
            <span><Github size={16} /> GitHub repository</span><ChevronRight size={16} />
          </a>
        </div>
      </header>

      {viewMode === 'full' ? (
        <nav className="full-analysis-nav" aria-label="Shared full-analysis workspaces">
          <span>Shared workspaces</span>
          {FULL_ANALYSIS_NAV.map((item) => (
            <button key={item.section} type="button" className={route.section === item.section ? 'active' : ''} onClick={() => navigateFullTool(item.section)}>{item.label}</button>
          ))}
        </nav>
      ) : null}

      {showSessionBar ? (
        <LabSessionBar receipt={receipt} activeTab={sepRoute ? 'sepolia' : route.section} onNavigate={navigate} onClearReceipt={invalidateReceipt} />
      ) : null}

      {connectError && sepRoute ? <div className="spk-network-banner spk-error-banner" role="alert"><AlertTriangle size={16} />{connectError}</div> : null}
      {sepRoute && wrongNetwork ? (
        <div className="spk-network-banner" role="status">
          <AlertTriangle size={16} />Switch MetaMask to <strong>Sepolia</strong> to send payments.
          <button type="button" className="ghost-link compact" onClick={connectWallet}>Switch network</button>
        </div>
      ) : null}

      {route.section === 'lab' ? <LabOverview viewMode={viewMode} onViewModeChange={setPlatformView} onNavigate={navigate} /> : null}

      {route.section === 'investigate' && viewMode === 'overview' ? (
        <InvestigationSurface onNavigate={navigate} onOpenFullAnalysis={() => setPlatformView('full')} />
      ) : null}
      {route.section === 'investigate' && viewMode === 'full' ? (
        <>
          <section className="platform-page paired-full-bridge" aria-label="Full investigation bridge">
            <span className="wb-kicker">Full investigation · same active state</span>
            <h1>Every admission gate, quantity ceiling, stress condition, identity, and artifact.</h1>
            <p>The selected case, policy, assurance scenario, and settlement condition come directly from the shared workbench state.</p>
          </section>
          <CaseWorkspace caseId={activeCaseId} policyId={activePolicyId} scenarioId={activeScenarioId} initialLens="constraints" onNavigate={navigate} />
        </>
      ) : null}

      {route.section === 'research' ? <ResearchSurface viewMode={viewMode} onNavigate={navigate} onOpenFullAnalysis={() => setPlatformView('full')} /> : null}
      {route.section === 'field' ? <FieldUseSurface viewMode={viewMode} onNavigate={navigate} onOpenFullAnalysis={() => setPlatformView('full')} /> : null}
      {route.section === 'programme' ? <ProgrammeSurface viewMode={viewMode} onNavigate={navigate} onOpenFullAnalysis={() => setPlatformView('full')} /> : null}
      {route.section === 'analysis' ? <AnalysisLab initialTool={route.tool || 'cases'} onNavigate={navigate} /> : null}
      {route.section === 'verify' ? <VerificationHub initialTool={route.tool || 'lineage'} onNavigate={navigate} /> : null}

      {route.section === 'cases' ? <CaseExplorer onOpenCase={(caseId) => navigate({ section: 'case', id: caseId })} /> : null}
      {route.section === 'case' ? (
        <CaseWorkspace caseId={route.id} policyId={route.policyId} scenarioId={route.scenarioId} initialLens={route.lens} onNavigate={navigate} />
      ) : null}
      {route.section === 'compare' ? (
        <CompareWorkspace scenarioId={route.scenarioId} baselinePolicyId={route.baselinePolicyId} comparisonPolicyId={route.comparisonPolicyId} onNavigate={navigate} />
      ) : null}
      {route.section === 'receipts' || route.section === 'receipt' ? (
        <ReceiptsWorkspace
          receiptId={route.section === 'receipt' ? route.id : null}
          routeContext={route.section === 'receipt' ? route : null}
          onOpenReceipt={(run) => navigate({
            section: 'receipt',
            id: run.decision.decision_id,
            caseId: run.caseManifest.case_id,
            policyId: run.policy.id,
            scenarioId: run.scenario.scenario_id,
          })}
          onNavigate={navigate}
        />
      ) : null}

      {route.section === 'studies' || (route.section === 'study' && route.view === 'brief') ? (
        <DecisionBrief
          onOpenStudy={() => navigate({ section: 'study', id: 'market-capacity-v1', view: 'detail' })}
          onOpenReproduce={() => navigate({ section: 'study', id: 'market-capacity-v1', view: 'reproduce' })}
          onOpenProtocol={() => navigate({ section: 'legacy-protocol' })}
        />
      ) : null}
      {route.section === 'study' && route.view === 'detail' ? <EmpiricalRunsLab onOpenProtocol={() => navigate({ section: 'legacy-protocol' })} /> : null}
      {route.section === 'study' && route.view === 'reproduce' ? <EmpiricalReproductionLab onOpenRuns={() => navigate({ section: 'study', id: 'market-capacity-v1', view: 'detail' })} /> : null}
      {route.section === 'legacy-protocol' ? (
        <Suspense fallback={<RouteFallback label="Loading protocol laboratory…" />}>
          <ConstraintProtocolLab onOpenSepolia={() => navigate({ section: 'reference', id: 'sepolia' })} />
        </Suspense>
      ) : null}

      {route.section === 'reference' && (!route.id || route.id === 'solarpunk') ? (
        <Suspense fallback={<RouteFallback label="Loading SolarPunk reference lab…" />}>
          <PublicLabLanding
            onOpenEvidence={() => navigate({ section: 'evidence' })}
            onOpenCurrency={() => navigate({ section: 'currency' })}
            onOpenSepolia={() => navigate({ section: 'reference', id: 'sepolia' })}
            onOpenResearch={() => navigate({ section: 'research' })}
          />
        </Suspense>
      ) : null}
      {route.section === 'evidence' ? (
        <Suspense fallback={<RouteFallback label="Loading browser evidence lab…" />}>
          <EvidenceLab activeReceipt={receipt} onContinue={() => navigate({ section: 'currency' })} onReceiptReady={acceptReceipt} onReceiptInvalidated={invalidateReceipt} />
        </Suspense>
      ) : null}
      {route.section === 'currency' ? (
        <Suspense fallback={<RouteFallback label="Loading currency simulation lab…" />}>
          <CurrencyLab receipt={receipt} onOpenEvidence={() => navigate({ section: 'evidence' })} onOpenSepolia={() => navigate({ section: 'reference', id: 'sepolia' })} />
        </Suspense>
      ) : null}
      {sepRoute ? (
        <Suspense fallback={<RouteFallback label="Loading Sepolia proof…" />}>
          <SpkV1Console provider={provider} signer={signer} account={account} onConnect={connectWallet} connecting={isConnecting} wrongNetwork={wrongNetwork} />
        </Suspense>
      ) : null}
    </div>
  );
}

export default App;
