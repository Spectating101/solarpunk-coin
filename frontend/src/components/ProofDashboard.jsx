import React, { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Copy,
  Database,
  ExternalLink,
  RadioTower,
  ShieldCheck,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SPK_ABI from '../abi/SolarPunkCoin.json';
import OPTION_ABI from '../abi/SolarPunkOption.json';
import keeperSummary from '../../../state/keeper_logs/summary.json';
import { CONTRACTS, GITHUB_REPO, KEEPER_WORKFLOW, SEPOLIA_EXPLORER, SEPOLIA_RPC_URL } from '../constants/contracts';

const POLL_INTERVAL = 30_000;

function formatAge(seconds) {
  if (!Number.isFinite(seconds)) return 'unknown';
  if (seconds < 60) return `${Math.max(0, Math.round(seconds))}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
}

function short(value, head = 6, tail = 4) {
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

const isZeroAddress = (address) => {
  return !address || /^0x0{40}$/i.test(address);
};

function txUrl(hash) {
  return `${SEPOLIA_EXPLORER}/tx/${hash}`;
}

function addressUrl(address) {
  return `${SEPOLIA_EXPLORER}/address/${address}`;
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button className="icon-button" onClick={copy} title={copied ? 'Copied' : 'Copy'}>
      {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
    </button>
  );
}

function MetricCard({ label, value, sub, tone = 'neutral' }) {
  return (
    <div className={`metric-card metric-${tone}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

function useLiveProtocolState() {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const spk = new ethers.Contract(CONTRACTS.solarPunkCoin, SPK_ABI, provider);
        const option = new ethers.Contract(CONTRACTS.solarPunkOption, OPTION_ABI.abi, provider);
        const latestBlock = await provider.getBlock('latest');

        const [
          reserveRatio,
          gridStressed,
          pegStable,
          totalSupply,
          usdcReserve,
          currentIndex,
          lastIndexUpdate,
          priceDecimals,
          paused,
          energyPrice,
        ] = await Promise.all([
          spk.getReserveRatio(),
          spk.gridStressed(),
          spk.isPegStable(),
          spk.totalSupply(),
          spk.usdcReserve(),
          option.currentIndex(),
          option.lastIndexUpdate(),
          option.priceDecimals(),
          option.paused(),
          spk.energyPricePerKwh(),
        ]);

        const now = Number(latestBlock.timestamp);
        const optionScale = 10 ** Number(priceDecimals);
        const lastKeeperRun = Math.floor(new Date(keeperSummary.latest_run.run_at).getTime() / 1000);
        const data = {
          reserveRatioPct: Number(reserveRatio) / 100,
          gridStressed,
          pegStable,
          totalSupply: Number(ethers.formatUnits(totalSupply, 18)),
          usdcReserve: Number(ethers.formatUnits(usdcReserve, 6)),
          spkOracleAge: now - lastKeeperRun,
          optionOracleAge: now - Number(lastIndexUpdate),
          currentIndex: Number(currentIndex) / optionScale,
          currentIndexRaw: currentIndex.toString(),
          priceDecimals: Number(priceDecimals),
          optionPaused: paused,
          energyPrice: Number(ethers.formatUnits(energyPrice, 18)),
        };

        if (!cancelled) setState({ status: 'ok', data, error: null });
      } catch (error) {
        if (!cancelled) setState({ status: 'error', data: null, error });
      }
    }

    load();
    const id = window.setInterval(load, POLL_INTERVAL);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return state;
}

const proofLinks = [
  ['GitHub repo', GITHUB_REPO],
  ['SPK product empirics', `${GITHUB_REPO}/blob/main/docs/product/SPK_PRODUCT_EMPIRICS.md`],
  ['SPK attested mint proof', `${GITHUB_REPO}/blob/main/docs/product/SPK_ATTESTED_MINT_PROOF.md`],
  ['NASA keeper workflow', KEEPER_WORKFLOW],
  ['Daily status doc', `${GITHUB_REPO}/blob/main/docs/project/DAILY_EXPERIMENT_STATUS.md`],
];

