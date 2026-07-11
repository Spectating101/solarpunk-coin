import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AlertTriangle, Github, Wallet } from 'lucide-react';
import PublicLabLanding from './components/PublicLabLanding';
import EvidenceLab from './components/EvidenceLab';
import CurrencyLab from './components/CurrencyLab';
import ResearchPanel from './components/ResearchPanel';
import SpkV1Console from './components/SpkV1Console';
import { GITHUB_REPO } from './constants/contracts';
import { ensureSepolia, readWalletChainId, SEPOLIA_CHAIN_ID } from './lib/wallet';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'evidence', label: 'Evidence Lab' },
  { id: 'currency', label: 'Currency Lab' },
  { id: 'sepolia', label: 'Sepolia Proof' },
  { id: 'research', label: 'Research' },
];

function App() {
  const [tab, setTab] = useState('overview');
  const [receipt, setReceipt] = useState(null);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [connectError, setConnectError] = useState(null);

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

  return (
    <div className="app-minimal">
      <header className="app-minimal-top">
        <div className="brand-block">
          <div className="brand-mark">SP</div>
          <div>
            <div className="brand-name">SolarPunk</div>
            <div className="brand-sub">Public Lab v1.0 · Sepolia</div>
          </div>
        </div>
        <div className="app-minimal-actions">
          <nav className="app-tab-nav" aria-label="Lab sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={tab === t.id ? 'app-tab active' : 'app-tab'}
                onClick={() => setTab(t.id)}
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

      {connectError ? (
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

      {tab === 'overview' ? (
        <PublicLabLanding
          onOpenEvidence={() => setTab('evidence')}
          onOpenCurrency={() => setTab('currency')}
          onOpenSepolia={() => setTab('sepolia')}
          onOpenResearch={() => setTab('research')}
        />
      ) : null}
      {tab === 'evidence' ? (
        <EvidenceLab
          onReceiptReady={(built) => {
            setReceipt(built);
          }}
          onReceiptInvalidated={() => {
            setReceipt(null);
          }}
        />
      ) : null}
      {tab === 'currency' ? <CurrencyLab receipt={receipt} /> : null}
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
