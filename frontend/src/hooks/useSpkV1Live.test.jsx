import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const providers = [];
const contractCalls = vi.fn();

vi.mock('ethers', () => {
  return {
    ethers: {
      JsonRpcProvider: vi.fn(function JsonRpcProvider() {
        const provider = { destroy: vi.fn() };
        providers.push(provider);
        return provider;
      }),
      Contract: vi.fn(function Contract() {
        contractCalls();
        return new Proxy({}, { get: () => () => Promise.resolve({}) });
      }),
      formatEther: (v) => String(v),
    },
  };
});

import { ethers } from 'ethers';
import useSpkV1Live from './useSpkV1Live';

const runtime = {
  contracts: { solar_punk_coin: '0x0000000000000000000000000000000000000001', currency_system: '0x0000000000000000000000000000000000000002' },
  deployer: '0x0000000000000000000000000000000000000003',
  counterparties: {},
};

describe('useSpkV1Live network behaviour', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    providers.length = 0;
    vi.mocked(ethers.JsonRpcProvider).mockClear();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('does nothing without a runtime', () => {
    renderHook(() => useSpkV1Live(null));
    vi.advanceTimersByTime(5000);
    expect(ethers.JsonRpcProvider).not.toHaveBeenCalled();
  });

  it('never contacts the endpoint when the page is left before the start delay', () => {
    const { unmount } = renderHook(() => useSpkV1Live(runtime));
    vi.advanceTimersByTime(100);
    unmount();
    vi.advanceTimersByTime(60_000);
    expect(ethers.JsonRpcProvider).not.toHaveBeenCalled();
  });

  it('creates one provider after the delay and destroys it when the page is left', () => {
    const { unmount } = renderHook(() => useSpkV1Live(runtime));
    vi.advanceTimersByTime(1000);
    expect(ethers.JsonRpcProvider).toHaveBeenCalledTimes(1);
    unmount();
    expect(providers[0].destroy).toHaveBeenCalledTimes(1);
    const callsAtExit = contractCalls.mock.calls.length;
    vi.advanceTimersByTime(120_000);
    expect(contractCalls.mock.calls.length).toBe(callsAtExit);
    expect(ethers.JsonRpcProvider).toHaveBeenCalledTimes(1);
  });
});
