import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Github, Wallet } from 'lucide-react';
import ConstraintProtocolLab from './components/ConstraintProtocolLab';
import DecisionBrief from './components/DecisionBrief';
import EmpiricalRunsLab from './components/EmpiricalRunsLab';
import EmpiricalReproductionLab from './components/EmpiricalReproductionLab';
import PublicLabLanding from './components/PublicLabLanding';
import EvidenceLab from './components/EvidenceLab';
import CurrencyLab from './components/CurrencyLab';
import LabSessionBar from './components/LabSessionBar';
import ResearchPanel from './components/ResearchPanel';
import SpkV1Console from './components/SpkV1Console';
import { GITHUB_REPO } from './constants/contracts';
import {
  clearSessionReceipt,
  loadSessionReceipt,
  saveSessionReceipt,
} from './lib/sessionReceipt';
import { ensureSepolia, readWalletChainId, SEPOLIA_CHAIN_ID } from './lib/wallet';
import './workbenchSession.css';
import './constraintProtocol.css';
import './decisionBrief.css';
import './empiricalRuns.css';
import './empiricalReproduction.css';

const NAV_TABS = [
  { id: 'runs', label: 'Decision Brief' },
  { id: 'reproduce', label: 'Reproduce' },
  { id: 'protocol', label: 'Claim Lab' },
  { id: 'overview', label: 'SolarPunk' },
  { id: 'sepolia', label: 'Sepolia Proof' },
  { id: 'research', label: 'Research' },
];

const ROUTE_IDS = new Set([
  ...NAV_TABS.map((tab) => tab.id),
  'study',
  'evidence',
  'currency',
]);

function tabFromHash() {
  if (typeof window === 'undefined') return 'runs';
  const candidate = window.location.hash.replace(/^#/, '').toLowerCase();
  return ROUTE_IDS.has(candidate) ? candidate : 'runs';
}

function App() {
  const [tab, setTab] = useState(tabFromHash);
  const [receipt, setReceipt] = useState(loadSessionReceipt);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [connectError, setConnectError] = useState(null);

  const navigate = useCallback((nextTab) => {
    if (!ROUTE_IDS.has(nextTab)) return;
    if (window.location.hash !== `#${nextTab}`) {
      window.location.hash = nextTab;
    } else {
      setTab(nextTab);
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
        `${window.location.pathname}${window.location.search}#runs`,
      );
    }

    const syncHash = () => {
      setTab(tabFromHash());
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

  useEffect(() => {
    if (tab !== 'sepolia' || !window.ethereum) return undefined;

    let active = true;
    let browserProvider = null;
    let onAccountsChanged = null;
    let onChainChanged = null;

    const initializeWallet = async () => {
      const { BrowserProvider } = await import('ethers');
      if (!active) return;

      browserProvider = new BrowserProvider(window.ethereum);
      setProvider(browserProvider);

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
  }, [refreshChain, tab]);

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
  const showSessionBar = ['evidence', 'currency', 'sepolia'].includes(tab);
  const activeNavTab = tab === 'study' ? 'runs' : tab;

  return (
    <div className="app-minimal">
      <header className="app-minimal-top">
        <div className="brand-block">
          <div className="brand-mark">P</div>
          <div>
            <div className="brand-name">Policy Lab</div>
            <div className="brand-sub">historical policy evaluation · bounded claims</div>
          </div>
        </div>
        <div className="app-minimal-actions">
          <nav className="app-tab-nav" aria-label="Lab sections">
            {NAV_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={activeNavTab === t.id ? 'app-tab active' : 'app-tab'}
                onClick={() => navigate(t.id)}
                aria-current={activeNavTab === t.id ? 'page' : undefined}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <a href={GITHUB_REPO} target="_blank" rel="noreferrer" className="ghost-link">
            <Github size={16} /> GitHub
          </a>
          {tab === 'sepolia' && (
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
          activeTab={tab}
          onNavigate={navigate}
          onClearReceipt={invalidateReceipt}
        />
      ) : null}

      {connectError && tab === 'sepolia' ? (
        <div className="spk-network-banner spk-error-banner" role="alert">
          <AlertTriangle size={16} />
          {connectError}
        </div>
      ) : null}

      {tab === 'sepolia' && wrongNetwork ? (
        <div className="spk-network-banner" role="status">
          <AlertTriangle size={16} />
          Switch MetaMask to <strong>Sepolia</strong> to send payments.
          <button type="button" className="ghost-link compact" onClick={connectWallet}>Switch network</button>
        </div>
      ) : null}

      {tab === 'runs' ? (
        <DecisionBrief
          onOpenStudy={() => navigate('study')}
          onOpenReproduce={() => navigate('reproduce')}
          onOpenProtocol={() => navigate('protocol')}
        />
      ) : null}
      {tab === 'study' ? (
        <EmpiricalRunsLab onOpenProtocol={() => navigate('protocol')} />
      ) : null}
      {tab === 'reproduce' ? (
        <EmpiricalReproductionLab onOpenRuns={() => navigate('study')} />
      ) : null}
      {tab === 'protocol' ? (
        <ConstraintProtocolLab onOpenSepolia={() => navigate('sepolia')} />
      ) : null}
      {tab === 'overview' ? (
        <PublicLabLanding
          onOpenEvidence={() => navigate('evidence')}
          onOpenCurrency={() => navigate('currency')}
          onOpenSepolia={() => navigate('sepolia')}
          onOpenResearch={() => navigate('research')}
        />
      ) : null}
      {tab === 'evidence' ? (
        <EvidenceLab
          activeReceipt={receipt}
          onContinue={() => navigate('currency')}
          onReceiptReady={acceptReceipt}
          onReceiptInvalidated={invalidateReceipt}
        />
      ) : null}
      {tab === 'currency' ? (
        <CurrencyLab
          receipt={receipt}
          onOpenEvidence={() => navigate('evidence')}
          onOpenSepolia={() => navigate('sepolia')}
        />
      ) : null}
      {tab === 'sepolia' ? (
        <SpkV1Console
          provider={provider}
          signer={signer}
          account={account}
          onConnect={connectWallet}
          connecting={isConnecting}
          wrongNetwork={wrongNetwork}
        />
      ) : null}
      {tab === 'research' ? <ResearchPanel /> : null}
    </div>
  );
}

export default App;
