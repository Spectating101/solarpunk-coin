import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Shield, ShieldAlert, Zap, Clock } from 'lucide-react';
import OPTION_ABI from '../abi/SolarPunkOption.json';
import { CONTRACTS, LIVE_OPTION_SERIES } from '../constants/contracts';

const OPTION_ADDRESS = import.meta.env.VITE_OPTION_ADDRESS || CONTRACTS.solarPunkOption;
const SERIES_ID = LIVE_OPTION_SERIES.id;

const PositionsList = ({ provider, signer }) => {
  const [position, setPosition] = useState(null);
  const [series, setSeries] = useState(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPosition = useCallback(async () => {
    if (!provider || !signer) {
      setLoading(false);
      setPosition(null);
      return;
    }
    
    try {
      const userAddr = await signer.getAddress();
      const option = new ethers.Contract(OPTION_ADDRESS, OPTION_ABI.abi, provider);
      
      const [pos, ser, currentIndex, priceDecimals] = await Promise.all([
        option.getPosition(userAddr, SERIES_ID),
        option.series(SERIES_ID),
        option.currentIndex(),
        option.priceDecimals()
      ]);

      const qty = Number(pos.qty);
      const margin = Number(ethers.formatUnits(pos.margin, 6));
      if (qty !== 0 || margin > 0) {
        setPosition({
          qty,
          margin,
          lastIndex: Number(pos.lastIndex)
        });
      } else {
        setPosition(null);
      }
      
      setSeries({
        strike: Number(ser.strike) / 1e6, // price decimals 6
        notional: Number(ser.notional),
        expiry: Number(ser.expiry),
        isCall: ser.isCall
      });
      
      setIndex(Number(currentIndex) / (10 ** Number(priceDecimals)));
    } catch (err) {
      console.error("Failed to fetch position:", err);
    } finally {
      setLoading(false);
    }
  }, [provider, signer]);

  useEffect(() => {
    fetchPosition();
    const interval = setInterval(fetchPosition, 15000);
    return () => clearInterval(interval);
  }, [fetchPosition]);

  if (loading) return <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}><p className="text-muted">Loading positions...</p></div>;
  if (!signer) return (
    <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
      <Zap size={18} className="text-accent" />
      <p className="text-muted" style={{ marginTop: '10px' }}>Connect wallet to inspect active hedges.</p>
    </div>
  );
  if (!position) return (
    <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
      <p className="text-muted">No active hedges found for this series.</p>
    </div>
  );

  // Calculate Health
  // PnL for Short Put = (Index - Strike) * qty * notional (approx for dashboard)
  // Current Margin = position.margin + PnL
  const pnl = (index - series.strike) * position.qty * series.notional;
  const currentMargin = position.margin + pnl;
  const maintenanceReq = (series.strike * position.qty * series.notional) * 1.25; // 125%
  const healthRatio = (currentMargin / maintenanceReq) * 100;

  const isAtRisk = healthRatio < 110;
  const isHealthy = healthRatio >= 110;

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 className="text-accent">My Active Hedges</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <Clock size={14} className="text-muted" />
          <span className="text-muted">Expires: {new Date(series.expiry * 1000).toLocaleDateString()}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>Protection Volume</p>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px' }}>
            {(position.qty * series.notional).toLocaleString()} kWh
          </div>
          <p className="text-primary" style={{ fontSize: '12px', margin: '4px 0 0 0' }}>Price Floor: ${series.strike}</p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>Current Equity</p>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '4px', color: pnl >= 0 ? '#4ade80' : '#ef4444' }}>
            ${currentMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p style={{ fontSize: '12px', margin: '4px 0 0 0', color: pnl >= 0 ? '#4ade80' : '#ef4444' }}>
            {pnl >= 0 ? '+' : ''}{pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })} PnL
          </p>
        </div>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px' }}>Position Health</span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: isHealthy ? '#4ade80' : '#fbbf24' }}>
            {healthRatio.toFixed(1)}%
          </span>
        </div>
        
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ 
            height: '100%', 
            width: `${Math.min(100, healthRatio)}%`, 
            background: isHealthy ? '#4ade80' : '#fbbf24',
            transition: 'width 0.5s ease'
          }}></div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isHealthy ? (
            <Shield size={16} className="text-primary" />
          ) : (
            <ShieldAlert size={16} style={{ color: '#fbbf24' }} />
          )}
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {isHealthy ? "Collateral is sufficient for current volatility." : "Warning: Approaching liquidation threshold (125%)"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PositionsList;
