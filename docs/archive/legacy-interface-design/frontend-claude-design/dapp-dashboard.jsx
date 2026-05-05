// Dashboard Tab — real NASA POWER API data, real volatility, real option pricing
const Dashboard = ({ nasaData, nasaStatus }) => {
  const loading = nasaStatus === 'loading';
  const error   = nasaStatus === 'error';

  // Derived from real NASA data
  const ghiSeries    = nasaData ? nasaData.map(d => d.ghi)   : [];
  const priceSeries  = nasaData ? nasaData.map(d => d.price) : [];
  const sigma        = nasaData ? SPKUtils.computeVolatility(ghiSeries, nasaData) : null;
  const S0           = priceSeries.length ? priceSeries[priceSeries.length - 1] : null;
  const K            = S0; // ATM
  const T            = 0.25;
  const r            = 0.05;

  // Real option premium from live NASA-derived params
  const premium = (sigma && S0) ? SPKUtils.binomialPrice(S0, K, T, r, sigma, 100, false) : null;
  const varPayoff = (sigma && S0) ? SPKUtils.var99Payoff(S0, K, T, r, sigma, 1000, 60) : null;
  const margin   = varPayoff ? varPayoff * 1.5 : null;

  // GHI stats
  const ghiMean = ghiSeries.length ? (ghiSeries.reduce((a,b) => a+b,0) / ghiSeries.length).toFixed(2) : '—';
  const ghiMax  = ghiSeries.length ? Math.max(...ghiSeries).toFixed(2) : '—';
  const ghiMin  = ghiSeries.length ? Math.min(...ghiSeries).toFixed(2) : '—';

  // Recent 90 days for chart
  const chartData = nasaData ? nasaData.slice(-90) : [];

  // SVG chart
  const chartW = 700, chartH = 110;
  let linePath = '', areaPath = '';
  if (chartData.length > 1) {
    const vals = chartData.map(d => d.ghi);
    const minV = Math.min(...vals), maxV = Math.max(...vals);
    const range = maxV - minV || 0.001;
    const pts = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * chartW;
      const y = chartH - ((d.ghi - minV) / range) * (chartH - 20) - 10;
      return [x, y];
    });
    linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
    areaPath = `${linePath} L${chartW},${chartH} L0,${chartH} Z`;
  }

  const lastGhi = chartData.length ? chartData[chartData.length - 1].ghi : null;
  const prevGhi = chartData.length > 1 ? chartData[chartData.length - 2].ghi : null;
  const ghiChange = (lastGhi && prevGhi) ? ((lastGhi - prevGhi) / prevGhi * 100).toFixed(2) : null;
  const isUp = ghiChange && parseFloat(ghiChange) >= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={dashStyles.h1}>Market Overview</h1>
          <p style={dashStyles.sub}>
            NASA POWER · ALLSKY_SFC_SW_DWN · Taoyuan, Taiwan (24.99°N, 121.30°E)
          </p>
        </div>
        <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: loading ? '#d97706' : error ? '#ef4444' : '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: loading ? '#d97706' : error ? '#ef4444' : '#34d399', display: 'inline-block', animation: loading ? 'pulse 1s infinite' : 'none' }}/>
          {loading ? 'Fetching NASA satellite data…' : error ? 'NASA API error — check console' : `${nasaData?.length?.toLocaleString()} days loaded · 2022–2024`}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ ...dashStyles.card, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '24px', animation: 'pulse 1.5s infinite' }}>☀</div>
          <div style={{ color: '#567a5c', fontSize: '14px' }}>Connecting to NASA satellite database…</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3d5c42' }}>power.larc.nasa.gov · ALLSKY_SFC_SW_DWN · RE community</div>
        </div>
      )}

      {/* Real data */}
      {!loading && nasaData && (
        <>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={dashStyles.statCard}>
              <div style={dashStyles.statLabel}>GHI Mean (kWh/m²/day)</div>
              <div style={{ ...dashStyles.statValue, color: '#d97706' }}>{ghiMean}</div>
              <div style={dashStyles.statSub}>NASA · Taoyuan 2022–2024</div>
            </div>
            <div style={dashStyles.statCard}>
              <div style={dashStyles.statLabel}>Implied Volatility σ</div>
              <div style={{ ...dashStyles.statValue, color: '#34d399' }}>
                {sigma ? (sigma * 100).toFixed(1) + '%' : '—'}
              </div>
              <div style={dashStyles.statSub}>Log returns · annualized · 365d</div>
            </div>
            <div style={dashStyles.statCard}>
              <div style={dashStyles.statLabel}>Energy Index S₀</div>
              <div style={{ ...dashStyles.statValue, color: '#dde8de' }}>
                {S0 ? '$' + S0.toFixed(5) : '—'}
              </div>
              <div style={dashStyles.statSub}>GHI × 20% eff. × $0.10/kWh</div>
            </div>
            <div style={dashStyles.statCard}>
              <div style={dashStyles.statLabel}>Put Premium / kWh</div>
              <div style={{ ...dashStyles.statValue, color: '#34d399' }}>
                {premium ? '$' + premium.toFixed(5) : '—'}
              </div>
              <div style={dashStyles.statSub}>Binomial · N=100 · ATM · 3M</div>
            </div>
            <div style={dashStyles.statCard}>
              <div style={dashStyles.statLabel}>VaR99 (1,000 kWh)</div>
              <div style={{ ...dashStyles.statValue, color: '#d97706' }}>
                {varPayoff ? '$' + varPayoff.toFixed(2) : '—'}
              </div>
              <div style={dashStyles.statSub}>30% shock scenario</div>
            </div>
            <div style={dashStyles.statCard}>
              <div style={dashStyles.statLabel}>Req. Margin (1.5× VaR)</div>
              <div style={{ ...dashStyles.statValue, color: '#dde8de' }}>
                {margin ? '$' + margin.toFixed(2) : '—'}
              </div>
              <div style={dashStyles.statSub}>Per 1,000 kWh contract</div>
            </div>
          </div>

          {/* GHI chart */}
          <div style={dashStyles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#3d5c42', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Solar Irradiance (GHI) · kWh/m²/day · Last 90 days
                </div>
                {lastGhi && (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontSize: '28px', fontFamily: 'JetBrains Mono, monospace', color: '#dde8de' }}>{lastGhi.toFixed(3)}</span>
                    <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', color: isUp ? '#34d399' : '#ef4444' }}>
                      {isUp ? '▲' : '▼'} {Math.abs(ghiChange)}%
                    </span>
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#3d5c42' }}>
                <div>Range: {ghiMin} – {ghiMax} kWh/m²/day</div>
                <div style={{ marginTop: '2px' }}>σ(irr) = {sigma ? sigma.toFixed(3) : '…'}</div>
              </div>
            </div>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none"
              style={{ width: '100%', height: '110px', display: 'block' }}>
              <defs>
                <linearGradient id="ghiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {areaPath && <path d={areaPath} fill="url(#ghiGrad)"/>}
              {linePath && <path d={linePath} fill="none" stroke="#d97706" strokeWidth="1.5"/>}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#3d5c42', marginTop: '6px', fontFamily: 'JetBrains Mono, monospace' }}>
              {chartData.length > 0 && (
                <>
                  <span>{chartData[0].date}</span>
                  <span>{chartData[chartData.length - 1].date}</span>
                </>
              )}
            </div>
          </div>

          {/* Pricing summary card */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={dashStyles.card}>
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#3d5c42', textTransform: 'uppercase', marginBottom: '14px' }}>
                Live Derived Parameters
              </div>
              {[
                ['S₀ (underlying)',  S0 ? `$${S0.toFixed(5)} / kWh` : '—'],
                ['K (strike, ATM)',  K  ? `$${K.toFixed(5)} / kWh`  : '—'],
                ['σ (volatility)',   sigma ? `${(sigma*100).toFixed(2)}%` : '—'],
                ['T (maturity)',     '0.25 yr (3 months)'],
                ['r (risk-free)',    '5.00%'],
                ['Source',          'NASA POWER · ALLSKY_SFC_SW_DWN'],
              ].map(([l,v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1a2b1d', fontSize: '13px' }}>
                  <span style={{ color: '#567a5c' }}>{l}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#dde8de' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={dashStyles.card}>
              <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#3d5c42', textTransform: 'uppercase', marginBottom: '14px' }}>
                Three Pillars · System Status
              </div>
              {[
                { n: '01', title: 'Empirics',  desc: `NASA GHI · σ = ${sigma ? (sigma*100).toFixed(1)+'%' : '…'} (log returns)`, ok: true },
                { n: '02', title: 'Pricing',   desc: `Binomial tree · N=100 · Premium = ${premium ? '$'+premium.toFixed(5) : '…'}`, ok: !!premium },
                { n: '03', title: 'Execution', desc: 'Sepolia · 7 contracts deployed · 79 tests passing · prototype-grade clearing', ok: true },
              ].map(p => (
                <div key={p.n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #1a2b1d' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3d5c42', paddingTop: '3px' }}>Pillar {p.n}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '15px', color: '#dde8de', marginBottom: '2px' }}>{p.title}</div>
                    <div style={{ fontSize: '11px', color: '#567a5c' }}>{p.desc}</div>
                  </div>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '99px',
                    background: p.ok ? 'rgba(52,211,153,0.08)' : 'rgba(217,119,6,0.08)',
                    border: `1px solid ${p.ok ? 'rgba(52,211,153,0.2)' : 'rgba(217,119,6,0.25)'}`,
                    color: p.ok ? '#34d399' : '#d97706', flexShrink: 0, marginTop: '2px',
                  }}>{p.ok ? 'Live' : 'Pending'}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {error && (
        <div style={{ ...dashStyles.card, color: '#ef4444', fontSize: '14px' }}>
          NASA API fetch failed. Check your network or try again later. The API is at power.larc.nasa.gov.
        </div>
      )}
    </div>
  );
};

const dashStyles = {
  h1:        { fontFamily: 'Instrument Serif, serif', fontSize: '32px', color: '#dde8de', margin: 0, fontWeight: '400' },
  sub:       { fontSize: '12px', color: '#567a5c', margin: '6px 0 0', fontFamily: 'JetBrains Mono, monospace' },
  card:      { background: '#0e1a10', border: '1px solid #1c2e1f', borderRadius: '12px', padding: '20px' },
  statCard:  { background: '#0e1a10', border: '1px solid #1c2e1f', borderRadius: '12px', padding: '16px 18px' },
  statLabel: { fontSize: '11px', color: '#567a5c', marginBottom: '6px' },
  statValue: { fontFamily: 'JetBrains Mono, monospace', fontSize: '22px', fontWeight: '700' },
  statSub:   { fontSize: '10px', color: '#3d5c42', marginTop: '4px' },
};

Object.assign(window, { Dashboard });
