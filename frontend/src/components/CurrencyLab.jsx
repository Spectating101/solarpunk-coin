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
import currencyFramework from '../../../state/product/currency_framework_readiness.json';
import fieldReceipt from '../../../state/product/field_receipt_loop.json';
import resourceBenchmark from '../../../state/product/resource_benchmark_lab.json';
import energyStandard from '../../../state/product/energy_standard_economics.json';
import { GITHUB_REPO } from '../constants/contracts';

const statusCopy = {
  real_public_testnet: 'Real public proof',
  simulated_from_public_fixture: 'Pilot surrogate',
  local_field_receipt_loop: 'Local receipt loop',
  local_contract_tested: 'Local contract tested',
  lab_model_only: 'Lab model only',
};

function statusClass(status) {
  return status === 'real_public_testnet' ||
    status === 'local_contract_tested' ||
    status === 'local_field_receipt_loop' ? 'launchable' : 'blocked';
}

function formatNumber(value, digits = 4) {
  if (!Number.isFinite(Number(value))) return 'n/a';
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: digits });
}

function formatUsd(value, digits = 0) {
  if (!Number.isFinite(Number(value))) return 'n/a';
  return Number(value).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
  });
}

export default function CurrencyLab() {
  const { accounting } = currencyLab.ledger;
  const solarResource = resourceBenchmark.resources.find((resource) => resource.id === 'solar_pv_rooftop');
  const windResource = resourceBenchmark.resources.find((resource) => resource.id === 'wind_turbine');
  const oilResource = resourceBenchmark.resources.find((resource) => resource.id === 'oil_barrel');

  return (
    <section className="currency-shell">
      <div className="proof-hero currency-hero">
        <div>
          <div className="eyebrow"><Coins size={14} /> Currency System Lab</div>
          <h1>Energy-standard cryptocurrency, compressed into one lab run.</h1>
          <p>
            SolarPunk rebuilds the gold-standard idea around verified renewable-energy surplus.
            The lab shows the monetary path: admissible energy proof, SPK issuance, circulation,
            redemption into owed-kWh receipts, and delivery accounting.
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
            <span>Energy basis</span><strong>{formatNumber(energyStandard.current_monetary_state.kwh_per_1_spk_at_current_basis)} kWh/SPK</strong>
            <span>Active supply</span><strong>{formatNumber(accounting.active_supply_spk)} SPK</strong>
          </div>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-card metric-good">
          <div className="metric-label">Energy Standard Basis</div>
          <div className="metric-value">{formatNumber(energyStandard.current_monetary_state.kwh_per_1_spk_at_current_basis)} kWh</div>
          <div className="metric-sub">
            per 1 SPK at ${formatNumber(energyStandard.current_monetary_state.energy_price_usd_per_kwh, 2)}/kWh basis
          </div>
        </div>
        <div className="metric-card metric-good">
          <div className="metric-label">10 kW Annual Issuance</div>
          <div className="metric-value">
            {formatNumber(energyStandard.capacity_scenarios[0].net_issuance_spk)} SPK
          </div>
          <div className="metric-sub">
            {formatNumber(energyStandard.capacity_scenarios[0].annual_kwh, 0)} kWh/year sensitivity
          </div>
        </div>
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
        <div className="metric-card metric-good">
          <div className="metric-label">Framework Readiness</div>
          <div className="metric-value">
            {currencyFramework.readiness.passed}/{currencyFramework.readiness.total}
          </div>
          <div className="metric-sub">{currencyFramework.current_internal_stage.replaceAll('_', ' ')}</div>
        </div>
        <div className="metric-card metric-good">
          <div className="metric-label">Field Receipt Loop</div>
          <div className="metric-value">{formatNumber(fieldReceipt.accounting.delivered_kwh)} kWh</div>
          <div className="metric-sub">
            {formatNumber(fieldReceipt.accounting.settlement_volume_spk)} SPK settled, no external dependency
          </div>
        </div>
        <div className="metric-card metric-good">
          <div className="metric-label">Measured Solar Benchmark</div>
          <div className="metric-value">{formatNumber(resourceBenchmark.solar.production_estimate.latest_day_ac_kwh)} kWh/day</div>
          <div className="metric-sub">
            10 kWdc, {formatNumber(resourceBenchmark.solar.standard_system.panel_area_m2, 0)} m2, {formatUsd(solarResource?.installed_cost_usd_before_incentives)}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Measured Wind Density</div>
          <div className="metric-value">{formatNumber(windResource?.benchmark_output_kwh_day)} kWh/day</div>
          <div className="metric-sub">
            {formatNumber(resourceBenchmark.wind.nasa_window.average_ws10m_ms)} m/s NASA WS10M, 50 m2 swept-area model
          </div>
        </div>
        <div className="metric-card metric-amber">
          <div className="metric-label">Oil Benchmark Only</div>
          <div className="metric-value">{formatNumber(oilResource?.kwh_thermal_per_barrel, 0)} kWh</div>
          <div className="metric-sub">thermal per barrel; not SPK mint-eligible</div>
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
            <a href={`${GITHUB_REPO}/blob/main/docs/product/CURRENCY_FRAMEWORK_READINESS.md`} target="_blank" rel="noreferrer">
              Framework readiness <ExternalLink size={12} />
            </a>
            <a href={`${GITHUB_REPO}/blob/main/docs/product/FIELD_RECEIPT_LOOP.md`} target="_blank" rel="noreferrer">
              Field receipt loop <ExternalLink size={12} />
            </a>
            <a href={`${GITHUB_REPO}/blob/main/docs/product/RESOURCE_BENCHMARK_LAB.md`} target="_blank" rel="noreferrer">
              Resource benchmark <ExternalLink size={12} />
            </a>
            <a href={`${GITHUB_REPO}/blob/main/docs/product/ENERGY_STANDARD_ECONOMICS.md`} target="_blank" rel="noreferrer">
              Energy economics <ExternalLink size={12} />
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
