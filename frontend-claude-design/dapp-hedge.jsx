// Hedge Tab — buy put options with live binomial pricing
const Hedge = ({ account, nasaData }) => {
  const [volume, setVolume]     = React.useState(10);   // contracts
  const [strike, setStrike]     = React.useState(0.0525);
  const [maturity, setMaturity] = React.useState(0.25);
  const [loading, setLoading]   = React.useState(false);
  const [status, setStatus]     = React.useState(null);

  const ghiSeries = nasaData ? nasaData.map(d => d.ghi) : [];
  const sigma = nasaData && ghiSeries.length ? SPKUtils.computeVolatility(ghiSeries, nasaData) : 1.89;
  const S0    = nasaData && nasaData.length   ? nasaData[nasaData.length - 1].price   : 0.055;
  const notionalKwh = 1000;
  const r           = 0.05;
  const N            = 80;

  const premiumPerKwh = SPKUtils.binomialPrice(S0, strike, maturity, r, sigma, N, false);
  const totalKwh      = volume * notionalKwh;
  const totalPremium  = premiumPerKwh * totalKwh;
  const varPayoff     = SPKUtils.binomialPrice(S0 * 0.7, strike, maturity, r, sigma, N, false) * totalKwh;
  const requiredMargin = varPayoff * 1.5;
  const greeks        = SPKUtils.computeGreeks(S0, strike, maturity, r, sigma, N, false);

  const execute = () => {
    if (!account) return;
    setLoading(true);
    setStatus(null);
    setTimeout(() => { setLoading(false); setStatus('success'); }, 2000);
  };

  const farmTypes = ['Solar (Photovoltaic)', 'Solar (CSP)', 'Wind', 'Hydro'];
  const [farmType, setFarmType] = React.useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={hedgeStyles.h1}>Hedge Revenue</h1>
        <p style={hedgeStyles.sub}>Purchase price floor (put options) · Premium calculated by binomial engine</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }}>
        {/* Left: inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Farm type */}
          <div style={hedgeStyles.card}>
            <div style={hedgeStyles.cardLabel}>Energy Source</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {farmTypes.map((f, i) => (
                <button key={f} onClick={() => setFarmType(i)} style={{
                  padding: '7px 14px', borderRadius: '99px', fontSize: '12px', cursor: 'pointer',
                  background: farmType === i ? 'rgba(217,119,6,0.12)' : 'transparent',
                  border: farmType === i ? '1px solid rgba(217,119,6,0.4)' : '1px solid #1c2e1f',
                  color: farmType === i ? '#d97706' : '#567a5c',
                  fontFamily: 'DM Sans, sans-serif',
                }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Volume slider */}
          <div style={hedgeStyles.card}>
            <div style={hedgeStyles.cardLabel}>Coverage Volume</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '28px', color: '#dde8de' }}>{(totalKwh).toLocaleString()} kWh</span>
              <span style={{ fontSize: '12px', color: '#567a5c' }}>{volume} contracts × 1,000 kWh</span>
            </div>
            <input type="range" min="1" max="100" value={volume}
              onChange={e => setVolume(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#d97706', height: '4px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#3d5c42', marginTop: '6px' }}>
              <span>1,000 kWh</span><span>100,000 kWh</span>
            </div>
          </div>

          {/* Strike + maturity */}
          <div style={hedgeStyles.card}>
            <div style={hedgeStyles.cardLabel}>Term Sheet</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={hedgeStyles.label}>Strike Price ($/kWh)</label>
                <input type="number" value={strike} step="0.001" min="0.001"
                  onChange={e => setStrike(parseFloat(e.target.value) || 0)}
                  style={hedgeStyles.input}
                />
                <div style={{ fontSize: '11px', color: '#3d5c42', marginTop: '4px' }}>
                  Current: $0.0550 · {strike < 0.055 ? 'ITM' : 'OTM'}
                </div>
              </div>
              <div>
                <label style={hedgeStyles.label}>Maturity (years)</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[[0.0833,'1M'],[0.25,'3M'],[0.5,'6M'],[1,'1Y']].map(([v,l]) => (
                    <button key={l} onClick={() => setMaturity(v)} style={{
                      padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                      background: maturity === v ? 'rgba(52,211,153,0.1)' : 'transparent',
                      border: maturity === v ? '1px solid rgba(52,211,153,0.3)' : '1px solid #1c2e1f',
                      color: maturity === v ? '#34d399' : '#567a5c',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Greeks mini */}
          <div style={hedgeStyles.card}>
            <div style={hedgeStyles.cardLabel}>Greeks (this position)</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { l: 'Δ Delta',  v: (greeks.delta * volume).toFixed(3) },
                { l: 'Γ Gamma',  v: (greeks.gamma * volume).toFixed(5) },
                { l: 'ν Vega',   v: (greeks.vega  * volume).toFixed(3) },
                { l: 'Θ Theta',  v: (greeks.theta * volume).toFixed(4) },
              ].map(g => (
                <div key={g.l} style={{ flex: 1, background: '#0a130b', borderRadius: '8px', padding: '10px 12px' }}>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '13px', color: '#d97706' }}>{g.l}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', color: '#dde8de', marginTop: '2px' }}>{g.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: order summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ ...hedgeStyles.card, background: '#0a1a0d', border: '1px solid #253d29' }}>
            <div style={hedgeStyles.cardLabel}>Order Summary</div>

            {[
              ['Type',            `Put · European`],
              ['Coverage',        `${totalKwh.toLocaleString()} kWh`],
              ['Strike',          `$${strike.toFixed(4)} / kWh`],
              ['Maturity',        `${(maturity * 12).toFixed(1)} months`],
              ['Premium / kWh',   `$${premiumPerKwh.toFixed(5)}`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1a2b1d', fontSize: '13px' }}>
                <span style={{ color: '#567a5c' }}>{l}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#dde8de' }}>{v}</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: '15px', fontWeight: '700' }}>
              <span style={{ color: '#dde8de' }}>Total Premium</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#34d399' }}>
                ${totalPremium.toFixed(2)}
              </span>
            </div>

            <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(217,119,6,0.06)', borderRadius: '8px', border: '1px solid rgba(217,119,6,0.12)', fontSize: '12px' }}>
              <div style={{ color: '#567a5c', marginBottom: '4px' }}>Required Margin (1.5× VaR)</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#d97706', fontSize: '16px' }}>
                ${requiredMargin.toFixed(2)} USDC
              </div>
            </div>

            <button onClick={execute} disabled={loading || !account} style={{
              ...hedgeStyles.execBtn,
              opacity: !account ? 0.45 : 1,
              cursor: !account ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'Broadcasting to Sepolia…' : 'Execute Hedge'}
            </button>

            {!account && (
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#3d5c42', marginTop: '10px' }}>
                Connect wallet to execute
              </div>
            )}

            {status === 'success' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', padding: '12px', background: 'rgba(52,211,153,0.08)', borderRadius: '8px', border: '1px solid rgba(52,211,153,0.2)', fontSize: '13px', color: '#34d399' }}>
                ✓ Position secured · Ethereum Sepolia
              </div>
            )}
          </div>

          {/* How it works */}
          <div style={hedgeStyles.card}>
            <div style={hedgeStyles.cardLabel}>Settlement Flow</div>
            {[
              ['01', 'You deposit margin in USDC'],
              ['02', 'Oracle aggregates NASA irradiance + spot prices'],
              ['03', 'At expiry, index vs. strike determines payoff'],
              ['04', 'Smart contract settles automatically on-chain'],
            ].map(([n, t]) => (
              <div key={n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '8px 0' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#3d5c42', flexShrink: 0, paddingTop: '2px' }}>{n}</span>
                <span style={{ fontSize: '13px', color: '#567a5c', lineHeight: '1.5' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const hedgeStyles = {
  h1:  { fontFamily: 'Instrument Serif, serif', fontSize: '32px', color: '#dde8de', margin: 0, fontWeight: '400' },
  sub: { fontSize: '13px', color: '#567a5c', margin: '6px 0 0', fontFamily: 'JetBrains Mono, monospace' },
  card: { background: '#0e1a10', border: '1px solid #1c2e1f', borderRadius: '12px', padding: '20px' },
  cardLabel: { fontSize: '10px', letterSpacing: '0.1em', color: '#3d5c42', textTransform: 'uppercase', marginBottom: '14px' },
  label: { display: 'block', fontSize: '11px', color: '#567a5c', marginBottom: '5px' },
  input: {
    width: '100%', background: '#0a130b', border: '1px solid #1c2e1f', borderRadius: '6px',
    color: '#dde8de', padding: '8px 10px', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace',
    outline: 'none', boxSizing: 'border-box',
  },
  execBtn: {
    width: '100%', marginTop: '16px', padding: '14px',
    background: 'linear-gradient(135deg, #34d399, #059669)',
    border: 'none', borderRadius: '8px', color: '#070d08',
    fontSize: '15px', fontWeight: '700', fontFamily: 'DM Sans, sans-serif',
    transition: 'all 0.15s',
  },
};

Object.assign(window, { Hedge });
