import React, { useEffect, useMemo, useState } from 'react';
import { Download, Coins, ShieldAlert } from 'lucide-react';
import { downloadJson } from '../lib/evidenceLab';
import {
  CONSTRAINTS,
  PAYMENT_TYPES,
  createSimulation,
  issueSpk,
  paySpk,
  runScenario,
} from '../lib/currencyLab';

export default function CurrencyLab({ receipt }) {
  const [sim, setSim] = useState(null);
  const [issueAmount, setIssueAmount] = useState('');
  const [payType, setPayType] = useState('SERVICE');
  const [payAmount, setPayAmount] = useState('5');
  const [message, setMessage] = useState(null);

  const cap = receipt?.totals?.issuance_cap_spk ?? 0;

  useEffect(() => {
    if (!receipt?.evidence_hash) {
      setSim(null);
      return;
    }
    const base = createSimulation({
      evidenceHash: receipt.evidence_hash,
      issuanceCapSpk: receipt.totals?.issuance_cap_spk ?? 0,
      surplusKwh: receipt.totals?.eligible_surplus_kwh ?? 0,
    });
    setSim(base);
    setIssueAmount(String(Math.min(20, receipt.totals?.issuance_cap_spk ?? 0) || ''));
    setMessage(null);
  }, [receipt]);

  const apply = (fn) => {
    if (!sim) return;
    const out = fn(sim);
    setSim(out.sim);
    setMessage(out.ok ? { tone: 'ok', text: out.sim.events.at(-1)?.detail } : { tone: 'err', text: out.error });
  };

  const constraintTips = useMemo(() => Object.fromEntries(CONSTRAINTS.map((c) => [c.id, c])), []);

  if (!receipt) {
    return (
      <section className="workbench-panel" aria-labelledby="currency-lab-heading">
        <header className="workbench-panel-header">
          <p className="eyebrow">Off-chain simulation</p>
          <h1 id="currency-lab-heading">
            <Coins size={22} aria-hidden /> Currency Lab
          </h1>
          <p className="workbench-lead">
            Complete Evidence Lab first. This panel simulates bounded issuance, typed payments,
            settlement, and shortfalls from your local evidence receipt.
          </p>
        </header>
        <div className="workbench-empty" role="status">
          No evidence receipt yet. Open <strong>Evidence Lab</strong>, load the sample CSV, and
          download or keep the receipt in session.
        </div>
      </section>
    );
  }

  return (
    <section className="workbench-panel currency-lab" aria-labelledby="currency-lab-heading">
      <header className="workbench-panel-header">
        <p className="eyebrow">Off-chain · deterministic · no private keys</p>
        <h1 id="currency-lab-heading">
          <Coins size={22} aria-hidden /> Currency Lab
        </h1>
        <p className="workbench-lead">
          Issue up to the evidence cap, allocate SERVICE / LABOR / GOODS / NETWORK payments, and
          surface shortfalls explicitly. This does not call mint functions.
        </p>
      </header>

      <aside className="workbench-callout" role="note">
        <ShieldAlert size={16} aria-hidden />
        <div>
          Bound to evidence hash <code>{receipt.evidence_hash.slice(0, 16)}…</code> · cap{' '}
          <strong>{cap} SPK</strong>. Live minting remains gated and separate.
        </div>
      </aside>

      <div className="constraint-row" aria-label="Five constraints">
        {CONSTRAINTS.map((c) => (
          <span key={c.id} className="constraint-chip" title={c.tip}>
            {c.label}
          </span>
        ))}
      </div>

      {message ? (
        <div className={message.tone === 'ok' ? 'workbench-ok' : 'spk-error-banner'} role="status">
          {message.text}
        </div>
      ) : null}

      <div className="workbench-card">
        <h2>1. Bounded issuance</h2>
        <div className="inline-form">
          <label>
            Issue SPK (max {cap})
            <input
              type="number"
              min="0"
              step="0.1"
              value={issueAmount}
              onChange={(e) => setIssueAmount(e.target.value)}
            />
          </label>
          <button type="button" className="wallet-button" onClick={() => apply((s) => issueSpk(s, issueAmount))}>
            Issue simulated SPK
          </button>
        </div>
        <p className="muted" title={constraintTips.issuance?.tip}>
          Issuance constraint: cannot exceed cap; replay of the same evidence hash is blocked.
        </p>
      </div>

      <div className="workbench-card">
        <h2>2. Typed payments</h2>
        <div className="inline-form">
          <label>
            Type
            <select value={payType} onChange={(e) => setPayType(e.target.value)}>
              {PAYMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Amount
            <input
              type="number"
              min="0"
              step="0.1"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="ghost-button"
            onClick={() => apply((s) => paySpk(s, { type: payType, amount: payAmount }))}
          >
            Pay
          </button>
        </div>
      </div>

      <div className="workbench-card">
        <h2>3. Scenarios</h2>
        <div className="workbench-actions">
          <button type="button" className="ghost-button" onClick={() => apply((s) => runScenario(s, 'normal'))}>
            Normal settlement
          </button>
          <button type="button" className="ghost-button" onClick={() => apply((s) => runScenario(s, 'shortfall'))}>
            Settlement shortfall
          </button>
          <button type="button" className="ghost-button" onClick={() => apply((s) => runScenario(s, 'duplicate'))}>
            Duplicate evidence
          </button>
          <button type="button" className="ghost-button" onClick={() => apply((s) => runScenario(s, 'governance'))}>
            Governance override
          </button>
        </div>
      </div>

      {sim ? (
        <>
          <div className="workbench-card workbench-stats">
            <h2>Balances</h2>
            <ul className="stat-grid">
              <li><span>Issued</span><strong>{sim.balances.issued_spk}</strong></li>
              <li><span>Paid</span><strong>{sim.balances.paid_spk}</strong></li>
              <li><span>Redeemed</span><strong>{sim.balances.redeemed_spk}</strong></li>
              <li><span>Remaining</span><strong>{sim.balances.remaining_spk}</strong></li>
              <li><span>Circulating</span><strong>{sim.balances.circulating_spk}</strong></li>
            </ul>
          </div>

          <div className="workbench-card">
            <h2>Event timeline</h2>
            <ol className="event-timeline">
              {sim.events.map((ev) => (
                <li key={ev.t} className={ev.ok ? 'event-ok' : 'event-block'}>
                  <span className="event-type">{ev.type}</span>
                  <span className="event-constraint" title={constraintTips[ev.constraint]?.tip}>
                    {ev.constraint}
                  </span>
                  <span className="event-detail">{ev.detail}</span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              className="wallet-button"
              onClick={() => downloadJson(`spk-currency-simulation-${receipt.evidence_hash.slice(0, 8)}.json`, sim)}
            >
              <Download size={16} /> Download simulation JSON
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
