import React, { startTransition, useDeferredValue, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  Coins,
  PlugZap,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import energyMoneySimulation from '../../../state/product/energy_money_simulation.json';
import {
  calculateEnergyMoneyScenario,
  controlsFromArchetype,
  round,
  SPK_KWH_BASIS,
} from '../models/energyMoneyModel';

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

function formatUsdDynamic(value) {
  const amount = Math.abs(Number(value));
  if (amount === 0) return formatUsd(value, 0);
  if (amount < 10) return formatUsd(value, 2);
  if (amount < 100) return formatUsd(value, 1);
  return formatUsd(value, 0);
}

function pct(value, digits = 0) {
  return `${formatNumber(Number(value) * 100, digits)}%`;
}

function reserveTone(gapUsd) {
  if (gapUsd <= 0) return 'good';
  if (gapUsd < 500) return 'amber';
  return 'warn';
}

function reserveLabel(gapUsd) {
  if (gapUsd <= 0) return 'Reserve covered in this scenario';
  if (gapUsd < 500) return 'Needs named reserve';
  return 'Unsafe without reserve capital';
}

function Slider({ label, value, min, max, step, suffix, helper, onChange }) {
  return (
    <label className="workbench-control">
      <span>
        <strong>{label}</strong>
        <b>{formatNumber(value, step < 1 ? 1 : 0)}{suffix}</b>
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

function FlowStep({ icon: Icon, title, value, sub }) {
  return (
    <div className="flow-step">
      <div className="flow-step-icon"><Icon size={16} /></div>
      <strong>{title}</strong>
      <span>{value}</span>
      <p>{sub}</p>
    </div>
  );
}

function Kpi({ label, value, sub, tone = 'neutral' }) {
  return (
    <div className={`workbench-kpi metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{sub}</p>
    </div>
  );
}

export default function EnergyMoneyWorkbench() {
  const [selectedId, setSelectedId] = useState(energyMoneySimulation.archetypes[0].id);
  const selectedArchetype = energyMoneySimulation.archetypes.find((archetype) => archetype.id === selectedId) ??
    energyMoneySimulation.archetypes[0];
  const [controls, setControls] = useState(() => controlsFromArchetype(selectedArchetype));
  const deferredControls = useDeferredValue(controls);
  const scenario = calculateEnergyMoneyScenario(selectedArchetype, deferredControls);
  const annual = scenario.annualized;
  const reserveStatusTone = reserveTone(annual.reserveGapUsd);
  const chartData = scenario.rows.map((row) => ({
    date: row.date.slice(5),
    issued: round(row.netMintedSpk, 4),
    redeemed: round(row.redeemedSpk, 4),
    shortfall: round(row.shortfallLiabilityUsd, 4),
  }));

  const updateControl = (key, value) => {
    startTransition(() => {
      setControls((current) => ({ ...current, [key]: value }));
    });
  };

  const chooseArchetype = (archetype) => {
    startTransition(() => {
      setSelectedId(archetype.id);
      setControls(controlsFromArchetype(archetype));
    });
  };

  return (
    <section className="panel energy-workbench">
      <div className="panel-heading workbench-heading">
        <div>
          <div className="panel-kicker"><PlugZap size={14} /> Energy-Money Workbench</div>
          <h2>Turn a generator scenario into SPK monetary state</h2>
          <p>
            This is the cleanest product explanation: measured energy produces eligible surplus,
            surplus mints SPK, SPK circulates, redemptions create owed-kWh claims, and reserve
            pressure is visible before a launch decision.
          </p>
        </div>
        <div className={`workbench-status metric-${reserveStatusTone}`}>
          {annual.conservationPass ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
          <span>{reserveLabel(annual.reserveGapUsd)}</span>
        </div>
      </div>

      <div className="workbench-grid">
        <div className="workbench-controls">
          <div className="archetype-tabs" role="tablist" aria-label="Generator archetype">
            {energyMoneySimulation.archetypes.map((archetype) => (
              <button
                key={archetype.id}
                role="tab"
                aria-selected={selectedId === archetype.id}
                className={selectedId === archetype.id ? 'active' : ''}
                onClick={() => chooseArchetype(archetype)}
              >
                <strong>{archetype.label}</strong>
                <span>{archetype.interpretation}</span>
              </button>
            ))}
          </div>

          <div className="workbench-control-grid">
            <Slider
              label="Capacity"
              value={controls.capacityKw}
              min={5}
              max={2000}
              step={5}
              suffix=" kW"
              helper="Generator size driving annual production."
              onChange={(value) => updateControl('capacityKw', value)}
            />
            <Slider
              label="Self-use"
              value={controls.selfConsumptionPct}
              min={5}
              max={95}
              step={1}
              suffix="%"
              helper="Energy consumed locally before mint eligibility."
              onChange={(value) => updateControl('selfConsumptionPct', value)}
            />
            <Slider
              label="Redemption"
              value={controls.redemptionPct}
              min={0}
              max={100}
              step={1}
              suffix="%"
              helper="Issued SPK converted back into owed-kWh claims."
              onChange={(value) => updateControl('redemptionPct', value)}
            />
            <Slider
              label="Velocity"
              value={controls.velocity}
              min={0}
              max={5}
              step={0.1}
              suffix="x"
              helper="How often SPK turns over in settlement."
              onChange={(value) => updateControl('velocity', value)}
            />
            <Slider
              label="Delivery shortfall"
              value={controls.shortfallPct}
              min={0}
              max={30}
              step={0.5}
              suffix="%"
              helper="Physical delivery miss against redemption claims."
              onChange={(value) => updateControl('shortfallPct', value)}
            />
            <Slider
              label="Operator reserve"
              value={controls.reserveUsd}
              min={0}
              max={10000}
              step={5}
              suffix=" USD"
              helper="Named buffer available before external capital."
              onChange={(value) => updateControl('reserveUsd', value)}
            />
          </div>
        </div>

        <div className="workbench-output">
          <div className="conversion-flow">
            <FlowStep
              icon={Zap}
              title="Annual generation"
              value={`${formatNumber(annual.generationKwh, 0)} kWh`}
              sub={`${formatNumber(deferredControls.capacityKw, 0)} kW using ${energyMoneySimulation.input_basis.observed_days} keeper-index days`}
            />
            <ArrowRight size={18} />
            <FlowStep
              icon={BatteryCharging}
              title="Eligible surplus"
              value={`${formatNumber(annual.eligibleSurplusKwh, 0)} kWh`}
              sub={`${pct(1 - deferredControls.selfConsumptionPct / 100)} mint-eligible after local use`}
            />
            <ArrowRight size={18} />
            <FlowStep
              icon={Coins}
              title="Net SPK issued"
              value={`${formatNumber(annual.netMintedSpk, 0)} SPK`}
              sub={`${formatNumber(SPK_KWH_BASIS, 0)} kWh basis per SPK`}
            />
          </div>

          <div className="workbench-kpi-grid">
            <Kpi
              label="Settlement volume"
              value={`${formatNumber(annual.settlementVolumeSpk, 0)} SPK`}
              sub={`${formatNumber(deferredControls.velocity, 1)}x turnover assumption`}
              tone="good"
            />
            <Kpi
              label="Redemption obligation"
              value={`${formatNumber(annual.owedKwh, 0)} kWh`}
              sub={`${formatNumber(annual.redeemedSpk, 0)} SPK redeemed`}
              tone="amber"
            />
            <Kpi
              label="Active supply"
              value={`${formatNumber(annual.activeSupplySpk, 0)} SPK`}
              sub="issued minus redeemed in this scenario"
              tone={annual.activeSupplySpk >= 0 ? 'good' : 'warn'}
            />
            <Kpi
              label="Reserve gap"
              value={formatUsdDynamic(annual.reserveGapUsd)}
              sub={`${formatUsdDynamic(annual.shortfallLiabilityUsd)} modeled liability`}
              tone={reserveStatusTone}
            />
          </div>

          <div className="chart-wrap workbench-chart">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="issuedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="redeemedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#5f8064', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5f8064', fontSize: 11 }} axisLine={false} tickLine={false} width={42} />
                <Tooltip
                  contentStyle={{ background: '#0b160d', border: '1px solid #24402a', borderRadius: '6px', color: '#e8f3e8' }}
                  formatter={(value, name) => [formatNumber(value, 4), name === 'issued' ? 'SPK issued' : 'SPK redeemed']}
                />
                <Area type="monotone" dataKey="issued" stroke="#34d399" strokeWidth={2} fill="url(#issuedFill)" />
                <Area type="monotone" dataKey="redeemed" stroke="#d97706" strokeWidth={2} fill="url(#redeemedFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="risk-ledger">
            <div>
              <span>Physical delivery</span>
              <strong>{formatNumber(annual.deliveredKwh, 0)} kWh delivered</strong>
            </div>
            <div>
              <span>Shortfall</span>
              <strong>{formatNumber(annual.shortfallKwh, 0)} kWh / {formatUsdDynamic(annual.shortfallLiabilityUsd)}</strong>
            </div>
            <div>
              <span>Fee buffer</span>
              <strong>{formatUsdDynamic(annual.feeBufferUsd)}</strong>
            </div>
            <div>
              <span>Accounting</span>
              <strong>{annual.conservationPass ? 'conservation passes' : 'check failed'}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="scope-note">
        Boundary: this is still a transparent simulation, not current revenue or adoption. Model-estimated
        surplus cannot mint production SPK until a signed meter or inverter export replaces the assumption layer.
      </div>
    </section>
  );
}
