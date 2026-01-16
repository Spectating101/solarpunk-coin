import React from 'react';
import { Wallet, Sun, Battery, Shield } from 'lucide-react';

const Navbar = ({ account, connectWallet, isConnecting }) => {
  return (
    <nav style={{ 
      borderBottom: '1px solid var(--border)', 
      padding: '16px 24px', 
      background: 'rgba(10, 15, 13, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'var(--primary)', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sun size={20} color="#000" />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            Solar<span className="text-primary">Punk</span> Protocol
          </span>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={14} /> Solvency: 150%
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Battery size={14} /> Grid: Stable
                </span>
            </div>
            
            {!account ? (
            <button 
                className="btn-primary" 
                onClick={connectWallet}
                disabled={isConnecting}
            >
                <Wallet size={18} />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
            ) : (
            <div className="status-badge status-active">
                <span style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginRight: '8px' }}></span>
                {account.slice(0, 6)}...{account.slice(-4)}
            </div>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
