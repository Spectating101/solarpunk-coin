import React, { startTransition, useDeferredValue, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileUp,
  Gauge,
  MapPinned,
  PlugZap,
  SlidersHorizontal,
} from 'lucide-react';
import nrelMapScenarios from '../../../state/product/nrel_solar_map_scenarios.json';
import {
  calculateSitePilotScenario,
  defaultSiteControls,
} from '../models/sitePilotModel';

function formatNumber(value, digits = 2) {
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

function formatUsdPerKwh(value) {
  if (!Number.isFinite(Number(value))) return 'n/a';
  return `${formatUsd(value, Number(value) < 1 ? 4 : 2)}/kWh`;
}

function statusCopy(status) {
  if (status === 'pilot_candidate') return 'Pilot candidate';
  if (status === 'pilot_needs_terms') return 'Needs terms';
  return 'Model only';
}

function statusTone(status) {
  if (status === 'pilot_candidate') return 'good';
  if (status === 'pilot_needs_terms') return 'amber';
  return 'warn';
}

function Slider({ label, value, min, max, step, suffix, helper, onChange }) {
  return (
    <label className="site-control">
      <span>
        <strong>{label}</strong>
        <b>{formatNumber(value, step < 1 ? 2 : 0)}{suffix}</b>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <em>{helper}</em>
    </label>
  );
}

function SiteKpi({ label, value, sub, tone = 'neutral' }) {
  return (
    <div className={`site-kpi metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{sub}</p>
    </div>
  );
}

export default function SitePilotSimulator() {
  const sites = nrelMapScenarios.map_points;
  const [siteId, setSiteId] = useState(nrelMapScenarios.summary.strongest_site || sites[0].id);
  const selectedSite = useMemo(() => sites.find((site) => site.id === siteId) || sites[0], [siteId, sites]);
  const [controls, setControls] = useState(() => defaultSiteControls(selectedSite));
  const deferredControls = useDeferredValue(controls);
  const scenario = calculateSitePilotScenario(selectedSite, deferredControls);
  const tone = statusTone(scenario.status);

  const updateControl = (key, value) => {
    startTransition(() => {
      setControls((current) => ({ ...current, [key]: value }));
    });
  };

  const chooseSite = (event) => {
    const nextSite = sites.find((site) => site.id === event.target.value) || sites[0];
    startTransition(() => {
      setSiteId(nextSite.id);
      setControls((current) => ({
        ...defaultSiteControls(nextSite),
        capacityKw: current.capacityKw,
        exportPct: current.exportPct,
        energyPriceUsdPerKwh: current.energyPriceUsdPerKwh,
        capexUsdPerWdc: current.capexUsdPerWdc,
        supportUsd: current.supportUsd,
        hasMeterProof: current.hasMeterProof,
      }));
    });
  };

  return (
    <section className="panel site-simulator">
      <div className="panel-heading workbench-heading">
        <div>
          <div className="panel-kicker"><PlugZap size={14} /> Site Simulator</div>
          <h2>Turn a solar site into a concrete SPK pilot case</h2>
          <p>
            This is the missing product journey: choose a geography, scale the system, set export
            and economics assumptions, then see the SPK preview and exactly what evidence is still missing.
          </p>
        </div>
        <div className={`workbench-status metric-${tone}`}>
          {scenario.status === 'pilot_candidate' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{statusCopy(scenario.status)}</span>
        </div>
      </div>

      <div className="site-simulator-grid">
        <div className="site-controls">
          <label className="site-selector">
            <span><MapPinned size={14} /> Modeled site</span>
            <select value={siteId} onChange={chooseSite}>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.label} - {formatNumber(site.annual_ac_kwh, 0)} kWh/year
                </option>
              ))}
            </select>
          </label>

          <div className="site-baseline-card">
            <strong>{selectedSite.label}</strong>
            <span>{selectedSite.region} · {selectedSite.production_tier.replaceAll('_', ' ')}</span>
            <p>{selectedSite.market_note}</p>
          </div>

          <div className="site-control-grid">
            <Slider
              label="Capacity"
              value={controls.capacityKw}
              min={5}
              max={2000}
              step={5}
              suffix=" kW"
              helper="Scales the PVWatts 10 kW baseline."
              onChange={(value) => updateControl('capacityKw', value)}
            />
            <Slider
              label="Export eligible"
              value={controls.exportPct}
              min={0}
              max={100}
              step={1}
              suffix="%"
              helper="Only verified surplus/export can mint SPK."
              onChange={(value) => updateControl('exportPct', value)}
            />
            <Slider
              label="Energy value"
              value={controls.energyPriceUsdPerKwh}
              min={0.02}
              max={0.4}
              step={0.005}
              suffix=" USD/kWh"
              helper="Tariff, PPA, support value, or avoided-cost assumption."
              onChange={(value) => updateControl('energyPriceUsdPerKwh', value)}
            />
            <Slider
              label="Capex"
              value={controls.capexUsdPerWdc}
              min={0.8}
              max={4}
              step={0.05}
              suffix=" USD/Wdc"
              helper="Installed cost assumption for the pilot economics."
              onChange={(value) => updateControl('capexUsdPerWdc', value)}
            />
            <Slider
              label="Annual support"
              value={controls.supportUsd}
              min={0}
              max={50000}
              step={250}
              suffix=" USD"
              helper="Grant, research payment, tariff adder, or pilot sponsor."
              onChange={(value) => updateControl('supportUsd', value)}
            />
          </div>

          <button
            type="button"
            className={`meter-toggle ${controls.hasMeterProof ? 'active' : ''}`}
            onClick={() => updateControl('hasMeterProof', !controls.hasMeterProof)}
          >
            <FileUp size={15} />
            {controls.hasMeterProof ? 'Real meter export supplied' : 'Still modeled data only'}
          </button>
        </div>

        <div className="site-output">
          <div className="site-kpi-grid">
            <SiteKpi
              label="Annual generation"
              value={`${formatNumber(scenario.annual_generation_kwh, 0)} kWh`}
              sub={`${formatNumber(scenario.capacity_kw, 0)} kW modeled from PVWatts`}
              tone="good"
            />
            <SiteKpi
              label="Eligible surplus"
              value={`${formatNumber(scenario.eligible_surplus_kwh, 0)} kWh`}
              sub={`${formatNumber(scenario.export_pct, 0)}% export-eligible assumption`}
              tone="good"
            />
            <SiteKpi
              label="SPK preview"
              value={`${formatNumber(scenario.net_spk_preview, 2)} SPK`}
              sub="not mintable until signed meter proof exists"
              tone={scenario.readiness[1].pass ? 'good' : 'amber'}
            />
            <SiteKpi
              label="Annual value"
              value={formatUsd(scenario.gross_value_with_support_usd, 0)}
              sub={`${formatUsd(scenario.annual_energy_value_usd, 0)} energy + ${formatUsd(scenario.support_usd, 0)} support`}
              tone={scenario.economics_cleared ? 'good' : 'amber'}
            />
            <SiteKpi
              label="Pilot DSCR"
              value={`${formatNumber(scenario.dscr, 2)}x`}
              sub={`${scenario.required_dscr}x target over ${formatUsd(scenario.annual_debt_service_usd, 0)}/yr debt service`}
              tone={scenario.economics_cleared ? 'good' : 'warn'}
            />
            <SiteKpi
              label="Required value"
              value={formatUsdPerKwh(scenario.required_energy_price_usd_per_kwh)}
              sub={`${formatUsd(scenario.support_gap_usd, 0)}/yr support gap`}
              tone={scenario.support_gap_usd === 0 ? 'good' : 'warn'}
            />
          </div>

          <div className="pilot-readiness-grid">
            <div>
              <div className="panel-kicker"><ShieldCheck size={14} /> Pilot Gate</div>
              <div className="readiness-stack">
                {scenario.readiness.map((item) => (
                  <div key={item.id} className={item.pass ? 'pass' : 'open'}>
                    <strong>{item.pass ? 'PASS' : 'OPEN'} · {item.label}</strong>
                    <span>{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="panel-kicker"><SlidersHorizontal size={14} /> Intake Packet</div>
              <div className="intake-stack">
                {scenario.intake_files.map((item) => (
                  <code key={item}>{item}</code>
                ))}
              </div>
            </div>
          </div>

          <div className="scope-note">
            The simulator is useful because it converts a vague solar location into a pilot-sized SPK case.
            It is still not a mint button: the hard gate is signed surplus data plus launch economics.
          </div>
        </div>
      </div>
    </section>
  );
}
