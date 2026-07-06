import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import {
  CalendarClock,
  CircleDollarSign,
  ClipboardList,
  Globe,
  Leaf,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import EnergyRevenueFloorABI from '../abi/EnergyRevenueFloor.json';
import { CONTRACTS, SEPOLIA_EXPLORER } from '../constants/contracts';

const FLOOR_ADDRESS = import.meta.env.VITE_ENERGY_FLOOR_ADDRESS || CONTRACTS.energyRevenueFloor;

const ERC20_ABI = [
  "function decimals() external view returns (uint8)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)",
];

const POLICY_STATE = {
  Active: 0,
  Reported: 1,
  Disputed: 2,
  Settled: 3,
  Cancelled: 4,
  Expired: 5,
};

const POLICY_STATE_LABELS = ['Active', 'Reported', 'Disputed', 'Settled', 'Cancelled', 'Expired'];

const short = (value, chars = 8) => `${value.slice(0, chars)}...${value.slice(-6)}`;
const asBigInt = (value, fallback = 0n) => {
  try {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) return fallback;
    return BigInt(trimmed);
  } catch {
    return fallback;
  }
};

const fmtUnits = (amount, decimals) => {
  try {
    return ethers.formatUnits(amount, decimals);
  } catch {
    return '0';
  }
};

const toUnix = (value) => {
  const timestamp = value ? Date.parse(value) : NaN;
  if (Number.isNaN(timestamp)) {
    return 0;
  }
  return Math.floor(timestamp / 1000);
};

const toDateInput = (unixSeconds) => new Date(unixSeconds * 1000).toISOString().slice(0, 16);
const parseTokenAmount = (value, decimals) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return 0n;

  try {
    return ethers.parseUnits(trimmed, Number(decimals));
  } catch {
    return 0n;
  }
};

