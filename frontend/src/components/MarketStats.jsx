import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import SPK_ABI from '../abi/SolarPunkCoin.json';
import TREASURY_ABI from '../abi/ProtocolTreasury.json';

// ── Live Sepolia contract addresses ───────────────────────────────────────────
const SPK_ADDRESS      = '0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F';
const TREASURY_ADDRESS = '0x138e793f095a33D2790349eC1066FED3A756dd2c';
const SEPOLIA_RPC      = 'https://rpc.sepolia.org';
const POLL_INTERVAL   = 30_000; // 30 s

// ── Fallback demo chart data (shown while live data loads) ────────────────────
const DEMO_CHART = [
  { name: 'Mon', price: 0.94 },
  { name: 'Tue', price: 0.97 },
  { name: 'Wed', price: 1.02 },
  { name: 'Thu', price: 0.99 },
  { name: 'Fri', price: 1.03 },
  { name: 'Sat', price: 1.01 },
  { name: 'Sun', price: 1.05 },
];

function fmt18(bn) {
  return Number(ethers.formatUnits(bn, 18));
}

function fmtUsdc(bn) {
  return Number(ethers.formatUnits(bn, 6));
}

function fmtKwh(bn) {
  // cumulativeSurplusKwh is stored as raw integer kWh (not 1e18-scaled)
  const raw = Number(bn);
  if (raw >= 1e9) return `${(raw / 1e9).toFixed(2)} GWh`;
  if (raw >= 1e6) return `${(raw / 1e6).toFixed(2)} MWh`;
  if (raw >= 1e3) return `${(raw / 1e3).toFixed(2)} kWh`;
  return `${raw.toFixed(2)} kWh`;
}

const MarketStats = () => {
  const [live, setLive] = useState(null);  // null = loading, false = error, object = data
  const [chartData, setChartData] = useState(DEMO_CHART);
  const [priceHistory, setPriceHistory] = useState([]);

  const fetchLiveData = useCallback(async () => {
    try {
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
      const spk = new ethers.Contract(SPK_ADDRESS, SPK_ABI, provider);
      const treasury = new ethers.Contract(TREASURY_ADDRESS, TREASURY_ABI.abi, provider);

      const [
        totalSupply,
        energyPricePerKwh,
        lastOraclePrice,
        usdcReserve,
        reserveRatioBps,
        cumulativeSurplusKwh,
        gridStressed,
        pegTarget,
        isPegStable,
        insuranceBalance,
      ] = await Promise.all([
        spk.totalSupply(),
        spk.energyPricePerKwh(),
        spk.lastOraclePrice(),
        spk.usdcReserve(),
        spk.getReserveRatio(),
        spk.cumulativeSurplusKwh(),
        spk.gridStressed(),
        spk.pegTarget(),
        spk.isPegStable(),
        treasury.treasuryBalance(await spk.reserveToken()),
      ]);

      const oraclePriceNum = fmt18(lastOraclePrice);
      const reserveRatioPct = Number(reserveRatioBps) / 100;

      setLive({
        totalSupply:    fmt18(totalSupply).toFixed(2),
        energyPrice:    `$${fmt18(energyPricePerKwh).toFixed(4)}/kWh`,
        oraclePrice:    `$${oraclePriceNum.toFixed(4)}`,
        usdcReserve:    `$${fmtUsdc(usdcReserve).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        insuranceFund:  `$${fmtUsdc(insuranceBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        reserveRatio:   `${reserveRatioPct.toFixed(1)}%`,
        surplusKwh:     fmtKwh(cumulativeSurplusKwh),  // raw kWh integer, not 1e18
        gridStressed,
        pegStable:      isPegStable,
        pegTarget:      `$${fmt18(pegTarget).toFixed(2)}`,
      });

      // Append oracle price to rolling chart history (last 7 ticks)
      const label = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setPriceHistory(prev => {
        const next = [...prev, { name: label, price: Number(oraclePriceNum.toFixed(4)) }].slice(-7);
        setChartData(next.length >= 2 ? next : DEMO_CHART);
        return next;
      });

    } catch (err) {
      console.warn('Live data fetch failed:', err.message);
      setLive(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    const id = setInterval(fetchLiveData, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchLiveData]);

  // ── Stat cards: live or fallback ──────────────────────────────────────────
  const stats = live
    ? [
        { label: 'SPK Total Supply',  value: live.totalSupply,   sub: 'live · Sepolia' },
        { label: 'Energy Price',      value: live.energyPrice,   sub: live.gridStressed ? 'grid stressed' : 'grid normal' },
        { label: 'Oracle Price',      value: live.oraclePrice,   sub: live.pegStable ? 'peg stable' : 'peg adjusting' },
        { label: 'USDC Reserve',      value: live.usdcReserve,   sub: `ratio ${live.reserveRatio}` },
      ]
    : [
        { label: 'Solvency Buffer',   value: '154%',     sub: 'VaR-adjusted' },
        { label: 'Hedged Energy',     value: '21.4 GWh', sub: 'Testnet total' },
        { label: 'Premium APR',       value: '6.2%',     sub: 'Weighted median' },
        { label: 'Settlement Lag',    value: '42s',      sub: 'Last 50 txs' },
      ];

  const isLive = live && live !== false;
  const badgeLabel = live === null ? 'Connecting…' : isLive ? 'Live · Sepolia' : 'Demo Data';
  const badgeClass = isLive ? 'status-badge status-active' : 'status-badge';

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>Pillar 2 · NASA POWER Oracle</p>
          <h3 style={{ margin: 0 }}>Protocol Health</h3>
        </div>
        <div className={badgeClass}>{badgeLabel}</div>
      </div>

      {isLive && (
        <div style={{ marginBottom: '12px', padding: '8px 12px', background: 'rgba(74,222,128,0.08)', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.2)', fontSize: '12px', color: 'var(--text-muted)' }}>
          Surplus verified: <span style={{ color: '#4ade80' }}>{live.surplusKwh}</span>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          Peg target: <span style={{ color: '#4ade80' }}>{live.pegTarget}</span>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          Grid: <span style={{ color: live.gridStressed ? '#ef4444' : '#4ade80' }}>{live.gridStressed ? 'stressed' : 'normal'}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {stats.map(({ label, value, sub }) => (
          <div key={label} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
            <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>{label}</p>
            <div className="stat-value" style={{ marginTop: '6px' }}>{value}</div>
            <p style={{ color: 'var(--primary)', fontSize: '12px', margin: '4px 0 0 0' }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'rgba(19,26,22,0.95)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)' }}
              labelStyle={{ color: 'var(--text-muted)' }}
              formatter={(value) => [`$${Number(value).toFixed(4)}`, isLive ? 'Oracle Price' : 'Energy Index']}
            />
            <Area type="monotone" dataKey="price" stroke="#4ade80" strokeWidth={2} fill="url(#priceGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketStats;
