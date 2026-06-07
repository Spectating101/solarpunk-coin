import React, { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import {
  BarChart3,
  BookOpen,
  Coins,
  Gauge,
  Github,
  RadioTower,
  Leaf,
  FlaskConical,
  Rocket,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import ProofDashboard from './components/ProofDashboard';
import TradingInterface from './components/TradingInterface';
import PositionsList from './components/PositionsList';
import SystemIntegrity from './components/SystemIntegrity';
import MarketStats from './components/MarketStats';
import SPKMintDemo from './components/SPKMintDemo';
import LaunchConsole from './components/LaunchConsole';
import SpkV1Console from './components/SpkV1Console';
import CurrencyLab from './components/CurrencyLab';
import { GITHUB_REPO, KEEPER_WORKFLOW } from './constants/contracts';

const tabs = [
  { id: 'spk-v1', label: 'SPK v1', icon: Rocket },
  { id: 'currency', label: 'Currency Lab', icon: Coins },
  { id: 'mint', label: 'Mint (archive)', icon: Leaf },
  { id: 'proof', label: 'Proof (archive)', icon: RadioTower },
  { id: 'launch', label: 'Lab (archive)', icon: FlaskConical },
  { id: 'market', label: 'Options (archive)', icon: BarChart3 },
  { id: 'hedge', label: 'Hedge (archive)', icon: Wallet },
  { id: 'status', label: 'Status', icon: ShieldCheck },
];

function App() {
  const TEST_COUNT = 109;

  const [activeTab, setActiveTab] = useState('spk-v1');
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    setIsConnecting(true);
    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      const newSigner = await provider.getSigner();
      setAccount(accounts[0]);
      setSigner(newSigner);
    } catch (error) {
      console.error('Connection failed', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const activeTitle = useMemo(() => tabs.find((tab) => tab.id === activeTab)?.label ?? 'Proof', [activeTab]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">SP</div>
          <div>
            <div className="brand-name">SolarPunk</div>
            <div className="brand-sub">SPK v1 · Sepolia</div>
          </div>
        </div>

        <nav className="side-nav" aria-label="Primary">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <div className="sidebar-card-title"><Gauge size={14} /> SPK v1 Runtime</div>
          <div className="sidebar-row"><span>Network</span><strong>Sepolia</strong></div>
          <div className="sidebar-row"><span>Policy</span><strong>Energy-native</strong></div>
          <div className="sidebar-row"><span>Tests</span><strong>{TEST_COUNT} passing</strong></div>
        </div>

        <div className="sidebar-links">
          <a href={GITHUB_REPO} target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>
          <a href={KEEPER_WORKFLOW} target="_blank" rel="noreferrer"><BookOpen size={14} /> Keeper logs</a>
        </div>
      </aside>

      <main className="main-surface">
        <header className="topbar">
          <div>
            <div className="topbar-kicker">Demo interface</div>
            <h1>{activeTitle}</h1>
          </div>
          {!account ? (
            <button className="wallet-button" onClick={connectWallet} disabled={isConnecting || !provider}>
              <Wallet size={17} />
              {isConnecting ? 'Connecting...' : provider ? 'Connect Wallet' : 'No Wallet'}
            </button>
          ) : (
            <div className="wallet-pill">
              <span />
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </header>

        {activeTab === 'proof' && <ProofDashboard />}

        {activeTab === 'mint' && <SPKMintDemo />}

        {activeTab === 'launch' && <LaunchConsole />}

        {activeTab === 'spk-v1' && <SpkV1Console provider={provider} signer={signer} account={account} />}

        {activeTab === 'currency' && <CurrencyLab />}

        {activeTab === 'market' && (
          <div className="tab-grid">
            <MarketStats />
            <SystemIntegrity />
          </div>
        )}

        {activeTab === 'hedge' && (
          <div className="tab-grid hedge-grid">
            <TradingInterface provider={provider} signer={signer} />
            <PositionsList provider={provider} signer={signer} />
          </div>
        )}

        {activeTab === 'status' && (
          <div className="status-stack">
            <SystemIntegrity />
            <div className="panel">
              <div className="panel-heading compact">
                <div>
                  <div className="panel-kicker">Scope</div>
                  <h2>What this interface claims</h2>
                </div>
              </div>
              <div className="scope-list">
                <div><strong>Canonical:</strong> SPK v1 energy-native stack on Sepolia — runtime in <code>/spk_v1.json</code>, operator cycles, network payments.</div>
                <div><strong>Archive tabs:</strong> May 2026 attested mint proof, April 2026 options/treasury demo, local lab JSON artifacts.</div>
                <div><strong>Does not claim:</strong> mainnet readiness, audit completion, or revenue-grade meter finality.</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
