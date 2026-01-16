import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import MarketStats from './components/MarketStats';
import TradingInterface from './components/TradingInterface';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize Ethers
  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    setIsConnecting(true);
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      const newSigner = await provider.getSigner();
      setAccount(accounts[0]);
      setSigner(newSigner);
    } catch (error) {
      console.error("Connection failed", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '48px' }}>
      <Navbar 
        account={account} 
        connectWallet={connectWallet} 
        isConnecting={isConnecting} 
      />

      <main className="grid-layout">
        
        {/* Left Column: Data & Visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h1 style={{ fontSize: '48px', marginBottom: '16px', background: 'linear-gradient(to right, #ecfdf5, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DeFi for the <br/>Energy Transition
            </h1>
            <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px', lineHeight: '1.6' }}>
              Secure revenue floors for renewable assets using physics-priced derivatives. 
              Settled on Polygon, anchored by NASA data.
            </p>
          </div>
          
          <MarketStats />
        </div>

        {/* Right Column: Interaction */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
          <TradingInterface provider={provider} signer={signer} />
          
          {/* Info Card */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ marginBottom: '12px' }}>How it Works</h4>
            <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-muted)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>1. Choose hedge volume (kWh)</li>
              <li>2. Protocol calculates premium (VaR)</li>
              <li>3. Smart Contract locks collateral</li>
              <li>4. Oracle settles against spot price</li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
