import React, { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { ArrowRight, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import SolarPunkOptionABI from '../abi/SolarPunkOption.json';
import { CONTRACTS, LIVE_OPTION_SERIES, SEPOLIA_RPC_URL } from '../constants/contracts';

const CONTRACT_ADDRESS = import.meta.env.VITE_OPTION_ADDRESS || CONTRACTS.solarPunkOption;

// Minimal ERC20 ABI for approve + allowance
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function balanceOf(address account) external view returns (uint256)"
];

const TradingInterface = ({ provider, signer }) => {
  const [amount, setAmount] = useState(10); // Contracts
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // success, error, approving, missing-address, insufficient-balance
  const [txHash, setTxHash] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [series, setSeries] = useState(null);
  const [seriesStatus, setSeriesStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    async function loadSeries() {
      try {
        const rpcProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const option = new ethers.Contract(CONTRACT_ADDRESS, SolarPunkOptionABI.abi, rpcProvider);
        const [rawSeries, priceDecimals, initialMarginBps] = await Promise.all([
          option.series(LIVE_OPTION_SERIES.id),
          option.priceDecimals(),
          option.initialMarginBps(),
        ]);

        if (cancelled) return;
        if (!rawSeries.exists) {
          setSeries(null);
          setSeriesStatus('missing');
          return;
        }

        const priceScale = 10 ** Number(priceDecimals);
        const strike = Number(rawSeries.strike) / priceScale;
        const notional = Number(rawSeries.notional);
        setSeries({
          id: LIVE_OPTION_SERIES.id,
          label: LIVE_OPTION_SERIES.label,
          expiry: Number(rawSeries.expiry),
          strike,
          isCall: rawSeries.isCall,
          notional,
          initialMarginBps: Number(initialMarginBps),
          marginLabel: `${Number(initialMarginBps) / 100}%`,
          feePerContract: 0,
        });
        setSeriesStatus('ok');
      } catch (error) {
        if (!cancelled) {
          setSeries(null);
          setSeriesStatus('error');
        }
      }
    }

    loadSeries();
    return () => {
      cancelled = true;
    };
  }, []);

  const pricing = useMemo(() => {
    if (!series) {
      return {
        coverage: amount * 1000,
        exposure: 0,
        requiredMargin: 0,
        tradingFee: 0,
      };
    }

    const coverage = amount * series.notional;
    const exposure = coverage * series.strike;
    const requiredMargin = exposure * (series.initialMarginBps / 10_000);
    const tradingFee = amount * series.feePerContract;
    return { coverage, exposure, requiredMargin, tradingFee };
  }, [amount, series]);

  const executeTrade = async () => {
    if (!signer) return;
    if (!series) {
      setStatus('missing-series');
      return;
    }

    setLoading(true);
    setStatus(null);
    setTxHash(null);
    setErrorMsg('');

    try {
      const option = new ethers.Contract(CONTRACT_ADDRESS, SolarPunkOptionABI.abi, signer);

      // Get collateral token address and set up ERC20 interface
      const collateralAddr = await option.collateral();
      const collateral = new ethers.Contract(collateralAddr, ERC20_ABI, signer);
      const decimals = await collateral.decimals();
      const marginWei = ethers.parseUnits(pricing.requiredMargin.toFixed(Number(decimals)), decimals);

      // Check balance
      const userAddr = await signer.getAddress();
      const balance = await collateral.balanceOf(userAddr);
      if (balance < marginWei) {
        setStatus('insufficient-balance');
        setErrorMsg(`Need ${pricing.requiredMargin.toFixed(2)} collateral, have ${ethers.formatUnits(balance, decimals)}`);
        setLoading(false);
        return;
      }

      // Check and request approval if needed
      const allowance = await collateral.allowance(userAddr, CONTRACT_ADDRESS);
      if (allowance < marginWei) {
        setStatus('approving');
        const approveTx = await collateral.approve(CONTRACT_ADDRESS, marginWei);
        await approveTx.wait();
      }

      const qtyDelta = BigInt(Math.trunc(amount));
      const tx = await option.modifyPosition(series.id, qtyDelta, marginWei);
      const receipt = await tx.wait();

      setTxHash(receipt.hash);
      setStatus('success');
    } catch (err) {
      console.error('Trade failed:', err);
      const reason = err.reason || err.shortMessage || err.message || 'Unknown error';
      setErrorMsg(reason);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ height: 'fit-content' }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
        <h3 className="text-accent">Hedge Preview</h3>
        <p className="text-muted" style={{ fontSize: '14px' }}>Live Sepolia option series, with guarded execution.</p>
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
              min="1"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
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
            <span className="text-muted">Series</span>
            <span className="font-mono">{seriesStatus === 'ok' ? series.label : seriesStatus}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span className="text-muted">Type / Strike</span>
            <span className="font-mono">{series ? `${series.isCall ? 'Call' : 'Put'} @ ${series.strike.toFixed(2)}` : 'checking...'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span className="text-muted">Total Coverage</span>
            <span className="font-mono text-primary">{pricing.coverage.toLocaleString()} kWh</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span className="text-muted">Required Margin{series ? ` (${series.marginLabel})` : ''}</span>
            <span className="font-mono">${pricing.requiredMargin.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
           <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '8px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold' }}>
            <span>Protocol Fee Est.</span>
            <span>${pricing.tradingFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          className="btn-primary"
          style={{ justifyContent: 'center', width: '100%', padding: '16px', fontSize: '16px' }}
          onClick={executeTrade}
          disabled={loading || !signer || seriesStatus !== 'ok'}
        >
          {loading ? (
            status === 'approving' ? 'Approving collateral...' : 'Confirming on-chain...'
          ) : (
            <>
              Execute Hedge <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Status Messages */}
        {status === 'success' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', background: 'var(--primary-dim)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
            <CheckCircle size={16} />
            <div>
              Position opened on-chain
              {txHash && (
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px', wordBreak: 'break-all' }}>
                  Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </div>
              )}
            </div>
          </div>
        )}
        {status === 'missing-series' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.12)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
            <AlertTriangle size={16} />
            No active live option series is configured for execution.
          </div>
        )}
        {status === 'insufficient-balance' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.12)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
            <AlertTriangle size={16} />
            {errorMsg || 'Insufficient collateral balance'}
          </div>
        )}
        {status === 'error' && (
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
            <AlertTriangle size={16} />
            <div>
              Transaction failed
              {errorMsg && <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>{errorMsg}</div>}
            </div>
          </div>
        )}

        {!signer && (
           <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            Connect wallet to execute. The preview above is read-only.
           </div>
        )}
        {seriesStatus === 'error' && (
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#fbbf24' }}>
            Could not read live series metadata from Sepolia.
          </div>
        )}

      </div>
    </div>
  );
};

export default TradingInterface;
