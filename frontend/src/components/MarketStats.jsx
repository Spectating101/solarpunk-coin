import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const irradianceData = [
  { name: 'Mon', price: 0.94, hedge: 62 },
  { name: 'Tue', price: 0.97, hedge: 65 },
  { name: 'Wed', price: 1.02, hedge: 69 },
  { name: 'Thu', price: 0.99, hedge: 71 },
  { name: 'Fri', price: 1.03, hedge: 75 },
  { name: 'Sat', price: 1.01, hedge: 78 },
  { name: 'Sun', price: 1.05, hedge: 80 }
];

const stats = [
  { label: 'Solvency Buffer', value: '154%', sub: 'VaR-adjusted' },
  { label: 'Hedged Energy', value: '21.4 GWh', sub: 'Testnet total' },
  { label: 'Premium APR', value: '6.2%', sub: 'Weighted median' },
  { label: 'Settlement Lag', value: '42s', sub: 'Last 50 txs' }
];

const MarketStats = () => {
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>Pillar 2 · Pricing Oracle</p>
          <h3 style={{ margin: 0 }}>Market Health</h3>
        </div>
        <div className="status-badge status-active">
          Live · Polygon
        </div>
      </div>

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
          <AreaChart data={irradianceData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'rgba(19, 26, 22, 0.95)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-main)' }}
              labelStyle={{ color: 'var(--text-muted)' }}
              formatter={(value, key) => key === 'price' ? [`$${value.toFixed(2)}`, 'Energy Index'] : [`${value}%`, 'Hedge Ratio']}
            />
            <Area type="monotone" dataKey="price" stroke="#4ade80" strokeWidth={2} fill="url(#priceGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketStats;
