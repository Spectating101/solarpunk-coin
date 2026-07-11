import React from 'react';
import { Database, FlaskConical, Link2, RotateCcw } from 'lucide-react';

const STEPS = [
  { id: 'evidence', label: 'Evidence', icon: Database },
  { id: 'currency', label: 'Simulate', icon: FlaskConical },
  { id: 'sepolia', label: 'Sepolia proof', icon: Link2 },
];

function stepState(step, receipt) {
  if (step === 'evidence') return receipt ? ['ready', 'receipt ready'] : ['start', 'start here'];
  if (step === 'currency') {
    if (!receipt) return ['waiting', 'waiting'];
    return receipt.totals?.issuance_eligible ? ['ready', 'ready'] : ['blocked', 'no surplus basis'];
  }
  return ['optional', 'optional live proof'];
}

export default function LabSessionBar({ receipt, activeTab, onNavigate, onClearReceipt }) {
  const hash = receipt?.evidence_hash ? `${receipt.evidence_hash.slice(0, 10)}…` : null;

  return (
    <aside className="lab-session-bar" aria-label="Browser lab session">
      <div className="lab-session-top">
        <div>
          <p className="lab-session-kicker">Browser session</p>
          <p className="lab-session-summary">
            {receipt ? (
              <>
                Evidence receipt <code>{hash}</code> is active for this tab session.
              </>
            ) : (
              <>No active evidence receipt. Start with a sample or local CSV.</>
            )}
          </p>
          <p className="lab-session-privacy">
            Only the minimal receipt summary is retained in session storage; the raw CSV is not stored by the lab.
          </p>
        </div>
        {receipt ? (
          <button type="button" className="session-clear-button" onClick={onClearReceipt}>
            <RotateCcw size={14} aria-hidden /> Clear receipt
          </button>
        ) : null}
      </div>

      <div className="lab-session-steps">
        {STEPS.map(({ id, label, icon: Icon }, index) => {
          const [state, status] = stepState(id, receipt);
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              className={`lab-session-step ${state}${active ? ' active' : ''}`}
              onClick={() => onNavigate(id)}
              aria-current={active ? 'step' : undefined}
            >
              <span className="lab-session-step-index">0{index + 1}</span>
              <Icon size={16} aria-hidden />
              <span className="lab-session-step-copy">
                <strong>{label}</strong>
                <small>{status}</small>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
