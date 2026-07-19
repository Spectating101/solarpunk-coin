import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Github, Wallet } from 'lucide-react';
import CaseExplorer from './cases/CaseExplorer';
import CaseWorkspace from './cases/CaseWorkspace';
import CompareWorkspace from './compare/CompareWorkspace';
import ReceiptsWorkspace from './receipts/ReceiptsWorkspace';
import ConstraintProtocolLab from './components/ConstraintProtocolLab';
import DecisionBrief from './components/DecisionBrief';
import EmpiricalRunsLab from './components/EmpiricalRunsLab';
import EmpiricalReproductionLab from './components/EmpiricalReproductionLab';
import LabOverview from './components/LabOverview';
import LabSessionBar from './components/LabSessionBar';
import { GITHUB_REPO } from './constants/contracts';
import {
  clearSessionReceipt,
  loadSessionReceipt,
  saveSessionReceipt,
} from './lib/sessionReceipt';
import { ensureSepolia, readWalletChainId, SEPOLIA_CHAIN_ID } from './lib/wallet';
import {
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

const PublicLabLanding = lazy(() => import('./components/PublicLabLanding'));
const EvidenceLab = lazy(() => import('./components/EvidenceLab'));
const CurrencyLab = lazy(() => import('./components/CurrencyLab'));
const ResearchPanel = lazy(() => import('./components/ResearchPanel'));
const SpkV1Console = lazy(() => import('./components/SpkV1Console'));

function routeFromHash() {
  if (typeof window === 'undefined') return { section: 'lab', id: null };
  return parseHashRoute(window.location.hash);
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
  const [receipt, setReceipt] = useState(loadSessionReceipt);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [connectError, setConnectError] = useState(null);

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

    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

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

  return (
    <div className="app-minimal">
      <header className="app-minimal-top workbench-app-top">
        <div className="brand-block">
          <div className="brand-mark">P</div>
          <div>
            <div className="brand-name">Policy Lab</div>
            <div className="brand-sub">case research · bounded decisions · reproducible receipts</div>
          </div>
        </div>
        <div className="app-minimal-actions">
          <nav className="app-tab-nav" aria-label="Research workbench sections">
            {PRIMARY_NAV.map((item) => (
              <button
                key={item.section}
                type="button"
                className={activePrimary === item.section ? 'app-tab active' : 'app-tab'}
                onClick={() => navigate({ section: item.section })}
                aria-current={activePrimary === item.section ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <a href={GITHUB_REPO} target="_blank" rel="noreferrer" className="ghost-link">
            <Github size={16} /> GitHub
          </a>
          {sepRoute && (
            account ? (
              <div className="wallet-pill">
                <span />
                {account.slice(0, 6)}…{account.slice(-4)}
              </div>
            ) : (
              <button className="wallet-button compact" onClick={connectWallet} disabled={isConnecting || !provider}>
                <Wallet size={16} />
                {isConnecting ? '…' : 'Connect'}
              </button>
            )
          )}
        </div>
      </header>

      {showSessionBar ? (
        <LabSessionBar
          receipt={receipt}
          activeTab={sepRoute ? 'sepolia' : route.section}
          onNavigate={navigate}
          onClearReceipt={invalidateReceipt}
        />
      ) : null}

      {connectError && sepRoute ? (
        <div className="spk-network-banner spk-error-banner" role="alert">
          <AlertTriangle size={16} />
          {connectError}
        </div>
      ) : null}

      {sepRoute && wrongNetwork ? (
        <div className="spk-network-banner" role="status">
          <AlertTriangle size={16} />
          Switch MetaMask to <strong>Sepolia</strong> to send payments.
          <button type="button" className="ghost-link compact" onClick={connectWallet}>Switch network</button>
        </div>
      ) : null}

      {route.section === 'lab' ? <LabOverview onNavigate={navigate} /> : null}
      {route.section === 'cases' ? (
        <CaseExplorer onOpenCase={(caseId) => navigate({ section: 'case', id: caseId })} />
      ) : null}
      {route.section === 'case' ? (
        <CaseWorkspace
          caseId={route.id}
          policyId={route.policyId}
          scenarioId={route.scenarioId}
          initialLens={route.lens}
          onNavigate={navigate}
        />
      ) : null}
      {route.section === 'compare' ? (
        <CompareWorkspace
          scenarioId={route.scenarioId}
          onNavigate={navigate}
        />
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
      {route.section === 'study' && route.view === 'detail' ? (
        <EmpiricalRunsLab onOpenProtocol={() => navigate({ section: 'legacy-protocol' })} />
      ) : null}
      {route.section === 'study' && route.view === 'reproduce' ? (
        <EmpiricalReproductionLab onOpenRuns={() => navigate({ section: 'study', id: 'market-capacity-v1', view: 'detail' })} />
      ) : null}
      {route.section === 'legacy-protocol' ? (
        <ConstraintProtocolLab onOpenSepolia={() => navigate({ section: 'reference', id: 'sepolia' })} />
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
          <EvidenceLab
            activeReceipt={receipt}
            onContinue={() => navigate({ section: 'currency' })}
            onReceiptReady={acceptReceipt}
            onReceiptInvalidated={invalidateReceipt}
          />
        </Suspense>
      ) : null}
      {route.section === 'currency' ? (
        <Suspense fallback={<RouteFallback label="Loading currency simulation lab…" />}>
          <CurrencyLab
            receipt={receipt}
            onOpenEvidence={() => navigate({ section: 'evidence' })}
            onOpenSepolia={() => navigate({ section: 'reference', id: 'sepolia' })}
          />
        </Suspense>
      ) : null}
      {sepRoute ? (
        <Suspense fallback={<RouteFallback label="Loading Sepolia proof…" />}>
          <SpkV1Console
            provider={provider}
            signer={signer}
            account={account}
            onConnect={connectWallet}
            connecting={isConnecting}
            wrongNetwork={wrongNetwork}
          />
        </Suspense>
      ) : null}
      {route.section === 'research' ? (
        <Suspense fallback={<RouteFallback label="Loading research reference…" />}>
          <ResearchPanel />
        </Suspense>
      ) : null}
    </div>
  );
}

export default App;
