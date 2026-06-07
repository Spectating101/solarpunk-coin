import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import SPK_ABI from '../abi/SolarPunkCoin.json';
import CURRENCY_ABI from '../abi/SolarPunkCurrencySystem.json';
import { SEPOLIA_RPC_URL } from '../constants/contracts';

const POLL_MS = 25_000;

export default function useSpkV1Live(runtime) {
  const [live, setLive] = useState({ status: 'idle', data: null, error: null });

  useEffect(() => {
    if (!runtime?.contracts?.solar_punk_coin) return undefined;

    let cancelled = false;
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const spkAddress = runtime.contracts.solar_punk_coin;
    const currencyAddress = runtime.contracts.currency_system;
    const deployer = runtime.deployer;

    async function load() {
      try {
        const spk = new ethers.Contract(spkAddress, SPK_ABI, provider);
        const currency = new ethers.Contract(currencyAddress, CURRENCY_ABI, provider);
        const [
          totalSupply,
          deployerBalance,
          cumulativeSurplus,
          issuanceMode,
          pegEnabled,
          kwhPerSpk,
          metrics,
        ] = await Promise.all([
          spk.totalSupply(),
          spk.balanceOf(deployer),
          spk.cumulativeSurplusKwh(),
          spk.issuanceMode(),
          spk.pegEnabled(),
          spk.kwhPerSpkWad(),
          currency.networkMetrics(),
        ]);

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
              deployerBalance: Number(ethers.formatEther(deployerBalance)),
              cumulativeSurplusKwh: Number(cumulativeSurplus),
              issuanceMode: Number(issuanceMode),
              pegEnabled,
              kwhPerSpk: ethers.formatEther(kwhPerSpk),
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

    load();
    const id = window.setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [runtime]);

  return live;
}
