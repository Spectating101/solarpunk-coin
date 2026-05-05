// Sidebar: nav + live oracle feed + wallet
const Sidebar = ({ activeTab, setActiveTab, account, connectWallet, isConnecting, oracleFeed }) => {
  const nav = [
    { id: 'overview',  label: 'Overview',   icon: '◉' },
    { id: 'dashboard', label: 'Dashboard',  icon: '◈' },
    { id: 'pricer',    label: 'Pricer',     icon: '∿' },
    { id: 'hedge',     label: 'Hedge',      icon: '⊕' },
    { id: 'positions', label: 'Positions',  icon: '≡' },
  ];

  return (
    <aside style={sidebarStyles.aside}>
      {/* Logo */}
      <div style={sidebarStyles.logo}>
        <div style={sidebarStyles.logoMark}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="5" fill="#d97706"/>
            <line x1="11" y1="0" x2="11" y2="4"  stroke="#d97706" strokeWidth="1.5"/>
            <line x1="11" y1="18" x2="11" y2="22" stroke="#d97706" strokeWidth="1.5"/>
            <line x1="0" y1="11" x2="4" y2="11"  stroke="#d97706" strokeWidth="1.5"/>
            <line x1="18" y1="11" x2="22" y2="11" stroke="#d97706" strokeWidth="1.5"/>
            <line x1="3.2" y1="3.2" x2="6" y2="6"   stroke="#d97706" strokeWidth="1.5"/>
            <line x1="16" y1="16" x2="18.8" y2="18.8" stroke="#d97706" strokeWidth="1.5"/>
            <line x1="18.8" y1="3.2" x2="16" y2="6"  stroke="#d97706" strokeWidth="1.5"/>
            <line x1="6" y1="16" x2="3.2" y2="18.8"  stroke="#d97706" strokeWidth="1.5"/>
          </svg>
        </div>
        <div>
          <div style={sidebarStyles.logoName}>SolarPunk</div>
          <div style={sidebarStyles.logoSub}>Protocol · Sepolia</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        <div style={sidebarStyles.navSection}>Navigation</div>
        {nav.map(item => (
          <button key={item.id} style={{
            ...sidebarStyles.navItem,
            ...(activeTab === item.id ? sidebarStyles.navItemActive : {})
          }} onClick={() => setActiveTab(item.id)}>
            <span style={sidebarStyles.navIcon}>{item.icon}</span>
            {item.label}
            {activeTab === item.id && <span style={sidebarStyles.navDot}/>}
          </button>
        ))}
      </nav>

      {/* Oracle Feed */}
      <div style={sidebarStyles.oracleBox}>
        <div style={sidebarStyles.navSection}>Oracle Feed</div>
        {oracleFeed.map((o, i) => (
          <div key={i} style={sidebarStyles.oracleRow}>
            <span style={{ color: '#567a5c', fontSize: '11px' }}>{o.label}</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: o.ok ? '#34d399' : '#f59e0b' }}>
              {o.value}
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'block', animation: 'pulse 2s infinite' }}/>
          <span style={{ fontSize: '11px', color: '#34d399' }}>Ethereum Sepolia · Live</span>
        </div>
      </div>

      {/* Resource links */}
      <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <a href="https://github.com/Spectating101/solarpunk-coin" target="_blank" rel="noopener" style={sidebarStyles.linkBtn}>
          <span style={{ fontSize: '12px' }}>↗</span> View on GitHub
        </a>
        <a href="https://github.com/Spectating101/spk-derivatives" target="_blank" rel="noopener" style={sidebarStyles.linkBtn}>
          <span style={{ fontSize: '12px' }}>↗</span> Pricing library
        </a>
        <div style={{ marginTop: '8px', padding: '8px 10px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '6px', fontSize: '10px', color: '#34d399', fontFamily: 'JetBrains Mono, monospace', lineHeight: '1.5' }}>
          <div style={{ fontWeight: '700', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }}/>
            Live on Sepolia
          </div>
          <div style={{ color: '#3d5c42' }}>7 contracts deployed · 79 tests passing · Daily keeper</div>
        </div>
      </div>
    </aside>
  );
};

const sidebarStyles = {
  aside: {
    width: '220px', minWidth: '220px', height: '100vh', position: 'sticky', top: 0,
    background: '#0a1410', borderRight: '1px solid #1c2e1f',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '20px 16px 16px', borderBottom: '1px solid #1c2e1f',
  },
  logoMark: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  logoName: { fontSize: '15px', fontWeight: '600', color: '#dde8de', fontFamily: 'Instrument Serif, serif', letterSpacing: '0.01em' },
  logoSub: { fontSize: '10px', color: '#567a5c', fontFamily: 'JetBrains Mono, monospace', marginTop: '1px' },
  navSection: { fontSize: '9px', letterSpacing: '0.12em', color: '#3d5c42', padding: '16px 16px 6px', textTransform: 'uppercase' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
    padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer',
    color: '#567a5c', fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
    textAlign: 'left', borderRadius: '0', transition: 'all 0.15s', position: 'relative',
  },
  navItemActive: { color: '#dde8de', background: 'rgba(52,211,153,0.06)' },
  navIcon: { fontSize: '14px', width: '16px', textAlign: 'center' },
  navDot: {
    marginLeft: 'auto', width: '4px', height: '4px',
    borderRadius: '50%', background: '#34d399',
  },
  oracleBox: {
    borderTop: '1px solid #1c2e1f', borderBottom: '1px solid #1c2e1f', padding: '0 0 12px',
  },
  oracleRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '4px 16px',
  },
  walletBtn: {
    width: '100%', padding: '10px', background: 'rgba(217,119,6,0.12)',
    border: '1px solid rgba(217,119,6,0.3)', borderRadius: '8px',
    color: '#d97706', fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer', fontWeight: '600', transition: 'all 0.15s',
  },
  linkBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '8px 10px', background: 'transparent',
    border: '1px solid #1c2e1f', borderRadius: '6px',
    color: '#567a5c', fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
    textDecoration: 'none', transition: 'all 0.15s',
  },
  walletConnected: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 12px', background: 'rgba(52,211,153,0.06)',
    border: '1px solid rgba(52,211,153,0.15)', borderRadius: '8px',
    color: '#34d399',
  },
};

Object.assign(window, { Sidebar });
