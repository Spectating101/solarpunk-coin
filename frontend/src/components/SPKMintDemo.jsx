import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  ExternalLink,
  FileCheck2,
  Gauge,
  KeyRound,
  Leaf,
  ShieldCheck,
} from 'lucide-react';
import SPK_ABI from '../abi/SolarPunkCoin.json';
import { CONTRACTS, GITHUB_REPO, SEPOLIA_EXPLORER, SEPOLIA_RPC_URL } from '../constants/contracts';
import productEmpirics from '../../../state/proofs/spk_product_empirics.json';
import spkIntelligence from '../../../state/product/spk_intelligence_layer.json';

const SAMPLE_PRICE_PER_KWH = 0.05;
const SAMPLE_MINT_FEE_BPS = 10;
const proof = productEmpirics.meter_to_mint;
const proofContractAddress = proof.contract_address || CONTRACTS.attestedSolarPunkCoin;

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return 'n/a';
  return value.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function short(value, head = 10, tail = 8) {
  if (!value) return 'n/a';
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

function ageLabel(seconds) {
  if (!Number.isFinite(seconds)) return 'n/a';
  if (seconds < 60) return `${Math.max(0, Math.round(seconds))}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
}

function useSolarPunkCoinState(contractAddress) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const spk = new ethers.Contract(contractAddress, SPK_ABI, provider);
        const latestBlock = await provider.getBlock('latest');
        const [
          totalSupply,
          cumulativeSurplusKwh,
          energyPricePerKwh,
          mintingFee,
          lastOracleUpdate,
          oracleStalenessThreshold,
          gridStressed,
          reserveRatio,
          pegStable,
        ] = await Promise.all([
          spk.totalSupply(),
          spk.cumulativeSurplusKwh(),
          spk.energyPricePerKwh(),
          spk.mintingFee(),
          spk.lastOracleUpdate(),
          spk.oracleStalenessThreshold(),
          spk.gridStressed(),
          spk.getReserveRatio(),
          spk.isPegStable(),
        ]);

        const data = {
          totalSupply: Number(ethers.formatEther(totalSupply)),
          cumulativeSurplusKwh: Number(cumulativeSurplusKwh),
          energyPricePerKwh: Number(ethers.formatEther(energyPricePerKwh)),
          mintingFeeBps: Number(mintingFee),
          oracleAgeSeconds: Number(latestBlock.timestamp) - Number(lastOracleUpdate),
          oracleStalenessThreshold: Number(oracleStalenessThreshold),
          gridStressed,
          reserveRatioPct: Number(reserveRatio) / 100,
          pegStable,
        };

        if (!cancelled) setState({ status: 'ok', data, error: null });
      } catch (error) {
        if (!cancelled) setState({ status: 'error', data: null, error });
      }
    }

    load();
    const id = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [contractAddress]);

  return state;
}

const productSteps = [
  {
    icon: Database,
    title: 'Signed meters',
    text: 'Raw readings are signed by registered meter addresses, then checked for duplicate nonces, quality, capacity, and energy balance.',
  },
  {
    icon: KeyRound,
    title: 'Oracle signature',
    text: 'The attestor signs the surplus amount, recipient, validity window, source hash, chain ID, and contract address.',
  },
  {
    icon: ShieldCheck,
    title: 'Contract gate',
    text: 'SolarPunkCoin rejects stale oracle state, grid stress, bad signatures, replayed attestations, reused source hashes, future windows, bad windows, and zero source hashes.',
  },
  {
    icon: Leaf,
    title: 'SPK mint',
    text: 'Only the verified kWh amount mints SPK, less the configured mint fee split between stability pool and treasury.',
  },
];

export default function SPKMintDemo() {
  const live = useSolarPunkCoinState(proofContractAddress);
  const sampleSurplus = Number(proof.total_surplus_kwh || 0);
  const sampleOnchainKwh = Math.floor(sampleSurplus);
  const sampleMinted = Number(proof.minted_spk || 0);
  const liveOk = live.status === 'ok';
  const liveData = live.data;
  const oracleStale = liveOk && liveData.oracleAgeSeconds >= liveData.oracleStalenessThreshold;
  const systemReady = liveOk && !oracleStale && !liveData.gridStressed;

  const proofLinks = [
    ['Product empirics', `${GITHUB_REPO}/blob/main/docs/product/SPK_PRODUCT_EMPIRICS.md`],
    ['Attested mint proof', `${GITHUB_REPO}/blob/main/docs/product/SPK_ATTESTED_MINT_PROOF.md`],
    ['Public readback', `${GITHUB_REPO}/blob/main/docs/product/SPK_PUBLIC_READBACK.md`],
    ['Intelligence layer', `${GITHUB_REPO}/blob/main/docs/product/SPK_INTELLIGENCE_LAYER.md`],
    ['Meter bundle', `${GITHUB_REPO}/blob/main/docs/project/METER_ATTESTATION_BUNDLE.md`],
    ['Public SPK proof', `${SEPOLIA_EXPLORER}/address/${proofContractAddress}`],
    ['Mint transaction', `${SEPOLIA_EXPLORER}/tx/${proof.tx_hash || CONTRACTS.attestedMintTx}`],
    ['Legacy SPK stack', `${SEPOLIA_EXPLORER}/address/${CONTRACTS.solarPunkCoin}`],
  ];

  return (
    <section className="mint-shell">
      <div className="proof-hero mint-hero">
        <div>
          <div className="eyebrow"><Leaf size={14} /> Primary Product</div>
          <h1>Verified surplus kWh becomes SPK.</h1>
          <p>
            The product is not free token printing. The protocol mints only after an accepted
            meter bundle is hashed, signed by an oracle role, checked against replay, source reuse, and validity
            windows, and passed through reserve, grid, and supply controls.
          </p>
        </div>
        <div className={`system-tile ${systemReady ? 'good' : 'warn'}`}>
          <div className="system-title">
            {systemReady ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            SPK Readiness
          </div>
          <div className="system-grid">
            <span>Live reads</span><strong>{liveOk ? 'ok' : 'fallback'}</strong>
            <span>Grid stress</span><strong>{liveOk ? String(liveData.gridStressed) : 'n/a'}</strong>
            <span>Oracle age</span><strong>{liveOk ? ageLabel(liveData.oracleAgeSeconds) : 'n/a'}</strong>
          </div>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-card metric-amber">
          <div className="metric-label">Sample Surplus</div>
          <div className="metric-value">{formatNumber(sampleSurplus, 1)} kWh</div>
          <div className="metric-sub">{proof.accepted_records} accepted, {proof.rejected_records} rejected signed readings</div>
        </div>
        <div className="metric-card metric-good">
          <div className="metric-label">Attested Mint</div>
          <div className="metric-value">{formatNumber(sampleMinted, 4)} SPK</div>
          <div className="metric-sub">{sampleOnchainKwh} kWh at ${SAMPLE_PRICE_PER_KWH}/kWh minus {SAMPLE_MINT_FEE_BPS} bps</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Live SPK Supply</div>
          <div className="metric-value">{liveOk ? formatNumber(liveData.totalSupply, 2) : 'RPC'}</div>
          <div className="metric-sub">attestation-enabled Sepolia proof stack</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Live Energy Price</div>
          <div className="metric-value">${liveOk ? formatNumber(liveData.energyPricePerKwh, 4) : 'n/a'}</div>
          <div className="metric-sub">current contract parameter</div>
        </div>
        <div className="metric-card metric-good">
          <div className="metric-label">Advisory Risk</div>
          <div className="metric-value">{spkIntelligence.summary.overall_risk.replaceAll('_', ' ')}</div>
          <div className="metric-sub">
            {spkIntelligence.summary.rows_scored} rows scored; AI advises, contracts decide
          </div>
        </div>
      </div>

      <div className="proof-main-grid">
        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><FileCheck2 size={14} /> Product Flow</div>
              <h2>What has to be true before minting</h2>
            </div>
          </div>
          <div className="product-flow-grid">
            {productSteps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="product-flow-card">
                <Icon size={18} />
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><Gauge size={14} /> Live SPK State</div>
              <h2>Attested Sepolia readout</h2>
            </div>
          </div>
          <div className="state-list">
            <div><span>Reserve ratio</span><strong>{liveOk ? `${formatNumber(liveData.reserveRatioPct, 1)}%` : 'n/a'}</strong></div>
            <div><span>Peg stable</span><strong>{liveOk ? String(liveData.pegStable) : 'n/a'}</strong></div>
            <div><span>Mint fee</span><strong>{liveOk ? `${liveData.mintingFeeBps} bps` : 'n/a'}</strong></div>
            <div><span>Cumulative surplus</span><strong>{liveOk ? `${formatNumber(liveData.cumulativeSurplusKwh, 0)} kWh` : 'n/a'}</strong></div>
            <div><span>Coin address</span><strong>{short(proofContractAddress)}</strong></div>
          </div>
          <div className="scope-note">
            This public Sepolia proof stack includes `mintFromSurplusAttestation` and has consumed the
            sample source hash. It is proof-scoped, not the final Safe-admin or audited production deployment.
          </div>
        </div>
      </div>

      <div className="proof-main-grid bottom">
        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><ShieldCheck size={14} /> Reviewer Proof</div>
              <h2>Proof artifacts</h2>
            </div>
          </div>
          <div className="proof-links">
            {proofLinks.map(([label, href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer">
                {label} <ExternalLink size={12} />
              </a>
            ))}
          </div>
          <div className="hash-note">
            <span>Sample batch</span>
            <strong>{proof.batch_id}</strong>
          </div>
          <div className="hash-note">
            <span>Verified signatures</span>
            <strong>{proof.verified_signatures} / {proof.input_records}</strong>
          </div>
          <div className="hash-note">
            <span>Source hash</span>
            <strong>{short(proof.source_hash, 8, 8)}</strong>
          </div>
          <div className="hash-note">
            <span>Mint tx</span>
            <strong>{short(proof.tx_hash || CONTRACTS.attestedMintTx, 8, 8)}</strong>
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><Database size={14} /> Reproduce</div>
              <h2>One command path</h2>
            </div>
          </div>
          <div className="command-stack">
            <code>npm run attestations:fixture</code>
            <code>npm run attestations:build</code>
            <code>npm run proof:spk-attested-mint</code>
            <code>npm run product:empirics</code>
            <code>npx hardhat test</code>
          </div>
          <div className="scope-note">
            By default this reproduces the proof locally. To attach it to Sepolia, set
            `SPK_ADDRESS={proofContractAddress}` and run the proof script on `--network sepolia`.
          </div>
        </div>
      </div>
    </section>
  );
}
