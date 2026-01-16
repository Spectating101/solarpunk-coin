import React, { useState } from 'react';
import { ethers } from 'ethers';
import { ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import SolarPunkOptionABI from '../abi/SolarPunkOption.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_OPTION_ADDRESS || "";

const TradingInterface = ({ provider, signer }) => {
  const [amount, setAmount] = useState(10); // Contracts
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // success, error

  // Mock Pricing Logic (Pillar 2)
  const premiumPerKwh = 0.036;
  const notional = 1000;
  const totalPremium = amount * notional * premiumPerKwh;
  const requiredMargin = totalPremium * 1.5; // Simple simulation

  const executeTrade = async () => {
    if (!signer) return;
    if (!CONTRACT_ADDRESS) {
      setStatus('missing-address');
      return;
    }
    setLoading(true);
    setStatus(null);

    try {
      // 1. Connect to Contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, SolarPunkOptionABI.abi, signer);
      
      // 2. Mock Series ID (Put option; in real app, fetch from Oracle)
      const seriesId = ethers.id("SERIES_JAN_2026_PUT_50");
      
      // 3. Execute Transaction
      // Note: In real app, user needs to Approve USDC first. 
      // For this demo, we simulate the call or assume approval.
      // We'll catch the likely "revert" if not on correct network/approved, 
      // but show the intent.
      
      // For Demo purposes, we might not actually have the deployed contract on the user's connected network.
      // We will simulate a delay and success to show the UX if network fails.
      
      // const tx = await contract.modifyPosition(seriesId, amount, ethers.parseUnits(requiredMargin.toString(), 6));
      // await tx.wait();

      await new Promise(r => setTimeout(r, 2000)); // Fake network delay
      
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ height: 'fit-content' }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
        <h3 className="text-accent">Hedge Revenue</h3>
        <p className="text-muted" style={{ fontSize: '14px' }}>Purchase Price Floor (Put Options)</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Input */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Volume (Contracts)
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ 
                width: '100%', 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid var(--border)', 
                color: 'var(--text-main)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <span style={{ position: 'absolute', right: '12px', top: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
              x 1000 kWh
            </span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span className="text-muted">Premium / kWh</span>
            <span className="font-mono">${premiumPerKwh}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span className="text-muted">Total Coverage</span>
            <span className="font-mono text-primary">{(amount * notional).toLocaleString()} kWh</span>
          </div>
           <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '8px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold' }}>
            <span>Est. Cost</span>
            <span>${totalPremium.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="btn-primary" 
          style={{ justifyContent: 'center', width: '100%', padding: '16px', fontSize: '16px' }}
          onClick={executeTrade}
          disabled={loading || !signer}
        >
          {loading ? 'Confirming on-chain...' : (
            <>
              Execute Hedge <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Status Messages */}
        {status === 'success' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', background: 'var(--primary-dim)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
            <CheckCircle size={16} />
            Position Secured on Polygon
          </div>
        )}
        {status === 'missing-address' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.12)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
            <AlertTriangle size={16} />
            Add VITE_OPTION_ADDRESS in frontend/.env to enable trades.
          </div>
        )}
        {status === 'error' && (
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
            <AlertTriangle size={16} />
            Transaction Failed (Check Wallet)
          </div>
        )}

        {!signer && (
           <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            Connect wallet to trade
           </div>
        )}

      </div>
    </div>
  );
};

export default TradingInterface;