export default function ProofDashboard() {
  const live = useLiveProtocolState();
  const contractRows = [
    ['SolarPunkCoin', CONTRACTS.solarPunkCoin],
    ['SolarPunkOption', CONTRACTS.solarPunkOption],
    ['ProtocolTreasury', CONTRACTS.protocolTreasury],
    ['StabilityPool', CONTRACTS.stabilityPool],
    ['OracleAdapter', CONTRACTS.oracleAdapter],
    ['Safe', CONTRACTS.safe],
    ['MockUSDC', CONTRACTS.mockUsdc],
    ['EnergyRevenueFloor (pilot)', CONTRACTS.energyRevenueFloor],
  ];
  const latestRun = keeperSummary.latest_run;
  const latestNasaDate = latestRun.nasa?.date ?? latestRun.nasa_date ?? latestRun.date;
  const latestIndex = latestRun.protocol_state?.option_index ?? latestRun.option_index ?? latestRun.normalised_index;
  const latestScaledIndex = latestRun.index?.scaled_6dec ?? latestRun.scaled_6dec ?? 'n/a';
  const recentRuns = useMemo(() => keeperSummary.recent_runs ?? [], []);
  const chartData = recentRuns.map((run) => ({
    date: run.date.slice(5),
    index: Number(run.option_index ?? run.normalised_index),
  }));

  const liveOk = live.status === 'ok';
  const liveData = live.data;
  const stale = liveOk && (liveData.spkOracleAge > 86_400 || liveData.optionOracleAge > 86_400);
  const systemTone = live.status === 'error' || stale ? 'warn' : 'good';

  return (
    <section className="proof-shell">
      <div className="proof-hero">
        <div>
          <div className="eyebrow"><RadioTower size={14} /> Live Sepolia Prototype</div>
          <h1>Energy-backed SPK, visible on-chain.</h1>
          <p>
            A working testnet protocol that publishes real solar data on-chain, plus a public
            proof showing how accepted surplus kWh becomes signed, replay-protected SPK.
          </p>
        </div>
        <div className={`system-tile ${systemTone}`}>
          <div className="system-title">
            {systemTone === 'good' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            System {systemTone === 'good' ? 'OK' : 'Needs Check'}
          </div>
          <div className="system-grid">
            <span>Runs</span><strong>{keeperSummary.total_successful_runs}</strong>
            <span>Streak</span><strong>{keeperSummary.current_success_streak_days}d</strong>
            <span>Latest</span><strong>{keeperSummary.last_successful_run}</strong>
          </div>
        </div>
      </div>

      <div className="metric-grid">
        <MetricCard
          label="Latest NASA Index"
          value={Number(latestIndex).toFixed(6)}
          sub={`raw ${latestScaledIndex} · ${latestNasaDate}`}
          tone="amber"
        />
        <MetricCard
          label="Reserve Ratio"
          value={liveOk ? `${liveData.reserveRatioPct.toFixed(1)}%` : `${latestRun.protocol_state.reserve_ratio_pct.toFixed(1)}%`}
          sub="minimum reserve margin 10%"
          tone="good"
        />
        <MetricCard
          label="Oracle Freshness"
          value={liveOk ? `${formatAge(Math.max(liveData.spkOracleAge, liveData.optionOracleAge))}` : 'RPC fallback'}
          sub={liveOk ? 'oldest live oracle timestamp' : 'using committed keeper summary'}
          tone={stale ? 'warn' : 'good'}
        />
        <MetricCard
          label="Energy Price"
          value={liveOk ? `$${liveData.energyPrice.toFixed(2)}/kWh` : `$${latestRun.protocol_state.energy_price_per_kwh.toFixed(2)}/kWh`}
          sub="manual tariff for Sepolia prototype"
        />
      </div>

      <div className="panel proof-path-panel">
        <div className="panel-heading compact">
          <div>
            <div className="panel-kicker"><ShieldCheck size={14} /> Reviewer Path</div>
            <h2>Verify the experiment in four clicks</h2>
          </div>
        </div>
        <div className="proof-path-grid">
          <div>
            <span>1</span>
            <strong>Open SPK product proof</strong>
            <p>Inspect the generated meter-bundle to attested-mint proof.</p>
          </div>
          <div>
            <span>2</span>
            <strong>Check NASA input</strong>
            <p>Compare the daily NASA date, normalized index, and scaled on-chain value.</p>
          </div>
          <div>
            <span>3</span>
            <strong>Open Sepolia tx</strong>
            <p>Confirm `updateIndex` and treasury/oracle updates were posted publicly.</p>
          </div>
          <div>
            <span>4</span>
            <strong>Read live contracts</strong>
            <p>Validate reserve ratio, supply, option index, and pause state from RPC.</p>
          </div>
        </div>
      </div>

      <div className="proof-main-grid">
        <div className="panel index-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-kicker"><BarChart3 size={14} /> Daily Experiment</div>
              <h2>NASA POWER to option index</h2>
            </div>
            <a className="text-link" href={txUrl(latestRun.transactions.updateIndex)} target="_blank" rel="noreferrer">
              Latest tx <ExternalLink size={13} />
            </a>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 16, right: 12, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="indexFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#5f8064', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5f8064', fontSize: 11 }} axisLine={false} tickLine={false} width={34} />
                <Tooltip
                  contentStyle={{ background: '#0b160d', border: '1px solid #24402a', borderRadius: '6px', color: '#e8f3e8' }}
                  formatter={(value) => [Number(value).toFixed(4), 'option index']}
                />
                <Area type="monotone" dataKey="index" stroke="#d97706" strokeWidth={2} fill="url(#indexFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="run-strip">
            {recentRuns.slice(-5).map((run) => (
              <a key={run.date} href={txUrl(run.updateIndex_tx)} target="_blank" rel="noreferrer" className="run-pill">
                <span>{run.date.slice(5)}</span>
                <strong>{Number(run.option_index ?? run.normalised_index).toFixed(4)}</strong>
              </a>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><Activity size={14} /> Protocol State</div>
              <h2>Live health</h2>
            </div>
          </div>
          <div className="state-list">
            <div><span>SPK supply</span><strong>{liveOk ? liveData.totalSupply.toLocaleString(undefined, { maximumFractionDigits: 2 }) : latestRun.protocol_state.total_supply_spk.toFixed(2)}</strong></div>
            <div><span>USDC reserve</span><strong>${(liveOk ? liveData.usdcReserve : latestRun.protocol_state.usdc_reserve_usd).toLocaleString()}</strong></div>
            <div><span>Peg stable</span><strong>{(liveOk ? liveData.pegStable : latestRun.protocol_state.peg_stable) ? 'true' : 'false'}</strong></div>
            <div><span>Grid stressed</span><strong>{(liveOk ? liveData.gridStressed : latestRun.protocol_state.grid_stressed) ? 'true' : 'false'}</strong></div>
            <div><span>Option paused</span><strong>{liveOk ? String(liveData.optionPaused) : 'false'}</strong></div>
            <div><span>Decimals</span><strong>{liveOk ? liveData.priceDecimals : 6}</strong></div>
          </div>
          {live.status === 'error' && (
            <div className="warning-box">Live RPC read failed. Displaying committed keeper summary instead.</div>
          )}
        </div>
      </div>

      <div className="proof-main-grid bottom">
        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><ShieldCheck size={14} /> Public Contracts</div>
              <h2>Explorer links</h2>
            </div>
          </div>
          <div className="contract-list">
            {contractRows.map(([name, address]) => {
              const waiting = isZeroAddress(address);
              return (
                <div key={name} className="contract-row">
                  <span>{name}</span>
                  <div>
                    {waiting ? (
                      <strong style={{ color: 'var(--amber)' }}>Pending deployment</strong>
                    ) : (
                      <>
                        <a href={addressUrl(address)} target="_blank" rel="noreferrer">{short(address)}</a>
                        <CopyButton value={address} />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><Database size={14} /> Proof Trail</div>
              <h2>Reviewer proof links</h2>
            </div>
          </div>
          <div className="tx-list">
            {Object.entries(latestRun.transactions).map(([label, hash]) => (
              <a key={hash} href={txUrl(hash)} target="_blank" rel="noreferrer">
                <span>{label}</span>
                <strong>{short(hash, 10, 8)}</strong>
              </a>
            ))}
          </div>
          <div className="proof-links">
            {proofLinks.map(([label, href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer">
                {label} <ExternalLink size={12} />
              </a>
            ))}
          </div>
          <div className="scope-note">
            Prototype-stage oracle experiment on Sepolia. This proves recurring real-data ingestion
            and on-chain publication, not production oracle finality.
          </div>
        </div>
      </div>
    </section>
  );
}
