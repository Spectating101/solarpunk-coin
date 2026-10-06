import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import SPK_ABI from '../abi/SolarPunkCoin.json';
import CURRENCY_ABI from '../abi/SolarPunkCurrencySystem.json';
import { SEPOLIA_RPC_URL } from '../constants/contracts';

const POLL_MS = 25_000;
// Wait briefly before the first read so a visitor passing through the page never contacts the RPC endpoint.
const START_DELAY_MS = 400;

export default function useSpkV1Live(runtime, account = null, refreshKey = 0) {
  const [live, setLive] = useState({ status: 'idle', data: null, error: null });

  useEffect(() => {
    if (!runtime?.contracts?.solar_punk_coin) return undefined;

    let cancelled = false;
    let provider = null;
    let pollId = null;
    const spkAddress = runtime.contracts.solar_punk_coin;
    const currencyAddress = runtime.contracts.currency_system;
    const deployer = runtime.deployer;

    async function load() {
      try {
        const spk = new ethers.Contract(spkAddress, SPK_ABI, provider);
        const currency = new ethers.Contract(currencyAddress, CURRENCY_ABI, provider);
        const walletAddress = account || deployer;
        const [
          totalSupply,
          walletBalance,
          cumulativeSurplus,
          metrics,
        ] = await Promise.all([
          spk.totalSupply(),
          spk.balanceOf(walletAddress),
          spk.cumulativeSurplusKwh(),
          currency.networkMetrics(),
        ]);

        // The page may have been left while the first wave of reads was in flight.
        if (cancelled) return;
        const counterparties = runtime.counterparties || {};
        const balances = {};
        await Promise.all(
          Object.entries(counterparties).map(async ([name, info]) => {
            balances[name] = Number(ethers.formatEther(await spk.balanceOf(info.address)));
          })
        );

        if (!cancelled) {
          setLive({
            status: 'ok',
            error: null,
            data: {
              totalSupply: Number(ethers.formatEther(totalSupply)),
              walletBalance: Number(ethers.formatEther(walletBalance)),
              cumulativeSurplusKwh: Number(cumulativeSurplus),
              metrics: {
                totalSettled: Number(ethers.formatEther(metrics.settledSpk)),
                totalRedeemed: Number(ethers.formatEther(metrics.redeemedSpk)),
                circulationShare: Number(metrics.circulationShareBps) / 100,
                redemptionShare: Number(metrics.redemptionShareBps) / 100,
                networkPaymentCount: Number(metrics.networkPaymentCount),
              },
              counterpartyBalances: balances,
              fetchedAt: new Date().toISOString(),
            },
          });
        }
      } catch (error) {
        if (!cancelled) setLive({ status: 'error', data: null, error });
      }
    }

    const startId = window.setTimeout(() => {
      if (cancelled) return;
      provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      load();
      pollId = window.setInterval(load, POLL_MS);
    }, START_DELAY_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(startId);
      if (pollId !== null) window.clearInterval(pollId);
      provider?.destroy();
    };
  }, [runtime, account, refreshKey]);

  return live;
}
