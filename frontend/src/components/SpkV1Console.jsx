import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, RefreshCw, Send, Wallet } from 'lucide-react';
import SPK_ABI from '../abi/SolarPunkCoin.json';
import CURRENCY_ABI from '../abi/SolarPunkCurrencySystem.json';
import { SEPOLIA_EXPLORER } from '../constants/contracts';
import { buildPayees } from '../lib/payees';
import { requestFoundationSync } from '../lib/foundationSync';
import { sendNetworkPayment } from '../lib/pay';
import { loadSpkV1Runtime } from '../lib/runtime';
import { ensureSepolia } from '../lib/wallet';
import useSpkV1Live from '../hooks/useSpkV1Live';

function txUrl(explorer, hash) {
  return `${explorer}/tx/${hash}`;
}

function addrUrl(explorer, address) {
  return `${explorer}/address/${address}`;
}

function formatSyncedAt(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function SpkV1Console({ provider, signer, account, onConnect, connecting, wrongNetwork = false }) {
  const [runtime, setRuntime] = useState(null);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('5');
  const [payeeId, setPayeeId] = useState('merchant');
  const [payStatus, setPayStatus] = useState({ state: 'idle', message: '' });
  const [liveRefreshKey, setLiveRefreshKey] = useState(0);
  const live = useSpkV1Live(runtime, account, liveRefreshKey);

  const payees = useMemo(() => buildPayees(runtime), [runtime]);

  const reload = useCallback(async () => {
    setError(null);
    await requestFoundationSync();
    return loadSpkV1Runtime().then(setRuntime).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    reload();
    const id = window.setInterval(reload, 120_000);
    return () => window.clearInterval(id);
  }, [reload]);

  useEffect(() => {
    if (payees.length && !payees.find((p) => p.id === payeeId)) {
      setPayeeId(payees[0].id);
    }
  }, [payees, payeeId]);

  const liveData = live.status === 'ok' ? live.data : null;
  const explorer = runtime?.explorer_base || SEPOLIA_EXPLORER;
  const spkAddress = runtime?.contracts?.solar_punk_coin;
  const currencyAddress = runtime?.contracts?.currency_system;
  const payee = payees.find((p) => p.id === payeeId) || payees[0];

  const supply = liveData?.totalSupply ?? runtime?.on_chain?.total_supply_spk;
  const paymentCount = liveData?.metrics?.networkPaymentCount ?? runtime?.genesis?.metrics?.network_payment_count;
  const settled = liveData?.metrics?.totalSettled ?? runtime?.genesis?.metrics?.total_settled_spk;
  const circulation = liveData?.metrics?.circulationShare ?? runtime?.genesis?.metrics?.circulation_share_percent;
  const surplusKwh = liveData?.cumulativeSurplusKwh ?? runtime?.on_chain?.cumulative_surplus_kwh;
  const balance = liveData?.walletBalance;
  const ledger = runtime?.chain_index?.payment_ledger || [];
  const syncedAt = runtime?.synced_at || runtime?.updated_at;
  const monetaryPolicy = runtime?.monetary_policy;
  const refUsdPerKwh = monetaryPolicy?.reference_usd_per_kwh != null
    ? Number(monetaryPolicy.reference_usd_per_kwh)
    : null;
  const pegEnabled = Boolean(monetaryPolicy?.peg_enabled);
  const impliedSupplyUsd = supply != null && refUsdPerKwh != null
    ? Number(supply) * refUsdPerKwh
    : null;

  const parsedAmount = Number(amount);
  const canPay = (
    account
    && signer
    && !wrongNetwork
    && parsedAmount > 0
    && (balance == null || parsedAmount <= balance)
  );

  const pay = async () => {
    if (!signer || !spkAddress || !currencyAddress || !payee) return;
    if (wrongNetwork) {
      setPayStatus({ state: 'error', message: 'Switch MetaMask to Sepolia first.' });
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      setPayStatus({ state: 'error', message: 'Enter a positive SPK amount.' });
      return;
    }
    if (balance != null && parsedAmount > balance) {
      setPayStatus({ state: 'error', message: `Insufficient balance (${balance.toFixed(2)} SPK).` });
      return;
    }

    setPayStatus({ state: 'pending', message: 'Step 1/2: approve SPK in wallet…' });
    try {
      await ensureSepolia(provider);
      const { receipt } = await sendNetworkPayment({
        signer,
        spkAddress,
        currencyAddress,
        spkAbi: SPK_ABI,
        currencyAbi: CURRENCY_ABI,
        payeeAddress: payee.address,
        amountSpk: parsedAmount,
        payeeRole: payee.role,
        payeeId: payee.id,
        onStep: (step) => {
          if (step === 'settle') {
            setPayStatus({ state: 'pending', message: 'Step 2/2: confirm network payment…' });
          }
        },
      });
      const sync = await requestFoundationSync();
      setPayStatus({
        state: 'ok',
        message: sync.ok
          ? `Sent ${amount} SPK to ${payee.label}. Ledger synced.`
          : `Sent ${amount} SPK to ${payee.label}. Balance updates live; run npm run foundation:sync for ledger.`,
        txHash: receipt.hash,
      });
      setLiveRefreshKey((k) => k + 1);
      reload();
    } catch (err) {
      setPayStatus({ state: 'error', message: err.shortMessage || err.message });
    }
  };

  if (error) {
    return (
      <section className="spk-demo">
        <div className="spk-demo-error">
          <h1>Could not load SPK v1 data</h1>
          <p>{error}</p>
          <button type="button" className="wallet-button" onClick={reload}>Retry</button>
        </div>
      </section>
    );
  }

  if (!runtime) {
    return (
      <section className="spk-demo">
        <p className="muted spk-loading">Loading SPK v1 runtime…</p>
      </section>
    );
  }

  return (
    <section className="spk-demo">
      <div className="spk-status-bar">
        <span className={`spk-live-dot ${live.status === 'ok' ? 'live' : ''}`} />
        <span>
          {live.status === 'ok' ? 'Live on Sepolia' : live.status === 'error' ? 'Cached data (RPC unavailable)' : 'Reading chain…'}
        </span>
        {syncedAt ? <span className="spk-status-meta">Indexed {formatSyncedAt(syncedAt)}</span> : null}
      </div>

      <header className="spk-demo-hero">
        <div>
          <p className="eyebrow">Sepolia testnet · advanced proof</p>
          <h1>Advanced — Sepolia Proof</h1>
          <p className="spk-console-lead">
            Optional wallet path. The browser Evidence Lab and Currency Lab are the default experience.
            MetaMask is optional for read-only metrics; Sepolia ETH and operator-supplied test SPK are
            required only to send payments. This console demonstrates public testnet execution only.
          </p>
          <p className="spk-demo-lead">
            Technical view: bounded SPK mint from verified surplus kWh, network payments on-chain.
            Connect wallet on Sepolia to send a testnet settlement payment.
          </p>
        </div>
        <button type="button" className="icon-button" onClick={reload} title="Refresh">
          <RefreshCw size={16} />
        </button>
      </header>

      <div className="spk-stat-row">
        <div className="spk-stat">
          <span>Total supply</span>
          <strong>{supply != null ? `${Number(supply).toLocaleString()} SPK` : '…'}</strong>
        </div>
        <div className="spk-stat">
          <span>Surplus minted</span>
          <strong>{surplusKwh != null ? `${Number(surplusKwh).toLocaleString()} kWh` : '…'}</strong>
        </div>
        <div className="spk-stat">
          <span>Network payments</span>
          <strong>{paymentCount ?? '…'}</strong>
        </div>
        <div className="spk-stat">
          <span>SPK settled</span>
          <strong>{settled != null ? `${Number(settled).toLocaleString()} SPK` : '…'}</strong>
        </div>
        <div className="spk-stat">
          <span>In circulation</span>
          <strong>{circulation != null ? `${Number(circulation).toFixed(1)}%` : '…'}</strong>
        </div>
        {account ? (
          <div className="spk-stat highlight">
            <span>Your balance</span>
            <strong>{balance != null ? `${Number(balance).toFixed(2)} SPK` : '…'}</strong>
          </div>
        ) : null}
      </div>

      {refUsdPerKwh != null ? (
        <div className="spk-foundation-strip" role="status">
          <span>USD ref <strong>${refUsdPerKwh.toFixed(4)}/kWh</strong></span>
          <span>Peg <strong>{pegEnabled ? 'on' : 'off'}</strong></span>
          {impliedSupplyUsd != null ? (
            <span>Implied supply <strong>~${impliedSupplyUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></span>
          ) : null}
          <span className="muted">Energy anchor · dollar translation</span>
        </div>
      ) : null}

      <div className="spk-pay-card">
        <h2><Send size={18} /> Send SPK</h2>
        {!account ? (
          <>
            <p>MetaMask on <strong>Sepolia</strong>. You need SPK in your wallet — the operator/deployer wallet has test SPK for demos.</p>
            <button type="button" className="wallet-button" onClick={onConnect} disabled={connecting || !provider}>
              <Wallet size={17} />
              {connecting ? 'Connecting…' : provider ? 'Connect wallet' : 'Install MetaMask'}
            </button>
          </>
        ) : (
          <>
            <p className="muted">Wallet {account.slice(0, 6)}…{account.slice(-4)}</p>
            <div className="spk-pay-form">
              <label>
                Amount (SPK)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>
              <label>
                Pay
                <select value={payeeId} onChange={(e) => setPayeeId(e.target.value)}>
                  {payees.map((p) => (
                    <option key={p.id} value={p.id}>{p.label} ({p.role})</option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="button"
              className="wallet-button"
              onClick={pay}
              disabled={payStatus.state === 'pending' || !canPay}
            >
              {payStatus.state === 'pending' ? 'Waiting for wallet…' : 'Send payment'}
            </button>
            {balance != null && balance === 0 ? (
              <p className="spk-pay-hint">This wallet has 0 SPK. Import the deployer key or receive SPK from the operator.</p>
            ) : null}
            {payStatus.message ? (
              <p className={payStatus.state === 'error' ? 'spk-pay-error' : 'spk-pay-ok'}>
                {payStatus.message}
                {payStatus.txHash ? (
                  <a href={txUrl(explorer, payStatus.txHash)} target="_blank" rel="noreferrer">
                    View tx <ArrowUpRight size={14} />
                  </a>
                ) : null}
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className="spk-ledger-card">
        <h2>Payment history</h2>
        {ledger.length === 0 ? (
          <p className="muted">No indexed payments yet. Run <code>npm run spk:v1:sync</code> after operator cycles.</p>
        ) : (
          <div className="spk-table-wrap">
            <table className="spk-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Kind</th>
                  <th>SPK</th>
                  <th>Payee</th>
                  <th>Tx</th>
                </tr>
              </thead>
              <tbody>
                {[...ledger].reverse().map((row) => (
                  <tr key={`${row.payment_id}-${row.tx_hash}`}>
                    <td>{row.payment_id}</td>
                    <td>{row.payment_kind}</td>
                    <td>{row.spk}</td>
                    <td>
                      <a href={addrUrl(explorer, row.payee)} target="_blank" rel="noreferrer" title={row.payee}>
                        {row.payee_label || `${row.payee.slice(0, 8)}…`}
                      </a>
                      {row.payer_label ? (
                        <span className="muted"> · from {row.payer_label}</span>
                      ) : null}
                    </td>
                    <td>
                      <a href={txUrl(explorer, row.tx_hash)} target="_blank" rel="noreferrer">
                        {row.tx_hash.slice(0, 10)}…
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="spk-footer">
        <a href={addrUrl(explorer, spkAddress)} target="_blank" rel="noreferrer">SPK contract</a>
        <a href={addrUrl(explorer, currencyAddress)} target="_blank" rel="noreferrer">Payment contract</a>
        <a href="https://github.com/Spectating101/solarpunk-coin" target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </section>
  );
}
