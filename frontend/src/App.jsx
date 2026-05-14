import React, { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import {
  BarChart3,
  BookOpen,
  Gauge,
  Github,
  RadioTower,
  Leaf,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import ProofDashboard from './components/ProofDashboard';
import TradingInterface from './components/TradingInterface';
import PositionsList from './components/PositionsList';
import SystemIntegrity from './components/SystemIntegrity';
import MarketStats from './components/MarketStats';
import SPKMintDemo from './components/SPKMintDemo';
import { GITHUB_REPO, KEEPER_WORKFLOW } from './constants/contracts';

const tabs = [
  { id: 'proof', label: 'Proof', icon: RadioTower },
  { id: 'mint', label: 'SPK Mint', icon: Leaf },
  { id: 'market', label: 'Market', icon: BarChart3 },
  { id: 'hedge', label: 'Hedge', icon: Wallet },
  { id: 'status', label: 'Status', icon: ShieldCheck },
];

function App() {
  const TEST_COUNT = 96;

  const [activeTab, setActiveTab] = useState('proof');
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
            <div className="brand-sub">Protocol · Sepolia</div>
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
          <div className="sidebar-card-title"><Gauge size={14} /> Live Experiment</div>
          <div className="sidebar-row"><span>Network</span><strong>Sepolia</strong></div>
          <div className="sidebar-row"><span>Keeper</span><strong>Daily</strong></div>
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
                <div><strong>Shows:</strong> live Sepolia reads, keeper artifacts, NASA-derived index history, SPK mint proof path, explorer links.</div>
                <div><strong>Does not claim:</strong> mainnet readiness, formal audit completion, or production oracle finality.</div>
                <div><strong>Next real upgrade:</strong> move the attestation-enabled SPK stack from proof-scoped deployment to governed pilot deployment and hardware-backed meter adapters.</div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-heading compact">
                <div>
                  <div className="panel-kicker">Grant packet</div>
                  <h2>What funding unlocks next</h2>
                </div>
              </div>
              <div className="grant-grid">
                <div><strong>Security</strong><span>External audit scope, invariant review, and hardened deployment runbooks.</span></div>
                <div><strong>Oracle</strong><span>Production data adapter design, fallback feeds, and documented freshness guarantees.</span></div>
                <div><strong>Meter Proof</strong><span>Partner-facing adapter, signed meter bundles, and continuous real-data experiment expansion.</span></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
