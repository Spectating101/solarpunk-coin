import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AlertTriangle, Github, Wallet } from 'lucide-react';
import ConstraintProtocolLab from './components/ConstraintProtocolLab';
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

const TABS = [
  { id: 'protocol', label: 'Protocol Alpha' },
  { id: 'overview', label: 'SPK Reference' },
  { id: 'evidence', label: 'Evidence Lab' },
  { id: 'currency', label: 'Currency Lab' },
  { id: 'sepolia', label: 'Sepolia Proof' },
  { id: 'research', label: 'Research' },
];

const TAB_IDS = new Set(TABS.map((tab) => tab.id));

function tabFromHash() {
  if (typeof window === 'undefined') return 'protocol';
  const candidate = window.location.hash.replace(/^#/, '').toLowerCase();
  return TAB_IDS.has(candidate) ? candidate : 'protocol';
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
    if (!TAB_IDS.has(nextTab)) return;
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
        `${window.location.pathname}${window.location.search}#protocol`,
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
    if (!window.ethereum) return undefined;

    const p = new ethers.BrowserProvider(window.ethereum);
    setProvider(p);

    const syncAccount = async (accounts) => {
      if (accounts?.[0]) {
        setAccount(accounts[0]);
        setSigner(await p.getSigner());
      } else {
        setAccount(null);
        setSigner(null);
      }
      await refreshChain(p);
    };

    p.send('eth_accounts', [])
      .then((accounts) => syncAccount(accounts))
      .catch(() => {});

    const onAccountsChanged = (accounts) => { syncAccount(accounts); };
    const onChainChanged = () => { refreshChain(p); };

    window.ethereum.on('accountsChanged', onAccountsChanged);
    window.ethereum.on('chainChanged', onChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged);
      window.ethereum.removeListener('chainChanged', onChainChanged);
    };
  }, [refreshChain]);

  const connectWallet = async () => {
    if (!provider) {
      setConnectError('MetaMask not detected. Install the extension and reload this page.');
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

  return (
    <div className="app-minimal">
      <header className="app-minimal-top">
        <div className="brand-block">
          <div className="brand-mark">SP</div>
          <div>
            <div className="brand-name">SolarPunk</div>
            <div className="brand-sub">Constraint Protocol alpha · SPK reference app</div>
          </div>
        </div>
        <div className="app-minimal-actions">
          <nav className="app-tab-nav" aria-label="Lab sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={tab === t.id ? 'app-tab active' : 'app-tab'}
                onClick={() => navigate(t.id)}
                aria-current={tab === t.id ? 'page' : undefined}
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
