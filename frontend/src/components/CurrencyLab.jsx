import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Coins,
  ExternalLink,
  Network,
  ShieldCheck,
} from 'lucide-react';
import currencyLab from '../../../state/product/currency_system_lab.json';
import { GITHUB_REPO } from '../constants/contracts';

const statusCopy = {
  real_public_testnet: 'Real public proof',
  simulated_from_public_fixture: 'Pilot surrogate',
  lab_model_only: 'Lab model only',
};

function statusClass(status) {
  return status === 'real_public_testnet' ? 'launchable' : 'blocked';
}

function formatNumber(value, digits = 4) {
  if (!Number.isFinite(Number(value))) return 'n/a';
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export default function CurrencyLab() {
  const { accounting } = currencyLab.ledger;

  return (
    <section className="currency-shell">
      <div className="proof-hero currency-hero">
        <div>
          <div className="eyebrow"><Coins size={14} /> Currency System Lab</div>
          <h1>Better currency thesis, compressed into one lab run.</h1>
          <p>
            This is the fast path across the first four layers: public proof, pilot surrogate,
            redeemable receipt surrogate, and network settlement surrogate. Layer 1 is public Sepolia evidence.
            Layers 2-4 are deliberately labelled as lab models until real counterparties exist.
          </p>
        </div>
        <div className={`system-tile ${accounting.conservation_pass ? 'good' : 'warn'}`}>
          <div className="system-title">
            {accounting.conservation_pass ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            Accounting Check
          </div>
          <div className="system-grid">
            <span>Conservation</span><strong>{String(accounting.conservation_pass)}</strong>
            <span>Velocity</span><strong>{accounting.velocity_ratio}</strong>
            <span>Active supply</span><strong>{formatNumber(accounting.active_supply_spk)} SPK</strong>
          </div>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-card metric-good">
          <div className="metric-label">Minted From Energy</div>
          <div className="metric-value">{formatNumber(accounting.minted_spk)} SPK</div>
          <div className="metric-sub">{formatNumber(currencyLab.source_evidence.accepted_surplus_kwh, 1)} accepted kWh</div>
        </div>
        <div className="metric-card metric-amber">
          <div className="metric-label">Redeemed Lab Credit</div>
          <div className="metric-value">{formatNumber(accounting.redeemed_energy_kwh_equivalent)} kWh</div>
          <div className="metric-sub">{formatNumber(accounting.redeemed_spk)} SPK burned in the lab ledger</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Settlement Volume</div>
          <div className="metric-value">{formatNumber(accounting.settlement_volume_spk)} SPK</div>
          <div className="metric-sub">producer, gateway, maintenance, buyer, merchant</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Daily Keeper Runs</div>
          <div className="metric-value">{currencyLab.source_evidence.daily_keeper_runs}</div>
          <div className="metric-sub">latest {currencyLab.source_evidence.latest_keeper_run}</div>
        </div>
      </div>

      <div className="currency-layer-grid">
        {currencyLab.layers.map((layer) => (
          <div key={layer.id} className={`launch-mode-card ${statusClass(layer.status)}`}>
            <div className="launch-mode-title">
              {layer.status === 'real_public_testnet' ? <ShieldCheck size={18} /> : <Network size={18} />}
              <div>
                <strong>{layer.id}. {layer.name}</strong>
                <span>{statusCopy[layer.status] || layer.status}</span>
              </div>
            </div>
            <p>{layer.claim}</p>
            {layer.blocker_to_upgrade && (
              <div className="launch-blocker">
                <span>Upgrade blocker</span>
                <strong>{layer.blocker_to_upgrade}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="proof-main-grid bottom">
        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><Network size={14} /> Settlement Ledger</div>
              <h2>How SPK circulates in the lab</h2>
            </div>
          </div>
          <div className="ledger-list">
            {currencyLab.ledger.transactions.map((item, index) => (
              <div key={`${item.kind}-${index}`} className="ledger-row">
                <span>{index + 1}</span>
                <strong>{item.kind}</strong>
                <code>{item.from || 'protocol'}{' -> '}{item.to}</code>
                <b>{formatNumber(item.amount_spk)} SPK</b>
              </div>
            ))}
          </div>
          <div className="scope-note">
            This ledger is not a claim of external adoption. It is a conservation-checked model showing
            how the same minted SPK could become a receipt and settlement unit once real counterparties exist.
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><ShieldCheck size={14} /> Boundaries</div>
              <h2>What this proves and does not prove</h2>
            </div>
          </div>
          <div className="scope-list">
            {currencyLab.claim_boundaries.map((boundary) => (
              <div key={boundary}>{boundary}</div>
            ))}
          </div>
          <div className="proof-links">
            <a href={`${GITHUB_REPO}/blob/main/docs/product/CURRENCY_SYSTEM_LAB.md`} target="_blank" rel="noreferrer">
              Currency lab <ExternalLink size={12} />
            </a>
            <a href={`${GITHUB_REPO}/blob/main/state/product/currency_system_lab.json`} target="_blank" rel="noreferrer">
              JSON receipt <ExternalLink size={12} />
            </a>
            <a href={`${GITHUB_REPO}/blob/main/docs/product/SPK_PUBLIC_READBACK.md`} target="_blank" rel="noreferrer">
              Public readback <ExternalLink size={12} />
            </a>
            <a href={`${GITHUB_REPO}/blob/main/docs/product/PRODUCT_LAUNCH_GATE.md`} target="_blank" rel="noreferrer">
              Launch gate <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