const normalizeBytes32 = (value) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return ethers.ZeroHash;
  const withPrefix = trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`;
  if (withPrefix.length !== 66) return null;
  return withPrefix;
};

const isZeroAddress = (address) =>
  !address || address === ethers.ZeroAddress || address.startsWith('0x0000000000000000000000000000000000000000');

const CommercialPilot = ({ provider, signer }) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [contractError, setContractError] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(6);
  const [minPremiumBps, setMinPremiumBps] = useState(50);
  const [maxPremiumBps, setMaxPremiumBps] = useState(1500);
  const [lockedLiquidity, setLockedLiquidity] = useState(0n);
  const [freeLiquidity, setFreeLiquidity] = useState(0n);
  const [reportWindow, setReportWindow] = useState(0);
  const [disputeWindow, setDisputeWindow] = useState(0);
  const [reportDriftWindow, setReportDriftWindow] = useState(0);
  const [contractBalance, setContractBalance] = useState(0n);
  const [isReporter, setIsReporter] = useState(false);
  const [isLiquidity, setIsLiquidity] = useState(false);
  const [producers, setProducers] = useState([]);
  const [selectedProducerId, setSelectedProducerId] = useState('');
  const [policyIds, setPolicyIds] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [producerForm, setProducerForm] = useState({
    siteName: '',
    location: '',
    capacityKw: '120',
    heartbeatSeconds: '300',
  });
  const [policyForm, setPolicyForm] = useState({
    targetKwh: '1000',
    floorPrice: '0.12',
    premiumBps: '120',
    periodStart: toDateInput(Math.floor(Date.now() / 1000) + 3600),
    periodEnd: toDateInput(Math.floor(Date.now() / 1000) + 3600 * 25),
  });
  const [policyQuote, setPolicyQuote] = useState(null);
  const [reportForm, setReportForm] = useState({
    policyId: '',
    realizedKwh: '',
    measuredAt: toDateInput(Math.floor(Date.now() / 1000)),
    sourceHash: '',
  });
  const [liquidityForm, setLiquidityForm] = useState({
    deposit: '',
    withdraw: '',
    destination: '',
  });
  const [actionTx, setActionTx] = useState('');

  const activeWallet = useCallback(async () => {
    if (!signer) return null;
    try {
      return await signer.getAddress();
    } catch {
      return null;
    }
  }, [signer]);

  const withContract = useCallback(async (mutate) => {
    if (!provider) return null;
    if (isZeroAddress(FLOOR_ADDRESS)) return null;
    const rpcContract = new ethers.Contract(FLOOR_ADDRESS, EnergyRevenueFloorABI.abi, provider);
    if (!mutate) return rpcContract;
    if (!signer) throw new Error('Wallet not connected');
    return new ethers.Contract(FLOOR_ADDRESS, EnergyRevenueFloorABI.abi, signer);
  }, [provider, signer]);

  const loadProtocolState = useCallback(async () => {
    if (!provider || isZeroAddress(FLOOR_ADDRESS)) {
      setLoading(false);
      return;
    }

    setContractError('');
    try {
      const floor = await withContract();
      if (!floor) {
        throw new Error('floor contract is not configured');
      }
      const tokenAddr = await floor.settlementToken();
      const settlement = new ethers.Contract(tokenAddr, ERC20_ABI, provider);

      const [
        decimals,
        treasuryLock,
        freePool,
        contractPool,
        maxPrem,
        minPrem,
        reportWindowSeconds,
        disputeWindowSeconds,
        driftWindow,
      ] = await Promise.all([
        settlement.decimals(),
        floor.totalLockedLiquidity(),
        floor.freeLiquidity(),
        settlement.balanceOf(FLOOR_ADDRESS),
        floor.maxPremiumBps(),
        floor.minPremiumBps(),
        floor.reportSubmissionWindowSeconds(),
        floor.disputeWindowSeconds(),
        floor.maxReportDriftSeconds(),
      ]);

      setTokenAddress(tokenAddr);
      setTokenDecimals(Number(decimals));
      setLockedLiquidity(BigInt(treasuryLock));
      setFreeLiquidity(BigInt(freePool));
      setContractBalance(BigInt(contractPool));
      setMaxPremiumBps(Number(maxPrem));
      setMinPremiumBps(Number(minPrem));
      setReportWindow(Number(reportWindowSeconds));
      setDisputeWindow(Number(disputeWindowSeconds));
      setReportDriftWindow(Number(driftWindow));

      const user = await activeWallet();
      let isCurrentReporter = false;
      let isCurrentLiquidity = false;
      if (user) {
        const reporterRole = await floor.REPORTER_ROLE();
        const liquidityRole = await floor.LIQUIDITY_ROLE();
        [isCurrentReporter, isCurrentLiquidity] = await Promise.all([
          floor.hasRole(reporterRole, user),
          floor.hasRole(liquidityRole, user),
        ]);
        setIsReporter(isCurrentReporter);
        setIsLiquidity(isCurrentLiquidity);

        const [ids] = await floor.getPolicyIdsForPayer(user, 0, 20);
        const policyPromises = ids.map((id) => floor.policies(id));
        const policyRecords = await Promise.all(policyPromises);
        setPolicyIds(ids.map((id) => Number(id)));

        setPolicies(
          ids.map((id, idx) => ({
            id: Number(id),
            producerId: policyRecords[idx].producerId,
            periodStart: Number(policyRecords[idx].periodStart),
            periodEnd: Number(policyRecords[idx].periodEnd),
            reportDeadline: Number(policyRecords[idx].reportDeadline),
            disputeDeadline: Number(policyRecords[idx].disputeDeadline),
            targetKwh: policyRecords[idx].targetKwh,
            floorPricePerKwh: policyRecords[idx].floorPricePerKwh,
            premiumBps: Number(policyRecords[idx].premiumBps),
            premiumPaid: policyRecords[idx].premiumPaid,
            maxPayout: policyRecords[idx].maxPayout,
            realizedKwh: policyRecords[idx].realizedKwh,
            payout: policyRecords[idx].payout,
            reportAt: Number(policyRecords[idx].reportAt),
            settledAt: Number(policyRecords[idx].settledAt),
            state: Number(policyRecords[idx].state),
            disputed: policyRecords[idx].disputed,
            sourceHash: policyRecords[idx].sourceHash,
            reporter: policyRecords[idx].reporter,
            payoutState: POLICY_STATE_LABELS[Number(policyRecords[idx].state)] || 'Unknown',
            lockedLiquidity: policyRecords[idx].lockedLiquidity,
          }))
        );
      } else {
        setIsReporter(false);
        setIsLiquidity(false);
        setPolicyIds([]);
        setPolicies([]);
      }

      const [producerIds] = await floor.getProducerIds(user || ethers.ZeroAddress, 0, 20);
      const producerRecords = await Promise.all(
        producerIds.map((id) => floor.producers(id))
      );
      setProducers(
        producerIds.map((id, idx) => ({
          id,
          siteName: producerRecords[idx].siteName,
          location: producerRecords[idx].location,
          capacityKw: producerRecords[idx].capacityKw,
          heartbeatSeconds: producerRecords[idx].heartbeatSeconds,
          active: producerRecords[idx].active,
          totalPolicies: producerRecords[idx].totalPolicies,
          lastReportAt: Number(producerRecords[idx].lastReportAt),
          createdAt: Number(producerRecords[idx].createdAt),
        }))
      );
    } catch (error) {
      console.error('Failed loading pilot state', error);
      setContractError(error.message || 'Failed to load floor state');
    } finally {
      setLoading(false);
    }
  }, [withContract, provider, FLOOR_ADDRESS, activeWallet]);

  useEffect(() => {
    const interval = setInterval(loadProtocolState, 15000);
    void loadProtocolState();
    return () => clearInterval(interval);
  }, [loadProtocolState]);

  useEffect(() => {
    if (!selectedProducerId && producers.length > 0) {
      setSelectedProducerId(producers[0].id);
    }
  }, [producers, selectedProducerId]);

  const selectedProducer = useMemo(() => {
    if (!selectedProducerId) return null;
    return producers.find((producer) => producer.id === selectedProducerId) || null;
  }, [producers, selectedProducerId]);

  const estimate = useCallback(async () => {
    if (!provider || !selectedProducer || !policyForm.premiumBps) {
      setPolicyQuote(null);
      return;
    }

    try {
      const floor = await withContract();
      const [maxPayout, premium] = await floor.estimatePolicy(
        asBigInt(policyForm.targetKwh, 0n),
        ethers.parseUnits(policyForm.floorPrice, tokenDecimals),
        asBigInt(policyForm.premiumBps, 0n)
      );
      setPolicyQuote({
        maxPayout: maxPayout,
        premium: premium,
      });
      setContractError('');
    } catch (error) {
      setPolicyQuote(null);
      setContractError(error.message || 'Could not estimate policy');
    }
  }, [provider, selectedProducer, policyForm, tokenDecimals, withContract]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void estimate();
    }, 200);
    return () => clearTimeout(timer);
  }, [estimate]);

  const doRegisterProducer = async () => {
    if (!provider || !signer) return;
    if (FLOOR_ADDRESS.startsWith('0x0000')) {
      setStatus('contract-unset');
      return;
    }

    setLoading(true);
    setStatus('registering');
    setContractError('');
    try {
      const floor = await withContract(true);
      const tx = await floor.registerProducer(
        producerForm.siteName,
        producerForm.location,
        asBigInt(producerForm.capacityKw),
        asBigInt(producerForm.heartbeatSeconds)
      );
      await tx.wait();
      setActionTx(tx.hash);
      setStatus('success');
      await loadProtocolState();
      setProducerForm({
        siteName: '',
        location: '',
        capacityKw: '',
        heartbeatSeconds: '300',
      });
    } catch (error) {
      setStatus('error');
      setContractError(error.reason || error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const doOpenPolicy = async () => {
    if (!signer || !selectedProducerId) return;
    const start = toUnix(policyForm.periodStart);
    const end = toUnix(policyForm.periodEnd);

    if (start <= Math.floor(Date.now() / 1000)) {
      setContractError('Period start must be in the future');
      return;
    }
    if (end <= start) {
      setContractError('Period end must be after start');
      return;
    }

    const targetKwh = asBigInt(policyForm.targetKwh, 0n);
    const floorPricePerKwh = parseTokenAmount(policyForm.floorPrice, tokenDecimals);
    const premiumBps = asBigInt(policyForm.premiumBps, 0n);

    if (targetKwh <= 0n || floorPricePerKwh <= 0n) {
      setContractError('Target kWh and floor price must be positive');
      return;
    }
    if (premiumBps < BigInt(minPremiumBps) || premiumBps > BigInt(maxPremiumBps)) {
      setContractError(`Premium must be between ${minPremiumBps} and ${maxPremiumBps} bps`);
      return;
    }

    setLoading(true);
    setStatus('opening');
    setContractError('');
    try {
      const floor = await withContract(true);
      const tokenAddr = await floor.settlementToken();
      const token = new ethers.Contract(tokenAddr, ERC20_ABI, signer);
      const owner = await signer.getAddress();
      const [premiumEstimate] = await floor.estimatePolicy(targetKwh, floorPricePerKwh, premiumBps);

      const allowance = await token.allowance(owner, FLOOR_ADDRESS);
      if (allowance < premiumEstimate) {
        setStatus('approving');
        const approveTx = await token.approve(FLOOR_ADDRESS, premiumEstimate);
        await approveTx.wait();
      }

      const tx = await floor.openFloorPolicy(
        selectedProducerId,
        start,
        end,
        targetKwh,
        floorPricePerKwh,
        premiumBps,
        owner
      );
      await tx.wait();
      setActionTx(tx.hash);
      setStatus('success');
      await loadProtocolState();
    } catch (error) {
      setStatus('error');
      setContractError(error.reason || error.message || 'Open policy failed');
    } finally {
      setLoading(false);
    }
  };

  const doReport = async () => {
    if (!signer || !reportForm.policyId) {
      return;
    }
    const realizedKwh = asBigInt(reportForm.realizedKwh, 0n);
    const measuredAt = toUnix(reportForm.measuredAt);
    if (realizedKwh <= 0n || measuredAt <= 0) {
      setContractError('Measured kWh and timestamp required');
      return;
    }

    const sourceHash = normalizeBytes32(reportForm.sourceHash);

    if (!sourceHash) {
      setContractError('Source hash must be a valid 32-byte hex value');
      return;
    }

    setLoading(true);
    setStatus('reporting');
    setContractError('');
    try {
      const floor = await withContract(true);
      const tx = await floor.submitManualProductionReport(
        asBigInt(reportForm.policyId, 0n),
        realizedKwh,
        measuredAt,
        sourceHash
      );
      await tx.wait();
      setActionTx(tx.hash);
      setStatus('success');
      await loadProtocolState();
    } catch (error) {
      setStatus('error');
      setContractError(error.reason || error.message || 'Report submission failed');
    } finally {
      setLoading(false);
    }
  };

  const doDepositLiquidity = async () => {
    if (!signer || !isLiquidity) return;

    const amount = parseTokenAmount(liquidityForm.deposit, tokenDecimals);
    if (amount <= 0n) {
      setContractError('Liquidity amount must be greater than zero');
      return;
    }

    setLoading(true);
    setStatus('depositing');
    setContractError('');
    try {
      const floor = await withContract(true);
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      const wallet = await signer.getAddress();
      const allowance = await token.allowance(wallet, FLOOR_ADDRESS);

      if (allowance < amount) {
        setStatus('approving');
        const approvalTx = await token.approve(FLOOR_ADDRESS, amount);
        await approvalTx.wait();
      }

      const tx = await floor.depositLiquidity(amount);
      await tx.wait();
      setActionTx(tx.hash);
      setLiquidityForm((prev) => ({ ...prev, deposit: '' }));
      setStatus('success');
      await loadProtocolState();
    } catch (error) {
      setStatus('error');
      setContractError(error.reason || error.message || 'Liquidity deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const doWithdrawLiquidity = async () => {
    if (!signer || !isLiquidity) return;

    const amount = parseTokenAmount(liquidityForm.withdraw, tokenDecimals);
    if (amount <= 0n) {
      setContractError('Withdrawal amount must be greater than zero');
      return;
    }

    const wallet = await signer.getAddress();
    const destination = liquidityForm.destination.trim() || wallet;
    if (!ethers.isAddress(destination)) {
      setContractError('Destination must be a valid address');
      return;
    }

    if (amount > freeLiquidity) {
      setContractError('Withdrawal amount exceeds free liquidity');
      return;
    }

    setLoading(true);
    setStatus('withdrawing');
    setContractError('');
    try {
      const floor = await withContract(true);
      const tx = await floor.withdrawLiquidity(amount, destination);
      await tx.wait();
      setActionTx(tx.hash);
      setLiquidityForm((prev) => ({ ...prev, withdraw: '', destination: '' }));
      setStatus('success');
      await loadProtocolState();
    } catch (error) {
      setStatus('error');
      setContractError(error.reason || error.message || 'Liquidity withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const doActionOnPolicy = async (policyId, mode) => {
    if (!signer) return;

    setLoading(true);
    setStatus(mode);
    setContractError('');
    try {
      const floor = await withContract(true);
      const tx =
        mode === 'dispute'
          ? await floor.requestDispute(policyId, 'energy production anomaly')
          : mode === 'finalize'
            ? await floor.finalizePolicy(policyId)
            : mode === 'cancel'
              ? await floor.cancelPolicy(policyId)
              : await floor.expirePolicy(policyId);
      await tx.wait();
      setActionTx(tx.hash);
      setStatus('success');
      await loadProtocolState();
    } catch (error) {
      setStatus('error');
      setContractError(error.reason || error.message || `${mode} failed`);
    } finally {
      setLoading(false);
    }
  };

  const showPolicyCard = (policy) => {
    const state = POLICY_STATE_LABELS[policy.state] || 'Unknown';
    const now = Math.floor(Date.now() / 1000);
    const canDispute =
      policy.state === POLICY_STATE.Reported && !policy.disputed && now <= policy.disputeDeadline;
    const canSettle =
      policy.state === POLICY_STATE.Reported && !policy.disputed && now > policy.disputeDeadline;

    return (
      <div className="panel policy-card" key={policy.id}>
        <div className="panel-heading compact">
          <div>
            <div className="panel-kicker">Policy #{policy.id}</div>
            <h2>
              {state}
              <span className="text-muted" style={{ marginLeft: '8px', fontSize: '14px' }}>
                · {policy.payoutState}
              </span>
            </h2>
          </div>
        </div>
        <div className="state-list">
          <div><span>Producer</span><strong>{short(policy.producerId)}</strong></div>
          <div><span>Target</span><strong>{Number(policy.targetKwh).toLocaleString()} kWh</strong></div>
          <div><span>Floor</span><strong>{fmtUnits(policy.floorPricePerKwh, tokenDecimals)} token/kWh</strong></div>
          <div><span>Max Payout</span><strong>{fmtUnits(policy.maxPayout, tokenDecimals)} token</strong></div>
          <div><span>Premium Paid</span><strong>{fmtUnits(policy.premiumPaid, tokenDecimals)} token</strong></div>
          <div><span>Reported</span><strong>{policy.reportAt ? new Date(policy.reportAt * 1000).toLocaleString() : 'pending'}</strong></div>
          <div><span>Settlement</span><strong>{policy.settledAt ? new Date(policy.settledAt * 1000).toLocaleString() : 'pending'}</strong></div>
          <div><span>Dispute deadline</span><strong>{new Date(policy.disputeDeadline * 1000).toLocaleString()}</strong></div>
        </div>
        <div className="tab-grid" style={{ marginTop: '10px', gap: '8px' }}>
          {policy.state === POLICY_STATE.Active && now > policy.periodEnd && (
            <button className="btn-primary" onClick={() => doActionOnPolicy(policy.id, 'expire')} disabled={loading}>
              Expire
            </button>
          )}
          {policy.state === POLICY_STATE.Active && now < policy.periodEnd && (
            <button className="btn-primary" onClick={() => doActionOnPolicy(policy.id, 'cancel')} disabled={loading}>
              Cancel
            </button>
          )}
          {canDispute && (
            <button className="btn-primary" onClick={() => doActionOnPolicy(policy.id, 'dispute')} disabled={loading}>
              Dispute
            </button>
          )}
          {canSettle && (
            <button className="btn-primary" onClick={() => doActionOnPolicy(policy.id, 'finalize')} disabled={loading}>
              Finalize Settlement
            </button>
          )}
        </div>
      </div>
    );
  };

  if (FLOOR_ADDRESS.startsWith('0x0000')) {
    return (
      <div className="glass-card">
        <h3 className="text-accent">Commercial Pilot</h3>
        <div className="scope-note">
          Contract address is not configured. Set <code>VITE_ENERGY_FLOOR_ADDRESS</code> (or update
          <code>CONTRACTS.energyRevenueFloor</code>) and reload.
        </div>
      </div>
    );
  }

  if (loading && !producers.length && !policies.length) {
    return <div className="glass-card">Loading on-chain pilot state...</div>;
  }

  return (
    <div className="proof-shell">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <div className="panel-kicker"><Leaf size={14} /> Commercial floor pilot</div>
            <h2>Operator console</h2>
          </div>
          <a className="text-link" href={`${SEPOLIA_EXPLORER}/address/${FLOOR_ADDRESS}`} target="_blank" rel="noreferrer">
            {short(FLOOR_ADDRESS)} <Globe size={12} />
          </a>
        </div>
        <div className="proof-path-grid">
          <div>
            <span>01</span>
            <strong>Locked liquidity</strong>
            <span>{fmtUnits(lockedLiquidity, tokenDecimals)} token</span>
          </div>
          <div>
            <span>02</span>
            <strong>Free liquidity</strong>
            <span>{fmtUnits(freeLiquidity, tokenDecimals)} token</span>
          </div>
          <div>
            <span>03</span>
            <strong>Premium band</strong>
            <span>{minPremiumBps}-{maxPremiumBps} bps</span>
          </div>
          <div>
            <span>04</span>
            <strong>Report policy</strong>
            <span>{Math.floor(reportWindow / 3600)}h windows</span>
          </div>
        </div>
        <div className="state-list" style={{ marginTop: '16px' }}>
          <div><span>Settlement token</span><strong>{tokenAddress}</strong></div>
          <div><span>Contract balance</span><strong>{fmtUnits(contractBalance, tokenDecimals)}</strong></div>
          <div><span>Dispute window</span><strong>{Math.floor(disputeWindow / 3600)}h</strong></div>
          <div><span>Report drift tolerance</span><strong>{Math.floor(reportDriftWindow / 3600)}h</strong></div>
        </div>
      </div>

      <div className="tab-grid">
        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><CalendarClock size={14} /> Producer registry</div>
              <h2>Register / select producer</h2>
            </div>
          </div>

          {!signer ? (
            <div className="scope-note">Connect wallet to manage producers and policies.</div>
          ) : (
            <>
              <div className="readiness-card">
                <label>Site name</label>
                <input
                  className="wallet-pill"
                  value={producerForm.siteName}
                  onChange={(event) => setProducerForm((prev) => ({ ...prev, siteName: event.target.value }))}
                  placeholder="Acme Solar Farm"
                  style={{ width: '100%' }}
                />
                <label>Location</label>
                <input
                  className="wallet-pill"
                  value={producerForm.location}
                  onChange={(event) => setProducerForm((prev) => ({ ...prev, location: event.target.value }))}
                  placeholder="Taipei, TW"
                  style={{ width: '100%' }}
                />
                <label>Capacity (kW)</label>
                <input
                  className="wallet-pill"
                  value={producerForm.capacityKw}
                  onChange={(event) => setProducerForm((prev) => ({ ...prev, capacityKw: event.target.value }))}
                  type="number"
                  min="1"
                  style={{ width: '100%' }}
                />
                <label>Heartbeat seconds</label>
                <input
                  className="wallet-pill"
                  value={producerForm.heartbeatSeconds}
                  onChange={(event) => setProducerForm((prev) => ({ ...prev, heartbeatSeconds: event.target.value }))}
                  type="number"
                  min="30"
                  style={{ width: '100%' }}
                />
                <button className="btn-primary" onClick={doRegisterProducer} disabled={loading}>
                  Register Producer
                </button>
              </div>

              <label style={{ marginTop: '12px', display: 'block' }}>Choose active producer</label>
              <select
                value={selectedProducerId}
                onChange={(event) => setSelectedProducerId(event.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Select producer</option>
                {producers.map((producer) => (
                  <option key={producer.id} value={producer.id}>
                    {producer.siteName} — {producer.location}
                  </option>
                ))}
              </select>

              {selectedProducer && (
                <div className="state-list" style={{ marginTop: '10px' }}>
                  <div><span>Capacity</span><strong>{Number(selectedProducer.capacityKw).toLocaleString()} kW</strong></div>
                  <div><span>Heartbeat</span><strong>{selectedProducer.heartbeatSeconds}s</strong></div>
                  <div><span>Policies</span><strong>{Number(selectedProducer.totalPolicies)}</strong></div>
                  <div><span>Status</span><strong>{selectedProducer.active ? 'Active' : 'Paused'}</strong></div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker"><CircleDollarSign size={14} /> Policy workspace</div>
              <h2>Quote and launch</h2>
            </div>
            <button className="icon-button" onClick={() => void estimate()} title="Refresh quote"><RefreshCw size={12} /></button>
          </div>

          <div className="readiness-card">
            <label>Target kWh</label>
            <input
              value={policyForm.targetKwh}
              onChange={(event) => setPolicyForm((prev) => ({ ...prev, targetKwh: event.target.value }))}
              type="number"
              min="1"
              step="1"
              style={{ width: '100%' }}
            />
            <label>Floor price per kWh</label>
            <input
              value={policyForm.floorPrice}
              onChange={(event) => setPolicyForm((prev) => ({ ...prev, floorPrice: event.target.value }))}
              type="number"
              min="0.000001"
              step="0.0001"
              style={{ width: '100%' }}
            />
            <label>Premium (bps)</label>
            <input
              value={policyForm.premiumBps}
              onChange={(event) => setPolicyForm((prev) => ({ ...prev, premiumBps: event.target.value }))}
              type="number"
              min={minPremiumBps}
              max={maxPremiumBps}
              step="1"
              style={{ width: '100%' }}
            />
            <label>Period start (local)</label>
            <input
              value={policyForm.periodStart}
              onChange={(event) => setPolicyForm((prev) => ({ ...prev, periodStart: event.target.value }))}
              type="datetime-local"
              style={{ width: '100%' }}
            />
            <label>Period end (local)</label>
            <input
              value={policyForm.periodEnd}
              onChange={(event) => setPolicyForm((prev) => ({ ...prev, periodEnd: event.target.value }))}
              type="datetime-local"
              style={{ width: '100%' }}
            />

            {policyQuote ? (
              <div className="scope-note" style={{ marginTop: '10px' }}>
                Estimated max payout: <strong>{fmtUnits(policyQuote.maxPayout, tokenDecimals)} token</strong>
                <br />
                Premium required: <strong>{fmtUnits(policyQuote.premium, tokenDecimals)} token</strong>
              </div>
            ) : (
              <div className="scope-note" style={{ marginTop: '10px' }}>
                Enter all fields to generate estimate.
              </div>
            )}

            <button className="btn-primary" onClick={doOpenPolicy} disabled={!signer || !selectedProducerId || loading}>
              Open Floor Policy
            </button>
          </div>

          {isReporter && (
            <>
              <div className="panel-heading compact" style={{ marginTop: '18px' }}>
                <div><div className="panel-kicker"><ClipboardList size={14} /> Reporter action</div><h2>Manual report (fallback)</h2></div>
              </div>
              <div className="readiness-card">
                <label>Policy ID</label>
                <select value={reportForm.policyId} onChange={(event) => setReportForm((prev) => ({ ...prev, policyId: event.target.value }))}>
                  <option value="">Select policy</option>
                  {policyIds.map((id) => (
                    <option key={id} value={id}>#{id}</option>
                  ))}
                </select>
                <label>Realized kWh</label>
                <input
                  value={reportForm.realizedKwh}
                  onChange={(event) => setReportForm((prev) => ({ ...prev, realizedKwh: event.target.value }))}
                  type="number"
                  min="0"
                  step="1"
                />
                <label>Measured at</label>
                <input
                  value={reportForm.measuredAt}
                  onChange={(event) => setReportForm((prev) => ({ ...prev, measuredAt: event.target.value }))}
                  type="datetime-local"
                />
                <label>Source hash (keccak of telemetry payload)</label>
                <input
                  value={reportForm.sourceHash}
                  onChange={(event) => setReportForm((prev) => ({ ...prev, sourceHash: event.target.value }))}
                  placeholder="0x..."
                />
                <button className="btn-primary" onClick={doReport} disabled={!signer || loading}>
                  Submit Report
                </button>
              </div>
            </>
          )}

          {isLiquidity && (
            <>
              <div className="panel-heading compact" style={{ marginTop: '18px' }}>
                <div><div className="panel-kicker"><CircleDollarSign size={14} /> Liquidity vault</div><h2>Liquidity operations</h2></div>
              </div>
              <div className="readiness-card">
                <label>Deposit liquidity</label>
                <input
                  value={liquidityForm.deposit}
                  onChange={(event) => setLiquidityForm((prev) => ({ ...prev, deposit: event.target.value }))}
                  type="number"
                  min="0"
                  step="0.000001"
                  placeholder="0"
                />
                <button className="btn-primary" onClick={doDepositLiquidity} disabled={!signer || loading}>
                  Deposit
                </button>

                <label style={{ marginTop: '8px' }}>Withdraw liquidity</label>
                <input
                  value={liquidityForm.withdraw}
                  onChange={(event) => setLiquidityForm((prev) => ({ ...prev, withdraw: event.target.value }))}
                  type="number"
                  min="0"
                  step="0.000001"
                  placeholder="0"
                />
                <label>Destination (optional)</label>
                <input
                  value={liquidityForm.destination}
                  onChange={(event) => setLiquidityForm((prev) => ({ ...prev, destination: event.target.value }))}
                  placeholder={contractError ? '' : 'wallet address'}
                  type="text"
                />
                <button className="btn-primary" onClick={doWithdrawLiquidity} disabled={!signer || loading}>
                  Withdraw
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading compact">
          <div>
            <div className="panel-kicker"><ShieldCheck size={14} /> Active policies</div>
            <h2>My policy queue</h2>
          </div>
          <button className="icon-button" onClick={() => void loadProtocolState()} title="Reload policies"><RefreshCw size={12} /></button>
        </div>
        {policies.length === 0 ? (
          <div className="scope-note">No policies found for this wallet.</div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {policies.map(showPolicyCard)}
          </div>
        )}
      </div>

      {!signer ? null : (
        <div className="panel">
          <div className="panel-heading compact">
            <div>
              <div className="panel-kicker">
                {status === 'error' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                Live action status
              </div>
              <h2>{status ? status.replace('-', ' ') : 'Ready'}</h2>
            </div>
          </div>
          <div className="state-list">
            <div><span>Last action</span><strong>{actionTx ? short(actionTx, 12) : 'none'}</strong></div>
            <div><span>Reporter role</span><strong>{isReporter ? 'enabled' : 'disabled'}</strong></div>
          </div>
          {contractError && <div className="scope-note" style={{ marginTop: '10px' }}>{contractError}</div>}
        </div>
      )}
    </div>
  );
};

export default CommercialPilot;
