import React, { useEffect, useState } from 'react';
import { Activity, Coins, ExternalLink, Network, Rocket, Users, Zap } from 'lucide-react';
import { SEPOLIA_EXPLORER } from '../constants/contracts';
import SpkV1WalletPay from './SpkV1WalletPay';
import useSpkV1Live from '../hooks/useSpkV1Live';

function explorerLink(base, kind, value) {
  if (!base || !value) return null;
  return `${base}/${kind}/${value}`;
}

function formatPercent(value) {
  if (!Number.isFinite(Number(value))) return 'n/a';
  return `${Number(value).toFixed(2)}%`;
}

export default function SpkV1Console({ provider, signer, account }) {
  const [runtime, setRuntime] = useState(null);
  const [error, setError] = useState(null);
  const live = useSpkV1Live(runtime);

  const loadRuntime = () => fetch('/spk_v1.json')
      .then((response) => {
        if (!response.ok) throw new Error('SPK v1 runtime not deployed yet');
        return response.json();
      })
      .then(setRuntime)
      .catch((err) => setError(err.message));

  useEffect(() => {
    loadRuntime();
    const id = window.setInterval(loadRuntime, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (error) {
    return (
      <section className="launch-shell">
        <div className="proof-hero launch-hero">
          <div>
            <div className="eyebrow"><Rocket size={14} /> SPK v1 Network Money</div>
            <h1>Deploy SPK v1 to load the live runtime.</h1>
            <p>Run <code>npm run spk:v1:launch</code> locally or deploy to Sepolia, then refresh.</p>
            <p className="muted">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!runtime) {
    return <section className="launch-shell"><p>Loading SPK v1 runtime…</p></section>;
  }

  const explorer = runtime.explorer_base || SEPOLIA_EXPLORER;
  const policy = runtime.monetary_policy || {};
  const genesis = runtime.genesis;
  const liveData = live.status === 'ok' ? live.data : null;
  const onChain = liveData ? {
    total_supply_spk: liveData.totalSupply,
    deployer_spk_balance: liveData.deployerBalance,
    cumulative_surplus_kwh: liveData.cumulativeSurplusKwh,
    kwh_per_spk: liveData.kwhPerSpk,
    peg_enabled: liveData.pegEnabled,
  } : (runtime.on_chain || {});
  const metrics = liveData?.metrics ? {
    total_settled_spk: liveData.metrics.totalSettled,
    total_redeemed_spk: liveData.metrics.totalRedeemed,
    circulation_share_percent: liveData.metrics.circulationShare,
    redemption_share_percent: liveData.metrics.redemptionShare,
    network_payment_count: liveData.metrics.networkPaymentCount,
  } : genesis?.metrics;
  const operations = runtime.operations || [];
  const lastCycle = operations[operations.length - 1];
  const counterpartyBalances = liveData?.counterpartyBalances || runtime.counterparty_balances_spk || {};
  const counterparties = runtime.counterparties || {};
  const paymentLedger = runtime.chain_index?.payment_ledger || [];
  const settledByKind = runtime.chain_index?.settled_by_kind_spk || {};

  return (
    <section className="launch-shell">
      <div className="proof-hero launch-hero">
        <div>
          <div className="eyebrow"><Rocket size={14} /> SPK v1 — Network Money</div>
          <h1>Energy-attested issuance. Circulation-first settlement.</h1>
          <p>
            This is the primary product runtime: one stack, one config, energy-native minting,
            network payments as the main path, optional energy exit as secondary.
          </p>
        </div>
        <div className="system-tile good">
          <div className="system-title"><Coins size={18} /> Runtime</div>
          <div className="system-grid">
            <span>Network</span><strong>{runtime.network}</strong>
            <span>Status</span><strong>{runtime.status || 'deployed'}</strong>
            <span>Launched</span><strong>{runtime.launched_at?.slice(0, 10) || 'n/a'}</strong>
          </div>
        </div>
      </div>

      <div className="launch-mode-grid">
        <div className="launch-mode-card launchable">
          <div className="launch-mode-head">
            <Zap size={18} />
            <div>
              <h3>Monetary Policy</h3>
              <span>v1 constitution</span>
            </div>
          </div>
          <ul className="launch-checklist">
            <li>Issuance: {policy.issuance_mode}</li>
            <li>Primary use: {policy.primary_use}</li>
            <li>Peg: {policy.peg_enabled ? 'on' : 'off'}</li>
            <li>Reference USD/kWh: {policy.reference_usd_per_kwh}</li>
          </ul>
        </div>

        <div className="launch-mode-card launchable">
          <div className="launch-mode-head">
            <Network size={18} />
            <div>
              <h3>Contracts</h3>
              <span>{runtime.network}</span>
            </div>
          </div>
          <ul className="launch-checklist">
            {Object.entries(runtime.contracts || {}).map(([name, address]) => (
              <li key={name}>
                {name}:{' '}
                <a href={explorerLink(explorer, 'address', address)} target="_blank" rel="noreferrer">
                  {address.slice(0, 10)}… <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="proof-panel">
        <h2><Activity size={16} /> On-chain state {liveData ? '(live RPC)' : '(cached)'}</h2>
        <div className="system-grid">
          <span>Total supply</span><strong>{onChain.total_supply_spk ?? 'n/a'} SPK</strong>
          <span>Deployer balance</span><strong>{onChain.deployer_spk_balance ?? 'n/a'} SPK</strong>
          <span>Cumulative surplus</span><strong>{onChain.cumulative_surplus_kwh ?? 'n/a'} kWh</strong>
          <span>Circulation share</span><strong>{formatPercent(metrics?.circulation_share_percent)}</strong>
          <span>Redemption share</span><strong>{formatPercent(metrics?.redemption_share_percent)}</strong>
          <span>Network payments</span><strong>{metrics?.network_payment_count ?? 'n/a'}</strong>
          <span>Settled SPK</span><strong>{metrics?.total_settled_spk ?? 'n/a'}</strong>
        </div>
        {Object.keys(settledByKind).length > 0 ? (
          <p className="muted">
            By kind: {Object.entries(settledByKind).map(([k, v]) => `${k} ${v}`).join(' · ')}
          </p>
        ) : null}
        <p className="muted">
          {liveData
            ? `Live ${liveData.fetchedAt.slice(0, 19).replace('T', ' ')} UTC`
            : runtime.synced_at
              ? `Cached sync ${runtime.synced_at.slice(0, 19).replace('T', ' ')} UTC`
              : null}
        </p>
      </div>

      {paymentLedger.length > 0 ? (
        <div className="proof-panel">
          <h2>Payment ledger</h2>
          <p>{paymentLedger.length} on-chain network payments indexed from CurrencySystem events.</p>
          <ul className="launch-checklist">
            {paymentLedger.slice(-12).reverse().map((row) => (
              <li key={`${row.payment_id}-${row.tx_hash}`}>
                #{row.payment_id} {row.payment_kind} — {row.spk} SPK → {row.payee.slice(0, 10)}…{' '}
                <a href={explorerLink(explorer, 'tx', row.tx_hash)} target="_blank" rel="noreferrer">
                  tx
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {Object.keys(counterparties).length > 0 ? (
        <div className="proof-panel">
          <h2><Users size={16} /> Network counterparties</h2>
          <p>Simulated multi-party circulation — preset Sepolia addresses receive SPK from operator cycles.</p>
          <ul className="launch-checklist">
            {Object.entries(counterparties).map(([name, info]) => (
              <li key={name}>
                {name} ({info.role}):{' '}
                <a href={explorerLink(explorer, 'address', info.address)} target="_blank" rel="noreferrer">
                  {info.address.slice(0, 10)}…
                </a>
                {' — '}
                <strong>{counterpartyBalances[name] ?? 0} SPK</strong>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <SpkV1WalletPay provider={provider} signer={signer} account={account} runtime={runtime} />

      {lastCycle ? (
        <div className="proof-panel">
          <h2>Latest operator cycle</h2>
          <p>{lastCycle.cycle_id} — {lastCycle.completed_at?.slice(0, 19).replace('T', ' ')} UTC</p>
          <ul className="launch-checklist">
            {(lastCycle.steps || []).map((step, index) => (
              <li key={`${step.action}-${step.tx_hash || step.label || index}`}>
                {step.action}
                {step.spk ? ` — ${step.spk} SPK` : ''}
                {step.surplus_kwh ? ` — ${step.surplus_kwh} kWh` : ''}
                {step.tx_hash ? (
                  <>
                    {' '}
                    <a href={explorerLink(explorer, 'tx', step.tx_hash)} target="_blank" rel="noreferrer">
                      tx
                    </a>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {genesis?.mint_tx_hash || genesis?.steps?.length ? (
        <div className="proof-panel">
          <h2>Genesis</h2>
          {genesis.minted_spk ? (
            <p>Minted {genesis.minted_spk} SPK from {genesis.surplus_kwh} kWh surplus.</p>
          ) : (
            <p>{genesis.note || 'Genesis metrics recorded from chain.'}</p>
          )}
          <ul className="launch-checklist">
            {genesis.mint_tx_hash ? (
              <li>
                mint:{' '}
                <a href={explorerLink(explorer, 'tx', genesis.mint_tx_hash)} target="_blank" rel="noreferrer">
                  {genesis.mint_tx_hash.slice(0, 14)}…
                </a>
              </li>
            ) : null}
            {(genesis.steps || []).map((step) => (
              <li key={`${step.action}-${step.label}-${step.tx_hash}`}>
                {step.action} ({step.label}) {step.spk} SPK —{' '}
                <a href={explorerLink(explorer, 'tx', step.tx_hash)} target="_blank" rel="noreferrer">
                  tx
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="proof-panel">
        <h2>Operator loop</h2>
        <p>Compound circulation on testnet: <code>npm run spk:v1:cycle:sepolia</code></p>
        <p className="muted">See docs/product/SPK_V1_OPERATOR.md</p>
      </div>
    </section>
  );
}
