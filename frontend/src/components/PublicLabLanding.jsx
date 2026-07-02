import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  ExternalLink,
  FileText,
  Layers,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import {
  GITHUB_REPO,
  PUBLIC_LAB_INQUIRY_URL,
  SEPOLIA_EXPLORER,
  SPK_V1,
} from '../constants/contracts';
import { loadSpkV1Runtime } from '../lib/runtime';
import useSpkV1Live from '../hooks/useSpkV1Live';

const EVIDENCE_URL = `${GITHUB_REPO}/blob/main/thesis_package/SPK_V1_EVIDENCE.md`;
const PUBLIC_LAB_DOC = `${GITHUB_REPO}/blob/main/docs/product/PUBLIC_LAB_V1.md`;
const PILOT_ASK_DOC = `${GITHUB_REPO}/blob/main/docs/product/PILOT_DATA_ASK.md`;

function formatSyncedAt(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function addrUrl(address) {
  return `${SEPOLIA_EXPLORER}/address/${address}`;
}

export default function PublicLabLanding({ onOpenConsole }) {
  const [runtime, setRuntime] = useState(null);
  const [error, setError] = useState(null);
  const live = useSpkV1Live(runtime);

  const reload = useCallback(() => {
    setError(null);
    return loadSpkV1Runtime()
      .then(setRuntime)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const liveData = live.status === 'ok' ? live.data : null;
  const supply = liveData?.totalSupply ?? runtime?.on_chain?.total_supply_spk;
  const settled = liveData?.metrics?.totalSettled ?? runtime?.genesis?.metrics?.total_settled_spk;
  const paymentCount = liveData?.metrics?.networkPaymentCount ?? runtime?.genesis?.metrics?.network_payment_count;
  const circulation = liveData?.metrics?.circulationShare ?? runtime?.genesis?.metrics?.circulation_share_percent;
  const pegEnabled = Boolean(runtime?.monetary_policy?.peg_enabled);
  const syncedAt = runtime?.synced_at || runtime?.updated_at;
  const spkAddress = runtime?.contracts?.solar_punk_coin || SPK_V1.solarPunkCoin;
  const currencyAddress = runtime?.contracts?.currency_system || SPK_V1.currencySystem;

  if (error) {
    return (
      <section className="public-lab">
        <div className="spk-demo-error">
          <h1>Could not load Public Lab data</h1>
          <p>{error}</p>
          <button type="button" className="wallet-button" onClick={reload}>Retry</button>
        </div>
      </section>
    );
  }

  if (!runtime) {
    return (
      <section className="public-lab">
        <p className="muted spk-loading">Loading Public Lab v1.0…</p>
      </section>
    );
  }

  return (
    <section className="public-lab">
      <header className="public-lab-hero">
        <p className="eyebrow">Sepolia testnet · energy-standard settlement</p>
        <h1>SolarPunk Public Lab v1.0</h1>
        <p className="public-lab-lead">
          Verified renewable surplus → bounded testnet issuance → network settlement.
          SPK is the <strong>lab unit</strong> inside this architecture, not a monetary product claim.
        </p>
      </header>

      <div className="public-lab-cards">
        <article className="public-lab-card">
          <Zap size={22} className="text-primary" />
          <h2>Energy evidence</h2>
          <p>Signed meter/inverter readings → attestation bundles → provenance tiers (L0–L4 in docs).</p>
        </article>
        <article className="public-lab-card">
          <Layers size={22} className="text-primary" />
          <h2>Issuance discipline</h2>
          <p>Mint only from accepted surplus; replay-safe hashes; supply caps; peg <strong>off</strong>.</p>
        </article>
        <article className="public-lab-card">
          <Activity size={22} className="text-primary" />
          <h2>Settlement loop</h2>
          <p>Network payments on-chain; circulation vs redemption metrics; explicit launch gates.</p>
        </article>
      </div>

      <div className="public-lab-evidence">
        <h2><FileText size={18} /> Live evidence</h2>
        <p className="muted public-lab-sync-note">
          {live.status === 'ok' ? 'Live Sepolia reads' : 'Cached runtime JSON'}
          {syncedAt ? ` · indexed ${formatSyncedAt(syncedAt)}` : null}
        </p>
        <div className="spk-stat-row">
          <div className="spk-stat">
            <span>Supply</span>
            <strong>{supply != null ? `${Number(supply).toLocaleString()} SPK` : '…'}</strong>
          </div>
          <div className="spk-stat">
            <span>Settled</span>
            <strong>{settled != null ? `${Number(settled).toLocaleString()} SPK` : '…'}</strong>
          </div>
          <div className="spk-stat">
            <span>Payments</span>
            <strong>{paymentCount ?? '…'}</strong>
          </div>
          <div className="spk-stat">
            <span>Circulation</span>
            <strong>{circulation != null ? `${Number(circulation).toFixed(1)}%` : '…'}</strong>
          </div>
          <div className="spk-stat">
            <span>Peg</span>
            <strong>{pegEnabled ? 'on' : 'off'}</strong>
          </div>
        </div>
        <div className="public-lab-addresses font-mono">
          <a href={addrUrl(spkAddress)} target="_blank" rel="noreferrer">SPK {spkAddress.slice(0, 10)}…</a>
          <a href={addrUrl(currencyAddress)} target="_blank" rel="noreferrer">Payments {currencyAddress.slice(0, 10)}…</a>
        </div>
      </div>

      <div className="public-lab-gates">
        <h2>Launch gates</h2>
        <table className="public-lab-gate-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Public Lab v1.0</td>
              <td><span className="gate-ready">Shipped</span></td>
            </tr>
            <tr>
              <td>Closed pilot</td>
              <td><span className="gate-blocked">Blocked</span> — real operator data</td>
            </tr>
            <tr>
              <td>Paid / mainnet</td>
              <td><span className="gate-blocked">Blocked</span> — audit, legal, reserves</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="public-lab-disclaimer">
        <h2><ShieldAlert size={18} /> What this is not</h2>
        <ul>
          <li>Not a token sale, mainnet launch, or legal tender</li>
          <li>Not a stablecoin or live dollar peg</li>
          <li>Not a legal claim on delivered physical energy</li>
          <li>Not audited production governance or investment advice</li>
        </ul>
      </div>

      <div className="public-lab-cta">
        <a className="wallet-button" href={EVIDENCE_URL} target="_blank" rel="noreferrer">
          <FileText size={17} /> Review evidence pack
        </a>
        <a className="ghost-button" href={PUBLIC_LAB_INQUIRY_URL} target="_blank" rel="noreferrer">
          <ExternalLink size={17} /> Closed pilot data ask
        </a>
        {onOpenConsole ? (
          <button type="button" className="ghost-button" onClick={onOpenConsole}>
            Open SPK console
          </button>
        ) : null}
      </div>

      <footer className="public-lab-footer">
        <a href={PUBLIC_LAB_DOC} target="_blank" rel="noreferrer">PUBLIC_LAB_V1.md</a>
        <a href={PILOT_ASK_DOC} target="_blank" rel="noreferrer">Pilot data ask</a>
        <a href={GITHUB_REPO} target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </section>
  );
}
