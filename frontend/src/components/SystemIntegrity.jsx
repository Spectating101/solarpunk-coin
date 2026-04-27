import React from 'react';
import { Database, Link as LinkIcon, ShieldCheck, Activity } from 'lucide-react';

const SystemIntegrity = () => {
  const steps = [
    {
      label: 'Data Anchor',
      value: 'NASA POWER Satellite',
      desc: 'Physics-based truth for solar irradiance',
      icon: <Database size={18} className="text-primary" />
    },
    {
      label: 'Transport',
      value: 'Chainlink Oracle',
      desc: 'Tamper-proof off-chain data delivery',
      icon: <LinkIcon size={18} className="text-primary" />
    },
    {
      label: 'Settlement',
      value: 'Ethereum Sepolia',
      desc: 'Transparent, non-custodial clearing',
      icon: <ShieldCheck size={18} className="text-primary" />
    }
  ];

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Activity size={18} className="text-accent" />
        <h3 className="text-accent" style={{ margin: 0 }}>System Integrity</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
            {/* Connector Line */}
            {i < steps.length - 1 && (
              <div style={{ 
                position: 'absolute', 
                left: '19px', 
                top: '38px', 
                width: '2px', 
                height: '24px', 
                background: 'linear-gradient(to bottom, var(--primary), transparent)',
                opacity: 0.3
              }}></div>
            )}
            
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'rgba(74, 222, 128, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(74, 222, 128, 0.2)'
            }}>
              {step.icon}
            </div>

            <div>
              <p className="text-muted" style={{ fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{step.label}</p>
              <div style={{ fontSize: '15px', fontWeight: 'bold', margin: '2px 0' }}>{step.value}</div>
              <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '24px', 
        paddingTop: '16px', 
        borderTop: '1px solid var(--border)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)'
      }}>
        PROTOCOL STATUS: RISK-BOXED (M3.5)
      </div>
    </div>
  );
};

export default SystemIntegrity;
