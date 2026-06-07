import { describe, expect, it } from 'vitest';
import SPK_ABI from '../abi/SolarPunkCoin.json';
import CURRENCY_ABI from '../abi/SolarPunkCurrencySystem.json';

function hasFunction(abi, name) {
  return abi.some((entry) => entry.type === 'function' && entry.name === name);
}

describe('frontend ABIs include SPK v1 demo surface', () => {
  it('SolarPunkCoin exposes wallet + supply reads and approve', () => {
    for (const fn of ['balanceOf', 'totalSupply', 'approve', 'cumulativeSurplusKwh']) {
      expect(hasFunction(SPK_ABI, fn), `missing SPK ${fn}`).toBe(true);
    }
  });

  it('SolarPunkCurrencySystem exposes network payment + metrics', () => {
    for (const fn of ['settleNetworkPayment', 'networkMetrics']) {
      expect(hasFunction(CURRENCY_ABI, fn), `missing currency ${fn}`).toBe(true);
    }
  });
});
