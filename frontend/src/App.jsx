import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { AlertTriangle, Github, Wallet } from 'lucide-react';
import SpkV1Console from './components/SpkV1Console';
import { GITHUB_REPO } from './constants/contracts';
import { ensureSepolia, readWalletChainId, SEPOLIA_CHAIN_ID } from './lib/wallet';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);

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
    if (!provider) return;
    setIsConnecting(true);
    try {
      await ensureSepolia(provider);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setSigner(await provider.getSigner());
      await refreshChain(provider);
    } catch (error) {
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
            <div className="brand-sub">SPK v1 · Sepolia demo</div>
          </div>
        </div>
        <div className="app-minimal-actions">
          <a href={GITHUB_REPO} target="_blank" rel="noreferrer" className="ghost-link">
            <Github size={16} /> GitHub
          </a>
          {account ? (
            <div className="wallet-pill">
              <span />
              {account.slice(0, 6)}…{account.slice(-4)}
            </div>
          ) : (
            <button className="wallet-button compact" onClick={connectWallet} disabled={isConnecting || !provider}>
              <Wallet size={16} />
              {isConnecting ? '…' : 'Connect'}
            </button>
          )}
        </div>
      </header>

      {wrongNetwork ? (
        <div className="spk-network-banner" role="status">
          <AlertTriangle size={16} />
          Switch MetaMask to <strong>Sepolia</strong> to send payments.
          <button type="button" className="ghost-link compact" onClick={connectWallet}>Switch network</button>
        </div>
      ) : null}

      <SpkV1Console
        provider={provider}
        signer={signer}
        account={account}
        onConnect={connectWallet}
        connecting={isConnecting}
      />
    </div>
  );
}

export default App;
