import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Coins, Download, Play, RotateCcw, ShieldAlert } from 'lucide-react';
import { downloadJson } from '../lib/evidenceLab';
import {
  CONSTRAINTS,
  PAYMENT_TYPES,
  createSimulation,
  issueSpk,
  paySpk,
} from '../lib/currencyLab';
import { runGuidedDemo, runSafeScenario } from '../lib/labScenarios';

export default function CurrencyLab({ receipt, onOpenEvidence, onOpenSepolia }) {
  const [sim, setSim] = useState(null);
  const [issueAmount, setIssueAmount] = useState('');
  const [payType, setPayType] = useState('SERVICE');
  const [payAmount, setPayAmount] = useState('5');
  const [message, setMessage] = useState(null);

  const eligible = receipt?.totals?.issuance_eligible;
  const cap = receipt?.totals?.issuance_cap_spk ?? 0;

  const evidenceInput = useMemo(() => ({
    evidenceHash: receipt?.evidence_hash || '',
    issuanceCapSpk: receipt?.totals?.issuance_cap_spk ?? 0,
    surplusKwh: receipt?.totals?.eligible_surplus_kwh ?? 0,
    issuanceEligible: Boolean(receipt?.totals?.issuance_eligible),
  }), [receipt]);

  const makeBase = useCallback(() => createSimulation(evidenceInput), [evidenceInput]);

  useEffect(() => {
    if (!receipt?.evidence_hash) {
      setSim(null);
      setMessage(null);
      return;
    }
    setSim(makeBase());
    setIssueAmount(
      receipt.totals?.issuance_eligible
        ? String(Math.min(20, receipt.totals?.issuance_cap_spk ?? 0) || '')
        : '',
    );
    setMessage(null);
  }, [receipt, makeBase]);

  const apply = (fn) => {
    if (!sim) return;
    const out = fn(sim);
    setSim(out.sim);
    const last = out.sim.events.at(-1);
    const severity = out.severity || last?.severity || (out.ok ? 'success' : 'error');
    const tone = severity === 'success' ? 'ok' : severity === 'warning' ? 'warning' : 'err';
    setMessage({ tone, text: last?.detail || out.error || 'Done' });
  };

  const reset = () => {
    setSim(makeBase());
    setIssueAmount(eligible ? String(Math.min(20, cap) || '') : '');
    setMessage({ tone: 'ok', text: 'Simulation reset to the active evidence receipt.' });
  };

  const runWalkthrough = () => {
    const out = runGuidedDemo(evidenceInput);
    setSim(out.sim);
    const last = out.sim.events.at(-1);
    const tone = out.severity === 'warning' ? 'warning' : out.ok ? 'ok' : 'err';
    setMessage({ tone, text: last?.detail || out.error || 'Guided walkthrough complete.' });
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
            Complete Evidence Lab first with admissible surplus evidence. This panel simulates
            bounded issuance, typed payments, and settlement capacity — without minting.
          </p>
        </header>
        <div className="workbench-empty" role="status">
          No active evidence receipt. Open <strong>Evidence Lab</strong>, load the sample CSV, and
          keep a successful receipt in session. A failed replacement CSV clears this panel.
          <div className="workbench-card-actions">
            <button type="button" className="wallet-button" onClick={onOpenEvidence}>
              Open Evidence Lab <ArrowRight size={15} aria-hidden />
            </button>
          </div>
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
          Issue up to the illustrative evidence cap, allocate typed payments, and settle against
          explicit settlement capacity (not the payer wallet). This does not call mint functions.
        </p>
      </header>

      <aside className="workbench-callout" role="note">
        <ShieldAlert size={16} aria-hidden />
        <div>
          Bound to evidence hash <code>{receipt.evidence_hash.slice(0, 16)}…</code>
          {' · '}
          {eligible ? (
            <>
              illustrative cap <strong>{cap} SPK</strong> (1 SPK / eligible surplus kWh rule)
            </>
          ) : (
            <>
              <strong>issuance not eligible</strong> ({receipt.totals?.issuance_reason})
            </>
          )}
          . Live minting remains gated and separate.
        </div>
      </aside>

      <div className="constraint-row" aria-label="Five constraints">
        {CONSTRAINTS.map((constraint) => (
          <span key={constraint.id} className="constraint-chip" title={constraint.tip}>
            {constraint.label}
          </span>
        ))}
      </div>

      <div className="guided-demo-card">
        <div>
          <h2>Guided walkthrough</h2>
          <p>
            Reset to this receipt, issue up to 20 simulated SPK, make a SERVICE payment, then stress
            settlement capacity until the shortfall is explicit in the ledger.
          </p>
        </div>
        <div className="guided-demo-actions">
          <button type="button" className="wallet-button" disabled={!eligible} onClick={runWalkthrough}>
            <Play size={15} aria-hidden /> Run walkthrough
          </button>
          <button type="button" className="ghost-button" onClick={reset}>
            <RotateCcw size={15} aria-hidden /> Reset
          </button>
        </div>
      </div>

      {message ? (
        <div
          className={message.tone === 'ok' ? 'workbench-ok' : message.tone === 'warning' ? 'workbench-warning' : 'spk-error-banner'}
          role={message.tone === 'err' ? 'alert' : 'status'}
        >
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
              disabled={!eligible}
              onChange={(event) => setIssueAmount(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="wallet-button"
            disabled={!eligible}
            onClick={() => apply((state) => issueSpk(state, issueAmount))}
          >
            Issue simulated SPK
          </button>
        </div>
        <p className="muted" title={constraintTips.issuance?.tip}>
          Illustrative issuance cap under the Public Lab 1 SPK / eligible surplus kWh rule.
          Replay of the same evidence hash is blocked. Payments do not reduce settlement capacity.
          Settlement capacity starts as an illustrative full-cover baseline equal to issued SPK —
          issuance does not economically fund settlement.
        </p>
      </div>

      <div className="workbench-card">
        <h2>2. Typed payments (payer wallet)</h2>
        <div className="inline-form">
          <label>
            Type
            <select value={payType} onChange={(event) => setPayType(event.target.value)}>
              {PAYMENT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
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
              onChange={(event) => setPayAmount(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="ghost-button"
            onClick={() => apply((state) => paySpk(state, { type: payType, amount: payAmount }))}
          >
            Pay
          </button>
        </div>
      </div>

      <div className="workbench-card">
        <h2>3. Settlement scenarios</h2>
        <p className="muted">
          Shortfall stresses <em>settlement capacity</em>, not the payer’s remaining wallet balance.
          Issue SPK first; a stress scenario can only reduce existing illustrative capacity.
        </p>
        <div className="workbench-actions">
          <button type="button" className="ghost-button" onClick={() => apply((state) => runSafeScenario(state, 'normal'))}>
            Normal settlement
          </button>
          <button type="button" className="ghost-button" onClick={() => apply((state) => runSafeScenario(state, 'shortfall'))}>
            Settlement shortfall
          </button>
          <button type="button" className="ghost-button" onClick={() => apply((state) => runSafeScenario(state, 'duplicate'))}>
            Duplicate evidence
          </button>
          <button type="button" className="ghost-button" onClick={() => apply((state) => runSafeScenario(state, 'governance'))}>
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
              <li><span>Payer remaining</span><strong>{sim.balances.remaining_spk}</strong></li>
              <li><span>Paid</span><strong>{sim.balances.paid_spk}</strong></li>
              <li><span>Redeemed</span><strong>{sim.balances.redeemed_spk}</strong></li>
              <li><span>Settlement capacity</span><strong>{sim.balances.settlement_capacity_spk}</strong></li>
              <li><span>Circulating</span><strong>{sim.balances.circulating_spk}</strong></li>
            </ul>
            {sim.obligations.at(-1) ? (
              <div className="settlement-breakdown">
                <h3>Latest settlement</h3>
                <ul className="stat-grid">
                  <li><span>Outstanding claim</span><strong>{sim.obligations.at(-1).outstanding_claim_spk}</strong></li>
                  <li><span>Capacity (pre-cover)</span><strong>{sim.obligations.at(-1).settlement_capacity_spk}</strong></li>
                  <li><span>Covered</span><strong>{sim.obligations.at(-1).covered_spk}</strong></li>
                  <li><span>Shortfall</span><strong>{sim.obligations.at(-1).shortfall_spk}</strong></li>
                </ul>
              </div>
            ) : null}
          </div>

          <div className="workbench-card">
            <h2>Event timeline</h2>
            <ol className="event-timeline">
              {sim.events.map((event) => (
                <li
                  key={event.t}
                  className={event.severity === 'warning' ? 'event-warn' : event.ok ? 'event-ok' : 'event-block'}
                >
                  <span className="event-type">{event.type}</span>
                  <span className="event-constraint" title={constraintTips[event.constraint]?.tip}>
                    {event.constraint}
                  </span>
                  <span className="event-detail">{event.detail}</span>
                </li>
              ))}
            </ol>
            <div className="workbench-card-actions">
              <button
                type="button"
                className="wallet-button"
                onClick={() => downloadJson(`spk-currency-simulation-${receipt.evidence_hash.slice(0, 8)}.json`, sim)}
              >
                <Download size={16} /> Download simulation JSON
              </button>
              <button type="button" className="ghost-button" onClick={onOpenSepolia}>
                Inspect optional Sepolia proof <ArrowRight size={15} aria-hidden />
              </button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
