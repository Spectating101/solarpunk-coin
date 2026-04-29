// Pricer Tab — real binomial / MC pricing engine with Greeks and stress tests
const Pricer = () => {
  const [inputs, setInputs] = React.useState({
    S0: 0.055, K: 0.0525, T: 0.25, r: 0.05, sigma: 1.89,
    N: 100, numPaths: 5000, method: 'binomial', isCall: false,
  });
  const [result, setResult]       = React.useState(null);
  const [stress, setStress]       = React.useState(null);
  const [loading, setLoading]     = React.useState(false);
  const [mcResult, setMcResult]   = React.useState(null);

  const set = (k, v) => setInputs(p => ({ ...p, [k]: v }));

  const runPricer = () => {
    setLoading(true);
    setTimeout(() => {
      const g = SPKUtils.computeGreeks(inputs.S0, inputs.K, inputs.T, inputs.r, inputs.sigma, inputs.N, inputs.isCall);
      setResult(g);
      const mc = SPKUtils.monteCarloPrice(inputs.S0, inputs.K, inputs.T, inputs.r, inputs.sigma, inputs.numPaths, inputs.isCall);
      setMcResult(mc);
      const st = SPKUtils.stressTest(inputs.S0, inputs.K, inputs.T, inputs.r, inputs.sigma, 50, inputs.isCall);
      setStress(st);
      setLoading(false);
    }, 100);
  };

  const greekDefs = [
    { key: 'delta', label: 'Delta Δ',  desc: 'Price sensitivity to underlying',    fmt: v => v.toFixed(4) },
    { key: 'gamma', label: 'Gamma Γ',  desc: 'Delta sensitivity to underlying',    fmt: v => v.toFixed(6) },
    { key: 'vega',  label: 'Vega ν',   desc: 'Sensitivity to volatility',          fmt: v => v.toFixed(4) },
    { key: 'theta', label: 'Theta Θ',  desc: 'Time decay (per day)',               fmt: v => v.toFixed(5) },
    { key: 'rho',   label: 'Rho ρ',    desc: 'Interest rate sensitivity',          fmt: v => v.toFixed(5) },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={pricerStyles.h1}>Pricing Engine</h1>
        <p style={pricerStyles.sub}>Binomial tree · Monte Carlo · Greeks — ported from spk-derivatives v0.4.0</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Inputs */}
        <div style={pricerStyles.card}>
          <div style={pricerStyles.cardLabel}>Model Inputs</div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[['binomial','Binomial'],['monte_carlo','Monte Carlo']].map(([v, l]) => (
              <button key={v} onClick={() => set('method', v)} style={{
                ...pricerStyles.tab, ...(inputs.method === v ? pricerStyles.tabActive : {})
              }}>{l}</button>
            ))}
          </div>

          {[
            { key: 'S0',    label: 'Underlying S₀ ($/kWh)', step: 0.001,  min: 0.001  },
            { key: 'K',     label: 'Strike K ($/kWh)',       step: 0.001,  min: 0.001  },
            { key: 'T',     label: 'Maturity T (years)',      step: 0.01,   min: 0.01   },
            { key: 'r',     label: 'Risk-free rate r',        step: 0.001,  min: 0       },
            { key: 'sigma', label: 'Volatility σ (annual)',   step: 0.01,   min: 0.01   },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '14px' }}>
              <label style={pricerStyles.label}>{f.label}</label>
              <input type="number" value={inputs[f.key]} step={f.step} min={f.min}
                onChange={e => set(f.key, parseFloat(e.target.value) || 0)}
                style={pricerStyles.input}
              />
            </div>
          ))}

          {inputs.method === 'binomial' ? (
            <div style={{ marginBottom: '14px' }}>
              <label style={pricerStyles.label}>Steps N</label>
              <input type="range" min="10" max="300" step="10" value={inputs.N}
                onChange={e => set('N', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#34d399' }}
              />
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#567a5c', fontFamily: 'JetBrains Mono, monospace' }}>{inputs.N}</div>
            </div>
          ) : (
            <div style={{ marginBottom: '14px' }}>
              <label style={pricerStyles.label}>MC Paths</label>
              <input type="range" min="1000" max="20000" step="1000" value={inputs.numPaths}
                onChange={e => set('numPaths', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#34d399' }}
              />
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#567a5c', fontFamily: 'JetBrains Mono, monospace' }}>{inputs.numPaths.toLocaleString()}</div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[['Put', false],['Call', true]].map(([l, v]) => (
              <button key={l} onClick={() => set('isCall', v)} style={{
                ...pricerStyles.tab, ...(inputs.isCall === v ? pricerStyles.tabActive : {})
              }}>{l}</button>
            ))}
          </div>

          <button onClick={runPricer} disabled={loading} style={pricerStyles.runBtn}>
            {loading ? 'Computing…' : '▶  Run Pricing'}
          </button>
        </div>

        {/* Outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Price output */}
          <div style={pricerStyles.card}>
            <div style={pricerStyles.cardLabel}>Option Price</div>
            {result ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#567a5c', marginBottom: '4px' }}>Binomial (N={inputs.N})</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', color: '#34d399', fontWeight: '700' }}>
                    ${result.price.toFixed(5)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#3d5c42', marginTop: '4px' }}>per kWh · European {inputs.isCall ? 'Call' : 'Put'}</div>
                </div>
                {mcResult && (
                  <div style={{ borderLeft: '1px solid #1c2e1f', paddingLeft: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#567a5c', marginBottom: '4px' }}>Monte Carlo ({inputs.numPaths.toLocaleString()} paths)</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', color: '#d97706', fontWeight: '700' }}>
                      ${mcResult.price.toFixed(5)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#3d5c42', marginTop: '4px' }}>
                      95% CI: [{mcResult.low.toFixed(5)}, {mcResult.high.toFixed(5)}]
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: '#3d5c42', fontSize: '14px', padding: '16px 0' }}>Run the pricer to see output →</div>
            )}
          </div>

          {/* Greeks */}
          {result && (
            <div style={pricerStyles.card}>
              <div style={pricerStyles.cardLabel}>Greeks</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {greekDefs.map(g => (
                  <div key={g.key} style={{ background: '#0a130b', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '16px', color: '#d97706', marginBottom: '4px' }}>{g.label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', color: '#dde8de', fontWeight: '700' }}>{g.fmt(result[g.key])}</div>
                    <div style={{ fontSize: '10px', color: '#3d5c42', marginTop: '4px', lineHeight: '1.4' }}>{g.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stress test */}
          {stress && (
            <div style={pricerStyles.card}>
              <div style={pricerStyles.cardLabel}>Stress Tests</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#567a5c', marginBottom: '10px' }}>By Volatility (σ)</div>
                  {stress.byVol.map(row => (
                    <div key={row.v} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #1a2b1d', fontSize: '12px' }}>
                      <span style={{ color: '#567a5c', fontFamily: 'JetBrains Mono, monospace' }}>σ = {(row.v * 100).toFixed(0)}%</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: row.v === 1.89 ? '#d97706' : '#dde8de' }}>${row.price.toFixed(5)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#567a5c', marginBottom: '10px' }}>By Strike (K)</div>
                  {stress.byStrike.map(row => (
                    <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #1a2b1d', fontSize: '12px' }}>
                      <span style={{ color: '#567a5c', fontFamily: 'JetBrains Mono, monospace' }}>K = ${row.k.toFixed(4)}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: Math.abs(row.k - inputs.K) < 0.0001 ? '#d97706' : '#dde8de' }}>${row.price.toFixed(5)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const pricerStyles = {
  h1:  { fontFamily: 'Instrument Serif, serif', fontSize: '32px', color: '#dde8de', margin: 0, fontWeight: '400' },
  sub: { fontSize: '13px', color: '#567a5c', margin: '6px 0 0', fontFamily: 'JetBrains Mono, monospace' },
  card: { background: '#0e1a10', border: '1px solid #1c2e1f', borderRadius: '12px', padding: '20px' },
  cardLabel: { fontSize: '10px', letterSpacing: '0.1em', color: '#3d5c42', textTransform: 'uppercase', marginBottom: '16px' },
  label: { display: 'block', fontSize: '11px', color: '#567a5c', marginBottom: '5px' },
  input: {
    width: '100%', background: '#0a130b', border: '1px solid #1c2e1f', borderRadius: '6px',
    color: '#dde8de', padding: '8px 10px', fontSize: '14px', fontFamily: 'JetBrains Mono, monospace',
    outline: 'none', boxSizing: 'border-box',
  },
  tab: {
    flex: 1, padding: '7px', background: 'transparent', border: '1px solid #1c2e1f',
    borderRadius: '6px', color: '#567a5c', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
  },
  tabActive: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' },
  runBtn: {
    width: '100%', padding: '12px', background: '#34d399', border: 'none', borderRadius: '8px',
    color: '#070d08', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
    transition: 'all 0.15s',
  },
};

Object.assign(window, { Pricer });
