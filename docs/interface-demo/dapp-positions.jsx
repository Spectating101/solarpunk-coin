// Positions Tab — portfolio of open hedges
const Positions = () => {
  const positions = [
    { id: 'SPK-PUT-2026-JAN', farm: 'Taichung Solar A', kwh: 20000, strike: 0.0525, expiry: 'Jan 31 2026', margin: 580.00, mtm: +42.30, status: 'ACTIVE',    pct: 88 },
    { id: 'SPK-PUT-2026-FEB', farm: 'Kaohsiung Wind 2', kwh: 8500,  strike: 0.0500, expiry: 'Feb 28 2026', margin: 210.00, mtm: -18.10, status: 'MARGIN_CALL', pct: 62 },
    { id: 'SPK-PUT-2026-MAR', farm: 'Tainan Solar B',   kwh: 35000, strike: 0.0550, expiry: 'Mar 31 2026', margin: 980.00, mtm: +91.50, status: 'ACTIVE',    pct: 95 },
  ];

  const totalMargin   = positions.reduce((s, p) => s + p.margin, 0);
  const totalMtm      = positions.reduce((s, p) => s + p.mtm, 0);
  const totalKwh      = positions.reduce((s, p) => s + p.kwh, 0);

  const statusColor = { ACTIVE: '#34d399', MARGIN_CALL: '#d97706', LIQUIDATED: '#ef4444' };
  const statusBg    = { ACTIVE: 'rgba(52,211,153,0.08)', MARGIN_CALL: 'rgba(217,119,6,0.1)', LIQUIDATED: 'rgba(239,68,68,0.08)' };
  const statusBorder = { ACTIVE: 'rgba(52,211,153,0.2)', MARGIN_CALL: 'rgba(217,119,6,0.3)', LIQUIDATED: 'rgba(239,68,68,0.2)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={posStyles.h1}>Positions</h1>
        <p style={posStyles.sub}>Open put options · Mark-to-market · VaR margin status</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Open Positions', value: `${positions.length}`,               color: '#dde8de' },
          { label: 'Total Hedged',   value: `${totalKwh.toLocaleString()} kWh`,  color: '#34d399' },
          { label: 'Total Margin',   value: `$${totalMargin.toFixed(2)}`,         color: '#d97706' },
          { label: 'Net MTM PnL',    value: `${totalMtm >= 0 ? '+' : ''}$${totalMtm.toFixed(2)}`, color: totalMtm >= 0 ? '#34d399' : '#ef4444' },
        ].map(s => (
          <div key={s.label} style={posStyles.statCard}>
            <div style={{ fontSize: '11px', color: '#567a5c', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '22px', fontWeight: '700', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Positions cards */}
      {positions.map(p => (
        <div key={p.id} style={{ ...posStyles.card, borderLeft: `3px solid ${statusColor[p.status]}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#3d5c42' }}>{p.id}</span>
                <span style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '99px',
                  background: statusBg[p.status], border: `1px solid ${statusBorder[p.status]}`,
                  color: statusColor[p.status], fontFamily: 'JetBrains Mono, monospace',
                }}>{p.status}</span>
              </div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px', color: '#dde8de' }}>{p.farm}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', color: p.mtm >= 0 ? '#34d399' : '#ef4444', fontWeight: '700' }}>
                {p.mtm >= 0 ? '+' : ''}${p.mtm.toFixed(2)}
              </div>
              <div style={{ fontSize: '11px', color: '#567a5c', marginTop: '2px' }}>Mark-to-market PnL</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
            {[
              ['Coverage',       `${p.kwh.toLocaleString()} kWh`],
              ['Strike',         `$${p.strike.toFixed(4)}`],
              ['Expiry',         p.expiry],
              ['Margin Locked',  `$${p.margin.toFixed(2)}`],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: '11px', color: '#3d5c42', marginBottom: '3px' }}>{l}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#dde8de' }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Margin health bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#567a5c', marginBottom: '5px' }}>
              <span>Margin Health</span>
              <span style={{ color: statusColor[p.status], fontFamily: 'JetBrains Mono, monospace' }}>{p.pct}%</span>
            </div>
            <div style={{ height: '4px', background: '#1c2e1f', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${p.pct}%`, borderRadius: '99px',
                background: p.pct > 80 ? '#34d399' : p.pct > 60 ? '#d97706' : '#ef4444',
                transition: 'width 0.6s ease',
              }}/>
            </div>
            {p.status === 'MARGIN_CALL' && (
              <div style={{ marginTop: '10px', padding: '10px 12px', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: '8px', fontSize: '12px', color: '#d97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠ Margin call — add collateral or reduce position to avoid liquidation
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Margin stress note */}
      <div style={{ ...posStyles.card, background: '#0a130b' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#3d5c42', textTransform: 'uppercase', marginBottom: '12px' }}>Risk Model</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px' }}>
          {[
            { label: 'Margin Model',   val: '1.5× VaR99 payoff' },
            { label: 'Maintenance',    val: '75% of initial margin' },
            { label: 'Liquidation',    val: '1% penalty to insurance fund' },
          ].map(r => (
            <div key={r.label} style={{ borderLeft: '2px solid #1c2e1f', paddingLeft: '12px' }}>
              <div style={{ color: '#3d5c42', fontSize: '11px', marginBottom: '3px' }}>{r.label}</div>
              <div style={{ color: '#dde8de', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>{r.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const posStyles = {
  h1: { fontFamily: 'Instrument Serif, serif', fontSize: '32px', color: '#dde8de', margin: 0, fontWeight: '400' },
  sub: { fontSize: '13px', color: '#567a5c', margin: '6px 0 0', fontFamily: 'JetBrains Mono, monospace' },
  card: { background: '#0e1a10', border: '1px solid #1c2e1f', borderRadius: '12px', padding: '20px' },
  statCard: { background: '#0e1a10', border: '1px solid #1c2e1f', borderRadius: '12px', padding: '16px 18px' },
};

Object.assign(window, { Positions });
